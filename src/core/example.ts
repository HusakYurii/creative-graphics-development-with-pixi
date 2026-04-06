import { createApp } from './createApp';
import { useBundlesLoader, type BundlesLoaderOptions } from './useBundlesLoader';
import { useResize } from './useResize';
import { Sprite, Assets, AnimatedSprite, Texture } from 'pixi.js';
import { useSpriteSheetLoader, type SpriteSheetLoaderOptions } from './useSpriteSheetLoader';

const assets: BundlesLoaderOptions = {
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

const cardsSpritesheet: SpriteSheetLoaderOptions = {
    jsonSrc: 'eample.json'
}

const initGame = async () => {
    const { app, onUpdate } = createApp({
        container: document.querySelector<HTMLDivElement>('#app')!
    });

    const bundlesLoader = useBundlesLoader(assets);
    const spriteSheetLoader = useSpriteSheetLoader(cardsSpritesheet);
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

    await bundlesLoader.loadBundle('loadingScreen');
    const texture = bundlesLoader.getTexture('loadingScreen', 'vite');

    await spriteSheetLoader.loadSpriteSheet();
    const anotherTexture = spriteSheetLoader.getTexture('nameOfASprite')
};

initGame();