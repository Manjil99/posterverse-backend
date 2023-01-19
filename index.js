import app from "./App.js";
import dotenv from "dotenv";
import connect from "./config/database.js";
import cloudinary from "cloudinary";

dotenv.config();

connect();

cloudinary.config(
   {
      cloud_name:process.env.CLOUDINARY_NAME,
      api_key:process.env.CLOUDINARY_API_KEY,
      api_secret:process.env.CLOUDINARY_API_SECRET
   }
);

app.listen(process.env.PORT , () => {
   // console.log("Server started at ${process.env.PORT}");
})