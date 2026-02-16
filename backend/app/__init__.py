from flask import Flask
from flask_cors import CORS
from config import config


def create_app(config_name='default'):
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    CORS(app)

    # Initialize extensions
    from app.extensions import db, migrate
    db.init_app(app)
    migrate.init_app(app, db)

    # Load models so Alembic can detect them
    from app import models  # noqa: F401

    # Register blueprints
    from app.routes import register_blueprints
    register_blueprints(app)

    return app
