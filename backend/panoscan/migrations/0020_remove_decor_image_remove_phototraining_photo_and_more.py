# Generated by Django 5.0.6 on 2024-08-08 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('panoscan', '0019_alter_decor_image_alter_phototraining_photo_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='decor',
            name='image',
        ),
        migrations.RemoveField(
            model_name='phototraining',
            name='photo',
        ),
        migrations.RemoveField(
            model_name='photouser',
            name='photo',
        ),
        migrations.AddField(
            model_name='decor',
            name='photo_url',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='phototraining',
            name='photo_url',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='photouser',
            name='photo_url',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]