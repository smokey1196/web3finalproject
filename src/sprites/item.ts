export default class Item extends Phaser.Sprite{
    //data lets properties for items be created when constructed so that it is modular
    data: any = {};
    constructor(game: Phaser.Game, x: number, y: number, key: string, data: any){
        super(game, x, y, key);
        this.data = data;

        this.game.physics.arcade.enable(this);
        this.body.immovable = true;
        this.anchor.setTo(0.5);
    }
}