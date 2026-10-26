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

    varying vec2 vUv;

    uniform float uTime;

    void main() {
        gl_FragColor = vec4(vUv, 1.0, 1.0);
    }`;

    const uniforms = {
        uTime: 0,
    };

    const shader = Shader.from(vertexSrc, fragmentSrc, uniforms);

    const mesh = new Mesh(geometry, shader);
    return mesh;

};