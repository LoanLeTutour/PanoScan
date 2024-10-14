import os
import pickle
from googleapiclient.discovery import build
from django.core.management.base import BaseCommand, CommandError
from google.oauth2 import service_account
from panoscan.models import Producer, Decor
import mimetypes
from googleapiclient.http import MediaFileUpload


SCOPES = ['https://www.googleapis.com/auth/drive']
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'utils', 'credentials.json')
credentials = service_account.Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE, scopes=SCOPES)

def authenticate_google_drive():
    service = build('drive', 'v3', credentials=credentials)
    return service

def get_folder_id(service, folder_name, parent_id):
    """Vérifie si un dossier existe déjà et retourne son ID."""
    query = f"name='{folder_name}' and '{parent_id}' in parents and mimeType='application/vnd.google-apps.folder'"
    results = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
    items = results.get('files', [])
    if not items:
        return None
    else:
        return items[0]['id']
    
def create_folder(service, name, parent_id=None):
    file_metadata = {
        'name': name,
        'mimeType': 'application/vnd.google-apps.folder',
    }
    if parent_id:
        file_metadata['parents'] = [parent_id]
    file = service.files().create(body=file_metadata, fields='id').execute()
    return file.get('id')

def get_file_id(service, file_name, parent_id):
    """Vérifie si un fichier existe déjà dans un dossier et retourne son ID."""
    query = f"name='{file_name}' and '{parent_id}' in parents"
    results = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
    items = results.get('files', [])
    if not items:
        return None
    else:
        return items[0]['id']
    
def create_file(service, name, file_path, parent_id=None):
    mime_type, _ = mimetypes.guess_type(file_path)
    file_metadata = {
        'name': name,
        'parents': [parent_id] if parent_id else []
    }
    media = MediaFileUpload(file_path, mimetype=mime_type)
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    return file.get('id')

def list_files_in_folder(service, folder_id):
    try:
        results = service.files().list(q=f"'{folder_id}' in parents",
                                       spaces='drive',
                                       fields='files(id, name)').execute()
        items = results.get('files', [])
        if not items:
            print('No files found.')
            return []
        else:
            array = []
            print('Files:')
            for item in items:
                array += item['name']
            return array
    except Exception as e:
        print(f"Error listing files: {e}")

class Command(BaseCommand):
    help = 'Create folders in Google Drive for active Producers and Decors'

    def handle(self, *args, **kwargs):
        try:
            service = authenticate_google_drive()

            # ID du dossier Photos Fabricant sur Google Drive
            photos_producers_folder_id = '1yUtqzI3ntI16cKm5pUeOY5qQMGHnvL26'
            
            # Exemple de structure de données pour les producteurs et décors
            producers = []
            for producer in Producer.objects.filter(active=True):
                producer_decors = producer.decors.filter(active=True)
                decors_list = [{'code': decor.code, 'image': decor.image} for decor in producer_decors]
                producers.append({
                    'name': producer.name,
                    'decors': decors_list
                })
            for producer in producers:
                producer_folder_id = get_folder_id(service, producer['name'], photos_producers_folder_id)

                if not producer_folder_id:
                    producer_folder_id = create_folder(service, producer['name'], photos_producers_folder_id)

                for decor in producer['decors']:
                    file_id = get_file_id(service, decor['code'], producer_folder_id)
                    if not file_id:
                        if producer['name'] == 'SwissKrono':
                            code_path = decor['code'].replace(' ', '')
                            try:
                                path_image = f'/Users/maelissbuaud/Loan/panoscan/backend/assets/images/decors_fabricants/SwissKrono/{code_path}.jpg'
                                create_file(service, decor['code'], path_image, producer_folder_id)
                            except:
                                path_image = f'/Users/maelissbuaud/Loan/panoscan/backend/assets/images/decors_fabricants/SwissKrono/{code_path}.png'
                                create_file(service, decor['code'], path_image, producer_folder_id)
                        if producer['name'] == 'Argolite':
                            try:
                                path_image = f'/Users/maelissbuaud/Loan/panoscan/backend/assets/images/decors_fabricants/Argolite/{decor['code']}.jpeg'
                                create_file(service, decor['code'], path_image, producer_folder_id)
                            except:
                                try:
                                    path_image = f'/Users/maelissbuaud/Loan/panoscan/backend/assets/images/decors_fabricants/Argolite/{decor['code']}.png'
                                    create_file(service, decor['code'], path_image, producer_folder_id)
                                except: 
                                    path_image = f'/Users/maelissbuaud/Loan/panoscan/backend/assets/images/decors_fabricants/Argolite/{decor['code']}.gif'
                                    create_file(service, decor['code'], path_image, producer_folder_id)
            
            self.stdout.write(self.style.SUCCESS('Dossiers créés avec succès.'))
        
        except Exception as e:
            raise CommandError('Error creating folders: %s' % str(e))