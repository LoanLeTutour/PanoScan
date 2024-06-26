from django.contrib import admin
from panoscan.models import Market, Producer, PanelType, Structure, Collection, Decor, PanelTypesForStructureDecorCombination, StructuresForDecor, DecorsForCollection, PhotoTraining, PhotoUser


admin.site.register(Market)
admin.site.register(Producer)
admin.site.register(PanelType)
admin.site.register(Structure)
admin.site.register(Collection)
admin.site.register(Decor)
admin.site.register(PanelTypesForStructureDecorCombination)
admin.site.register(StructuresForDecor)
admin.site.register(DecorsForCollection)
admin.site.register(PhotoTraining)
admin.site.register(PhotoUser)
