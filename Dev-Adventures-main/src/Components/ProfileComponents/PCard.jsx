import React, { useState, useRef } from 'react';
export default function Avatar() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="relative">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <div 
        className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden"
      >
        {image ? (
          <img 
            src={image} 
            alt="Profile" 
            className="h-full w-full object-cover"
            onClick={triggerFileInput}
          />
        ) : (
          <span 
            className="text-4xl text-gray-400 cursor-pointer"
            onClick={triggerFileInput}
          >
            AB
          </span>
        )}
      </div>
    </div>
  );
}