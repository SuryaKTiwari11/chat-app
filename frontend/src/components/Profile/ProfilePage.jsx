import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import Loader from "../UI/Loader";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";
import {
  successToast,
  errorToast,
  loadingToast,
  updateToast,
} from "../../utils/toastStyles";

const ProfilePage = () => {
  const { authUser, updateProfile: updateUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState({
    fullname: "",
    profilePic: "",
    bio: "",
  });

  useEffect(() => {
    // Populate form with user data when available
    if (authUser) {
      setProfileData({
        fullname: authUser.fullname || "",
        profilePic: authUser.profilePic || "",
        bio: authUser.bio || "",
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      errorToast("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      errorToast("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      setIsUploadingImage(true);

      const toastId = loadingToast("Updating profile picture...");

      try {
        // Compress image if it's large
        let imageToUpload = base64Image;
        const base64Length =
          base64Image.length - (base64Image.indexOf(",") + 1);
        const sizeInBytes = base64Length * 0.75; // base64 is ~33% larger than binary
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB > 2) {
          // Create temp image for compression
          const img = new Image();
          img.src = base64Image;
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const canvas = document.createElement("canvas");
          // Reduce dimensions for larger images
          const scale = Math.min(1, 800 / Math.max(img.width, img.height));
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Compress image
          imageToUpload = canvas.toDataURL("image/jpeg", 0.7);
          updateToast(toastId, "Compressing image...", "loading");
        }
        // Call API to update profile picture
        const updatedUserData = await updateUserProfile({
          ...profileData,
          profilePic: imageToUpload,
        });

        // Update profileData with the new image
        setProfileData((prevData) => ({
          ...prevData,
          profilePic: updatedUserData.profilePic || imageToUpload,
        }));

        // Force a refresh on images across the app
        const timestamp = new Date().getTime();
        const profilePicWithTimestamp = updatedUserData.profilePic.includes("?")
          ? `${updatedUserData.profilePic}&t=${timestamp}`
          : `${updatedUserData.profilePic}?t=${timestamp}`;

        // Update all img tags with the profile picture
        document
          .querySelectorAll('img[src="' + authUser.profilePic + '"]')
          .forEach((img) => {
            img.src = profilePicWithTimestamp;
          });

        updateToast(
          toastId,
          "Profile picture updated successfully!",
          "success"
        );
      } catch (error) {
        console.error("Error updating profile picture:", error);
        updateToast(toastId, "Failed to update profile picture", "error");
      } finally {
        setIsUploadingImage(false);
      }
    };
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!profileData.fullname) {
      errorToast("Full Name is required");
      newErrors.fullname = "Full Name is required";
      isValid = false;
    } else if (profileData.fullname.length < 3) {
      errorToast("Full Name must be at least 3 characters");
      newErrors.fullname = "Full Name must be at least 3 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateUserProfile(profileData);
      successToast("Profile updated successfully");
      // Keep the form in edit mode so the user can see the changes
    } catch (error) {
      console.error("Error updating profile:", error);
      errorToast("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authUser) {
    return <Loader fullScreen size="large" />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto bg-[#1E293B] rounded-2xl overflow-hidden shadow-xl transition-all duration-700 ease-out">
          {/* Header / Avatar Area */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-cyan-500 animate-gradient bg-300%">
            <div className="absolute -bottom-16 left-8">
              <div className="relative w-32 h-32 rounded-full border-4 border-[#1E293B] overflow-hidden bg-[#1E293B] flex items-center justify-center shadow-lg group">
                {selectedImg || authUser.profilePic ? (
                  <img
                    src={selectedImg || authUser.profilePic}
                    alt={authUser.fullname}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      selectedImg ? "animate-pulse-once" : ""
                    }`}
                    onError={(e) => {
                      e.target.onerror = null;
                      // Create initial avatar when image fails to load
                      const canvas = document.createElement("canvas");
                      canvas.width = 100;
                      canvas.height = 100;
                      const ctx = canvas.getContext("2d");

                      // Create gradient background
                      const gradient = ctx.createLinearGradient(0, 0, 100, 100);
                      gradient.addColorStop(0, "#6366f1"); // indigo-500
                      gradient.addColorStop(1, "#22d3ee"); // cyan-400
                      ctx.fillStyle = gradient;
                      ctx.fillRect(0, 0, canvas.width, canvas.height);

                      // Add text
                      ctx.fillStyle = "white";
                      ctx.font = "50px Arial";
                      ctx.textAlign = "center";
                      ctx.textBaseline = "middle";
                      ctx.fillText(
                        authUser.fullname[0]?.toUpperCase() || "U",
                        canvas.width / 2,
                        canvas.height / 2
                      );
                      e.target.src = canvas.toDataURL();
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-3xl font-bold">
                    {authUser.fullname?.charAt(0) || "U"}
                  </div>
                )}

                {/* Camera icon for updating profile picture */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div
                    className={`${
                      isUploadingImage ? "flex" : "hidden"
                    } absolute inset-0 bg-black/70 items-center justify-center`}
                  >
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p
                    className={`text-white text-sm font-medium ${
                      isUploadingImage ? "hidden" : "block"
                    }`}
                  >
                    Change Photo
                  </p>
                </div>
              </div>
              <label
                htmlFor="profile-image-upload"
                className={`absolute bottom-0 right-0 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full p-2 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-110 ${
                  isUploadingImage
                    ? "opacity-50 cursor-wait pointer-events-none"
                    : ""
                }`}
              >
                <Camera size={24} className="text-white" />
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                {authUser.fullname || "User"}
              </h1>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  isEditing
                    ? "bg-[#334155] hover:bg-[#475569] border border-indigo-500/30"
                    : "bg-gradient-to-r from-indigo-500/80 to-cyan-500/80 hover:from-indigo-500 hover:to-cyan-500 shadow-md hover:shadow-indigo-500/20"
                }`}
              >
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields */}
                <div>
                  <label
                    className="block text-gray-300 mb-2"
                    htmlFor="fullname"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    value={profileData.fullname}
                    onChange={handleChange}
                    className={`w-full bg-[#0F172A] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                      errors.fullname ? "border border-red-500" : ""
                    }`}
                  />
                  {errors.fullname && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.fullname}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="email">
                    Email (Read Only)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={authUser.email}
                    disabled
                    className="w-full bg-[#0F172A] rounded-xl px-4 py-3 opacity-70 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={profileData.bio}
                    onChange={handleChange}
                    className="w-full bg-[#0F172A] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl shadow-md hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-gray-400 text-sm">Email</h2>
                  <p className="text-white text-lg">{authUser.email}</p>
                </div>

                <div>
                  <h2 className="text-gray-400 text-sm">Bio</h2>
                  <p className="text-white">
                    {authUser.bio || "No bio provided"}
                  </p>
                </div>

                <div className="border-t border-gray-700 pt-6 mt-6">
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-300">Online</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Member since: </span>
                      <span className="text-gray-300">
                        {new Date(
                          authUser.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
