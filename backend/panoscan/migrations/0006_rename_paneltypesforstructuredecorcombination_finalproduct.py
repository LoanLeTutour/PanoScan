# Generated by Django 5.0.6 on 2024-06-28 06:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('panoscan', '0005_alter_decor_ncs_equivalent'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='PanelTypesForStructureDecorCombination',
            new_name='FinalProduct',
        ),
    ]