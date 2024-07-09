from rest_framework.serializers import ModelSerializer
from .models import User

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']  # Ajoutez d'autres champs au besoin
        read_only_fields = ['id', 'email']