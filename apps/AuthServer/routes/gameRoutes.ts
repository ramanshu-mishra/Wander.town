import express from "express";
const router = express.Router();
import { isAuthenticated, checkHost } from "../middlewares/middleware.js";
import { PrismaClient } from "@repo/database/prisma";
import { check, date, nanoid } from "zod";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

router.use(isAuthenticated);

router.get("/spaces/all", async(req,res)=>{
    // @ts-ignore
const userId = req.user.id;
const spaces = await prisma.spaces.findMany({
    where: {
        host_id: userId
    }
})
res.status(200).json({spaces});
});

router.get("/spaces/mySpaces", async(req,res)=>{
    // @ts-ignore
    const userId = req.user.id
    const spaces = await prisma.spaces.findMany({
        where: {
            host_id: userId
        },
        include:{
            map: true
        }
    });
    res.status(200).json({spaces})
})

router.get("/maps", async (req,res)=>{
    // @ts-ignore 
    const userId = req.user.id;
    const maps = await prisma.defaultMaps.findMany();
    res.status(200).json({maps})
})

router.get("/avatar-elements", async (req,res)=>{
//  get all elements of avatars

// @ts-ignore 
    const userId = req.user.id;
    try{
    const [hair,color,beard,mustache,shirt,pant,eyes] = await prisma.$transaction([
        prisma.hair.findMany(),
        prisma.color.findMany(),
        prisma.beard.findMany(),
        prisma.mustache.findMany(),
        prisma.shirts.findMany(),
        prisma.pants.findMany(),
        prisma.eyes.findMany()
    ]);

    res.status(200).json({hair,color,beard,mustache,shirt,pant,eyes});
    return;
}
catch{
    res.status(500).json({message: "Server Side Error"});
    return;
}
    
});

router.post("/createSpace", async (req,res)=>{
    const map_id = req.body.map_id;
    const name = req.body.name;
    // @ts-ignore
    const userId= req.user.id;
    if(!name || !map_id || !userId){
        res.status(404).json({
            message: "INVALID_REQUEST_PARAMETERS"
        })
    }
    const mp = await prisma.defaultMaps.findUnique({where: {id:map_id}});
    if(!mp){res.status(500).json({message: "Server Side Error"}); return;}
    const newmp = await prisma.maps.create({data:{height:mp?.height, width:mp?.width, image: mp?.image, thumbnail: mp?.thumbnail}})
    if(!newmp){res.status(500).json({message: "Server Side Error"}); return;}
    
   
     const newspace = await prisma.spaces.create({
        data: {
            map_id: newmp.id,
            host_id: userId,
            name: name
        }
    });
    if(!newspace){res.status(500).json({message: "Server Side Error"}); return;}

    const uppdatedmp  = prisma.maps.update({
        where:{id:newmp.id},
        data: {spaceId: newspace.id},
        select:{
            thumbnail:true
        }
    })
    if(!uppdatedmp){res.status(500).json({message: "Server Side Error"}); return;}
    res.status(200).json({message: "new space created", spaceId: newspace.id, name: newspace.name, thumbnail: (await uppdatedmp).thumbnail});
    return;
})

router.get("/space/:spaceId", async (req,res)=>{
    const spaceId = req.params.spaceId;
    // @ts-ignore
    const userId = req.user.id;
    const space = await prisma.spaces.findFirst({
        where: {id: spaceId},
        include:{
            host:{select: {id:true,username:true,avatarId:true, avatar: true}},
            cohosts:{select: {id:true,username:true,avatarId:true, avatar: true}},
            members:{select: {id:true,username:true,avatarId:true, avatar: true}},
            map:{
                include: {
                    elements: {
                        include:{
                            element: true
                        }
                    }
                }
            }
        }
    });
    if(!space){
        res.status(500).json({message: "invalid space"});
        return;
    }
    // next step is to implement the isPublic and password logic in space schema
    const ret = {
        spaceId,
        host: space.host,
        cohosts: space.cohosts,
        members :space.members,
        map : space.map
    }
    // this token will be used to authorize on webSocket Server
    const token = jwt.sign({userId: userId, spaceId: spaceId}, process.env.JWT_SECRET as string);
    res.status(200).json({spaceData: ret, token: "Bearer "+token});
    return;
})

router.get("/deleteSpace:spaceId", async (req,res)=>{
    //  delete a space with particular spaceid
    const spaceId = req.params.spaceId;
    const delSpace = await prisma.$transaction([
        prisma.maps.delete({where: {spaceId: spaceId} }),
        prisma.spaces.delete({where: {id: spaceId}})
    ])
    
})


router.post('/avatar', async (req,res)=>{
    //  create an avatar of choice and update current user avatar with that one and delete previous user avatar
    // @ts-ignore
    const userId = req.user.id;
    const [hair,color,beard,mustache,shirt,pant,eyes] = [req.body.hair,req.body.color,req.body.beard,req.body.mustache,req.body.shirt,req.body.pant,req.body.eyes];
    
    const avatarName = hair.name+color.name+beard.name+mustache.name+shirt.name+pant.name+eyes.name;
    const avatar = await prisma.avatar.findFirst({where:{name:avatarName}});
    if(avatar){
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                avatarId : avatar.id
            }
        });
    }
    res.status(200).json({message: "avatar created succesfully"});

})

// in the webSocket connection server will get the user id he can fetch all his details through it from prismaClient, 
router.post("/addElement/:spaceId", checkHost , async (req,res)=>{
     //  check if host or not;
    //  check map dimentions and corrdinates of where to ad elements
    // if all valid add the element
    // @ts-ignore
    const userId = req.user.id;
    const spaceId = req.params.spaceId;
    const x = req.body.positions.x;
    const y = req.body.positions.y;
    const elementId = req.body.elementId;

    if(!x || !y || !elementId || spaceId){
        res.status(404).json({message: "invalid request parameters"});
        return;
    }
    try{
    const mapid = await prisma.spaces.findFirst({
        where: {
            id: spaceId as string
        },
        select:{
            map_id: true
        }
    })
    if(!mapid){
        res.status(404).json({message: "invalid Space"})
        return;
    }
    const mp = await prisma.mapElements.create({
        data:{
            elementid: elementId as string,
            x,
            y,
            mapid : mapid?.map_id as string
        }
    })
}
catch{
    res.status(500).json({message: "something went wrong"});
    return;
}
res.status(200).json({message: "Element added to Map"});
return;
   
})

router.post("/deleteElement/:spaceId", checkHost , async(req,res)=>{
    // check if host or not;
    // if yes delete the element from space
    const elementId = req.body.elementId;
    const spaceId = req.params.spaceId;
    try{
    const del = await prisma.mapElements.delete({
        where:{
            id:elementId
        }
    });
}
catch{
    res.status(500).json({message: "Server Side Error"});
    return;
}
res.status(200).json({message: "element deleted succesfully"});
})



export default router;











