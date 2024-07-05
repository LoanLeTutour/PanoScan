"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin
from django.urls import include, path
from django.contrib.auth.views import LoginView, LogoutView
import panoscan.views
from panoscan.views import DecorViewset, MarketViewset,StructureViewset, ProducerViewset, ProductTypeViewset, CollectionViewset, DecorsForCollectionViewset, StructuresForDecorViewset, FinalProductViewset
from panoscan.views import AdminDecorViewset, AdminMarketViewset, AdminStructureViewset, AdminProducerViewset, AdminProductTypeViewset, AdminCollectionViewset, AdminDecorsForCollectionViewset, AdminStructuresForDecorViewset, AdminFinalProductViewset
from rest_framework import routers

router = routers.SimpleRouter()
router.register('decor', DecorViewset, basename='decor')
router.register('market', MarketViewset, basename='market')
router.register('producer', ProducerViewset, basename='producer')
router.register('structure', StructureViewset, basename='structure')
router.register('product_type', ProductTypeViewset, basename='product_type')
router.register('collection', CollectionViewset, basename='collection')
router.register('decors_per_collection', DecorsForCollectionViewset, basename='decors_per_collection')
router.register('structures_per_decor', StructuresForDecorViewset, basename='structures_per_decor')
router.register('final_product', FinalProductViewset, basename='final_product')
router.register('admin/decor', AdminDecorViewset, basename='admin-decor')
router.register('admin/market', AdminMarketViewset, basename='admin-market')
router.register('admin/producer', AdminProducerViewset, basename='admin-producer')
router.register('admin/structure', AdminStructureViewset, basename='admin-structure')
router.register('admin/product_type', AdminProductTypeViewset, basename='admin-product_type')
router.register('admin/collection', AdminCollectionViewset, basename='admin-collection')
router.register('admin/decors_per_collection', AdminDecorsForCollectionViewset, basename='admin-decors_per_collection')
router.register('admin/structures_per_decor', AdminStructuresForDecorViewset, basename='admin-structures_per_decor')
router.register('admin/final_product', AdminFinalProductViewset, basename='admin-final_product')


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
def token(request):
    if request.method == 'POST':
        # Parsez les données et ajoutez la logique d'authentification ici
        return JsonResponse({'token': 'your_generated_token'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', LoginView.as_view(template_name='authentication/login.html',redirect_authenticated_user=True),name='login'),
    path('home/', panoscan.views.home, name='home'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls))
]
