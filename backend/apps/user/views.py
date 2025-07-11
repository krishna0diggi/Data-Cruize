from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def welcome_user(request):
    return JsonResponse({"message": "Welcome to User Module"})
