import { defineConfig } from '@elog/cli';
import fromYuque from '@elog/plugin-from-yuque-pwd';
import imageLocal from '@elog/plugin-transform-image-local';
import toLocal from '@elog/plugin-to-local';
import siteMetadata from './elog.transforms';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`缺少环境变量：${name}`);
  return value;
}

export default defineConfig({
  id: 'yuque-vitepress',
  cacheFilePath: 'elog.cache.json',
  from: fromYuque({
    username: requiredEnv('YUQUE_USERNAME'),
    password: requiredEnv('YUQUE_PASSWORD'),
    login: requiredEnv('YUQUE_LOGIN'),
    repo: requiredEnv('YUQUE_REPO'),
    onlyPublished: true,
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
