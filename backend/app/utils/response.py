"""
Standard API Response Utilities
================================
Provides consistent response envelope formatting across all API endpoints.
Using a standardized response structure makes it easier for frontend clients
to parse responses predictably regardless of the endpoint.

Response structure:
    {
        "status": "success" | "error",
        "message": "...",
        "data": ...,           # success_response only
        "detail": "...",       # error_response only
        "pagination": {...}    # paginated_response only
    }
"""

import math
from typing import Any, Optional, List

from fastapi.responses import JSONResponse


# ---------------------------------------------------------------------------
# Success Response
# ---------------------------------------------------------------------------
def success_response(
    data: Any,
    message: str = "Success",
    status_code: int = 200,
) -> dict:
    """
    Build a standardized success response envelope.

    Args:
        data:        The response payload — can be any JSON-serializable type.
        message:     Human-readable success message.
        status_code: HTTP status code (informational only — actual code set by FastAPI).

    Returns:
        Dict with 'status', 'message', and 'data' keys.

    Example:
        return success_response({'id': 1, 'name': 'Central Station'}, 'Station retrieved')
    """
    return {
        "status": "success",
        "message": message,
        "data": data,
    }


# ---------------------------------------------------------------------------
# Error Response
# ---------------------------------------------------------------------------
def error_response(
    message: str,
    detail: Optional[str] = None,
    status_code: int = 400,
) -> JSONResponse:
    """
    Build a standardized error JSONResponse.

    Args:
        message:     Short human-readable error summary.
        detail:      Extended error description or exception message.
        status_code: HTTP error status code to set on the response.

    Returns:
        FastAPI JSONResponse with the error envelope and the given status code.

    Example:
        return error_response('Station not found', f'No station with id ST999', 404)
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "error",
            "message": message,
            "detail": detail or message,
        },
    )


# ---------------------------------------------------------------------------
# Paginated Response
# ---------------------------------------------------------------------------
def paginated_response(
    items: List[Any],
    total: int,
    page: int = 1,
    page_size: int = 20,
) -> dict:
    """
    Build a paginated list response envelope.

    Args:
        items:     The current page of items.
        total:     Total number of items across all pages.
        page:      Current page number (1-indexed).
        page_size: Number of items per page.

    Returns:
        Dict with 'status', 'data', and 'pagination' keys.

    Example:
        return paginated_response(schedule_list, total=150, page=2, page_size=20)
    """
    total_pages = math.ceil(total / page_size) if page_size > 0 else 1

    return {
        "status": "success",
        "data": items,
        "pagination": {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        },
    }


# ---------------------------------------------------------------------------
# Created Response (HTTP 201)
# ---------------------------------------------------------------------------
def created_response(data: Any, message: str = "Created successfully") -> dict:
    """
    Convenience wrapper for resource creation responses (HTTP 201).

    Args:
        data:    The newly created resource.
        message: Success message.

    Returns:
        Success response dict. FastAPI route should set status_code=201.
    """
    return success_response(data=data, message=message, status_code=201)
