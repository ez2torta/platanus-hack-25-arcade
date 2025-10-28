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
let pixelSize = 12;
let graphics;
let player1, player2;
let gameState = 'playing';
let debugMode = false;
let uiText = {};

// Fighter sprite patterns (6x8 for better detail)
const fighterSprites = {
  // Player 1 states
  p1_idle: [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [0,1,0,1,0,0],
    [0,1,1,1,1,0],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [1,1,0,0,1,1]
  ],
  p1_punch: [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [0,1,0,1,0,0],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [1,1,0,0,1,1]
  ],
  p1_kick: [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [0,1,0,1,0,0],
    [0,1,1,1,1,1],
    [0,1,1,1,1,1],
    [0,1,1,1,0,0],
    [0,1,0,1,0,0],
    [1,1,0,1,1,0]
  ],
  p1_special: [
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [0,1,0,1,0,0],
    [0,1,1,1,1,0],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [1,1,0,0,1,1]
  ],
  p1_block: [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [1,1,0,1,0,0],
    [1,1,1,1,1,0],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [1,1,0,0,1,1]
  ],
  p1_hit: [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [0,1,1,1,1,0],
    [0,1,1,1,1,0],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [1,1,0,0,1,1]
  ],

  // Player 2 states (different color/style)
  p2_idle: [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [0,0,1,0,1,0],
    [0,1,1,1,1,0],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [1,1,0,0,1,1]
  ],
  p2_punch: [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [0,0,1,0,1,0],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [1,1,0,0,1,1]
  ],
  p2_kick: [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [0,0,1,0,1,0],
    [1,1,1,1,1,1],
    [0,1,1,1,1,1],
    [0,1,1,1,0,0],
    [0,1,0,1,0,0],
    [1,1,0,1,1,0]
  ],
  p2_special: [
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [0,0,1,0,1,0],
    [0,1,1,1,1,0],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [1,1,0,0,1,1]
  ],
  p2_block: [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [0,0,1,0,1,1],
    [0,1,1,1,1,1],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [1,1,0,0,1,1]
  ],
  p2_hit: [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [0,0,1,1,1,0],
    [0,1,1,1,1,0],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,0,0,1,0],
    [1,1,0,0,1,1]
  ]
};

// Attack definitions with frame data
const attacks = {
  punch: {
    frames: 20,
    startup: 3,
    active: 5,
    recovery: 12,
    damage: 15,
    hitbox: { x: 0, y: 20, w: 30, h: 25 }
  },
  kick: {
    frames: 30,
    startup: 8,
    active: 8,
    recovery: 14,
    damage: 25,
    hitbox: { x: 0, y: 40, w: 35, h: 30 }
  },
  special: {
    frames: 60,
    startup: 15,
    active: 10,
    recovery: 35,
    damage: 40,
    hitbox: { x: -10, y: 10, w: 50, h: 60 }
  }
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
    
    // Movement
    this.velX = 0;
    this.velY = 0;
    this.grounded = true;
    
    // Input buffer
    this.inputBuffer = [];
    this.bufferTime = 10; // frames to keep inputs
  }
  
  update(delta) {
    // Update timers
    if (this.hitStun > 0) this.hitStun--;
    if (this.blockStun > 0) this.blockStun--;
    if (this.attackTimer > 0) this.attackTimer--;
    
    // Update attack
    if (this.currentAttack) {
      this.attackFrame++;
      if (this.attackFrame >= attacks[this.currentAttack].frames) {
        this.currentAttack = null;
        this.attackFrame = 0;
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
    
    if (this.y >= 450) { // ground level
      this.y = 450;
      this.velY = 0;
      this.grounded = true;
    }
    
    // Screen boundaries
    this.x = Math.max(50, Math.min(this.x, 750));
    
    // Friction
    this.velX *= 0.85;
    
    // Clean input buffer
    this.inputBuffer = this.inputBuffer.filter(input => input.time > 0);
    this.inputBuffer.forEach(input => input.time--);
  }
  
  canAct() {
    return this.hitStun <= 0 && this.blockStun <= 0 && !this.currentAttack;
  }
  
  performAttack(attackType) {
    if (!this.canAct()) return false;
    
    this.currentAttack = attackType;
    this.attackFrame = 0;
    this.state = attackType;
    
    // Add movement for attacks
    if (attackType === 'kick') {
      this.velX = this.facing * 3;
    } else if (attackType === 'special') {
      this.velY = -8;
      this.grounded = false;
      this.invulnerable = true;
      setTimeout(() => this.invulnerable = false, 200);
    }
    
    playTone(this.scene, attackType === 'special' ? 800 : 600, 0.1);
    return true;
  }
  
  takeDamage(damage, knockback = 0) {
    if (this.invulnerable) return false;
    
    if (this.state === 'block' && this.guardCount < this.maxGuards) {
      // Blocked attack
      this.health -= Math.floor(damage * 0.3);
      this.guardCount++;
      this.blockStun = 15;
      this.velX = knockback * this.facing * 0.5;
      return false;
    } else {
      // Hit
      this.health -= damage;
      this.hitStun = 20;
      this.state = 'hit';
      this.velX = knockback * this.facing;
      this.currentAttack = null;
      this.attackFrame = 0;
      return true;
    }
  }
  
  getHitbox() {
    if (!this.currentAttack) return null;
    
    const attack = attacks[this.currentAttack];
    const isActive = this.attackFrame >= attack.startup && 
                    this.attackFrame < attack.startup + attack.active;
    
    if (!isActive) return null;
    
    const hitbox = attack.hitbox;
    return {
      x: this.x + (this.facing > 0 ? hitbox.x : -hitbox.x - hitbox.w),
      y: this.y + hitbox.y,
      w: hitbox.w,
      h: hitbox.h
    };
  }
  
  getHurtbox() {
    return {
      x: this.x - 36,
      y: this.y,
      w: 72,
      h: 96
    };
  }
  
  getCurrentSprite() {
    const prefix = this.isPlayer1 ? 'p1_' : 'p2_';
    
    if (this.hitStun > 0) return prefix + 'hit';
    if (this.state === 'block') return prefix + 'block';
    if (this.currentAttack) return prefix + this.currentAttack;
    return prefix + 'idle';
  }
}

function create() {
  const scene = this;
  graphics = this.add.graphics();
  
  // Initialize fighters
  player1 = new Fighter(200, 450, true);
  player2 = new Fighter(600, 450, false);
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
  
  // Instructions
  this.add.text(400, 100, 'P1: A-Punch S-Kick D-Special W-Block | P2: Arrow Keys + Shift-Block', {
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    color: '#888888',
    align: 'center'
  }).setOrigin(0.5);
  
  this.add.text(400, 120, 'F1-Debug Mode | R-Restart', {
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    color: '#666666',
    align: 'center'
  }).setOrigin(0.5);
  
  // Keyboard input
  this.input.keyboard.on('keydown', handleInput);
  
  // Ground line
  graphics.lineStyle(2, 0x444444);
  graphics.moveTo(0, 546);
  graphics.lineTo(800, 546);
  graphics.stroke();
  
  playTone(this, 440, 0.2);
}

function handleInput(event) {
  if (gameState === 'gameover' && event.key === 'r') {
    restartGame();
    return;
  }
  
  if (event.key === 'F1') {
    debugMode = !debugMode;
    return;
  }
  
  // Player 1 controls (WASD)
  if (event.key === 'a' || event.key === 'A') {
    player1.performAttack('punch');
  } else if (event.key === 's' || event.key === 'S') {
    player1.performAttack('kick');
  } else if (event.key === 'd' || event.key === 'D') {
    player1.performAttack('special');
  } else if (event.key === 'w' || event.key === 'W') {
    if (player1.canAct()) {
      player1.state = 'block';
    }
  }
  
  // Player 2 controls (Arrow keys)
  if (event.key === 'ArrowLeft') {
    player2.performAttack('punch');
  } else if (event.key === 'ArrowDown') {
    player2.performAttack('kick');
  } else if (event.key === 'ArrowRight') {
    player2.performAttack('special');
  } else if (event.key === 'ArrowUp' || event.key === 'Shift') {
    if (player2.canAct()) {
      player2.state = 'block';
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
  if (gameState === 'gameover') return;
  
  // Update fighters
  player1.update(delta);
  player2.update(delta);
  
  // Reset block states if not holding button
  if (player1.state === 'block' && player1.canAct()) {
    player1.state = 'idle';
  }
  if (player2.state === 'block' && player2.canAct()) {
    player2.state = 'idle';
  }
  
  // Check collisions
  checkCollisions();
  
  // Update facing directions
  if (player1.x < player2.x) {
    player1.facing = 1;
    player2.facing = -1;
  } else {
    player1.facing = -1;
    player2.facing = 1;
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
  const p1Hitbox = player1.getHitbox();
  const p2Hitbox = player2.getHitbox();
  const p1Hurtbox = player1.getHurtbox();
  const p2Hurtbox = player2.getHurtbox();
  
  // Player 1 hitting Player 2
  if (p1Hitbox && boxCollision(p1Hitbox, p2Hurtbox)) {
    const attack = attacks[player1.currentAttack];
    const hit = player2.takeDamage(attack.damage, 8);
    if (hit) {
      playTone(player1.scene, 300, 0.15);
      // Screen shake effect could go here
    } else {
      playTone(player1.scene, 200, 0.1);
    }
  }
  
  // Player 2 hitting Player 1
  if (p2Hitbox && boxCollision(p2Hitbox, p1Hurtbox)) {
    const attack = attacks[player2.currentAttack];
    const hit = player1.takeDamage(attack.damage, 8);
    if (hit) {
      playTone(player2.scene, 300, 0.15);
    } else {
      playTone(player2.scene, 200, 0.1);
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
    // Next round
    setTimeout(() => {
      player1.health = player1.maxHealth;
      player2.health = player2.maxHealth;
      player1.x = 200;
      player2.x = 600;
      player1.y = 450;
      player2.y = 450;
      player1.state = 'idle';
      player2.state = 'idle';
      player1.currentAttack = null;
      player2.currentAttack = null;
      player1.guardCount = 0;
      player2.guardCount = 0;
    }, 2000);
  }
}

function updateUI() {
  uiText.health1.setText(`P1: ${Math.max(0, player1.health)}`);
  uiText.health2.setText(`P2: ${Math.max(0, player2.health)}`);
  
  const totalRounds = player1.roundsWon + player2.roundsWon + 1;
  uiText.rounds.setText(`Round ${totalRounds}`);
  
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
  player1.y = 450;
  player2.y = 450;
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
  
  // Clear any overlays
  graphics.scene.scene.restart();
}

function drawGame() {
  graphics.clear();
  
  // Draw ground
  graphics.lineStyle(2, 0x444444);
  graphics.moveTo(0, 546);
  graphics.lineTo(800, 546);
  graphics.stroke();
  
  // Draw fighters
  const p1Color = player1.hitStun > 0 ? 0xff6666 : 0x00ff00;
  const p2Color = player2.hitStun > 0 ? 0xff6666 : 0x0088ff;
  
  drawSprite(player1.getCurrentSprite(), player1.x - 36, player1.y, p1Color, player1.facing > 0);
  drawSprite(player2.getCurrentSprite(), player2.x - 36, player2.y, p2Color, player2.facing > 0);
  
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
  const p1Hitbox = player1.getHitbox();
  const p2Hitbox = player2.getHitbox();
  
  if (p1Hitbox) {
    graphics.lineStyle(2, 0xff0000);
    graphics.strokeRect(p1Hitbox.x, p1Hitbox.y, p1Hitbox.w, p1Hitbox.h);
  }
  
  if (p2Hitbox) {
    graphics.lineStyle(2, 0xff0000);
    graphics.strokeRect(p2Hitbox.x, p2Hitbox.y, p2Hitbox.w, p2Hitbox.h);
  }
  
  // Draw hurtboxes
  const p1Hurtbox = player1.getHurtbox();
  const p2Hurtbox = player2.getHurtbox();
  
  graphics.lineStyle(1, 0x00ffff);
  graphics.strokeRect(p1Hurtbox.x, p1Hurtbox.y, p1Hurtbox.w, p1Hurtbox.h);
  graphics.strokeRect(p2Hurtbox.x, p2Hurtbox.y, p2Hurtbox.w, p2Hurtbox.h);
  
  // Draw center points
  graphics.fillStyle(0xffff00, 1);
  graphics.fillCircle(player1.x, player1.y + 48, 3);
  graphics.fillCircle(player2.x, player2.y + 48, 3);
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
