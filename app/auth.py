from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from .models import User
from .extensions import db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        remember = bool(request.form.get('remember'))
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user, remember=remember)
            flash('Успешный вход', 'success')
            next_page = request.args.get('next') or url_for('main.index')
            return redirect(next_page)
        else:
            flash('Невозможно аутентифицироваться с указанными логином и паролем', 'danger')
            return render_template('auth/login.html'), 401
    return render_template('auth/login.html')

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Вы успешно вышли', 'success')
    return redirect(url_for('main.index'))
