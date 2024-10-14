from panoscan.models import Producer
from googleapiclient.http import MediaFileUpload
import mimetypes
from django.core.management.base import BaseCommand, CommandError
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

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
def create_file_and_get_url(service, name, file_path, parent_id=None):
    """Crée un fichier sur Google Drive et retourne son URL."""
    mime_type, _ = mimetypes.guess_type(file_path)
    file_metadata = {
        'name': name,
        'parents': [parent_id] if parent_id else []
    }
    media = MediaFileUpload(file_path, mimetype=mime_type)
    file = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink').execute()
    return file.get('webViewLink')

def update_decor_photo_url(decor, url):
    """Met à jour l'URL de la photo du décor dans la base de données."""
    decor.photo_url = f"https://drive.google.com/uc?id={url}"
    print('Enregistré en tant que photo_url:', decor.photo_url)
    decor.save()

def get_file_id(service, file_name, parent_id):
    """Vérifie si un fichier existe déjà dans un dossier et retourne son ID."""
    query = f"name='{file_name}' and '{parent_id}' in parents"
    results = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
    items = results.get('files', [])
    if not items:
        return None
    else:
        return items[0]['id']
    
def search_file(service, file_name, parent_id=None):
    """Recherche un fichier par son nom dans un dossier spécifique ou dans tout le Drive."""
    query = f"name='{file_name}'"
    if parent_id:
        query += f" and '{parent_id}' in parents"
    results = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
    items = results.get('files', [])
    return items[0] if items else None

class Command(BaseCommand):
    help = 'Create folders in Google Drive for active Producers and Decors and update photo URLs'

    def handle(self, *args, **kwargs):
        try:
            service = authenticate_google_drive()

            # ID du dossier Photos Fabricant sur Google Drive
            photos_producers_folder_id = '1yUtqzI3ntI16cKm5pUeOY5qQMGHnvL26'
            
            # Récupération des producteurs actifs et leurs décors
            for producer in Producer.objects.filter(active=True):
                print('Accès au fabricant:', producer.name)
                # Vérifier si le dossier du producteur existe
                producer_folder_id = get_folder_id(service, producer.name, photos_producers_folder_id)
                if not producer_folder_id:
                    print('Fabricant pas trouvé dans le Drive :', producer.name)
                else:
                    print('Le dossier de ce fabricant est dans le Drive!')
                    for decor in producer.decors.filter(active=True):
                        print('Accès au décor:', decor.code)
                        # Vérifier si le fichier existe déjà
                        file_id = get_file_id(service, decor.code, producer_folder_id)
                    
                        if file_id:
                            print('La photo de ce décor est dans le Drive!')
                            # Récupérer l'URL du fichier existant
                            drive_url = search_file(service, decor.code, producer_folder_id)
                            print("L'id de la photo est le suivant:", drive_url)
                            # Mettre à jour le champ photo_url dans la BDD
                            update_decor_photo_url(decor, drive_url['id'])
                        else:
                            print('Décor pas trouvé dans le Drive :', decor.code)


            self.stdout.write(self.style.SUCCESS('Dossiers et URLs de photos créés/mis à jour avec succès.'))
        
        except Exception as e:
            raise CommandError('Error creating folders or updating URLs: %s' % str(e))