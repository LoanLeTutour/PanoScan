from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from panoscan.models import PhotoTraining, Decor, Producer
import os
from django.core.files import File
from datetime import datetime
import io
from django.core.management.base import BaseCommand, CommandError
from PIL import Image
from django.utils.timezone import make_aware

# Chemin vers le fichier credentials.json
SCOPES = ['https://www.googleapis.com/auth/drive']
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'utils', 'credentials.json')

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

service = build('drive', 'v3', credentials=credentials)

class Command(BaseCommand):
    help = 'Import images from Google Drive and add them to the database'

    def handle(self, *args, **kwargs):
        base_folder = '1470Y8elBuoLVtF_LebqZ7vECcoL6orWQ'
        for producer_folder in os.listdir(base_folder):
            producer = Producer.objects.get(name=producer_folder)

        producer_path = os.path.join(base_folder, producer_folder)
        for decor_folder in os.listdir(producer_path):
            decor = Decor.objects.get(name=decor_folder, producer=producer)

            decor_path = os.path.join(producer_path, decor_folder)
            for filename in os.listdir(decor_path):
                if filename.endswith('.jpg') or filename.endswith('.png'):
                    photo_path = os.path.join(decor_path, filename)
                    photo = Image.open(photo_path)

                    # Création d'une instance de PhotoTraining
                    photo_instance = PhotoTraining()
                    photo_instance.producer = producer
                    photo_instance.decor = decor
                    photo_instance.active = True  # Peut être modifié selon vos besoins
                    photo_instance.uploaded_at = make_aware(datetime.now())

                    # Enregistrement de l'image
                    with open(photo_path, 'rb') as f:
                        photo_instance.photo.save(filename, File(f), save=True)

                    print(f"Photo {filename} ajoutée pour {producer.name} - {decor.name}")


