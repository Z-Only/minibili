import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vuetify from 'vite-plugin-vuetify'
import eslint from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'

const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [
            vue(),
            vuetify({ autoImport: true }),
            eslint(),
            AutoImport({
                imports: ['vue', 'vue-router'],
                dts: false,
                eslintrc: {
                    enabled: false,
                    filepath: './.eslintrc-auto-import.js',
                },
            }),
            Components({ dts: true }),
            visualizer({
                open: false,
                gzipSize: true,
                brotliSize: true,
                filename: './dist/stats.html',
            }),
            chunkSplitPlugin({
                strategy: 'default',
                customSplitting: {
                    // `vue` and `vue-router` 会被打包到一个名为`vue-vendor`的 chunk 里面
                    // 'vue-chunk': ['vue', 'vue-router'],
                    // 将 vuetify 拆分到单独的 chunk
                    // 'vuetify-chunk': ['vuetify'],
                    // 源码中 apis 目录的代码都会打包进 `apis` 这个 chunk 中
                    // apis: [/src\/apis/],
                },
            }),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
            server: {
                deps: {
                    inline: ['vuetify'],
                },
            },
        },

        // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
        //
        // 1. prevent vite from obscuring rust errors
        clearScreen: false,
        // 2. tauri expects a fixed port, fail if that port is not available
        server: {
            port: 1420,
            strictPort: true,
            host: host || false,
            hmr: host
                ? {
                      protocol: 'ws',
                      host,
                      port: 1421,
                  }
                : undefined,
            watch: {
                // 3. tell vite to ignore watching `src-tauri`
                ignored: ['**/src-tauri/**'],
            },
        },
        esbuild: {
            drop: env.MODE === 'production' ? ['console', 'debugger'] : [],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
        },
    }
})
