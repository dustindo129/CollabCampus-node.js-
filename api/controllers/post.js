import { db } from "../db.js"; // Import database connection to access and manipulate data in the database
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token-based user authentication


// Function to get all posts or filter by category
export const getPosts = (req, res) => {
    // If a category is specified in the query, select posts by category; otherwise, select all posts
    const q = req.query.category 
        ? "SELECT `id`, `title`, `desc`, `longdesc`, `postimg`, `date`, `category`, `uuid` FROM posts WHERE category=?" 
        : "SELECT `id`, `title`, `desc`, `longdesc`, `postimg`, `date`, `category`, `uuid` FROM posts";

    // Execute the query with the provided category, if any
    db.query(q, [req.query.category], (err, data) => {
        if (err) return res.status(500).json(err); // Return error if query fails
        return res.status(200).json(data); // Send retrieved data as JSON response
    });
}

// Function to get a single post by ID
export const getPost = (req, res) => {
    // Query to join user and post tables to get additional user info along with the post
    const q = "SELECT u.username, p.title, p.desc, p.longdesc, p.postimg, p.date, p.category, p.uuid FROM user u JOIN posts p ON u.id = p.uuid WHERE p.id = ?";
    const postId = req.params.id; // Get post ID from request parameters

    // Execute query to fetch the specific post by ID
    db.query(q, [postId], (err, data) => {
        if (err) return res.status(500).json(err); // Return error if query fails
        return res.status(200).json(data[0]); // Send the first result (post data) as JSON response
    });
}


export const addPost = (req, res) => {
    // Check for access token in cookies to verify authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated"); // Return 401 if token is missing

    // Verify the JWT token to authenticate the user
    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid"); // Return 403 if token is invalid

        // Adjusted query with values in correct order
        const q = "INSERT INTO posts(`title`, `desc`, `longdesc`, `date`, `uuid`, `category`, `postimg`) VALUES (?)";
        
        const values = [
            req.body.title, // Post title
            req.body.shortDesc, // Short description
            req.body.longDesc, // Added `longdesc` to match table structure
            req.body.date, // Date of the post
            userInfo.id, // User ID from the token
            req.body.category, // Category of the post
            req.body.postimg // Image URL or path for the post
        ];

        // Execute insertion query
        db.query(q, [values], (err, data) => {
            if (err) {
                console.error("Error inserting post:", err); // Log detailed error
                return res.status(500).json("Error adding post"); // Return error response if insertion fails
            }
            return res.status(201).json("Post has been created"); // // Send success response if post is created - Status 201
        });
    });
};


export const updatePost = (req, res) => {
    // Check for access token in cookies for authentication
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated"); // Return 401 if token is missing

    // Verify JWT token to confirm user identity
    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid"); // Return 403 if token is invalid

        const postId = req.params.id; // Get post ID from request parameters
        console.log(`The post id is : ${postId}`)

        // SQL query to update the post if the post ID and user ID match
        const q = "UPDATE posts SET `title`=?, `desc`=?, `longdesc`=?, `category`=?, `postimg`=? WHERE `id`=? AND `uuid`=?";
        
        const values = [
            req.body.title, // New title for the post
            req.body.shortDesc, // New short description
            req.body.longDesc, // Added `longdesc` to match table structure
            req.body.category, // New category
            req.body.postimg // New image URL or path
        ];

        // Execute update query with values and conditions
        db.query(q, [...values, postId, userInfo.id], (err, data) => {
            if (err) {
                console.error("Error updating post:", err); // Log detailed error if update fails
                return res.status(500).json("Error updating post"); // Return error response if update fails
            }
            return res.status(200).json("Post has been updated"); // Success response for post update
        });
    });
};


export const deletePost = (req, res) => {
    // Check for access token in cookies to verify authentication
    const token = req.cookies.accessToken;
    console.log(`This is the Token ${token}`)
    if (!token) return res.status(401).json("Not authenticated"); // Return 401 if token is missing

    // Verify JWT token to confirm user identity
    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid"); // Return 403 if token is invalid
        const postId = req.params.id; // Get post ID from request parameters
        
        const q = "DELETE FROM posts WHERE `id` = ? AND `uuid` = ?"; // SQL query to delete the post if the post ID and user ID match

        // Execute delete query with conditions
        db.query(q, [postId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err); // Return error if deletion fails
            return res.json("Post has been deleted"); // Success response for post deletion
        });
    });
}

