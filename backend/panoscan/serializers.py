from rest_framework.serializers import ModelSerializer

from panoscan.models import Decor

class DecorSerializer(ModelSerializer):
    class Meta:
        model = Decor
        fields = ['code', 'image', 'producer']
