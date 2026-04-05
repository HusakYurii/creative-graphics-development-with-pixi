import { Texture, Assets, type AssetsManifest, type UnresolvedAsset } from 'pixi.js';



export interface BundlesLoaderOptions {
    bundles: {
        loadingScreen: UnresolvedAsset[];
        introScreen: UnresolvedAsset[];
        gameScreen: UnresolvedAsset[];
        outroScreen: UnresolvedAsset[];
    }
}

type BundleNames = keyof BundlesLoaderOptions['bundles'];

type ProgressCallback = (progress: number, alias?: string) => void;

interface BundlesLoaderAPI {
    init: () => Promise<void>;
    getTexture: (bundleName: BundleNames, textureName: string) => Texture | undefined;
    loadBundle: (key: BundleNames, onProgress?: ProgressCallback) => Promise<void>;
}

/**
 * @example
 * const assets: BundlesLoaderOptions = {
 * bundles: {
 *     loadingScreen: [
 *         { alias: 'vite', src: 'vite.svg' }
 *     ],
 *     introScreen: [],
 *     gameScreen: [],
 *     outroScreen: []
 *  }
 * };
 * 
 * const bundlesLoader = useBundlesLoader(assets);
 * await bundlesLoader.loadBundle('loadingScreen');
 * const sprite = new Sprite(bundlesLoader.getTexture('loadingScreen', 'vite'));
 * 
 * */
export function useBundlesLoader(options: BundlesLoaderOptions): BundlesLoaderAPI {

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

    async function init() {
        if (wasInitialized) {
            return;
        }
        await initializeBundle();
        wasInitialized = true;
    }

    async function loadBundle(key: BundleNames, onProgress?: ProgressCallback) {
        await init();
        // const bundle: Record<string, Texture> = await Assets.loadBundle(key, onProgress);
        return await Assets.loadBundle(key, onProgress);
    }

    function getTexture(bundleName: BundleNames, textureName: string): Texture | undefined {
        return Assets.get(`${bundleName}-${textureName}`);
    }

    return {
        init,
        loadBundle,
        getTexture,
    };
}
