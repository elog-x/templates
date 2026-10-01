import { defineConfig } from '@elog/cli';
import fromFeishuSpace from '@elog/plugin-from-feishu-space';
import imageLocal from '@elog/plugin-transform-image-local';
import toLocal from '@elog/plugin-to-local';
import siteMetadata from './elog.transforms';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`缺少环境变量：${name}`);
  return value;
}

export default defineConfig({
  id: 'feishu-space-astro',
  cacheFilePath: 'elog.cache.json',
  from: fromFeishuSpace({
    appId: requiredEnv('FEISHU_APP_ID'),
    appSecret: requiredEnv('FEISHU_APP_SECRET'),
    folderToken: requiredEnv('FEISHU_SPACE_FOLDER_TOKEN'),
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
