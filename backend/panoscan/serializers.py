from rest_framework.serializers import ModelSerializer

from panoscan.models import Market, Producer, ProductType, Structure, Collection, Decor, FinalProduct, StructuresForDecor, DecorsForCollection, PhotoTraining, PhotoUser

class MarketSerializer(ModelSerializer):
    class Meta:
        model = Market
        fields = ['id', 'name']

class ProducerSerializer(ModelSerializer):
    class Meta: 
        model = Producer
        fields = ['id', 'name']

class StructureSerializer(ModelSerializer):
    class Meta:
        model = Structure
        fields = ['id', 'name', 'code', 'producer']

class ProductTypeSerializer(ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'producer', 'length_in_mm', 'width_in_mm', 'thickness_in_mm']
class DecorSerializer(ModelSerializer):
    class Meta:
        model = Decor
        fields = ['id','code', 'image', 'producer']

class CollectionSerializer(ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id', 'name', 'producer', 'market']

class StructuresForDecorSerializer(ModelSerializer):
    class Meta:
        model = StructuresForDecor
        fields = ['id', 'decor', 'structure', 'panel_type']

class DecorsForCollectionSerializer(ModelSerializer):
    class Meta:
        model = DecorsForCollection
        fields = ['id', 'decor', 'collection']

class FinalProductSerializer(ModelSerializer):
    class Meta:
        model = FinalProduct
        fields = ['id', 'decor_structure_combination', 'panel_type']
