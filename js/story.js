window.ANF_STORY = {
  audioChapters: [],
  githubUrl: "https://github.com/PhaeCorp",
  sources: {
    pathfinder: { label: "NASA Mars Pathfinder and Sojourner", url: "https://science.nasa.gov/mission/mars-pathfinder/" }
  },
  facts: {
    launch: { title: "Lift-off day!", description: "Pathfinder launched from Cape Canaveral, Florida, on December 4, 1996, aboard a Delta II rocket.", source: "pathfinder" },
    parachute: { title: "Parachute to the rescue", description: "A parachute helped slow Pathfinder as it descended through Mars’ thin atmosphere before its airbag-cushioned landing.", source: "pathfinder" },
    airbags: { title: "A bouncy landing", description: "Large airbags cushioned Pathfinder’s impact with the Martian ground. The airbag landing method was used for the first time on this mission.", source: "pathfinder" },
    landing: { title: "Ares Vallis", description: "Pathfinder landed at Ares Vallis, a rocky ancient floodplain on Mars, on July 4, 1997.", source: "pathfinder" },
    mars: { title: "Hello, Mars!", description: "Mars is the rocky world where Pathfinder and Sojourner landed on July 4, 1997.", source: "pathfinder" },
    pathfinder: { title: "Pathfinder, my space buddy", description: "Mars Pathfinder carried a lander and the little Sojourner rover. The lander was later named the Carl Sagan Memorial Station.", source: "pathfinder" },
    sojourner: { title: "That’s me — Sojourner!", description: "I was the first rover to explore Mars. I rolled down Pathfinder’s ramp on July 5, 1997.", source: "pathfinder" },
    rocks: { title: "Mars rocks have clues", description: "Sojourner used its Alpha Proton X-ray Spectrometer to study the elemental make-up of rocks and soil.", source: "pathfinder" },
    earth: { title: "A long way from home", description: "Pathfinder sent data and pictures from Mars back to Earth, where the mission team could study them.", source: "pathfinder" },
    signal: { title: "Messages across space", description: "Pathfinder sent information from Mars to its mission team on Earth. Its final data transmission was on September 27, 1997.", source: "pathfinder" },
    guide: { title: "Meet Zip, your guide!", description: "Zip is an imaginary, friendly guide for our story. Sojourner was real: NASA's little rover rode to Mars aboard Pathfinder.", source: "pathfinder" }
  },
  chapters: [
  {
    id: 1,
    title: "Lift-off!",
    sceneIndex: 0,
    date: "DECEMBER 4, 1996 · LIFT-OFF",
    durationSeconds: 25,
    sentences: [
      "Hi, friend! I'm Sojourner, a little rover folded up inside my space-travel buddy, Pathfinder.",
      "On December 4, 1996, our Delta II rocket thundered up from Florida and carried us above Earth.",
      "The clouds became tiny swirls below me as our big adventure began.",
      "I couldn't drive yet, but every mile brought me closer to my new red home!"
    ]
  },
  {
    id: 2,
    title: "A long ride through space",
    sceneIndex: 1,
    date: "DECEMBER 1996—JULY 1997 · THE LONG RIDE",
    durationSeconds: 25,
    sentences: [
      "For seven months, Pathfinder carried me through space while Earth grew into a tiny blue dot.",
      "I was tucked safely inside, saving my six wheels for the day they could touch Martian soil.",
      "My mission team on Earth guided Pathfinder across all that enormous space.",
      "At last, landing day was near. I was ready to meet Mars!"
    ]
  },
  {
    id: 3,
    title: "Parachute, airbags, bounce!",
    sceneIndex: 5,
    date: "JULY 4, 1997 · TOUCHDOWN",
    durationSeconds: 26,
    sceneChanges: [{ sentence: 2, sceneIndex: 2 }],
    sentences: [
      "Mars has very thin air, so Pathfinder opened a giant parachute to slow its speedy fall.",
      "Then big airbags puffed around my lander like a bunch of protective space pillows.",
      "Boing, bounce, boing! We bounced across the ancient Ares Vallis plain and rolled to a stop.",
      "That was the first time a mission used this kind of airbag landing. I was on Mars!"
    ]
  },
  {
    id: 4,
    title: "Ramp down, rover out!",
    sceneIndex: 3,
    date: "JULY 5, 1997 · FIRST WHEELS ON MARS",
    durationSeconds: 25,
    sceneChanges: [{ sentence: 2, sceneIndex: 4 }],
    sentences: [
      "The next day, Pathfinder lowered a ramp, and I carefully rolled toward the rusty ground.",
      "My six little wheels touched Mars! I looked around my brand-new, rocky home.",
      "I stretched out my science instrument to study a rock and send clues back to Earth.",
      "Every pebble felt like a clue in my very first space-detective case!"
    ]
  },
  {
    id: 5,
    title: "A little rover, a big story",
    sceneIndex: 4,
    date: "SEPTEMBER 27, 1997 · A STORY THAT CARRIED ON",
    durationSeconds: 26,
    sentences: [
      "Day after day, Pathfinder sent my pictures and science clues across space to my team on Earth.",
      "On September 27, 1997, Pathfinder sent its final data message, and our radio grew quiet.",
      "But quiet couldn't erase what we discovered: more Mars explorers would follow after me.",
      "I was small, but my journey opened a big door. What will your curiosity explore, friend?"
    ]
  }
  ]
};
