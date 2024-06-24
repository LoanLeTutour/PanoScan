from django.db import models
from django.conf import settings
class Market(models.Model):
    name = models.CharField(max_length=30)

class Producer(models.Model):
    name = models.CharField(max_length=30)

class PanelType(models.Model):
    name = models.CharField(max_length=100)
    length_in_mm = models.IntegerField()
    width_in_mm = models.IntegerField()
    thickness_in_mm = models.IntegerField()
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE)

class Structure(models.Model):
    name = models.CharField(max_length=30)
    code = models.CharField(max_length=10)
class Decor(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10)
    image = models.ImageField(verbose_name="Photo fabricant")
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    panel_type = models.ManyToManyField(PanelType, through='PanelTypesForDecor')
    structure = models.ManyToManyField(Structure, through='StructuresForDecor')
    
class Collection(models.Model):
    name = models.CharField(max_length=30)
    market = models.ForeignKey(Market, on_delete=models.CASCADE)
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE)
    decors = models.ManyToManyField(Decor, through='CollectionOfDecors')
class PhotoTraining(models.Model):
    photo = models.ImageField()
    decor = models.ForeignKey(Decor, on_delete=models.CASCADE)

class PhotoUser(models.Model):
    photo = models.ImageField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_tested = models.DateTimeField(auto_now_add=True)
    result = models.JSONField()

class CollectionOfDecors(models.Model):
    decor = models.ForeignKey(Decor, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('decor', 'collection')


class PanelTypesForDecor(models.Model):
    decor = models.ForeignKey(Decor, on_delete=models.CASCADE)
    panel_type = models.ForeignKey(PanelType, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('decor', 'panel_type')

class StructuresForDecor(models.Model):
    decor = models.ForeignKey(Decor, on_delete=models.CASCADE)
    structure = models.ForeignKey(Structure, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('decor', 'structure')