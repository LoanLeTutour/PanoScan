from django.contrib import admin
from panoscan.models import Market, Producer, ProductType, Structure, Collection, Decor, FinalProduct, StructuresForDecor, DecorsForCollection, PhotoTraining, PhotoUser


admin.site.register(Market)
admin.site.register(Producer)
admin.site.register(ProductType)
admin.site.register(Structure)
admin.site.register(Collection)
admin.site.register(Decor)
admin.site.register(FinalProduct)
admin.site.register(StructuresForDecor)
admin.site.register(DecorsForCollection)
admin.site.register(PhotoTraining)
admin.site.register(PhotoUser)
