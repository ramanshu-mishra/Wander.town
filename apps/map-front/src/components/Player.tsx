// src/components/Player.tsx
import Phaser from 'phaser';

export interface PlayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  speed?: number;
  collisionWidth?: number;
  collisionHeight?: number;
  frameWidth?: number;
  frameHeight?: number;
  animationConfig?: AnimationConfig;
  scale?: number; // 👈 added scale
}

export interface AnimationConfig {
  walkDown?: { start: number; end: number };
  walkLeft?: { start: number; end: number };
  walkRight?: { start: number; end: number };
  walkUp?: { start: number; end: number };
  idleFrame?: number;
  frameRate?: number;
}

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public scene: Phaser.Scene;
  private speed: number;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys?: any;
  private lastDirection: string = 'down';
  private animationConfig: AnimationConfig;
  private isAnimated: boolean = false;

  constructor(config: PlayerConfig) {
    this.scene = config.scene;
    this.speed = config.speed || 160;
    
    this.animationConfig = config.animationConfig || {
      walkDown: { start: 0, end: 5 },
      walkLeft: { start: 5, end: 11 },
      walkRight: { start: 12, end: 17 },
      walkUp: { start: 18, end: 23 },
      idleFrame: 0,
      frameRate: 8
    };

    this.sprite = this.scene.physics.add.sprite(config.x, config.y, config.texture);
    this.sprite.setDepth(10);
    this.sprite.setCollideWorldBounds(true);

    // 👇 Apply scale if provided
    if (config.scale) {
      this.sprite.setScale(config.scale||2);
    }

    const texture = this.scene.textures.get(config.texture);
    this.isAnimated = texture.frameTotal > 1;

    this.setupPhysicsBody(config.collisionWidth, config.collisionHeight);

    if (this.isAnimated) {
      this.createAnimations();
    }

    this.setupControls();

    console.log(`Player created: ${this.isAnimated ? 'Animated' : 'Static'} sprite`);
  }

  private setupPhysicsBody(collisionWidth?: number, collisionHeight?: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const width = collisionWidth || 16;
    const height = collisionHeight || 16;
    body.setSize(width, height);
    const offsetX = (this.sprite.width - width) / 2;
    const offsetY = (this.sprite.height - height) / 2;
    body.setOffset(offsetX, offsetY);
  }

  private setupControls(): void {
    this.cursors = this.scene.input.keyboard?.createCursorKeys();
    this.wasdKeys = this.scene.input.keyboard?.addKeys('W,S,A,D');
  }

  private createAnimations(): void {
    const textureKey = this.sprite.texture.key;
    const config = this.animationConfig;

    if (!this.scene.anims.exists(`${textureKey}-walk-down`)) {
      if (config.walkDown) {
        this.scene.anims.create({
          key: `${textureKey}-walk-down`,
          frames: this.scene.anims.generateFrameNumbers(textureKey, { 
            start: config.walkDown.start, 
            end: config.walkDown.end 
          }),
          frameRate: config.frameRate || 8,
          repeat: -1
        });
      }

      if (config.walkLeft) {
        this.scene.anims.create({
          key: `${textureKey}-walk-left`,
          frames: this.scene.anims.generateFrameNumbers(textureKey, { 
            start: config.walkLeft.start, 
            end: config.walkLeft.end 
          }),
          frameRate: config.frameRate || 8,
          repeat: -1
        });
      }

      if (config.walkRight) {
        this.scene.anims.create({
          key: `${textureKey}-walk-right`,
          frames: this.scene.anims.generateFrameNumbers(textureKey, { 
            start: config.walkRight.start, 
            end: config.walkRight.end 
          }),
          frameRate: config.frameRate || 8,
          repeat: -1
        });
      }

      if (config.walkUp) {
        this.scene.anims.create({
          key: `${textureKey}-walk-up`,
          frames: this.scene.anims.generateFrameNumbers(textureKey, { 
            start: config.walkUp.start, 
            end: config.walkUp.end 
          }),
          frameRate: config.frameRate || 8,
          repeat: -1
        });
      }

      this.scene.anims.create({
        key: `${textureKey}-idle-down`,
        frames: [{ key: textureKey, frame: config.walkDown?.start || config.idleFrame || 0 }],
        frameRate: 1
      });

      this.scene.anims.create({
        key: `${textureKey}-idle-left`,
        frames: [{ key: textureKey, frame: config.walkLeft?.start || config.idleFrame || 0 }],
        frameRate: 1
      });

      this.scene.anims.create({
        key: `${textureKey}-idle-right`,
        frames: [{ key: textureKey, frame: config.walkRight?.start || config.idleFrame || 0 }],
        frameRate: 1
      });

      this.scene.anims.create({
        key: `${textureKey}-idle-up`,
        frames: [{ key: textureKey, frame: config.walkUp?.start || config.idleFrame || 0 }],
        frameRate: 1
      });
    }
  }

  public update(): void {
    if (!this.sprite || !this.sprite.body) return;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const textureKey = this.sprite.texture.key;
    
    body.setVelocity(0);

    let isMoving = false;
    let currentDirection = this.lastDirection;

    if (this.cursors?.left?.isDown || this.wasdKeys?.A?.isDown) {
      body.setVelocityX(-this.speed);
      currentDirection = 'left';
      isMoving = true;
      if (this.isAnimated) this.sprite.play(`${textureKey}-walk-left`, true);
    } else if (this.cursors?.right?.isDown || this.wasdKeys?.D?.isDown) {
      body.setVelocityX(this.speed);
      currentDirection = 'right';
      isMoving = true;
      if (this.isAnimated) this.sprite.play(`${textureKey}-walk-right`, true);
    }

    if (this.cursors?.up?.isDown || this.wasdKeys?.W?.isDown) {
      body.setVelocityY(-this.speed);
      currentDirection = 'up';
      isMoving = true;
      if (this.isAnimated) this.sprite.play(`${textureKey}-walk-up`, true);
    } else if (this.cursors?.down?.isDown || this.wasdKeys?.S?.isDown) {
      body.setVelocityY(this.speed);
      currentDirection = 'down';
      isMoving = true;
      if (this.isAnimated) this.sprite.play(`${textureKey}-walk-down`, true);
    }

    if (!isMoving && this.isAnimated) {
      this.sprite.play(`${textureKey}-idle-${this.lastDirection}`, true);
    }

    if (isMoving) {
      this.lastDirection = currentDirection;
    }

    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
      body.velocity.normalize().scale(this.speed);
    }
  }

  public playAnimation(animationKey: string): void {
    if (this.isAnimated) this.sprite.play(animationKey, true);
  }

  public stopAnimation(): void {
    if (this.isAnimated) this.sprite.stop();
  }

  public setDirection(direction: 'up' | 'down' | 'left' | 'right'): void {
    this.lastDirection = direction;
    if (this.isAnimated) {
      const textureKey = this.sprite.texture.key;
      this.sprite.play(`${textureKey}-idle-${direction}`, true);
    }
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getX(): number {
    return this.sprite.x;
  }

  public getY(): number {
    return this.sprite.y;
  }

  public getDirection(): string {
    return this.lastDirection;
  }

  public isMoving(): boolean {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    return body.velocity.x !== 0 || body.velocity.y !== 0;
  }

  public setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public setVisible(visible: boolean): void {
    this.sprite.setVisible(visible);
  }

  public setAlpha(alpha: number): void {
    this.sprite.setAlpha(alpha);
  }

  public setTint(tint: number): void {
    this.sprite.setTint(tint);
  }

  public health: number = 100;
  public maxHealth: number = 100;
  public energy: number = 100;
  public maxEnergy: number = 100;

  public takeDamage(damage: number): void {
    this.health = Math.max(0, this.health - damage);
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.sprite.clearTint();
    });
  }

  public heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  public destroy(): void {
    if (this.sprite) this.sprite.destroy();
  }
}

export type { PlayerConfig, AnimationConfig };
