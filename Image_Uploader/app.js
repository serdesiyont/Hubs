import express from "express"
import {v2 as cloudinary} from "cloudinary"
import dotenv from 'dotenv'
import multer from 'multer'

dotenv.config()

const server = express()

server.use(express.static('frontend'))
server.listen(3000, () => {
    console.log("runnig at 3000");
    
})

    
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});
   
async function upload_image(path) {
     // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           path, {
               public_id: 'collection',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
}


const upload = multer({dest: 'uploads/'})
  
server.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const filePath = req.file.path;
      await upload_image(filePath); 
      res.json({ message: 'File uploaded successfully!', filePath });
    } catch (error) {
      res.status(500).json({ error });
    }
  });




    // // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });
    
    // console.log(autoCropUrl);    

