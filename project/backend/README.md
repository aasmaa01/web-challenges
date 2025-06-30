# 🎯 Backend Challenge 1 — Solution Documentation: Express API & Database Foundation

This solution implements the foundational API for **CollabNote**, a collaborative note-taking app. The backend is built using **Express.js**, **Prisma ORM**, and **PostgreSQL**, with full CRUD operations and frontend‑ready JSON responses.

---

## 📦 Project Structure

```
project/backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── Controllers/
│   │   └── notesController.js
│   ├── generated/
│   ├── routes/
│   │   └── notes.js
│   ├── utils/
│   │   ├── errorHandler.js
│   │   ├── noteFormatter.js
│   │   ├── noteValidator.js
│   │   └── prisma.js
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## ✅ Goals Achieved

### 🗃️ Task 1: Database Setup with Prisma

- ✅ Installed Prisma & dependencies  
- ✅ Set up `.env` with PostgreSQL `DATABASE_URL`  
- ✅ Defined the `Note` model in `prisma/schema.prisma`  
- ✅ Generated Prisma client and pushed schema to DB  

---

## ⚙️ Setup Breakdown

### 1️⃣ PostgreSQL & Prisma

- Installed PostgreSQL via the [official installer](https://www.postgresql.org/download/)
- Default user: `postgres`, custom password set during setup
- Verified existing users using:

```bash
psql -U postgres
\du
```

### 2️⃣ Installed Dependencies

```bash
npm install prisma @prisma/client cors dotenv
npx prisma init
```

### 3️⃣ Environment Configuration

Created `.env` (based on `.env.example`):

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/collabnote_db"
```

### 4️⃣ Prisma Schema Definition

`prisma/schema.prisma`:

```prisma
model Note {
  id         Int      @id @default(autoincrement())
  title      String
  content    String
  authorName String   @default("Unknown")
  isPublic   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

Then generated the client and synced the DB:

```bash
npx prisma generate
npx prisma db push
```

---

### ⚙️ Task 2: Express Server Setup

- ✅ Configured **CORS** to allow frontend requests from `localhost:5173`  
- ✅ Integrated **dotenv** for environment management  
- ✅ Set up **global error handling middleware**  
- ✅ Configured server to run on port `5000`  

---

## 🔌 Express Server Setup

All setup and middleware are configured inside `src/app.js`.

### ✅ `app.js` Code

```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get("/", (_, res) => {
  res.json({ message: "CollabNote API is running!" });
});

app.use("/api/notes", notesRouter);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

---

## 📝 Task 3: API Endpoints (CRUD)

| Method | Endpoint            | Description               |
|--------|---------------------|---------------------------|
| GET    | `/api/notes`        | Get all notes             |
| POST   | `/api/notes`        | Create a new note         |
| GET    | `/api/notes/:id`    | Get a note by ID          |
| PUT    | `/api/notes/:id`    | Update an existing note   |
| DELETE | `/api/notes/:id`    | Delete a note by ID       |

---

### 🧩 Controller Code Snippets

#### 📥 GET `/api/notes` — Fetch All Notes

```js
// Get all notes
export const getNotes = async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany();
    const formattedNotes = formatNotes(notes);
    return res.status(200).json(formattedNotes);
  } catch (error) {
    next(httpError("Failed to fetch or format notes", 500));
  }
};
```

#### 📤 POST `/api/notes` — Create a New Note

```js
// Create a new note
export const createNote = async (req, res, next) => {
  const {
    title,
    content,
    authorName = "Unknown",
    isPublic = true,
  } = req.body;

  try {
    const createdNote = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorName,
        isPublic,
      },
    });

    res.status(201).json(formatNote(createdNote));
  } catch (error) {
    next(httpError("Note creation failed", 500));
  }
};
```

#### 🔍 GET `/api/notes/:id` — Get Note by ID

```js
// Get note by ID
export const getNoteById = async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!note) {
      return next(httpError("Note not found", 404));
    }

    res.status(200).json(formatNote(note));
  } catch (error) {
    next(error);
  }
};
```

#### ✏️ PUT `/api/notes/:id` — Update a Note

```js
// Update note
export const updateNote = async (req, res, next) => {
  const noteId = Number(req.params.id);
  const { title, content, authorName, isPublic } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title.trim();
  if (content !== undefined) updateData.content = content.trim();
  if (authorName !== undefined) updateData.authorName = authorName;
  if (isPublic !== undefined) updateData.isPublic = isPublic;

  if (Object.keys(updateData).length === 0) {
    return next(httpError("No fields provided to update", 400));
  }

  try {
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return next(httpError("Note not found", 404));
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
    });

    res.status(200).json(formatNote(updatedNote));
  } catch (error) {
    next(error);
  }
};
```

#### ❌ DELETE `/api/notes/:id` — Delete a Note

```js
// Delete a note
export const deleteNote = async (req, res, next) => {
  const noteId = Number(req.params.id);

  try {
    await prisma.note.delete({ where: { id: noteId } });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
```

---

## 🛡️ Task 4: Validation, Formatting & Middleware

### 📜 Zod Schema & Validation Middleware (`utils/noteValidator.js`)

```js
import { z } from "zod";

// Note schema
export const noteModelValidation = z.object({
  title: z.string().min(1, "Title must exist"),
  content: z.string().min(1, "Content must exist"),
  authorName: z.string().optional(),
  isPublic: z.boolean().optional(),
});

// Create‑note validator
export const createNoteValidator = (req, res, next) => {
  try {
    req.body = noteModelValidation.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Create Note validation failed",
        errors: error.flatten().fieldErrors,
      });
    }
    next(error);
  }
};

// Update‑note validator
export const updateNoteValidator = (req, res, next) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid note ID" });
  }

  try {
    req.body = noteModelValidation.partial().parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Update Note validation failed",
        errors: error.flatten().fieldErrors,
      });
    }
    next(error);
  }
};

// Note‑ID validator
export const validateNoteId = (req, res, next) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid note ID" });
  }
  next();
};
```

### 🪄 Note Formatting Utility (`utils/noteFormatter.js`)

```js
// Format a single note
export const formatNote = (note) => ({
  id: note.id,
  title: note.title,
  content: note.content,
  authorName: note.authorName,
  isPublic: note.isPublic,
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
});

// Format an array of notes
export const formatNotes = (notes) => notes.map(formatNote);
```

### 🛠️ Route Integration (`src/routes/notes.js`)

```js
import { Router } from "express";
import {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from "../Controllers/notesController.js";
import {
  createNoteValidator,
  updateNoteValidator,
  validateNoteId,
} from "../utils/noteValidator.js";

const router = Router();

router.get("/", getNotes);
router.post("/", createNoteValidator, createNote);

router.get("/:id", validateNoteId, getNoteById);
router.put("/:id", validateNoteId, updateNoteValidator, updateNote);
router.delete("/:id", validateNoteId, deleteNote);

export default router;
```
## 🧪 Test Checklist

### 1️⃣ Can Create Notes with Valid Data
- ✅ **Description:** Sends a POST request with all required fields.
- 📸 **Screenshot:**
![Create Note Valid](./screenshots/create-note-valid.png)

---

### 2️⃣ Cannot Create Notes Without Required Fields
- ✅ **Description:** Missing `title` or `content` triggers 400 error.
- 📸 **Screenshot:**
![Create Note Invalid](./screenshots/create-note-invalid.png)

---

### 3️⃣ Can Retrieve All Notes
- ✅ **Description:** GET `/api/notes` returns all notes formatted for frontend.
- 📸 **Screenshot:**
![Get All Notes](./screenshots/get-all-notes.png)

---

### 4️⃣ Can Retrieve Specific Note by ID
- ✅ **Description:** GET `/api/notes/1` returns a specific note.
- 📸 **Screenshot:**
![Get Note by ID](./screenshots/get-note-by-id.png)

---

### 5️⃣ Returns 404 for Non-existent Note IDs
- ✅ **Description:** GET `/api/notes/9999` (assuming this ID doesn't exist) returns 404.
- 📸 **Screenshot:**
![404 Note Not Found](./screenshots/note-not-found.png)

---

### 6️⃣ Can Update Existing Notes
- ✅ **Description:** PUT `/api/notes/:id` with valid changes.
- 📸 **Screenshot:**
![Update Note](./screenshots/update-note.png)

---

### 7️⃣ Can Delete Notes
- ✅ **Description:** DELETE `/api/notes/:id` removes note from database.
- 📸 **Screenshot:**
![Delete Note](./screenshots/delete-note.png)

---

### 8️⃣ CORS Allows Frontend Connections
- ✅ **Description:** Frontend app can fetch data from backend without CORS issues.
- 📸 **Screenshot:**
![CORS Success](./screenshots/cors-success.png)

---

### 9️⃣ Proper Error Messages for Invalid Requests
- ✅ **Description:** Bad requests return informative error responses.
- 📸 **Screenshot:**
![Error Handling](./screenshots/error-response.png)

---

### 🔟 Handles Database Connection Errors
- ✅ **Description:** If DB connection fails, app responds with an error.
- 📸 **Screenshot:**
![DB Error](./screenshots/db-error.png)

---
