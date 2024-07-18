from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.decorators import api_view

from .models import Market, Producer,FormatProduct, ProductType, Structure, Collection, Decor, FinalProduct, StructuresForDecor, DecorsForCollection, PhotoTraining, PhotoUser
from .serializers import MarketListSerializer, MarketDetailSerializer
from .serializers import ProducerListSerializer,ProducerDetailSerializer
from .serializers import FormatProductListSerializer, FormatProductDetailSerializer
from .serializers import ProductTypeListSerializer,ProductTypeDetailSerializer
from .serializers import StructureListSerializer, StructureDetailSerializer
from .serializers import CollectionListSerializer, CollectionDetailSerializer
from .serializers import DecorListSerializer, DecorDetailSerializer
from .serializers import FinalProductSerializer
from .serializers import StructuresForDecorSerializer
from .serializers import DecorsForCollectionListSerializer, DecorsForCollectionDetailSerializer
from .serializers import PhotoUserSerializer

from .permissions import IsAdminAuthenticated, IsStaffAuthenticated, IsAuthenticated


@login_required
def home(request):
    return render(request, 'panoscan/home.html')

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

class TokenView(APIView):
    def post(self, request, *args, **kwargs):
        print('Request Data:', request.data)  # Debug statement
        email = request.data.get('email')
        password = request.data.get('password')
        
        if email is None or password is None:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(email=email, password=password)
        if user is not None:
            # Generate and return token (example response)
            return Response({'token': 'your-token-here'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)

class MultipleSerializerMixin:
    detail_serializer_class = None
    def get_serializer_class(self):
        if self.action == 'retrieve' and self.detail_serializer_class is not None:
            # Si l'action demandée est le détail alors nous retournons le serializer de détail
            return self.detail_serializer_class
        return super().get_serializer_class()

class MarketViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = MarketListSerializer
    detail_serializer_class = MarketDetailSerializer
    def get_queryset(self):
        return Market.objects.filter(active=True)
    @action(detail=True, methods=['post'])
    def disable(self, request, pk):
        self.get_object().disable()
        return Response()

class AdminMarketViewset(MultipleSerializerMixin, ModelViewSet):
    serializer_class = MarketListSerializer
    detail_serializer_class = MarketDetailSerializer
    permission_classes = [IsAdminAuthenticated, IsStaffAuthenticated]
    queryset = Market.objects.all()
    
class ProducerViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = ProducerListSerializer
    detail_serializer_class = ProducerDetailSerializer
    def get_queryset(self):
        return Producer.objects.filter(active=True)
    @action(detail=True, methods=['post'])
    def disable(self, request, pk):
        self.get_object().disable()
        return Response()

class AdminProducerViewset(MultipleSerializerMixin, ModelViewSet):
    serializer_class = ProducerListSerializer
    detail_serializer_class = ProducerDetailSerializer
    permission_classes = [IsAdminAuthenticated, IsStaffAuthenticated]
    queryset = Producer.objects.all()


class FormatProductViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = FormatProductListSerializer
    detail_serializer_class = FormatProductDetailSerializer
    def get_queryset(self):
        return FormatProduct.objects.filter(active=True)
    @action(detail=True, methods=['post'])
    def disable(self, request, pk):
        self.get_object().disable()
        return Response()

class AdminFormatProductViewset(MultipleSerializerMixin, ModelViewSet):
    serializer_class = FormatProductListSerializer
    detail_serializer_class = FormatProductDetailSerializer
    permission_classes = [IsAdminAuthenticated, IsStaffAuthenticated]
    queryset = FormatProduct.objects.all()

class ProductTypeViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = ProductTypeListSerializer
    detail_serializer_class = ProductTypeDetailSerializer
    def get_queryset(self):
        queryset = ProductType.objects.filter(active=True)
        producer_id = self.request.GET.get('producer_id')
        if producer_id:
            queryset = queryset.filter(producer_id=producer_id)
        return queryset
    @action(detail=True, methods=['post'])
    def disable(self, request, pk):
        self.get_object().disable()
        return Response()

class AdminProductTypeViewset(MultipleSerializerMixin, ModelViewSet):
    serializer_class = ProductTypeListSerializer
    detail_serializer_class = ProductTypeDetailSerializer
    permission_classes = [IsAdminAuthenticated, IsStaffAuthenticated]
    queryset = ProductType.objects.all()
    
class StructureViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = StructureListSerializer
    detail_serializer_class = StructureDetailSerializer
    def get_queryset(self):
        queryset = Structure.objects.filter(active=True)
        producer_id = self.request.GET.get('producer_id')
        if producer_id:
            queryset = queryset.filter(producer_id=producer_id)
        return queryset
    @action(detail=True, methods=['post'])
    def disable(self, request, pk):
        self.get_object().disable()
        return Response()

class AdminStructureViewset(MultipleSerializerMixin, ModelViewSet):
    serializer_class = StructureListSerializer
    detail_serializer_class = StructureDetailSerializer
    permission_classes = [IsAdminAuthenticated, IsStaffAuthenticated]
    queryset = Structure.objects.all()
    
class CollectionViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = CollectionListSerializer
    detail_serializer_class = CollectionDetailSerializer
    def get_queryset(self):
        queryset = Collection.objects.filter(active=True)
        producer_id = self.request.GET.get('producer_id')
        market_id = self.request.GET.get('market_id')
        if producer_id:
            queryset = queryset.filter(producer_id=producer_id)
        if market_id:
            queryset = queryset.filter(market_id=market_id)
        return queryset
    @action(detail=True, methods=['post'])
    def disable(self, request, pk):
        self.get_object().disable()
        return Response()

class AdminCollectionViewset(MultipleSerializerMixin, ModelViewSet):
    serializer_class = CollectionListSerializer
    detail_serializer_class = CollectionDetailSerializer
    permission_classes = [IsAdminAuthenticated, IsStaffAuthenticated]
    queryset = Collection.objects.all()
    
class DecorViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = DecorListSerializer
    detail_serializer_class = DecorDetailSerializer
    def get_queryset(self):
        queryset = Decor.objects.filter(active=True)
        producer_id = self.request.GET.get('producer_id')
        if producer_id:
            queryset = queryset.filter(producer_id=producer_id)
        return queryset
    @action(detail=True, methods=['post'])
    def disable(self, request, pk):
        self.get_object().disable()
        return Response()

class AdminDecorViewset(MultipleSerializerMixin, ModelViewSet):
    serializer_class = DecorListSerializer
    detail_serializer_class = DecorDetailSerializer
    permission_classes = [IsAdminAuthenticated, IsStaffAuthenticated]
    queryset = Decor.objects.all()

class DecorsForCollectionViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = DecorsForCollectionListSerializer
    detail_serializer_class = DecorsForCollectionDetailSerializer
    def get_queryset(self):
        queryset = DecorsForCollection.objects.filter(active=True)
        decor_id = self.request.GET.get('decor_id')
        collection_id = self.request.GET.get('collection_id')
        if decor_id:
            queryset = queryset.filter(decor_id=decor_id)
        if collection_id:
            queryset = queryset.filter(collection_id=collection_id)
        return queryset
    @action(detail=True, methods=['post'])
    def disable(self, request, pk):
        self.get_object().disable()
        return Response()

class AdminDecorsForCollectionViewset(MultipleSerializerMixin, ModelViewSet):
    serializer_class = DecorsForCollectionListSerializer
    detail_serializer_class = DecorsForCollectionDetailSerializer
    permission_classes = [IsAdminAuthenticated, IsStaffAuthenticated]
    queryset = DecorsForCollection.objects.all()
class StructuresForDecorViewset(ReadOnlyModelViewSet):
    serializer_class = StructuresForDecorSerializer
    def get_queryset(self):
        queryset = StructuresForDecor.objects.filter(active=True)
        decor_id = self.request.GET.get('decor_id')
        structure_id = self.request.GET.get('structure_id')
        if decor_id:
            queryset = queryset.filter(decor_id=decor_id)
        if structure_id:
            queryset = queryset.filter(structure_id=structure_id)
        return queryset
    @action(detail=True, methods=['post'])
    def disable(self, request, pk):
        self.get_object().disable()
        return Response()

class AdminStructuresForDecorViewset(ModelViewSet):
    serializer_class = StructuresForDecorSerializer
    permission_classes = [IsAdminAuthenticated, IsStaffAuthenticated]
    queryset = StructuresForDecor.objects.all()
    
class FinalProductViewset(ReadOnlyModelViewSet):
    serializer_class = FinalProductSerializer
    def get_queryset(self):
        return FinalProduct.objects.filter(active=True)

class AdminFinalProductViewset(ModelViewSet):
    serializer_class = FinalProductSerializer
    permission_classes = [IsAdminAuthenticated, IsStaffAuthenticated]
    queryset = FinalProduct.objects.all()


## Ajout de photos pour l'entrainement du modèle

## Modèle Tensorflow


class PhotoUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("Headers: ", request.headers)
        data = request.data
        data['user'] = request.user.id
        if 'photo' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        photo = request.FILES['photo']
        # Vérifiez que le fichier a un nom
        if not photo.name:
            return Response({'error': 'File must have a name'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = PhotoUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PhotoUserViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PhotoUserSerializer
    def get_queryset(self):
        queryset = PhotoUserSerializer.objects.filter(active=True)
        user_id = self.request.user.id
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset