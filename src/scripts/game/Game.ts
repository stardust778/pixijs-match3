import * as PIXI from 'pixi.js';
import { App } from '../system/App';
import { Board } from './Board';
import { Tile } from './Tile';
import { Field } from './Field';
import { CombinationManager } from './CombinationManager';

export class Game {
    container: PIXI.Container;
    board: Board;
    combinationManager: CombinationManager;
    bg: PIXI.Sprite;
    disabled: boolean;
    selectedTile: Tile | null;

    constructor() {
        this.container = new PIXI.Container();
        this.createBackground();

        this.board = new Board()
        this.container.addChild(this.board.container);

        this.board.container.on('tile-touch-start', (tile: Tile) => {
            this.onTileClick(tile)
        });


        this.combinationManager = new CombinationManager(this.board);
        // 一开始就收集组合
        this.removeStartMatches();
    }

    // 创建背景 
    createBackground() {
        this.bg = App.sprite('bg');
        this.bg.width = window.innerWidth;
        this.bg.height =  window.innerWidth;
        this.container.addChild(this.bg);
    }

    /**
     * 移动图块有三种情况：
     * 1. 如果没有选择图块，则是选择要移动的图块
     * 2. 如果已有选择的图块，并且它位于当前选择的图块旁边，则交换图块
     * 3. 如果已有选择的图块，但它不在当前选择的图块旁边，则是重新选择图块
     * **/
    onTileClick(tile: Tile) {
        if (this.disabled) {
            return;
        }

        if (this.selectedTile) {
            if (!this.selectedTile.isNeighbour(tile)) {
                this.clearSelection();
                this.selectTile(tile);
            } else {
                // 选择新的磁铁或着做磁铁的交换
                this.swap(this.selectedTile, tile);
            }
        } else {
            this.selectTile(tile);
        }
    }

    // 选择图块
    selectTile(tile: Tile) {
        this.selectedTile = tile;
        this.selectedTile.field?.select();
    }

    // 交互图块
    swap(selectedTile: Tile, tile: Tile, reverse?: boolean) {
        // 当动画已经运行时，锁定板块
        this.disabled = true;

        // 隐藏 selectedTile 对象中的fieldSelect图像
        this.clearSelection();

        // 将选定的瓷砖精灵放置在比瓷砖精灵高层的位置
        selectedTile.sprite.zIndex = 2;

        // 将选定的磁块移动到旁边磁块位置
        tile.field && selectedTile.moveTo(tile.field.position, 0.2);


        // 旁边的磁块移动到被选中的磁块位置
        selectedTile.field && tile.moveTo(selectedTile.field.position, 0.2).then(() => {
            this.board.swap(selectedTile, tile);

            // 交换后如果棋盘上没有符合条件的组合，需要交换回图块
            if (!reverse) {
                const matches = this.combinationManager.getMatches();
                if (matches.length > 0) {
                    this.processMatches(matches);
                } else {
                    this.swap(tile, selectedTile, true);
                }
            } else {
                // 解除锁定棋盘
                this.disabled = false;
            }
        });
    }

    // 清除已选择的图块
    clearSelection() {
        if (this.selectedTile) {
            this.selectedTile.field?.unselect();
            this.selectedTile = null;
        }
    }

    processMatches(matches: (Tile | null)[][]) {
        // 清除收集到的图块
        this.removeMatches(matches);
        // 掉落图块到棋盘
        this.processFallDown()
            .then(() => this.addTiles())
            .then(() => this.onFallDownOver());
    }

    removeMatches(matches: (Tile | null)[][]) {
        matches.forEach(match => {
            match.forEach(tile => {
                tile && tile.remove();
            });
        });
    }

    processFallDown() {
        return new Promise(resolve => {
            let completed = 0;
            let started = 0;

            // 从底行开始检查面板的所有字段
            for (let row = this.board.rows - 1; row >= 0; row--) {
                for (let col = this.board.cols - 1; col >= 0; col--) {
                    const field = this.board.getField(row, col);
                    // 如果没有图块时
                    if (field && !field.tile) {
                        ++started;

                        this.fallDownTo(field).then(() => {
                            ++completed;
                            if (completed >= started) {
                                resolve(null);
                            }
                        });
                    }
                }
            }
        });
    }

    fallDownTo(emptyField: Field) {
        for (let row = emptyField.row - 1; row >= 0; row--) {
            let fallingField = this.board.getField(row, emptyField.col);

            if (fallingField && fallingField.tile) {
                const fallingTile = fallingField.tile;
                fallingTile.field = emptyField;
                emptyField.tile = fallingTile;
                fallingField.tile = null;
                return fallingTile.fallDownTo(emptyField.position);
            }
        }

        return Promise.resolve();
    }

    // 创建新图块
    addTiles() {
        return new Promise(resolve => {
            // 获取棋盘上没有图块的棋盘位置
            const fields = this.board.fields.filter(field => field.tile === null);
            let total = fields.length;
            let completed = 0;

            fields.forEach(field => {
                // 创建新的图块
                const tile = this.board.createTile(field);
                // 将新图块放到棋盘的上方
                tile.sprite.y = -500;
                const delay = Math.random() * 2 / 10 + 0.3 / (field.row + 1);
                tile.fallDownTo(field.position, delay).then(() => {
                    ++completed;
                    if (completed >= total) {
                        resolve(null);
                    }
                });
            })
        });
    }

    /**
     * 新组合掉落后，可能会出现新的组合
     * 需要递归地使用processMatches，直到棋盘上没有组合
     * **/ 
    onFallDownOver() {
        const matches = this.combinationManager.getMatches();

        if (matches.length > 0) {
            this.processMatches(matches);
        } else {
            this.disabled = false;
        }
    }

    removeStartMatches() {
        let matches = this.combinationManager.getMatches();

        while(matches.length > 0) {
            this.removeMatches(matches);

            const fields = this.board.fields.filter(field => field.tile === null);
            fields.forEach(field => {
                this.board.createTile(field);
            });

            // 检查是否还有符合条件的组合
            matches = this.combinationManager.getMatches();
        }
    }
}