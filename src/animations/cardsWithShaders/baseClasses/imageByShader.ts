import { Sprite, Texture, AnimatedSprite, Container, Shader, Mesh, Geometry } from "pixi.js";

export const imageByShader = (texture: Texture) => {

    const h = texture.height;
    const w = texture.width;

    const geometry = new Geometry()
        .addAttribute(
            'aVertexPosition', // the attribute name
            [
                -w / 2, -h / 2, // x, y
                w / 2, -h / 2, // x, y
                w / 2, h / 2,
                -w / 2, h / 2,
            ], // x, y
            2,
        ) // the size of the attribute
        .addAttribute(
            'aUvs', // the attribute name
            [
                0, 0, // u, v
                1, 0, // u, v
                1, 1,
                0, 1,
            ], // u, v
            2,
        ) // the size of the attribute
        .addIndex([0, 1, 2, 0, 2, 3]);

    const vertexSrc = `

    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec2 vUvs;

    void main() {

        vUvs = aUvs;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`;

    const fragmentSrc = `

    precision mediump float;

    varying vec2 vUvs;

    uniform sampler2D uTexture;
    uniform float time;

    void main() {
        gl_FragColor = texture2D(uTexture, vUvs );
    }`;

    const uniforms = {
        uTexture: texture,
        time: 0,
    };

    const shader = Shader.from(vertexSrc, fragmentSrc, uniforms);

    const image = new Mesh(geometry, shader);
    return image;

};
