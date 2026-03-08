import { Filter, defaultVertex, Ticker, Graphics } from 'pixi.js';
import type { ShaderExampleDependencies } from '../interfaces';

export const showColoringShader = (props: ShaderExampleDependencies) => {

    const fragmentSrc = `
        varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uTime;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord); 
    float multiplier = 1.0;
    if(length(vTextureCoord) < 0.5) {
        multiplier = (cos(uTime) + 1.0) * 0.5; // Pulsate between 0 and 1
    }else {
        multiplier = (sin(uTime) + 1.0) * 0.5;
    }
    deviderX: float = cos(uTime) * 0.5 + 1.0;
    float deviderY = sin(uTime) * 0.5 + 0.75;

    vec4 correctedColor = vec4(
        color.r * multiplier / deviderX, 
        color.g * multiplier / deviderY,
        (color.b * multiplier) / (deviderX * deviderY),
        color.a
    );
    gl_FragColor = correctedColor;
}
    `;


    const filter = new Filter(defaultVertex, fragmentSrc, {
        uTime: 0
    });

    const update = (ticekr: Ticker) => {
        filter.uniforms.uTime = ticekr.lastTime / 1000; // Convert to seconds
    };

    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(-200, -200, 400, 400);
    graphics.endFill();

    graphics.filters = [filter];

    props.app.stage.addChild(graphics);
    props.onUpdate(update);
}
