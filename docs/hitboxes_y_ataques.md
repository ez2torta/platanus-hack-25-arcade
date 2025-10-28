# Diseño Mejorado con Sprites, Hitboxes Precisas y Movimientos Especiales

## Estructuras de Datos Mejoradas

### 1. Sistema de Animación con Sprites
```python
AttackAnimation:
- nombre: string
- total_frames: int
- loop: bool
- frames: list[AnimationFrame]

AnimationFrame:
- frame_number: int
- sprite_path: string  # Ruta al sprite
- sprite_surface: pygame.Surface  # Sprite cargado
- duration: int  # frames que dura este sprite
- hitboxes_ataque: list[Rect]  # Múltiples hitboxes de ataque
- hitboxes_vulnerable: list[Rect]  # Múltiples hitboxes vulnerables
- invencible: bool
- daño: int
- stun: int
- empuje: int  # Fuerza de empuje
- movimiento_x: int  # Desplazamiento horizontal en este frame
- movimiento_y: int  # Desplazamiento vertical
```

### 2. Jugador Extendido
```python
Player:
- x: float
- y: float
- salud: int
- dirección: bool
- estado_actual: string
- contador_guardias: int
- tiempo_ataque_presionado: float
- está_presionando_ataque: bool
- rounds_ganados: int
- ataque_actual: string | None
- frame_actual_ataque: int
- tiempo_inicio_ataque: float
- stun_hasta: float
- velocidad_x: float
- velocidad_y: float
- esta_bloqueando: bool
- sprite_actual: pygame.Surface
- hitboxes_ataque_actual: list[Rect]
- hitboxes_vulnerable_actual: list[Rect]
```

### 3. Sistema de Debug
```python
DebugSystem:
- mostrar_hitboxes: bool
- mostrar_frame_info: bool
- hitbox_color_ataque: Color
- hitbox_color_vulnerable: Color
- hitbox_color_invencible: Color
```

## Definiciones Detalladas de Ataques

### Shoryu (58 frames - Preciso)
```python
SHORYU_ANIMATION = {
    "nombre": "shoryu",
    "total_frames": 58,
    "loop": False,
    "frames": [
        # Frames 0-1: Startup invencible
        {
            "frame": 0, "sprite": "shoryu_0.png", "duration": 2,
            "hitboxes_ataque": [], "hitboxes_vulnerable": [],
            "invencible": True, "daño": 0, "stun": 0, "empuje": 0,
            "movimiento_x": 0, "movimiento_y": 0
        },
        
        # Frames 2-6: Hitboxes de ataque activas, aún invencible
        {
            "frame": 2, "sprite": "shoryu_1.png", "duration": 1,
            "hitboxes_ataque": [Rect(15, -60, 50, 80)], 
            "hitboxes_vulnerable": [],
            "invencible": True, "daño": 15, "stun": 8, "empuje": 5,
            "movimiento_x": 2, "movimiento_y": -3
        },
        {
            "frame": 3, "sprite": "shoryu_2.png", "duration": 1,
            "hitboxes_ataque": [Rect(20, -80, 55, 100)], 
            "hitboxes_vulnerable": [],
            "invencible": True, "daño": 25, "stun": 12, "empuje": 8,
            "movimiento_x": 3, "movimiento_y": -5
        },
        {
            "frame": 4, "sprite": "shoryu_3.png", "duration": 1,
            "hitboxes_ataque": [Rect(25, -100, 60, 120)], 
            "hitboxes_vulnerable": [],
            "invencible": True, "daño": 30, "stun": 15, "empuje": 10,
            "movimiento_x": 2, "movimiento_y": -4
        },
        
        # Frames 7-57: Recovery vulnerable
        {
            "frame": 7, "sprite": "shoryu_4.png", "duration": 51,
            "hitboxes_ataque": [], 
            "hitboxes_vulnerable": [Rect(0, 0, 40, 80)],
            "invencible": False, "daño": 0, "stun": 0, "empuje": 0,
            "movimiento_x": 0, "movimiento_y": 1  // Caída gradual
        }
    ]
}
```

### Donkey Kick (45 frames - Con avance progresivo)
```python
DONKEY_KICK_ANIMATION = {
    "nombre": "donkey_kick",
    "total_frames": 45,
    "loop": False,
    "frames": [
        # Frames 0-14: Preparación con avance lento
        {
            "frame": 0, "sprite": "donkey_0.png", "duration": 15,
            "hitboxes_ataque": [],
            "hitboxes_vulnerable": [Rect(0, 0, 40, 80)],
            "invencible": False, "daño": 0, "stun": 0, "empuje": 0,
            "movimiento_x": 1, "movimiento_y": 0
        },
        
        # Frames 15-25: Patada con avance rápido y hitbox
        {
            "frame": 15, "sprite": "donkey_1.png", "duration": 5,
            "hitboxes_ataque": [Rect(30, 40, 60, 30)],
            "hitboxes_vulnerable": [Rect(0, 0, 40, 80)],
            "invencible": False, "daño": 15, "stun": 10, "empuje": 15,
            "movimiento_x": 4, "movimiento_y": 0
        },
        {
            "frame": 20, "sprite": "donkey_2.png", "duration": 6,
            "hitboxes_ataque": [Rect(35, 35, 65, 35)],
            "hitboxes_vulnerable": [Rect(0, 0, 40, 80)],
            "invencible": False, "daño": 20, "stun": 12, "empuje": 20,
            "movimiento_x": 3, "movimiento_y": 0
        },
        
        # Frames 26-44: Recovery
        {
            "frame": 26, "sprite": "donkey_3.png", "duration": 19,
            "hitboxes_ataque": [],
            "hitboxes_vulnerable": [Rect(0, 0, 40, 80)],
            "invencible": False, "daño": 0, "stun": 0, "empuje": 0,
            "movimiento_x": 0, "movimiento_y": 0
        }
    ]
}
```

## Sistema de Animación y Sprites Mejorado

### 1. Carga y Gestión de Sprites
```python
class SpriteManager:
    def __init__(self):
        self.sprites_cache = {}
        self.animations = {}
        
    def cargar_animaciones(self):
        # Cargar todas las animaciones
        self.animations["shoryu"] = SHORYU_ANIMATION
        self.animations["donkey_kick"] = DONKEY_KICK_ANIMATION
        self.animations["ataque_bajo"] = ATAQUE_BAJO_ANIMATION
        self.animations["ataque_medio"] = ATAQUE_MEDIO_ANIMATION
        
        # Precargar sprites
        for anim_name, anim_data in self.animations.items():
            for frame in anim_data["frames"]:
                sprite_path = frame["sprite_path"]
                if sprite_path not in self.sprites_cache:
                    self.sprites_cache[sprite_path] = self.cargar_sprite(sprite_path)
                frame["sprite_surface"] = self.sprites_cache[sprite_path]
    
    def cargar_sprite(self, ruta):
        try:
            sprite = pygame.image.load(ruta).convert_alpha()
            return sprite
        except:
            # Fallback: crear sprite temporal
            surf = pygame.Surface((40, 80), pygame.SRCALPHA)
            color = (255, 0, 0) if "shoryu" in ruta else (0, 0, 255)
            pygame.draw.rect(surf, color, (0, 0, 40, 80))
            return surf
```

### 2. Sistema de Actualización de Animación
```python
def actualizar_animacion_jugador(jugador, sprite_manager, tiempo_actual):
    if jugador.ataque_actual is None:
        # Estado neutral - usar animación por defecto
        jugador.sprite_actual = sprite_manager.get_sprite_neutral(jugador.direccion)
        jugador.hitboxes_ataque_actual = []
        jugador.hitboxes_vulnerable_actual = [Rect(jugador.x, jugador.y, 40, 80)]
        return
    
    animacion = sprite_manager.animations[jugador.ataque_actual]
    tiempo_transcurrido = tiempo_actual - jugador.tiempo_inicio_ataque
    frame_actual = int(tiempo_transcurrido * 60)  # 60 FPS
    
    if frame_actual >= animacion["total_frames"]:
        # Fin de la animación
        jugador.ataque_actual = None
        jugador.frame_actual_ataque = 0
        return
    
    # Encontrar frame actual basado en duración acumulada
    frame_acumulado = 0
    frame_data = None
    
    for frame in animacion["frames"]:
        if frame_acumulado <= frame_actual < frame_acumulado + frame["duration"]:
            frame_data = frame
            break
        frame_acumulado += frame["duration"]
    
    if frame_data:
        jugador.frame_actual_ataque = frame_actual
        jugador.sprite_actual = frame_data["sprite_surface"]
        
        # Aplicar movimiento del frame
        if frame_data["movimiento_x"] != 0 or frame_data["movimiento_y"] != 0:
            dx = frame_data["movimiento_x"] if jugador.direccion else -frame_data["movimiento_x"]
            dy = frame_data["movimiento_y"]
            nueva_x = jugador.x + dx
            nueva_y = jugador.y + dy
            
            # Verificar límites de pantalla y colisión
            if not colisiona_con_oponente(nueva_x, jugador, oponente):
                jugador.x = max(0, min(nueva_x, WIDTH - 40))
            jugador.y = max(0, min(nueva_y, HEIGHT - 80))
        
        # Actualizar hitboxes
        jugador.hitboxes_ataque_actual = convertir_hitboxes_relativas(
            frame_data["hitboxes_ataque"], jugador)
        jugador.hitboxes_vulnerable_actual = convertir_hitboxes_relativas(
            frame_data["hitboxes_vulnerable"], jugador)
```

### 3. Sistema de Colisión Mejorado
```python
def verificar_colisiones_frame_perfect(jugador1, jugador2):
    colision_detectada = False
    
    # Verificar si jugador1 golpea a jugador2
    for hitbox_ataque in jugador1.hitboxes_ataque_actual:
        for hitbox_vulnerable in jugador2.hitboxes_vulnerable_actual:
            if hitbox_ataque.colliderect(hitbox_vulnerable):
                # Obtener datos del frame actual
                frame_data = obtener_frame_data_actual(jugador1)
                aplicar_golpe(jugador2, frame_data["daño"], frame_data["stun"], frame_data["empuje"])
                colision_detectada = True
                break
    
    # Verificar si jugador2 golpea a jugador1
    for hitbox_ataque in jugador2.hitboxes_ataque_actual:
        for hitbox_vulnerable in jugador1.hitboxes_vulnerable_actual:
            if hitbox_ataque.colliderect(hitbox_vulnerable):
                frame_data = obtener_frame_data_actual(jugador2)
                aplicar_golpe(jugador1, frame_data["daño"], frame_data["stun"], frame_data["empuje"])
                colision_detectada = True
                break
    
    return colision_detectada

def aplicar_golpe(jugador, daño, stun, empuje):
    if jugador.esta_bloqueando and puede_usar_guardia(jugador):
        # Golpe bloqueado - daño reducido pero con empuje
        jugador.salud -= daño * 0.2
        jugador.contador_guardias += 1
        
        # Aplicar empuje incluso en bloqueo (especial para donkey kick)
        if empuje > 0:
            empuje_direccion = 1 if jugador.direccion else -1
            jugador.x += empuje * empuje_direccion
            # Asegurar que no salga de pantalla
            jugador.x = max(0, min(jugador.x, WIDTH - 40))
    else:
        # Golpe conectado
        jugador.salud -= daño
        jugador.stun_hasta = tiempo_actual() + (stun / 60.0)
        jugador.estado_actual = "stun"
        
        # Aplicar empuje
        if empuje > 0:
            empuje_direccion = 1 if jugador.direccion else -1
            jugador.x += empuje * empuje_direccion * 1.5  # Más empuje en golpe normal
            jugador.x = max(0, min(jugador.x, WIDTH - 40))
```

### 4. Sistema de Debug Visual
```python
def renderizar_con_debug(estado_juego, debug_system):
    # Limpiar pantalla
    screen.fill(WHITE)
    
    # Dibujar jugadores
    dibujar_jugador_con_sprite(estado_juego.player1)
    dibujar_jugador_con_sprite(estado_juego.player2)
    
    # Dibujar hitboxes si está activado el debug
    if debug_system.mostrar_hitboxes:
        dibujar_hitboxes_debug(estado_juego.player1, debug_system)
        dibujar_hitboxes_debug(estado_juego.player2, debug_system)
    
    # Dibujar información de frames
    if debug_system.mostrar_frame_info:
        dibujar_info_frames(estado_juego)
    
    # Dibujar UI normal
    dibujar_ui(estado_juego)
    
    pygame.display.flip()

def dibujar_hitboxes_debug(jugador, debug_system):
    # Dibujar hitboxes de ataque (rojas)
    for hitbox in jugador.hitboxes_ataque_actual:
        pygame.draw.rect(screen, debug_system.hitbox_color_ataque, hitbox, 2)
    
    # Dibujar hitboxes vulnerables
    color_vulnerable = (debug_system.hitbox_color_invencible 
                       if es_invencible(jugador) 
                       else debug_system.hitbox_color_vulnerable)
    
    for hitbox in jugador.hitboxes_vulnerable_actual:
        pygame.draw.rect(screen, color_vulnerable, hitbox, 2)
    
    # Dibujar punto de referencia
    pygame.draw.circle(screen, (0, 255, 0), (int(jugador.x), int(jugador.y)), 3)

def dibujar_info_frames(estado_juego):
    font = pygame.font.Font(None, 24)
    
    info_p1 = [
        f"P1 Estado: {estado_juego.player1.estado_actual}",
        f"P1 Ataque: {estado_juego.player1.ataque_actual}",
        f"P1 Frame: {estado_juego.player1.frame_actual_ataque}",
        f"P1 Guardias: {estado_juego.player1.contador_guardias}/3"
    ]
    
    info_p2 = [
        f"P2 Estado: {estado_juego.player2.estado_actual}",
        f"P2 Ataque: {estado_juego.player2.ataque_actual}",
        f"P2 Frame: {estado_juego.player2.frame_actual_ataque}",
        f"P2 Guardias: {estado_juego.player2.contador_guardias}/3"
    ]
    
    for i, line in enumerate(info_p1):
        text = font.render(line, True, BLACK)
        screen.blit(text, (10, 10 + i * 25))
    
    for i, line in enumerate(info_p2):
        text = font.render(line, True, BLACK)
        screen.blit(text, (WIDTH - 200, 10 + i * 25))
```

### 5. Utilidades para Hitboxes
```python
def convertir_hitboxes_relativas(hitboxes_relativas, jugador):
    hitboxes_absolutas = []
    
    for hitbox in hitboxes_relativas:
        x_rel, y_rel, ancho, alto = hitbox
        
        if jugador.direccion:  # Mirando derecha
            x_abs = jugador.x + x_rel
        else:  # Mirando izquierda
            x_abs = jugador.x + (40 - x_rel - ancho)  # 40 = ancho del sprite
        
        y_abs = jugador.y + y_rel
        hitboxes_absolutas.append(pygame.Rect(x_abs, y_abs, ancho, alto))
    
    return hitboxes_absolutas

def es_invencible(jugador):
    if jugador.ataque_actual is None:
        return False
    
    animacion = sprite_manager.animations[jugador.ataque_actual]
    frame_data = obtener_frame_data_actual(jugador)
    return frame_data["invencible"] if frame_data else False
```

## Características Implementadas

1. **Precisión Frame-Perfect**: Cada frame tiene hitboxes específicas
2. **Sistema de Sprites**: Cada frame muestra un sprite diferente
3. **Debug Visual**: Hitboxes coloreadas y información de frames
4. **Movimientos Complejos**: 
   - Shoryu con invencibilidad y movimiento vertical
   - Donkey kick con avance progresivo y empuje en bloqueo
5. **Múltiples Hitboxes**: Un frame puede tener varias hitboxes de ataque
6. **Empuje Dinámico**: Los ataques empujan incluso cuando son bloqueados

Este sistema proporciona la precisión que necesitas para un juego de pelea competitivo, con herramientas de debug para balancear y ajustar los movimientos.