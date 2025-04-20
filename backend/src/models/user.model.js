import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,  
    },
    fullname: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: "",
    }
  },
  { timestamps: true } // For adding createdAt and updatedAt fields
);

const User = mongoose.model('User', userSchema);

export default User;   