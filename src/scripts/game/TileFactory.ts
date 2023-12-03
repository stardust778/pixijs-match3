import { App } from "../system/App";
import { Tools } from "../system/Tool";
import { Tile } from "./Tile";

/**
 * 生成随机颜色的磁铁
 * **/
export class TileFactory {
    static generate() {
        const color: any = App.config.tilesColors[Tools.randomNumber(0, App.config.tilesColors.length - 1)];
        return new Tile(color);
    }
}