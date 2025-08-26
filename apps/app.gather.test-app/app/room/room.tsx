import { SpaceInterface , positionInterface} from "@repo/interface/interface";
import { usePosition } from "../store";


export class Room {
    private ws?: WebSocket; // store websocket for reuse
    userId: string;
    spaceId: string;
    hostId: string;
    position:positionInterface = {
        x:50,y:50
     }
     positionMap:Map<string,positionInterface> =  new Map<string,positionInterface>;


    constructor(space: SpaceInterface) {
        this.userId = space.userId;
        this.spaceId = space.spaceId;
        this.hostId = space.hostId;
        // this.positionMap.set(this.userId, this.position);
        usePosition.getState().setPosition(this.userId, {x:50,y:50});
    }

    // Initialize WebSocket and wait until connection is open
    private async init_socket(): Promise<WebSocket> {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket("ws://localhost:8080");

            ws.onopen = () => {
                console.log(" WebSocket Connection Established");
                resolve(ws); 
            };
            this.init_handlers(ws);
            this.handle_Movement(ws);
            ws.onclose = async() => {
                console.log(" WebSocket is closing");
                this.ws = await this.init_socket();
            };

            ws.onerror = (err) => {
                console.error(" WebSocket error:", err);
                reject(err); 
            };
        });
    }

    // Initialize client connection and send auth token
    async init_client(authToken: string) {
        try {
            this.ws = await this.init_socket(); 

            this.ws.send(JSON.stringify({
                type: "connect",
                payload: { token: authToken }
            }));

            console.log(" Auth token sent to server");

        } catch (err) {
            console.error(" Failed to connect WebSocket:", err);
        }
    }

    init_handlers(ws:WebSocket){
       if(!ws){
        console.log("No websocket client provided");
       }

        ws.onmessage = (e)=>{
                // handle movements changes;
                const data = e.data;
                const d = JSON.parse(data);
                if(d.type == "CONNECT_RESPONSE"){
                        if(d.verdict == true){
                                console.log("Client connected to remote space");
                        }
                        else{
                                console.log("client not authenticated");
                                return;
                        }
                }
                else if (d.type === "MOVE_RESPONSE") {
    if (!d.payload || !d.payload.userId || !d.payload.position) {
        console.log("Invalid MOVE_RESPONSE:", d);
        return;
    }

    const { userId, position } = d.payload;
    // this.positionMap.set(userId, position);
    usePosition.getState().setPosition(userId, position);

    if (userId === this.userId) {
        this.position = position;
    }
    console.log(`position of ${userId} updated to ${position.x}, ${position.y}`);
}
                else{
                        console.log(d);
                }
        }

        
        
        
    }

    handle_Movement(ws:WebSocket){
        this.ws = ws;
       document.onkeydown = (e:KeyboardEvent)=>{
        if(e.key == "W" || e.key == "w" || e.key == "ArrowUp"){
                this.sendMessage({
                        type:"move",
                        payload:{
                        position: {x: this.position.x, y: this.position.y+1}
                    }    
                })
        }
        else if(e.key == "D" || e.key == "d" || e.key == "ArrowRight"){
                this.sendMessage({
                        type:"move",
                        payload:{
                        position: {x: this.position.x+1, y: this.position.y}
                    }    
                })
        }
        else if(e.key == "A" || e.key == "a" || e.key == "ArrowLeft"){
                this.sendMessage({
                        type:"move",
                        payload:{
                        position: {x: this.position.x-1, y: this.position.y}
                    }    
                })
        }
         else if(e.key == "S" || e.key == "s" || e.key == "ArrowDown"){
                this.sendMessage({
                        type:"move",
                        payload:{
                        position: {x: this.position.x, y: this.position.y-1}
                    }    
                })
        }
        
       }
    }

    sendMessage(msg: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        } else {
            console.warn("WebSocket not open yet");
        }
    }
}
