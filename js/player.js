(function () {
  "use strict";

  const story = window.ANF_STORY;
  const chapters = story.chapters;
  const elements = {
    counter: document.getElementById("chapter-counter"),
    kicker: document.getElementById("chapter-kicker"),
    title: document.getElementById("chapter-title"),
    scenes: Array.from(document.querySelectorAll(".scene")),
    missionSky: document.getElementById("mission-sky"),
    sceneDate: document.getElementById("scene-date"),
    subtitle: document.getElementById("subtitle"),
    startCover: document.getElementById("start-cover"),
    storyScreen: document.getElementById("story-screen"),
    startButton: document.getElementById("start-button"),
    playButton: document.getElementById("play-button"),
    playIcon: document.getElementById("play-icon"),
    playLabel: document.getElementById("play-label"),
    backButton: document.getElementById("back-button"),
    nextButton: document.getElementById("next-button"),
    replayButton: document.getElementById("replay-button"),
    chapterDots: document.getElementById("chapter-dots"),
    muteButton: document.getElementById("mute-button"),
    muteIcon: document.getElementById("mute-icon"),
    muteLabel: document.getElementById("mute-label"),
    volumeSlider: document.getElementById("volume-slider"),
    voiceSelect: document.getElementById("voice-select"),
    subtitlesToggle: document.getElementById("subtitles-toggle"),
    musicToggle: document.getElementById("music-toggle"),
    settingsMenu: document.getElementById("settings-menu"),
    landingGuide: document.querySelector(".landing-guide"),
    missionGuide: document.querySelector(".mission-guide"),
    factPanel: document.getElementById("fact-panel"),
    factTitle: document.getElementById("fact-title"),
    factDescription: document.getElementById("fact-description"),
    factSource: document.getElementById("fact-source"),
    factClose: document.getElementById("fact-close"),
    endCard: document.getElementById("end-card"),
    thankYouToast: document.getElementById("thankyou-toast"),
    playAgainButton: document.getElementById("play-again-button")
  };
  const state = {
    chapter: 0,
    sentence: 0,
    started: false,
    playing: false,
    muted: false,
    volume: Number(elements.volumeSlider.value),
    voices: [],
    timer: null,
    audio: null,
    mode: "idle",
    zipSpeaking: false,
    token: 0
  };
  const speech = window.speechSynthesis || null;
  let thankYouTimer = null;

  function hideThankYouToast() {
    clearTimeout(thankYouTimer);
    thankYouTimer = null;
    elements.thankYouToast.hidden = true;
  }

  function showThankYouToast() {
    clearTimeout(thankYouTimer);
    elements.thankYouToast.hidden = false;
    thankYouTimer = window.setTimeout(function () {
      elements.thankYouToast.hidden = true;
      thankYouTimer = null;
    }, 3000);
  }

  function playSfx(name) {
    if (!state.muted && window.ANF_SFX) window.ANF_SFX.play(name, state.volume);
  }

  function syncAudio() {
    if (!window.ANF_SFX) return;
    window.ANF_SFX.setVolume(state.muted ? 0 : state.volume);
    if (elements.musicToggle.checked && !state.muted) window.ANF_SFX.startMusic();
    else window.ANF_SFX.stopMusic();
  }

  function showSentence(index) {
    const chapter = chapters[state.chapter];
    const text = chapter.sentences[index];
    if (!text) return;
    const sceneChange = chapter.sceneChanges && chapter.sceneChanges.find(function (change) {
      return change.sentence === index;
    });
    if (sceneChange) showScene(sceneChange.sceneIndex);
    const activeScene = elements.scenes.find(function (scene) {
      return !scene.hidden;
    });
    if (activeScene) activeScene.dataset.beat = chapter.id + "-" + index;
    state.sentence = index;
    elements.subtitle.textContent = text;
    elements.subtitle.classList.remove("pop");
    void elements.subtitle.offsetWidth;
    elements.subtitle.classList.add("pop");
    playSfx("pop");
  }

  function updateControls() {
    elements.counter.textContent = "CHAPTER " + (state.chapter + 1) + " OF " + chapters.length;
    elements.backButton.disabled = state.chapter === 0;
    elements.nextButton.disabled = state.chapter === chapters.length - 1;
    elements.playIcon.textContent = state.playing ? "Ⅱ" : "▶";
    elements.playLabel.textContent = state.playing ? "Pause" : "Play";
    elements.playButton.setAttribute("aria-label", state.playing ? "Pause story" : "Play story");
    elements.muteIcon.textContent = state.muted ? "♪̸" : "♫";
    elements.muteLabel.textContent = state.muted ? "Sound off" : "Sound on";
    elements.muteButton.setAttribute("aria-label", state.muted ? "Unmute sounds" : "Mute sounds");
    Array.from(elements.chapterDots.children).forEach(function (dot, index) {
      dot.setAttribute("aria-current", index === state.chapter ? "step" : "false");
      dot.classList.toggle("is-done", index < state.chapter);
    });
  }

  function animateScene(scene) {
    scene.classList.remove("is-active");
    void scene.offsetWidth;
    scene.classList.add("is-active");
  }

  function showScene(sceneIndex) {
    const mood = sceneIndex === 0 ? "launch"
      : sceneIndex === 1 ? "cruise"
        : sceneIndex === 2 || sceneIndex === 5 ? "landing"
          : sceneIndex === 3 ? "surface" : "legacy";
    elements.missionSky.dataset.mood = mood;
    elements.scenes.forEach(function (scene) {
      const active = Number(scene.dataset.scene) === sceneIndex;
      scene.hidden = !active;
      scene.classList.toggle("is-active", active);
      if (active) {
        scene.dataset.beat = "";
        animateScene(scene);
      }
    });
  }

  function renderChapter() {
    const chapter = chapters[state.chapter];
    elements.kicker.textContent = "MISSION LOG " + String(state.chapter + 1).padStart(2, "0");
    elements.title.textContent = chapter.title;
    elements.sceneDate.textContent = chapter.date;
    showScene(chapter.sceneIndex);
    elements.endCard.hidden = true;
    elements.factPanel.hidden = true;
    elements.subtitle.textContent = state.started ? "Ready when you are, friend!" : "Tap “Start the Story!” to meet me!";
    updateControls();
  }

  function finishChapter(token) {
    if (token !== state.token) return;
    state.playing = false;
    state.mode = "idle";
    document.body.classList.add("story-paused");
    state.audio = null;
    clearTimeout(state.timer);
    if (state.chapter === chapters.length - 1) {
      elements.endCard.hidden = false;
      showThankYouToast();
    }
    updateControls();
  }

  function advanceSentence(token) {
    if (token !== state.token || !state.playing) return;
    const next = state.sentence + 1;
    if (next < chapters[state.chapter].sentences.length) {
      state.sentence = next;
      speakCurrentSentence(token);
    }
    else finishChapter(token);
  }

  function stopPlayback() {
    state.token += 1;
    state.zipSpeaking = false;
    clearTimeout(state.timer);
    if (speech) speech.cancel();
    if (state.audio) {
      state.audio.onended = null;
      state.audio.onerror = null;
      state.audio.ontimeupdate = null;
      state.audio.pause();
      state.audio = null;
    }
    state.playing = false;
    state.mode = "idle";
  }

  function selectedVoice() {
    const index = Number(elements.voiceSelect.value);
    return Number.isInteger(index) && state.voices[index] ? state.voices[index] : null;
  }

  function speakZip() {
    const guide = state.started ? elements.missionGuide : elements.landingGuide;
    const greeting = guide.querySelector(".guide-greeting");
    const text = state.started
      ? story.zipDialogue.chapters[state.chapter]
      : story.zipDialogue.cover;
    greeting.textContent = text;
    guide.classList.add("is-introducing");
    playSfx("beep");

    if (!speech || state.zipSpeaking) return;
    state.zipSpeaking = true;
    const token = state.token;
    const audio = state.playing && state.mode === "audio" ? state.audio : null;
    if (audio) audio.pause();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = selectedVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice ? voice.lang : "en-US";
    utterance.pitch = 1.6;
    utterance.rate = 1;
    utterance.volume = state.muted ? 0 : state.volume;
    function finishZip() {
      state.zipSpeaking = false;
      if (token !== state.token || !audio || !state.playing || state.mode !== "audio" || state.audio !== audio) return;
      audio.play().catch(function () { startSpeech(token); });
    }
    utterance.onend = finishZip;
    utterance.onerror = finishZip;
    speech.speak(utterance);
  }

  function speakCurrentSentence(token) {
    if (token !== state.token || !state.playing) return;
    const text = chapters[state.chapter].sentences[state.sentence];
    showSentence(state.sentence);
    if (!speech) {
      state.timer = window.setTimeout(function () { advanceSentence(token); }, Math.max(2600, text.trim().split(/\s+/).length * 390));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = selectedVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice ? voice.lang : "en-US";
    utterance.pitch = 1.12;
    utterance.rate = 0.88;
    utterance.volume = state.muted ? 0 : state.volume;
    utterance.onend = function () { advanceSentence(token); };
    utterance.onerror = function (event) {
      if (token !== state.token || event.error === "canceled" || event.error === "interrupted") return;
      state.timer = window.setTimeout(function () { advanceSentence(token); }, Math.max(2200, text.length * 38));
    };
    speech.speak(utterance);
  }

  function startSpeech(token) {
    if (token !== state.token || state.mode === "speech") return;
    if (state.audio) {
      state.audio.onended = null;
      state.audio.onerror = null;
      state.audio.ontimeupdate = null;
      state.audio.pause();
      state.audio = null;
    }
    state.mode = "speech";
    state.sentence = 0;
    speakCurrentSentence(token);
  }

  function startAudio(token) {
    const audio = new Audio("assets/audio/chapter" + (state.chapter + 1) + ".mp3");
    state.audio = audio;
    audio.preload = "auto";
    audio.volume = state.muted ? 0 : state.volume;
    audio.onended = function () { finishChapter(token); };
    audio.onerror = function () { startSpeech(token); };
    audio.ontimeupdate = function () {
      if (token !== state.token || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
      const sentences = chapters[state.chapter].sentences;
      const weights = sentences.map(function (sentence) { return sentence.split(/\s+/).length; });
      const total = weights.reduce(function (sum, weight) { return sum + weight; }, 0);
      const elapsedWords = audio.currentTime / audio.duration * total;
      let sum = 0;
      let activeIndex = 0;
      for (let index = 0; index < weights.length; index += 1) {
        sum += weights[index];
        if (elapsedWords < sum) { activeIndex = index; break; }
        activeIndex = index;
      }
      if (activeIndex !== state.sentence) showSentence(activeIndex);
    };
    audio.play().then(function () {
      if (token !== state.token) { audio.pause(); return; }
      state.mode = "audio";
      state.playing = true;
      state.sentence = -1;
      showSentence(0);
      playSfx("beep");
      updateControls();
    }).catch(function () { startSpeech(token); });
  }

  function beginPlayback() {
    if (!state.started) {
      state.started = true;
      elements.startCover.classList.add("is-gone");
      document.body.classList.add("story-active");
      elements.storyScreen.hidden = false;
      window.setTimeout(function () {
        if (state.started) elements.startCover.hidden = true;
      }, 560);
      elements.playButton.disabled = false;
    }
    stopPlayback();
    document.body.classList.remove("story-paused");
    const token = state.token;
    state.playing = true;
    state.sentence = 0;
    state.mode = "loading";
    elements.endCard.hidden = true;
    playSfx("whoosh");
    syncAudio();
    if (speech) speech.cancel();
    updateControls();
    if (story.audioChapters.indexOf(state.chapter + 1) !== -1) startAudio(token);
    else startSpeech(token);
  }

  function pausePlayback() {
    if (!state.playing) return;
    state.playing = false;
    document.body.classList.add("story-paused");
    clearTimeout(state.timer);
    if (state.mode === "audio" && state.audio) state.audio.pause();
    else if (speech) speech.pause();
    updateControls();
  }

  function resumePlayback() {
    if (state.playing) return;
    if (!state.started) { beginPlayback(); return; }
    state.playing = true;
    document.body.classList.remove("story-paused");
    const token = state.token;
    if (state.mode === "audio" && state.audio) {
      state.audio.play().catch(function () { startSpeech(token); });
    } else if (state.mode === "speech" && speech) speech.resume();
    else {
      state.mode = "speech";
      speakCurrentSentence(token);
    }
    updateControls();
  }

  function navigateChapter(index, autoplay) {
    if (index < 0 || index >= chapters.length) return;
    stopPlayback();
    state.chapter = index;
    state.sentence = 0;
    renderChapter();
    playSfx("chime");
    if (autoplay) beginPlayback();
  }

  function renderDots() {
    const fragment = document.createDocumentFragment();
    chapters.forEach(function (chapter, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chapter-dot";
      button.setAttribute("aria-label", "Go to chapter " + (index + 1) + ": " + chapter.title);
      const hiddenText = document.createElement("span");
      hiddenText.textContent = "Chapter " + (index + 1);
      button.appendChild(hiddenText);
      button.addEventListener("click", function () { navigateChapter(index, state.playing); });
      fragment.appendChild(button);
    });
    elements.chapterDots.appendChild(fragment);
  }

  function populateVoices() {
    if (!speech) return;
    const previous = elements.voiceSelect.value;
    state.voices = speech.getVoices().filter(function (voice) { return /^en(-|$)/i.test(voice.lang); });
    elements.voiceSelect.replaceChildren(new Option("Friendly voice", ""));
    state.voices.forEach(function (voice, index) {
      elements.voiceSelect.appendChild(new Option(voice.name + " (" + voice.lang + ")", String(index)));
    });
    const friendly = state.voices.findIndex(function (voice) {
      return /female|samantha|karen|aria|jenny|zira|google us english/i.test(voice.name);
    });
    if (previous && state.voices[Number(previous)]) elements.voiceSelect.value = previous;
    else if (friendly >= 0) elements.voiceSelect.value = String(friendly);
  }

  function showFact(key) {
    const fact = story.facts[key];
    if (!fact) return;
    const source = story.sources[fact.source];
    elements.factTitle.textContent = fact.title;
    elements.factDescription.textContent = fact.description;
    elements.factSource.href = source.url;
    elements.factSource.textContent = source.label + " ↗";
    elements.factPanel.hidden = false;
    playSfx(key.indexOf("star") !== -1 ? "twinkle" : "pop");
  }

  document.querySelectorAll(".scene-art .clickable").forEach(function (piece) {
    piece.addEventListener("click", function () { showFact(piece.getAttribute("data-fact")); });
    piece.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showFact(piece.getAttribute("data-fact"));
      }
    });
  });

  elements.missionGuide.addEventListener("click", function () {
    speakZip();
    showFact("guide");
  });
  elements.startButton.addEventListener("click", beginPlayback);
  elements.landingGuide.addEventListener("click", function () {
    speakZip();
  });
  elements.playButton.addEventListener("click", function () {
    if (state.playing) pausePlayback();
    else resumePlayback();
  });
  elements.backButton.addEventListener("click", function () { navigateChapter(state.chapter - 1, state.playing); });
  elements.nextButton.addEventListener("click", function () { navigateChapter(state.chapter + 1, state.playing); });
  elements.replayButton.addEventListener("click", beginPlayback);
  elements.playAgainButton.addEventListener("click", function () {
    hideThankYouToast();
    elements.endCard.hidden = true;
    navigateChapter(0, true);
  });
  document.querySelectorAll(".brand").forEach(function (brand) {
    brand.addEventListener("click", function (event) {
      event.preventDefault();
      hideThankYouToast();
      stopPlayback();
      state.chapter = 0;
      state.sentence = 0;
      state.started = false;
      if (window.ANF_SFX) window.ANF_SFX.stopMusic();
      renderChapter();
      elements.storyScreen.hidden = true;
      elements.endCard.hidden = true;
      document.body.classList.remove("story-active", "story-paused");
      elements.startCover.hidden = false;
      elements.startCover.classList.remove("is-gone");
    });
  });
  elements.factClose.addEventListener("click", function () { elements.factPanel.hidden = true; });
  elements.muteButton.addEventListener("click", function () {
    state.muted = !state.muted;
    if (state.audio) state.audio.volume = state.muted ? 0 : state.volume;
    syncAudio();
    updateControls();
  });
  elements.volumeSlider.addEventListener("input", function () {
    state.volume = Number(elements.volumeSlider.value);
    if (state.audio) state.audio.volume = state.muted ? 0 : state.volume;
    syncAudio();
  });
  elements.musicToggle.addEventListener("change", syncAudio);
  elements.subtitlesToggle.addEventListener("change", function () {
    elements.subtitle.classList.toggle("subtitles-off", !elements.subtitlesToggle.checked);
  });
  elements.voiceSelect.addEventListener("change", function () {
    if (state.playing && state.mode === "speech") {
      const token = state.token;
      if (speech) speech.cancel();
      speakCurrentSentence(token);
    }
  });

  document.addEventListener("click", function (event) {
    if (elements.settingsMenu.open && !elements.settingsMenu.contains(event.target)) elements.settingsMenu.open = false;
  });
  document.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|SELECT|TEXTAREA|BUTTON|A|SUMMARY)$/.test(target.tagName))) return;
    if (event.code === "Space") {
      event.preventDefault();
      if (!elements.startCover.classList.contains("is-gone")) beginPlayback();
      else if (state.playing) pausePlayback();
      else resumePlayback();
    } else if (event.key === "ArrowRight") navigateChapter(state.chapter + 1, state.playing);
    else if (event.key === "ArrowLeft") navigateChapter(state.chapter - 1, state.playing);
  });

  if (speech) {
    populateVoices();
    speech.addEventListener("voiceschanged", populateVoices);
  } else {
    elements.voiceSelect.disabled = true;
    elements.voiceSelect.options[0].textContent = "Voice unavailable";
  }
  renderDots();
  renderChapter();
})();