import express from "express";
import jwt from "jsonwebtoken"
import { check_WS_Host } from "../middlewares/middleware.js";
import { PrismaClient } from "@repo/database/prisma";
const router = express.Router();
const prisma = new PrismaClient();

//  below routes are to be accessed through webSocket server hence should be authenticated using jwt mechanism;

router.use(check_WS_Host);
router.post('/member/:spaceId' ,  async (req,res)=>{
    const spaceId = req.params.spaceId;
    // @ts-ignore
    const userId = req.user.id
    const targetUser = req.body.targetUser;
    try{
        await prisma.spaces.update({
            where: {id: spaceId as string},
            data: {
                cohosts : {
                    disconnect : {id: targetUser}
                },
                members:{
                    connect : {id: targetUser}
                }
            }
        });
    }
    catch(e){   
        res.status(500).json({message: "Server Side Error"});
        return;
    }
    res.status(200).json({user: userId, message: "demoted to member"});
        return;
})




router.post("/cohost:spaceId", async (req,res)=>{
   const spaceId = req.params.spaceId;
    // @ts-ignore
    const userId = req.user.id
    const targetUser = req.body.targetUser;

     try{
        await prisma.spaces.update({
            where: {id: spaceId as string},
            data: {
                cohosts : {
                    disconnect : {id: targetUser}
                },
                members:{
                    connect : {id: targetUser}
                }
            }
        });
    }
    catch(e){   
        res.status(500).json({message: "Server Side Error"});
        return;
    }
     res.status(200).json({user: userId, message: "promoted to cohost"});
        return;
})