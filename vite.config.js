import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: path.resolve(__dirname, './assets') + '/[!.]*', // 1️⃣
                    dest: './assets', // 2️⃣
                },
            ],
        }),
    ]
})
