# api/auth/routes.py
from fastapi import APIRouter, Request, Response, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from core.database import supabase
from core.security import get_profile_status, get_current_user
from core.config import settings
from core.utils import set_auth_cookies
from typing import Optional

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
@router.post("/change-password")
async def change_password(request: Request, response: Response):
    body = await request.json()
    current_password = body.get("current_password")
    new_password = body.get("new_password")
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")

    if not current_password or not new_password:
        raise HTTPException(status_code=400, detail="Both current and new passwords are required")

    try:
        # Set session
        supabase.auth.set_session(access_token=access_token, refresh_token=refresh_token)
        user = supabase.auth.get_user(access_token).user

        # Re-authenticate
        login_attempt = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": current_password
        })
        if not login_attempt.session:
            raise HTTPException(status_code=401, detail="Invalid current password")

        # Change password
        supabase.auth.set_session(
            access_token=login_attempt.session.access_token,
            refresh_token=login_attempt.session.refresh_token
        )
        supabase.auth.update_user({"password": new_password})

        # ❌ Clear session cookies
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return {"message": "Password updated. Please log in again."}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Password update failed: {str(e)}")

@router.post("/request-email-change")
async def request_email_change(request: Request, current_user: dict = Depends(get_current_user)):
    body = await request.json()
    new_email = body.get("new_email")
    current_password = body.get("current_password")

    # Validate input
    if not new_email or not current_password:
        raise HTTPException(status_code=400, detail="New email and current password are required")

    user_id = current_user["id"]
    user_email = current_user["email"]

    try:
        # Re-authenticate the user
        login_attempt = supabase.auth.sign_in_with_password({
            "email": user_email,
            "password": current_password
        })

        if not login_attempt.session:
            raise HTTPException(status_code=401, detail="Invalid current password")
        # If re-authentication is successful, set the session
        # Set the session with the new access token
        supabase.auth.set_session(
            access_token=login_attempt.session.access_token,
            refresh_token=login_attempt.session.refresh_token
        )


        # Update the user's email
        result = supabase.auth.update_user({
            "email": new_email,
            "options": {
                "email_redirect_to": f"{settings.SITE_URL}/auth/callback?type=email_change"
            }
        })
        profile_update = supabase.table("profiles").update({
            "email": new_email
        }).eq("id", user_id).execute()
        # Check for errors in the result
        if not result.user:
            raise HTTPException(status_code=400, detail="Email update failed.")

        return {"message": "Confirmation email sent to new address."}

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions to return appropriate status codes
        raise http_exc
    except Exception as e:
        # Log the exception for debugging
        print(f"Exception occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
# api/auth/routes.py - Update the callback endpoint
@router.get("/callback")
async def auth_callback(token: str, response: Response):
    """
    Handles the OAuth callback from email verification
    """
    try:
        auth_response = supabase.auth.verify_otp({
            "token": token,
            "type": "signup"
        })
        
        if not auth_response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        # Get or create user profile
        profile_complete = await get_profile_status(auth_response.user.id)

        # Get the current session
        session = supabase.auth.get_session()
        
        # Set secure cookies
        set_auth_cookies(response, session)

        return {
            "access_token": session.access_token,
            "user_id": auth_response.user.id,
            "email": auth_response.user.email,
            "profile_complete": profile_complete
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Email verification failed: {str(e)}"
        )
@router.post("/login")
async def login_user(request: Request, response: Response):
    """
    Login endpoint that matches your Next.js client expectations
    """
    body = await request.json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        user = supabase.auth.get_user(auth_response.session.access_token)
        profile_complete = await get_profile_status(user.user.id)

        # Set cookies
        set_auth_cookies(response, auth_response.session)

        return {
            "access_token": auth_response.session.access_token,
            "user_id": user.user.id,
            "email": user.user.email,
            "profile_complete": profile_complete
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
# api/auth/routes.py - Update signup endpoint
@router.post("/signup")
async def register_user(request: Request):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "email_redirect_to": f"{settings.SITE_URL}/auth/callback?type=signup"
            }
        })

        if not response.user:
            raise HTTPException(status_code=409, detail="Email is already in use")

        return {
            "access_token": "",
            "user_id": response.user.id,
            "email": response.user.email,
            "profile_complete": False
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    """
    Token refresh endpoint
    """
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    try:
        supabase.auth.set_session("", refresh_token)
        session = supabase.auth.refresh_session()
        
        if not session.session:
            raise HTTPException(status_code=400, detail="Failed to refresh session")

        # Set new cookies
        set_auth_cookies(response, session.session)

        return {
            "access_token": session.session.access_token,
            "refresh_token": session.session.refresh_token,
            "expires_in": session.session.expires_in,
            "user_id": "",
            "email": "",
            "profile_complete": False
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.post("/logout")
async def logout_user(request: Request, response: Response):
    """
    Logout endpoint that clears cookies and signs out from Supabase
    """
    try:
        access_token = request.cookies.get("access_token")
        refresh_token = request.cookies.get("refresh_token")

        if access_token and refresh_token:
            supabase.auth.set_session(access_token=access_token, refresh_token=refresh_token)
            supabase.auth.sign_out()


        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
