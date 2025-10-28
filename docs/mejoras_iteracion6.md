Ya, acabo de probar la iteración 5 y hay hartas cosas que mejoraron harto!

el player del 2P cuando hace low attack lo hace hacia la derecha (el sprite está al revés), hay que corregir eso, también revisar eso para el resto de ataques del 2P


el hurtbox de los personajes debe ser más ancho, en particular debería estar "mejor centrado" ya que la parte de adelante del player 2 no tiene hurtbox. sería ideal poder revisar eso con mayor exactitud para que calce mejor con como se muestran las cosas en la pantalla. el player 1 no tiene hurtbox en el pié trasero.

Hay que ajustar hitboxes si. Siento que para el low attack necesita ser más ancho el hitbox y también pegar más abajo. 

hay un bug brígido si y es que una vez que conecta un golpe depsues no vuelve a conectar. no se que es lo que será pero solo puedo pegar una vez una lowkick y despues me deja de funcionar, será que habrá que resetear un counter/timer que se implementó algunas iteraciones atrás para que un golpe no pegara varias veces dentro de la misma iteración del golpe?
