import { Shader, Mesh } from "pixi.js";
import { createPlaneGeometry } from "./createPlaneGeometry";

export const createMeshWithShader = (w: number, h: number) => {

    const geometry = createPlaneGeometry(w, h);

    const vertexSrc = `

    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aUv;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    uniform float uTime;

    varying vec2 vUv;

    void main() {

        vUv = aUv;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`;

    const fragmentSrc = `
precision mediump float;

uniform float uTime;

varying vec2 vUv;

 const float STAR_COUNT = 200.0;

// ---------------------------------------------------------
// random
// ---------------------------------------------------------

float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

// ---------------------------------------------------------
// stretched star
// ---------------------------------------------------------

float star(vec2 uv, float id) {

    // random radial direction
    float angle = (id / STAR_COUNT) * 6.28318530718;

    vec2 dir = vec2(cos(angle), sin(angle));

    // unique timing offset
    float timeOffset = hash(id * 20.0);

    // movement
    float speed = 0.35;

    float t =  fract(uTime * speed + timeOffset);

    // star position
    vec2 pos = dir * t * t;

    // ---------------------------------------------------------
    // star size
    // ---------------------------------------------------------

    float startR = 0.0005;
    float endR = 0.004;

    float radius = mix(startR, endR, t);

    // ---------------------------------------------------------
    // stretch amount
    // increases with distance from center
    // ---------------------------------------------------------

    float stretch = mix(0.5, 16.0, t);

    // ---------------------------------------------------------
    // orient UV into star local space
    // ---------------------------------------------------------

  vec2 delta = uv - pos;

// rotate into movement space
mat2 rot = mat2(
    dir.x, -dir.y,
    dir.y,  dir.x
);

delta = rot * delta;

// stretch ALONG movement direction
delta.x /= stretch;

    // ---------------------------------------------------------
    // ellipse shape
    // ---------------------------------------------------------

    float d = length(delta);

    float star = smoothstep(radius, radius * 0.5, d);

    return star;
}

void main() {

    vec2 uv = vUv - 0.5;

    vec3 color = vec3(0.0);

   

    for(float i = 0.0; i < STAR_COUNT; i++) {

        color += vec3(star(uv, i));
    }

    gl_FragColor = vec4(color, 1.0);
}
    `;

    const uniforms = {
        uTime: 0,
    };

    const shader = Shader.from(vertexSrc, fragmentSrc, uniforms);

    const mesh = new Mesh(geometry, shader);
    return { mesh, uniforms };

};