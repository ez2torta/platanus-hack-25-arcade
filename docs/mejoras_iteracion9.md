Hay un bug con el shoryu. cuando conecta un shoryu, el juego queda colgado en el frame 17 del shoryu. ni idea qué es lo que será pero esto dice la consola de chrome

game.js:635 Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at Fighter.getHurtboxes (<anonymous>:635:40)
    at checkCombatCollisions (<anonymous>:970:31)
    at initialize.update (<anonymous>:908:3)
    at initialize.step (phaser.min.js:1:974602)
    at initialize.update (phaser.min.js:1:961823)
    at initialize.step (phaser.min.js:1:75981)
    at initialize.step (phaser.min.js:1:80280)
    at e (phaser.min.js:1:141005)

cuando parta el round quiero que salga un mensaje que diga Round 1 por 1 segundo y luego Fight por medio segundo y haga play a la música, despues de ponerle play a la música que los personajes puedan moverse y atacar.
 le pedí a chatgpt que me hiciera unos sonidos básicos con pocas líneas de código para tener un background music de cada round. Quiero que la canción se reinicie cuando inicia un round.
Además quiero que cuando quede poco tiempo (15 segundos) o cuando un player tenga menos del 25% de la vida quiero que aumentes los BPM a 160 para que la canción suene más rápida, a la vez que el rectángulo del timer debe brillar rojo y blanco (parecido a lo que hice con los movimientos especiales).
También es importante que agregues un poquito más de espacio verticar entre el contador de rounds y la info de P1: P2: y Guards:.
Aquí te va un extracto del código que hice con chatgpt. considera que habla de un audiocontext por lo que es posible que haya que esperar algún input del usuario, en este caso como es un juego el input va a venir si o si de alguna parte, en particular del teclado.

puedes implementar esto dentro del game loop? 

<script>
(() => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let running = false, timerId = null;
  const bpm = 90;                       // cambia tempo
  const beatSec = 60 / bpm;
  const melody = [                      // [semitones from A4=440, length_in_beats]
    [0, 1], [2, 1], [4, 1], [5, 1],     // simple motif
    [4, 1], [2, 1], [0, 2]
  ];
  const A4 = 440;
  function freqFromSemitone(n){ return A4 * Math.pow(2, n/12); }

  function playTone(time, freq, dur, type='saw', vol=0.12){
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(vol, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(time); o.stop(time + dur + 0.02);
  }

  function playClick(time){
    // short high click (metronome)
    playTone(time, 2000, 0.03, 'square', 0.08);
  }

  function scheduleLoop(startAt){
    let t = startAt;
    const barBeats = 4;
    // schedule a few bars ahead
    const lookaheadBars = 4;
    for(let bar=0; bar<lookaheadBars; bar++){
      // metronome on each beat
      for(let b=0;b<barBeats;b++){
        playClick(t + b * beatSec);
      }
      // schedule melody starting at beginning of bar
      let cursor = t;
      for(const [semi, len] of melody){
        const f = freqFromSemitone(semi - 9); // shift motif so it sounds nice (A4 baseline)
        playTone(cursor, f, len * beatSec, 'sine', 0.08);
        cursor += len * beatSec;
      }
      t += barBeats * beatSec;
    }
  }

  function start(){
    if(ctx.state === 'suspended') ctx.resume();
    const startAt = ctx.currentTime + 0.05;
    scheduleLoop(startAt);
    // keep rescheduling periodically
    timerId = setInterval(()=> scheduleLoop(ctx.currentTime + 0.05), 1000);
    running = true;
  }
  function stop(){
    if(timerId) clearInterval(timerId);
    timerId = null;
    running = false;
  }

  document.getElementById('play').addEventListener('click', ()=>{
    if(!running) start(); else stop();
  });
})();
</script>
