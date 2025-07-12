from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserOut
from app.repository.user import UserRepository
from prisma import Prisma
db = Prisma()
#good thing in prisma t9dr tinitilizha f ay file u dont have to deal with state w hdok 3fyss
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
