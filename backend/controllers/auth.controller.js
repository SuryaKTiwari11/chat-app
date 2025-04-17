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
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "SKILL ISSUE" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profile)
      return res.status(400).json({
        message: "profile pic required",
      });
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profile: uploadResponse.secure_url },
      { new: true }
      //By default, findOneAndUpdate() returns the document as it was before update was applied. 
      // If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal error" });
  }
};

export const checkAuth = async(req,res)=>{

  try
  {
    res.status(200).json(
      req.user
    )
  }
  catch(error){
    console.log("error",error.message)
    res.status(500).json({message:"internal server error"})
  }

}