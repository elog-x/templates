import { defineConfig } from 'vitepress';
import { sidebar } from './sidebar';

export default defineConfig({
  lang: 'zh-CN',
  title: 'Notion + Elog',
  description: '使用 Elog 1.x 同步的文档站',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/articles/' },
    ],
    sidebar: { '/articles/': sidebar() },
    search: { provider: 'local' },
    outline: [2, 6],
    docFooter: { prev: '上一篇', next: '下一篇' },
  },
});
