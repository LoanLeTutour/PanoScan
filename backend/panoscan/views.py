from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status

from .models import Market, Producer,FormatProduct, ProductType, Structure, Collection, Decor, FinalProduct, StructuresForDecor, DecorsForCollection, PhotoTraining, PhotoUser
from .serializers import MarketListSerializer, MarketDetailSerializer
from .serializers import ProducerListSerializer,ProducerDetailSerializer
from .serializers import FormatProductListSerializer, FormatProductDetailSerializer
from .serializers import ProductTypeListSerializer,ProductTypeDetailSerializer
from .serializers import StructureListSerializer, StructureDetailSerializer
from .serializers import CollectionListSerializer, CollectionDetailSerializer
from .serializers import DecorListSerializer, DecorDetailSerializer
from .serializers import FinalProductSerializer
from .serializers import StructuresForDecorDetailSerializer, StructuresForDecorListSerializer
from .serializers import DecorsForCollectionListSerializer, DecorsForCollectionDetailSerializer
from .serializers import PhotoUserSerializer

from .permissions import IsAdminAuthenticated, IsStaffAuthenticated, IsAuthenticated


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@login_required
def home(request):
    return render(request, 'panoscan/home.html')

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


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
    serializer_class = StructuresForDecorDetailSerializer
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
    serializer_class = StructuresForDecorDetailSerializer
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


import tempfile
from .management.utils.save_photo_user_drive import save_photo_user_drive
class PhotoUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("Headers: ", request.headers)
        data = {key: value for key, value in request.data.items() if key != 'photo' }
        market_id = data['market_id']
        data['user'] = request.user.id

        if 'photo' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        photo = request.FILES['photo']
        # Vérifiez que le fichier a un nom
        if not photo.name:
            return Response({'error': 'File must have a name'}, status=status.HTTP_400_BAD_REQUEST)
        with tempfile.NamedTemporaryFile(delete=True) as tmp:
            for chunk in photo.chunks():
                tmp.write(chunk)
            tmp.flush()
            try:
                photo_url = save_photo_user_drive(tmp.name, photo.name, photo.content_type)
            except Exception as e:
                print(f"Error uploading to Google Drive: {e}")
                return Response({'error': 'Failed to upload file to Google Drive'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        data['photo_url'] = photo_url
        # Rechercher le modèle : 
        import torch
        import torch.nn as nn
        from torchvision.transforms import v2
        from PIL import Image

        # Enregistrer temporairement l'image sur le disque pour l'inférence
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            for chunk in photo.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name


        test_transform = v2.Compose([
            v2.Resize(size=(64,64)),
            v2.ToImage(),
            v2.ToDtype(torch.float32, scale=True),
        ])


# Appliquer les transformations
        def preprocess_image(image_path):
            print(f"Preprocessing the photo...")
            img = Image.open(image_path).convert('RGB')
            img_transformed = test_transform(img)
    # Ajouter une dimension batch (car le modèle s'attend à une entrée de forme [batch_size, channels, height, width])
            img_transformed = img_transformed.unsqueeze(0)
            return img_transformed
        class Modèle_Argolite_12(nn.Module):
            def __init__(self, input_shape: int = 3,
               hidden_units: int = 64,
               output_shape: int = 12) -> None:
                super().__init__()
                self.conv_block_1 = nn.Sequential(
                    nn.Conv2d(in_channels=input_shape,
                  out_channels=hidden_units,
                  kernel_size=6,
                  stride=1,
                  padding=1),
                    nn.BatchNorm2d(hidden_units),
                    nn.ReLU(),
                    nn.Conv2d(in_channels=hidden_units,
                  out_channels=hidden_units*2,
                  kernel_size=6,
                  stride=1,
                  padding=1),
                    nn.BatchNorm2d(hidden_units*2),
                    nn.ReLU(),
                    nn.MaxPool2d(kernel_size=2,
                     stride=2)
                )
                self.conv_block_2 = nn.Sequential(
                    nn.Conv2d(in_channels=hidden_units*2,
                  out_channels=hidden_units*4,
                  kernel_size=6,
                  stride=1,
                  padding=1),
                    nn.BatchNorm2d(hidden_units*4),
                    nn.ReLU(),
                    nn.Conv2d(in_channels=hidden_units*4,
                  out_channels=hidden_units*4,
                  kernel_size=6,
                  stride=1,
                  padding=1),
                    nn.BatchNorm2d(hidden_units*4),
                    nn.ReLU(),
                    nn.MaxPool2d(kernel_size=2,
                     stride=2)
                )

                self.classifier = nn.Sequential(
                    nn.Flatten(),
                    nn.Linear(in_features=hidden_units*11*11*4,out_features=output_shape),
                    )

            def forward(self, x):
                return self.classifier(self.conv_block_2(self.conv_block_1(x)))
            
        def load_model(model_path):
                print(f"loading the model...")
            # Définir ou charger le modèle (ajuste cette partie avec ton propre modèle)
                model = Modèle_Argolite_12() 
                model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
                model.eval()  # Mettre le modèle en mode évaluation
                return model
            
        def predict(model, image_tensor):
                print(f"predicting")
                list_of_decors = ["216", "217", "246", "276", "281", "301", "302", "306", "330", "352", "377", "394"]
                with torch.inference_mode(): 
                    output = model(image_tensor)  # Passer l'image à travers le modèle
                    _, predicted_class = torch.max(output, 1)  # Obtenir la classe prédite
                return list_of_decors[predicted_class.item()]
        producer_name = "Argolite"
        producer_id = Producer.objects.get(name=producer_name).id
        argolite_model_path = "/Users/maelissbuaud/Loan/panoscan/backend/panoscan/management/utils/models/argolite_first_12_model_0.pth"
        argolite_dict = {'producer_name': producer_name, 'producer_id': producer_id, 'path': argolite_model_path}
        model_dicts = [argolite_dict]
        import os
        # preprocessing ...
        image_tensor = preprocess_image(tmp_path)
        os.remove(tmp_path)
        list_of_results = []
        for model_dict in model_dicts:
            try: 
                model = load_model(model_dict['path']) #Loading the model
                predicted_class = predict(model, image_tensor) #Predicting the class : output = 216 ou K 101
                decorObject = Decor.objects.get(code=predicted_class, active=True) # On récupère l'objet décor de la bdd correspondant à la prédiction
                print(decorObject)
                collections = Collection.objects.filter(market__id=market_id, active=True) # On récupère les différentes collections de décors présentes sur le marché du client
                print(collections)
                decor_collection_object = DecorsForCollection.objects.get(decor=decorObject, collection__in=collections) # On récupère l'objet DecorCollection correspondant à la prédiction
                print(decor_collection_object)
                result = {'producer_name': model_dict['producer_name'],
                          'producer_id': model_dict['producer_id'],
                            'decor_collection_id': decor_collection_object.id,
                            'photo_url': decor_collection_object.decor.photo_url, 
                            'collection_name': decor_collection_object.collection.name, 
                            'decor_code': decor_collection_object.decor.code,
                            'decor_name': decor_collection_object.decor.name}
                print(result)
                list_of_results.append(result)
                print(list_of_results)
            except Exception as e:
                print(f"Erreur lors de la prédiction : {e}")
                return Response({'error': f'Prediction failed on model {model_dict['path']}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = PhotoUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            serializer.save(result=list_of_results)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.response import Response
from rest_framework import status
from .models import PhotoUser
from .serializers import PhotoUserSerializer

class PhotoUserViewSet(ModelViewSet):
    @action(detail=True, methods=['get'])
    def photos(self, request, pk=None):
        queryset = PhotoUser.objects.filter(user__id=pk, active=True).order_by('-uploaded_at')
        serializer = PhotoUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @action(detail=True, methods=['get'])
    def producers(self, request, pk=None):
        market_id = request.query_params.get('market_id')
        if not market_id:
            return Response({'error': 'market_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        collectionsQueryset = Collection.objects.filter(market__id=market_id, active=True)
        producersQueryset = Producer.objects.filter(collections__in=collectionsQueryset).distinct()
        serializer = ProducerDetailSerializer(producersQueryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @action(detail=True, methods=['get'])
    def collections(self, request, pk=None):
        market_id = request.query_params.get('market_id')
        if not market_id:
            return Response({'error': 'market_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        producer_id = request.query_params.get('producer_id')
        if not producer_id:
            return Response({'error': 'producer_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = Collection.objects.filter(market__id=market_id, producer__id=producer_id, active=True)
        serializer = CollectionListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @action(detail=True, methods=['get'])
    def decors(self, request, pk=None):
        market_id = request.query_params.get('market_id')
        if not market_id:
            return Response({'error': 'market_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        producer_id = request.query_params.get('producer_id')
        if not producer_id:
            return Response({'error': 'producer_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        tempQueryset = Collection.objects.filter(market__id=market_id,producer__id=producer_id, active=True)
        temp2Queryset = DecorsForCollection.objects.filter(collection__in=tempQueryset).distinct()
        alternativeSerializer = DecorsForCollectionListSerializer(temp2Queryset, many=True)
        return Response(alternativeSerializer.data, status=status.HTTP_200_OK)
    @action(detail=True, methods=['get'])
    def structures(self, request, pk=None):
        collection_id = request.query_params.get('collection_id')
        if not collection_id:
            return Response({'error': 'collection_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        decor_id = request.query_params.get('decor_id')
        if not decor_id:
            return Response({'error': 'decor_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        decor_collection = DecorsForCollection.objects.filter(collection__in=collection_id, decor__id=decor_id)
        queryset = StructuresForDecor.objects.filter(decor_collection__in=decor_collection, active=True)
        serializer = StructuresForDecorListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @action(detail=True, methods=['get'])
    def product_types(self, request, pk=None):
        decor_collection_structure_id = request.query_params.get('structure_id')
        if not decor_collection_structure_id:
            return Response({'error': 'structure_decor_collection_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        final_products_queryset = FinalProduct.objects.filter(decor_collection_structure__id=decor_collection_structure_id)
        product_type_ids = final_products_queryset.values_list('product_type', flat=True).distinct()
        product_types = ProductType.objects.filter(id__in=product_type_ids).values('id', 'name', 'photo_url')
        queryset = list(product_types)
        return Response(queryset, status=status.HTTP_200_OK)
    @action(detail=True, methods=['get'])
    def final_products(self, request, pk=None):
        decor_collection_structure_id = request.query_params.get('structure_id')
        if not decor_collection_structure_id:
            return Response({'error': 'structure_decor_collection_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        product_type_id = request.query_params.get('product_type_id')
        if not product_type_id:
            return Response({'error': 'product_type_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        final_products_queryset = FinalProduct.objects.filter(decor_collection_structure__id=decor_collection_structure_id, product_type__id=product_type_id)
        print(f"final_products queryset : {final_products_queryset}")
        distinct_formats_ids = final_products_queryset.values_list('format', flat=True).distinct()
        print(f"Liste des ids des formats uniques : {distinct_formats_ids}")
        distinct_formats = FormatProduct.objects.filter(id__in=distinct_formats_ids).values('length_in_mm', 'width_in_mm')
        print(f"Queryset des formats uniques : {distinct_formats}")
        distinct_formats_list = list(distinct_formats)
        print(f"Liste des formats uniques : {distinct_formats_list}")
        distinct_thicknesses = list(final_products_queryset.values_list('thickness_in_mm', flat=True).distinct())
        print(f"Liste des épaisseurs uniques : {distinct_thicknesses}")
        serializer = FinalProductSerializer(final_products_queryset, many=True)
        return Response({'distinct_formats': distinct_formats_list,
                         'distinct_thicknesses': distinct_thicknesses,
                         'final_products': serializer.data},
                         status=status.HTTP_200_OK
                         )


class PhotoUserDeactivateView(APIView):
    def patch(self, request, id, format=None):
        try:
            photo_user = PhotoUser.objects.get(id=id)
            photo_user.active = False
            photo_user.save()
            return Response({'status': 'Photo désactivée avec succès'}, status=200)
        except PhotoUser.DoesNotExist:
            return Response({'error': 'Photo non trouvée'}, status=404)