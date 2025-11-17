from flask import Flask
from .extensions import db, migrate, login_manager
from .config import Config
import os





def create_app(config_class=Config):

    app = Flask(__name__)

    app.config.from_object(config_class)



    # создать директорию для загрузок

    os.makedirs(app.config['COVERS_UPLOAD_FOLDER'], exist_ok=True)



    db.init_app(app)

    migrate.init_app(app, db)

    login_manager.init_app(app)



    # чертежи

    from .auth import auth_bp

    from .main import main_bp

    from .books import books_bp

    from .reviews import reviews_bp



    app.register_blueprint(auth_bp)

    app.register_blueprint(main_bp)

    app.register_blueprint(books_bp)

    app.register_blueprint(reviews_bp)

    @app.template_filter('markdown')
    def markdown_filter(text):
        from markdown import markdown
        return markdown(text)

    @app.context_processor
    def inject_globals():
        from flask_login import current_user
        return {
            'current_user_full_name': current_user.full_name if current_user.is_authenticated else None,
            'role_name': current_user.role.name if current_user.is_authenticated else None,
            'can_add': current_user.is_authenticated and current_user.role.name == 'Administrator'
        }

    @login_manager.unauthorized_handler

    def unauthorized_callback():

        from flask import flash, redirect, url_for

        flash("Для выполнения данного действия необходимо пройти процедуру аутентификации", "warning")

        return redirect(url_for('auth.login'))



    return app
