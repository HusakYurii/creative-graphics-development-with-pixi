import { Sprite, Texture, AnimatedSprite, Container, Shader, Mesh, Geometry } from "pixi.js";
import { createApp } from "../../core/createApp";
import { type BundlesLoaderOptions, useBundlesLoader } from "../../core/useBundlesLoader";
import { useResize } from "../../core/useResize";
import { tweenGroup } from "../../core/tweenGroup";
import { useSpriteSheetLoader, type SpriteSheetLoaderOptions } from "../../core/useSpriteSheetLoader";

const assets: BundlesLoaderOptions = {
    bundles: {
        loadingScreen: [
            {
                alias: 'table',
                src: 'table.webp'
            },
            {
                alias: 'cardShadow',
                src: 'cardShadow.png'
            }
        ],
        introScreen: [],
        gameScreen: [],
        outroScreen: []
    }
}

const cardsSpritesheet: SpriteSheetLoaderOptions = {
    jsonSrc: 'texture_atlas.json',
}

const initGame = async () => {
    const { app, onUpdate } = createApp({
        container: document.querySelector<HTMLDivElement>('#app')!,
    });

    const bundlesLoader = useBundlesLoader(assets);
    const spriteSheetLoader = useSpriteSheetLoader(cardsSpritesheet);
    const { onResize, resize } = useResize({
        app,
        safeGameAreaSize: { width: 1000, height: 1000 },
        immediate: false
    });

    await Promise.all([
        bundlesLoader.loadBundle('loadingScreen'),
        spriteSheetLoader.loadSpriteSheet()
    ]);



    onResize(({ game }) => {
        app.stage.position.set(game.width / 2, game.height / 2);
    });

    onUpdate((ticker) => {
        tweenGroup.update(ticker.lastTime);
    });

    resize();
};

initGame();