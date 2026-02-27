import { createApp } from './core/createApp';
import { useResize } from './core/useResize';
import { Sprite, Assets } from 'pixi.js';

const initGame = async () => {
    const { app, onUpdate } = await createApp({
        container: document.querySelector<HTMLDivElement>('#app')!
    });
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
};

initGame();