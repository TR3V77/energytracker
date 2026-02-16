def register_blueprints(app):
    """Register all blueprints with the app."""
    from app.routes.health import health_bp
    app.register_blueprint(health_bp)
