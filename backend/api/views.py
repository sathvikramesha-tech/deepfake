import os
import json
import cv2
import numpy as np
from pathlib import Path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserRegister
from django.contrib.auth.hashers import make_password, check_password
from tensorflow.keras.models import load_model

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "deepfake_model.h5"
_model = None

def get_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
        _model = load_model(str(MODEL_PATH))
    return _model

@csrf_exempt
def register(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # ✅ Hash password HERE (correct place)
        hashed_password = make_password(password)

        user = UserRegister(
            username=username,
            email=email,
            password=hashed_password
        )
        user.save()

        return JsonResponse({
            "message": "User Registered Successfully"
        })

    return JsonResponse({"error": "Invalid request"})
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            email = data.get("email")
            password = data.get("password")

            try:
                user = UserRegister.objects.get(email=email)
            except UserRegister.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

            if check_password(password, user.password):
                return JsonResponse({
                    "message": "Login Successful",
                    "username": user.username
                })
            else:
                return JsonResponse({"error": "Invalid password"}, status=401)

        except Exception as e:
            print("ERROR:", e)
            return JsonResponse({"error": "Server error"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def predict(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    if "file" not in request.FILES:
        return JsonResponse({"error": "No file uploaded"}, status=400)

    upload = request.FILES["file"]
    raw_data = upload.read()

    np_arr = np.frombuffer(raw_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if image is None:
        return JsonResponse({"error": "Unable to decode image"}, status=400)

    # Preprocess
    image = cv2.resize(image, (128, 128))
    image = image.astype(np.float32) / 255.0
    image = np.expand_dims(image, axis=0)

    try:
        model = get_model()
        raw_pred = model.predict(image)
        score = float(raw_pred[0][0])
        label = "fake" if score >= 0.5 else "real"
        confidence = score if score >= 0.5 else 1.0 - score

        return JsonResponse({
            "prediction": label,
            "confidence": round(confidence, 4),
            "score": round(score, 4)
        })
    except Exception as e:
        print("PREDICT ERROR", e)
        return JsonResponse({"error": "Inference failed"}, status=500)

def hello(request):
    return JsonResponse({"message": "Hello from Django backend"})