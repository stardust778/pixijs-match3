import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { Loader } from './Loader';
import { Game } from '../game/Game';
import type { ConfigType } from '../game/Config';

// 程序主类
class Application {
    config: ConfigType;
    app: PIXI.Application;
    loader: Loader;
    scene: Game;

    run(config: ConfigType) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;
        this.app = new PIXI.Application({ resizeTo: window });
        document.body.appendChild(this.app.view);

        this.loader = new Loader(this.app.loader, this.config);
        this.loader.preload().then(() => this.start());
    }
    // 启动游戏
    start() {
        // 实例Game
        this.scene = new this.config['startScene']();
        this.app.stage.addChild(this.scene.container);
    }

    // 获取精灵纹理
    res(key: string) {
        return this.loader.resources[key].texture;
    }

    // 生成精灵
    sprite(key: string) {
        return new PIXI.Sprite(this.res(key));
    }
}

export const App = new Application();