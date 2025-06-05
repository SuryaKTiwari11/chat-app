import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import Loader from "../UI/Loader";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";

const ProfilePage = () => {
    const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const [errors, setErrors] = useState({});
    const [profileData, setProfileData] = useState({
        fullname: "",
        bio: "",
        avatar: "",
    });

    useEffect(() => {
        // Populate form with user data when available
        if (authUser) {
            setProfileData({
                fullname: authUser.fullname || "",
                bio: authUser.bio || "",
                avatar: authUser.avatar || "",
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
        if(!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async() => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            setProfileData({
                ...profileData,
                avatar: base64Image
            });
        }
    }

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        
        if (!profileData.fullname) {
            toast.error("Full Name is required");
            newErrors.fullname = "Full Name is required";
            isValid = false;
        } else if (profileData.fullname.length < 3) {
            toast.error("Full Name must be at least 3 characters");
            newErrors.fullname = "Full Name must be at least 3 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            await updateProfile(profileData);
            toast.success("Profile updated successfully");
            isUpdatingProfile(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    if (!authUser) {
        return <Loader fullScreen size="large" />;
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <Navbar />
            
            <div className="pt-28 pb-16 px-4">
                <div 
                    className="max-w-4xl mx-auto bg-[#1E293B] rounded-2xl overflow-hidden shadow-xl transition-all duration-700 ease-out"
                >
                    {/* Header / Avatar Area */}
                    <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-cyan-500">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative w-32 h-32 rounded-full border-4 border-[#1E293B] overflow-hidden bg-[#1E293B] flex items-center justify-center shadow-lg">
                                {authUser.avatar || selectedImg ? (
                                    <img 
                                        src={selectedImg || authUser.avatar} 
                                        alt={authUser.fullname} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-3xl font-bold">
                                        {authUser.fullname?.charAt(0) || "U"}
                                    </div>
                                )}
                                
                                {/* Camera icon for updating profile picture */}
                            </div>
                                <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-all">
                                    <Camera size={30} />
                                    <input 
                                        type="file" 
                                        id="profile-image-upload" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                        </div>
                    </div>
                    
                    {/* Profile Content */}
                    <div className="pt-20 pb-8 px-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">{authUser.fullname || "User"}</h1>
                            <button
                                onClick={() => updateProfile(!isUpdatingProfile)}
                                className="px-4 py-2 rounded-xl bg-[#334155] hover:bg-[#475569] transition-all duration-200"
                            >
                                {isUpdatingProfile ? "Cancel" : "Edit Profile"}
                            </button>
                        </div>
                        
                        {isUpdatingProfile ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Form Fields */}
                                <div>
                                    <label className="block text-gray-300 mb-2" htmlFor="fullname">
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
                                        <p className="mt-1 text-red-500 text-sm">{errors.fullname}</p>
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
                                        disabled={isUpdatingProfile}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl shadow-md hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center"
                                    >
                                        {isUpdatingProfile ? (
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
                                    <p className="text-white">{authUser.bio || "No bio provided"}</p>
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
                                                {new Date(authUser.createdAt || Date.now()).toLocaleDateString()}
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
