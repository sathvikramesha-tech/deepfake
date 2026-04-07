from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', views.register),
    path('api/login/', views.login_user),
    path('api/predict/', views.predict),
]