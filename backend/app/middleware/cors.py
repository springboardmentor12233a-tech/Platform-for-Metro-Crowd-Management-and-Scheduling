"""
CORS Middleware Configuration
================================
Configures Cross-Origin Resource Sharing (CORS) for the FastAPI application.

Allowed origins are loaded from the `settings.allowed_origins` list which
is populated from the ALLOWED_ORIGINS environment variable. This allows the
React/Vite frontend (http://localhost:5173) to communicate with this API
during development without browser CORS blocks.

For production, restrict `allow_origins` to your actual frontend domain(s).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings


def setup_cors(app: FastAPI) -> None:
    """
    Attach CORSMiddleware to the FastAPI application instance.

    This function must be called BEFORE any routers are included on the app,
    as middleware is applied in the order it is registered.

    Args:
        app: The FastAPI application instance to configure.

    Configuration:
        - allow_origins:     Loaded from settings (env var ALLOWED_ORIGINS).
        - allow_credentials: True — allows cookies and Authorization headers.
        - allow_methods:     All HTTP methods permitted.
        - allow_headers:     All request headers permitted.
        - expose_headers:    Common pagination/rate-limit response headers exposed.
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=[
            "X-Total-Count",
            "X-Page",
            "X-Page-Size",
            "X-Rate-Limit-Remaining",
        ],
    )
