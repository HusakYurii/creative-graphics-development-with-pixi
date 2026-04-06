import { Application, Ticker, type ColorSource } from 'pixi.js';

type OnUpdateCallback = (ticker: Ticker) => void;
type UnsubscribeCallback = () => void;
type OnUpdate = (callback: OnUpdateCallback) => UnsubscribeCallback;
/*
https://pixijs.download/v7.x/docs/index.html
*/

/**
 * Configuration options for the Pixi application.
 */
export interface CreateAppOptions {
    container?: HTMLElement;
    background?: ColorSource;
    antialias?: boolean;
}

interface ApplicationAPI {
    app: Application<HTMLCanvasElement>;
    onUpdate: OnUpdate;
    destroy: () => void;
}

export function createApp(options: CreateAppOptions = {}): ApplicationAPI {
    const container = options.container ?? document.body;

    const app = new Application<HTMLCanvasElement>({
        resizeTo: container === document.body ? window : container,
        backgroundColor: options.background ?? '#c2c2c2',
        antialias: options.antialias ?? true,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
    });

    container.appendChild(app.view);

    const tickerHandlers = new Set<OnUpdateCallback>();

    const onUpdate: OnUpdate = (callback) => {
        tickerHandlers.add(callback);
        return () => tickerHandlers.delete(callback);
    };

    const tickHandler = () => {
        tickerHandlers.forEach(callback => callback(app.ticker));
    };

    app.ticker.add(tickHandler);

    const destroy = () => {
        app.ticker.remove(tickHandler);
        app.destroy(true, { children: true, texture: true });
        tickerHandlers.clear();
    };

    return {
        app,
        onUpdate,
        destroy,
    };
}