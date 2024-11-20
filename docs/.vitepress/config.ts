import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "V2Next",
  description: "V2Next 介绍",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   {text: 'Home', link: '/'},
    //   {text: 'Examples', link: '/markdown-examples'}
    // ],
    sidebar: [
      {
        text: '简介',
        items: [
          {text: '安装到PC浏览器', link: '/pc-install'},
          {text: '安装到手机浏览器', link: '/mobile-install'}
        ]
      }
    ],
    socialLinks: [
      {icon: 'github', link: 'https://github.com/zyronon/V2Next'}
    ],

  }
})
