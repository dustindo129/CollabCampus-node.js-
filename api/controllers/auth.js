
import {db} from "../db.js"; // Import the database connection object to interact with the database 
import bcrypt from "bcryptjs"; // Import bcryptjs for hashing passwords and enhancing security
import jwt from "jsonwebtoken"; // Import jsonwebtoken to generate tokens for user authentication

export const Register = (req, res) => {
    // CHECK EXISTING USER 
    const q = "SELECT * FROM user WHERE email = ? OR username = ?"
    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.status(500).json(err); // Return error if database query fails
        if (data.length) return res.status(409).json("User already exists!"); // Conflict error if user already exists

        // HASH THE PASSWORD AND CREATE A USER
        const salt = bcrypt.genSaltSync(10); // Generate salt to strengthen hash
        const hashedPassword = bcrypt.hashSync(req.body.password, salt); // Hash the user's password

        const q = "INSERT INTO user (`username`, `email`, `password`) VALUES (?)";
        const values = [
            req.body.username, // User's chosen username
            req.body.email, // User's email
            hashedPassword, // Hashed password for storage
        ]

        // Insert new user record into the database
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err); // Error handling for query issues
            return res.status(200).json("User has been created."); // Success response
        });
    });
}

export const Login = (req, res) => {
    //CHECK IF USER EXISTS
    const q = "SELECT * FROM user WHERE username = ?";
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err); // Return error if query fails
        if (data.length === 0) return res.status(404).json("User not found!"); // Not found if user doesn’t exist

        // CHECK PASSWORD
        const checkPassword = bcrypt.compareSync(
            req.body.password, // Password entered by user
            data[0].password // Password stored in the database
        );

        if (!checkPassword)
            return res.status(400).json("Wrong Password or username"); // Incorrect password or username

        // Generate a JWT token to authenticate the user session, this token will be stored in our cookie 
        const token = jwt.sign({ id: data[0].id }, "jwtkey");
        const {password, ...other} = data[0] // Exclude password from response for security

        // Set token in cookie with httpOnly flag for security and respond with user details
        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(other);
    
    });
}

export const Logout = (req, res) => {
    // Clear the access token cookie, ending the user's session
    res.clearCookie("accessToken", {
        secure: true, // Ensures cookie is only sent over HTTPS
        sameSite: "none" // Allows cookie to work across different domains
    }).status(200).json("User has been logged out"); // Success response for logout
}

