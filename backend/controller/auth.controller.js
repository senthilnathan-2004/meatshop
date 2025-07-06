import { User } from "../model/user.model.js";
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateToken from "../middleware/generateToken.js";

export const register = async (req, res) => {

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });


    if (existingUsername) {
      return res.status(400).json({ message: "Username is already in use" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message:"register successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    //generate token
    generateToken(user._id, res)

    return res.status(200).json({
      message: "Login successful",
    });
    

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const logout = async (req, res) => {
  try {
  
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, address } = req.body;

    user.username = username || user.username;
    user.address = {
      ...user.address,
      ...address
    };

    await user.save();

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const account = async (req,res) =>{
  try {

    const user = await User.findOne({_id : req.user._id})

    return res.status(200).json({
         message: {
         userid: user._id,
         username: user.username,
         email: user.email,
         address: {
            street: user.address?.street || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            pincode: user.address?.pincode || '',
            country: user.address?.country || ''
        }
  }
});
    
  } catch (error) {
    return res.status(500).json({
      message:error.message
    })
  }
}

export const checkAuth = (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.json({ isLoggedIn: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isLoggedIn: true, userId: decoded.userId });
  } catch (error) {
    res.json({ isLoggedIn: false });
  }
};
