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
        console.log("file uploaded successfully on public folder ");
        const response= await nexEvent.uploader.upload(localFilePath,
            {
                resource_type:"auto"
            })
            //file uploaded successfully
            //now unlinking the file from local storage
        console.log("uploaded file url",response);
        fs.unlinkSync(localFilePath);
        //console.log(response);
        console.log("file is upload on cloudinary",response.url);
        return response;

    }
    catch(error){
            fs.unlinkSync(localFilePath);//remove the local saved temporary file as the upload operation got failed
            return null;

    }
}

export {uploadOnCloudinary}