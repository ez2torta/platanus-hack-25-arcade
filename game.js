// Platanus Hack 25: Pixel Fighter
// Fight with 3-button controls using pixelated sprites!

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  scene: {
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

// Game variables
let pixelSize = 10; // Reduced to accommodate 10x10 sprites
let graphics;
let player1, player2;
let gameState = 'playing';
let debugMode = false;
let uiText = {};

// Fighter sprite patterns (10x10 for better expressivity)
const fighterSprites = {
  // Player 1 states
  p1_idle: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1]
  ],
  p1_walk_forward: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,1,1,0,0],
    [1,1,1,0,0,1,1,1,0,0]
  ],
  p1_walk_back: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,0,1,1,0,0,0,1,1,0],
    [0,0,1,1,1,0,0,1,1,1]
  ],
  p1_attack_low: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1]
  ],
  p1_attack_mid: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1]
  ],
  p1_donkey_kick: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,0,0,0],
    [0,1,1,0,1,1,1,0,0,0],
    [0,1,1,0,1,1,1,1,0,0],
    [1,1,1,0,0,1,1,1,1,0]
  ],
  p1_shoryu: [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1]
  ],
  p1_hit: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1]
  ],

  // Player 2 states (different style)
  p2_idle: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1]
  ],
  p2_walk_forward: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,0,1,1,0,0,0,1,1,0],
    [0,0,1,1,1,0,0,1,1,1]
  ],
  p2_walk_back: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,1,1,0,0],
    [1,1,1,0,0,1,1,1,0,0]
  ],
  p2_attack_low: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1]
  ],
  p2_attack_mid: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1]
  ],
  p2_donkey_kick: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,1,0,1,1,0],
    [0,0,0,1,1,1,0,1,1,0],
    [0,0,1,1,1,1,0,1,1,0],
    [0,1,1,1,1,0,0,1,1,1]
  ],
  p2_shoryu: [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1]
  ],
  p2_hit: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,0,0,0,0,1,1,0],
    [1,1,1,0,0,0,0,1,1,1]
  ]
};

// Attack definitions with detailed frame data and specific hitboxes
const attacks = {
  attack_low: {
    frames: 25,
    startup: 5,
    active: 8,
    recovery: 12,
    damage: 12,
    hitboxes: [
      { frame: 5, x: 0, y: 60, w: 40, h: 30 },
      { frame: 8, x: 5, y: 55, w: 45, h: 35 },
      { frame: 12, x: 0, y: 60, w: 35, h: 25 }
    ],
    hurtbox: { x: -40, y: 0, w: 80, h: 100 }
  },
  attack_mid: {
    frames: 30,
    startup: 8,
    active: 10,
    recovery: 12,
    damage: 18,
    hitboxes: [
      { frame: 8, x: 0, y: 30, w: 50, h: 40 },
      { frame: 12, x: 10, y: 25, w: 55, h: 45 },
      { frame: 16, x: 5, y: 30, w: 45, h: 35 }
    ],
    hurtbox: { x: -40, y: 0, w: 80, h: 100 }
  },
  donkey_kick: {
    frames: 45,
    startup: 15,
    active: 12,
    recovery: 18,
    damage: 25,
    hitboxes: [
      { frame: 15, x: 20, y: 40, w: 60, h: 40 },
      { frame: 20, x: 30, y: 35, w: 70, h: 45 },
      { frame: 25, x: 25, y: 40, w: 65, h: 40 }
    ],
    hurtbox: { x: -40, y: 0, w: 80, h: 100 },
    movement: { x: 3, y: 0 }
  },
  shoryu: {
    frames: 58,
    startup: 2,
    active: 15,
    recovery: 41,
    damage: 35,
    hitboxes: [
      { frame: 2, x: 10, y: -20, w: 50, h: 80 },
      { frame: 5, x: 15, y: -40, w: 55, h: 100 },
      { frame: 8, x: 20, y: -60, w: 60, h: 120 },
      { frame: 12, x: 15, y: -40, w: 55, h: 100 },
      { frame: 16, x: 10, y: -20, w: 50, h: 80 }
    ],
    hurtbox: { x: -40, y: 0, w: 80, h: 100 },
    invulnerable: true,
    invulnerableFrames: 17,
    movement: { x: 2, y: -8 }
  }
};

// Input states for contextual attacks
const inputStates = {
  NONE: 0,
  BACK: 1,
  FORWARD: 2,
  ATTACK: 4,
  ATTACK_HELD: 8
};

// Fighter class
class Fighter {
  constructor(x, y, isPlayer1) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.maxHealth = 100;
    this.isPlayer1 = isPlayer1;
    this.facing = isPlayer1 ? 1 : -1;
    this.state = 'idle';
    this.currentAttack = null;
    this.attackFrame = 0;
    this.attackTimer = 0;
    this.hitStun = 0;
    this.blockStun = 0;
    this.guardCount = 0;
    this.maxGuards = 3;
    this.roundsWon = 0;
    this.invulnerable = false;
    this.invulnerableTimer = 0;
    
    // Movement
    this.velX = 0;
    this.velY = 0;
    this.grounded = true;
    this.walkSpeed = 2;
    
    // Input system
    this.inputState = 0;
    this.attackButtonPressed = false;
    this.attackButtonHoldTime = 0;
    this.attackButtonJustReleased = false;
    this.backPressed = false;
    this.forwardPressed = false;
    
    // Animation frame counter
    this.animFrame = 0;
  }
  
  update(delta) {
    // Update timers
    if (this.hitStun > 0) this.hitStun--;
    if (this.blockStun > 0) this.blockStun--;
    if (this.invulnerableTimer > 0) this.invulnerableTimer--;
    this.invulnerable = this.invulnerableTimer > 0;
    
    // Update attack button hold time
    if (this.attackButtonPressed) {
      this.attackButtonHoldTime++;
    }
    
    // Update attack
    if (this.currentAttack) {
      this.attackFrame++;
      const attack = attacks[this.currentAttack];
      
      // Apply movement during attack
      if (attack.movement && this.attackFrame <= attack.startup + attack.active) {
        this.velX += this.facing * attack.movement.x * 0.5;
        if (attack.movement.y !== 0 && this.grounded) {
          this.velY = attack.movement.y;
          this.grounded = false;
        }
      }
      
      if (this.attackFrame >= attack.frames) {
        this.currentAttack = null;
        this.attackFrame = 0;
        this.state = 'idle';
      }
    }
    
    // Handle movement based on input state
    if (this.canAct() && !this.currentAttack) {
      if (this.backPressed) {
        this.state = 'walk_back';
        this.velX = -this.walkSpeed * this.facing;
        // Walking back activates guard
        if (this.guardCount < this.maxGuards) {
          this.blockStun = 1; // Minimal block stun to indicate blocking
        }
      } else if (this.forwardPressed) {
        this.state = 'walk_forward';
        this.velX = this.walkSpeed * this.facing;
      } else {
        this.state = 'idle';
      }
    }
    
    // Apply movement
    this.x += this.velX;
    this.y += this.velY;
    
    // Gravity and ground collision
    if (!this.grounded) {
      this.velY += 0.8; // gravity
    }
    
    if (this.y >= 400) { // ground level
      this.y = 400;
      this.velY = 0;
      this.grounded = true;
    }
    
    // Screen boundaries
    this.x = Math.max(50, Math.min(this.x, 750));
    
    // Friction
    this.velX *= 0.85;
    
    // Update animation frame
    this.animFrame++;
  }
  
  canAct() {
    return this.hitStun <= 0 && this.blockStun <= 1 && !this.currentAttack;
  }
  
  processAttackInput() {
    if (!this.canAct() || !this.attackButtonJustReleased) return false;
    
    let attackType = null;
    
    // Determine attack type based on hold time and direction
    if (this.attackButtonHoldTime >= 60) { // 1 second at 60fps
      // Special attacks (held for 1+ seconds)
      if (this.forwardPressed) {
        attackType = 'shoryu';
      } else {
        attackType = 'donkey_kick';
      }
    } else {
      // Normal attacks (quick press)
      if (this.forwardPressed || this.backPressed) {
        attackType = 'attack_mid';
      } else {
        attackType = 'attack_low';
      }
    }
    
    if (attackType) {
      this.performAttack(attackType);
      return true;
    }
    
    return false;
  }
  
  performAttack(attackType) {
    this.currentAttack = attackType;
    this.attackFrame = 0;
    this.state = attackType;
    
    const attack = attacks[attackType];
    
    // Set invulnerability for shoryu
    if (attack.invulnerable) {
      this.invulnerableTimer = attack.invulnerableFrames;
    }
    
    // Play sound based on attack type
    let frequency = 400;
    if (attackType === 'shoryu') frequency = 800;
    else if (attackType === 'donkey_kick') frequency = 300;
    else if (attackType === 'attack_mid') frequency = 500;
    
    playTone(this.scene, frequency, 0.15);
    return true;
  }
  
  takeDamage(damage, knockback = 0) {
    if (this.invulnerable) return false;
    
    const isBlocking = (this.state === 'walk_back' || this.blockStun > 1) && this.guardCount < this.maxGuards;
    
    if (isBlocking) {
      // Blocked attack
      this.health -= Math.floor(damage * 0.25);
      this.guardCount++;
      this.blockStun = 20;
      this.velX = knockback * this.facing * 0.3;
      playTone(this.scene, 250, 0.1);
      return false;
    } else {
      // Hit
      this.health -= damage;
      this.hitStun = Math.floor(damage * 0.8) + 10;
      this.state = 'hit';
      this.velX = knockback * this.facing;
      this.currentAttack = null;
      this.attackFrame = 0;
      return true;
    }
  }
  
  resetInputs() {
    this.attackButtonJustReleased = false;
  }
  
  getHitboxes() {
    if (!this.currentAttack) return [];
    
    const attack = attacks[this.currentAttack];
    const activeHitboxes = [];
    
    // Check each hitbox for current frame
    for (const hitboxData of attack.hitboxes) {
      if (this.attackFrame === hitboxData.frame) {
        const hitbox = {
          x: this.x + (this.facing > 0 ? hitboxData.x : -hitboxData.x - hitboxData.w),
          y: this.y + hitboxData.y,
          w: hitboxData.w,
          h: hitboxData.h,
          damage: attack.damage
        };
        activeHitboxes.push(hitbox);
      }
    }
    
    return activeHitboxes;
  }
  
  getHurtbox() {
    if (!this.currentAttack) {
      return {
        x: this.x - 50,
        y: this.y,
        w: 100,
        h: 100
      };
    }
    
    const attack = attacks[this.currentAttack];
    const hurtbox = attack.hurtbox;
    return {
      x: this.x + (this.facing > 0 ? hurtbox.x : -hurtbox.x - hurtbox.w),
      y: this.y + hurtbox.y,
      w: hurtbox.w,
      h: hurtbox.h
    };
  }
  
  getCurrentSprite() {
    const prefix = this.isPlayer1 ? 'p1_' : 'p2_';
    
    if (this.hitStun > 0) return prefix + 'hit';
    if (this.currentAttack) return prefix + this.currentAttack;
    if (this.state === 'walk_forward') return prefix + 'walk_forward';
    if (this.state === 'walk_back') return prefix + 'walk_back';
    return prefix + 'idle';
  }
}

function create() {
  const scene = this;
  graphics = this.add.graphics();
  
  // Initialize fighters
  player1 = new Fighter(200, 400, true);
  player2 = new Fighter(600, 400, false);
  player1.scene = scene;
  player2.scene = scene;
  
  // UI Text
  uiText.health1 = this.add.text(50, 50, 'P1: 100', {
    fontSize: '24px',
    fontFamily: 'Arial, sans-serif',
    color: '#00ff00'
  });
  
  uiText.health2 = this.add.text(650, 50, 'P2: 100', {
    fontSize: '24px',
    fontFamily: 'Arial, sans-serif',
    color: '#ff0000'
  });
  
  uiText.rounds = this.add.text(400, 50, 'Round 1', {
    fontSize: '32px',
    fontFamily: 'Arial, sans-serif',
    color: '#ffff00'
  }).setOrigin(0.5);
  
  uiText.guards1 = this.add.text(50, 80, 'Guards: 0/3', {
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    color: '#88ff88'
  });
  
  uiText.guards2 = this.add.text(650, 80, 'Guards: 0/3', {
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    color: '#ff8888'
  });
  
  // Instructions
  this.add.text(400, 100, 'P1: A-Left S-Attack D-Right | P2: ←-Left ↓-Attack →-Right', {
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    color: '#888888',
    align: 'center'
  }).setOrigin(0.5);
  
  this.add.text(400, 120, 'Hold Attack 1sec+ for specials | Back+Walk = Guard | F1-Debug | R-Restart', {
    fontSize: '12px',
    fontFamily: 'Arial, sans-serif',
    color: '#666666',
    align: 'center'
  }).setOrigin(0.5);
  
  // Keyboard input
  this.input.keyboard.on('keydown', handleKeyDown);
  this.input.keyboard.on('keyup', handleKeyUp);
  
  // Ground line
  graphics.lineStyle(2, 0x444444);
  graphics.moveTo(0, 500);
  graphics.lineTo(800, 500);
  graphics.stroke();
  
  playTone(this, 440, 0.2);
}

function handleKeyDown(event) {
  if (gameState === 'gameover' && event.key === 'r') {
    restartGame();
    return;
  }
  
  if (event.key === 'F1') {
    debugMode = !debugMode;
    return;
  }
  
  // Player 1 controls (ASD)
  if (event.key === 'a' || event.key === 'A') {
    player1.backPressed = true;
  } else if (event.key === 's' || event.key === 'S') {
    if (!player1.attackButtonPressed) {
      player1.attackButtonPressed = true;
      player1.attackButtonHoldTime = 0;
    }
  } else if (event.key === 'd' || event.key === 'D') {
    player1.forwardPressed = true;
  }
  
  // Player 2 controls (Arrow keys)
  if (event.key === 'ArrowLeft') {
    player2.backPressed = true;
  } else if (event.key === 'ArrowDown') {
    if (!player2.attackButtonPressed) {
      player2.attackButtonPressed = true;
      player2.attackButtonHoldTime = 0;
    }
  } else if (event.key === 'ArrowRight') {
    player2.forwardPressed = true;
  }
}

function handleKeyUp(event) {
  // Player 1 controls
  if (event.key === 'a' || event.key === 'A') {
    player1.backPressed = false;
  } else if (event.key === 's' || event.key === 'S') {
    if (player1.attackButtonPressed) {
      player1.attackButtonPressed = false;
      player1.attackButtonJustReleased = true;
    }
  } else if (event.key === 'd' || event.key === 'D') {
    player1.forwardPressed = false;
  }
  
  // Player 2 controls
  if (event.key === 'ArrowLeft') {
    player2.backPressed = false;
  } else if (event.key === 'ArrowDown') {
    if (player2.attackButtonPressed) {
      player2.attackButtonPressed = false;
      player2.attackButtonJustReleased = true;
    }
  } else if (event.key === 'ArrowRight') {
    player2.forwardPressed = false;
  }
}

function drawSprite(sprite, x, y, color, facingRight = true) {
  const pattern = fighterSprites[sprite];
  if (!pattern) return;
  
  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col]) {
        const pixelX = facingRight ? 
          x + col * pixelSize : 
          x + (pattern[0].length - 1 - col) * pixelSize;
        const pixelY = y + row * pixelSize;
        
        graphics.fillStyle(color, 1);
        graphics.fillRect(pixelX, pixelY, pixelSize - 1, pixelSize - 1);
      }
    }
  }
}

function update(_time, delta) {
  if (gameState === 'gameover') return;
  
  // Process attack inputs
  player1.processAttackInput();
  player2.processAttackInput();
  
  // Update fighters
  player1.update(delta);
  player2.update(delta);
  
  // Reset input flags
  player1.resetInputs();
  player2.resetInputs();
  
  // Check collisions
  checkCollisions();
  
  // Update facing directions (only when not attacking)
  if (!player1.currentAttack && !player2.currentAttack) {
    if (player1.x < player2.x) {
      player1.facing = 1;
      player2.facing = -1;
    } else {
      player1.facing = -1;
      player2.facing = 1;
    }
  }
  
  // Check for round end
  if (player1.health <= 0 || player2.health <= 0) {
    endRound();
  }
  
  // Update UI
  updateUI();
  
  // Draw everything
  drawGame();
}

function checkCollisions() {
  const p1Hitboxes = player1.getHitboxes();
  const p2Hitboxes = player2.getHitboxes();
  const p1Hurtbox = player1.getHurtbox();
  const p2Hurtbox = player2.getHurtbox();
  
  // Player 1 hitting Player 2
  for (const hitbox of p1Hitboxes) {
    if (boxCollision(hitbox, p2Hurtbox)) {
      const hit = player2.takeDamage(hitbox.damage, 10);
      if (hit) {
        playTone(player1.scene, 400, 0.15);
        // Add small screen shake effect
        graphics.scene.cameras.main.shake(100, 0.01);
      } else {
        playTone(player1.scene, 250, 0.1);
      }
      break; // Only process one hit per frame
    }
  }
  
  // Player 2 hitting Player 1
  for (const hitbox of p2Hitboxes) {
    if (boxCollision(hitbox, p1Hurtbox)) {
      const hit = player1.takeDamage(hitbox.damage, 10);
      if (hit) {
        playTone(player2.scene, 400, 0.15);
        graphics.scene.cameras.main.shake(100, 0.01);
      } else {
        playTone(player2.scene, 250, 0.1);
      }
      break;
    }
  }
}

function boxCollision(box1, box2) {
  return box1.x < box2.x + box2.w &&
         box1.x + box1.w > box2.x &&
         box1.y < box2.y + box2.h &&
         box1.y + box1.h > box2.y;
}

function endRound() {
  if (player1.health <= 0) {
    player2.roundsWon++;
  } else {
    player1.roundsWon++;
  }
  
  if (player1.roundsWon >= 2 || player2.roundsWon >= 2) {
    gameState = 'gameover';
    const winner = player1.roundsWon >= 2 ? 'Player 1' : 'Player 2';
    
    // Show game over screen
    setTimeout(() => {
      const overlay = graphics.scene.add.graphics();
      overlay.fillStyle(0x000000, 0.8);
      overlay.fillRect(0, 0, 800, 600);
      
      const winText = graphics.scene.add.text(400, 300, `${winner} Wins!`, {
        fontSize: '48px',
        fontFamily: 'Arial, sans-serif',
        color: winner === 'Player 1' ? '#00ff00' : '#ff0000',
        align: 'center'
      }).setOrigin(0.5);
      
      graphics.scene.add.text(400, 400, 'Press R to Restart', {
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffff00',
        align: 'center'
      }).setOrigin(0.5);
    }, 100);
  } else {
    // Next round - reset guard counts
    setTimeout(() => {
      player1.health = player1.maxHealth;
      player2.health = player2.maxHealth;
      player1.x = 200;
      player2.x = 600;
      player1.y = 400;
      player2.y = 400;
      player1.state = 'idle';
      player2.state = 'idle';
      player1.currentAttack = null;
      player2.currentAttack = null;
      player1.guardCount = 0; // Reset guard count each round
      player2.guardCount = 0;
      player1.hitStun = 0;
      player2.hitStun = 0;
      player1.blockStun = 0;
      player2.blockStun = 0;
    }, 2000);
  }
}

function updateUI() {
  uiText.health1.setText(`P1: ${Math.max(0, player1.health)}`);
  uiText.health2.setText(`P2: ${Math.max(0, player2.health)}`);
  
  const totalRounds = player1.roundsWon + player2.roundsWon + 1;
  uiText.rounds.setText(`Round ${totalRounds}`);
  
  // Update guard counters
  const guardColor1 = player1.guardCount >= 3 ? '#ff0000' : '#88ff88';
  const guardColor2 = player2.guardCount >= 3 ? '#ff0000' : '#ff8888';
  
  uiText.guards1.setText(`Guards: ${player1.guardCount}/3`);
  uiText.guards1.setColor(guardColor1);
  
  uiText.guards2.setText(`Guards: ${player2.guardCount}/3`);
  uiText.guards2.setColor(guardColor2);
  
  // Update health bar colors based on health
  if (player1.health < 30) {
    uiText.health1.setColor('#ff0000');
  } else if (player1.health < 60) {
    uiText.health1.setColor('#ffaa00');
  } else {
    uiText.health1.setColor('#00ff00');
  }
  
  if (player2.health < 30) {
    uiText.health2.setColor('#ff0000');
  } else if (player2.health < 60) {
    uiText.health2.setColor('#ffaa00');
  } else {
    uiText.health2.setColor('#ff0000');
  }
}

function restartGame() {
  gameState = 'playing';
  
  // Reset fighters
  player1.health = player1.maxHealth;
  player2.health = player2.maxHealth;
  player1.roundsWon = 0;
  player2.roundsWon = 0;
  player1.x = 200;
  player2.x = 600;
  player1.y = 400;
  player2.y = 400;
  player1.state = 'idle';
  player2.state = 'idle';
  player1.currentAttack = null;
  player2.currentAttack = null;
  player1.guardCount = 0;
  player2.guardCount = 0;
  player1.hitStun = 0;
  player2.hitStun = 0;
  player1.blockStun = 0;
  player2.blockStun = 0;
  player1.invulnerableTimer = 0;
  player2.invulnerableTimer = 0;
  player1.attackButtonPressed = false;
  player2.attackButtonPressed = false;
  player1.attackButtonHoldTime = 0;
  player2.attackButtonHoldTime = 0;
  player1.backPressed = false;
  player2.backPressed = false;
  player1.forwardPressed = false;
  player2.forwardPressed = false;
  
  // Clear any overlays
  graphics.scene.scene.restart();
}

function drawGame() {
  graphics.clear();
  
  // Draw ground
  graphics.lineStyle(2, 0x444444);
  graphics.moveTo(0, 500);
  graphics.lineTo(800, 500);
  graphics.stroke();
  
  // Draw fighters with improved colors
  let p1Color = 0x00ff00;
  let p2Color = 0x0088ff;
  
  if (player1.hitStun > 0) p1Color = 0xff6666;
  else if (player1.invulnerable) p1Color = 0xffff00;
  else if (player1.state === 'walk_back' && player1.guardCount < player1.maxGuards) p1Color = 0x88ff88;
  
  if (player2.hitStun > 0) p2Color = 0xff6666;
  else if (player2.invulnerable) p2Color = 0xffff00;
  else if (player2.state === 'walk_back' && player2.guardCount < player2.maxGuards) p2Color = 0x8888ff;
  
  drawSprite(player1.getCurrentSprite(), player1.x - 60, player1.y, p1Color, player1.facing > 0);
  drawSprite(player2.getCurrentSprite(), player2.x - 60, player2.y, p2Color, player2.facing > 0);
  
  // Draw health bars
  drawHealthBar(100, 30, player1.health, player1.maxHealth, 0x00ff00);
  drawHealthBar(500, 30, player2.health, player2.maxHealth, 0xff0000);
  
  // Draw round indicators
  drawRoundIndicators();
  
  // Debug mode
  if (debugMode) {
    drawDebugInfo();
  }
}

function drawHealthBar(x, y, health, maxHealth, color) {
  const width = 200;
  const height = 20;
  
  // Background
  graphics.fillStyle(0x333333, 1);
  graphics.fillRect(x, y, width, height);
  
  // Health
  const healthWidth = (health / maxHealth) * width;
  graphics.fillStyle(color, 1);
  graphics.fillRect(x, y, Math.max(0, healthWidth), height);
  
  // Border
  graphics.lineStyle(2, 0xffffff);
  graphics.strokeRect(x, y, width, height);
}

function drawRoundIndicators() {
  // Player 1 rounds
  for (let i = 0; i < 2; i++) {
    const color = i < player1.roundsWon ? 0x00ff00 : 0x333333;
    graphics.fillStyle(color, 1);
    graphics.fillCircle(120 + i * 20, 70, 8);
  }
  
  // Player 2 rounds
  for (let i = 0; i < 2; i++) {
    const color = i < player2.roundsWon ? 0xff0000 : 0x333333;
    graphics.fillStyle(color, 1);
    graphics.fillCircle(660 + i * 20, 70, 8);
  }
}

function drawDebugInfo() {
  // Draw hitboxes
  const p1Hitboxes = player1.getHitboxes();
  const p2Hitboxes = player2.getHitboxes();
  
  graphics.lineStyle(2, 0xff0000);
  p1Hitboxes.forEach(hitbox => {
    graphics.strokeRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
  });
  
  p2Hitboxes.forEach(hitbox => {
    graphics.strokeRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
  });
  
  // Draw hurtboxes
  const p1Hurtbox = player1.getHurtbox();
  const p2Hurtbox = player2.getHurtbox();
  
  const hurtboxColor1 = player1.invulnerable ? 0xffff00 : 0x00ffff;
  const hurtboxColor2 = player2.invulnerable ? 0xffff00 : 0x00ffff;
  
  graphics.lineStyle(1, hurtboxColor1);
  graphics.strokeRect(p1Hurtbox.x, p1Hurtbox.y, p1Hurtbox.w, p1Hurtbox.h);
  
  graphics.lineStyle(1, hurtboxColor2);
  graphics.strokeRect(p2Hurtbox.x, p2Hurtbox.y, p2Hurtbox.w, p2Hurtbox.h);
  
  // Draw center points
  graphics.fillStyle(0xffff00, 1);
  graphics.fillCircle(player1.x, player1.y + 50, 3);
  graphics.fillCircle(player2.x, player2.y + 50, 3);
  
  // Draw debug text
  const debugText1 = `P1: ${player1.currentAttack || player1.state} F:${player1.attackFrame} H:${player1.attackButtonHoldTime}`;
  const debugText2 = `P2: ${player2.currentAttack || player2.state} F:${player2.attackFrame} H:${player2.attackButtonHoldTime}`;
  
  graphics.scene.add.text(10, 150, debugText1, {
    fontSize: '12px',
    fontFamily: 'Arial, sans-serif',
    color: '#ffffff'
  }).setDepth(1000);
  
  graphics.scene.add.text(10, 170, debugText2, {
    fontSize: '12px',
    fontFamily: 'Arial, sans-serif',
    color: '#ffffff'
  }).setDepth(1000);
}



function playTone(scene, frequency, duration) {
  const audioContext = scene.sound.context;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'square';

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}
