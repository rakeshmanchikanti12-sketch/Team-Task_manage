require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express(); // Defined once at the top

// MIDDLEWARE
app.use(cors());  
app.use(express.json()); 

// 1. DATABASE CONNECTION
console.log("Checking URI...", process.env.MONGO_URI ? "Found ✅" : "Not Found ❌");
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  family: 4 
})
  .then(() => console.log("✅ SUCCESS: Connected to MongoDB Atlas"))
  .catch((err) => {
    console.log("❌ CONNECTION ERROR:", err.message);
  });

// 2. SCHEMAS & MODELS

// User Model for Sign Up
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Member"], default: "Member" }
});
const User = mongoose.model("User", UserSchema);

// Task Model
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: String,
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model("Task", TaskSchema);

// 3. API ROUTES

// --- REAL SIGN UP ROUTE ---
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username, email, password, role });
    await newUser.save();
    
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Authentication failed" });
  }
});

// --- REAL LOGIN ROUTE ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.password === password) { 
      res.json({ 
        username: user.username,
        role: user.role, 
        token: "fake-jwt-token", // You can add real JWT later
        message: "Login successful"
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// --- TASK ROUTES ---
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: "Failed to create task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// 4. START SERVER
// Root health-check for platforms like Railway
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Team Task Manager API is running' });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});