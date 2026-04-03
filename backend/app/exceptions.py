"""Domain / service-layer errors mapped to HTTP by routes."""


class ServiceError(Exception):
    """Raised when service validation fails; carries a suggested HTTP status."""

    def __init__(self, message: str, status_code: int = 400) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)
