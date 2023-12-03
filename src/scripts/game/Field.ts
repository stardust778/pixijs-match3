import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Tile } from './Tile';

export class Field {
    row: number;
    col: number;
    sprite: PIXI.Sprite;
    selected: PIXI.Sprite;
    tile: Tile | null;

    constructor(row: number, col: number) {
        this.row = row;  // 行
        this.col = col;  // 列

        this.sprite = App.sprite('field');
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        // 设置精灵的锚点为居中点，默认锚点位于左上角
        this.sprite.anchor.set(0.5);

        this.selected = App.sprite('field-selected');
        this.sprite.addChild(this.selected);
        this.selected.visible = false;
        this.selected.anchor.set(0.5);
    }

    get position() {
        return {
            x: this.col * this.sprite.width,
            y: this.row * this.sprite.height
        }
    }

    setTile(tile: Tile) {
        this.tile = tile;
        tile.field = this;
        tile.setPostion(this.position);
    }

    unselect() {
        this.selected.visible = false;
    }

    select() {
        this.selected.visible = true;
    }
}