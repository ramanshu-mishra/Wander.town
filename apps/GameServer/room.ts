import type { WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { SpaceManager } from "./spaceManager.js";
interface UserInterface{
    id:string,
    name:string,
    username:string
}
interface elementInterface{
    id:string,
    x:number,
    y:number,
    elementid: string,
    element:{
        id:string,
        height:number,
        width:number
    }
}
interface mapInterface{
    id: string,
    height:number,
    width:number,
    elements:elementInterface[]
}
export interface SpaceInterface{
    id:string,
    name:string,
    map_id: string,
    host_id: string,
    host: UserInterface
    cohosts: UserInterface[],
    members:UserInterface[],
    map: mapInterface | null
}

export class Space{
    public spaceDetails: SpaceInterface;
    userId: string;
    ws: WebSocket;
    position: {x:number, y:number} = {x:50, y:50};
    spaceManager : SpaceManager;


    constructor(space:SpaceInterface, userId:string, ws:WebSocket,spaceManager: SpaceManager ,spawnPosition?: {x:number, y:number}){
    this.spaceDetails = space;
    if(spawnPosition){
        this.position = spawnPosition;
    }
    this.spaceManager = spaceManager
    this.userId = userId;
    this.ws = ws;    
    console.log("baat yaha hai");
    this.init_Handlers();
    }

    changePosition(x:number, y:number){
        this.position = {x,y};
    }

    init_Handlers(){
        console.log("baat yaha aa gayi");
         this.ws.on("message", (data)=>{
        const d = JSON.parse(data.toString());
        const type = d.type;

        if(!type){
            this.ws.send(JSON.stringify({type: "CONNECT_RESPONSE", verdict: false, error : "INVALID_REQUEST_PARAMETERS" }))
            return;
        }
        
         if(type == "move"){
            const position = d?.payload?.position;
            if(!position || !position?.x || !position?.y){
                this.ws.send(JSON.stringify({type: "CONNECT_RESPONSE", verdict: false, error : "INVALID_REQUEST_PARAMETERS" }))
                return;
            }
            const res = this.spaceManager.broadcast_movement(this.userId, this.spaceDetails.id, position);
            console.log("got here to move");
            if(!res){
                // reject movement;
                console.log("movement rejected");
                this.ws.send(JSON.stringify({type:"MOVE_RESPONSE", payload: {userId: this.userId , position, spaceId: this.spaceDetails.id} }));
                return;
            }
            
        }
        else if(type == "leave"){
            const users = this.spaceManager.getUsers(this.spaceDetails.id);
            try{
            users?.forEach((client)=>{
                if(client.OPEN){
                    client.send(JSON.stringify({type:"LEAVE", payload:{
                        spaceId: this.spaceDetails.id,
                        userId: this.userId
                    }}));
                    this.ws.close();
                    return;
                }
            })
        }
        catch{
            this.ws.send(JSON.stringify({type: "LOGOUT_FAILURE"}));
        }
        }
        
    })


    }


}