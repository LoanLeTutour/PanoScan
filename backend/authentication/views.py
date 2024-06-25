from django.contrib.auth import logout 
from . import forms
from django.shortcuts import render, redirect


def logout_user(request):
    logout(request)
    return redirect('login')