//  to create a suer space first authenticate the user token in server then create user space;

import { PrismaClient } from "@repo/database/prisma";
import { Space } from "./room.js";
import type { SpaceInterface } from "./room.js";
import type { WebSocket } from "ws";




const prisma = new PrismaClient();
export class SpaceManager{

   
    userSpaces = new Map<string, {ws:WebSocket, space: InstanceType<typeof Space>}>;
    spaces = new Map<string, number >;
    usersInSpace = new Map<string, Set<WebSocket>>;
    //  when space.usercount == 1 and user logs out remove the space from spaces;
    
    static instance:SpaceManager;
    static getInstance(){
        if(!this.instance){
            this.instance =  new SpaceManager();
        }
        return this.instance;
    }
    getSpace(userId:string){
        const space = this.userSpaces.get(userId);
        if(!space)return null;
        return space;
    }
    getUsers(spaceId:string){
        const users = this.usersInSpace.get(spaceId);
        if(!users)return null;
        return users;

    }
    constructor() {
        
    }

     async initSpace(spaceId: string, userId:string, ws:WebSocket ,spawnPosition?: {x:number,y:number}) {
        console.log("v0");
        if (this.userSpaces.has(userId)) {
      const old = this.userSpaces.get(userId);  
      old?.ws.send(JSON.stringify({ type: "FORCE_LOGOUT" }));
      old?.ws.close();
    }
        try{
        const spaceDetails = await prisma.spaces.findFirst({ where: { id: spaceId }, include: {
            host:{
                select:{
                    id:true,
                    name:true,
                    username:true
                }
            },
            cohosts: {
                select:{
                    id:true,
                    name:true,
                    username: true
                }
            },
            members: {
                select:{
                    id:true,
                    name:true,
                    username: true
                }
            },
            map: {
                select: {
                    elements: {
                        select:{
                            element:{
                                select:{
                                    id:true,
                                    height:true,
                                    width:true
                                }
                            },
                             id: true,
                            x:true,
                            y:true,
                            elementid:true
                        }
                    },
                    id:true,
                    height:true,
                    width:true
                }
            }
        } });

        if(!spaceDetails)return null;
        // console.log(spaceDetails);
        //  create a new Space for this user and return it;
        const space = new Space(spaceDetails, userId, ws ,this,spawnPosition);
        this.userSpaces.set(userId, {space, ws});
        let users = this.usersInSpace.get(spaceId);
        if (!users) {
          users = new Set<WebSocket>();
            this.usersInSpace.set(spaceId, users); 
        }
        users.add(ws);
        console.log("v1");
        return true;
    }
    catch(e){
        console.log( e instanceof Error ? e.message: "vError");
        return null;
    }
        
    }

     removeSpace(spaceId:string){
        this.spaces.delete(spaceId);
        return;
    }

    removeUser(userId:string){
        const u= this.userSpaces.get(userId);
        if(!u)return null;
        const spaceId = u.space.spaceDetails.id;
        const n = this.spaces.get(spaceId);
        if(!n){
            return null;
        }
        else if(n==1){
            this.userSpaces.delete(userId);
            this.removeSpace(spaceId);
        }
        else{
            this.userSpaces.delete(userId);
        }
        return true;
    }

    broadcast_movement(userId:string, spaceId:string ,position:{x:number,y:number}){
        console.log("got to broadcast");
        const users = this.usersInSpace.get(spaceId);
        const client = this.userSpaces.get(userId);
        const clientWs = client?.ws;
        const clientSpace = client?.space;
        if(!users || !client || !client.ws || !client.space)return null;
        console.log("broadcast 2");
        const displacementX = Math.abs(position.x - clientSpace?.position.x!);
        const displacementY = Math.abs(position.y - clientSpace?.position.y!);

        if(!clientSpace)return null;

        if((displacementX == 1 && displacementY == 0)||(displacementX==0 && displacementY == 1)){
            console.log("broadcast self");
            clientWs?.send(JSON.stringify({type:"MOVE_RESPONSE", payload: {userId: userId , position, spaceId} }));
            clientSpace.position.x = position.x;
            clientSpace.position.y = position.y;
             users.forEach((ws)=>{
            if(ws.OPEN && ws != clientWs){
                console.log("this one");
                ws.send(JSON.stringify({type:"MOVE_RESPONSE", payload: {userId: userId , position, spaceId} }));
            }
            console.log("BROADCASTED OTHERS");
        });
        }
        else{
            return null;
        }
        // console.log(users.keys.length);
       
        
        return true;
    }
}