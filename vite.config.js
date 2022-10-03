import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue()],
    build: {
        minify: true,
        cssCodeSplit: false,
        lib: {
            entry: resolve(__dirname, 'src/init.js'),
            name: 'laravelFileManagerVue3',
            // the proper extensions will be added
            fileName: 'laravel-file-manager-vue3',
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    css: { preprocessorOptions: { scss: { charset: false } } },
})
