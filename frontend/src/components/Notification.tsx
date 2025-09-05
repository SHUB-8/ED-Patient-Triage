import React from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${getTypeStyles()}`}>
      <div className="flex items-center">
        <span className="mr-2">{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200 font-bold">
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;