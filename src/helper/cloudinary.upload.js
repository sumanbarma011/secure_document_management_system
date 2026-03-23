import cloudinary from "../config/cloudinary.js";
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log(result);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error while uploading to clodinary", error);
    throw new Error();
  }
};
export default uploadToCloudinary;
