import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import cookieParser from 'cookie-parser';

// next is a function that is called to pass control to the next middleware function in the stack e.g updateProfile in auth.route.js
export const protectRoute = async (req, res, next) => { 
    try {
        const token = req.cookies.jwt_token; // getting the token from the cookies

        if(!token){
            return res.status(401).json({ message: "Unauthorized - No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({ message: "Unauthorized - Invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password"); // select -password to not return the password field

        if(!user){
            return res.status(401).json({ message: "User not found"});
        }

        req.user = user; // By adding the user to the request object, it can be accessed in the next middleware function e.g updateProfile

        next(); // e.g updateProfile in auth.route.js

    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
}