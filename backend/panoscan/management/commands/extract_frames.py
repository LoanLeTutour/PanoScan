import cv2
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
from panoscan.models import PhotoTraining, Decor, Producer
from django.core.management.base import BaseCommand
import io
import time

# Chemin vers le fichier credentials.json
SCOPES = ['https://www.googleapis.com/auth/drive']
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'utils', 'credentials.json')

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

service = build('drive', 'v3', credentials=credentials)

class Command(BaseCommand):
    help = "Extract frames from videos"

    def handle(self, *args, **kwargs):
        base_folder_id = '1JinAKr_YIl4HA6AkwSzdkSS5CLJ7ng1O'
        temp_dir = '/tmp/google_drive_videos'

        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
        
        def download_file_from_drive(file_id, file_path):
            request = service.files().get_media(fileId=file_id)
            fh = io.FileIO(file_path, 'wb')
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while not done:
                try:
                    status, done = downloader.next_chunk()
                    if status:
                        print(f"Download {int(status.progress() * 100)}%.")
                except Exception as e:
                    print(f"Error downloading file {file_id}: {e}")
                    time.sleep(5)

        def list_drive_files(folder_id):
            query = f"'{folder_id}' in parents and trashed=false"
            results = []
            page_token = None
            while True:
                response = service.files().list(q=query, pageToken=page_token).execute()
                items = response.get('files', [])
                results.extend(items)
                page_token = response.get('nextPageToken', None)
                if page_token is None:
                    break
            return results

        producer_folders = list_drive_files(base_folder_id)
        for producer_folder in producer_folders:
            producer_folder_id = producer_folder['id']
            producer_name = producer_folder['name']
            if producer_name != 'Argolite':
                continue
            print(f"Processing producer folder: {producer_name}")
            try:
                producer = Producer.objects.get(name=producer_name)
            except Producer.DoesNotExist:
                print(f"Producer '{producer_name}' does not exist.")
                continue

            producer_local_path = os.path.join(temp_dir, producer_name)
            if not os.path.exists(producer_local_path):
                os.makedirs(producer_local_path)
            print(f"Listing decor folders in producer folder: {producer_name}")
            decor_folders = list_drive_files(producer_folder_id)
            for decor_folder in decor_folders:
                decor_folder_id = decor_folder['id']
                decor_name = decor_folder['name']
                if decor_name != '301' and decor_name != '306' and decor_name != '377' and decor_name != '217':
                    continue
                print(f"Processing decor folder: {decor_name}")
                try:
                    decor = Decor.objects.get(code=decor_name, producer=producer)
                except Decor.DoesNotExist:
                    print(f"Decor '{decor_name}' does not exist for producer '{producer_name}'.")
                    continue

                decor_local_path = os.path.join(producer_local_path, decor_name)
                if not os.path.exists(decor_local_path):
                    os.makedirs(decor_local_path)
                print(f"Listing files in decor folder: {decor_name}")
                files = list_drive_files(decor_folder_id)
                for file in files:
                    print(f"File : {file}")
                    file_type = file['mimeType']
                    if file_type.startswith('video'):
                        video_file_id = file['id']
                        video_filename = file['name']
                        video_local_path = os.path.join(decor_local_path, video_filename)

                        print(f"Téléchargement de la vidéo {video_filename}...")
                        download_file_from_drive(video_file_id, video_local_path)
                        
                        # Lire la vidéo
                        cap = cv2.VideoCapture(video_local_path)
                        if not cap.isOpened():
                            print(f"Erreur : Impossible d'ouvrir la vidéo {video_filename}")
                            continue
                        
                        frame_number = 0
                        while True:
                            ret, frame = cap.read()
                            if not ret:
                                break

                            # Redimensionner la frame à 224x224
                            resized_frame = cv2.resize(frame, (224, 224))

                            # Enregistrer la frame redimensionnée
                            frame_filename = f'{video_file_id}_frame_{frame_number:04d}.png'
                            frame_path = os.path.join(decor_local_path, frame_filename)
                            cv2.imwrite(frame_path, resized_frame)

                            # Charger l'image sur Google Drive
                            file_metadata = {
                                'name': frame_filename,
                                'parents': [decor_folder_id]
                            }
                            media = MediaFileUpload(frame_path, mimetype='image/png')
                            try:
                                uploaded_file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
                                file_id = uploaded_file.get('id')
                                print(f"Uploaded frame {frame_path} with file ID {file_id}")
                            except Exception as e:
                                print(f"Error uploading frame {frame_path}: {e}")
                                uploaded_file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
                                file_id = uploaded_file.get('id')

                            # Construire l'URL publique de l'image sur Google Drive
                            photo_url = f"https://drive.google.com/uc?id={file_id}"

                            # Ajouter l'entrée dans la base de données
                            PhotoTraining.objects.create(
                                photo_url=photo_url,
                                decor=decor,
                                producer=producer,
                                active=True
                            )
                            print('Element ajouté à la base de données: ', PhotoTraining.objects.get(photo_url=photo_url))
                            
                            frame_number += 1

                        cap.release()
                        print(f"Extraction des frames terminée pour {producer.name} - {decor.code}")

                        # Supprimer la vidéo locale après traitement
                        os.remove(video_local_path)
