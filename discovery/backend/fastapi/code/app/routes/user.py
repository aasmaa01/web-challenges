from fastapi import APIRouter, HTTPException
from models.user import UserCreate, UserOut
from repository.user import UserRepository
from main import db

router = APIRouter()

@router.post("/", response_model=UserOut)
async def create_user(user: UserCreate):
    created = await UserRepository.create_user(db, user)
    return created

@router.get("/{user_id}", response_model=UserOut)
async def read_user(user_id: int):
    user = await UserRepository.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
