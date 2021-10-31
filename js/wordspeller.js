const wordspellerForm = document.getElementById('wordspeller-form');
const wordInput = document.getElementById('word-to-spell-input');
const generateWordButton = document.getElementById('generate-word-btn');
const spellButton = document.getElementById('spell-btn');
const formErrorParagraph = document.getElementById('form-error-paragraph');

wordspellerForm.addEventListener('submit', handleSpellWord);

function handleSpellWord(event) {
  event.preventDefault();
  formErrorParagraph.textContent = '';

  let word = wordInput.value;

  // Input Validation
  const wordRegex = /^[a-z]*$/gi;

  if (!wordRegex.test(word)) {
    formErrorParagraph.textContent =
      'Invalid characters, please enter a word without space e.g Height';

    return;
  }

  generateWordButton.setAttribute('disabled', 'true');
  spellButton.textContent = 'Spelling';
  spellButton.setAttribute('disabled', 'true');

  try {
    // Pronounce the word after spelling each letter
    spell(`${word.split('').join(' ')} ${word}`);
  } catch (err) {
    console.error(err);
    formErrorParagraph.textContent =
      'Sorry, Wordspeller cannot function well at this moment, this might an issue with your browser.';

    generateWordButton.removeAttribute('disabled');
    spellButton.textContent = 'Spell';
    spellButton.removeAttribute('disabled');
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
  let englishVoice = availableVoices.find((voice) => voice.lang === 'en-US');

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
    generateWordButton.removeAttribute('disabled');
    spellButton.textContent = 'Spell';
    spellButton.removeAttribute('disabled');
  };

  // Speak
  window.speechSynthesis.speak(utter);
}

const words = [
  'People',
  'Here',
  'White',
  'Spider',
  'After',
  'Food',
  'Generator',
  'School',
  'Cat',
  'Vehicle',
  'Media',
  'Planet',
  'Mercury',
  'Case',
  'Pencil',
  'Hand',
  'Kettle',
  'Dark',
];

generateWordButton.addEventListener('click', generateWord);

function generateWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  wordInput.value = words[randomIndex];
}

// Generate word on page load (at first, automatically)
generateWord();
