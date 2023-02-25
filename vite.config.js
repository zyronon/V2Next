import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import externalGlobals from "rollup-plugin-external-globals";
import commonjs from "rollup-plugin-commonjs";

function pathResolve(dir) {
  return resolve(__dirname, ".", dir)
}

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      "@": pathResolve("src"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ["vue"],
      plugins: [
        commonjs(),
        externalGlobals({
          vue: "Vue",
        }),
      ],
      output: {
        format: 'es',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  server: {
    open: true,
    host: '0.0.0.0',
    port: 3000,
  },
})
