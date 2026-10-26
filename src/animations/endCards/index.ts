import { Container, Graphics, Sprite } from "pixi.js";
import { createApp } from "../../core/createApp";
import { type BundlesLoaderOptions, useBundlesLoader } from "../../core/useBundlesLoader";
import { useResize } from "../../core/useResize";
import { type SpriteSheetLoaderOptions, useSpriteSheetLoader } from "../../core/useSpriteSheetLoader";
import { createMeshWithShader } from "./createMeshWithShader";
import { ProductCard } from "./ProductCard";
import { FirstExample } from "./FirstExample";
import { updateTweens } from "../../core/tweenGroup";
import { SecondExample } from "./SecondExample";
import { StarsContainer } from "./Stars";

const images = [
    'buttonBlue', 'buttonGreen', 'buttonYellow',
    'cardBlue', 'cardGreen', 'cardYellow',
    'coin', 'itemOne', 'itemTwo', 'itemThree', 'title'
];
const assets: BundlesLoaderOptions = {
    bundles: {
        loadingScreen: [
            ...images.map((alias) => {
                return {
                    alias,
                    src: `./productCards/${alias}.png`
                }
            }),
            ...images.map((alias) => {
                return {
                    alias: `${alias}City`,
                    src: `./productCardsCity/${alias}.png`
                }
            }),
            // ...images.map((alias) => {
            //     if (new Set(['buttonBlue', 'buttonGreen']).has(alias)) {
            //         return
            //     }
            //     return {
            //         alias: `${alias}Space`,
            //         src: `./productCardsSpace/${alias}.png`
            //     }
            // }).filter(Boolean),
        ],
        introScreen: [],
        gameScreen: [],
        outroScreen: []
    }
}

type CardRawDataConfig = {
    background: string,
    content: string,
    button: string,
    coinIcon: string,
    item: string,
    price: string
}
const config: CardRawDataConfig[] = [
    {
        background: 'cardGreen',
        content: 'itemThree',
        button: 'buttonGreen',
        coinIcon: 'coin',
        item: 'Wood',
        price: '150'
    },
    {
        background: 'cardBlue',
        content: 'itemOne',
        button: 'buttonBlue',
        coinIcon: 'coin',
        item: 'Stone',
        price: '250'
    },

    {
        background: 'cardYellow',
        content: 'itemTwo',
        button: 'buttonYellow',
        coinIcon: 'coin',
        item: 'Wheat',
        price: '300'
    },

];

const cityConfig: CardRawDataConfig[] = [

    {
        background: 'cardGreenCity',
        content: 'itemTwoCity',
        button: 'buttonGreenCity',
        coinIcon: 'coinCity',
        item: 'Hospital',
        price: '150'
    },
    {
        background: 'cardBlueCity',
        content: 'itemOneCity',
        button: 'buttonBlueCity',
        coinIcon: 'coinCity',
        item: 'Police',
        price: '250'
    },

    {
        background: 'cardYellowCity',
        content: 'itemThreeCity',
        button: 'buttonYellowCity',
        coinIcon: 'coinCity',
        item: 'Fire Station',
        price: '300'
    },

];

const spaceConfig: CardRawDataConfig[] = [

    {
        background: 'cardGreenSpace',
        content: 'itemTwoSpace',
        button: 'buttonYellowSpace',
        coinIcon: 'coinSpace',
        item: 'Hospital',
        price: '150'
    },
    {
        background: 'cardBlueSpace',
        content: 'itemOneSpace',
        button: 'buttonYellowSpace',
        coinIcon: 'coinSpace',
        item: 'Police',
        price: '250'
    },

    {
        background: 'cardYellowSpace',
        content: 'itemThreeSpace',
        button: 'buttonYellowSpace',
        coinIcon: 'coinSpace',
        item: 'Fire Station',
        price: '300'
    },

];

// const cardsSpritesheet: SpriteSheetLoaderOptions = {
//     jsonSrc: 'eample.json'
// }

const initGame = async () => {
    const { app, onUpdate } = createApp({
        container: document.querySelector<HTMLDivElement>('#app')!,
        background: 0x000000,
    });

    const { onResize, resize, getCurrentSizes } = useResize({
        app,
        safeGameAreaSize: { width: 960, height: 960 },
        immediate: true,

    });

    const bundlesLoader = useBundlesLoader(assets);
    // const spriteSheetLoader = useSpriteSheetLoader(cardsSpritesheet);

    await bundlesLoader.loadBundle('loadingScreen');


    // await spriteSheetLoader.loadSpriteSheet();
    // const anotherTexture = spriteSheetLoader.getTexture('nameOfASprite')



    const g = new Graphics();

    g.beginFill(0xffffff)
        .drawCircle(0, 0, 10)
        .endFill()


    const starTexture = app.renderer.generateTexture(g);

    const starsContainer = new StarsContainer(starTexture, 1200);
    app.stage.addChild(starsContainer.view);
    window.__starsContainer = starsContainer;
    // const { mesh, uniforms } = createMeshWithShader(getCurrentSizes().game.width, getCurrentSizes().game.height);
    // app.stage.addChild(mesh);

    const examplesContainer = new Container();
    app.stage.addChild(examplesContainer);

    onResize(({ game }) => {
        app.stage.position.set(game.width / 2, game.height / 2);
    });


    resize();



    onUpdate((ticker) => {
        // uniforms.uTime = ticker.lastTime * 0.0001;
        updateTweens(ticker.lastTime);
        starsContainer.update(ticker.deltaMS)
    });


    const getCards = (config: CardRawDataConfig[]) => {
        return config.map((props, i) => {
            const card = new ProductCard({
                background: bundlesLoader.getTexture('loadingScreen', props.background)!,
                content: bundlesLoader.getTexture('loadingScreen', props.content)!,
                button: bundlesLoader.getTexture('loadingScreen', props.button)!,
                coinIcon: bundlesLoader.getTexture('loadingScreen', props.coinIcon)!,
                item: props.item,
                price: props.price
            });
            return card
        })
    }

    window._showFirstExample = () => {
        examplesContainer.removeChildren();

        const example = new FirstExample(
            getCards(config),
            bundlesLoader.getTexture('loadingScreen', 'title')!,
            bundlesLoader.getTexture('loadingScreen', 'buttonYellow')!
        );

        examplesContainer.addChild(example.view);

        example.play();
    }

    window._showSecondExample = () => {
        examplesContainer.removeChildren();

        const example = new SecondExample(
            getCards(config),
            bundlesLoader.getTexture('loadingScreen', 'title')!,
            bundlesLoader.getTexture('loadingScreen', 'buttonYellow')!
        );

        examplesContainer.addChild(example.view);

        example.play();
    }

    window._showThirdExample = () => {
        examplesContainer.removeChildren();
        const cards = getCards(cityConfig);
        cards.forEach(card => {
            card.view.children[1].children[0].scale.set(0.9, 0.95);
        })
        const example = new FirstExample(
            cards,
            bundlesLoader.getTexture('loadingScreen', 'titleCity')!,
            bundlesLoader.getTexture('loadingScreen', 'buttonYellowCity')!
        );

        examplesContainer.addChild(example.view);

        example.play();
    }

    window._showFourthExample = () => {
        examplesContainer.removeChildren();
        const cards = getCards(cityConfig);
        cards.forEach(card => {
            card.view.scale.set(0.9, 0.9);
        })

        const example = new SecondExample(
            getCards(cityConfig),
            bundlesLoader.getTexture('loadingScreen', 'titleCity')!,
            bundlesLoader.getTexture('loadingScreen', 'buttonYellowCity')!
        );

        examplesContainer.addChild(example.view);

        example.play();
    }


};

initGame();