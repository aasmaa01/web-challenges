# FastAPI
# 🚀 FastAPI Workshop: Build Powerful APIs with Python & Prisma

we will start simple with an hello world app we will move to build crud app we will advance to building an agentic app with agno

> ⚡ FastAPI gives you automatic docs, type-based validation, and async support out of the box.

---

##  What You'll Learn

 What FastAPI is and why it's awesome  
 How Uvicorn runs FastAPI under the hood  
 Creating your first FastAPI app  
 Handling requests and responses with Pydantic  
 Using Prisma as a type-safe DB client  
 Building clean, async CRUD endpoints  
 Using Swagger UI for testing instantly  
 Writing elegant, readable API code with typing

---


##  Setup

python -m venv venv

source venv/bin/activate

pip install -r requirement.txt


## wht is uvicron 
python not like go he  wont handle the http request from the start of getting it deceide if its get or post request  here uvicorn came its cli package tht handle all the trafic and running fastapi and then fastapi will only work with logique 
 

```

    Client Request
        ↓
 ┌──────────────┐
 │     Server   │
 │              │
 │  Gunicorn    │  (WSGI) → Only sync
 │  Uvicorn     │  (ASGI) → Sync + Async + WebSockets
 └──────────────┘
        ↓
     Your App
     (Flask, FastAPI)

```

