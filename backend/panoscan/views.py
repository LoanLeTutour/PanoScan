from rest_framework import viewsets

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
@login_required
def home(request):
    return render(request, 'panoscan/home.html')