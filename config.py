import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
APP_DIR = BASE_DIR / "elib"
STATIC_DIR = APP_DIR / "static"
_DEFAULT_COVERS = STATIC_DIR / "covers"


def _normalize_mysql_url(url: str | None) -> str | None:
    if not url:
        return None
    if url.startswith("mysql://"):
        return "mysql+mysqlconnector://" + url[len("mysql://"):]
    if url.startswith("mysql+mysqldb://"):
        return "mysql+mysqlconnector://" + url[len("mysql+mysqldb://"):]
    if url.startswith("mysql+pymysql://"):
        return "mysql+mysqlconnector://" + url[len("mysql+pymysql://"):]
    return url


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    ENV = os.getenv("FLASK_ENV", "production")

    _env_url = _normalize_mysql_url(os.getenv("DATABASE_URL"))

    if not _env_url:
        # Default to SQLite for development when no DATABASE_URL is provided
        BASE_DIR = Path(__file__).resolve().parent
        _env_url = f"sqlite:///{BASE_DIR / 'elib.db'}"
    else:
        # If DATABASE_URL is set, use MySQL as before
        pass  # _env_url is already set

    SQLALCHEMY_DATABASE_URI = _env_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    PAGE_SIZE = int(os.getenv("PAGE_SIZE", "10"))

    COVERS_DIR = os.getenv("COVERS_DIR", str(_DEFAULT_COVERS))
    STATIC_FOLDER = str(STATIC_DIR)

    ALLOWED_COVER_MIME = {"image/jpeg", "image/png", "image/webp"}
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024

    MARKDOWN_EXTENSIONS = ["extra", "sane_lists", "nl2br"]

    NH3_ALLOWED_TAGS = None
    NH3_ALLOWED_ATTRS = None
