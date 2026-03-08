import { defineConfig } from 'vite';
import tglslPlugin from './src/plugin';

export default defineConfig({
    plugins: [tglslPlugin()]
});