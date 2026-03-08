import { Filter, defaultVertex, Ticker, Graphics } from 'pixi.js';
import type { ShaderExampleDependencies } from './interfaces';

export const showExampleShader = (props: ShaderExampleDependencies) => {

    // basically it is a copy of defaultVertex
    const vertexSrc = defaultVertex;

    const fragmentSrc = `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float uTime;

        void main() {
            float b = (cos(uTime) + 1.0) * 0.5; // Normalize to 0-1 range
            gl_FragColor = vec4(vTextureCoord.r, vTextureCoord.g, b, 1.0);
        }
    `;


    const filter = new Filter(vertexSrc, fragmentSrc, {
        uTime: 0
    });

    const update = (ticekr: Ticker) => {
        filter.uniforms.uTime = ticekr.lastTime / 1000; // Convert to seconds
    };

    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(-400, -400, 800, 800);
    graphics.endFill();

    graphics.filters = [filter];

    props.app.stage.addChild(graphics);
    props.onUpdate(update);
}
