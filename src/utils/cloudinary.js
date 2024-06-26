import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET 
});

const uploadCloudinary = async (localFilepath)=>{
    try {
        if(!localFilepath) return null
        //upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilepath, {
            resource_type: "auto"
        })
        //file has been uploaded successfull
        //console.log("file is uploaded in cloudinary", response.url);
        fs.unlinkSync(localFilepath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilepath) //remove te locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadCloudinary}