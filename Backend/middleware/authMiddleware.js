import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async(req, res, next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({
                success:false,
                message:"Not Authorized",
            });
        }
        // verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        // get user
        const user = await User.findById(decoded.id).select('-password');

        if(!user){
            return res.json({
                success:false,
                message:"User Not Found",
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.json({
            success:false,
            message:"Not Authorized, Token Failed",
        });
    }    
}
export default protect;
