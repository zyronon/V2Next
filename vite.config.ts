import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, {cdn} from 'vite-plugin-monkey';
import {resolve} from 'path'

function pathResolve(dir) {
  return resolve(__dirname, ".", dir)
}

export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        version: '6.8',
        name: 'V2EX - 超级增强',
        icon: 'https://www.google.com/s2/favicons?sz=64&domain=v2ex.com',
        namespace: 'http://tampermonkey.net/',
        match: [
          'https://v2ex.com/',
          'https://v2ex.com/?tab=*',
          'https://v2ex.com/t/*',
          'https://v2ex.com/recent*',
          'https://v2ex.com/go/*',
          'https://*.v2ex.com/',
          'https://*.v2ex.com/?tab=*',
          'https://*.v2ex.com/t/*',
          'https://*.v2ex.com/recent*',
          'https://*.v2ex.com/go/*'
        ],
        description: 'V2EX最现代、最好用、功能最完整的脚本。本脚本日活1300，V2EX Polish日活320，V2EX 增强日活1500，统计于2023/9/6日，数据来源：打开脚本详情，点上面的“统计数据”查看',
        author: 'zyronon',
        license: 'GPL License',
        updateURL: 'https://github.com/zyronon/v2ex-script/raw/master/dist/vite-project.user.js',
        downloadURL: 'https://github.com/zyronon/v2ex-script/raw/master/dist/vite-project.user.js',
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": pathResolve("src"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
});
