// src/components/GameComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { Player, type PlayerConfig } from './Player';
import { RemotePlayer } from './RemotePlayer';
import { WebSocketManager, type PlayerData } from '../utils/WebSocketManager';

const SHOW_DEBUG = false;
const SHOW_COLLISION_RECTS = false;
const FORCE_ALL_COLLISION_OBJECTS = false;
const DISABLE_TILE_LAYER_COLLISION = true;

const ZOOM_MAX = 3;
const ZOOM_STEP_MULT = 1.2;
const ZOOM_TWEEN_DURATION = 200;

interface GameComponentProps {
  websocketUrl?: string;
  playerName?: string;
  playerRole?: string;
}

const GameComponent: React.FC<GameComponentProps> = ({ 
  websocketUrl = 'ws://localhost:8080',
  playerName = 'Player',
  playerRole = 'User'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const phaserRef = useRef<Phaser.Game | null>(null);
  const wsManagerRef = useRef<WebSocketManager | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  const zoomTo = (targetZoom: number) => {
    const s = (window as any).__SCENE as Phaser.Scene | undefined;
    if (!s) return;
    const cam = s.cameras.main;

    const dynMin = (s.game as any).ZOOM_MIN_DYNAMIC ?? 0.5;
    const clamped = Phaser.Math.Clamp(targetZoom, dynMin, ZOOM_MAX);

    const player = (s as any).player;
    if (player) {
      try {
        cam.startFollow(player.getSprite(), true, 0.12, 0.12);
      } catch {}
    }

    s.tweens.add({
      targets: cam,
      props: { zoom: { value: clamped } },
      duration: ZOOM_TWEEN_DURATION,
      ease: 'Quad.easeOut',
      onComplete: () => {
        if (player) {
          cam.centerOn(player.getX(), player.getY());
        }
      }
    });
  };

  const zoomIn = () => {
    const s = (window as any).__SCENE as Phaser.Scene | undefined;
    if (!s) return;
    zoomTo(s.cameras.main.zoom * ZOOM_STEP_MULT);
  };

  const zoomOut = () => {
    const s = (window as any).__SCENE as Phaser.Scene | undefined;
    if (!s) return;
    zoomTo(s.cameras.main.zoom / ZOOM_STEP_MULT);
  };

  useEffect(() => {
    class GameScene extends Phaser.Scene {
      public player: Player | null = null;
      public collisionBodies: Phaser.GameObjects.Rectangle[] = [];
      public remotePlayers: Map<string, RemotePlayer> = new Map();
      public playerGroup: Phaser.Physics.Arcade.Group | null = null;
      private lastPlayerUpdate = { x: 0, y: 0, direction: 'down', isMoving: false };
      private updateThrottleTime = 33; // Send updates every 33ms (~30fps)
      private lastUpdateTime = 0;

      constructor() {
        super({ key: 'GameScene' });
      }

      preload(): void {
        this.load.tilemapTiledJSON('map', '/maps/office_map.json');
        this.load.image('tiles', '/tilesets/tiles.png');
        this.load.image('wall', '/tilesets/wall.png');
        this.load.image('wall2', '/tilesets/wall2.png');
        this.load.image('interior', '/tilesets/interior.png');

        this.load.spritesheet('player', '/tilesets/player.png', { 
          frameWidth: 16,
          frameHeight: 32
        });
      }

      create(): void {
        const map = this.make.tilemap({ key: 'map' });

        const tsTiles = map.addTilesetImage('tiles', 'tiles');
        const tsWall = map.addTilesetImage('wall', 'wall');
        const tsWall2 = map.addTilesetImage('wall2', 'wall2');
        const tsInterior = map.addTilesetImage('interior', 'interior');

        map.createLayer('floor', tsTiles, 0, 0);
        const wallLayer = tsWall && tsWall2 ? map.createLayer('wall', [tsWall, tsWall2], 0, 0) : null;
        map.createLayer('decor', tsInterior, 0, 0);

        if (!DISABLE_TILE_LAYER_COLLISION && wallLayer) {
          wallLayer.setCollisionByProperty({ collides: true });
        }

        // -------- COLLISIONS --------
        const collisionLayer = map.getObjectLayer('collision');
        this.collisionBodies = [];

        if (collisionLayer && Array.isArray(collisionLayer.objects)) {
          console.log(`Found ${collisionLayer.objects.length} collision objects`);

          collisionLayer.objects.forEach((obj: any, i: number) => {
            const w = obj.width ?? map.tileWidth ?? 32;
            const h = obj.height ?? map.tileHeight ?? 32;
            const x = obj.x ?? 0;
            const y = obj.y ?? 0;

            const rect = this.add.rectangle(
              x + w / 2,
              y + h / 2,
              w,
              h,
              0xff0000,
              SHOW_COLLISION_RECTS ? 0.25 : 0
            );
            rect.setOrigin(0.5, 0.5);

            this.physics.add.existing(rect, true);
            const body = rect.body as Phaser.Physics.Arcade.StaticBody;
            body.setSize(w, h);
            body.setOffset(-w / 2, -h / 2);
            body.updateFromGameObject();

            this.collisionBodies.push(rect);
          });

          console.log('Collision bodies created:', this.collisionBodies.length);
        }

        // -------- SPAWN POINT --------
        const spawnLayer = map.getObjectLayer('spawn');
        let spawnX = (map.widthInPixels / 2) || 400;
        let spawnY = (map.heightInPixels / 2) || 300;

        if (spawnLayer && Array.isArray(spawnLayer.objects) && spawnLayer.objects.length > 0) {
          const preferred = spawnLayer.objects.filter((o: any) => {
            if (Array.isArray(o.properties)) {
              return o.properties.some((p: any) => p.name === 'spawn' && p.value === true);
            } else if (o.properties && typeof o.properties === 'object') {
              return o.properties.spawn === true;
            }
            return false;
          });
          const pool = preferred.length > 0 ? preferred : spawnLayer.objects;
          const chosen = Phaser.Utils.Array.GetRandom(pool);
          const box = (() => {
            const w = chosen.width ?? chosen.tilewidth ?? map.tileWidth ?? 32;
            const h = chosen.height ?? chosen.tileheight ?? map.tileHeight ?? 32;
            const cx = (chosen.x ?? 0) + w / 2;
            const cy = chosen.gid ? (chosen.y ?? 0) - h / 2 : (chosen.y ?? 0) + h / 2;
            return { cx, cy };
          })();
          spawnX = box.cx;
          spawnY = box.cy;
        }

        // -------- CREATE PLAYER --------
        const playerConfig: PlayerConfig = {
          scene: this,
          x: spawnX,
          y: spawnY,
          texture: 'player',
          speed: 160,
          collisionWidth: 12,
          collisionHeight: 12,
          scale: 1.5,
          animationConfig: {
            walkRight: { start: 0, end: 5 },
            walkUp: { start: 6, end: 11 },
            walkLeft: { start: 12, end: 17 },
            walkDown: { start: 18, end: 23 },
            idleFrame: 18,
            frameRate: 8
          }
        };

        this.player = new Player(playerConfig);

        // Add colliders for static objects
        this.collisionBodies.forEach(rect => {
          this.physics.add.collider(this.player!.getSprite(), rect);
        });

        if (!DISABLE_TILE_LAYER_COLLISION && wallLayer) {
          this.physics.add.collider(this.player.getSprite(), wallLayer);
        }

        // Store player physics group for collision management
        this.playerGroup = this.physics.add.group();
        this.playerGroup.add(this.player.getSprite());
        
        // Enable collisions within the player group (player-to-player collisions)
        this.physics.add.collider(this.playerGroup, this.playerGroup);

        // -------- WEBSOCKET SETUP --------
        this.setupWebSocket();

        // Expose scene
        (window as any).__SCENE = this;
        (window as any).__SCENE.player = this.player;

        // -------- CAMERA --------
        const mapW = map.widthInPixels || 800;
        const mapH = map.heightInPixels || 600;
        this.cameras.main.setBounds(0, 0, mapW, mapH);

        const vw = this.scale.width;
        const vh = this.scale.height;
        const coverZoom = Math.max(vw / mapW, vh / mapH);
        (this.game as any).ZOOM_MIN_DYNAMIC = coverZoom;

        const startZoom = Phaser.Math.Clamp(coverZoom * 1.2, coverZoom, ZOOM_MAX);
        this.cameras.main.setZoom(startZoom);

        this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, 0.1);
      }

      private setupWebSocket(): void {
        if (!wsManagerRef.current) {
          wsManagerRef.current = new WebSocketManager(websocketUrl, playerName, playerRole);

          // Setup WebSocket event handlers
          wsManagerRef.current.onConnectionChange = (connected: boolean) => {
            setConnectionStatus(connected ? 'connected' : 'disconnected');
          };

          wsManagerRef.current.onInitialData = (players: PlayerData[]) => {
            console.log('Received initial player data:', players);
            players.forEach(playerData => {
              if (!this.remotePlayers.has(playerData.id)) {
                const remotePlayer = new RemotePlayer(this, playerData);
                this.remotePlayers.set(playerData.id, remotePlayer);
                
                // Add remote player to physics group for collision
                if (this.playerGroup) {
                  this.playerGroup.add(remotePlayer.getSprite());
                }
                
                // Add collisions with static objects
                this.collisionBodies.forEach(rect => {
                  this.physics.add.collider(remotePlayer.getSprite(), rect);
                });
                
                if (!DISABLE_TILE_LAYER_COLLISION && wallLayer) {
                  this.physics.add.collider(remotePlayer.getSprite(), wallLayer);
                }
              }
            });
            
            // Player-to-player collisions are already set up in the group collider above
          };

          wsManagerRef.current.onPlayerJoined = (playerData: PlayerData) => {
            console.log('Player joined:', playerData);
            if (!this.remotePlayers.has(playerData.id)) {
              const remotePlayer = new RemotePlayer(this, playerData);
              this.remotePlayers.set(playerData.id, remotePlayer);
              
              // Add remote player to physics group for collision
              if (this.playerGroup) {
                this.playerGroup.add(remotePlayer.getSprite());
              }
              
              // Add collisions with static objects  
              this.collisionBodies.forEach(rect => {
                this.physics.add.collider(remotePlayer.getSprite(), rect);
              });
              
              if (!DISABLE_TILE_LAYER_COLLISION && wallLayer) {
                this.physics.add.collider(remotePlayer.getSprite(), wallLayer);
              }
            }
          };

          wsManagerRef.current.onPlayerUpdate = (playerData: PlayerData) => {
            const remotePlayer = this.remotePlayers.get(playerData.id);
            if (remotePlayer) {
              remotePlayer.updateFromData(playerData);
            }
          };

          wsManagerRef.current.onPlayerLeft = (playerId: string) => {
            console.log('Player left:', playerId);
            const remotePlayer = this.remotePlayers.get(playerId);
            if (remotePlayer) {
              // Remove from physics group
              if (this.playerGroup) {
                this.playerGroup.remove(remotePlayer.getSprite());
              }
              remotePlayer.destroy();
              this.remotePlayers.delete(playerId);
            }
          };

          // Connect to WebSocket
          setConnectionStatus('connecting');
          wsManagerRef.current.connect();
        }
      }

      update(): void {
        if (this.player) {
          this.player.update();

          // Send player updates via WebSocket (throttled)
          const now = this.time.now;
          if (now - this.lastUpdateTime > this.updateThrottleTime) {
            const currentData = {
              x: Math.round(this.player.getX()),
              y: Math.round(this.player.getY()),
              direction: this.player.getDirection(),
              isMoving: this.player.isMoving()
            };

            // Only send update if player data changed
            if (currentData.x !== this.lastPlayerUpdate.x ||
                currentData.y !== this.lastPlayerUpdate.y ||
                currentData.direction !== this.lastPlayerUpdate.direction ||
                currentData.isMoving !== this.lastPlayerUpdate.isMoving) {
              
              if (wsManagerRef.current?.isConnected()) {
                wsManagerRef.current.sendPlayerUpdate(
                  currentData.x,
                  currentData.y,
                  currentData.direction,
                  currentData.isMoving
                );
              }

              this.lastPlayerUpdate = currentData;
            }
            this.lastUpdateTime = now;
          }
        }

        // Update remote players
        this.remotePlayers.forEach(remotePlayer => {
          remotePlayer.update();
        });
      }
    }

    const parent = containerRef.current;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current ?? undefined,
      width: parent ? parent.clientWidth : window.innerWidth,
      height: parent ? parent.clientHeight : window.innerHeight,
      backgroundColor: '#2c3e50',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: SHOW_DEBUG
        }
      },
      scene: GameScene
    };

    if (!phaserRef.current) {
      phaserRef.current = new Phaser.Game(config);
    }

    const onResize = () => {
      const g = phaserRef.current;
      const p = containerRef.current;
      if (g && p) {
        g.scale.resize(p.clientWidth, p.clientHeight);
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (wsManagerRef.current) {
        wsManagerRef.current.disconnect();
        wsManagerRef.current = null;
      }
      if (phaserRef.current) {
        phaserRef.current.destroy(true);
        phaserRef.current = null;
      }
    };
  }, [websocketUrl, playerName, playerRole]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#00ff00';
      case 'connecting': return '#ffff00';
      case 'disconnected': return '#ff0000';
      default: return '#888888';
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#2c3e50',
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Connection Status */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(0,0,0,0.6)',
          padding: '8px 12px',
          borderRadius: 8,
          color: '#fff',
          fontSize: 14,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
          }}
        />
        <span>
          {connectionStatus === 'connected' && `Connected as ${playerName} (${playerRole})`}
          {connectionStatus === 'connecting' && 'Connecting...'}
          {connectionStatus === 'disconnected' && 'Disconnected'}
        </span>
      </div>

      {/* Zoom Controls */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 9999,
          userSelect: 'none',
        }}
      >
        <button onClick={zoomIn} style={buttonStyle}>+</button>
        <button onClick={zoomOut} style={buttonStyle}>−</button>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 8,
  border: 'none',
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  fontSize: 24,
  cursor: 'pointer',
};

export default GameComponent;