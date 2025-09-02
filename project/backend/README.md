# Authentication Endpoints

## Register a new user
**POST** `/api/auth/register`

### Request Body
```json
{
  "email": "asma@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "name": "asma soltani",
  "age": 20
}
```

### Response (201)
```json
{
    "message": "User Register succesfully!",
    "data": {
        "user": {
            "id": 2,
            "email": "asma@example.com",
            "name": "asma soltani",
            "age": 20,
            "role": "user",
            "isVerified": false,
            "createdAt": "2025-09-02T00:01:02.672Z",
            "updatedAt": "2025-09-02T00:01:02.672Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1Njc3MTI2MiwiZXhwIjoxNzU2Nzc0ODYyfQ.Wkg6mX8RJM4vp_CdzyRvi8K2AdGPcQSD0oNgBVnfEuE"
    }
}
```

---

## Login
**POST** `/api/auth/login`

### Request Body
```json
{
  "email": "asma@example.com",
  "password": "password123"
}
```

### Response (200)
```json
{
    "message": "Login successful",
    "data": {
        "user": {
            "id": 2,
            "email": "asma1@example.com",
            "name": "asma soltani",
            "age": 20,
            "role": "user",
            "isVerified": false,
            "createdAt": "2025-09-02T00:01:02.672Z",
            "updatedAt": "2025-09-02T00:01:02.672Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1Njc3MTM0OCwiZXhwIjoxNzU2Nzc0OTQ4fQ.Y4Y1ovsxKs8jdoWNUE3qDMKL5HGp5CHapYD4xDcO1FI"
    }
}
```

---

## Refresh Access Token
**POST** `/api/auth/refresh`

### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1Njc3MTQ2MywiZXhwIjoxNzU3Mzc2MjYzfQ.NHcQ-3eFf6qJmVoZ8kM2cYUmq9dC3qKf9PcR0EENAv8"
}
```

### Response (200)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1Njc3MTUyMywiZXhwIjoxNzU2Nzc1MTIzfQ.SdB5UvbxnC31f2xN6lD0j7wP_9Rr2wKHTsMafDJZkTg"
}

```

---

## Protected Notes Routes
 All requests must include a valid **Authorization header**:  
`Authorization: Bearer <your_jwt_token>`

- `GET /api/notes` → Get user’s notes  
- `POST /api/notes` → Create new note  
- `GET /api/notes/:id` → Get note by ID (only if owned by user)  
- `PUT /api/notes/:id` → Update note (only if owned by user)  
- `DELETE /api/notes/:id` → Delete note (only if owned by user)  

---

# Test Cases

| Feature | Test Case | Expected Result |
|---------|-----------|-----------------|
| **Register** | Register with valid data | ✅ User created, JWT returned |
| | Passwords don’t match | ❌ 400 error |
| | Age < 18 | ❌ 400 error |
| | Invalid email format | ❌ 400 error |
| | Duplicate email | ❌ 400 error |
| **Login** | Valid credentials | ✅ JWT returned |
| | Wrong password | ❌ 401 error |
| | Unknown email | ❌ 404 error |
| **Protected Routes** | Access without token | ❌ 401 Unauthorized |
| | Access with invalid token | ❌ 401 Unauthorized |
| | Access with valid token | ✅ Notes CRUD allowed |
| | Access other user’s note | ❌ 404 Not Found |
| **Notes CRUD** | Create note with valid token | ✅ Note linked to user |
| | Get all notes | ✅ Only own notes returned |
| | Update own note | ✅ Note updated |
| | Update other user’s note | ❌ 404 error |
| | Delete own note | ✅ Deleted successfully |
| | Delete other user’s note | ❌ 404 error |
| **Refresh Token** | Valid refresh token | ✅ New access token returned |
| | Expired/invalid token | ❌ 403 error |

---
