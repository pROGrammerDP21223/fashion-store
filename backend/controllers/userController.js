
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import validator from 'validator';
import jwt from 'jsonwebtoken';


const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}



const loginUser = async (req,res) =>{
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({success:false, message : "User Doesn't Exists"})
            
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id)
            res.json({success:true, token})
            
        }
        else{
             res.json({success:false, message : "Invalid Credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }

}



const registerUser = async (req,res) =>{
    try {
        const {name, email, password} =req.body;
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false, message : "User Already Registerd"})
        }
        if (!validator.isEmail(email)) {
            return res.json({success:false, message : "Please Enter Valid Email"})
        }
        if (password.length < 8) {
            return res.json({success:false, message : "Please Enter Strong Password"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUSER = new userModel({
            name,
            email,
            password: hashPassword
        })
        const user= await newUSER.save();
        const token = createToken(user._id);
        res.json({success:true, token})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}


const adminLogin = async (req,res) =>{

    try {
        const {email, password} = req.body;
       
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true, token})
        }
        else{
            res.json({success:false, message : "Invalid Credentials"})
       }
      
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}


export {loginUser,registerUser,adminLogin}