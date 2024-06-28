from django.db import models
from django.conf import settings
class Market(models.Model):
    name = models.CharField(max_length=30)
    def __str__(self) -> str:
        return self.name

class Producer(models.Model):
    name = models.CharField(max_length=30)
    def __str__(self) -> str:
        return self.name

class ProductType(models.Model):
    name = models.CharField(max_length=100)
    length_in_mm = models.IntegerField()
    width_in_mm = models.IntegerField()
    thickness_in_mm = models.FloatField()
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE)
    def __str__(self) -> str:
        return f'{self.name} - {self.producer} - {self.length_in_mm}x{self.width_in_mm}x{self.thickness_in_mm}' 

class Structure(models.Model):
    name = models.CharField(max_length=30)
    code = models.CharField(max_length=10)
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE)
    def __str__(self) -> str:
        return f'{self.code}-{self.producer}'
class Decor(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10)
    ncs_equivalent = models.CharField(max_length=15, null=True, blank=True)
    image = models.ImageField(verbose_name="Photo fabricant")
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    structure = models.ManyToManyField(Structure, through='StructuresForDecor')
    def __str__(self) -> str:
        return f'{self.code}-{self.producer}'
class Collection(models.Model):
    name = models.CharField(max_length=30)
    market = models.ForeignKey(Market, on_delete=models.CASCADE)
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE)
    decors = models.ManyToManyField(Decor, through='DecorsForCollection')
    def __str__(self) -> str:
        return f'{self.name}-{self.producer}-{self.market}'
class PhotoTraining(models.Model):
    photo = models.ImageField()
    decor = models.ForeignKey(Decor, on_delete=models.CASCADE)

class PhotoUser(models.Model):
    photo = models.ImageField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_tested = models.DateTimeField(auto_now_add=True)
    result = models.JSONField()

class DecorsForCollection(models.Model):
    decor = models.ForeignKey(Decor, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    def __str__(self) -> str:
        return f'{self.decor.code} - {self.collection.name}'
    class Meta:
        unique_together = ('decor', 'collection')


class StructuresForDecor(models.Model):
    decor = models.ForeignKey(Decor, on_delete=models.CASCADE)
    structure = models.ForeignKey(Structure, on_delete=models.CASCADE)
    panel_type = models.ManyToManyField(ProductType, through='FinalProduct')
    
    def __str__(self) -> str:
        return f'{self.decor.code} {self.structure.code}'
    class Meta:
        unique_together = ('decor', 'structure')
    

class FinalProduct(models.Model):
    decor_structure_combination = models.ForeignKey(StructuresForDecor, on_delete=models.CASCADE, default=1)
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE)
    def __str__(self) -> str:
        return f'{self.product_type.name}-{self.decor_structure_combination.decor.code}{self.decor_structure_combination.structure.code}-{self.product_type.thickness_in_mm}mm'
    class Meta:
        unique_together = ('decor_structure_combination', 'product_type')