/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ImageIcon } from "lucide-react";

export default function Avatar({ onUpdateSuccess }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found");
        return;
      }
      const decodedToken = jwtDecode(token);
      const uid = decodedToken.sub || decodedToken.userId;
      if (!uid) {
        setError("User ID not found in token");
        return;
      }
      setUserId(uid);
      fetchProfileImage(uid);
    } catch (error) {
      setError("Invalid authentication token");
    }
  }, []);

  const constructImageUrl = (profileImage) => {
    if (profileImage.startsWith("/")) {
      return `http://localhost:5101${profileImage}`;
    }
    return `http://localhost:5101/images/profiles/${profileImage}`;
  };

  const fetchProfileImage = async (uid) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:5101/api/Profile/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.profileImage) {
        const imageUrl = constructImageUrl(response.data.profileImage);
        setImage(imageUrl);
      }
    } catch (err) {
      console.error("Error fetching profile image:", err);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !userId) return;
    try {
      setLoading(true);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");

      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await axios.post(
        `http://localhost:5101/api/Profile/${userId}/profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newImageUrl = constructImageUrl(response.data.profileImage);
      setImage(newImageUrl);

      if (onUpdateSuccess) {
        onUpdateSuccess(response.data.profileImage);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while uploading the image."
      );
      fetchProfileImage(userId);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (!userId) {
      setError("Please log in to update your profile image");
      return;
    }
    fileInputRef.current.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
      />
      <div
        className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden relative cursor-pointer"
        onClick={triggerFileInput}
      >
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        {image ? (
          <img
            src={image}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <ImageIcon className="text-gray-500 h-16 w-16" strokeWidth={1} />
            <span className="text-gray-400 text-xs mt-1">No Image</span>
          </div>
        )}
      </div>
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
    </div>
  );
}