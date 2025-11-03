import express from "express";
import { PrismaClient } from "@repo/database/prisma";
import { isAuthenticated, checkHost } from "../middlewares/middleware.js";
import jwt from "jsonwebtoken";


const router = express.Router();
const prisma = new PrismaClient();

router.use(isAuthenticated);


//  getRoutes

router.get("/spaces/all", async (req,res)=>{
    // @ts-ignore
    const userId = req.user.id;
    try{
    const spaces = await prisma.user.findFirst({
        where:{
            id: userId
        },
        include:{
            hostSpaces: {
                include:{
                    map:{
                        include:{
                            map:{
                                select:{
                                    thumbnail:true
                                }
                            }
                        }
                    }
                }
            },
            cohostSpaces: {
                include:{
                    map:{
                        include:{
                            map:{
                                select:{
                                    thumbnail:true
                                }
                            }
                        }
                    }
                }
            },
            memberSpaces: {
                include:{
                    map:{
                        include:{
                            map:{
                                select:{
                                    thumbnail:true
                                }
                            }
                        }
                    }
                }
            }
        },
    })

    res.status(200).json({
        spaces
    });
    return;
}
catch(e){
    const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    })
    return;
}
})

router.get("/spaces/mySpaces", async(req,res)=>{
    // @ts-ignore
    const userId = req.user.id

    try{
    const spaces = await prisma.user.findFirst({
        where:{
            id:userId
        },
        include:{
            hostSpaces:{
                include:{
                    map:{
                        include:{
                            map:{
                                select: {
                                    thumbnail: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    res.status(200).json({
        spaces
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

})

router.get("/maps/defaultMaps", async (req,res)=>{
   
    try{
    const maps  = await prisma.defaultMap.findMany();
    res.status(200).json({
        maps
    });
    return;
}
catch(e){
    const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    });
    return;
}
})

router.get("/avatars", async(req,res)=>{
    try{
    const avatars = await prisma.avatar.findMany();
    res.status(200).json({
        avatars
    });
    return;
}
catch(e){
    const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    });
    return;
}
})

router.get("/space/:spaceId", async(req,res)=>{
    // everything related to that space should be given now
    // whenever I connect to a space I should be given a token so that I can verify my ws requests
    // @ts-ignore
    const userId = req.user.id;
    const spaceId = req.params.spaceId;
    try{
    const space = await prisma.space.findFirst({
        where:{
            id: spaceId
        },
        include:{
             host:{select: {id:true,username:true,name:true,email:true}},
            cohosts:{select: {id:true,username:true,name:true,email:true}},
            members:{select: {id:true,username:true,name:true,email:true}},
            users:{ include: {avatar: true}},
            map:{include:{map:true}}
        }
    });

    const token = jwt.sign({
        userId: userId,
        spaceId: spaceId
    }, process.env.JWT_SECRET as string)

    
    
    res.status(200).json({
        token,
        space
    });
    return;
}
catch(e){
    const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    });
    return;
}
})


router.delete("/deleteSpace/:spaceId", checkHost, async(req,res)=>{
    const spaceId = req.params.spaceId
    try{
    const deleteSpace = await prisma.space.delete({
        where:{
            id: spaceId as string
        }
    });

    res.status(200).json({
        message : `space id ${deleteSpace.id} deleted succesfully`
    });

    return;
}
catch(e){
    const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    });
    return;
}
})


router.get("/org/:orgId", async(req,res)=>{
    
    const orgId = req.params.orgId

    try{
    const org = await prisma.organisation.findFirst({
        where:{
            id: orgId
        },
        include:{
            spaces:{
                include:{
                    map: {
                        include: {
                            map: {
                                select:{
                                    thumbnail: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    res.status(200).json({
        org
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
})


// spaces should have admission rules -> OPEN|Password|SelectiveAdd
// host should have super admin access
// cohost should have various levels of access defined by hosts





// post routes

// allow space creation with default avatar choice
// allow avatarSelection
// allow placing element on map by host  
// allow deleting element on map by host
// allow users to createOrgs and place their hosted spaces in orgs
// allow hosts to promote and demote members

router.post("/createSpace", async(req,res)=>{
    // @ts-ignore
    const userId = req.user.id;
    const mapId = req.body.mapId;
    const avatarId = req.body.avatarId;
    const name = req.body.name
    const orgId = req.body.orgId 

    

    try{
        if(!mapId || !avatarId || !name){
        throw new Error("Invalid Payload");
    }
    const space = await prisma.space.create({
        data:{
            name: name,
            hostId: userId,
            orgId: orgId,
            map: {
                create:{
                    mapId: mapId
                }
            },
            users:{
                create:{
                    userid: userId,
                    avatarId: avatarId
                }
            }
        }
    });

    res.status(200).json({
        space
    });
    return;
}
catch(e){
    const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    });
    return;
}
})


router.post("/avatar", async(req,res)=>{
    // @ts-ignore
    const id = req.user.id;
    const spaceId = req.body.spaceId;
    const avatarId = req.body.avatarId;

    try{
    const avatar = await prisma.userSpace.update({
        where:{
            userid_spaceId: {
                userid: id,
                spaceId: spaceId
            }
        },
        data:{
            avatarId: avatarId
        }
    });

    res.status(200).json({
        message: "avatar changed succesfully",
        avatar
    });
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



router.post("/placeElement/:spaceId", checkHost, async(req,res)=>{
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

router.post("/deleteElement/:spaceId", checkHost ,async(req,res)=>{
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
})

router.post("/addToOrg/:orgId", checkHost, async(req,res)=>{
    // @ts-ignore
    const userId = req.user.id;
    const spaceId = req.body.spaceId;
    const orgId = req.params.orgId;

    try{
    const org = await prisma.organisation.findFirst({
        where:{
            id:orgId as string
        }
    });

    if(!org){
        throw new Error("no such org Exists");
    }
    if(org.hostId != userId ){
        throw new Error("unauthorized user request");
    }

    const updatedSpace = await prisma.space.update({
        where:{
            id: spaceId
        },
        data:{
            orgId: orgId as string
        }
    });

    if(!updatedSpace){
        throw new Error("Server Side Error");
    }
    return;
}
catch(e){
     const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    });
    return;
}
    
})


router.post("/createOrg", async(req,res)=>{

    // @ts-ignore
    const userId = req.user.id;

    const parentOrgId = req.body.parentOrg;
    const name = req.body.name;

    try{
    if(parentOrgId){
    const parentOrg = await prisma.organisation.findFirst({
        where:{
            parentOrgId: parentOrgId
        }
    })
    
    if(!parentOrg){
        throw new Error("invalid parentOrgId");
    }
    const hostId = parentOrg.hostId;
    if(userId != hostId){
        throw new Error("Unauthorized org creation request");
    }
}

    const newOrg = await prisma.organisation.create({
        data:{
            parentOrgId: parentOrgId,
            name: name,
            hostId: userId
        }
    });

    res.status(200).json({
        message: "New org created",
        newOrg
    });
    return;
}
catch(e){
    const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    });
    return;
}
})



router.get("/userDetails", async(req,res)=>{
    // @ts-ignore
    const userId = req.user.id;

    try{
    const userDetails = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select:{
            id:true,
            name:true,
            username:true,
            email:true,
            image:true,
            spaces:{
                select:{
                    spaceId:true,
                    avatarId:true,
                    lastVisit:true
                }
            },
            hostSpaces:{
                select:{
                    id:true,
                    name:true,
                    orgId:true,
                    organisation:{
                        select:{
                            id:true,
                            name:true
                        }
                    },
                    map:{
                        select:{
                            id: true,
                            map:{
                                select:{
                                    id:true,
                                    name:true,
                                    thumbnail:true
                                }
                            }
                        }
                    },
                    users:{
                        select:{
                            userid:true,
                            avatarId:true,
                            lastVisit:true
                        }
                    }
                }
            },
            cohostSpaces:{
                select:{
                    id:true,
                    name:true,
                    orgId:true,
                    organisation:{
                        select:{
                            id:true,
                            name:true
                        }
                    },
                    map:{
                        select:{
                            id: true,
                            map:{
                                select:{
                                    id:true,
                                    name:true,
                                    thumbnail:true
                                }
                            }
                        }
                    },
                    users:{
                        select:{
                            userid:true,
                            avatarId:true,
                            lastVisit:true
                        }
                    }
                }
            },
            memberSpaces:{
                select:{
                    id:true,
                    name:true,
                    orgId:true,
                    organisation:{
                        select:{
                            id:true,
                            name:true
                        }
                    },
                    map:{
                        select:{
                            id: true,
                            map:{
                                select:{
                                    id:true,
                                    name:true,
                                    thumbnail:true
                                }
                            }
                        }
                    },
                    users:{
                        select:{
                            userid:true,
                            avatarId:true,
                            lastVisit:true
                        }
                    }
                }
            },
            organisations:{
                select:{
                    id:true,
                    name:true,
                    spaces:{
                select:{
                    id:true,
                    name:true,
                    orgId:true,
                    organisation:{
                        select:{
                            id:true,
                            name:true
                        }
                    }
                }
                    },
                    parentOrgId:true,
                    childOrg: true,
                    hostId : true
                }
            }
        }
    })
    const defaultMaps = await prisma.defaultMap.findMany({
        select:{
            id:true,
            name:true,
            thumbnail:true
        }
    });
    const avatars = await prisma.avatar.findMany({
        select:{
            id:true,
            name:true,
            image: true
        }
    })

    res.status(200).json({
        ...userDetails,
        avatars : avatars,
        defaultMaps : defaultMaps
    });
}
catch(e){
     const message = e instanceof Error ? e.message : "Server Side Error"
    res.status(500).json({
        message
    });
    return;
}
})


export default router;






