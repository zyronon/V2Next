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
        name: 'V2EX - 超级增强',
        icon: 'https://www.google.com/s2/favicons?sz=64&domain=v2ex.com',
        namespace: 'http://tampermonkey.net/',
        match: [
          'https://*.v2ex.com/',
          'https://*.v2ex.com/?tab=*',
          'https://*.v2ex.com/t/*',
          'https://*.v2ex.com/recent*',
          'https://*.v2ex.com/go/*'
        ],
        version: '5.7',
        description: '楼中楼回复(支持感谢数排序)、自动签到、快捷回复图片和表情、列表预览内容、点击帖子弹框展示详情、对用户打标签、回复上下文、记录上次阅读位置、自定义背景、使用 SOV2EX 搜索、正文超长自动折叠、划词 base64 解码、一键@所有人,@管理员、操作按钮(感谢、收藏、回复、隐藏)异步请求、支持黑暗模式',
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
