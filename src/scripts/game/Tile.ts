import * as PIXI from 'pixi.js';
import { App } from '../system/App';
import { Field } from './Field';
import { gsap } from 'gsap';
import type { TILE_COLOR } from '../../const';

export class Tile {
    color: TILE_COLOR
    sprite: PIXI.Sprite;
    field: Field | null;

    constructor(color: TILE_COLOR) {
        this.color = color;
        this.sprite = App.sprite(this.color);
        this.field = null;
        this.sprite.anchor.set(0.5);
    }

    setPostion(position: { x: number, y: number }) {
        this.sprite.x = position.x;
        this.sprite.y = position.y;
    }

    moveTo(
        position: { x: number, y: number }, 
        duration: number, 
        delay?: number, 
        ease?: string
    ) {
        return new Promise(resolve => {
            gsap.to(this.sprite, {
                duration,
                delay,
                ease,
                pixi: {
                    x: position.x,
                    y: position.y
                },
                onComplete: () => {
                    resolve(null);
                }
            });
        });
    }

    /**
     * 检查要交换的图块是否相邻
     * 检查的图块模数与当前图块模数之间的行或列之间的差必须等于 1
     * **/
    isNeighbour(tile: Tile) {
        if (this.field && tile.field) {
            return Math.abs(this.field.row - tile.field.row) + Math.abs(this.field.col - tile.field.col) === 1;

        }
    }

    remove() {
        if (!this.sprite) {
            return;
        }

        this.sprite.destroy();
        this.sprite = new PIXI.Sprite();

        if (this.field) {
            this.field.tile = null;
            this.field = null;
        }
    }

    // 图块掉落
    fallDownTo(position: { x: number, y: number }, delay?: number) {
        return this.moveTo(position, 0.5, delay, "bounce.out");
    }
}