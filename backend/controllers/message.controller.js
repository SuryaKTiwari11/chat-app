import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (err) {
    console.log("error in getUserForSidebar controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params; //the id whom i am talking to
    const senderID = req.user._id; //this is my id (logged in user id)

    const messages = await Message.find({
      $or: [
        { senderId: senderID, receiverId: id },
        { senderId: id, receiverId: senderID },
      ],
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessages controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    //extract image or/and text from the request body
    const { text, image } = req.body;
    const { id } = req.params; //the id whom i am talking to
    const senderId = req.user._id; //this is my id (logged in user id)

    let imageURL;
    if (image) { // agar person ne image bheji hai toh
      
      //url ko save karna hai db mei so cloudinary mei upload karna padega
      const UploadImage = await cloudinary.uploader.upload(image);
      //we will get a response
      // we have to save that into the database
      imageURL = UploadImage.secure_url; //this is the url of the image we have uploaded to cloudinary
    }
    //ab mei usko db mei dalunga 
      const newMessage = new Message({
        senderId,
        receiverId: id,
        text,
        image: imageURL,
      });
      await newMessage.save(); 
      return res.status(200).json(newMessage);

      //realtime functionality
      //backend with the help of socket.io
    
  } catch (error) {
    console.log("error in sendMessage controller", error.message);
    res.status(500).json({ message: "internal server error in sendMessage" });
  }
};
