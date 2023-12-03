import * as PIXI from 'pixi.js';
import { ConfigType } from '../game/Config';

// 资源加载器
export class Loader {
    loader: PIXI.Loader;
    config: ConfigType;
    resources: any;

    constructor(loader: PIXI.Loader, config: ConfigType) {
        this.loader = loader;
        this.config = config;
        this.resources = {};
    }
    /**
     * 资源预加载
     * **/
    preload() {
        for (const asset of this.config.loader) {
            let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
            key = key.substring(0, key.indexOf('.'));
            if (asset.key.indexOf(".png") !== -1 || asset.key.indexOf(".jpg") !== -1) {
                this.loader.add(key, asset.data.default);
            }
        }
        return new Promise(resolve => {
            /**
             * 回调函数接受两个参数：
             * 第一个参数: loader对象本身
             * 第二个参数: 加载的资源
             * **/
            this.loader.load((loader, resources) => {
                this.resources = resources;
                resolve(null);
            })
        })
    }
}