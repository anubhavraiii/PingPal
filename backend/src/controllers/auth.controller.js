import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const signup = async (req, res) => {
    const { email, fullname, password } = req.body;
    try {
        if(!email || !fullname || !password){
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        if(password.length < 6){
            return res.status(400).json({ message: "Password must be atleast of 6 characters" });
        }

        const user = await User.findOne({email});
 
        if(user){
            return res.status(400).json({ message: "User already exists"});
        }
        // hashing the password
        const salt = await bcrypt.genSalt(10); // Salt is a random string added to the password before it's hashed
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullname,
            password: hashedPassword,
           
        });

        if(newUser){
            // generating a JWT token for the user
            generateToken(newUser._id, res);
            await newUser.save();
            //console.log("Saved user:", newUser);

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                profilePic: newUser.profilePic,
            });
        } else{
            res.status(400).json({ message: "Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne( { email });

        if(!user){
            return res.status(400).json({ message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Invalid credentials"});
        }

        // generating a JWT token for the user
        generateToken(user._id, res);
        
        // sending the user data to the client
        res.status(200).json({ 
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt_token", "", {
            maxAge: 0, // set the cookie to expire immediately
        });
        res.status(200).json({ message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id; // getting userId from req.user which we set in protectRoute middleware

        if(!profilePic){
            return res.status(400).json({ message: "Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic); // uploading the image to cloudinary

        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url,
        }, {new: true} // returns the updated user
        )

        res.status(200).json({ updatedUser });
    } catch (error) {
        console.log("Error in updating Profile", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
}  

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal server error"});
    }  
}