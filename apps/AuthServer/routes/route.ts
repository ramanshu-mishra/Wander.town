import express, { type Request, type Response } from "express";
const router = express.Router();
import passport from "passport";
import bcrypt from "bcrypt"
import "../passport.js";
// @ts-ignore
import {loginSchema, signupSchema} from "@repo/utils/zodTypes";
// @ts-ignore 
import {PrismaClient} from "@repo/database/prisma";
const prisma = new PrismaClient();
import { isAuthenticated } from "../middlewares/middleware.js";
import jwt from "jsonwebtoken";





router.post("/login", passport.authenticate("local"),async (req,res)=>{
    const username = req.body.username;
    try{
        const usr = await prisma.user.findUnique({
            where : {
                username
            }
        })
        if(!usr){res.redirect("/login-failure");return;}
        if(usr.activeSession &&  usr.activeSession != req.sessionID){
            req.sessionStore.destroy(usr.activeSession, (err)=>{
                if(err)console.log(err);
                else{
                    console.log("old session destroyed");
                }
            })
        }
        const updatedusr = await prisma.user.update({
            where:{
                username: username
            },
            data:{
                activeSession: req.sessionID
            }
        })
    }
    catch(e){
        const msg = e instanceof Error? e.message : "Server Side Error"
        res.status(500).json({message: msg})
        return;
    }
    res.redirect("/login-success");
    return;
})

router.get("/auth/google", passport.authenticate("google", {scope: ['profile']}));

// router.get("/auth/google/callback", passport.authenticate("google", {failureRedirect: "/login-failure", successRedirect: "/login-success"}))

router.get("/auth/google/callback", passport.authenticate("google"), async (req,res)=>{
    // @ts-ignore
    const userId:string|undefined = req.user?.id;
    console.log("user id is: "+userId);
    try{
        const usr = await prisma.user.findUnique({
            where:{
                id: userId as string
            }
        });
        if(!usr){res.redirect("/login-failure")}
        if(usr?.activeSession &&  req.sessionID != usr?.activeSession){
            req.sessionStore.destroy(usr.activeSession, (err)=>{
                if(err)console.log(err);
                else{
                    console.log("old session destroyed");
                }
            })
        }
        const updatedusr = await prisma.user.update({
            where: {id:userId as string},
            data:{activeSession: req.sessionID}
        })
    }
    catch(e){
        const msg = e instanceof Error ? e.message : "ServerSide Error"
        res.status(500).json({message: msg});
        return;
    }
    res.redirect("/login-success");
    return;

})

router.get("/login-success", (req,res)=>{
    // @ts-ignore 
    const userId = req.user.id;
    console.log(userId);

    // this token will be used for authentication in webSocket connection
    const token = jwt.sign({userId: userId}, process.env.JWT_SECRET as string);

    res.status(200).json({message: "user logged in succesfully", token: "Bearer "+token});
})

router.get("/login-failure", (req,res)=>{
    res.status(200).json({message: "could not login"})
})




router.post("/signUp", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    
    const s = signupSchema.safeParse({username, password, name});

    if(!s.success){
        res.status(400).json({message: "Invalid credentials"})
        return
    }
    
    const user = await prisma.user.findUnique({
        where:{
            username:s.data.username
        }
    });
    if(user){
        res.status(300).json({
            message: "username already exists"
        })
        return;
    }

    try{
    const hashedpass = await  bcrypt.hash(s.data.password, 10);
    const regUser = await prisma.user.create({
        data: {
            username: s.data.username,
            password: hashedpass,
            name: name
        }
    });

    
    res.status(200).json({message: "user registered succesfully"})
    return;
    }
    catch(e){
        const msg = e instanceof Error ? e.message : "Server Side Error";
        
        res.status(500).json({message: msg});
    }   
})

router.get("/", isAuthenticated, (req:Request,res:Response)=>{
    
    res.status(200).json({message: "server running fine"})
})

router.get("/unAuthorized-session", (req,res)=>{
    res.status(405).json({message: "unauthorized-session"})
})


router.get("/isAuthenticated", isAuthenticated, (req,res)=>{
    res.status(200).json({message: "user Authenticated"});
})


export default router;