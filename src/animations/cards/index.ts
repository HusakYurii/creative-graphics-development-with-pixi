import { Sprite, Texture, AnimatedSprite } from "pixi.js";
import { createApp } from "../../core/createApp";
import { type BundlesLoaderOptions, useBundlesLoader } from "../../core/useBundlesLoader";
import { useResize } from "../../core/useResize";
import { type SpritesheetLoaderOptions, useSpriteheetLoader } from "../../core/useSpritesheetLoader";
import { BaseCardsDeck } from "./baseClasses/BaseCardsDeck";
import { assetNames } from "./cardsDeckConfig";
import { CardHighlight } from "./baseClasses/CardHighlight";
import { tweenGroup } from "./tweens/tweenGroup";
import { AnimatedCard } from "./animatedCards/AnimatedCard";

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

const cardsSpritesheet: SpritesheetLoaderOptions = {
    jsonSrc: 'texture_atlas.json',
}

const initGame = async () => {
    const { app, onUpdate } = await createApp({
        container: document.querySelector<HTMLDivElement>('#app')!
    });

    const bundlesLoader = useBundlesLoader(assets);
    const spritesheetLoader = useSpriteheetLoader(cardsSpritesheet);
    const { onResize, resize } = useResize({
        app,
        safeGameAreaSize: { width: 960, height: 960 },
        immediate: false
    });

    onResize(({ game }) => {
        app.stage.position.set(game.width / 2, game.height / 2);
    });

    onUpdate((ticker) => {
        tweenGroup.update(ticker.lastTime);
    });

    resize();

    // await bundlesLoader.loadBundle('loadingScreen');
    // app.stage.addChild(new Sprite(bundlesLoader.getTexture('loadingScreen', 'vite')))

    await spritesheetLoader.loadSpritesheet();

    const cardsDeck = new BaseCardsDeck<AnimatedCard>({
        assets: {
            cardBack: assetNames.cardBack,
            cards: [assetNames.cards[0]]
        },
        getTexture: spritesheetLoader.getTexture,
        CardCreator: AnimatedCard
    });
    cardsDeck.view.scale.set(2)
    app.stage.addChild(cardsDeck.view);

    window._cardsDeck = cardsDeck;

    ``

    // const cardHighlight = new CardHighlight({
    //     textures: assetNames.highlight.map(name => spritesheetLoader.getTexture(name) || Texture.EMPTY)
    // });
    // app.stage.addChild(cardHighlight.view);





};

initGame();