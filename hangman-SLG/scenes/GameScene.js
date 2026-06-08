class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.maxWrongGuesses = 6;
  }

  create() {
    const { width, height } = this.scale;
    this.viewport = { width, height };
    this.word = window.HangmanWords.getRandomWord().toUpperCase();
    this.guessedLetters = new Set();
    this.wrongGuesses = 0;
    this.isRoundOver = false;
    this.letterButtons = new Map();
    this.input.topOnly = true;

    this.createBackground();
    this.createHeader();
    this.drawGallows();
    this.createWordDisplay();
    this.createWrongGuessDisplay();
    this.createResetButton();
    this.createAlphabetButtons();

    this.keyHandler = (event) => {
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        this.handleGuess(key);
      }
    };

    this.input.keyboard.on("keydown", this.keyHandler);
    this.events.once("shutdown", () => {
      this.input.keyboard.off("keydown", this.keyHandler);
    });
  }

  createBackground() {
    const { width, height } = this.viewport;
    this.add.rectangle(width * 0.5, height * 0.5, width, height, 0xe9c46a);
    this.add.circle(width * 0.87, height * 0.14, Math.min(width, height) * 0.2, 0xf4a261, 0.45);
    this.add.circle(width * 0.13, height * 0.92, Math.min(width, height) * 0.24, 0x2a9d8f, 0.35);
  }

  createHeader() {
    const { width, height } = this.viewport;
    this.add
      .text(width * 0.5, height * 0.07, "Hangman", {
        fontFamily: "Georgia",
        fontSize: `${Math.round(Math.min(54, width * 0.06))}px`,
        fontStyle: "bold",
        color: "#1d3557",
      })
      .setOrigin(0.5);
  }

  createWordDisplay() {
    const { width, height } = this.viewport;
    this.wordText = this.add
      .text(width * 0.5, height * 0.17, this.getMaskedWord(), {
        fontFamily: "Courier New",
        fontSize: `${Math.round(Math.min(52, width * 0.055))}px`,
        color: "#0f2d44",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  createWrongGuessDisplay() {
    const { width, height } = this.viewport;
    this.remainingText = this.add
      .text(width * 0.72, height * 0.63, `Incorrect guesses left: ${this.maxWrongGuesses}`, {
        fontFamily: "Trebuchet MS",
        fontSize: `${Math.round(Math.min(30, width * 0.03))}px`,
        color: "#1d3557",
      })
      .setOrigin(0.5);
  }

  createResetButton() {
    const { width, height } = this.viewport;
    const button = this.createButton(width * 0.75, height * 0.72, 230, 58, "RESET GAME", () => {
      this.scene.restart();
    });

    this.tweens.add({
      targets: button.background,
      alpha: { from: 0.86, to: 1 },
      yoyo: true,
      repeat: -1,
      duration: 900,
      ease: "Sine.InOut",
    });
  }

  createAlphabetButtons() {
    const { width, height } = this.viewport;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const marginX = 16;
    const gapX = 8;
    const gapY = 10;
    const columns = 13;
    const availableRowWidth = width - marginX * 2 - gapX * (columns - 1);
    const buttonWidth = Math.max(30, Math.min(54, Math.floor(availableRowWidth / columns)));
    const buttonHeight = Math.max(36, Math.floor(buttonWidth * 0.9));
    const totalRowWidth = columns * buttonWidth + (columns - 1) * gapX;
    const startX = (width - totalRowWidth) / 2 + buttonWidth / 2;
    const startY = height - (buttonHeight * 2 + gapY + 24);

    letters.forEach((letter, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = startX + col * (buttonWidth + gapX);
      const y = startY + row * (buttonHeight + gapY);
      const button = this.createLetterButton(x, y, buttonWidth, buttonHeight, letter);
      this.letterButtons.set(letter, button);
    });
  }

  createLetterButton(x, y, width, height, letter) {
    const background = this.add
      .rectangle(x, y, width, height, 0x264653)
      .setStrokeStyle(2, 0xe9c46a);

    const text = this.add
      .text(x, y, letter, {
        fontFamily: "Trebuchet MS",
        fontSize: `${Math.round(Math.min(26, width * 0.55))}px`,
        color: "#f1faee",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    background.setInteractive({ useHandCursor: true });

    background.on("pointerover", () => {
      if (background.input && background.input.enabled) {
        background.setFillStyle(0x2a9d8f);
      }
    });

    background.on("pointerout", () => {
      if (background.input && background.input.enabled) {
        background.setFillStyle(0x264653);
      }
    });

    background.on("pointerup", () => {
      this.handleGuess(letter);
    });

    return { background, text };
  }

  createButton(x, y, width, height, label, onClick) {
    const background = this.add
      .rectangle(x, y, width, height, 0x264653)
      .setStrokeStyle(2, 0xe9c46a);

    const text = this.add
      .text(x, y, label, {
        fontFamily: "Trebuchet MS",
        fontSize: "30px",
        color: "#f1faee",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    background.setInteractive({ useHandCursor: true });

    background.on("pointerover", () => background.setFillStyle(0x2a9d8f));
    background.on("pointerout", () => background.setFillStyle(0x264653));
    background.on("pointerup", onClick);

    return { background, text };
  }

  getMaskedWord() {
    return this.word
      .split("")
      .map((character) => (this.guessedLetters.has(character) ? character : "_"))
      .join(" ");
  }

  handleGuess(letter) {
    if (this.isRoundOver || this.guessedLetters.has(letter)) {
      return;
    }

    this.guessedLetters.add(letter);
    this.disableLetter(letter);

    if (this.word.includes(letter)) {
      this.wordText.setText(this.getMaskedWord());

      if (this.isWordSolved()) {
        this.finishRound(true);
      }
      return;
    }

    this.wrongGuesses += 1;
    this.drawHangmanPart(this.wrongGuesses);
    this.remainingText.setText(
      `Incorrect guesses left: ${this.maxWrongGuesses - this.wrongGuesses}`
    );

    if (this.wrongGuesses >= this.maxWrongGuesses) {
      this.finishRound(false);
    }
  }

  disableLetter(letter) {
    const button = this.letterButtons.get(letter);
    if (!button) {
      return;
    }

    button.background.disableInteractive();
    button.background.setFillStyle(0x8d99ae);
    button.text.setColor("#f8f9fa");
    button.background.setAlpha(0.55);
    button.text.setAlpha(0.75);
  }

  isWordSolved() {
    return this.word.split("").every((character) => this.guessedLetters.has(character));
  }

  finishRound(playerWon) {
    this.isRoundOver = true;

    this.time.delayedCall(420, () => {
      this.scene.start("GameOverScene", {
        won: playerWon,
        word: this.word,
      });
    });
  }

  drawGallows() {
    const { width, height } = this.viewport;
    const baseY = height * 0.58;
    const baseStartX = width * 0.36;
    const baseEndX = width * 0.68;
    const poleX = width * 0.42;
    const topY = height * 0.25;
    const ropeX = width * 0.6;

    this.hangmanPoints = {
      headX: ropeX,
      headY: topY + height * 0.04,
      torsoTopY: topY + height * 0.085,
      torsoBottomY: topY + height * 0.22,
      armY: topY + height * 0.12,
      legY: topY + height * 0.22,
      armDeltaX: width * 0.045,
      armDeltaY: height * 0.05,
      legDeltaX: width * 0.038,
      legDeltaY: height * 0.08,
      headRadius: Math.min(width, height) * 0.03,
    };

    this.gallowsGraphics = this.add.graphics();
    this.gallowsGraphics.lineStyle(8, 0x3a3a3a, 1);

    this.gallowsGraphics.beginPath();
    this.gallowsGraphics.moveTo(baseStartX, baseY);
    this.gallowsGraphics.lineTo(baseEndX, baseY);
    this.gallowsGraphics.moveTo(poleX, baseY);
    this.gallowsGraphics.lineTo(poleX, topY);
    this.gallowsGraphics.lineTo(ropeX, topY);
    this.gallowsGraphics.lineTo(ropeX, topY + height * 0.06);
    this.gallowsGraphics.strokePath();

    this.hangmanGraphics = this.add.graphics();
    this.hangmanGraphics.lineStyle(6, 0x111111, 1);
  }

  drawHangmanPart(step) {
    const p = this.hangmanPoints;

    switch (step) {
      case 1:
        this.hangmanGraphics.strokeCircle(p.headX, p.headY, p.headRadius);
        break;
      case 2:
        this.hangmanGraphics.beginPath();
        this.hangmanGraphics.moveTo(p.headX, p.torsoTopY);
        this.hangmanGraphics.lineTo(p.headX, p.torsoBottomY);
        this.hangmanGraphics.strokePath();
        break;
      case 3:
        this.hangmanGraphics.beginPath();
        this.hangmanGraphics.moveTo(p.headX, p.armY);
        this.hangmanGraphics.lineTo(p.headX - p.armDeltaX, p.armY + p.armDeltaY);
        this.hangmanGraphics.strokePath();
        break;
      case 4:
        this.hangmanGraphics.beginPath();
        this.hangmanGraphics.moveTo(p.headX, p.armY);
        this.hangmanGraphics.lineTo(p.headX + p.armDeltaX, p.armY + p.armDeltaY);
        this.hangmanGraphics.strokePath();
        break;
      case 5:
        this.hangmanGraphics.beginPath();
        this.hangmanGraphics.moveTo(p.headX, p.legY);
        this.hangmanGraphics.lineTo(p.headX - p.legDeltaX, p.legY + p.legDeltaY);
        this.hangmanGraphics.strokePath();
        break;
      case 6:
        this.hangmanGraphics.beginPath();
        this.hangmanGraphics.moveTo(p.headX, p.legY);
        this.hangmanGraphics.lineTo(p.headX + p.legDeltaX, p.legY + p.legDeltaY);
        this.hangmanGraphics.strokePath();
        break;
      default:
        break;
    }
  }
}

window.GameScene = GameScene;
