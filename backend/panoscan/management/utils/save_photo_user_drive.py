# utils.py

import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from django.conf import settings


SCOPES = ['https://www.googleapis.com/auth/drive']
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'utils', 'credentials.json')
credentials = service_account.Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE, scopes=SCOPES)

def authenticate_google_drive():
    service = build('drive', 'v3', credentials=credentials)
    return service

# ID du dossier Google Drive où les fichiers seront stockés
DRIVE_FOLDER_ID = '1KBZHEHNCEJaZ9VzlrcSYJeDh_iGwNlDm'

def save_photo_user_drive(file_path, filename, mime_type):
    try:

        service = authenticate_google_drive()
    except Exception as e:
        print(f"Erreur lors de la création du service Google Drive: {e}")
        raise
    
    try:
        file_metadata = {
            'name': filename,
            'parents': [DRIVE_FOLDER_ID]
        }
        media = MediaFileUpload(file_path, mimetype=mime_type)

        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, webViewLink'
        ).execute()
    except Exception as e:
        print(f"Erreur lors de la création du fichier sur Google Drive: {e}")
        raise
    try:
    # Rendre le fichier accessible via un lien
        service.permissions().create(
            fileId=file.get('id'),
            body={'role': 'reader', 'type': 'anyone'},
        ).execute()
    except Exception as e:
        print(f"Erreur lors de la création des permissions sur Google Drive: {e}")
        raise

    return file.get('webViewLink')
