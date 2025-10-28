Acabo de probar el juego, quedó super bueno!

Tengo que cambiar un par de cosas si

quiero que la expresividad de los elementos sea de 10x10 en vez de 5x5.. creo que no se logra ver bien lo que hacen las cosas en 5x5.

hay hitboxes y hurtboxes distintos por ataque? es decir, son distintos frame by frame y a la vez distintos en el sentido que no todo el hitbox es igual al hurtbox?

no me gustó lo de los botones. me interesa mantener la lógica anterior de moverse (con adelante y atras) y solo 1 botón de ataque, que dependiendo del estado de estos botones se logren hacer especiales o no. 

onda para el player 1, A = mover izquierda, S = atacar, D = mover derecha.

para el player 2, flecha izquierda = mover izquierda, flecha abajo = atacar, flecha derecha = mover derecha.


las acciones neutrales son:
0.- no hacer nada (no presionar botones en el momento, pero si sirve un botón holdeado desde antes)

1.- caminar hacia adelante (botón adelante)

2.- caminar hacia atras (boton atras). caminar hacia atrás también activa la guardia

3.- ataque bajo (presionar el botón de ataque)

4.- ataque medio (presionar el botón de ataque y a la vez adelante o atrás)

5.- donkey kick (dejar presionado el botón de ataque 1 segundo (o más), luego soltar)

6.- shoryu (dejar presionado el botón de ataque 1 segundo (o más) y luego soltar el botón presionando adelante)

además quiero que haya un contador de rounds y un contador de guardias. si el jugador hace guardia 3 veces en el mismo round entonces no puede volver a hacer guardia (y por ende entran los ataques)