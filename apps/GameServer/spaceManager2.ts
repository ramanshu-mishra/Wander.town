import { Space } from "./space.js";
import { User } from "./user.js";
import {WebSocket, WebSocketServer} from "ws";
import { PrismaClient } from "@repo/database/prisma";
import { spawnPoints, UserInterface } from "./interface.js";

const prisma = new PrismaClient();

export class SpaceManager{
    static instance: SpaceManager;

    user_space = new Map<string,{space:Space, ws:WebSocket}> //user id to space mapping
    spaces = new Map<string, Space>; //spaceId, Space
    

    public static getInstance(){
        if(!this.instance)return new SpaceManager();
        return this.instance;
    }

    getUser(userId:string){
        return this.user_space.get(userId);
    }
    
   async joinSpace(userId:string , spaceId: string, ws:WebSocket, wss:WebSocketServer){
        //  new user is trying to join space. create 
        this.removeUser(userId, spaceId);
        const userDetails = await this.getUserDetails(userId);
        if(!this.spaces.has(spaceId)){
            //  initiate a new Space;
            const space = new Space(spaceId, wss);
            await space.initSpace();
            this.spaces.set(spaceId, space);
        }
        //now add first member in the space;
        const space = this.spaces.get(spaceId);
        const spawnPoints = space?.getSpaceDetails()?.map?.spawnPoints;
        const user = new User(userDetails as UserInterface, spawnPoints as spawnPoints, ws,wss, space as Space );
       const spaceDetails =  space?.joinSpace(user);
       return spaceDetails;
    }
    
    removeUser(userId:string,spaceId:string){
        this.user_space.delete(userId);
        if(this.spaces.has(spaceId)){
            const space = this.spaces.get(spaceId);
            space?.exitSpace(userId);
        }
    }

    async getUserDetails(userId:string){
    const userDetails = await prisma.user.findUnique({
        where:{
            id: userId
        },
        select:{
            id:true,
            username:true,
            name:true,
            spaces: {
                select:{
                    spaceId: true,
                    avatarId: true,
                }
            }
        }
    });

    return userDetails;
}

}