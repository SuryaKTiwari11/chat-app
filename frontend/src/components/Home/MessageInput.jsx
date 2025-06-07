import { useRef, useState } from "react";

import { Image as ImageIcon, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../../store/useChatStore";
import { successToast, errorToast, loadingToast, updateToast } from "../../utils/toastStyles";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;    // Validate file type
    if (!file.type.startsWith("image/")) {
      errorToast("Please select an image file");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      errorToast("Image size should be less than 5MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    
    // Check if we're online before attempting to compress
    if (!navigator.onLine) {
      errorToast("You appear to be offline. Please check your connection.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }// Create a function to compress images before sending
    const compressImage = (imageFile) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);

        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            // Max dimensions while maintaining aspect ratio - smaller size for better upload
            const MAX_WIDTH = 800; // reduced from 1200
            const MAX_HEIGHT = 800; // reduced from 1200
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }

            // Create canvas for resizing
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            // Draw resized image
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#FFFFFF"; // Add white background to optimize JPG compression
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            // Get compressed image as data URL - increased compression
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.6); // 0.6 quality = 40% compression
            resolve(compressedDataUrl);
          };

          img.onerror = (error) => {
            reject(error);
            toast.error("Failed to process the image");
          };
        };

        reader.onerror = (error) => {
          reject(error);
          toast.error("Failed to read the image file");
        };
      });
    };

    // Compress and preview the image
    try {
      const compressedImage = await compressImage(file);
      setImagePreview(compressedImage);
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error("Failed to process the image");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    // Only show loading indicator for image uploads, as they take longer
    const hasImage = !!imagePreview;
    let toastId;
    
    // Debug log to see what we're sending
    if (hasImage) {
      console.log("Image preview exists, base64 length:", imagePreview.length);
    }    if (hasImage) {
      // Only show toast for image uploads
      toastId = loadingToast("Preparing image for upload...");

      // For images, double-check the size before sending
      try {
        // Calculate base64 size
        const base64Length =
          imagePreview.length - (imagePreview.indexOf(",") + 1);
        const sizeInBytes = base64Length * 0.75; // base64 is ~33% larger than binary
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB > 3) {
          // Image is still large, try compressing further
          updateToast(toastId, "Image is large, compressing further...", "loading");

          // Create temp image for additional compression
          const img = new Image();
          img.src = imagePreview;
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const canvas = document.createElement("canvas");
          // Reduce dimensions further for larger images
          const scale = Math.min(1, 600 / Math.max(img.width, img.height));
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Higher compression for larger images
          const extraCompressedImage = canvas.toDataURL("image/jpeg", 0.5);
          setImagePreview(extraCompressedImage);

          toast.loading("Uploading compressed image...", { id: toastId });
        }
      } catch (compressionError) {
        console.error("Error with additional compression:", compressionError);
        // Continue with original image if extra compression fails
      }
    }

    try {
      // Check if we're online before attempting to send
      if (!navigator.onLine) {
        throw new Error(
          "You appear to be offline. Please check your connection."
        );
      }

      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";      // Dismiss any loading toast for image uploads
      if (hasImage && toastId) {
        updateToast(toastId, "Image sent successfully!", "success");
      }
    } catch (error) {
      console.error("Failed to send message:", error);

      // Enhanced error handling
      if (hasImage && toastId) {
        if (error?.response?.status === 413) {
          updateToast(toastId, "Image too large. Try sending a smaller image.", "error");
        } else if (error?.message?.includes("timeout")) {
          updateToast(
            toastId,
            "Upload timed out. Try with a smaller image or check your connection.",
            "error"
          );
        } else if (
          error?.message?.includes("Network Error") ||
          !navigator.onLine
        ) {
          updateToast(toastId, "Network error. Please check your connection.", "error");
        } else if (error?.response?.status >= 500) {
          updateToast(toastId, "Server error. Please try again later.", "error");
        } else {
          updateToast(toastId, "Failed to send image. Please try again.", "error");
        }
      } else if (!navigator.onLine) {
        errorToast("You appear to be offline. Please check your connection.");
      }
      // Regular text message failures don't need toasts for better UX
    }
  };

  return (
    <div className="p-4 w-full">      {imagePreview && (
        <div className="mb-3 flex items-center gap-2 animate-slide-up">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-indigo-500/30 shadow-md hover:shadow-indigo-500/20 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#1E293B] border border-indigo-500/30
              flex items-center justify-center hover:bg-red-500/20 transition-colors duration-300"
              type="button"
            >
              <X className="size-3.5 text-red-400" />
            </button>
          </div>
        </div>
      )}<form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md bg-[#1E293B] border-[#334155] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />          <button
            type="button"
            className={`hidden sm:flex btn btn-circle bg-[#1E293B] border border-[#334155] hover:bg-[#334155] hover:border-indigo-500 transition-colors duration-300 
                     ${imagePreview ? "text-emerald-500" : "text-indigo-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={20} className={`${imagePreview ? "animate-pulse-once" : ""}`} />
          </button>
        </div>
        <button
          type="submit"
          className={`btn btn-sm btn-circle ${
            text.trim() || imagePreview ? "bg-gradient-to-r from-indigo-500 to-cyan-500 border-none hover:shadow-md hover:shadow-indigo-500/30" : "bg-[#1E293B] border-[#334155]"
          } transition-all duration-300`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} className={text.trim() || imagePreview ? "text-white" : "text-gray-400"} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
