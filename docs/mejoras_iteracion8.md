es posible soportar más de un hurtbox por cada frame? en este sentido me gustó lo que implementaste para el low attack pero necesito que la caja de la pierna (lo que ataca) también tenga hurtbox.

en este sentido para cada frame necesito que hayan 2 hurtboxes. el del cuerpo principal (rectángulo grande) y el de la pierna estirada (rectángulo largo por debajo).

Para el ataque medio necesito algo parecido. el hurtbox principal (rectángulo grande) y el hurtbox del centro que es la pierna/brazo que se estira.

PAra ambos casos necesito que el hurtbox aparezca antes que el hitbox y se mantenga un buen rato ahí incluso despues de que se vaya el hitbox. de esta manera se implementan los whiffpunish, que es el castigo por haber whiffeado (que el oponente no reciba el ataque ni hit ni block, de esta manera por estar fuera de rango puede contraatacar)

El timer está overlappeando la palabra "Round 1", por lo que dejaría más abajo la palabra Round 1 y el timer más destacado (sería ideal que tuviese una caja/rectángulo cubriéndolo)

lo otro que me gustaría sería que en ambos movimientos especiales (shoryu y donkey) los jugadores "brillaran", 1 frame amarillo y el siguiente frame el color del player.. este destello es para indicar que el jugador está haciendo un movimiento especial. el shoryu ya se pone amarillo pero no brilla en el sentido de que no alterna los colores.

