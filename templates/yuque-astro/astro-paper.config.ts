import { defineAstroPaperConfig } from './src/types/config';

export default defineAstroPaperConfig({
  site: {
    url: 'https://example.com/',
    title: '语雀 + Elog',
    description: '使用 Elog 1.x 和 AstroPaper 构建的博客',
    author: 'Your Name',
    profile: 'https://example.com/about/',
    ogImage: 'default-og.jpg',
    lang: 'en',
    timezone: 'Asia/Shanghai',
  },
  features: {
    editPost: { enabled: false },
    search: 'pagefind',
  },
  socials: [],
  shareLinks: [],
});
