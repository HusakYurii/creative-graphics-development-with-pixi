import { Texture, Assets } from 'pixi.js';

export interface SpritesheetLoaderOptions {
    jsonSrc: string;
}


interface LoadedSpritesheetData {
    data: {
        frames: Array<{ filename: string }>;
    }
    textures: Record<string, Texture>;
}
type ProgressCallback = (progress: number, alias?: string) => void;

interface SpritesheetLoaderAPI {
    getTexture: (textureName: string) => Texture | undefined;
    loadSpritesheet: (onProgress?: ProgressCallback) => Promise<void>;
}

/**
 * 
 * @example
 * const spritesheetLoader = useSpriteheetLoader({
 *     jsonSrc: 'texture_atlas.json'
 * });
 * await spritesheetLoader.loadSpritesheet();
 * const sprite = new Sprite(spritesheetLoader.getTexture('textureNameFromAtlas'))
 */
export function useSpriteheetLoader(options: SpritesheetLoaderOptions): SpritesheetLoaderAPI {

    async function loadSpritesheet(onProgress?: ProgressCallback) {
        return Assets.load(options.jsonSrc, onProgress);
    }

    function getTexture(textureName: string): Texture | undefined {
        const spritesheet: LoadedSpritesheetData | undefined = Assets.get(options.jsonSrc);
        if (!spritesheet) {
            return;
        }
        const regExp = new RegExp(`${textureName}`);
        const index = spritesheet.data.frames.findIndex((val) => regExp.test(val.filename));
        if (index < 0) {
            return;
        }

        return spritesheet.textures[index];
    }

    return {
        loadSpritesheet,
        getTexture,
    };
}
