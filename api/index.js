// Import necessary modules for the server setup
import express from "express";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express(); // Initialize the Express application

// Use CORS to allow requests from the frontend (localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // If you need to send cookies or headers with credentials
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to parse cookies in requests
app.use(cookieParser());

// Configure storage settings for file uploads using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload"); // Set destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // Create a unique filename using the original name and timestamp
  },
});

const upload = multer({ storage }); // Initialize multer with storage configuration

// Route to handle file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
    const file = req.file; // Access uploaded file from request
    res.status(200).json(file.filename); // Send filename as response
});

// Route handling for different parts of the application
app.use("/api/posts", postRoutes); // Routes for post-related operations
app.use("/api/auth", authRoutes); // Routes for authentication
app.use("/api/users", userRoutes); // Routes for user-related operations

// Test route to verify server setup
app.get("/test", (req, res) => {
  res.json("Hello, this is the backend"); // Response to test server connection
});

// Start the server and listen on port 8800
app.listen(8800, () => {
  console.log("Connected to backend"); // Log message once the server is running
});
