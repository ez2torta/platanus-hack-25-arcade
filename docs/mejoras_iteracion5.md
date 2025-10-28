Está funcionando el contador de rounds!

Ahora sucede que veo que los jugadores no se pueden golpear, no estoy seguro si es por la posición de las hitboxes o si por algún cambio que sucedió durante la última iteración. lo importante acá es que ya no se gastan todas las guardias a la vez, pero dejaron de golpearse los oponentes, tendrá relación que hiciste los hurtbox más delgadas también? la low kick y el golpe medio no logran conectar con el oponente cuando están frente a frente a quemarropa (pointblank)

El sprite de cada ataque podría ser más ancho pensando que la posición del jugador cambia durante la animación de ese ataque, entonces en vez de estar dibujado "desde el centro" para el ataque medio y bajo, podrían estar dibujados "desde una orilla", entonces tienes más ancho para aprovechar estos ataques (y que sean más anchos legítimamente), pero esto es si o si cuidadndo de la posición del jugador en cada frame, ya que cuando termine el ataque debe volver a la posición original a la posición idle.

Recordar también que cada ataque debe golpear solo hacia adelante, veo que los sprites también están golpeando hacia atrás cuando en realidad eso no debería pasar dadas las interacciones del juego (no hay salto, el overlap no es posible, etc)

lo otro que no alcancé a revisar es qué pasa cuando interrumpen una animación del oponente. para cualquier caso que no sea que el oponente haciendo una guardia, debería iniciar la animación de "estar siendo golpeado". Está esto implementado?

