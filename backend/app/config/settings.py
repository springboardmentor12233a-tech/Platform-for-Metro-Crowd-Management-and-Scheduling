"""
Settings Re-export — Backward Compatibility Shim
=================================================
This module re-exports the `settings` singleton from `app.core.config`
so that code importing from `app.config.settings` continues to work.

Preferred import path:
    from app.core.config import settings

Legacy / alternate import path (also valid):
    from app.config.settings import settings
"""

from app.core.config import settings  # noqa: F401 — intentional re-export

__all__ = ["settings"]
