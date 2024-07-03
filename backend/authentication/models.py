from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models, transaction
from panoscan.models import Market

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)
class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = None
    name = models.CharField(max_length=100)
    postal_code = models.IntegerField(null=True, default=0)
    city = models.CharField(max_length=100,null=True, default='')
    adress = models.CharField(max_length=500,null=True, default='')
    country = models.CharField(max_length=30,null=True, default='')
    price_per_month = models.IntegerField(default=0)
    market = models.ForeignKey(Market,null=True, on_delete=models.SET_NULL, related_name='users')
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.photos_user.update(active=False)

