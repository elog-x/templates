import { defineConfig } from '@elog/cli';
import fromFeishuWiki from '@elog/plugin-from-feishu-wiki';
import imageLocal from '@elog/plugin-transform-image-local';
import toLocal from '@elog/plugin-to-local';
import siteMetadata from './elog.transforms';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`缺少环境变量：${name}`);
  return value;
}

export default defineConfig({
  id: 'feishu-wiki-hexo',
  cacheFilePath: 'elog.cache.json',
  from: fromFeishuWiki({
    appId: requiredEnv('FEISHU_APP_ID'),
    appSecret: requiredEnv('FEISHU_APP_SECRET'),
    wikiId: requiredEnv('FEISHU_WIKI_ID'),
  }),
  plugins: [
    imageLocal({
      outputDir: 'source/images',
      prefixKey: '/images',
      propertyImageFields: ['cover'],
    }),
    siteMetadata(),
  ],
  to: toLocal({
    outputDir: 'source/_posts',
    filename: 'urlname',
    keepToc: false,
    frontMatter: {
      enable: true,
      include: [
        'title',
        'date',
        'updated',
        'tags',
        'categories',
        'cover',
        'description',
        'permalink',
        'layout',
      ],
    },
  }),
});
