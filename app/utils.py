import hashlib
import os
from werkzeug.utils import secure_filename
from flask import current_app
from .extensions import db
from .models import Cover, Book



def compute_md5(file_stream):
    md5 = hashlib.md5()
    file_stream.seek(0)
    for chunk in iter(lambda: file_stream.read(4096), b""):
        md5.update(chunk)
    file_stream.seek(0)
    return md5.hexdigest()



def save_cover(file_storage):
    md5_hash = compute_md5(file_storage.stream)
    existing = Cover.query.filter_by(md5_hash=md5_hash).first()
    if existing:
        return existing

    new_cover = Cover(filename='', mime_type=file_storage.mimetype, md5_hash=md5_hash)
    db.session.add(new_cover)
    db.session.flush()

    ext = os.path.splitext(secure_filename(file_storage.filename))[1]
    stored_name = f"{new_cover.id}{ext}"
    upload_folder = current_app.config['COVERS_UPLOAD_FOLDER']
    os.makedirs(upload_folder, exist_ok=True)
    path = os.path.join(upload_folder, stored_name)
    file_storage.save(path)

    new_cover.filename = stored_name
    db.session.commit()
    return new_cover



def remove_cover_if_unused(cover):
    # проверить, использует ли какая-либо книга эту обложку
    from .models import Book
    still = Book.query.filter_by(cover_id=cover.id).first()
    if still:
        return
    # удалить файл
    path = os.path.join(current_app.config['COVERS_UPLOAD_FOLDER'], cover.filename)
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        current_app.logger.exception('Failed to remove cover file')
    try:
        db.session.delete(cover)
        db.session.commit()
    except Exception:
        db.session.rollback()
        current_app.logger.exception('Failed to remove cover row')
