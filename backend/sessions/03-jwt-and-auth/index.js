import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);

// Middleware to check if user is authenticated
function authenticate(req, res, next) {
  // Token verification

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  try {
    const decoded = jwt.verify(token, "jwtSecret");

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not Authorized" });
  }
}

// Routes
app.post("/register", async (req, res) => {
  const { email, password, confirmPassword, name, age } = req.body;

  // Validate input
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (age < 18) {
    return res
      .status(400)
      .json({ message: "You must be at least 18 years old" });
  }

  if (!email || !password || !name || !age) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Add User to database
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword, name, age });
    await user.save();

    user.password = undefined; // Remove password from response
    const token = jwt.sign({ userId: user._id }, "jwtSecret", {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  const isValidPassword = await bcrypt.compare(password, userExists.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid password" });
  }

  userExists.password = undefined; // Remove password from response

  const token = jwt.sign({ userId: userExists._id }, "jwtSecret", {
    expiresIn: "1h",
  });

  return res.status(200).json({
    message: "Login successful",
    data: {
      user: userExists,
      token,
    },
  });
});

app.get("/secret", authenticate, async (req, res) => {
  // This route is protected by the authenticate middleware
  res.send({
    message: "my route secret",
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
