import { SpaceInterface } from "./interface.js";
import {PrismaClient} from "@repo/database/prisma"
import { User } from "./user.js";
import { useEffect } from "react";
import {WebSocket, WebSocketServer} from "ws";

const prisma = new PrismaClient();

export class Space{
    spaceId: string;
    spaceDetails:SpaceInterface|null = null;
    users = new Map<string,User>; // maping of {userId, Users}
    wss: WebSocketServer

    constructor(spaceId:string, wss: WebSocketServer){
       this.spaceId = spaceId;
       this.wss = wss;
    }


    async initSpace() {
    const space = await prisma.space.findFirst({
        where: {
            id: this.spaceId
        },
        include: {
            host: {
                include: {
                    spaces: {
                        select: {
                            spaceId:true,
                            avatarId: true
                        }
                    }
                }
            },
            cohosts: {
                include: {
                    spaces: {
                        select: {
                            spaceId:true,
                            avatarId: true
                        }
                    }
                }
            },
            members: {
                include: {
                    spaces: {
                        select: {
                            spaceId:true,
                            avatarId: true
                        }
                    }
                }
            },
            map: {
                include: {
                    elements: {
                        include: {
                            element: true
                        }
                    },
                    map: true
                }
            }
        }
    });

    if (!space) {
        throw new Error(`Space with id ${this.spaceId} not found`);
    }

    this.spaceDetails = space as SpaceInterface;
}

    getSpaceDetails(){
        return this.spaceDetails
    }


    joinSpace(User:User){
        const details = User.getUserDetails();
        const userId = details.id;
        if(this.users.has(userId))return null;

        this.users.set(userId, User);
        return {
            space: this.spaceDetails,
            users: this.users
        }
    }

    exitSpace(userId:string){
        if(this.users.has(userId)){
            const user = this.users.get(userId);
            user?.forceLogout();
        }
    }

   
    


}