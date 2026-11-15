# Sojourner and the Little Red World

## Summary

**Sojourner and the Little Red World** is an interactive, child-friendly storybook about NASA's Mars Pathfinder mission and its Sojourner rover. Through an imagined first-person voice, Sojourner invites young readers along from its launch in 1996 to its exploration of Ares Vallis on Mars in 1997.

The project brings mission history to life through an illustrated, chapter-based experience while distinguishing the fictional narration from historical mission facts. It is designed to make space exploration approachable for young readers and anyone curious about Mars.

## Project Demonstration

No public demo URL is configured yet. Open index.html locally to explore the story.

## Project

This folder contains the complete project source. No separate hosted project URL is configured yet.

## Project Details

### 🚀 The Story

The story is told across five chapters:

1. **Lift-off!** — Sojourner and Pathfinder launch from Florida on December 4, 1996.
2. **A long ride through space** — Pathfinder carries Sojourner on the journey to Mars.
3. **Parachute, airbags, bounce!** — Pathfinder lands at Ares Vallis on July 4, 1997.
4. **Ramp down, rover out!** — Sojourner rolls down the ramp and begins exploring Mars.
5. **A little rover, a big story** — Pathfinder's final data transmission and Sojourner's legacy.

Readers can move between chapters, listen to narration, follow sentence-by-sentence subtitles, and select illustrated spacecraft and landmarks to open cited mission facts. A friendly flying robot named Zip guides the story; Zip is fictional. Tap Zip to hear a short, chapter-specific greeting in a higher-pitched synthetic voice. Zip's voice uses the browser's available speech voice, so its sound may vary by device. Smooth scene animations follow the narrated events, and the experience respects reduced-motion preferences.

### 💻 Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Web Speech API for narration
- Web Audio API for generated sound effects and optional background music
- Inline SVG illustrations

No frameworks, build tools, package installation, or server are required.

### ✨ Highlights

- **Storytelling:** A first-person imagined narrative makes the mission approachable for young readers.
- **Historical context:** Mission facts are distinct from Sojourner's fictional dialogue and link to NASA sources.
- **Interactive learning:** Five chapters, accessible story controls, and clickable illustrations with fact cards.
- **Narration and sound:** Browser speech, subtitles, generated sound effects, and optional synthesized background music.
- **Accessible motion:** Animations pause with narration and respond to the user's reduced-motion preference.
- **Original visuals:** Colorful, hand-drawn-style SVG scenes, an animated cover, and the supplied Yearners logo.

### 📚 Sources and Accuracy

Mission facts are based on NASA's [Mars Pathfinder and Sojourner mission records](https://science.nasa.gov/mission/mars-pathfinder/) and NASA's [Mars Exploration Rovers information](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/). Sojourner's dialogue is an imagined, child-friendly narration—not a historical quotation. Zip is an imaginary guide. Additional citations appear in the interactive fact cards.

## Run Locally

### Requirements

- A modern browser with JavaScript enabled

### Installation

No installation is needed. Open index.html directly in a browser and select _Begin my journey_ to start the narration and optional generated music.

### Available Scripts

There are no command-line scripts or build step; the site runs directly from its HTML, CSS, and JavaScript files.

## Audio Customization

The browser's Web Speech API is the default narrator. To use recorded chapter audio, put files named chapter1.mp3 through chapter5.mp3 in assets/audio/ and add their chapter numbers to audioChapters in js/story.js. Listed recordings replace speech synthesis for their chapters; unavailable recordings fall back to browser narration. Keep the recorded sentences in the same order as the chapter text for approximate subtitle timing.

The looping background melody and sound effects are generated locally with the Web Audio API; no music or effect downloads are needed.

## Use of Artificial Intelligence (AI)

GitHub Copilot
DeepSeek
Claude
