'use client'
import axios from "axios";
import React from "react";




export default function DisplayImageURL () {

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          const formData = new FormData();
          formData.append("image", file);
    
          try {
            const response = await axios.post("/api/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            console.log("Image URL:", response.data.imageURL);
            const imageURL = response.data.imageURL;
        
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        }
      };
    return (
        <div>
            <h1>Upload Image</h1>
            <form>
                <input type="file" name="image"
                onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    )
}