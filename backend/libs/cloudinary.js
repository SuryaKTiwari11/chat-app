import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
import fs from "fs";

configDotenv();

// Check if required environment variables are set
const requiredEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

// Flag to track if Cloudinary is properly configured
let cloudinaryConfigured = true;

if (missingEnvVars.length > 0) {
  console.error("ERROR: Missing required Cloudinary environment variables:");
  missingEnvVars.forEach((varName) => console.error(`- ${varName}`));
  console.error("Image uploads will not work without these variables.");
  cloudinaryConfigured = false;
}

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (cloudinaryConfigured) {
    console.log(
      `Cloudinary configured successfully with cloud name: ${process.env.CLOUDINARY_CLOUD_NAME}`
    );
  }
} catch (error) {
  console.error("Failed to configure Cloudinary:", error.message);
  cloudinaryConfigured = false;
}

// Add a wrapper for upload to handle fallbacks
const enhancedCloudinary = {
  ...cloudinary,
  uploader: {
    ...cloudinary.uploader,
    upload: async (file, options = {}) => {
      try {
        if (!cloudinaryConfigured) {
          throw new Error("Cloudinary is not properly configured");
        }

        // Attempt to upload to Cloudinary
        return await cloudinary.uploader.upload(file, options);
      } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        throw error;
      }
    },
  },
};

export default enhancedCloudinary;
