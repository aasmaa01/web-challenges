import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router()
const prisma = new PrismaClient()

//Post /api/auth/register
router.post("/register", async(req, res)=>{
    try {
        
    //email, password, confirmPass, name age>18
    const {email, password, confirmPassword, name, age}= req.body;
    if (password !==confirmPassword) {
        return res.status(400).json({message: "password don't match!"})
    }
    

    if (age<18){
        return res.status(400).json({message: "You must have at least 18 years old!"})
    }
    const existingUser = await prisma.user.findUnique({where: {email}})
    if (existingUser){
        return res.status(400).json({message:"email alredy have an account"})
    }

    const emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    if (!emailRegex.test(email)) {
    return res.status(400).json({message:"Invalid email Format!"})        
    }
    //hash password bcrypt 
    const hashedPassword = await bcrypt.hash(password, 10)
    //user in data base
    const user = await prisma.user.create({data: {email, password: hashedPassword, name, age}})

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET ||"jwtSecret",{expiresIn: "1h", })

    const {password :_, ...userWithoutPassword }= user

    res.status(201).json({message:"User Register succesfully!", data: {user: userWithoutPassword, token},})
    
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "something was wrong!"})
    }
})

router.post("/login", async(req,res)=>{
    try{

        const {email, password}= req.body;
        const userExist = await prisma.user.findUnique({where: {email}});
        if (!userExist) {
            return res.status(404).json({message: "User not found!"})       
        }
        const isValidPassword = await bcrypt.compare(password, userExist.password)
        if(!isValidPassword){
            return res.status(401).json({message:"Invalid password!"})
        }

        const token= jwt.sign({userId: userExist.id },process.env.JWT_SECRET || "jwtSecret", {
            expiresIn:"1h",

        })
        //userExist.password= undefined
        const {password: _, ...userWithoutPassword}=userExist

        res.status(200).json({
            message:"Login successful", data : {user : userWithoutPassword, token}
        })
    }catch(error){
        console.error(error)
        res.status(500).json({message:"something was wrong!"})
    }
})

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Missing refresh token" });

  const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }

  const newAccessToken = jwt.sign({ userId: storedToken.userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  res.json({ accessToken: newAccessToken });
});


export default router;
