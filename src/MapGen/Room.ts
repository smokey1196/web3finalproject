export default class Room {

    x1: number;
    y1: number;
    x2: number;
    y2: number;

    centerX: number;
    centerY: number;


    constructor(x1: number, y1: number, w: number, h: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x1 + w;
        this.y2 = y1 + h;

        this.centerX = (this.x1 + this.x2) / 2;
        this.centerY = (this.y1 + this.y2) / 2;
    }
}