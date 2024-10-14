import os
import pickle
from googleapiclient.discovery import build
from django.core.management.base import BaseCommand, CommandError
from google.oauth2 import service_account
from panoscan.models import Producer

SCOPES = ['https://www.googleapis.com/auth/drive']
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'utils', 'credentials.json')
credentials = service_account.Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE, scopes=SCOPES)

def authenticate_google_drive():
    service = build('drive', 'v3', credentials=credentials)
    return service

def create_folder(service, name, parent_id=None):
    file_metadata = {
        'name': name,
        'mimeType': 'application/vnd.google-apps.folder',
    }
    if parent_id:
        file_metadata['parents'] = [parent_id]
    file = service.files().create(body=file_metadata, fields='id').execute()
    return file.get('id')

def list_files_in_folder(service, folder_id):
    try:
        results = service.files().list(q=f"'{folder_id}' in parents",
                                       spaces='drive',
                                       fields='files(id, name)').execute()
        items = results.get('files', [])
        if not items:
            print('No files found.')
        else:
            print('Files:')
            for item in items:
                print(f"{item['name']} ({item['id']})")
    except Exception as e:
        print(f"Error listing files: {e}")

class Command(BaseCommand):
    help = 'Create folders in Google Drive for active Producers and Decors'

    def handle(self, *args, **kwargs):
        try:
            service = authenticate_google_drive()

            # ID du dossier Photos Training sur Google Drive
            photos_training_folder_id = '1JinAKr_YIl4HA6AkwSzdkSS5CLJ7ng1O'

            list_files_in_folder(service, photos_training_folder_id)
            
            # Exemple de structure de données pour les producteurs et décors
            producers = []
            for producer in Producer.objects.filter(active=True):
                producer_decors = producer.decors.filter(active=True)
                decors_list = [decor.code for decor in producer_decors]
                producers.append({
                    'name': producer.name,
                    'decors': decors_list
                })
            for producer in producers:
                producer_folder_id = create_folder(service, producer['name'], photos_training_folder_id)
                for decor in producer['decors']:
                    create_folder(service, decor, producer_folder_id)
            
            self.stdout.write(self.style.SUCCESS('Dossiers créés avec succès.'))
        
        except Exception as e:
            raise CommandError('Error creating folders: %s' % str(e))