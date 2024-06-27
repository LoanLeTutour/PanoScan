from rest_framework.viewsets import ReadOnlyModelViewSet

from panoscan.models import Decor
from panoscan.serializers import DecorSerializer

from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def home(request):
    return render(request, 'panoscan/home.html')

 

 
class DecorViewset(ReadOnlyModelViewSet):
    serializer_class = DecorSerializer
    def get_queryset(self):
        return Decor.objects.filter(active=True)
    
    

