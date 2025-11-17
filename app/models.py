from datetime import datetime
from .extensions import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash



book_genres = db.Table('book_genres',

    db.Column('book_id', db.Integer, db.ForeignKey('books.id', ondelete='CASCADE'), primary_key=True),

    db.Column('genre_id', db.Integer, db.ForeignKey('genres.id', ondelete='CASCADE'), primary_key=True)

)



class Role(db.Model):

    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), unique=True, nullable=False)

    description = db.Column(db.Text, nullable=False)



class User(UserMixin, db.Model):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(150), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    last_name = db.Column(db.String(150), nullable=False)

    first_name = db.Column(db.String(150), nullable=False)

    middle_name = db.Column(db.String(150))

    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)



    role = db.relationship('Role')

    reviews = db.relationship('Review', back_populates='user', cascade='all, delete-orphan')



    def set_password(self, password):

        self.password_hash = generate_password_hash(password)



    def check_password(self, password):

        return check_password_hash(self.password_hash, password)



    @property

    def full_name(self):

        if self.middle_name:

            return f"{self.last_name} {self.first_name} {self.middle_name}"

        return f"{self.last_name} {self.first_name}"



@login_manager.user_loader

def load_user(user_id):

    return User.query.get(int(user_id))



class Cover(db.Model):

    __tablename__ = 'covers'

    id = db.Column(db.Integer, primary_key=True)

    filename = db.Column(db.String(255), nullable=False)

    mime_type = db.Column(db.String(100), nullable=False)

    md5_hash = db.Column(db.String(32), nullable=False, unique=True)



class Genre(db.Model):

    __tablename__ = 'genres'

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(150), unique=True, nullable=False)



class Book(db.Model):

    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(255), nullable=False)

    short_description = db.Column(db.Text, nullable=False)

    year = db.Column(db.Integer, nullable=False)

    publisher = db.Column(db.String(255), nullable=False)

    author = db.Column(db.String(255), nullable=False)

    pages = db.Column(db.Integer, nullable=False)

    cover_id = db.Column(db.Integer, db.ForeignKey('covers.id', ondelete='SET NULL'))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)



    cover = db.relationship('Cover')

    genres = db.relationship('Genre', secondary=book_genres, backref=db.backref('books', lazy='dynamic'))

    reviews = db.relationship('Review', back_populates='book', cascade='all, delete-orphan')



    def average_rating(self):
        if not self.reviews:
            return None
        return sum(r.rating for r in self.reviews) / len(self.reviews)

    @property
    def avg_rating_approved(self):
        approved_reviews = [r for r in self.reviews if r.approved]
        if not approved_reviews:
            return None
        return sum(r.rating for r in approved_reviews) / len(approved_reviews)

    @property
    def reviews_count_approved(self):
        return len([r for r in self.reviews if r.approved])



class Review(db.Model):

    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)

    book_id = db.Column(db.Integer, db.ForeignKey('books.id', ondelete='CASCADE'), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)

    rating = db.Column(db.Integer, nullable=False)

    text = db.Column(db.Text, nullable=False)

    approved = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)



    book = db.relationship('Book', back_populates='reviews')

    user = db.relationship('User', back_populates='reviews')



    __table_args__ = (db.UniqueConstraint('book_id', 'user_id', name='_book_user_uc'),)
