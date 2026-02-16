def register_blueprints(app):
    """Register all blueprints with the app."""
    from app.routes.health import health_bp
    from app.routes.upload import upload_bp
    from app.routes.neighborhoods import neighborhoods_bp
    from app.routes.energy import energy_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(neighborhoods_bp)
    app.register_blueprint(energy_bp)
