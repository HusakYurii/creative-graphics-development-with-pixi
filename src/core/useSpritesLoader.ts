import { Texture, Assets, type AssetsManifest, type UnresolvedAsset } from 'pixi.js';



export interface SpritesLoaderOptions {
    bundles: {
        loadingScreen: UnresolvedAsset[];
        introScreen: UnresolvedAsset[];
        gameScreen: UnresolvedAsset[];
        outroScreen: UnresolvedAsset[];
    }
}

type BundleNames = keyof SpritesLoaderOptions['bundles'];

type ProgressCallback = (progress: number, alias?: string) => void;


interface SpritesLoaderAPI {
    getTexture: (bundleName: BundleNames, textureName: string) => Texture | undefined;
    loadBundle: (key: BundleNames, onProgress?: ProgressCallback) => Promise<void>;
}

export function useSpritesLoader(options: SpritesLoaderOptions): SpritesLoaderAPI {
    const textures = new Map<BundleNames, Record<string, Texture>>();

    let wasInitialized = false;

    async function initializeBundle() {
        const manifest: AssetsManifest = { bundles: [] }
        Object.keys(options.bundles).forEach((key) => {
            const bundle = {
                name: key,
                assets: options.bundles[key as BundleNames]
            }
            manifest.bundles.push(bundle)
        })
        return Assets.init({ manifest });
    }

    async function loadBundle(key: BundleNames, onProgress?: ProgressCallback) {
        if (!wasInitialized) {
            await initializeBundle();
            wasInitialized = true;
        }
        const bundle: Record<string, Texture> = await Assets.loadBundle(key, onProgress);

        textures.set(key, bundle);
    }

    function getTexture(bundleName: BundleNames, textureName: string): Texture | undefined {
        return textures.get(bundleName)?.[textureName];
    }

    return {
        loadBundle,
        getTexture,
    };
}
