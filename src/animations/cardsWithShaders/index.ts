import { Container, Graphics } from "pixi.js";
import { createApp } from "../../core/createApp";
import { type BundlesLoaderOptions, useBundlesLoader } from "../../core/useBundlesLoader";
import { useResize } from "../../core/useResize";
import { tweenGroup } from "../../core/tweenGroup";
import { ShuffleWithFlip } from "./examples/ShuffleWithFlip";
import { assetNames } from "./cardsDeckConfig";
import { AnimatedCard } from "./examples/AnimatedCard";
import { ShuffleWithSGFlip } from "./examples/ShuffleWithSGFlip";
import { AnimatedCard2 } from "./examples/AnimatedCard2";
import { SlideAndFlipShuffle } from "./examples/SlideAndFlipShuffle";


const assets: BundlesLoaderOptions = {
    bundles: {
        loadingScreen: [
            {
                alias: 'table',
                src: 'table2.webp'
            },
            ...assetNames.cards
        ],
        introScreen: [],
        gameScreen: [],
        outroScreen: []
    }
}

// const cardsSpritesheet: SpriteSheetLoaderOptions = {
//     jsonSrc: 'texture_atlas.json',
// }

const initGame = async () => {
    const { app, onUpdate } = createApp({
        container: document.querySelector<HTMLDivElement>('#app')!,
    });

    const bundlesLoader = useBundlesLoader(assets);
    // const spriteSheetLoader = useSpriteSheetLoader(cardsSpritesheet);
    const { onResize, resize } = useResize({
        app,
        safeGameAreaSize: { width: 1000, height: 1000 },
        immediate: false
    });

    await Promise.all([
        bundlesLoader.loadBundle('loadingScreen'),
        // spriteSheetLoader.loadSpriteSheet()
    ]);

    const gameContainer = new Container();
    app.stage.addChild(gameContainer);

    // const table = new Sprite(bundlesLoader.getTexture('loadingScreen', 'table'));
    // table.anchor.set(0.5);

    // gameContainer.addChild(table);

    const actualShadowSprite = new Graphics().beginFill(0x000000, 0.7).drawRoundedRect(-70 / 2, -105 / 2, 70, 105, 4).endFill()
    actualShadowSprite.scale.set(0.95);

    const shadowTexture = app.renderer.generateTexture(actualShadowSprite);
    const commonProps = {
        assets: {
            cardBack: assetNames.cards[assetNames.cards.length - 1].alias,
            cards: assetNames.cards.slice(0, assetNames.cards.length - 2).map(val => val.alias),
            shadowTexture: shadowTexture,
        },

        getTexture: (name: string) => bundlesLoader.getTexture('loadingScreen', name),
        CardCreator: AnimatedCard
    };
    const simpleWithFlip = new ShuffleWithFlip({
        ...commonProps,
    });
    simpleWithFlip.view.position.set(-250, 100);

    gameContainer.addChild(simpleWithFlip.view);


    const simpleWithSGFlip = new ShuffleWithSGFlip({
        ...commonProps,
        CardCreator: AnimatedCard2
    });
    simpleWithSGFlip.view.position.set(-250, 380);

    gameContainer.addChild(simpleWithSGFlip.view);

    const slideAndFlipShuffle = new SlideAndFlipShuffle({
        ...commonProps,
        CardCreator: AnimatedCard
    });
    slideAndFlipShuffle.view.position.set(-250, -180);
    gameContainer.addChild(slideAndFlipShuffle.view);



    onResize(({ game }) => {
        app.stage.position.set(game.width / 2, game.height / 2);
    });

    onUpdate((ticker) => {
        tweenGroup.update(ticker.lastTime);
    });

    resize();
};

initGame();