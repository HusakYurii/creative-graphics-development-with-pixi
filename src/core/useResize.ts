import { Application, type ISize } from 'pixi.js';

interface CurrentSizes {
    game: Readonly<ISize & {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }>;
    canvas: Readonly<ISize>;
}

type OnReeizeCallback = (sizes: Readonly<CurrentSizes>) => void;

type UnsubscibeCallback = () => void;
type OnResize = (callback: OnReeizeCallback) => UnsubscibeCallback;

export interface UseResizeOptions {
    app: Application<HTMLCanvasElement>;
    safeGameAreaSize: Readonly<ISize>;
    /**
     * If true, the resize will be triggered immediately during the hook initialization. Default is true.
     */
    immediate?: boolean;
}
export interface ResizeAPI {
    disconnect: () => void;
    resize: () => void;
    onResize: OnResize;
    getCurrentSizes: () => Readonly<CurrentSizes>;
}

export function useResize({ app, safeGameAreaSize, immediate = true }: UseResizeOptions): ResizeAPI {
    // Get the parent element directly from the canvas
    const root = app.view.parentElement;
    const resizeHablders = new Set<OnReeizeCallback>();
    let currentSizes = {
        game: {
            width: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        canvas: {
            width: 0,
            height: 0
        }
    }

    if (!root) {
        console.error("Canvas must be attached to the DOM before calling useResize");
        return {
            disconnect: () => { },
            resize: () => { },
            onResize: (cb) => {
                return () => { };
            },
            getCurrentSizes: () => currentSizes
        };
    }

    const resize = () => {
        const rootWidth = root.clientWidth;
        const rootHeight = root.clientHeight;

        if (rootWidth === 0 || rootHeight === 0) return;

        const screenAR = rootWidth / rootHeight;

        let finalInternalWidth: number;
        let finalInternalHeight: number;

        // Determine orientation and calculate adaptive dimensions
        if (rootWidth >= rootHeight) {
            // LANDSCAPE: Fix internal width to design, adapt height
            finalInternalWidth = Math.floor(safeGameAreaSize.width * screenAR);
            finalInternalHeight = safeGameAreaSize.height;
        } else {
            // PORTRAIT: Fix internal height to design, adapt width
            finalInternalHeight = Math.floor(safeGameAreaSize.height / screenAR);
            finalInternalWidth = safeGameAreaSize.width;
        }

        // 1. Update the renderer's internal drawing buffer
        app.renderer.resize(finalInternalWidth, finalInternalHeight);

        // 3. Match canvas CSS exactly to the parent container
        app.view.style.width = `${rootWidth}px`;
        app.view.style.height = `${rootHeight}px`;
        // 4. Save the actual renderer and cnvas size
        currentSizes = {
            game: {
                width: app.screen.width,
                height: app.screen.height,
                left: -app.screen.width / 2,
                right: app.screen.width / 2,
                top: -app.screen.height / 2,
                bottom: app.screen.height / 2

            },
            canvas: {
                width: rootWidth,
                height: rootHeight
            }
        };
        // 5.Update all listeners
        resizeHablders.forEach(callback => {
            callback(currentSizes)
        });
    };

    // Manual first trigger
    if (immediate) {
        resize();
    }

    let needResize = false;
    let timePassed = 0;
    const handleResize = () => {
        if (needResize) {
            timePassed += app.ticker.deltaMS;
            if (timePassed > 100) {
                needResize = false;
                timePassed = 0;
                resize();
            }
        }
    }

    const observer = new ResizeObserver(() => {
        needResize = true;
        timePassed = 0;
    });
    observer.observe(root);

    app.ticker.add(handleResize);

    const getCurrentSizes: () => Readonly<CurrentSizes> = () => currentSizes;

    const onResize: OnResize = (callback) => {
        resizeHablders.add(callback);
        return () => resizeHablders.delete(callback);
    }

    const disconnect = () => {
        observer.disconnect();
        resizeHablders.clear();
        app.ticker.remove(handleResize)
    };

    return {
        disconnect,
        resize,
        onResize,
        getCurrentSizes,
    };
}