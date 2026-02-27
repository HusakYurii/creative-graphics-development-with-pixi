
import { createApp } from '../core/createApp';
import { useResize } from '../core/useResize';
import { showGrayscaleShader } from './history/grayscale';
import { showColoringShader } from './history/coloring';
import { showExampleShader } from './example';

const initGame = async () => {

    const { app, onUpdate } = await createApp({
        container: document.querySelector<HTMLDivElement>('#app')!,
    });
    const { onResize, resize } = useResize({
        app,
        safeGameAreaSize: { width: 960, height: 960 },
        immediate: false,
    });

    onResize(({ game }) => {
        app.stage.position.set(game.width / 2, game.height / 2);
    });

    resize();

    // await showGrayscaleShader({ app, onUpdate });
    // showColoringShader({ app, onUpdate });
    showExampleShader({ app, onUpdate });
};

initGame();