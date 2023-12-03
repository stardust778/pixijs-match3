import { App } from "../system/App";
import { Board } from "./Board";
import { Tile } from "./Tile";

export class CombinationManager {
    board: Board;

    constructor(board: Board) {
        this.board = board;
    }

    getMatches() {
        const result: (Tile | null)[][] = [];

        this.board.fields.forEach(checkingField => {
            App.config.combinationRules.forEach(rule => {
                const matches = [checkingField.tile];

                rule.forEach(position => {
                    const row = checkingField.row + position.row;
                    const col = checkingField.col + position.col;
                    const comparingField = this.board.getField(row, col);
                    if (
                        comparingField && 
                        comparingField.tile &&
                        comparingField.tile.color === checkingField.tile?.color) {
                        matches.push(comparingField.tile);
                    }
                });

                if (matches.length === rule.length + 1) {
                    result.push(matches);
                }
            });
        });

        return result;
    }
}