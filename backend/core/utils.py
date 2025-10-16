# core/utils.py
from fastapi import HTTPException, status
from fastapi.responses import RedirectResponse
from core.config import settings
from core.database import supabase

def set_auth_cookies(response, session):
    """Set authentication cookies consistently across endpoints"""
    secure = settings.ENVIRONMENT == "production"
    response.set_cookie(
        key="access_token",
        value=session.access_token,
        httponly=True,
        secure=secure,
        samesite="Lax",
        path="/",
        max_age=session.expires_in
    )
    response.set_cookie(
        key="refresh_token",
        value=session.refresh_token,
        httponly=True,
        secure=secure,
        samesite="Lax",
        max_age=60 * 60 * 24 * 7  # 7 days
    )

def get_session_from_request(request):
    """Extract tokens from request cookies"""
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")
    if not access_token or not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing session tokens"
        )
    return access_token, refresh_token

def create_redirect_response(session, url="/"):
    """Create a standardized redirect response with cookies"""
    redirect = RedirectResponse(url=url, status_code=status.HTTP_303_SEE_OTHER)
    set_auth_cookies(redirect, session)
    return redirect
# core/utils.py (additional function)
async def handle_db_operation(operation, error_message="Database operation failed"):
    """
    Handles database operations with consistent error handling
    Args:
        operation: A lambda function containing the DB operation
        error_message: Custom error message for exceptions
    Returns:
        The result of the successful operation
    Raises:
        HTTPException: If the operation fails
    """
    try:
        result = operation()
        if not result.data:
            raise HTTPException(status_code=404, detail="No data found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"{error_message}: {str(e)}"
        )    