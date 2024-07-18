import os
import numpy as np
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
#from tensorflow.keras.preprocessing.image import ImageDataGenerator
from panoscan.models import PhotoTraining, Decor, Producer, Market, Collection, DecorsForCollection
import tensorflow as tf

class Command(BaseCommand):
    help = 'Train the TensorFlow model using images from the database'
    def add_arguments(self, parser):
        parser.add_argument('producer_name', type=str, help='The name of the producer for which to train the model')
        parser.add_argument('market_name', type=str, help='The name of the market for which to train the model')

    def handle(self, *args, **kwargs):
        producer_name = kwargs['producer_name']
        market_name = kwargs['market_name']
        
        try:
            producer = Producer.objects.get(name=producer_name)
        except Producer.DoesNotExist:
            raise CommandError(f'Producer "{producer_name}" does not exist')
        try:
            market = Market.objects.get(name=market_name)
        except Producer.DoesNotExist:
            raise CommandError(f'Market "{market_name}" does not exist')

        self.stdout.write(f'Training model for {producer.name} in {market.name} market')
        
        # Charger les décors pour le producteur actuel
        collections = Collection.objects.filter(producer=producer, market=market)
        decors_collections = []
        for collection in collections :
            decors_collections += DecorsForCollection.objects.filter(collection=collection)
        decors = Decor.objects.filter(decor_collections__in=decors_collections).distinct()
        decor_ids = decors.values_list('id', flat=True)
        
        # Charger les photos associées à ces décors
        photos = PhotoTraining.objects.filter(decor__in=decor_ids, active=True)
        if not photos.exists():
            self.stdout.write(self.style.WARNING(f'No active photos found for producer {producer.name} in {market.name} market'))
            return
        
        images = []
        labels = []
       # for photo in photos:
            #image_path = os.path.join(settings.MEDIA_ROOT, photo.photo.name)
            #image = preprocess_image(image_path)
            #images.append(image)
           # labels.append(photo.decor.code)  # Les labels de classification sont les codes des décors

        #images = np.vstack(images)
        #labels = np.array(labels)

        # Diviser les données en ensembles d'entraînement et de validation
        #datagen = ImageDataGenerator(validation_split=0.2)
        #train_generator = datagen.flow(images, labels, subset='training')
        #val_generator = datagen.flow(images, labels, subset='validation')

        # Charger le modèle TensorFlow
        #model_path = os.path.join(settings.BASE_DIR, f'swisskrono_classifier_{producer.name}.h5')
        #if os.path.exists(model_path):
            #model = tf.keras.models.load_model(model_path)
        #else:
            #model = tf.keras.models.Sequential([
                # Define your model architecture here
            #])

        # Entraîner le modèle
        #model.fit(train_generator, validation_data=val_generator, epochs=10)

        # Sauvegarder le modèle
        #model.save(model_path)
        #self.stdout.write(self.style.SUCCESS(f'Model for producer {producer.name} trained and saved successfully'))