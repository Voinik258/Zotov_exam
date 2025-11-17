from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from flask_login import login_required, current_user
from .extensions import db
from .models import Book, Genre, Cover
from .utils import save_cover, remove_cover_if_unused

books_bp = Blueprint('books', __name__, url_prefix='/books')

def require_role(*allowed):
    def decorator(func):
        def wrapper(*args, **kwargs):
            if not current_user.is_authenticated:
                flash("Для выполнения данного действия необходимо пройти процедуру аутентификации", "warning")
                return redirect(url_for('auth.login'))
            if current_user.role.name.lower() not in [a.lower() for a in allowed]:
                flash("У вас недостаточно прав для выполнения данного действия", "danger")
                return redirect(url_for('main.index'))
            return func(*args, **kwargs)
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator

@books_bp.route('/create', methods=['GET','POST'])
@login_required
@require_role('Administrator')
def create_book():
    if request.method == 'POST':
        try:
            title = request.form['title']
            desc = request.form['short_description']
            year = int(request.form['year'])
            publisher = request.form['publisher']
            author = request.form['author']
            pages = int(request.form['pages'])
            genre_ids = request.form.getlist('genres')
            cover_file = request.files.get('cover')
            if not cover_file:
                flash('Не выбрана обложка', 'danger')
                return render_template('books/create.html', genres=Genre.query.all())
            cover = save_cover(cover_file)
            book = Book(title=title, short_description=desc, year=year,
                        publisher=publisher, author=author, pages=pages, cover_id=cover.id)
            for gid in genre_ids:
                g = Genre.query.get(int(gid))
                if g:
                    book.genres.append(g)
            db.session.add(book)
            db.session.commit()
            flash('Книга успешно добавлена', 'success')
            return redirect(url_for('books.view_book', book_id=book.id))
        except Exception:
            db.session.rollback()
            current_app.logger.exception('Error saving book')
            flash('При сохранении данных возникла ошибка. Проверьте корректность введённых данных.', 'danger')
            return render_template('books/create.html', genres=Genre.query.all(), form_data=request.form)
    return render_template('books/create.html', genres=Genre.query.all())

@books_bp.route('/<int:book_id>/edit', methods=['GET','POST'])
@login_required
@require_role('Administrator', 'Moderator')
def edit_book(book_id):
    book = Book.query.get_or_404(book_id)
    if request.method == 'POST':
        try:
            book.title = request.form['title']
            book.short_description = request.form['short_description']
            book.year = int(request.form['year'])
            book.publisher = request.form['publisher']
            book.author = request.form['author']
            book.pages = int(request.form['pages'])
            genre_ids = request.form.getlist('genres')
            book.genres = []
            for gid in genre_ids:
                g = Genre.query.get(int(gid))
                if g: book.genres.append(g)
            db.session.commit()
            flash('Книга успешно отредактирована', 'success')
            return redirect(url_for('books.view_book', book_id=book.id))
        except Exception:
            db.session.rollback()
            current_app.logger.exception('Error editing book')
            flash('При сохранении данных возникла ошибка. Проверьте корректность введённых данных.', 'danger')
    return render_template('books/edit.html', book=book, genres=Genre.query.all())

@books_bp.route('/<int:book_id>/delete', methods=['POST'])
@login_required
@require_role('Administrator')
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    cover = book.cover
    try:
        db.session.delete(book)
        db.session.commit()
        if cover:
            remove_cover_if_unused(cover)
        flash('Книга успешно удалена', 'success')
    except Exception:
        db.session.rollback()
        current_app.logger.exception('Error deleting book')
        flash('Ошибка при удалении книги', 'danger')
    return redirect(url_for('main.index'))

@books_bp.route('/<int:book_id>')
def view_book(book_id):
    from markdown import markdown
    import bleach
    from .models import Review

    book = Book.query.get_or_404(book_id)
    # безопасный markdown -> html
    ALLOWED_TAGS = list(bleach.sanitizer.ALLOWED_TAGS) + ['p','pre','code','blockquote','h1','h2','h3','h4','ul','ol','li','strong','em','a','img']
    ALLOWED_ATTRIBUTES = {'*': ['class'], 'a': ['href','title','rel'], 'img': ['src','alt','title']}
    html_desc = bleach.clean(markdown(book.short_description, extensions=['fenced_code','codehilite']), tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES, strip=True)

    reviews = Review.query.filter_by(book_id=book.id, approved=True).order_by(Review.created_at.desc()).all()
    # преобразовать текст отзыва
    for r in reviews:
        r.html_text = bleach.clean(markdown(r.text, extensions=['fenced_code']), tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES, strip=True)

    user_review = None
    if current_user.is_authenticated:
        from .models import Review
        user_review = Review.query.filter_by(book_id=book.id, user_id=current_user.id).first()

    return render_template('books/view.html', book=book, html_desc=html_desc, reviews=reviews, user_review=user_review)
