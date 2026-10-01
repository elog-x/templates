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
  id: 'feishu-space-vitepress',
  cacheFilePath: 'elog.cache.json',
  from: fromFeishuSpace({
    appId: requiredEnv('FEISHU_APP_ID'),
    appSecret: requiredEnv('FEISHU_APP_SECRET'),
    folderToken: requiredEnv('FEISHU_SPACE_FOLDER_TOKEN'),
  }),
  plugins: [
    imageLocal({
      outputDir: 'docs/public/images',
      prefixKey: '/images',
      propertyImageFields: ['cover'],
    }),
    siteMetadata(),
  ],
  to: toLocal({
    outputDir: 'docs/articles',
    filename: 'urlname',
    keepToc: true,
    frontMatter: {
      enable: true,
      include: ['title', 'description', 'date', 'updated', 'tags', 'cover', 'outline'],
    },
  }),
});
