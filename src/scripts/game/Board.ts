import * as PIXI from 'pixi.js';
import { App } from '../system/App';
import { Field } from './Field';
import { Tile } from './Tile';
import { TileFactory } from './TileFactory';

export class Board {
    container: PIXI.Container;
    fields: Field[];
    rows: number;
    cols: number;
    fieldSize: number;
    width: number;
    height: number;

    constructor() {
        this.container = new PIXI.Container();
        this.fields = [];
        this.rows = App.config.board.rows;
        this.cols = App.config.board.cols;
        this.create();
        this.adjustPosition();
    }

    create() {
        // 创建消消乐棋盘
        this.createFields();
        // 常见消消块
        this.createTiles();
    }

    createTiles() {
        this.fields.forEach(field => this.createTile(field));
    }

    createTile(field: Field) {
        // 创建随机颜色的磁铁
        const tile = TileFactory.generate();
        // 设置磁铁的位置
        field.setTile(tile);
        this.container.addChild(tile.sprite);

           // 创建磁铁的移动交互
        tile.sprite.interactive = true;
        tile.sprite.on('pointerdown', () => {
            // 发送移动磁铁事件
            this.container.emit('tile-touch-start', tile);
        });
        return tile;
    }

    createFields() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createField(row, col);
            }
        }
    }

    createField(row: number, col: number) {
        const field = new Field(row, col);
        this.fields.push(field);
        this.container.addChild(field.sprite);
    }

    adjustPosition() {
        // 调整大小
        this.fieldSize = this.fields[0].sprite.width;
        this.width = this.cols * this.fieldSize;
        this.height = this.rows * this.fieldSize;
        // 调整位置
        this.container.x = (window.innerWidth - this.width) / 2 + this.fieldSize / 2;
        this.container.y = (window.innerHeight - this.height) / 2 + this.fieldSize / 2;
    }

    swap(tile1: Tile, tile2: Tile) {
        const tileField1 = tile1.field;
        const tileField2 = tile2.field;

        if (tileField1) {
            tileField1.tile = tile2;
            tile2.field = tileField1;
        }
      
        if (tileField2) {
            tileField2.tile = tile1;
            tile1.field = tileField2;
        }
    }

    getField(row: number, col: number) {
        return this.fields.find(field => field.row === row && field.col === col);
    }
}