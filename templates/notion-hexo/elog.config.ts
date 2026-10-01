import { defineConfig } from '@elog/cli';
import fromNotion from '@elog/plugin-from-notion';
import imageLocal from '@elog/plugin-transform-image-local';
import toLocal from '@elog/plugin-to-local';
import siteMetadata from './elog.transforms';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`缺少环境变量：${name}`);
  return value;
}

export default defineConfig({
  id: 'notion-hexo',
  cacheFilePath: 'elog.cache.json',
  from: fromNotion({
    token: requiredEnv('NOTION_TOKEN'),
    databaseId: requiredEnv('NOTION_DATABASE_ID'),
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
