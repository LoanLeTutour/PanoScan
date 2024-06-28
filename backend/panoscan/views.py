from rest_framework.viewsets import ReadOnlyModelViewSet

from panoscan.models import Market, Producer, ProductType, Structure, Collection, Decor, FinalProduct, StructuresForDecor, DecorsForCollection, PhotoTraining, PhotoUser
from panoscan.serializers import MarketSerializer, ProducerSerializer, ProductTypeSerializer, StructureSerializer, CollectionSerializer, DecorSerializer, FinalProductSerializer, StructuresForDecorSerializer, DecorsForCollectionSerializer


from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def home(request):
    return render(request, 'panoscan/home.html')



class MarketViewset(ReadOnlyModelViewSet):
    serializer_class = MarketSerializer
    def get_queryset(self):
        return Market.objects.all()

class ProducerViewset(ReadOnlyModelViewSet):
    serializer_class = ProducerSerializer
    def get_queryset(self):
        return Producer.objects.all()

class ProductTypeViewset(ReadOnlyModelViewSet):
    serializer_class = ProductTypeSerializer
    def get_queryset(self):
        queryset = ProductType.objects.all()
        producer_id = self.request.GET.get('producer_id')
        if producer_id:
            queryset = queryset.filter(producer_id=producer_id)
        return queryset

class StructureViewset(ReadOnlyModelViewSet):
    serializer_class = StructureSerializer
    def get_queryset(self):
        queryset = Structure.objects.all()
        producer_id = self.request.GET.get('producer_id')
        if producer_id:
            queryset = queryset.filter(producer_id=producer_id)
        return queryset

class CollectionViewset(ReadOnlyModelViewSet):
    serializer_class = CollectionSerializer
    def get_queryset(self):
        return Collection.objects.all()

class FinalProductViewset(ReadOnlyModelViewSet):
    serializer_class = FinalProductSerializer
    def get_queryset(self):
        return FinalProduct.objects.all()

class StructuresForDecorViewset(ReadOnlyModelViewSet):
    serializer_class = StructuresForDecorSerializer
    def get_queryset(self):
        return StructuresForDecor.objects.all()

class DecorsForCollectionViewset(ReadOnlyModelViewSet):
    serializer_class = DecorsForCollectionSerializer
    def get_queryset(self):
        return DecorsForCollection.objects.all()


 
class DecorViewset(ReadOnlyModelViewSet):
    serializer_class = DecorSerializer
    def get_queryset(self):
        return Decor.objects.all()


    

