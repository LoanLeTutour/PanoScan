from django.db import models, transaction
from django.conf import settings
class Market(models.Model):
    name = models.CharField(max_length=30)
    active = models.BooleanField(default=True)
    def __str__(self) -> str:
        return self.name
    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.collections.update(active=False)
        self.users.update(active=False)


class Producer(models.Model):
    name = models.CharField(max_length=30)
    active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name
    
    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.collections.update(active=False)
        self.product_types.update(active=False)
        self.structures.update(active=False)
        self.decors.update(active=False)

class FormatProduct(models.Model):
    length_in_mm = models.IntegerField()
    width_in_mm = models.IntegerField()
    active = models.BooleanField(default=True)
    def __str__(self) -> str:
        return f'{self.length_in_mm}x{self.width_in_mm}'
    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.product_types.update(active=False)
    
class ProductType(models.Model):
    name = models.CharField(max_length=100)
    active = models.BooleanField(default=True)
    format = models.ForeignKey(FormatProduct, on_delete=models.CASCADE, related_name='product_types', blank=True, null=True )
    thickness_in_mm = models.FloatField()
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE, related_name='product_types')
    
    def __str__(self) -> str:
        return f'{self.name} - {self.producer} - {self.format.length_in_mm}x{self.format.width_in_mm}x{self.thickness_in_mm}' 
    
    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.final_products.update(active=False)


class Structure(models.Model):
    name = models.CharField(max_length=30)
    code = models.CharField(max_length=10)
    active = models.BooleanField(default=True)
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE, related_name='structures')
    
    def __str__(self) -> str:
        return f'{self.code}-{self.producer}'
    
    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.decor_collection_structures.update(active=False)

class Decor(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10)
    ncs_equivalent = models.CharField(max_length=15, null=True, blank=True)
    image = models.ImageField(verbose_name="Photo fabricant")
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE, related_name='decors')
    active = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return f'{self.code}-{self.producer}'
    
    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.decor_collection.update(active=False)
        self.photos_training.update(active=False)

class Collection(models.Model):
    name = models.CharField(max_length=30)
    market = models.ForeignKey(Market, on_delete=models.CASCADE, related_name='collections')
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE, related_name='collections')
    decors = models.ManyToManyField(Decor, through='DecorsForCollection', related_name='collections')
    active = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return f'{self.name}-{self.producer}-{self.market}'
    
    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.decor_collection.update(active=False)

class PhotoTraining(models.Model):
    photo = models.ImageField()
    decor = models.ForeignKey(Decor, on_delete=models.CASCADE, related_name='photos_training')
    active = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    producer = models.ForeignKey(Producer, on_delete=models.CASCADE, related_name='photos_training', default=True, null=True)

from authentication.models import User
class PhotoUser(models.Model):
    photo = models.ImageField(upload_to='images/')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='photos_user')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    result = models.JSONField(blank=True, default=dict)
    active = models.BooleanField(default=True)
    def __str__(self):
        return f"Photo_id: {self.id}, User: {self.user.email}"

class DecorsForCollection(models.Model):
    decor = models.ForeignKey(Decor, on_delete=models.CASCADE, related_name='decor_collections')
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name='decor_collections')
    structures = models.ManyToManyField(Structure, through='StructuresForDecor', related_name='decor_collections')
    active = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return f'{self.decor.code}-{self.collection.name}-{self.collection.market.name}'
    class Meta:
        unique_together = ('decor', 'collection')
    
    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.decor_collection_structures.update(active=False)
    
class StructuresForDecor(models.Model):
    decor_collection = models.ForeignKey(DecorsForCollection, on_delete=models.CASCADE, related_name='decor_collection_structures')
    structure = models.ForeignKey(Structure, on_delete=models.CASCADE, related_name='decor_collection_structures')
    product_types = models.ManyToManyField(ProductType, through='FinalProduct', related_name='decor_collection_structures')
    active = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return f'{self.decor_collection.collection.name}-{self.decor_collection.decor.code} {self.structure.code}'
    class Meta:
        unique_together = ('decor_collection', 'structure')
    
    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.final_products.update(active=False)
    
    

class FinalProduct(models.Model):
    decor_collection_structure = models.ForeignKey(StructuresForDecor, on_delete=models.CASCADE, default=1, related_name='final_products')
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE, related_name='final_products')
    active = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return f'{self.product_type.name}-{self.decor_collection_structure.decor_collection.decor.code}{self.decor_collection_structure.structure.code}-{self.product_type.thickness_in_mm}mm'
    class Meta:
        unique_together = ('decor_collection_structure', 'product_type')