// src/utils/WebSocketManager.ts
export interface PlayerData {
  id: string;
  x: number;
  y: number;
  name: string;
  role: string;
  direction?: string;
  isMoving?: boolean;
}

export interface GameMessage {
  type: 'player_update' | 'player_joined' | 'player_left' | 'init';
  data: PlayerData | PlayerData[] | { playerId: string };
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private playerId: string;
  private playerName: string;
  private playerRole: string;
  
  // Callbacks
  public onPlayerUpdate?: (player: PlayerData) => void;
  public onPlayerJoined?: (player: PlayerData) => void;
  public onPlayerLeft?: (playerId: string) => void;
  public onInitialData?: (players: PlayerData[]) => void;
  public onConnectionChange?: (connected: boolean) => void;

  constructor(url: string, playerName: string, playerRole: string) {
    this.url = url;
    this.playerId = this.generatePlayerId();
    this.playerName = playerName;
    this.playerRole = playerRole;
  }

  private generatePlayerId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public connect(): void {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.onConnectionChange?.(true);
        
        // Send initial player data
        this.sendMessage({
          type: 'player_joined',
          data: {
            id: this.playerId,
            x: 0,
            y: 0,
            name: this.playerName,
            role: this.playerRole,
            direction: 'down',
            isMoving: false
          }
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: GameMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.onConnectionChange?.(false);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  private handleMessage(message: GameMessage): void {
    switch (message.type) {
      case 'init':
        if (Array.isArray(message.data)) {
          this.onInitialData?.(message.data);
        }
        break;
      
      case 'player_update':
        if (!Array.isArray(message.data) && message.data.id !== this.playerId) {
          this.onPlayerUpdate?.(message.data);
        }
        break;
      
      case 'player_joined':
        if (!Array.isArray(message.data) && message.data.id !== this.playerId) {
          this.onPlayerJoined?.(message.data);
        }
        break;
      
      case 'player_left':
        const data = message.data as { playerId: string };
        if (data.playerId !== this.playerId) {
          this.onPlayerLeft?.(data.playerId);
        }
        break;
    }
  }

  public sendPlayerUpdate(x: number, y: number, direction: string, isMoving: boolean): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendMessage({
        type: 'player_update',
        data: {
          id: this.playerId,
          x,
          y,
          name: this.playerName,
          role: this.playerRole,
          direction,
          isMoving
        }
      });
    }
  }

  private sendMessage(message: GameMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public getPlayerId(): string {
    return this.playerId;
  }
}