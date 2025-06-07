import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../libs/utils.js";
import cloudinary from "../libs/cloudinary.js";

export const signup = async (req, res) => {
  const { email, fullname, password } = req.body;
  try {
    if (!email || !fullname || !password) {
      return res.status(400).json({ message: "Missing required information" });
    }
    if (password.length < 6)
      return res.status(400).json({ message: "Password too short " });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "SKILL ISSUE" });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie with same settings as when it was set
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
      path: "/",
    });

    console.log("User logged out successfully");
    return res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("Error during logout:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, profilePic, bio } = req.body;
    const userId = req.user._id;
    
    // Create an update object with the fields that are provided
    const updateData = {};
    
    // If fullname is provided and valid, add it to the update
    if (fullname && fullname.trim().length >= 3) {
      updateData.fullname = fullname.trim();
    } else if (fullname) {
      return res.status(400).json({
        message: "Full name must be at least 3 characters",
      });
    }
    
    // If bio is provided, add it to the update
    if (bio !== undefined) {
      updateData.bio = bio;
    }
    
    // If profilePic is provided, upload it to cloudinary
    if (profilePic) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        updateData.profilePic = uploadResponse.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({
          message: "Failed to upload profile picture. Please try again.",
        });
      }
    }
    
    // If there's nothing to update, return an error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid data provided for update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
      //By default, findOneAndUpdate() returns the document as it was before update was applied.
      // If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
    ).select("-password");

    // Return the updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // req.user is already set by the protectRoute middleware
    // Send back the user data
    console.log("Auth check succeeded for user:", req.user._id);
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Auth check error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
