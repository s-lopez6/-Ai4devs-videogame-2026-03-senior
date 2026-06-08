class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.won = Boolean(data.won);
    this.word = data.word ?? "";
  }

  create() {
    const { width, height } = this.scale;
    this.input.topOnly = true;

    this.add.rectangle(width * 0.5, height * 0.5, width, height, this.won ? 0x2a9d8f : 0xe76f51);
    this.add.circle(width * 0.16, height * 0.22, Math.min(width, height) * 0.26, 0xe9c46a, 0.35);
    this.add.circle(width * 0.86, height * 0.8, Math.min(width, height) * 0.31, 0x264653, 0.26);

    this.add
      .text(width * 0.5, height * 0.3, this.won ? "You Win!" : "Game Over!", {
        fontFamily: "Georgia",
        fontSize: `${Math.round(Math.min(80, width * 0.1))}px`,
        fontStyle: "bold",
        color: "#f1faee",
      })
      .setOrigin(0.5);

    this.add
      .text(width * 0.5, height * 0.44, `Word: ${this.word}`, {
        fontFamily: "Trebuchet MS",
        fontSize: `${Math.round(Math.min(42, width * 0.05))}px`,
        color: "#f1faee",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.createButton(width * 0.5, height * 0.61, 300, 76, "PLAY AGAIN", () => {
      this.scene.start("GameScene");
    });

    this.createButton(width * 0.5, height * 0.74, 300, 68, "TITLE SCREEN", () => {
      this.scene.start("TitleScene");
    });
  }

  createButton(x, y, width, height, label, onClick) {
    const background = this.add
      .rectangle(x, y, width, height, 0x1d3557)
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
      background.setFillStyle(0x264653);
    });

    background.on("pointerout", () => {
      background.setFillStyle(0x1d3557);
    });

    background.on("pointerup", onClick);
  }
}

window.GameOverScene = GameOverScene;
