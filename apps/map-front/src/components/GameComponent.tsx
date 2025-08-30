// src/components/GameComponent.tsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { Player, type PlayerConfig } from './Player';

const SHOW_DEBUG = false;
const SHOW_COLLISION_RECTS = false;
const FORCE_ALL_COLLISION_OBJECTS = false;
const DISABLE_TILE_LAYER_COLLISION = true;

const ZOOM_MAX = 3;
const ZOOM_STEP_MULT = 1.2;
const ZOOM_TWEEN_DURATION = 200;

const GameComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const phaserRef = useRef<Phaser.Game | null>(null);

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

        // -------- COLLISIONS FIX --------
        const collisionLayer = map.getObjectLayer('collision');
        this.collisionBodies = [];

        if (collisionLayer && Array.isArray(collisionLayer.objects)) {
          console.log(`Found ${collisionLayer.objects.length} collision objects`);

          collisionLayer.objects.forEach((obj: any, i: number) => {
            const w = obj.width ?? map.tileWidth ?? 32;
            const h = obj.height ?? map.tileHeight ?? 32;
            const x = obj.x ?? 0;
            const y = obj.y ?? 0;

            // Center rect
            const rect = this.add.rectangle(
              x + w / 2,
              y + h / 2,
              w,
              h,
              0xff0000,
              SHOW_COLLISION_RECTS ? 0.25 : 0
            );
            rect.setOrigin(0.5, 0.5);

            // Static body
            this.physics.add.existing(rect, true);
            const body = rect.body as Phaser.Physics.Arcade.StaticBody;
            body.setSize(w, h);
            body.setOffset(-w / 2, -h / 2);
            body.updateFromGameObject();

            this.collisionBodies.push(rect);
          });

          console.log('Collision bodies created:', this.collisionBodies.length);
        } else {
          console.warn('No object layer named "collision" found.');
        }

        // -------- Player spawn --------
        let spawnX = map.widthInPixels / 2;
        let spawnY = map.heightInPixels / 2;

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

        // ✅ Add colliders
        this.collisionBodies.forEach(rect => {
          this.physics.add.collider(this.player!.getSprite(), rect);
        });

        if (!DISABLE_TILE_LAYER_COLLISION && wallLayer) {
          this.physics.add.collider(this.player.getSprite(), wallLayer);
        }

        // expose scene
        (window as any).__SCENE = this;
        (window as any).__SCENE.player = this.player;

        // -------- Camera zoom fix --------
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

      update(): void {
        if (this.player) this.player.update();
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
      if (phaserRef.current) {
        phaserRef.current.destroy(true);
        phaserRef.current = null;
      }
    };
  }, []);

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
