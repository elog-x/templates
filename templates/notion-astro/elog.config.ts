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
  id: 'notion-astro',
  cacheFilePath: 'elog.cache.json',
  from: fromNotion({
    token: requiredEnv('NOTION_TOKEN'),
    databaseId: requiredEnv('NOTION_DATABASE_ID'),
  }),
  plugins: [
    imageLocal({
      outputDir: 'public/images',
      prefixKey: '/images',
      propertyImageFields: ['cover', 'ogImage'],
    }),
    siteMetadata(),
  ],
  to: toLocal({
    outputDir: 'src/content/posts',
    filename: 'urlname',
    keepToc: false,
    frontMatter: {
      enable: true,
      include: [
        'title',
        'author',
        'pubDatetime',
        'modDatetime',
        'description',
        'tags',
        'draft',
        'featured',
        'ogImage',
        'canonicalURL',
        'hideEditPost',
        'timezone',
      ],
    },
  }),
});
