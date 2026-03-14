import { Filter, defaultVertex, Ticker, Assets, Sprite } from 'pixi.js';
import type { ShaderExampleDependencies } from '../interfaces';

export const showGrayscaleShader = async (props: ShaderExampleDependencies) => {

    const fragmentSrc = `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float uTime;

        void main(void) {
            vec4 color = texture2D(uSampler, vTextureCoord );   
            float value = (color.r + color.g + color.b) / 3.0;

            gl_FragColor = vec4(value, value, value, 1.0);
        }
    `;


    const filter = new Filter(defaultVertex, fragmentSrc, {
        uTime: 0
    });

    const update = (ticekr: Ticker) => {
        filter.uniforms.uTime = ticekr.lastTime / 1000; // Convert to seconds
    };

    const texture = await Assets.load('https://fastly.picsum.photos/id/379/600/800.jpg?hmac=lwY9HzQ8vwSUyV2q58Mp7tq02e-3AAdW3RI8-rkDPN4');
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.filters = [filter];

    props.app.stage.addChild(sprite);
    props.onUpdate(update);
}