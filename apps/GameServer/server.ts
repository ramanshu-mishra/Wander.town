import {WebSocketServer} from "ws"
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { SpaceManager } from "./spaceManager2.js";
import { MessageType, RequestType, ErrorType,ResponseType } from "./messageTypes.js";
import { PrismaClient } from "@repo/database/prisma";
import { WebSocket } from "ws";

const prisma = new PrismaClient();

dotenv.config();
const wss = new WebSocketServer({
    port: Number(process.env.GAME_SERVER_PORT) || 8080
}, ()=>{
    console.log("listening at port "+ wss.options.port);
});


// we need enums of message type;
//  we need enums of action type;
// we need enums of error types;

/*
 user connect payload:
 {
 token: ___________, token payload contains userId, spaceId;
 }
 add the spaceId to user in the userMap;
 add this webSocket object to the user model in database for force logout if user creates a new session.
 now if space is already present in map go add this user; fetch map details store in map give access to the space object;
 no every subsequent request coming from same UserId

*/ 

wss.on("connection", (ws)=>{
    
   ws.on("message", async(data)=>{
    if(!data){
        ws.send(JSON.stringify({type: ResponseType.SERVER_RESPONSE, payload: {message: ErrorType.INVALID_PAYLOAD}}))
    }
    let type:string;
    let d : any;
    try{
     d = JSON.parse(data.toString());
     type = d.type;
     if(!type){
         ws.send(JSON.stringify({type: ResponseType.SERVER_RESPONSE, payload: {message: ErrorType.INVALID_PAYLOAD}}))
        return;
     }
    }
    catch{
        ws.send(JSON.stringify({type: ResponseType.SERVER_RESPONSE, payload: {message: ErrorType.NON_JSON_FORMAT}}))
        return;
    }
    
    
    if(type == RequestType.CONNECT){
            const t = d.payload?.token;
            try{
            if(!t){
               throw new Error(ErrorType.INVALID_REQUEST_PARAMETERS);
            }
            const token = d.payload.token.split(" ")[1];
            let verifiedToken: JwtPayload;
            if(!token){
                throw new Error(ErrorType.INVALID_REQUEST_PARAMETERS);
            }
            try{
            verifiedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            }
            catch{
                throw new Error(ErrorType.UNAUTHORIZED_REQUEST);
            }

            const userId = verifiedToken.userId;
            console.log("userId: "+userId);
            const spaceId = verifiedToken.spaceId;
            const spaceManager = SpaceManager.getInstance();

            const space = await spaceManager.joinSpace(userId, spaceId, ws,wss);
            
            ws.send(JSON.stringify({type: ResponseType.CONNECT_RESPONSE, success: true, message: MessageType.USER_CONNECTED,
            space
            }));
            return;
        }
        catch(e){
            const message = e instanceof Error ? e.message : "Server Side Error"
            ws.send(JSON.stringify({type: ResponseType.CONNECT_RESPONSE,
                 success: false,
                error: message}))
        }
        }
   })
})


function sendInvalidPayloadMessage(ws:WebSocket){
    ws.send(JSON.stringify({
        type: ResponseType.SERVER_RESPONSE,
        success:false,
        payload: {message: ErrorType.INVALID_PAYLOAD}
    }));
}





