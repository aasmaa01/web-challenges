import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.js";

dotenv.config();

// setting server port to 5000
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
