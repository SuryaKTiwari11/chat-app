import User from "../models/user.model";

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
    const { id } = req.params;
  } catch (error) {
    console.log("error in getMessages controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
