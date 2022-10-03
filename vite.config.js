// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';

// // https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [vue()],
//     build: {
//         minify: true,
//         cssCodeSplit: false,
//         rollupOptions: {
//             output: {
//                 manualChunks: {
//                     vendor: [],
//                 },
//             },
//         },
//     },

//     css: { preprocessorOptions: { scss: { charset: false } } },
// });

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
            name: 'laravelFileManager',
            // the proper extensions will be added
            fileName: 'laravel-file-manager',
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['vue'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue',
                },
                // manualChunks: {
                //     vendor: [],
                // },
            },
        },
    },
    css: { preprocessorOptions: { scss: { charset: false } } },
})
