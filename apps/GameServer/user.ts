import { UserInterface } from "./interface.js";
import { ErrorType, MessageType, RequestType, ResponseType } from "./messageTypes.js";
import { WebSocket, WebSocketServer } from "ws";
import { Space } from "./space.js";

interface positionInteraface {
  x: number;
  y: number;
}
export class User {
  userDetails: UserInterface;
  position: positionInteraface;
  ws: WebSocket;
  wss: WebSocketServer
  space: Space

  constructor(
    userDetails: UserInterface,
    spawnPoint: positionInteraface,
    ws: WebSocket,
    wss: WebSocketServer,
    space: Space
  ) {
    this.userDetails = userDetails;
    this.position = spawnPoint;
    this.ws = ws;
    this.wss = wss;
    this.init_handlers();
    this.space = space
  }

  getUserDetails() {
    return this.userDetails;
  }

  init_handlers() {
    const ws = this.ws;

    ws.addEventListener("message", (data) => {
      if (!data) {
        ws.send(
          JSON.stringify({
            type: ResponseType.SERVER_RESPONSE,
            payload: { message: ErrorType.INVALID_PAYLOAD },
          })
        );
      }
      let type: string;
      let d: any;
      try {
        d = JSON.parse(data.toString());
        type = d.type;
        if (!type) {
          ws.send(
            JSON.stringify({
              type: ResponseType.SERVER_RESPONSE,
              payload: { message: ErrorType.INVALID_PAYLOAD },
            })
          );
          return;
        }
      } catch {
        ws.send(
          JSON.stringify({
            type: ResponseType.SERVER_RESPONSE,
            payload: { message: ErrorType.NON_JSON_FORMAT },
          })
        );
        return;
      }


      if(type == RequestType.MOVE){
        const position = d.position as {x: number, y:number};
        if((Math.abs(position.x - this.position.x) == 1 && Math.abs(position.y - this.position.y) == 0)||(Math.abs(position.x - this.position.y) == 0 && Math.abs(position.y - this.position.y) == 1)){
            this.sendMove(ws, position);
            this.broadCast(broadCastType.MOVE);
        }
        else{
            this.rejectMove(ws,this.position);
        }
      }
      else if(type == RequestType.EXIT){
        this.broadCast(broadCastType.EXIT);
        this.space.exitSpace(this.userDetails.id);
      }
    });
  }

  forceLogout() {
    this.ws.send(
      JSON.stringify({
        message: MessageType.FORCE_LOGOUT,
      })
    );
    this.ws.close();
  }


  sendMove(ws:WebSocket, position:positionInteraface){
    ws.send(JSON.stringify({
        type: ResponseType.MOVE_RESPONSE,
        success: true,
        position: position
    }));
}

rejectMove(ws:WebSocket, position:positionInteraface){
    ws.send(JSON.stringify({
        type: ResponseType.MOVE_RESPONSE,
        success: false,
        position: position
    }));
}




broadCast(type:broadCastType){

    if(type == broadCastType.MOVE)
    this.wss.clients.forEach((client)=>{
        if(client != this.ws && client.readyState == client.OPEN){
            client.send(JSON.stringify({
                type: ResponseType.POSITION,
                userId: this.userDetails.id,
                position: this.position
            }))
        }
    })
    else if(type == broadCastType.EXIT){
         this.wss.clients.forEach((client)=>{
        if(client != this.ws && client.readyState == client.OPEN){
            client.send(JSON.stringify({
                type: ResponseType.USER_EXIT,
                userId: this.userDetails.id
            }))
        }
    })
    }
}



}

enum broadCastType{
    MOVE = "MOVE",
    EXIT = "EXIT"
}


 
