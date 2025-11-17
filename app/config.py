import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///elib.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    COVERS_UPLOAD_FOLDER = os.path.join(BASE_DIR, 'app', 'static', 'uploads', 'covers')
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB
