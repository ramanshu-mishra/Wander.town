import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@repo/database/prisma";
import jwt from "jsonwebtoken"
const prisma  = new PrismaClient();

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if ( req.isAuthenticated()) { 
        console.log(req.user);
        return next();
    }


    console.log(">>>>>>>>>>>>>>>>> unauthenticated Request <<<<<<<<<<<<<<<<<<<<<<<<<<")
    console.log(req.user);
    console.log("full req: ");
    console.log(req);
    console.log("__________________________end_______________________");
    res.redirect("/unAuthorized-session");
}

export async function checkHost(req:Request, res:Response, next: NextFunction){
    // @ts-ignore
    const userId = req.user.id;
    const spaceId = req.params.spaceId || req.body.spaceId;
    const usr = await prisma.space.findFirst({where:{id:spaceId as string}});
    if(!usr){
        res.status(404).json({message: "invalid_space" });
        return;
    }
    if(usr.hostId != userId){
        res.status(405).json({message: "unauthorized_request"});
        return;
    }
    next();
}


export async function check_WS_Host(req:Request, res:Response, next:NextFunction){
    const spaceId = req.params.spaceId;
    const auth = req.headers.token as string;
    const token = auth?.split(" ")[1];
    if(!auth || !spaceId || !token){
        res.status(404).json({message: "invalid_request_parameters"});
        return;
    }
    
    let userId = "";
    try{
      const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    //   @ts-ignore
      userId = verified.userId;
    }
    catch{
        res.status(404).json({message: "unAuthorized_acesss"});
        return;
    }
try{
    const usr = await prisma.space.findFirst({where:{id:spaceId as string}});

     if(!usr){
        res.status(404).json({message: "invalid_space" });
        return;
    }
    if(usr.hostId != userId){
        res.status(405).json({message: "unauthorized_request"});
        return;
    }
}
catch{
    res.status(500).json({message: "Server Side Error"});
    return;
}
    next();
}