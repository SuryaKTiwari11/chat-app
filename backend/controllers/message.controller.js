import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import enhancedCloudinary from "../libs/cloudinary.js";
import { getReceiverSocketId, io } from "../libs/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    console.log("Getting users for user ID:", loggedInUserId);

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }, // Fixed: Changed 'id' to '_id'
    }).select("-password");

    console.log("Found users for sidebar:", filteredUsers.length);
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

    // Validate input
    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "Message must contain text or image" });
    }

    if (id === senderId) {
      return res
        .status(400)
        .json({ message: "Cannot send message to yourself" });
    }

    let imageURL;
    if (image) {
      try {
        console.log("Uploading image to Cloudinary...");

        // Validate that image is a valid base64 string
        if (!image.startsWith("data:image/")) {
          console.error("Invalid image format received");
          return res.status(400).json({ message: "Invalid image format" });
        }

        // Estimate base64 size in MB (rough calculation)
        const base64Length = image.length - (image.indexOf(",") + 1);
        const sizeInBytes = base64Length * 0.75; // base64 is ~33% larger than binary
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB > 5) {
          console.error(`Image too large: ${sizeInMB.toFixed(2)}MB (max: 5MB)`);
          return res
            .status(413)
            .json({ message: "Image too large. Maximum size is 5MB" });
        }

        // Upload with explicit options for better performance
        const uploadOptions = {
          resource_type: "image",
          folder: "chat-app-messages",
          timeout: 60000, // 60 seconds timeout
          transformation: [
            { quality: "auto" }, // Automatically optimize quality
            { fetch_format: "auto" }, // Automatically use best format
          ],
        };
        console.log(
          "Starting Cloudinary upload with options:",
          JSON.stringify(uploadOptions)
        );
        console.log("Image data starts with:", image.substring(0, 50) + "...");
        console.log("Image data length:", image.length);
        console.log(
          "Using Cloudinary config:",
          process.env.CLOUDINARY_CLOUD_NAME
        );

        const uploadImage = await enhancedCloudinary.uploader.upload(
          image,
          uploadOptions
        );

        if (!uploadImage || !uploadImage.secure_url) {
          throw new Error("Cloudinary upload did not return expected response");
        }
        console.log(
          "Upload successful, response:",
          JSON.stringify(uploadImage, null, 2)
        );

        imageURL = uploadImage.secure_url;
        console.log("Image uploaded successfully:", uploadImage.public_id);
      } catch (imageError) {
        console.error("Cloudinary upload failed:", imageError.message);

        // Send specific error for Cloudinary issues
        if (imageError.http_code === 413) {
          return res
            .status(413)
            .json({ message: "Image too large. Maximum size is 5MB" });
        }

        // Return generic error for other upload issues
        return res
          .status(500)
          .json({ message: "Failed to upload image. Please try again." });
      }
    }

    //ab mei usko db mei dalunga
    const newMessage = new Message({
      senderId,
      receiverId: id,
      text,
      image: imageURL,
    });

    await newMessage.save();

    // Get receiver's socket id and emit message
    const receiverSocketId = getReceiverSocketId(id);
    if (receiverSocketId) {
      console.log(`Emitting message to receiver socket ${receiverSocketId}`);
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } else {
      console.log(
        `Receiver ${id} is not connected, message will be delivered when they connect`
      );
    }

    // Emit to sender's socket as well for immediate UI update
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json(newMessage);

    //realtime functionality
    //backend with the help of socket.io
  } catch (error) {
    console.log("error in sendMessage controller", error.message);
    res.status(500).json({ message: "internal server error in sendMessage" });
  }
};
