# Sistema de Píxeles y Patrones de Letras - Platanus Hack 25

## Resumen del Sistema Actual

El juego utiliza un sistema de grillas para dibujar texto y elementos en pantalla usando patrones de píxeles.

## Sistema de Patrones de Letras

### Letras Normales (4x5 píxeles)
```javascript
const letters = {
  P: [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,0],[1,0,0,0]]
  // Cada letra tiene 5 filas con 4 columnas cada una
};
```

**Estructura:**
- **Filas:** 5 (altura de la letra)
- **Columnas:** 4 (ancho de la letra)
- **Total:** 4×5 = 20 píxeles por letra
- **Valor:** 1 = píxel encendido, 0 = píxel apagado

### Letras Bold/ARCADE (5x5 píxeles)
```javascript
const boldLetters = {
  A: [[1,1,1,1,1],[1,1,0,1,1],[1,1,1,1,1],[1,1,0,1,1],[1,1,0,1,1]]
  // Cada letra tiene 5 filas con 5 columnas cada una
};
```

**Estructura:**
- **Filas:** 5 (altura de la letra)
- **Columnas:** 5 (ancho de la letra)
- **Total:** 5×5 = 25 píxeles por letra
- **Uso:** Solo para la palabra "ARCADE"

## ¿Por qué ves "5 elementos con 4 items cada uno"?

Lo que estás viendo es correcto:
- **5 elementos** = 5 filas (altura)
- **4 items cada uno** = 4 columnas por fila (ancho) para letras normales
- **5 items cada uno** = 5 columnas por fila para letras ARCADE

## Sistema de Coordenadas

- **snakeSize = 15:** Cada "píxel" del patrón se dibuja como un cuadrado de 15×15 píxeles reales
- **Espaciado:** +1 columna entre letras (15px extra)
- **Alineación:** Todo se alinea a la grilla de 15px

## Creando Animaciones de Personajes

### Ejemplo: Personaje Básico (5x5)

```javascript
// Estados de animación para un personaje
const characterStates = {
  idle: [
    [0,1,1,1,0],  // Cabeza
    [1,1,0,1,1],  // Ojos
    [0,1,1,1,0],  // Cara
    [1,0,1,0,1],  // Cuerpo/brazos
    [1,0,0,0,1]   // Piernas
  ],
  
  walking1: [
    [0,1,1,1,0],
    [1,1,0,1,1],
    [0,1,1,1,0],
    [0,1,1,1,0],  // Brazos hacia adelante
    [1,0,1,0,0]   // Una pierna adelante
  ],
  
  walking2: [
    [0,1,1,1,0],
    [1,1,0,1,1],
    [0,1,1,1,0],
    [0,1,1,1,0],
    [0,0,1,0,1]   // Otra pierna adelante
  ],
  
  jumping: [
    [0,1,1,1,0],
    [1,1,0,1,1],
    [0,1,1,1,0],
    [1,1,1,1,1],  // Brazos extendidos
    [0,1,0,1,0]   // Piernas recogidas
  ]
};
```

### Sistema de Animación

```javascript
class AnimatedCharacter {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentState = 'idle';
    this.frameTime = 0;
    this.animSpeed = 300; // ms entre frames
    this.currentFrame = 0;
  }
  
  update(delta) {
    this.frameTime += delta;
    
    if (this.frameTime >= this.animSpeed) {
      this.frameTime = 0;
      this.nextFrame();
    }
  }
  
  nextFrame() {
    // Ciclar entre frames de walking
    if (this.currentState === 'walking1') {
      this.currentState = 'walking2';
    } else if (this.currentState === 'walking2') {
      this.currentState = 'walking1';
    }
  }
  
  setState(newState) {
    this.currentState = newState;
    this.frameTime = 0;
  }
  
  draw(graphics, pixelSize) {
    const pattern = characterStates[this.currentState];
    
    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col]) {
          const pixelX = this.x + col * pixelSize;
          const pixelY = this.y + row * pixelSize;
          
          graphics.fillStyle(0x00ff00, 1);
          graphics.fillRect(pixelX, pixelY, pixelSize - 2, pixelSize - 2);
        }
      }
    }
  }
}
```

## Implementación en el Juego

### 1. Crear el personaje
```javascript
let player;

function create() {
  // ... código existente ...
  
  player = new AnimatedCharacter(100, 100);
}
```

### 2. Actualizar en el loop
```javascript
function update(time, delta) {
  // ... código existente ...
  
  player.update(delta);
  
  // Cambiar estado según input
  if (/* moviendo */) {
    player.setState('walking1');
  } else if (/* saltando */) {
    player.setState('jumping');
  } else {
    player.setState('idle');
  }
}
```

### 3. Dibujar el personaje
```javascript
function drawGame() {
  graphics.clear();
  
  // ... código existente ...
  
  player.draw(graphics, snakeSize);
}
```

## Consejos para Personajes Pixelados

1. **Mantén simple:** 5×5 o 4×5 es suficiente para expresividad
2. **Colores consistentes:** Usa la misma paleta que el juego
3. **Animaciones sutiles:** 2-3 frames máximo para caminar
4. **Estados claros:** idle, walking, jumping, attacking, etc.
5. **Optimiza tamaño:** Reutiliza patrones cuando sea posible

## Ejemplo de Enemigo Animado

```javascript
const enemyStates = {
  patrol: [
    [1,1,1,1,1],
    [1,0,1,0,1],  // Ojos malvados
    [1,1,0,1,1],
    [0,1,1,1,0],
    [1,0,1,0,1]
  ],
  
  alert: [
    [1,1,1,1,1],
    [1,1,1,1,1],  // Ojos brillantes
    [1,0,0,0,1],  // Boca abierta
    [0,1,1,1,0],
    [1,0,1,0,1]
  ]
};
```

Este sistema te permite crear personajes expresivos y animados manteniendo el estilo retro pixelado del juego, todo dentro de las restricciones de tamaño del hackathon.