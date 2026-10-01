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
  id: 'feishu-space-hexo',
  cacheFilePath: 'elog.cache.json',
  from: fromFeishuSpace({
    appId: requiredEnv('FEISHU_APP_ID'),
    appSecret: requiredEnv('FEISHU_APP_SECRET'),
    folderToken: requiredEnv('FEISHU_SPACE_FOLDER_TOKEN'),
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
