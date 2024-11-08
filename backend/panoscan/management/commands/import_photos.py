from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload
from panoscan.models import PhotoTraining, Decor, Producer
import os
from django.core.files import File
import io
from django.core.management.base import BaseCommand
from PIL import Image
import time
import cv2
import numpy as np
# Chemin vers le fichier credentials.json
SCOPES = ['https://www.googleapis.com/auth/drive']
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, 'utils', 'credentials.json')

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

service = build('drive', 'v3', credentials=credentials)

class Command(BaseCommand):
    help = 'Import images from a video in Google Drive, transform to multiplicate the images and add them to the database'

    def handle(self, *args, **kwargs):
        base_folder = '1470Y8elBuoLVtF_LebqZ7vECcoL6orWQ'
        destination_folder_id = '1pQVaMkupuZgw_H5msV2P78-8qFmr_XTy'
        temp_dir = '/tmp/google_drive_videos'

        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
        
        # Fonction pour télécharger un fichier de Google Drive
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
                    time.sleep(5)  # Attendre avant de réessayer

        
        # Lister les fichiers dans le dossier de base sur Google Drive
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
        
        def delete_file_from_drive(file_id):
            try:
                service.files().delete(fileId=file_id).execute()
                print(f"File {file_id} deleted from Google Drive.")
            except Exception as e:
                print(f"Error deleting file {file_id}: {e}")

        def process_image(image):
            image = image.resize((224, 224))
            return image
        def upload_file_to_drive(image_io, drive_folder_id, file_name):
            file_metadata = {
                'name': file_name,
                'parents': [drive_folder_id]
            }
            media = MediaFileUpload(image_io, mimetype='image/jpeg', resumable=True)
            file = service.files().create(body=file_metadata, media_body = media, fields='id').execute()
            print(f"File {file_name} uploaded to Google Drive with ID {file.get('id')}")
        
        producer_folders = list_drive_files(base_folder)
        for producer_folder in producer_folders:
            producer_folder_id = producer_folder['id']
            producer_name = producer_folder['name']
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
                    file_type = file['mimeType']
                    file_name = file['name']
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

                            # Convertir la frame en image PIL
                            frame_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

                            # Processus de l'image
                            processed_image = process_image(frame_image)

                            frame_filename = f"{os.path.splitext(video_filename)[0]}_frame_{frame_number:04d}_transformed_{idx}.png"
                            temp_frame_path = os.path.join(decor_local_path, frame_filename)
                            processed_image.save(temp_frame_path)

                            # Enregistrement de l'image dans la base de données
                            photo_instance = PhotoTraining()
                            photo_instance.producer = producer
                            photo_instance.decor = decor
                            photo_instance.active = True
                            upload_file_to_drive(temp_frame_path, destination_folder_id, frame_filename)

                            with open(temp_frame_path, 'rb') as f:
                                photo_instance.photo.save(frame_filename, File(f), save=True)

                            print(f"Photo {frame_filename} ajoutée pour {producer.name} - {decor.code}")
                            os.remove(temp_frame_path)
                            frame_number += 1
                        
                        cap.release()
                        print(f"Extraction des frames terminée pour {producer.name} - {decor.code}")

                        # Supprimer la vidéo locale après traitement
                        os.remove(video_local_path)

                        delete_file_from_drive(video_file_id)
                    elif file_type.startswith('image'):
                        image_file_id = file['id']
                        image_filename = file['name']
                        image_local_path = os.path.join(decor_local_path, image_filename)
                        print(f"Téléchargement de l'image {image_filename}...")
                        download_file_from_drive(image_file_id, image_local_path)
                        image = Image.open(image_local_path)
                        images_to_save = process_image(image)
                        for idx, img in enumerate(images_to_save):
                            transformed_filename = f"{os.path.splitext(image_filename)[0]}_transformed_{idx}.png"
                            temp_transformed_path = os.path.join(decor_local_path, transformed_filename)
                            img.save(temp_transformed_path)

                            photo_instance = PhotoTraining()
                            photo_instance.producer = producer
                            photo_instance.decor = decor
                            photo_instance.active = True
                    # Enregistrement de l'image
                            with open(temp_transformed_path, 'rb') as f:
                                photo_instance.photo.save(transformed_filename, File(f), save=True)

                            print(f"Photo {transformed_filename} ajoutée pour {producer.name} - {decor.code}")
                        os.remove(image_local_path)
                        delete_file_from_drive(image_file_id)
                    else:
                        print(f"Fichier ignoré: {file_name} (type: {file_type})")