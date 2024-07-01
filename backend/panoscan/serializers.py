from rest_framework.serializers import ModelSerializer, SerializerMethodField

from panoscan.models import Market, Producer, ProductType, Structure, Collection, Decor, FinalProduct, StructuresForDecor, DecorsForCollection, PhotoTraining, PhotoUser


# Market serializers
class MarketDetailSerializer(ModelSerializer):
    class Meta:
        model = Market
        fields = ['id', 'name']

class MarketListSerializer(ModelSerializer):
    class Meta:
        model = Market
        fields = ['name']

# Producer serializers
class ProducerDetailSerializer(ModelSerializer):
    class Meta: 
        model = Producer
        fields = ['id', 'name']

class ProducerListSerializer(ModelSerializer):
    class Meta: 
        model = Producer
        fields = ['name']

# Structure serializers
class StructureDetailSerializer(ModelSerializer):
    producer = ProducerListSerializer()
    class Meta:
        model = Structure
        fields = ['id', 'name', 'code', 'producer']

class StructureListSerializer(ModelSerializer):
    producer = ProducerListSerializer()
    class Meta:
        model = Structure
        fields = ['code', 'producer']

# ProductType serializers
class ProductTypeDetailSerializer(ModelSerializer):
    producer = ProducerListSerializer()
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'producer', 'length_in_mm', 'width_in_mm', 'thickness_in_mm']

class ProductTypeListSerializer(ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['name', 'length_in_mm', 'width_in_mm', 'thickness_in_mm']

# Decor serializers
class DecorDetailSerializer(ModelSerializer):
    producer = ProducerListSerializer()
    class Meta:
        model = Decor
        fields = ['id','code', 'image', 'producer']

class DecorListSerializer(ModelSerializer):
    class Meta:
        model = Decor
        fields = ['code']

# Collection serializers
class CollectionDetailSerializer(ModelSerializer):
    producer = ProducerListSerializer()
    market = MarketListSerializer()
    decors = SerializerMethodField()
    class Meta:
        model = Collection
        fields = ['id', 'name', 'producer', 'market', 'decors']
    
    def get_decors(self, instance):
        queryset = instance.decors.filter(active=True)
        serializer = DecorListSerializer(queryset, many=True)
        return serializer.data
    
class CollectionListSerializer(ModelSerializer):
    producer = ProducerListSerializer()
    market = MarketListSerializer()
    class Meta:
        model = Collection
        fields = ['name', 'producer', 'market']

# DecorsCollection serializers
class DecorsForCollectionDetailSerializer(ModelSerializer):
    decor = DecorListSerializer()
    collection = CollectionListSerializer()
    structures = SerializerMethodField()
    class Meta:
        model = DecorsForCollection
        fields = ['id', 'decor','collection', 'structures']
    def get_structures(self, instance):
        queryset = instance.structures.filter(active=True)
        serializer = StructureListSerializer(queryset, many=True)
        return serializer.data
class DecorsForCollectionListSerializer(ModelSerializer):
    decor = DecorListSerializer()
    collection = CollectionListSerializer()
    class Meta:
        model = DecorsForCollection
        fields = ['decor','collection']

class StructuresForDecorSerializer(ModelSerializer):
    product_type = SerializerMethodField()
    decor_collection = DecorsForCollectionListSerializer()
    structure = StructureListSerializer()
    class Meta:
        model = StructuresForDecor
        fields = ['id', 'decor_collection', 'structure', 'product_type']
    def get_product_type(self, instance):
        queryset = instance.product_type.filter(active=True)
        serializer = ProductTypeListSerializer(queryset, many=True)
        return serializer.data

class FinalProductSerializer(ModelSerializer):
    class Meta:
        model = FinalProduct
        fields = ['id', 'decor_collection_structure', 'product_type']
