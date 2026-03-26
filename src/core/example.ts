import { createApp } from './createApp';
import { useSpritesLoader, type SpritesLoaderOptions } from './useSpritesLoader';
import { useResize } from './useResize';
import { Sprite, Assets } from 'pixi.js';

const assets: SpritesLoaderOptions = {
    bundles: {
        loadingScreen: [
            {
                alias: 'vite',
                src: 'vite.svg'
            }
        ],
        introScreen: [],
        gameScreen: [],
        outroScreen: []
    }
}

const initGame = async () => {
    const { app, onUpdate } = await createApp({
        container: document.querySelector<HTMLDivElement>('#app')!
    });

    const { loadBundle, getTexture } = useSpritesLoader(assets);

    const { onResize, resize } = useResize({
        app,
        safeGameAreaSize: { width: 960, height: 960 },
        immediate: false
    });

    onResize(({ game }) => {
        app.stage.position.set(game.width / 2, game.height / 2);
    });

    onUpdate((ticker) => {

    });

    resize();

    await loadBundle('loadingScreen');
    app.stage.addChild(new Sprite(getTexture('loadingScreen', 'vite')))

};

initGame();