// Custom toast styles for the premium blue theme
import { toast } from "react-hot-toast";

// Base styles for all toasts
const baseStyle = {
  borderRadius: "12px",
  background: "#1E293B", // Darker slate
  color: "#f8fafc", // Light text
  padding: "12px 16px",
  boxShadow:
    "0 10px 15px -3px rgba(15, 23, 42, 0.5), 0 4px 6px -2px rgba(15, 23, 42, 0.3)",
  fontWeight: "500",
  border: "1px solid rgba(99, 102, 241, 0.2)", // Subtle indigo border
};

// Success toast with blue/cyan gradient
export const successToast = (message) =>
  toast.success(message, {
    style: {
      ...baseStyle,
      borderLeft: "4px solid",
      borderImageSlice: 1,
      borderImageSource: "linear-gradient(to bottom, #6366f1, #22d3ee)",
    },
    iconTheme: {
      primary: "#22d3ee",
      secondary: "#1E293B",
    },
    duration: 4000,
  });

// Error toast with red gradient
export const errorToast = (message) =>
  toast.error(message, {
    style: {
      ...baseStyle,
      borderLeft: "4px solid #f87272",
    },
    iconTheme: {
      primary: "#f87272",
      secondary: "#1E293B",
    },
    duration: 5000,
  });

// Loading toast with blue gradient
export const loadingToast = (message) =>
  toast.loading(message, {
    style: {
      ...baseStyle,
      borderLeft: "4px solid",
      borderImageSlice: 1,
      borderImageSource: "linear-gradient(to bottom, #6366f1, #22d3ee)",
    },
  });

// Custom toast with info style
export const infoToast = (message, options = {}) =>
  toast(message, {
    style: {
      ...baseStyle,
      borderLeft: "4px solid #3abff8",
    },
    icon: options.icon || "ℹ️",
    duration: options.duration || 3000,
  });

// Update an existing toast (especially useful for loading->success flows)
export const updateToast = (id, message, type) => {
  switch (type) {
    case "success":
      toast.success(message, {
        id,
        style: {
          ...baseStyle,
          borderLeft: "4px solid",
          borderImageSlice: 1,
          borderImageSource: "linear-gradient(to bottom, #6366f1, #22d3ee)",
        },
        iconTheme: {
          primary: "#22d3ee",
          secondary: "#1E293B",
        },
        duration: 4000,
      });
      break;
    case "error":
      toast.error(message, {
        id,
        style: {
          ...baseStyle,
          borderLeft: "4px solid #f87272",
        },
        iconTheme: {
          primary: "#f87272",
          secondary: "#1E293B",
        },
        duration: 5000,
      });
      break;
    default:
      toast(message, { id });
  }
};
