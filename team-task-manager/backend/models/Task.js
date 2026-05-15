const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task'); // <--- Import your model here

dotenv.config();
const app = express();
app.use(express.json()); // Middleware to parse JSON data

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB Atlas");
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error("DB Connection Failed:", err));