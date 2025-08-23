import {WebSocketServer} from "ws"
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { SpaceManager } from "./spaceManager.js";
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
    
   ws.on("message", (data)=>{
    if(!data){
        ws.send(JSON.stringify({type: "SERVER_RESPONSE", payload: {message: "Invalid data"}}))
    }
    let type:string;
    let d : any;
    try{
     d = JSON.parse(data.toString());
     type = d.type;
     if(!type){
         ws.send(JSON.stringify({type: "SERVER_RESPONSE", payload: {message: "Invalid payload"}}))
        return;
     }
    }
    catch{
        ws.send(JSON.stringify({type: "SERVER_RESPONSE", payload: {message: "NON_JSON_FORMAT"}}))
        return;
    }
    
    
    if(type == "connect"){
            const t = d?.payload?.token;
            if(!t){
                ws.send(JSON.stringify({type: "CONNECT_RESPONSE", verdict: false, error : "INVALID_REQUEST_PARAMETERS" }));
                return;
            }
            const token = d.payload.token.split(" ")[1];
            let verifiedToken: JwtPayload;
            if(!token){
                ws.send(JSON.stringify({type: "CONNECT_RESPONSE", verdict: false, error : "INVALID_REQUEST_PARAMETERS" }));
            }
            try{
            verifiedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            }
            catch{
                ws.send(JSON.stringify({type: "CONNECT_RESPONSE", verdict: false, error : "UNAUTHORIZED_REQUEST" }));
                ws.close();
                return;
            }
            const userId = verifiedToken.userId;
            console.log("userId: "+userId);
            const spaceId = verifiedToken.spaceId;
            const spaceManager = SpaceManager.getInstance();
            spaceManager.initSpace(spaceId,userId,ws);
            ws.send(JSON.stringify({type: "CONNECT_RESPONSE", verdict: true, message: "USER CONNECTED"}));
            return;
        }
   })
})