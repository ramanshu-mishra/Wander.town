// src/components/RemotePlayer.ts
import Phaser from 'phaser';
import type { PlayerData } from '../utils/WebSocketManager';

export class RemotePlayer {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private nameText: Phaser.GameObjects.Text;
  private roleText: Phaser.GameObjects.Text;
  private scene: Phaser.Scene;
  private playerId: string;
  private targetX: number = 0;
  private targetY: number = 0;
  private interpolationSpeed: number = 0.25; // Faster interpolation
  private isAnimated: boolean = false;
  private lastUpdateTime: number = 0;
  private networkDelay: number = 100; // Assume 100ms network delay

  constructor(scene: Phaser.Scene, playerData: PlayerData) {
    this.scene = scene;
    this.playerId = playerData.id;
    this.targetX = playerData.x;
    this.targetY = playerData.y;

    // Create sprite with physics enabled
    this.sprite = this.scene.physics.add.sprite(playerData.x, playerData.y, 'player');
    this.sprite.setDepth(9); // Slightly below main player
    this.sprite.setScale(1.5);
    this.sprite.setTint(0xcccccc); // Slightly dimmed to differentiate from main player

    // Enable physics body for collision
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 12); // Match collision size with main player
    const offsetX = (this.sprite.width - 12) / 2;
    const offsetY = (this.sprite.height - 12) / 2;
    body.setOffset(offsetX, offsetY);
    
    // Enable collision but allow movement
    body.setCollideWorldBounds(true);
    body.setImmovable(false); // Allow pushing between players

    // Check if texture has multiple frames for animation
    const texture = this.scene.textures.get('player');
    this.isAnimated = texture.frameTotal > 1;

    // Create name text above player
    this.nameText = this.scene.add.text(playerData.x, playerData.y - 30, playerData.name, {
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center'
    });
    this.nameText.setOrigin(0.5, 0.5);
    this.nameText.setDepth(11);

    // Create role text below name
    this.roleText = this.scene.add.text(playerData.x, playerData.y - 18, playerData.role, {
      fontSize: '10px',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center'
    });
    this.roleText.setOrigin(0.5, 0.5);
    this.roleText.setDepth(11);

    // Setup animations if available
    if (this.isAnimated) {
      this.createAnimations();
    }

    console.log(`Remote player created: ${playerData.name} (${playerData.role})`);
  }

  private createAnimations(): void {
    const textureKey = this.sprite.texture.key;
    const playerId = this.playerId;

    // Create unique animation keys for this remote player
    if (!this.scene.anims.exists(`${textureKey}-${playerId}-walk-down`)) {
      this.scene.anims.create({
        key: `${textureKey}-${playerId}-walk-down`,
        frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 18, end: 23 }),
        frameRate: 8,
        repeat: -1
      });

      this.scene.anims.create({
        key: `${textureKey}-${playerId}-walk-left`,
        frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 12, end: 17 }),
        frameRate: 8,
        repeat: -1
      });

      this.scene.anims.create({
        key: `${textureKey}-${playerId}-walk-right`,
        frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1
      });

      this.scene.anims.create({
        key: `${textureKey}-${playerId}-walk-up`,
        frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 6, end: 11 }),
        frameRate: 8,
        repeat: -1
      });

      // Idle animations
      this.scene.anims.create({
        key: `${textureKey}-${playerId}-idle-down`,
        frames: [{ key: textureKey, frame: 18 }],
        frameRate: 1
      });

      this.scene.anims.create({
        key: `${textureKey}-${playerId}-idle-left`,
        frames: [{ key: textureKey, frame: 12 }],
        frameRate: 1
      });

      this.scene.anims.create({
        key: `${textureKey}-${playerId}-idle-right`,
        frames: [{ key: textureKey, frame: 0 }],
        frameRate: 1
      });

      this.scene.anims.create({
        key: `${textureKey}-${playerId}-idle-up`,
        frames: [{ key: textureKey, frame: 6 }],
        frameRate: 1
      });
    }
  }

  public update(): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const currentX = this.sprite.x;
    const currentY = this.sprite.y;
    
    // Calculate distance to target
    const distanceToTarget = Phaser.Math.Distance.Between(currentX, currentY, this.targetX, this.targetY);
    
    if (distanceToTarget > 2) {
      // Use direct interpolation for responsiveness
      const newX = Phaser.Math.Linear(currentX, this.targetX, this.interpolationSpeed);
      const newY = Phaser.Math.Linear(currentY, this.targetY, this.interpolationSpeed);
      
      // Check if the new position would cause overlap
      const wouldOverlap = this.checkOverlapAtPosition(newX, newY);
      
      if (!wouldOverlap) {
        // Safe to move directly
        this.sprite.setPosition(newX, newY);
        body.updateFromGameObject();
      } else {
        // Use physics movement when collision is detected
        const angle = Phaser.Math.Angle.Between(currentX, currentY, this.targetX, this.targetY);
        const moveSpeed = 100;
        
        body.setVelocity(
          Math.cos(angle) * moveSpeed,
          Math.sin(angle) * moveSpeed
        );
      }
    } else {
      // Stop when close to target
      body.setVelocity(0, 0);
      if (distanceToTarget < 1) {
        this.sprite.setPosition(this.targetX, this.targetY);
        body.updateFromGameObject();
      }
    }
    
    this.updateTextPositions();
  }

  private checkOverlapAtPosition(x: number, y: number): boolean {
    // Get the scene's player group
    const scene = this.scene as any;
    const playerGroup = scene.playerGroup;
    
    if (!playerGroup) return false;
    
    // Check overlap with other players
    const tempBounds = new Phaser.Geom.Rectangle(x - 6, y - 6, 12, 12);
    
    for (const child of playerGroup.children.entries) {
      const otherSprite = child as Phaser.Physics.Arcade.Sprite;
      if (otherSprite === this.sprite) continue;
      
      const otherBody = otherSprite.body as Phaser.Physics.Arcade.Body;
      const otherBounds = new Phaser.Geom.Rectangle(
        otherBody.x, 
        otherBody.y, 
        otherBody.width, 
        otherBody.height
      );
      
      if (Phaser.Geom.Rectangle.Overlaps(tempBounds, otherBounds)) {
        return true;
      }
    }
    
    return false;
  }

  public updateFromData(playerData: PlayerData): void {
    // Only update target if position actually changed significantly
    const distanceFromNewTarget = Phaser.Math.Distance.Between(this.targetX, this.targetY, playerData.x, playerData.y);
    
    if (distanceFromNewTarget > 2) { // Only update if moved more than 2 pixels
      this.targetX = playerData.x;
      this.targetY = playerData.y;
    }

    // Update name and role if they changed
    this.nameText.setText(playerData.name);
    this.roleText.setText(playerData.role);

    // Handle animations based on actual movement, not just network data
    if (this.isAnimated && playerData.direction) {
      const textureKey = this.sprite.texture.key;
      const isActuallyMoving = this.isMovingToTarget || playerData.isMoving;
      
      const animKey = isActuallyMoving 
        ? `${textureKey}-${this.playerId}-walk-${playerData.direction}`
        : `${textureKey}-${this.playerId}-idle-${playerData.direction}`;
      
      if (this.scene.anims.exists(animKey)) {
        this.sprite.play(animKey, true);
      }
    }
  }

  private updateTextPositions(): void {
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 30);
    this.roleText.setPosition(this.sprite.x, this.sprite.y - 18);
  }

  public getPlayerId(): string {
    return this.playerId;
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  public destroy(): void {
    if (this.sprite) this.sprite.destroy();
    if (this.nameText) this.nameText.destroy();
    if (this.roleText) this.roleText.destroy();
  }
}