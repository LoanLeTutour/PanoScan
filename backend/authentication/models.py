from django.contrib.auth.models import AbstractUser
from django.db import models
from panoscan.models import Market

class User(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    name = models.CharField(max_length=100)
    postal_code = models.IntegerField()
    city = models.CharField(max_length=100)
    adress = models.CharField(max_length=500)
    country = models.CharField(max_length=30)
    price_per_month = models.IntegerField()
    market = models.ForeignKey(Market, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
