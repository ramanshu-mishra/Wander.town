import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@repo/database/prisma";
import jwt from "jsonwebtoken"
const prisma  = new PrismaClient();

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if ( req.isAuthenticated()) { 
        console.log(req.user);
        return next();
    }
    res.redirect("/unAuthorized-session");
}

export async function checkHost(req:Request, res:Response, next: NextFunction){
    // @ts-ignore
    const userId = req.user.id;
    const spaceId = req.params.spaceId;
    const usr = await prisma.spaces.findFirst({where:{id:spaceId as string}});
    if(!usr){
        res.status(404).json({message: "invalid_space" });
        return;
    }
    if(usr.host_id != userId){
        res.status(405).json({message: "unauthorized_request"});
        return;
    }
    next();
}


export async function check_WS_Host(req:Request, res:Response, next:NextFunction){
    const spaceId = req.params.spaceId;
    const auth = req.headers.token as string;
    if(!auth || !spaceId){
        res.status(404).json({message: "invalid_request_parameters"});
        return;
    }
    const token = auth.split(" ")[1];
    if(!token){
        res.status(404).json({message: "invalid_request_parameters"});
        return;
    }
    let userId = "";
    try{
      const verified =   jwt.verify(token, process.env.JWT_SECRET as string);
    //   @ts-ignore
      userId = verified.userId;
    }
    catch{
        res.status(404).json({message: "unAuthorized_acesss"});
        return;
    }
try{
    const usr = await prisma.spaces.findFirst({where:{id:spaceId as string}});

     if(!usr){
        res.status(404).json({message: "invalid_space" });
        return;
    }
    if(usr.host_id != userId){
        res.status(405).json({message: "unauthorized_request"});
        return;
    }
}
catch{

}
    next();
}