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

// Fighter sprite patterns (10x10, optimized for better readability)
const fighterSprites = {
  // Player 1 states - SLIMMER for better action recognition
  p1_idle: [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,0,1,1,0,1,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,0,1,1,0,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,1,1,0,0,0,0,1,1,0]
  ],
  p1_walk_forward: [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,0,1,1,0,1,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,0,1,1,0,1,0,0],
    [0,0,1,0,0,0,1,0,0,0],  // Forward lean
    [0,1,0,0,0,1,1,1,0,0]
  ],
  p1_walk_back: [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,0,1,1,0,1,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,0,1,1,1,1,0,0,0],  // Defensive posture
    [0,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,0,1,1,0,1,0,0],
    [0,1,1,0,0,0,0,1,0,0],  // Back lean
    [1,1,0,0,0,0,0,1,1,0]
  ],
  p1_attack_low: [
    [0,0,1,1,0,0,0,0,0,0],  // Head (player position)
    [0,1,1,1,1,0,0,0,0,0],  // Face (player body)
    [1,0,1,1,0,0,0,0,0,0],  // Eyes (player body)
    [1,1,1,1,0,0,0,0,0,0],  // Body (player body)
    [0,1,1,1,0,0,0,0,0,0],  // Torso (player body)
    [1,1,1,1,0,0,0,0,0,0],  // Body (player body)
    [1,1,1,1,0,0,0,0,0,0],  // Normal body position
    [1,0,1,1,1,1,1,0,0,0],  // LOW ATTACK extending right
    [1,0,0,1,1,1,1,1,1,0],  // LOW KICK extending forward
    [1,1,0,0,1,1,1,1,1,1]   // MAXIMUM low attack reach
  ],
  p1_attack_mid: [
    [0,0,1,1,0,0,0,0,0,0],  // Head (player position)
    [0,1,1,1,1,0,0,0,0,0],  // Face (player body)
    [1,0,1,1,0,0,0,0,0,0],  // Eyes (player body)
    [1,1,1,1,1,1,1,1,1,1],  // MID PUNCH extending right
    [1,1,1,1,1,1,1,1,1,1],  // MAXIMUM mid attack reach
    [1,1,1,1,1,1,1,1,1,1],  // Full extension at mid level
    [0,1,1,1,0,0,0,0,0,0],  // Back to player body
    [1,0,1,1,0,0,0,0,0,0],  // Normal lower body
    [1,0,0,0,0,0,0,0,0,0],  // Normal stance
    [1,1,0,0,0,0,0,0,0,0]   // Normal feet (player body)
  ],
  p1_donkey_kick: [
    [0,0,1,1,0,0,0,0,0,0],  // Head (player position)
    [0,1,1,1,1,0,0,0,0,0],  // Face (player body)
    [1,0,1,1,0,0,0,0,0,0],  // Eyes (player body)
    [1,1,1,1,0,0,0,0,0,0],  // Body (player body)
    [0,1,1,1,0,0,0,0,0,0],  // Torso (player body)
    [1,1,1,1,0,0,0,0,0,0],  // Body (player body)
    [1,0,1,0,0,0,0,0,0,0],  // Player stance
    [1,1,0,1,1,1,1,0,0,0],  // KICK extending forward
    [1,1,0,0,1,1,1,1,1,0],  // FULL KICK extension
    [1,1,0,0,0,1,1,1,1,1]   // MAXIMUM kick reach
  ],
  p1_shoryu: [
    [1,1,1,1,1,1,1,1,1,1],  // UPPERCUT full reach at top
    [1,1,1,1,1,1,1,1,1,1],  // Rising uppercut maximum area
    [1,0,1,0,1,1,0,1,1,1],  // Upper attack zone
    [1,1,1,1,1,1,1,1,1,1],  // Full power uppercut
    [1,1,1,1,1,1,1,1,1,1],  // MAXIMUM rising attack
    [1,1,1,1,1,1,1,1,1,1],  // Full power zone
    [0,1,1,1,1,0,0,0,0,0],  // Back to player body
    [1,0,1,1,0,0,0,0,0,0],  // Player body
    [1,0,0,0,0,0,0,0,0,0],  // Player stance
    [1,1,1,1,0,0,0,0,0,0]   // Player feet
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

  // Player 2 states - SLIMMER (different eye pattern for distinction)
  p2_idle: [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,0,0,1,1,0,0],  // Different eyes (wider apart)
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,0,1,1,0,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,1,1,0,0,0,0,1,1,0]
  ],
  p2_walk_forward: [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,0,1,1,0,1,0,0],
    [0,0,0,1,0,0,0,1,0,0],  // Forward lean (P2 going left)
    [0,0,1,1,1,0,0,1,1,0]
  ],
  p2_walk_back: [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,0,0,1,1,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,1,0],  // Defensive posture
    [0,0,1,1,1,1,1,1,1,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,0,1,1,0,1,0,0],
    [0,0,1,0,0,0,0,1,1,0],  // Back lean (P2 going right)
    [0,1,1,0,0,0,0,1,1,1]
  ],
  p2_attack_low: [
    [0,0,0,0,0,0,1,1,0,0],  // Head (player position - P2 faces left)
    [0,0,0,0,0,1,1,1,1,0],  // Face (player body)  
    [0,0,0,0,0,0,1,1,0,1],  // Eyes (player body)
    [0,0,0,0,0,0,1,1,1,1],  // Body (player body)
    [0,0,0,0,0,0,1,1,1,0],  // Torso (player body)
    [0,0,0,0,0,0,1,1,1,1],  // Body (player body)
    [0,0,0,0,0,0,1,1,1,1],  // Normal body position
    [0,0,0,1,1,1,1,0,1,1],  // LOW ATTACK extending left
    [0,1,1,1,1,1,1,0,0,1],  // LOW KICK extending forward (left)
    [1,1,1,1,1,1,0,0,1,1]   // MAXIMUM low attack reach
  ],
  p2_attack_mid: [
    [0,0,0,0,0,0,1,1,0,0],  // Head (player position - P2 faces left)
    [0,0,0,0,0,1,1,1,1,0],  // Face (player body)
    [0,0,0,0,0,0,1,1,0,1],  // Eyes (player body)
    [0,0,0,0,0,0,1,1,1,1],  // Body upper (player body)
    [0,0,1,1,1,1,1,1,1,1],  // MID PUNCH extending left
    [1,1,1,1,1,1,1,1,1,1],  // MAXIMUM mid attack reach
    [0,0,0,0,0,0,1,1,1,0],  // Back to player body
    [0,0,0,0,0,0,1,1,0,1],  // Normal body
    [0,0,0,0,0,0,0,0,0,1],  // Normal stance
    [0,0,0,0,0,0,1,1,1,1]   // Normal feet (player body)
  ],
  p2_donkey_kick: [
    [0,0,0,0,0,0,1,1,0,0],  // Head (player position - P2 faces left)
    [0,0,0,0,0,1,1,1,1,0],  // Face (player body)
    [0,0,0,0,0,0,1,1,0,1],  // Eyes (player body)
    [0,0,0,0,0,0,1,1,1,1],  // Body (player body)
    [0,0,0,0,0,0,1,1,1,0],  // Torso (player body)
    [0,0,0,0,0,0,1,1,1,1],  // Body (player body)
    [0,0,0,0,0,0,0,1,0,1],  // Player stance
    [0,0,0,1,1,1,1,0,1,1],  // KICK extending left
    [0,1,1,1,1,1,0,0,1,1],  // FULL KICK extension
    [1,1,1,1,1,0,0,0,1,1]   // MAXIMUM kick reach
  ],
  p2_shoryu: [
    [1,1,1,1,1,1,1,1,1,1],  // UPPERCUT full reach at top
    [1,1,1,1,1,1,1,1,1,1],  // Rising uppercut maximum area
    [1,1,1,0,1,1,0,1,0,1],  // Upper attack zone
    [1,1,1,1,1,1,1,1,1,1],  // Full power uppercut
    [1,1,1,1,1,1,1,1,1,1],  // MAXIMUM rising attack
    [1,1,1,1,1,1,1,1,1,1],  // Full power zone
    [0,0,0,0,0,1,1,1,1,0],  // Back to player body
    [0,0,0,0,0,0,1,1,0,1],  // Player body
    [0,0,0,0,0,0,0,0,0,1],  // Player stance
    [0,0,0,0,0,0,1,1,1,1]   // Player feet
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

// Attack definitions with detailed FRAME-BY-FRAME hitbox system
const attacks = {
  attack_low: {
    frames: 25,
    startup: 5,
    active: 8,
    recovery: 12,
    damage: 12,
    hitboxes: [
      { frame: 5, x: -10, y: 60, w: 50, h: 30 },   // Start closer, extend further
      { frame: 6, x: -5, y: 58, w: 55, h: 32 },    // Active frame 1
      { frame: 7, x: 0, y: 55, w: 60, h: 35 },     // Active frame 2 (bigger)
      { frame: 8, x: 5, y: 58, w: 58, h: 32 },     // Active frame 3
      { frame: 9, x: 0, y: 60, w: 55, h: 30 },     // Active frame 4
      { frame: 10, x: -5, y: 62, w: 50, h: 28 },   // Active frame 5
      { frame: 11, x: -8, y: 64, w: 45, h: 25 },   // Final active
      { frame: 12, x: -10, y: 65, w: 40, h: 20 }   // Last hit
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
      { frame: 8, x: -10, y: 30, w: 60, h: 40 },   // Start closer, extend further
      { frame: 9, x: -5, y: 28, w: 65, h: 42 },    // Expanding
      { frame: 10, x: 0, y: 25, w: 70, h: 45 },    // Peak size
      { frame: 11, x: 5, y: 27, w: 68, h: 43 },    // Maintaining
      { frame: 12, x: 8, y: 25, w: 70, h: 45 },    // Strong frame
      { frame: 13, x: 5, y: 28, w: 65, h: 40 },    // Reducing
      { frame: 14, x: 0, y: 30, w: 60, h: 38 },    // Smaller
      { frame: 15, x: -5, y: 32, w: 55, h: 35 },   // Final
      { frame: 16, x: -8, y: 35, w: 50, h: 30 }    // Last hit
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
      { frame: 15, x: -5, y: 40, w: 70, h: 40 }, // Start closer, extend further
      { frame: 16, x: 0, y: 38, w: 75, h: 42 },  // Extending
      { frame: 17, x: 5, y: 35, w: 80, h: 45 },  // Max reach
      { frame: 18, x: 10, y: 33, w: 82, h: 47 }, // Peak power
      { frame: 19, x: 12, y: 35, w: 80, h: 45 }, // Strong
      { frame: 20, x: 10, y: 38, w: 75, h: 42 }, // Maintaining
      { frame: 21, x: 5, y: 40, w: 70, h: 40 },  // Reducing
      { frame: 22, x: 0, y: 42, w: 65, h: 38 },  // Weaker
      { frame: 23, x: -5, y: 44, w: 60, h: 35 }, // Final
      { frame: 24, x: -8, y: 45, w: 55, h: 32 }, // Last hit
      { frame: 25, x: -10, y: 47, w: 50, h: 30 } // Very last
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
      { frame: 2, x: -10, y: -20, w: 60, h: 80 },  // Start closer, cover more area
      { frame: 3, x: -5, y: -30, w: 65, h: 90 },   // Going up
      { frame: 4, x: 0, y: -35, w: 70, h: 95 },    // Higher
      { frame: 5, x: 0, y: -40, w: 70, h: 100 },   // Peak start
      { frame: 6, x: 5, y: -50, w: 75, h: 110 },   // Rising more
      { frame: 7, x: 10, y: -55, w: 80, h: 115 },  // Higher
      { frame: 8, x: 10, y: -60, w: 80, h: 120 },  // Maximum height
      { frame: 9, x: 12, y: -58, w: 78, h: 118 },  // Peak power
      { frame: 10, x: 10, y: -55, w: 80, h: 115 }, // Strong at top
      { frame: 11, x: 5, y: -50, w: 75, h: 110 },  // Still strong
      { frame: 12, x: 0, y: -45, w: 70, h: 105 },  // Coming down
      { frame: 13, x: 0, y: -40, w: 70, h: 100 },  // Descending
      { frame: 14, x: -5, y: -35, w: 65, h: 95 },  // Lower
      { frame: 15, x: -10, y: -30, w: 60, h: 90 }, // Almost down
      { frame: 16, x: -12, y: -25, w: 58, h: 85 }, // Final hit
      { frame: 17, x: -15, y: -20, w: 55, h: 80 }  // Last active
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
    
    // Hit tracking - prevent multiple hits from same attack
    this.lastHitByAttack = null;
    this.lastHitFrame = -1;
    
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
        // Reset hit tracking for opponents when attack ends
        this.resetOpponentHitTracking();
      }
    }
    
    // Handle movement based on input state (FIXED: Always use absolute directions)
    if (this.canAct() && !this.currentAttack) {
      if (this.backPressed) {
        this.state = 'walk_back';
        // Fixed: Use absolute directions - left is always negative, right is always positive
        this.velX = this.isPlayer1 ? -this.walkSpeed : this.walkSpeed;
        // Walking back activates guard
        if (this.guardCount < this.maxGuards) {
          this.blockStun = 1; // Minimal block stun to indicate blocking
        }
      } else if (this.forwardPressed) {
        this.state = 'walk_forward';
        // Fixed: Use absolute directions
        this.velX = this.isPlayer1 ? this.walkSpeed : -this.walkSpeed;
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
  
  takeDamage(damage, knockback = 0, attackerAttack = null, attackerFrame = 0) {
    if (this.invulnerable) return false;
    
    // Prevent multiple hits from the same attack
    if (attackerAttack && this.lastHitByAttack === attackerAttack && this.lastHitFrame >= 0) {
      return false; // Already hit by this attack
    }
    
    const isBlocking = (this.state === 'walk_back' || this.blockStun > 1) && this.guardCount < this.maxGuards;
    
    if (isBlocking) {
      // Blocked attack
      this.health -= Math.floor(damage * 0.25);
      this.guardCount++;
      this.blockStun = 20;
      this.velX = knockback * this.facing * 0.3;
      this.lastHitByAttack = attackerAttack;
      this.lastHitFrame = attackerFrame;
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
      this.lastHitByAttack = attackerAttack;
      this.lastHitFrame = attackerFrame;
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
    
    // Check each hitbox for current frame - FRAME-BY-FRAME SYSTEM
    for (const hitboxData of attack.hitboxes) {
      if (this.attackFrame === hitboxData.frame) {
        const hitbox = {
          x: this.x + (this.facing > 0 ? hitboxData.x : -hitboxData.x - hitboxData.w),
          y: this.y + hitboxData.y,
          w: hitboxData.w,
          h: hitboxData.h,
          damage: attack.damage,
          frame: hitboxData.frame // Include frame info for debug
        };
        activeHitboxes.push(hitbox);
      }
    }
    
    return activeHitboxes;
  }
  
  getHurtbox() {
    if (!this.currentAttack) {
      return {
        x: this.x - 30,  // Slimmer hurtbox to match slimmer sprites
        y: this.y,
        w: 60,  // Reduced from 100 to 60 for slimmer profile
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
  
  resetOpponentHitTracking() {
    // Reset hit tracking for both players when this player's attack ends
    if (player1 && player1.lastHitByAttack === this.currentAttack) {
      player1.lastHitByAttack = null;
      player1.lastHitFrame = -1;
    }
    if (player2 && player2.lastHitByAttack === this.currentAttack) {
      player2.lastHitByAttack = null;
      player2.lastHitFrame = -1;
    }
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
  
  this.add.text(400, 120, 'Hold Attack 1sec+ for specials | Walk Away = Guard | F1-Hitboxes | R-Restart', {
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
  
  // Player 1 controls (ASD) - A=left, D=right (absolute directions)
  if (event.key === 'a' || event.key === 'A') {
    player1.backPressed = true;  // A = move left (back for P1)
  } else if (event.key === 's' || event.key === 'S') {
    if (!player1.attackButtonPressed) {
      player1.attackButtonPressed = true;
      player1.attackButtonHoldTime = 0;
    }
  } else if (event.key === 'd' || event.key === 'D') {
    player1.forwardPressed = true;  // D = move right (forward for P1)
  }
  
  // Player 2 controls (Arrow keys) - ←=left, →=right (absolute directions)
  if (event.key === 'ArrowLeft') {
    player2.forwardPressed = true;  // ← = move left (forward for P2 since they face left)
  } else if (event.key === 'ArrowDown') {
    if (!player2.attackButtonPressed) {
      player2.attackButtonPressed = true;
      player2.attackButtonHoldTime = 0;
    }
  } else if (event.key === 'ArrowRight') {
    player2.backPressed = true;  // → = move right (back for P2 since they face left)
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
  
  // Player 2 controls (fixed mapping)
  if (event.key === 'ArrowLeft') {
    player2.forwardPressed = false;  // ← = move left
  } else if (event.key === 'ArrowDown') {
    if (player2.attackButtonPressed) {
      player2.attackButtonPressed = false;
      player2.attackButtonJustReleased = true;
    }
  } else if (event.key === 'ArrowRight') {
    player2.backPressed = false;  // → = move right
  }
}

function getSpriteOffset(player) {
  const currentSprite = player.getCurrentSprite();
  const isAttacking = player.currentAttack != null;
  
  if (!isAttacking) {
    // Idle and movement sprites are centered
    return -60;
  } else {
    // Attack sprites are positioned from the front edge
    // For P1 (facing right): position from left edge of player
    // For P2 (facing left): position from right edge of player
    if (player.facing > 0) {
      // Facing right: position sprite from front (right side)
      return -30;  // Show attack extending forward from center-front
    } else {
      // Facing left: position sprite from front (left side)  
      return -90;  // Show attack extending forward from center-front
    }
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
  if (gameState === 'gameover' || gameState === 'roundEnd') return;
  
  // Process attack inputs
  player1.processAttackInput();
  player2.processAttackInput();
  
  // Update fighters
  player1.update(delta);
  player2.update(delta);
  
  // Check player collision and prevent overlap
  checkPlayerCollision();
  
  // Reset input flags
  player1.resetInputs();
  player2.resetInputs();
  
  // Check combat collisions
  checkCombatCollisions();
  
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
  
  // Check for round end (but only if game is still playing)
  if (gameState === 'playing' && (player1.health <= 0 || player2.health <= 0)) {
    endRound();
  }
  
  // Update UI
  updateUI();
  
  // Draw everything
  drawGame();
}

function checkPlayerCollision() {
  // Prevent players from overlapping
  const p1Bounds = { x: player1.x - 50, y: player1.y, w: 100, h: 100 };
  const p2Bounds = { x: player2.x - 50, y: player2.y, w: 100, h: 100 };
  
  if (boxCollision(p1Bounds, p2Bounds)) {
    // Calculate overlap and push players apart
    const centerDistance = Math.abs(player1.x - player2.x);
    const minDistance = 100; // Minimum distance between players
    
    if (centerDistance < minDistance) {
      const pushDistance = (minDistance - centerDistance) / 2;
      
      if (player1.x < player2.x) {
        // Player 1 is on the left
        player1.x -= pushDistance;
        player2.x += pushDistance;
      } else {
        // Player 1 is on the right
        player1.x += pushDistance;
        player2.x -= pushDistance;
      }
      
      // Ensure players stay within screen bounds
      player1.x = Math.max(50, Math.min(player1.x, 750));
      player2.x = Math.max(50, Math.min(player2.x, 750));
      
      // Stop horizontal movement to prevent pushing through
      player1.velX = 0;
      player2.velX = 0;
    }
  }
}

function checkCombatCollisions() {
  const p1Hitboxes = player1.getHitboxes();
  const p2Hitboxes = player2.getHitboxes();
  const p1Hurtbox = player1.getHurtbox();
  const p2Hurtbox = player2.getHurtbox();
  
  // Player 1 hitting Player 2
  for (const hitbox of p1Hitboxes) {
    if (boxCollision(hitbox, p2Hurtbox)) {
      const hit = player2.takeDamage(hitbox.damage, 10, player1.currentAttack, player1.attackFrame);
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
      const hit = player1.takeDamage(hitbox.damage, 10, player2.currentAttack, player2.attackFrame);
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
    // Show round winner first, then reset for next round
    gameState = 'roundEnd';
    const roundWinner = player1.health <= 0 ? 'Player 2' : 'Player 1';
    
    setTimeout(() => {    
      const overlay = graphics.scene.add.graphics();
      overlay.fillStyle(0x000000, 0.6);
      overlay.fillRect(0, 0, 800, 600);
      
      const roundText = graphics.scene.add.text(400, 300, `${roundWinner} Wins Round!`, {
        fontSize: '32px',
        fontFamily: 'Arial, sans-serif', 
        color: roundWinner === 'Player 1' ? '#00ff00' : '#ff0000',
        align: 'center'
      }).setOrigin(0.5);
      
      // Clear round display and start next round after delay
      setTimeout(() => {
        overlay.destroy();
        roundText.destroy();
        
        // Reset for next round
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
        gameState = 'playing'; // Resume game
      }, 2000);
    }, 100);
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
  
  // Position sprites differently for attacks vs idle/movement
  const p1SpriteOffset = getSpriteOffset(player1);
  const p2SpriteOffset = getSpriteOffset(player2);
  
  drawSprite(player1.getCurrentSprite(), player1.x + p1SpriteOffset, player1.y, p1Color, player1.facing > 0);
  drawSprite(player2.getCurrentSprite(), player2.x + p2SpriteOffset, player2.y, p2Color, player2.facing > 0);
  
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
  // Clear any previous debug text
  graphics.scene.children.list.forEach(child => {
    if (child.debugText) {
      child.destroy();
    }
  });
  
  // Draw hitboxes (RED) - Frame-specific attack boxes
  const p1Hitboxes = player1.getHitboxes();
  const p2Hitboxes = player2.getHitboxes();
  
  graphics.lineStyle(3, 0xff0000);
  p1Hitboxes.forEach((hitbox, index) => {
    graphics.strokeRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
    // Label each hitbox
    const text = graphics.scene.add.text(hitbox.x, hitbox.y - 15, `HIT:${hitbox.damage}`, {
      fontSize: '10px',
      fontFamily: 'Arial, sans-serif',
      color: '#ff0000'
    });
    text.debugText = true;
  });
  
  p2Hitboxes.forEach((hitbox, index) => {
    graphics.strokeRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
    const text = graphics.scene.add.text(hitbox.x, hitbox.y - 15, `HIT:${hitbox.damage}`, {
      fontSize: '10px',
      fontFamily: 'Arial, sans-serif',
      color: '#ff0000'
    });
    text.debugText = true;
  });
  
  // Draw hurtboxes (CYAN/YELLOW) - Vulnerable areas
  const p1Hurtbox = player1.getHurtbox();
  const p2Hurtbox = player2.getHurtbox();
  
  const hurtboxColor1 = player1.invulnerable ? 0xffff00 : 0x00ffff;
  const hurtboxColor2 = player2.invulnerable ? 0xffff00 : 0x00ffff;
  
  graphics.lineStyle(2, hurtboxColor1);
  graphics.strokeRect(p1Hurtbox.x, p1Hurtbox.y, p1Hurtbox.w, p1Hurtbox.h);
  
  graphics.lineStyle(2, hurtboxColor2);
  graphics.strokeRect(p2Hurtbox.x, p2Hurtbox.y, p2Hurtbox.w, p2Hurtbox.h);
  
  // Draw player collision boxes (GREEN) - Anti-overlap
  graphics.lineStyle(1, 0x00ff00);
  graphics.strokeRect(player1.x - 50, player1.y, 100, 100);
  graphics.strokeRect(player2.x - 50, player2.y, 100, 100);
  
  // Draw center points
  graphics.fillStyle(0xffff00, 1);
  graphics.fillCircle(player1.x, player1.y + 50, 4);
  graphics.fillCircle(player2.x, player2.y + 50, 4);
  
  // Debug info header
  const header = graphics.scene.add.text(10, 140, 'DEBUG MODE - Frame-by-Frame System', {
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    color: '#ffff00',
    backgroundColor: '#000000'
  });
  header.debugText = true;
  
  // Color legend
  const legend = graphics.scene.add.text(10, 160, 'RED=Hitboxes CYAN=Hurtboxes YELLOW=Invulnerable GREEN=Collision', {
    fontSize: '10px',
    fontFamily: 'Arial, sans-serif',
    color: '#ffffff',
    backgroundColor: '#000000'
  });
  legend.debugText = true;
  
  // Frame data for each player
  const p1Data = `P1: ${player1.currentAttack || player1.state} | Frame:${player1.attackFrame} | Hold:${player1.attackButtonHoldTime} | Guards:${player1.guardCount}/3`;
  const p2Data = `P2: ${player2.currentAttack || player2.state} | Frame:${player2.attackFrame} | Hold:${player2.attackButtonHoldTime} | Guards:${player2.guardCount}/3`;
  
  const p1Text = graphics.scene.add.text(10, 180, p1Data, {
    fontSize: '11px',
    fontFamily: 'Arial, sans-serif',
    color: '#00ff00',
    backgroundColor: '#000000'
  });
  p1Text.debugText = true;
  
  const p2Text = graphics.scene.add.text(10, 200, p2Data, {
    fontSize: '11px',
    fontFamily: 'Arial, sans-serif',
    color: '#0088ff',
    backgroundColor: '#000000'
  });
  p2Text.debugText = true;
  
  // Active hitbox info
  if (p1Hitboxes.length > 0) {
    const hitboxInfo = `P1 Active Hitboxes: ${p1Hitboxes.length} (Damage: ${p1Hitboxes[0].damage})`;
    const hitboxText = graphics.scene.add.text(10, 220, hitboxInfo, {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: '#ff0000',
      backgroundColor: '#000000'
    });
    hitboxText.debugText = true;
  }
  
  if (p2Hitboxes.length > 0) {
    const hitboxInfo = `P2 Active Hitboxes: ${p2Hitboxes.length} (Damage: ${p2Hitboxes[0].damage})`;
    const hitboxText = graphics.scene.add.text(10, 240, hitboxInfo, {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: '#ff0000',
      backgroundColor: '#000000'
    });
    hitboxText.debugText = true;
  }
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
