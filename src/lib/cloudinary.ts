import { v2 as cloudinary } from "cloudinary";
// const CLAUD_NAME = import.meta.env.CLOUD_NAME
// const API_KEY = import.meta.env.API_KEY
// const API_SECRET = import.meta.env.API_SECRET



cloudinary.config({
  cloud_name: "r6grbo0p",
  api_key: "194188655976336",
  api_secret: "TgqEWwPqpkz2a5mI5ij9Fyi81g"
})

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file)
  formData.append('upload_preset', "your_upload_preset")

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, // Replace with your Cloudinary cloud name
      {
        method: "POST",
        body: formData,
      }
    )

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url
    } else {
      throw new Error("Failed to uplaud image to cloudinary")
    } 
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
}