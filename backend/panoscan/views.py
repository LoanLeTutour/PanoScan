from rest_framework.viewsets import ReadOnlyModelViewSet

from panoscan.models import Market, Producer, ProductType, Structure, Collection, Decor, FinalProduct, StructuresForDecor, DecorsForCollection, PhotoTraining, PhotoUser
from panoscan.serializers import MarketListSerializer, MarketDetailSerializer
from panoscan.serializers import ProducerListSerializer,ProducerDetailSerializer
from panoscan.serializers import ProductTypeListSerializer,ProductTypeDetailSerializer
from panoscan.serializers import StructureListSerializer, StructureDetailSerializer
from panoscan.serializers import CollectionListSerializer, CollectionDetailSerializer
from panoscan.serializers import DecorListSerializer, DecorDetailSerializer
from panoscan.serializers import FinalProductSerializer
from panoscan.serializers import StructuresForDecorSerializer
from panoscan.serializers import DecorsForCollectionListSerializer, DecorsForCollectionDetailSerializer


from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def home(request):
    return render(request, 'panoscan/home.html')

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

class ProducerViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = ProducerListSerializer
    detail_serializer_class = ProducerDetailSerializer
    def get_queryset(self):
        return Producer.objects.filter(active=True)


class ProductTypeViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = ProductTypeListSerializer
    detail_serializer_class = ProductTypeDetailSerializer
    def get_queryset(self):
        queryset = ProductType.objects.all()
        producer_id = self.request.GET.get('producer_id')
        if producer_id:
            queryset = queryset.filter(producer_id=producer_id)
        return queryset

class StructureViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = StructureListSerializer
    detail_serializer_class = StructureDetailSerializer
    def get_queryset(self):
        queryset = Structure.objects.all()
        producer_id = self.request.GET.get('producer_id')
        if producer_id:
            queryset = queryset.filter(producer_id=producer_id)
        return queryset

class CollectionViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = CollectionListSerializer
    detail_serializer_class = CollectionDetailSerializer
    def get_queryset(self):
        queryset = Collection.objects.all()
        producer_id = self.request.GET.get('producer_id')
        market_id = self.request.GET.get('market_id')
        if producer_id:
            queryset = queryset.filter(producer_id=producer_id)
        if market_id:
            queryset = queryset.filter(market_id=market_id)
        return queryset

class FinalProductViewset(ReadOnlyModelViewSet):
    serializer_class = FinalProductSerializer
    def get_queryset(self):
        return FinalProduct.objects.all()

class StructuresForDecorViewset(ReadOnlyModelViewSet):
    serializer_class = StructuresForDecorSerializer
    def get_queryset(self):
        queryset = StructuresForDecor.objects.all()
        decor_id = self.request.GET.get('decor_id')
        structure_id = self.request.GET.get('structure_id')
        if decor_id:
            queryset = queryset.filter(decor_id=decor_id)
        if structure_id:
            queryset = queryset.filter(structure_id=structure_id)
        return queryset

class DecorsForCollectionViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = DecorsForCollectionListSerializer
    detail_serializer_class = DecorsForCollectionDetailSerializer
    def get_queryset(self):
        queryset = DecorsForCollection.objects.all()
        decor_id = self.request.GET.get('decor_id')
        collection_id = self.request.GET.get('collection_id')
        if decor_id:
            queryset = queryset.filter(decor_id=decor_id)
        if collection_id:
            queryset = queryset.filter(collection_id=collection_id)
        return queryset


 
class DecorViewset(MultipleSerializerMixin, ReadOnlyModelViewSet):
    serializer_class = DecorListSerializer
    detail_serializer_class = DecorDetailSerializer
    def get_queryset(self):
        queryset = Decor.objects.all()
        producer_id = self.request.GET.get('producer_id')
        if producer_id:
            queryset = queryset.filter(producer_id=producer_id)
        return queryset


    

