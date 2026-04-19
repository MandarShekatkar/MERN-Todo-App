import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'7d',
    })
};

// REGISTER
export const register = async(req, res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({
            success: false,
            message: "All Fields Are Required",
        });
    }

    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({
                success:false,
                message:"User Already Exists",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });

        // generate token
        const token = generateToken(user._id);

        // store in cookie
        res.cookie("token", token,{
            httpOnly: true,
            secure:false,
            sameSite:"strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            message: "User Registered Successfully",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        return res.json({
            success:false,
            message: error.message,
        });
    }
};

// LOGIN
export const login = async(req,res)=>{
    const {email, password} = req.body;

    // check missing fields
    if(!email || !password){
        return res.json({
            success:false,
            message: "Email & Password Are Required",
        });
    }
    try {
        // find user 
        const user = await User.findOne({email})

        if(!user){
            return res.json({
                success:false,
                message:"Invalid Email And Password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({
                success:false,
                message: "Invalid Email Or Password",
            });
        }
        // Generate Token
        const token = generateToken(user._id);

        // store in cookie
        res.cookie("token", token,{
            httpOnly:true,
            secure:false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success:true,
            message:"Login Successful",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        return res.json({
            success:false,
            message: error.message,
        });
    }
};

// LOGOUT
export const logout = async(req, res)=>{
    try {
        res.clearCookie("token");

        return res.json({
            success:true,
            message:"Logged Out Successfully",
        });

    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        });
    }
};