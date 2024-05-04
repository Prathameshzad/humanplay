import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";  
import {User} from "../models/user.model.js";
import {uploadCloudinary} from "../utils/cloudinary.js";   
import {apiResponse} from "../utils/apiResponse.js"   

const registerUser = asyncHandler( async (req,res) => {
   //get user details from frontend 
   //validation- not empty
   //check whether is user is already exists: username, email
   //check for images and avatar 
   //upload them to cloudinary, avatar
   //create an object - create entry in db
   //remove password and refresh token field from response
   //check for user creation 
   //return res

   const {fullName, email, username, password} = req.body
   console.log("email", email);

   if(
      [fullName, email, username, password].some((field)=>field?.trim()==="")
   ){
         throw new apiError(400, "All fields are required")
   }

   const existedUser = await User.findOne({
      $or: [{username}, {email}]
   })

   if(existedUser){
      throw new apiError(409, "User with email or username already exists") 
   }

   console.log(req.files);

   const avatarlocalPath = req.files?.avatar[0]?.path;
   //const coverImageLocalPath = req.files?.coverImage[0]?.path;

   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImageLocalPath = req.files.coverImage[0].path
   }

   if(!avatarlocalPath){
      throw new apiError("400", "Avatar file is required")
   }

  const avatar = await uploadCloudinary(avatarlocalPath)
   const coverImage = await uploadCloudinary(coverImageLocalPath)

   if(!avatar){
      throw new apiError("400", "Avatar file is required")
   }

   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })

   const createUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if(!createUser){
      throw new apiError(500, "something went wrong while registering")
   }

   return res.status(201).json(
      new apiResponse(200, createUser, "User registerd succesfully")
   )
})

export {registerUser}   