import type { Application, Ticker } from "pixi.js";

export interface ShaderExampleDependencies {
    app: Application<HTMLCanvasElement>;
    onUpdate: (callback: (ticker: Ticker) => void) => () => void
}