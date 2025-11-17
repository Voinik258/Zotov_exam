from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, abort
from flask_login import login_required, current_user
from .extensions import db
from .models import Review, Book

reviews_bp = Blueprint('reviews', __name__)

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

@reviews_bp.route('/books/<int:book_id>/reviews/create', methods=['GET','POST'])
@login_required
def create_review(book_id):
    book = Book.query.get_or_404(book_id)
    existing = Review.query.filter_by(book_id=book_id, user_id=current_user.id).first()
    if existing:
        flash('Вы уже оставляли рецензию на эту книгу', 'warning')
        return redirect(url_for('books.view_book', book_id=book_id))

    if request.method == 'POST':
        try:
            rating = int(request.form['rating'])
            text = request.form['text']
            review = Review(book_id=book_id, user_id=current_user.id, rating=rating, text=text)
            db.session.add(review)
            db.session.commit()
            flash('Рецензия успешно добавлена', 'success')
            return redirect(url_for('books.view_book', book_id=book_id))
        except Exception:
            db.session.rollback()
            current_app.logger.exception('Error saving review')
            flash('При сохранении данных возникла ошибка. Проверьте корректность введённых данных.', 'danger')
    return render_template('reviews/create.html', book=book)

@reviews_bp.route('/moderation')
@login_required
@require_role('Administrator', 'Moderator')
def moderation_queue():
    page = request.args.get('page', 1, type=int)
    pagination = Review.query.filter_by(approved=False).order_by(Review.created_at.asc()).paginate(page=page, per_page=10, error_out=False)
    reviews = pagination.items
    return render_template('moderation_list.html', items=reviews, pagination=pagination)

@reviews_bp.route('/moderation/<int:review_id>')
@login_required
@require_role('Administrator', 'Moderator')
def moderation_review(review_id):
    review = Review.query.get_or_404(review_id)
    if review.approved:
        abort(404)
    from markdown import markdown
    import bleach
    ALLOWED_TAGS = list(bleach.sanitizer.ALLOWED_TAGS) + ['p','pre','code','blockquote','h1','h2','h3','h4','ul','ol','li','strong','em','a','img']
    ALLOWED_ATTRIBUTES = {'*': ['class'], 'a': ['href','title','rel'], 'img': ['src','alt','title']}
    text_html = bleach.clean(markdown(review.text, extensions=['fenced_code']), tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES, strip=True)
    return render_template('moderation_review.html', r=review, text_html=text_html)

@reviews_bp.route('/moderation/<int:review_id>/approve', methods=['POST'])
@login_required
@require_role('Administrator', 'Moderator')
def moderation_approve(review_id):
    review = Review.query.get_or_404(review_id)
    if review.approved:
        abort(404)
    review.approved = True
    db.session.commit()
    flash('Рецензия одобрена', 'success')
    return redirect(url_for('reviews.moderation_queue'))

@reviews_bp.route('/moderation/<int:review_id>/reject', methods=['POST'])
@login_required
@require_role('Administrator', 'Moderator')
def moderation_reject(review_id):
    review = Review.query.get_or_404(review_id)
    if review.approved:
        abort(404)
    db.session.delete(review)
    db.session.commit()
    flash('Рецензия отклонена', 'danger')
    return redirect(url_for('reviews.moderation_queue'))

@reviews_bp.route('/my-reviews')
@login_required
def my_reviews():
    page = request.args.get('page', 1, type=int)
    pagination = Review.query.filter_by(user_id=current_user.id).order_by(Review.created_at.desc()).paginate(page=page, per_page=10, error_out=False)
    reviews = pagination.items
    return render_template('my_reviews.html', items=reviews, pagination=pagination)
