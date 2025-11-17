from flask import Blueprint, render_template, request
from .models import Book

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    pagination = Book.query.order_by(Book.year.desc()).paginate(page=page, per_page=10, error_out=False)
    books = pagination.items
    return render_template('index.html', books=books, pagination=pagination)
