import type { Plugin } from 'vite';
import { transpileTGLSLtoGLSL } from './transpiler';

export default function tglslPlugin(): Plugin {
    return {
        name: 'vite-plugin-tglsl',
        enforce: 'pre',
        async transform(code, id) {
            if (id.endsWith('.tglsl')) {
                const glsl = transpileTGLSLtoGLSL(code);
                return {
                    code: `export default ${JSON.stringify(glsl)};`,
                    map: null
                };
            }
            return null;
        }
    }
}