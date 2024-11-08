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
from rest_framework_simplejwt.views import  TokenRefreshView, TokenVerifyView
from panoscan.views import CustomTokenObtainPairView
from django.contrib import admin
from django.urls import include, path
from django.contrib.auth.views import LoginView, LogoutView
import panoscan.views
from panoscan.views import PhotoUserViewSet, DecorViewset, MarketViewset,StructureViewset, ProducerViewset,FormatProductViewset, ProductTypeViewset, CollectionViewset, DecorsForCollectionViewset, StructuresForDecorViewset, FinalProductViewset
from panoscan.views import AdminDecorViewset, AdminMarketViewset, AdminStructureViewset, AdminProducerViewset,AdminFormatProductViewset, AdminProductTypeViewset, AdminCollectionViewset, AdminDecorsForCollectionViewset, AdminStructuresForDecorViewset, AdminFinalProductViewset
from rest_framework import routers
from panoscan.views import PhotoUploadView, PhotoUserDeactivateView

router = routers.SimpleRouter()
router.register('decor', DecorViewset, basename='decor')
router.register('market', MarketViewset, basename='market')
router.register('producer', ProducerViewset, basename='producer')
router.register('format_product', FormatProductViewset, basename='format_product')
router.register('structure', StructureViewset, basename='structure')
router.register('product_type', ProductTypeViewset, basename='product_type')
router.register('collection', CollectionViewset, basename='collection')
router.register('decors_per_collection', DecorsForCollectionViewset, basename='decors_per_collection')
router.register('structures_per_decor', StructuresForDecorViewset, basename='structures_per_decor')
router.register('final_product', FinalProductViewset, basename='final_product')
router.register(r'user', PhotoUserViewSet, basename='user')
router.register('admin/decor', AdminDecorViewset, basename='admin-decor')
router.register('admin/market', AdminMarketViewset, basename='admin-market')
router.register('admin/producer', AdminProducerViewset, basename='admin-producer')
router.register('admin/format_product', AdminFormatProductViewset, basename='admin-format_product')
router.register('admin/structure', AdminStructureViewset, basename='admin-structure')
router.register('admin/product_type', AdminProductTypeViewset, basename='admin-product_type')
router.register('admin/collection', AdminCollectionViewset, basename='admin-collection')
router.register('admin/decors_per_collection', AdminDecorsForCollectionViewset, basename='admin-decors_per_collection')
router.register('admin/structures_per_decor', AdminStructuresForDecorViewset, basename='admin-structures_per_decor')
router.register('admin/final_product', AdminFinalProductViewset, basename='admin-final_product')



from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', LoginView.as_view(template_name='authentication/login.html',redirect_authenticated_user=True),name='login'),
    path('home/', panoscan.views.home, name='home'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/', include(router.urls)),
    path('api/upload/', PhotoUploadView.as_view(), name='photo-upload'),
    path('api/photo_user/<int:id>/deactivate/', PhotoUserDeactivateView.as_view(), name='photo_user_deactivate'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

