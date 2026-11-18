import { defineConfig } from 'vite'
import { resolve } from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'

import tailwindcss from '@tailwindcss/vite'
import pugPlugin from '@macropygia/vite-plugin-pug-static'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(projectRoot, 'src')

const createStructure = () => ({
    name: 'create-structure',

    buildStart() {
        const dirs = [
            'components',
            'scripts',
            'data',
            'styles/components',
            'assets/images',
            'assets/fonts',
            'assets/icons',
        ]

        dirs.forEach(dir => {
            mkdirSync(resolve(srcDir, dir), { recursive: true })
        })
    },

    writeBundle() {
        const docsDir = resolve(projectRoot, 'docs')

        const dirs = [
            'assets/images',
            'assets/fonts',
            'assets/icons',
            'assets/js',
        ]

        dirs.forEach(dir => {
            mkdirSync(resolve(docsDir, dir), { recursive: true })
        })
    },
})

export default defineConfig({
    root: srcDir,
    base: './',

    plugins: [
        createStructure(),

        tailwindcss(),

        viteStaticCopy({
            targets: [
                {
                    src: 'assets/images/*',
                    dest: 'assets/images',
                },
            ],
        }),

        pugPlugin({
            buildLocals: {
                siteName: 'site name',
                currentYear: new Date().getFullYear(),
            },

            buildOptions: {
                basedir: srcDir,
                pretty: true,
            },
        }),
    ],

    resolve: {
        alias: {
            '@': srcDir,
            '@components': resolve(srcDir, 'components'),
            '@styles': resolve(srcDir, 'styles'),
            '@assets': resolve(srcDir, 'assets'),
            '@scripts': resolve(srcDir, 'scripts'),
            '@fonts': resolve(srcDir, 'assets/fonts'),
        },
    },

    build: {
        outDir: resolve(projectRoot, 'docs'),
        emptyOutDir: true,
        cssCodeSplit: false,

        rollupOptions: {
            input: {
                main: resolve(srcDir, 'index.pug'),
                app: resolve(srcDir, 'main.js'),
            },

            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'assets/styles.css'
                    }

                    if (assetInfo.name && /\.(woff2?|ttf|otf|eot)$/.test(assetInfo.name)) {
                        return 'assets/fonts/[name][extname]'
                    }

                    if (assetInfo.name && /\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name)) {
                        return 'assets/images/[name][extname]'
                    }

                    return 'assets/[name][extname]'
                },

                chunkFileNames: 'assets/js/[name].js',
                entryFileNames: 'assets/js/[name].js',
            },
        },
    },

    server: {
        port: 3000,
        host: true,
        open: true,
    },
})