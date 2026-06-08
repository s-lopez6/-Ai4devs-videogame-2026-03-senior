class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const { width, height } = this.scale;
    this.input.topOnly = true;

    this.add.rectangle(width * 0.5, height * 0.5, width, height, 0xf4a261);
    this.add.circle(width * 0.87, height * 0.17, Math.min(width, height) * 0.25, 0xe9c46a, 0.5);
    this.add.circle(width * 0.13, height * 0.81, Math.min(width, height) * 0.31, 0x2a9d8f, 0.35);

    this.add
      .text(width * 0.5, height * 0.27, "HANGMAN", {
        fontFamily: "Georgia",
        fontSize: `${Math.round(Math.min(80, width * 0.1))}px`,
        color: "#1d3557",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(width * 0.5, height * 0.38, "Guess letters before the drawing is complete", {
        fontFamily: "Trebuchet MS",
        fontSize: `${Math.round(Math.min(30, width * 0.035))}px`,
        color: "#0f2d44",
      })
      .setOrigin(0.5);

    const startButton = this.createButton(width * 0.5, height * 0.56, 300, 78, "START GAME", () => {
      this.scene.start("GameScene");
    });

    this.tweens.add({
      targets: startButton.background,
      alpha: { from: 0.85, to: 1 },
      yoyo: true,
      repeat: -1,
      duration: 950,
      ease: "Sine.InOut",
    });

    this.add
      .text(width * 0.5, height * 0.69, "Use keyboard A-Z or click letters", {
        fontFamily: "Trebuchet MS",
        fontSize: `${Math.round(Math.min(24, width * 0.03))}px`,
        color: "#16324f",
      })
      .setOrigin(0.5);
  }

  createButton(x, y, width, height, label, onClick) {
    const background = this.add
      .rectangle(x, y, width, height, 0x264653)
      .setStrokeStyle(3, 0xe9c46a);

    const text = this.add
      .text(x, y, label, {
        fontFamily: "Trebuchet MS",
        fontSize: "30px",
        color: "#f1faee",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    background.setInteractive({ useHandCursor: true });

    background.on("pointerover", () => {
      background.setFillStyle(0x2a9d8f);
    });

    background.on("pointerout", () => {
      background.setFillStyle(0x264653);
    });

    background.on("pointerup", onClick);
    return { background, text };
  }
}

window.TitleScene = TitleScene;
