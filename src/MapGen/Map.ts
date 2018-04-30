/*
Pieces of this algorithm derived from
http://perplexingtech.weebly.com/game-dev-blog/a-random-dungeon-generator-for-phaserjs
which is based off of a python tutorial from
www.roguebasin.com

Also bits were inspired/taken from
https://gamedevelopment.tutsplus.com/tutorials/create-a-procedurally-generated-dungeon-cave-system--gamedev-10099 (haxe)
*/
import Room from './Room';
import Item from '../sprites/item';

export default class Map {

    protected game: Phaser.Game;

    floors: Phaser.Group;
    walls: Phaser.Group;
    items: Phaser.Group;

    protected floorImage: string;
    protected wallImage: string;

    protected minRoomSize: number;
    protected maxRoomSize: number;
    protected maxRoomNumber: number;
    protected tileSize: number;

    protected numRooms: number = 0;
    protected numTiles: number = 0;
    roomArray: Array<Room>;

    stairCase: Phaser.Sprite;

    constructor(game: Phaser.Game, floorImage: string, wallImage: string,
        minRoomSize: number, maxRoomSize: number, MaxRoomNumber: number){

        this.game = game;
        this.floorImage = floorImage;
        this.wallImage = wallImage;
        this.minRoomSize = minRoomSize;
        this.maxRoomSize = maxRoomSize;
        this.maxRoomNumber = MaxRoomNumber;
        this.tileSize = 64;
        this.roomArray = [];

    }

    //makes the starting map (walls and floors)
    generateMap(genStartRoom?: boolean, genLastRoom?: boolean){

        this.floors = this.game.add.group();
        this.walls = this.game.add.group();
        this.items = this.game.add.group();
        this.walls.enableBody = true;

        let lastRoomCoords = { x: 0, y: 0 };

        //Create walls across the whole world
        for (let y=0; y<this.game.world.height; y+=this.tileSize) {
            for (let x=0; x<this.game.world.width; x+=this.tileSize) {
                let wall = this.walls.create(x, y, this.wallImage);
                wall.body.immovable = true;
            }
        }

        //Creating the rooms
        for (let r=0; r<this.maxRoomNumber;) {

            let w: number = 0;
            let h: number = 0;
            let x: number = 0;
            let y: number = 0;
            let intersected: boolean = false;


            //Generate the first room so that nothing overlaps it
            if (genStartRoom && r === 0){
                w = this.maxRoomSize * this.tileSize;
                h = this.maxRoomSize * this.tileSize;
                
                //needs to be a multiple of whatever the floor px size is (tilesize)
                x = 4 * this.tileSize;
                y = 4 * this.tileSize;
            
            //Generate random coords for the other rooms
            } else {
                w = this.getRandom(this.minRoomSize, this.maxRoomSize) * this.tileSize;
                h = this.getRandom(this.minRoomSize, this.maxRoomSize) * this.tileSize;
    
                x = this.getRandom(1, ((this.game.world.width) / this.tileSize) - (w/this.tileSize + 1)) * this.tileSize;
                y = this.getRandom(1, ((this.game.world.height) / this.tileSize) - (w/this.tileSize + 1)) * this.tileSize;

        
            }
            
            //Create the room then add it to rooms array so it can be referenced later
            let room = new Room(x, y, w, h);
            for(let i=0; i < this.roomArray.length; i++){
                if(!intersected && room.intersects(this.roomArray[i], 8)){
                    intersected = true;
                }
            }
            if(!intersected){
                this.createRoom(x, x+w, y, y+h);
                this.roomArray.push(room);
                r++;

                if (this.numRooms !== 0) {            
                    let new_x = Phaser.Math.snapToFloor(x + (w/2), this.tileSize);
                    let new_y = Phaser.Math.snapToFloor(y + (h/2), this.tileSize);
        
                    let prev_x = Phaser.Math.snapToFloor(lastRoomCoords.x, this.tileSize);
                    let prev_y = Phaser.Math.snapToFloor(lastRoomCoords.y, this.tileSize);
                    
                    this.createHTunnel(prev_x, new_x, prev_y);
                    this.createVTunnel(prev_y, new_y, new_x);
                } 
                
                lastRoomCoords = { x: x + (w/2), y: y + (h/2) };
                this.numRooms++;
            }
            console.log('looped');
    
        }

    }

    //Get a random number
    protected getRandom(min: number, max: number){
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //Create single floor tile and add it to floor group
    protected createFloor(x: number, y: number){
        let fl = this.floors.create(x, y, this.floorImage);
        this.game.physics.arcade.enable(fl);
        this.game.physics.arcade.overlap(fl, this.walls, function(floor, wall) {
            wall.destroy();
        });
    }
    //Using the floor function to carve a whole room of floor tiles
    protected createRoom(x1: number, x2: number, y1: number, y2: number) {
        for (let x = x1; x<x2; x+=this.tileSize) {
            for (let y = y1; y<y2; y+=this.tileSize) {
                this.createFloor(x, y);
            }
        } 
    }
    //Create a Horizontal tunnel to connect two rooms
    protected createHTunnel(x1: number, x2: number, y: number) {
        let min = Math.min(x1, x2);
        let max = Math.max(x1, x2);
        for (let x = min; x<max+(this.tileSize/2); x+=(this.tileSize/2)) {
            this.createFloor(x, y);
        } 
    }
    //Create a Vertical tunnel to connect two rooms
    protected createVTunnel(y1: number, y2: number, x:number) {
        let min = Math.min(y1, y2);
        let max = Math.max(y1, y2);
        for (let y = min; y<max+(this.tileSize / 2); y+=(this.tileSize/2)) {
            this.createFloor(x, y);
        } 
    }

    //create a staircase in the farthest room from the start
    createStaircase(){
        let dist: number = 0;
        let stairRoom: Room;

        for(let i = 1; i < this.roomArray.length; i++){
            let tempDist = Phaser.Math.distance(this.roomArray[0].centerX, this.roomArray[0].centerY, this.roomArray[i].centerX, this.roomArray[i].centerY);
            if(tempDist > dist){
                dist = tempDist;
                stairRoom = this.roomArray[i];
            }
        }
        this.stairCase = this.game.add.sprite(stairRoom.centerX, stairRoom.centerY, 'stairDown');
        this.stairCase.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.stairCase);
        this.stairCase.body.immovable = true;
    }

    createItems(){
        //create an item randomly in each room that is not the first or second
        for(let i = 1; i < this.roomArray.length; i++){
            //get random offset
            let offsetX = this.getRandom(-60, 60);
            let offsetY = this.getRandom(-60, 60);

            let itemType: number = this.getRandom(0,2);
            let item: Item;

            //place objects in center with offset
            switch (itemType){
                
                case 0: //gold
                    item = new Item(this.game, this.roomArray[i].centerX + offsetX, this.roomArray[i].centerY + offsetY, 'chest', {gold: 10});
                    break;
                
                case 1: //potion
                    item = new Item(this.game, this.roomArray[i].centerX + offsetX, this.roomArray[i].centerY + offsetY, 'potion', {health: 10});
                    break;
                default:
            }

            this.items.add(item);
        }
    }
}
