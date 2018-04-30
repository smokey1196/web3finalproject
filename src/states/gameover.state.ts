'use strict';
/** Imports */
import State from './state';

// The gameover state
export default class GameOverState extends State {
  create(): void {
    this.game.world.alpha = 1;
    console.log('test');
    let gameOverStyle = {font: '26px Arial', fill: '#fff'};
    let gameOverText = this.game.add.text(this.game.camera.width / 2, this.game.camera.height / 2, 'Game Over!', gameOverStyle);
    gameOverText.fixedToCamera = true;
    gameOverText.anchor.setTo(0.5);

    let restartStyle = {font: '18px Arial', fill: '#fff'};
    let restartText = this.game.add.text(this.game.camera.width / 2, this.game.camera.height / 2 + 30, 'Press space to restart the game', restartStyle);
    restartText.fixedToCamera = true;
    restartText.anchor.setTo(0.5);

    //restart game on space down
    let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.restartGame, this, 0);
  }

  restartGame(){
    let level: number = 1;
    this.game.state.start('main', true, false, level);
  }
}
