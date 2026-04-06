import { Texture, Assets } from 'pixi.js';

export interface SpriteSheetLoaderOptions {
    jsonSrc: string;
}


interface LoadedSpriteSheetData {
    data: {
        frames: Array<{ filename: string }>;
    }
    textures: Record<string, Texture>;
}
type ProgressCallback = (progress: number, alias?: string) => void;

interface SpriteSheetLoaderAPI {
    getTexture: (textureName: string) => Texture | undefined;
    loadSpriteSheet: (onProgress?: ProgressCallback) => Promise<void>;
}

/**
 * 
 * @example
 * const spriteSheetLoader = useSpriteSheetLoader({
 *     jsonSrc: 'texture_atlas.json'
 * });
 * await spriteSheetLoader.loadSpriteSheet();
 * const sprite = new Sprite(spriteSheetLoader.getTexture('textureNameFromAtlas'))
 */
export function useSpriteSheetLoader(options: SpriteSheetLoaderOptions): SpriteSheetLoaderAPI {

    async function loadSpriteSheet(onProgress?: ProgressCallback) {
        return Assets.load(options.jsonSrc, onProgress);
    }

    function getTexture(textureName: string): Texture | undefined {
        const spriteSheet: LoadedSpriteSheetData | undefined = Assets.get(options.jsonSrc);
        if (!spriteSheet) {
            return;
        }
        const regExp = new RegExp(`${textureName}`);
        const index = spriteSheet.data.frames.findIndex((val) => regExp.test(val.filename));
        if (index < 0) {
            return;
        }

        return spriteSheet.textures[index];
    }

    return {
        loadSpriteSheet,
        getTexture,
    };
}
