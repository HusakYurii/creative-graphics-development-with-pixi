import { Sprite, Texture, AnimatedSprite, Container, Shader, Mesh, Geometry } from "pixi.js";
import { createApp } from "../../core/createApp";
import { type BundlesLoaderOptions, useBundlesLoader } from "../../core/useBundlesLoader";
import { useResize } from "../../core/useResize";
import { BaseCardsDeck } from "./baseClasses/BaseCardsDeck";
import { assetNames } from "./cardsDeckConfig";
import { CardHighlight } from "./baseClasses/CardHighlight";
import { tweenGroup } from "../../core/tweenGroup";
import { AnimatedCard } from "./examples/AnimatedCard";
import { useSpriteSheetLoader, type SpriteSheetLoaderOptions } from "../../core/useSpriteSheetLoader";
import { SimpleShuffle } from "./examples/SimpleShuffle";
import { SimpleShuffleBackwards } from "./examples/SimpleShuffleBackwards";
import { ShuffleWithFlip } from "./examples/ShuffleWithFlip";
import { ShuffleWithSGFlip } from "./examples/ShuffleWithSGFlip";
import { AnimatedCard2 } from "./examples/AnimatedCard2";
import { SlideInShuffle } from "./examples/SlideInShuffle";
import { SlideAndFlipShuffle } from "./examples/SlideAndFlipShuffle";

const assets: BundlesLoaderOptions = {
    bundles: {
        loadingScreen: [
            // {
            //     alias: 'table',
            //     src: 'table.webp'
            // },
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

    const gameContainer = new Container();
    app.stage.addChild(gameContainer);

    // const table = new Sprite(bundlesLoader.getTexture('loadingScreen', 'table'));
    // table.anchor.set(0.5);

    // gameContainer.addChild(table);

    const commonProps = {
        assets: {
            cardBack: assetNames.cardBack,
            cards: assetNames.cards
        },
        getTexture: spriteSheetLoader.getTexture,
        CardCreator: AnimatedCard
    };

    const simpleShuffle = new SimpleShuffle({
        ...commonProps,
    });
    simpleShuffle.view.position.set(-350, -370);
    gameContainer.addChild(simpleShuffle.view);

    const simpleShuffleBackwards = new SimpleShuffleBackwards({
        ...commonProps,
    });
    simpleShuffleBackwards.view.position.set(-350, -120);
    gameContainer.addChild(simpleShuffleBackwards.view);

    const simpleWithFlip = new ShuffleWithFlip({
        ...commonProps,
    });
    simpleWithFlip.view.position.set(-350, 120);
    gameContainer.addChild(simpleWithFlip.view);

    const simpleWithSGFlip = new ShuffleWithSGFlip({
        ...commonProps,
        CardCreator: AnimatedCard2
    });
    simpleWithSGFlip.view.position.set(-350, 370);
    gameContainer.addChild(simpleWithSGFlip.view);

    const slideInShuffle = new SlideInShuffle({
        ...commonProps,
        CardCreator: AnimatedCard
    });
    slideInShuffle.view.position.set(200, -370);
    gameContainer.addChild(slideInShuffle.view);

    const slideAndFlipShuffle = new SlideAndFlipShuffle({
        ...commonProps,
        CardCreator: AnimatedCard
    });
    slideAndFlipShuffle.view.position.set(200, -120);
    gameContainer.addChild(slideAndFlipShuffle.view);

    // const cardHighlight = new CardHighlight({
    //     textures: assetNames.highlight.map(name => spritesheetLoader.getTexture(name) || Texture.EMPTY)
    // });
    // app.stage.addChild(cardHighlight.view);

    onResize(({ game }) => {
        app.stage.position.set(game.width / 2, game.height / 2);
        // const isLandscape = game.width > game.height;

        // gameContainer.rotation = isLandscape ? 0 : Math.PI / 2;
        // table.width = isLandscape ? game.width : game.height;
        // table.scale.y = table.scale.x;
    });

    onUpdate((ticker) => {
        tweenGroup.update(ticker.lastTime);
    });

    resize();


};

initGame();