(function () {
  "use strict";

  let context = null;
  let musicTimer = null;
  let musicVolume = .025;
  let musicStep = 0;
  let musicBus = null;
  const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 523.25, 659.25, 783.99, 1046.5, 880, 783.99, 659.25, 587.33];
  const soundNotes = {
    pop: [650, 860],
    beep: [520, 740],
    chime: [660, 880, 1100],
    twinkle: [1320, 1760],
    whoosh: [240, 460]
  };

  function getContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!context) context = new AudioContext();
    if (context.state === "suspended") context.resume();
    return context;
  }

  function play(name, volume) {
    const audio = getContext();
    const notes = soundNotes[name];
    if (!audio || !notes || volume <= 0) return;
    const now = audio.currentTime;
    const master = audio.createGain();
    master.gain.setValueAtTime(Math.min(.13, volume * .13), now);
    master.connect(audio.destination);
    notes.forEach(function (frequency, index) {
      const oscillator = audio.createOscillator();
      const envelope = audio.createGain();
      const start = now + index * .075;
      oscillator.type = name === "whoosh" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(name === "whoosh" ? frequency * 1.8 : frequency, start);
      if (name === "whoosh") oscillator.frequency.exponentialRampToValueAtTime(Math.max(80, frequency * .55), start + .16);
      envelope.gain.setValueAtTime(.001, start);
      envelope.gain.linearRampToValueAtTime(1, start + .018);
      envelope.gain.exponentialRampToValueAtTime(.001, start + (name === "whoosh" ? .19 : .12));
      oscillator.connect(envelope);
      envelope.connect(master);
      oscillator.start(start);
      oscillator.stop(start + (name === "whoosh" ? .2 : .14));
    });
    window.setTimeout(function () { master.disconnect(); }, 600);
  }

  function playMusicNote(frequency) {
    const audio = getContext();
    if (!audio || !musicBus) return;
    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const envelope = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    envelope.gain.setValueAtTime(.001, now);
    envelope.gain.linearRampToValueAtTime(.65, now + .04);
    envelope.gain.exponentialRampToValueAtTime(.001, now + .48);
    oscillator.connect(envelope);
    envelope.connect(musicBus);
    oscillator.start(now);
    oscillator.stop(now + .5);
  }

  function startMusic() {
    if (musicTimer) return;
    const audio = getContext();
    if (!audio) return;
    musicBus = audio.createGain();
    musicBus.gain.value = musicVolume;
    musicBus.connect(audio.destination);
    musicStep = 0;
    playMusicNote(melody[musicStep]);
    musicStep += 1;
    musicTimer = window.setInterval(function () {
      playMusicNote(melody[musicStep % melody.length]);
      musicStep += 1;
    }, 470);
  }

  function stopMusic() {
    if (musicTimer) window.clearInterval(musicTimer);
    musicTimer = null;
    if (musicBus) {
      const bus = musicBus;
      musicBus = null;
      bus.gain.setTargetAtTime(0, context.currentTime, .08);
      window.setTimeout(function () { bus.disconnect(); }, 500);
    }
  }

  function setVolume(volume) {
    musicVolume = Math.max(0, Math.min(.035, volume * .035));
    if (musicBus && context) musicBus.gain.setTargetAtTime(musicVolume, context.currentTime, .08);
  }

  window.ANF_SFX = { play: play, startMusic: startMusic, stopMusic: stopMusic, setVolume: setVolume };
})();