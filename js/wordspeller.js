const wordspellerForm = document.getElementById("wordspeller-form");
const wordInput = document.getElementById("word-to-spell-input");
const spellButton = document.getElementById("spell-btn");
const formErrorParagraph = document.getElementById("form-error-paragraph");
const listenBtn = document.getElementById("listen-btn");

wordspellerForm.addEventListener("submit", handleSpellWord);

function handleSpellWord(event) {
  event.preventDefault();

  formErrorParagraph.textContent = "";

  let word = wordInput.value;

  if (word.includes("spell")) {
    // Remove Spell
  }

  console.log(word);

  // Input Validation
  const wordRegex = /^[a-z]*$/gi;

  if (!wordRegex.test(word)) {
    formErrorParagraph.textContent =
      "Invalid characters, please enter a word without space e.g Height";

    return;
  }

  spellButton.textContent = "Spelling";
  spellButton.setAttribute("disabled", "true");

  try {
    // Pronounce the word after spelling each letter
    spell(`${word.split("").join(" ")} ${word}`);
  } catch (err) {
    console.error(err);
    formErrorParagraph.textContent =
      "Sorry, Wordspeller cannot function well at this moment, this might an issue with your browser.";

    generateWordButton.removeAttribute("disabled");
    spellButton.textContent = "Spell";
    spellButton.removeAttribute("disabled");
  }
}

function spell(text) {
  window.speechSynthesis.cancel();

  let availableVoices = window.speechSynthesis.getVoices();

  // Get latest voices when as soon as they're added
  window.speechSynthesis.onvoiceschanged = () => {
    const latestVoices = window.speechSynthesis.getVoices();

    latestVoices.forEach((voice) => {
      if (!availableVoices.includes(voice)) {
        availableVoices.push(voice);
      }
    });
  };

  // Find voice by language locale "en-US"
  let englishVoice = availableVoices.find((voice) => voice.lang === "en-US");

  // If not then select the first voice
  if (!englishVoice) {
    englishVoice = availableVoices[0];
  }

  // new SpeechSynthesisUtterance object
  let utter = new SpeechSynthesisUtterance();
  utter.rate = 0.1;
  utter.pitch = 1;
  utter.volume = 1;
  utter.text = text;
  utter.voice = englishVoice;
  utter.onend = () => {
    generateWordButton.removeAttribute("disabled");
    spellButton.textContent = "Spell";
    spellButton.removeAttribute("disabled");
  };

  // Speak
  window.speechSynthesis.speak(utter);
}

if ("webkitSpeechRecognition" in window) {
  // Initialize webkitSpeechRecognition
  let speechRecognition = new webkitSpeechRecognition();

  // String for the Final Transcript
  let final_transcript = "";

  // Set the properties for the Speech Recognition object
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  // speechRecognition.lang = document.querySelector("#select_dialect").value;

  // Callback Function for the onStart Event
  speechRecognition.onstart = () => {
    // Show the Status Element
    listenBtn.textContent = "Listening";
  };
  // speechRecognition.onerror = () => {
  //   // Hide the Status Element
  //   document.querySelector("#status").style.display = "none";
  // };
  speechRecognition.onend = () => {
    // Hide the Status Element
    speechRecognition.stop();
    listenBtn.textContent = "Listen";
  };

  speechRecognition.onresult = (event) => {
    // Create the interim transcript string locally because we don't want it to persist like final transcript
    let interim_transcript = "";

    // Loop through the results from the speech recognition object.
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    // Set the Final transcript and Interim transcript.
    wordInput.value = final_transcript;
  };

  // Set the onClick property of the start button
  listenBtn.onclick = () => {
    // Start the Speech Recognition
    speechRecognition.start();
  };
} else {
  console.log("Speech Recognition Not Available");
}
