// src/components/GameComponent.tsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// DEBUG FLAGS - tune these as needed
const SHOW_DEBUG = false;                 // Arcade debug outlines (set false for production)
const SHOW_COLLISION_RECTS = false;      // show translucent red rectangles for collision objects
const FORCE_ALL_COLLISION_OBJECTS = false; // for testing: treat every object in "collision" layer as blocking
const DISABLE_TILE_LAYER_COLLISION = true; // disable tile-layer collisions while testing object collisions

// Zoom settings for the UI controls
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP_MULT = 1.2;               // zoom factor per click (multiply)
const ZOOM_TWEEN_DURATION = 200;          // ms

const GameComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const phaserRef = useRef<Phaser.Game | null>(null);

  // zoom helper functions that call the scene camera via window.__SCENE
  const zoomTo = (targetZoom: number) => {
    const s = (window as any).__SCENE as Phaser.Scene | undefined;
    if (!s) return;
    const cam = s.cameras.main;
    const clamped = Phaser.Math.Clamp(targetZoom, ZOOM_MIN, ZOOM_MAX);

    // ensure camera is following the player before tweening (so zoom centers on player)
    if ((s as any).player) {
      try {
        cam.startFollow((s as any).player, true, 0.12, 0.12);
      } catch (e) {
        // ignore if follow already set
      }
    }

    // animate zoom for smoothness. The tween targets cam.zoom directly.
    s.tweens.add({
      targets: cam,
      props: {
        zoom: { value: clamped }
      },
      duration: ZOOM_TWEEN_DURATION,
      ease: 'Quad.easeOut',
      onComplete: () => {
        // after zoom, force center on player so player remains visible
        const p = (s as any).player;
        if (p) {
          cam.centerOn(p.x, p.y);
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
      public player: Phaser.Physics.Arcade.Sprite | null = null;
      public collisionBodies: Phaser.GameObjects.Rectangle[] = [];
      private activeOverlaps = new Set<number>(); // track overlaps to log only on start

      constructor() {
        super({ key: 'GameScene' });
      }

      preload(): void {
        // map
        this.load.tilemapTiledJSON('map', '/maps/office_map.json');

        // tiles (ensure these exist under public/tilesets/)
        this.load.image('tiles', '/tilesets/tiles.png');
        this.load.image('wall', '/tilesets/wall.png');
        this.load.image('wall2', '/tilesets/wall2.png');
        this.load.image('interior', '/tilesets/interior.png');

        // player sprite
        this.load.image('player', '/tilesets/player.png');
      }

      create(): void {
        console.log('Creating scene — loading map...');
        const map = this.make.tilemap({ key: 'map' });

        console.log('Tileset names in JSON:', map.tilesets.map(t => t.name));
        console.log('Layer names in JSON:', map.layers.map(l => l.name));

        // Add tilesets: first arg must match tileset.name in JSON, second is the preload key
        const tsTiles = map.addTilesetImage('tiles', 'tiles');
        const tsWall = map.addTilesetImage('wall', 'wall');
        const tsWall2 = map.addTilesetImage('wall2', 'wall2');
        const tsInterior = map.addTilesetImage('interior', 'interior');

        // Create tile layers (names are case-sensitive)
        const floorLayer = tsTiles ? map.createLayer('floor', tsTiles, 0, 0) : null;
        const wallLayer = tsWall && tsWall2 ? map.createLayer('wall', [tsWall, tsWall2], 0, 0) : null;
        const decorLayer = tsInterior ? map.createLayer('decor', tsInterior, 0, 0) : null;

        if (!DISABLE_TILE_LAYER_COLLISION && wallLayer) {
          wallLayer.setCollisionByProperty({ collides: true });
          console.log('Tile-layer collisions enabled.');
        } else {
          console.log('Tile-layer collisions disabled (testing object collisions).');
        }

        // -------- OBJECT-LAYER COLLISIONS (top-left origin approach) --------
        const collisionLayer = map.getObjectLayer('collision');
        this.collisionBodies = [];

        // compute top-left coordinates and size to avoid origin+offset confusion
        const computeTopLeft = (obj: any) => {
          const w = obj.width ?? obj.tilewidth ?? map.tileWidth ?? 32;
          const h = obj.height ?? obj.tileheight ?? map.tileHeight ?? 32;
          // rectangle objects: y = top; tile objects (gid): y = bottom -> top = y - h
          const top = obj.gid ? (obj.y ?? 0) - h : (obj.y ?? 0);
          const left = obj.x ?? 0;
          return { left, top, w, h };
        };

        if (collisionLayer && Array.isArray(collisionLayer.objects)) {
          console.log(`Found ${collisionLayer.objects.length} collision objects`);
          collisionLayer.objects.forEach((obj: any, i: number) => {
            // Decide whether this object should block
            let blocked = FORCE_ALL_COLLISION_OBJECTS;

            if (!blocked) {
              if (Array.isArray(obj.properties)) {
                blocked = obj.properties.some((p: any) => {
                  const name = (p.name ?? '').toLowerCase();
                  const val = p.value;
                  if (name === 'walk' || name === 'walkable') {
                    return val === false || val === 'false' || val === 0;
                  }
                  return false;
                });
              } else if (obj.properties && typeof obj.properties === 'object') {
                if ('walk' in obj.properties) {
                  blocked = obj.properties.walk === false || obj.properties.walk === 'false';
                }
                if (!blocked && 'walkable' in obj.properties) {
                  blocked = obj.properties.walkable === false || obj.properties.walkable === 'false';
                }
              }
            }

            if (!blocked) return; // skip non-blocking objects

            const { left, top, w, h } = computeTopLeft(obj);
            if (w === 0 || h === 0) {
              console.warn(`Skipping zero-size collision object #${i} at (${left},${top}) size (${w}x${h})`);
              return;
            }

            // create rectangle with origin 0,0 (top-left) -> simpler alignment
            const rect = this.add.rectangle(left, top, w, h, 0xff0000, SHOW_COLLISION_RECTS ? 0.25 : 0);
            rect.setOrigin(0, 0);

            // attach static physics body
            this.physics.add.existing(rect, true);
            const body = rect.body as Phaser.Physics.Arcade.StaticBody | null;
            if (body) {
              body.setSize(w, h);
              body.setOffset(0, 0); // top-left origin => no offset
              body.enable = true;
              body.checkCollision = { up: true, down: true, left: true, right: true };
              if (typeof (body as any).updateFromGameObject === 'function') {
                (body as any).updateFromGameObject();
              }
            }

            this.collisionBodies.push(rect);
          });

          console.log('Collision bodies created:', this.collisionBodies.length);
        } else {
          console.warn('No object layer named "collision" found. Ensure name is exact.');
        }

        // -------- spawn logic (random spawn preference) --------
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
          console.log('Using spawn point at', spawnX, spawnY);
        } else {
          console.warn('No spawn layer or objects found; using map center fallback.');
        }

        // -------- create player AFTER collision bodies so colliders attach cleanly --------
        this.player = this.physics.add.sprite(spawnX, spawnY, 'player').setDepth(10);
        this.player.setCollideWorldBounds(true);
        const pBody = this.player.body as Phaser.Physics.Arcade.Body;
        pBody.setSize(16, 16);
        pBody.setOffset((this.player.width - 16) / 2, (this.player.height - 16) / 2);

        // 
      
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

        // Add colliders with callback to verify collisions fire
        this.collisionBodies.forEach((rect, idx) => {
          this.physics.add.collider(this.player as any, rect as any, () => {
            // optional: small debug log
            // console.log('COLLIDER HIT idx:', idx);
          });
        });

        // optionally enable tile-layer collision after object-layer test (disabled by flag)
        if (!DISABLE_TILE_LAYER_COLLISION && wallLayer) {
          this.physics.add.collider(this.player as any, wallLayer);
        }

        // expose scene for console debugging
        // @ts-ignore
        (window as any).__SCENE = this;
        // put the player reference on the scene for zoom helpers running outside the scene
        // @ts-ignore
        (window as any).__SCENE.player = this.player;

        // camera: fit map into view initially but keep follow so camera centers on player
        const mapW = map.widthInPixels || 800;
        const mapH = map.heightInPixels || 600;
        this.cameras.main.setBounds(0, 0, mapW, mapH);
        const vw = this.scale.width;
        const vh = this.scale.height;
        const fitZoom = Math.min(vw / mapW, vh / mapH);
        const finalZoom = Phaser.Math.Clamp(Math.min(Math.max(fitZoom, 1), 2), ZOOM_MIN, ZOOM_MAX);
        this.cameras.main.setZoom(finalZoom);
        // camera will follow the player; center is controlled by follow
        this.cameras.main.centerOn(this.player.x, this.player.y);

        // controls
        this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKeys('W,S,A,D');
      }

      update(): void {
        if (!this.player) return;

        // movement
        const cursors = this.input.keyboard.createCursorKeys();
        const keys: any = this.input.keyboard.addKeys('W,S,A,D');
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        const speed = 160;
        body.setVelocity(0);

        if ((cursors.left?.isDown) || (keys.A?.isDown)) body.setVelocityX(-speed);
        else if ((cursors.right?.isDown) || (keys.D?.isDown)) body.setVelocityX(speed);

        if ((cursors.up?.isDown) || (keys.W?.isDown)) body.setVelocityY(-speed);
        else if ((cursors.down?.isDown) || (keys.S?.isDown)) body.setVelocityY(speed);

        body.velocity.normalize().scale(speed);

        // overlap detection + throttled logging (optional)
        for (let i = 0; i < this.collisionBodies.length; i++) {
          const rect = this.collisionBodies[i];
          if (!rect || !rect.body) continue;

          const isOverlap = this.physics.world.overlap(this.player as any, rect as any);
          const already = this.activeOverlaps.has(i);

          if (isOverlap && !already) {
            this.activeOverlaps.add(i);
            // console.log('OVERLAP START idx:', i);
          } else if (!isOverlap && already) {
            this.activeOverlaps.delete(i);
            // console.log('OVERLAP END idx:', i);
          }
        }
      }
    }

    // Phaser config: Fit scale so canvas fills containerRef
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
      // @ts-ignore
      (window as any).game = phaserRef.current;
      console.log('Phaser game instance created.');
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
        // @ts-ignore
        (window as any).game = undefined;
      }
    };
  }, []);

  // UI buttons overlayed (top-right) + Phaser container beneath
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
      {/* Phaser will mount into this div */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Zoom controls - top-right corner */}
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
        <button
          onClick={zoomIn}
          aria-label="Zoom in"
          title="Zoom in"
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            border: 'none',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            fontSize: 24,
            cursor: 'pointer',
          }}
        >
          +
        </button>

        <button
          onClick={zoomOut}
          aria-label="Zoom out"
          title="Zoom out"
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            border: 'none',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            fontSize: 24,
            cursor: 'pointer',
          }}
        >
          −
        </button>
      </div>
    </div>
  );
};

export default GameComponent;
