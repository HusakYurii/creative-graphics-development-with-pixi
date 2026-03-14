import { Filter, defaultVertex, defaultFilterVertex, Ticker, Assets, Sprite, Graphics } from 'pixi.js';
import type { ShaderExampleDependencies } from '../interfaces';

export const showDrawingShaders = async (props: ShaderExampleDependencies) => {

    const fragmentSrc = `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float uBoundary;

        void main(void) {
            if(vTextureCoord.x >= uBoundary) {
                 gl_FragColor = vec4(1, 0, 0, 1);
            }else {
                gl_FragColor = vec4(1, 1, 0, 1);
            }
           
        }
    `;


    const filter = new Filter(defaultVertex, fragmentSrc, {
        uBoundary: 0
    });

    const update = (ticekr: Ticker) => {
        filter.uniforms.uBoundary += 0.001; // Convert to seconds
    };

    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, 400, 400);
    graphics.endFill();

    graphics.filters = [filter];

    props.app.stage.addChild(graphics);
    props.onUpdate(update);
}