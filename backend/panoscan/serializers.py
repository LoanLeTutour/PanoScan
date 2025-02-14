from rest_framework.serializers import ModelSerializer, SerializerMethodField, ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from panoscan.models import Market, Producer, ProductType,FormatProduct, Structure, Collection, Decor, FinalProduct, StructuresForDecor, DecorsForCollection, PhotoTraining, PhotoUser


# Envoyer l'userId au front end lors de la connexion

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Ajouter des informations supplémentaires au token
        token['user_id'] = user.id
        return token
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_id'] = self.user.id
        data['market_id'] = self.user.market.id
        return data

# Market serializers
class MarketDetailSerializer(ModelSerializer):
    class Meta:
        model = Market
        fields = ['id', 'name']

class MarketListSerializer(ModelSerializer):
    class Meta:
        model = Market
        fields = ['name']
    def validate_name(self, value):
        if Market.objects.filter(name=value).exists():
            raise ValidationError('This market already exists')
        return value

# Producer serializers
class ProducerDetailSerializer(ModelSerializer):
    class Meta: 
        model = Producer
        fields = ['id', 'name']

class ProducerListSerializer(ModelSerializer):
    class Meta: 
        model = Producer
        fields = ['name']
    def validate_name(self, value):
        if Producer.objects.filter(name=value).exists():
            raise ValidationError('This market already exists')
        return value

# Structure serializers
class StructureDetailSerializer(ModelSerializer):
    producer = ProducerListSerializer()
    class Meta:
        model = Structure
        fields = ['id', 'name', 'code', 'producer', 'photo_url']

class StructureListSerializer(ModelSerializer):
    producer = ProducerListSerializer()
    class Meta:
        model = Structure
        fields = ['id', 'code', 'producer']
# FormatProduct serializers

class FormatProductDetailSerializer(ModelSerializer):
    class Meta:
        model = FormatProduct
        fields = ['id', 'length_in_mm', 'width_in_mm']

class FormatProductListSerializer(ModelSerializer):
    class Meta:
        model = FormatProduct
        fields = ['length_in_mm', 'width_in_mm']

# ProductType serializers
class ProductTypeDetailSerializer(ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'photo_url']

class ProductTypeListSerializer(ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['name']

# Decor serializers
class DecorDetailSerializer(ModelSerializer):
    producer = ProducerListSerializer()
    class Meta:
        model = Decor
        fields = ['id','code','name', 'photo_url', 'producer']

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
        fields = ['id','name', 'producer', 'market']

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
    decor = DecorDetailSerializer()
    collection = CollectionListSerializer()
    class Meta:
        model = DecorsForCollection
        fields = ['id', 'decor','collection']

class StructuresForDecorDetailSerializer(ModelSerializer):
    product_types = SerializerMethodField()
    decor_collection = DecorsForCollectionListSerializer()
    structure = StructureDetailSerializer()
    class Meta:
        model = StructuresForDecor
        fields = ['id', 'decor_collection', 'structure', 'product_types']
    def get_product_types(self, instance):
        queryset = instance.product_types.filter(active=True)
        serializer = ProductTypeListSerializer(queryset, many=True)
        return serializer.data

class StructuresForDecorListSerializer(ModelSerializer):
    decor_collection = DecorsForCollectionListSerializer()
    structure = StructureDetailSerializer()
    class Meta:
        model = StructuresForDecor
        fields = ['id', 'decor_collection', 'structure']

class FinalProductSerializer(ModelSerializer):
    decor_collection_structure = StructuresForDecorListSerializer()
    product_type = ProductTypeDetailSerializer()
    format = FormatProductListSerializer()

    class Meta:
        model = FinalProduct
        fields = ['id', 'decor_collection_structure', 'product_type', 'format', 'thickness_in_mm']

class PhotoUserSerializer(ModelSerializer):
    class Meta:
        model = PhotoUser
        fields = ['id', 'photo_url', 'uploaded_at', 'user', 'result', 'active']
        read_only_fields = ['id', 'uploaded_at', 'result', 'active']
    def get_photo(self, obj):
        return obj.photo_url