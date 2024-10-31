import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-Hans',
  title: "MiniBili Docs",
  description: "MiniBili 文档",

  base: '/minibili/',

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  themeConfig: {
    logo: '/icon.ico',

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/', activeMatch: '/' },
      { text: '指南', link: '/about', activeMatch: '/about/' },
      { text: 'Release', link: 'https://github.com/Z-Only/minibili/releases' },
    ],

    sidebar: [
      {
        text: '指南',
        collapsed: false,
        items: [
          { text: '简介', link: '/about' },
          { text: '开发', link: '/develop' },
          { text: '安装', link: '/install' },
          { text: '使用', link: '/use' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Z-Only/minibili' }
    ],

    footer: {
      message: '基于 GPL-3.0 许可发布',
      copyright: `版权所有 © 2024-${new Date().getFullYear()} Z`
    },

    outline: {
      label: '页面导航'
    },

    editLink: {
      pattern: 'https://github.com/Z-Only/minibili/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
        },
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
  }
})