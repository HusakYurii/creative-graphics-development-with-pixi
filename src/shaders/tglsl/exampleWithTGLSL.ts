import { Filter, Ticker, Graphics } from 'pixi.js';
import type { ShaderExampleDependencies } from '../interfaces';
import fragmentShader from './fragmentShader.tglsl';
import vertexShader from './vertexShader.tglsl';

export const showExampleTGLSLShader = (props: ShaderExampleDependencies) => {

    const filter = new Filter(vertexShader, fragmentShader, {
        uTime: 0,
    });

    const update = (ticekr: Ticker) => {
        filter.uniforms.uTime = ticekr.lastTime / 1000;
    };

    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(-400, -400, 800, 800);
    graphics.endFill();

    graphics.filters = [filter];

    props.app.stage.addChild(graphics);
    props.onUpdate(update);
}
