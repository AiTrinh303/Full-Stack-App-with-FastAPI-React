from fastapi import HTTPException, Request
from clerk_backend_api import Clerk, AuthenticateRequestOptions
import os
from dotenv import load_dotenv

load_dotenv()

clerk_sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

def authenticate_get_user_details(request: Request):
    request_state = clerk_sdk.authenticate_request(
        request,
        AuthenticateRequestOptions(
            authorized_parties=[
                "http://localhost:5173",
                "http://localhost:5174",
                "https://full-stack-app-with-fastapi-react.onrender.com"
            ]
        )
    )

    if not request_state.is_signed_in:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = request_state.payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Missing user id")

    return {"user_id": user_id}