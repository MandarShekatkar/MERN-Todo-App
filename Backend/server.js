import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './route/authRoutes.js';
import cookieParser from 'cookie-parser';
import todoRoutes from './route/todoRoutes.js';

dotenv.config();

connectDB();
const app = express();

// middleware
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));

app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/',(req,res)=>{
    res.send("API is running")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server runing on port ${PORT}`);
    
});
