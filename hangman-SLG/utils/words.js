const WORDS = [
  "javascript",
  "phaser",
  "hangman",
  "developer",
  "gaming",
  "keyboard",
  "frontend",
  "canvas",
  "browser",
  "logic",
];

const getRandomWord = () => {
  const index = Math.floor(Math.random() * WORDS.length);
  return WORDS[index];
};

window.HangmanWords = {
  WORDS,
  getRandomWord,
};
