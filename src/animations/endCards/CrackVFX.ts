import { Mesh, Shader } from "pixi.js";
import { createPlaneGeometry } from "./createPlaneGeometry";
import { Easing, Interpolation, Tween, tweenGroup } from "../../core/tweenGroup";

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

    }
`;
const fragmentSrc = `
    precision mediump float;

    varying vec2 vUv;
    uniform float time;
    uniform vec2 uImpactPos;
    uniform float uGrowth; // 0.0 (no cracks) to 1.0 (fully grown)
    uniform vec3 uCrackColor;

    // Randomness for fractal branching
    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    float noise(float x) {
        float i = floor(x);
        float f = fract(x);
        return mix(hash(vec2(i, i)), hash(vec2(i + 1.0, i + 1.0)), smoothstep(0.0, 1.0, f));
    }

    float fractalNoise(float x) {
        float v = 0.0;
        float a = 0.5;
        float freq = 1.0;
        for (int i = 0; i < 5; i++) {
            v += a * noise(x * freq);
            freq *= 2.0;
            a *= 0.5;
        }
        return v;
    }

    void main() {
        vec2 uv = vUv - uImpactPos;
        float dist = length(uv);
        float angle = atan(uv.y, uv.x);

        // 1. Generate Fractal Radial Lines
        float fNoise = fractalNoise(angle * 5.0 + dist * 2.0);
        float radial = abs(sin(angle * 7.0 + fNoise * 2.5));
        float radialCracks = smoothstep(0.08, 0.02, radial);

        // Limited Circular Cracks (The "Rings")
        float ringNoise = fractalNoise(angle * 8.0);
        float rings = abs(sin(dist * 40.0+ ringNoise * 0.5));
        float circularCracks = smoothstep(0.05, 0.0, rings);

        // Only allow rings to show up in a specific distance range from impact
    circularCracks *= smoothstep(0.4, 0.2, dist) * smoothstep(0.05, 0.15, dist);

    //  Combine and Apply Growth
    float finalPattern = max(radialCracks, circularCracks);
        
        // Growth logic: cracks only exist where dist < uGrowth
        // We use a small 0.1 buffer for a smooth tip at the end of the crack
        float growthMask = smoothstep(uGrowth, uGrowth - 0.1, dist);
        finalPattern *= growthMask;

        // 4. Color & Transparency
        // Use a bright "icy" white/blue for the crack lines
        vec3 crackColor = uCrackColor;

        // 5. Edge Fade (Vignette)
        // This prevents cracks from looking "cut off" at the card borders
        float edgeFade = smoothstep(0.5, 0.2, dist);
        finalPattern *= edgeFade;
        
        // The alpha is determined by the pattern strength
        // We use a high contrast to keep the lines sharp and clean
        float alpha = clamp(finalPattern, 0.0, 1.0);

        // Final output: transparent everywhere except the fractal lines
        gl_FragColor = vec4(crackColor * alpha, alpha);
    }
`;


export class CrackVFX {
    public view: Mesh<Shader>;
    private _uniforms: {
        uTime: number;
        uGrowth: number;
        uImpactPos: [number, number],
        uCrackColor: [number, number, number]
    };
    constructor() {


        this._uniforms = {
            uTime: 0,
            uGrowth: 0,
            uImpactPos: [0.5, 0.5],
            uCrackColor: [0.85, 0.95, 1.0]
        }
        const shader = Shader.from(vertexSrc, fragmentSrc, this._uniforms);

        this.view = new Mesh(createPlaneGeometry(600, 600), shader);

    }

    show() {
        new Tween({ value: 0 }, tweenGroup)
            .to({ value: 1 }, 200)
            .onUpdate(({ value }) => {
                this._uniforms.uGrowth = value;
            }).start()
    }
}

