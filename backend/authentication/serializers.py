from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import User


class UserSerializer(ModelSerializer):
    photos_user = SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'email', 'photos_user']  # Ajoutez d'autres champs au besoin
        read_only_fields = ['id', 'email', 'photos_user']