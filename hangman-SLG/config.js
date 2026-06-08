const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 960,
  height: 640,
  backgroundColor: "#1b4332",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 240,
    },
    max: {
      width: 1280,
      height: 860,
    },
  },
  scene: [window.TitleScene, window.GameScene, window.GameOverScene],
};

new Phaser.Game(config);
