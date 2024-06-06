import {v2 as nexEvent} from "cloudinary";
import fs from "fs"; 

          
nexEvent.config({ 
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});



const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath || localFilePath.length===0){
            return null;
        }

        const response = await nexEvent.uploader.upload(localFilePath, {
            resource_type: 'auto', // Automatically detect file type
          });
      
          if (response.error) {
            console.error('Error while uploading file:', response.error.message);
            throw new Error('Failed to upload file to Cloudinary');
          }
      
          console.log('Uploaded file URL:', response.url);
      
          // Delete the local file only after successful upload (optional)
          fs.unlinkSync(localFilePath);
      
          return response.url;
    }
    catch(error){
        console.log("error while uploading file",error.message);
        fs.unlinkSync(localFilePath);
        return null;
         
    }
}

export {uploadOnCloudinary}