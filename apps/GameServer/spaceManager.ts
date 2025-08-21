//  to create a suer space first authenticate the user token in server then create user space;

import { PrismaClient } from "@repo/database/prisma";
import { Space } from "./room.js";
import type { SpaceInterface } from "./room.js";
import type { WebSocket } from "ws";




const prisma = new PrismaClient();
export class SpaceManager{

    static instance: SpaceManager;
    userSpaces = new Map<string, {ws:WebSocket, space: InstanceType<typeof Space>}>;
    spaces = new Map<string, number >;
    usersInSpace = new Map<string, Set<WebSocket>>;
    //  when space.usercount == 1 and user logs out remove the space from spaces;
    static getInstance(spaceid:string, userId:string, ws:WebSocket){
        if(!this.instance){
            return new SpaceManager(spaceid,userId,ws);
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
    constructor(spaceId: string, userId: string, ws:WebSocket) {
        // fetch space details from database;
        
        // this.userSpaces.set(userId, {spaceId, ws});
        
        
        const userSpace = this.userSpaces.get(userId);
        if(!userSpace){
            const d = this.initSpace(spaceId, userId, ws);
        if(!d){
            throw new Error("Server Side Error");
        }
        const webS = this.usersInSpace.get(spaceId);
        if(webS){
            this.usersInSpace.get(spaceId)?.add(ws);
        }
        else{
            this.usersInSpace.set(spaceId, new Set());
            this.usersInSpace.get(spaceId)?.add(ws);
        }
        }
        
        
    }

    private async initSpace(spaceId: string, userId:string, ws:WebSocket ,spawnPosition?: {x:number,y:number}) {
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
                include: {
                    elements: {
                        include:{
                            element:{
                                select:{
                                    id:true,
                                    height:true,
                                    width:true
                                }
                            }
                        },
                        select:{
                            id: true,
                            x:true,
                            y:true,
                            elementid:true
                        }
                    },
                    
                },
                select:{
                    id:true,
                    height:true,
                    width:true
                }
            }
        } });

        if(!spaceDetails)return null;
        //  create a new Space for this user and return it;
        const space = new Space(spaceDetails, userId, ws ,this,spawnPosition);
        this.userSpaces.set(userId, {space, ws});
        return true;
    }
    catch{
        return null;
    }
        
    }

    private removeSpace(spaceId:string){
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
        const users = this.usersInSpace.get(spaceId);
        const client = this.userSpaces.get(userId);
        const clientWs = client?.ws;
        const clientSpace = client?.space;
        if(!users || !client || !client.ws || !client.space)return null;

        const displacementX = Math.abs(position.x - clientSpace?.position.x!);
        const displacementY = Math.abs(position.y - clientSpace?.position.y!);

        if((displacementX == 1 && displacementY == 0)||(displacementX==0 || displacementY == 1)){
            clientWs?.send(JSON.stringify({type:"MOVE_RESPONSE", payload: {userId: userId , position, spaceId} }));
        }
        else{
            return null;
        }

        users.forEach((ws)=>{
            if(ws.OPEN && ws != clientWs){
                ws.send(JSON.stringify({type:"MOVE_RESPONSE", payload: {userId: userId , position, spaceId} }));
            }
        });
        return true;
    }
}