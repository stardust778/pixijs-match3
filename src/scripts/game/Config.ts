import { Tools } from "../system/Tool";
import { Game } from "./Game";

/**
 * require.context(directory, useSubdirectories = false, regExp)
 * @param
 * directory 要搜索的目录
 * useSubdirectories 是否搜索子目录
 * regExp 匹配文件的正则表达式
 * @return
 * resolve 函数，返回请求被解析后得到的模块id
 * keys 函数，返回上下文模块相对路径数组
 * id 上下文模块id
 * **/

export const Config = {
    /**
     * 加载指定目录中所有以 .mp3、.png、.jpg 或 .jpeg 结尾的文件
     * **/
    loader: Tools.massiveRequire(require['context']('./../../assets/', true, /\.(mp3|png|jpe?g)$/)),
    startScene: Game,
    board: {
        rows: 8,
        cols: 8
    },
    tilesColors: ['blue', 'green', 'orange', 'red', 'pink', 'yellow'],
    combinationRules: [[
        {col: 1, row: 0}, {col: 2, row: 0}
    ], [
        {col: 0, row: 1}, {col: 0, row: 2}
    ]]
};

export type ConfigType = typeof Config;