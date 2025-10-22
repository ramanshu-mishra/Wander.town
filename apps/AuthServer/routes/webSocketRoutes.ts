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
        await prisma.space.update({
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




router.post("/cohost/:spaceId", async (req,res)=>{
   const spaceId = req.params.spaceId;
    // @ts-ignore
    const userId = req.user.id
    const targetUser = req.body.targetUser;

     try{
        await prisma.space.update({
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


router.post("/placeElement/:spaceId", check_WS_Host, async(req,res)=>{
    const spaceId = req.params.spaceId; //spaces are tied to their respectve maps
    const elementId = req.body.elementId;
    const position = req.body.position;

    try{
    const updatedMap = await prisma.map.update({
        where:{
            spaceId: spaceId as string
        },
        data:{
            elements:{
                create:{
                    elementId: elementId,
                    x: position.x,
                    y: position.y
                }
            }
        },
        include:{
            elements:true
        }
    });

    res.status(200).json({
        message: "Element added Succcesfully",
        updatedMap
    })
}
catch(e){
    const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    });
    return;
}
})

router.post("/deleteElement/:spaceId", check_WS_Host ,async(req,res)=>{
    const spaceId = req.params.spaceId as string;
    const elementId = req.body.elementId;
    
    try{
   const updatedMap = await prisma.map.update({
    where:{
        spaceId:spaceId
    },
    data:{
        elements:{
            delete:{
                id: elementId
            }
        }
    },
    include:{
        elements:true
    }
   })

   res.status(200).json({
    message: `element ${elementId} deleted succesfully`,
    updatedMap
   })
   return;
}
catch(e){
    const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    });
    return;
}
});





