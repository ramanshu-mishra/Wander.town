import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middlewares/middleware.js";
import { PrismaClient } from "@repo/database/prisma";
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

router.get("maps", async (req,res)=>{
    // @ts-ignore 
    const userId = req.user.id;
    const maps = await prisma.defaultMaps.findMany();
    res.status(200).json({maps})
})

router.get("/avatar-elements", async (req,res)=>{
//  get all elements of avatars

// @ts-ignore 
    const userId = req.user.id;
    const [hair,color,beard,mustache,shirt,pant,eyes] = await prisma.$transaction([
        prisma.hair.findMany(),
        prisma.color.findMany(),
        prisma.beard.findMany(),
        prisma.mustache.findMany(),
        prisma.shirts.findMany(),
        prisma.pants.findMany(),
        prisma.eyes.findMany()
    ]);
    res.status(200).json({hair,color,beard,mustache,shirt,pant,eyes})
    
});

router.post("/createSpace", async (req,res)=>{
    const map_id = req.body.map_id;
    // @ts-ignore
    const userId= req.user.id;
   
    const mp = await prisma.defaultMaps.findUnique({where: {id:map_id}});
    if(!mp){res.status(500).json({message: "Server Side Error"}); return;}
    const newmp = await prisma.maps.create({data:{height:mp?.height, width:mp?.width, image: mp?.image, thumbnail: mp?.thumbnail}})
    if(!newmp){res.status(500).json({message: "Server Side Error"}); return;}
    
   
     const newspace = await prisma.spaces.create({
        data: {
            map_id: newmp.id,
            host_id: userId,
        }
    });
    if(!newspace){res.status(500).json({message: "Server Side Error"}); return;}

    const uppdatedmp  = prisma.maps.update({
        where:{id:newmp.id},
        data: {spaceId: newspace.id}
    })
    if(!uppdatedmp){res.status(500).json({message: "Server Side Error"}); return;}
    res.status(200).json({message: "new space created", spaceId: newspace.id});
    return;
})

router.get("/space/:spaceId", (req,res)=>{
    // get a space --get map details, 
})

router.get("/deleteSpace:spaceId", (req,res)=>{
    //  delete a space with particular spaceid


    // need to return map and element data in below format
// {
//    "dimensions": "100x200",
//    "elements": [{
//  		   id: 1,
// 		   element: {
//   		   "id": "chair1",
//   		   "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//   		   "static": false,
//   		   "height": 1,
//   		   "width": 1
// 		   }
// 		   x: 20,
// 		   y: 20
// 	   }, {
//  		   id: 2,
// 	     element: {
//   		   "id": "chair2",
//   		   "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//   		   "static": false,
//   		   "height": 1,
//   		   "width": 1
// 		   }
// 		   x: 18,
// 		   y: 20
// 	   }, {
//  		   id: 3,
// 	     element: {
//   		   "id": "table1",
//   		   "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5El5F7QtBVHhSpkQMSzPSDoiQWl3Q7fRG3w&s",
//   		   "static": true,
//   		   "height": 1,
//   		   "width": 1		   
// 		   }
// 		   x: 19,
// 		   y: 20
// 	   }
//    ]
// }
})


router.post('/avatar', (req,res)=>{
    //  create an avatar of choice and update current user avatar with that one and delete previous user avatar
})

// in the webSocket connection server will get the user id he can fetch all his details through it from prismaClient, 

router.post('/member:spaceId', (req,res)=>{
    // check if the user is host or not
    // if yes 
    // promote a user to member
})

router.post("/cohost:spaceId", (req,res)=>{
    // check if the user is host or not
    // if yes
    // promote the user to cohost
})


router.post("/addElement/:spaceId", (req,res)=>{
    //  check if host or not;
    //  check map dimentions and corrdinates of where to ad elements
    // if all valid add the element
})

router.post("/deleteElement/:spaceId", (req,res)=>{
    // check if host or not;
    // if yes delete the element from space
})













