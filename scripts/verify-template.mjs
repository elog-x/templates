import assert from 'node:assert/strict';
import { readFile, readdir, access, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = JSON.parse(await readFile(join(root, 'templates.json'), 'utf8'));
const [id, project] = process.argv.slice(2);
const item = catalog.templates.find((template) => template.id === id);
assert.ok(item, `未知模板：${id}`);
const directory = project ? resolve(project) : join(root, item.path);
process.chdir(directory);
for (const name of item.env) process.env[name] = 'offline-placeholder';

const require = createRequire(join(directory, 'package.json'));
const cliRequire = createRequire(require.resolve('@elog/cli'));
const corePath = cliRequire.resolve('@elog/core');
const core = await import(pathToFileURL(corePath).href);
const { bundleRequire } = await import(
  pathToFileURL(createRequire(corePath).resolve('bundle-require')).href
);
const { mod } = await bundleRequire({ filepath: join(directory, 'elog.config.ts') });
const config = mod.default;
assert.equal(config.id, item.id);
assert.equal(config.from.kind, 'from');
assert.equal(config.from.name, `from:${item.source === 'yuque' ? 'yuque-pwd' : item.source}`);
if (core.resolveConfig) {
  assert.ok(
    !core.resolveConfig(config).diagnostics.some((diagnostic) => diagnostic.level === 'error'),
  );
}

// 只替换来源下载，保留发布包的 Runtime、本地图片、元数据转换和 Local 部署。
const image =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
const fixtureId = 'elog-offline-fixture';
const docs = [
  {
    id: fixtureId,
    title: '离线验证',
    updateTime: Date.parse('2026-01-02T00:00:00.000Z'),
    bodyType: 'markdown',
    body: `# 离线验证\n\n![离线图片](${image})\n\n:::tips\n提示内容\n:::\n`,
    docStructure: [{ id: 'guide', title: '指南' }],
    properties: {
      title: '离线验证',
      urlname: fixtureId,
      date: '2026-01-01T00:00:00.000Z',
      updated: '2026-01-02T00:00:00.000Z',
      cover: image,
      tags: 'Elog,测试',
      featured: 'false',
      draft: 'false',
    },
  },
];
const fixture = {
  name: 'from:offline-fixture',
  kind: 'from',
  async download() {
    return {
      docDetailList: structuredClone(docs),
      sortedDocList: [{ id: fixtureId, updateTime: docs[0].updateTime }],
      docStatusMap: { [fixtureId]: { _status: 1, _updateIndex: 0 } },
    };
  },
};
const sync = core.sync ?? core.default;
assert.equal(typeof sync, 'function');
const result = await sync({
  ...config,
  from: fixture,
  cacheFilePath: 'elog.cache.offline.json',
  disableCache: true,
});
assert.equal(result[0].status, 'success', JSON.stringify(result));
const articlePath = join(
  directory,
  item.contentDir,
  ...(item.target === 'vitepress' ? ['指南'] : []),
  `${fixtureId}.md`,
);
const article = await readFile(articlePath, 'utf8');
assert.ok(!article.includes('data:image/'), '正文和封面必须转换为本地图片');
assert.match(article, /\/images\/[^\s)"']+\.png/);
const images = await readdir(join(directory, item.imageDir));
assert.ok(images.some((name) => name.endsWith('.png')));
if (item.target === 'astro') {
  assert.match(article, /pubDatetime:/);
  assert.match(article, /description:/);
  assert.match(article, /ogImage: \/images\//);
  assert.match(article, /draft: false/);
  assert.match(article, /featured: false/);
}
if (item.target === 'vitepress') {
  assert.ok(article.includes(':::tip\n'));
  assert.ok(!article.includes(':::tips'));
}

const build = spawnSync('npm', ['run', 'build'], {
  cwd: directory,
  stdio: 'inherit',
  env: { ...process.env, TZ: 'Asia/Shanghai' },
});
assert.equal(build.status, 0, `${id}: 构建失败`);
const output = join(directory, item.outputDir);
for (const name of images.filter((name) => name.endsWith('.png')))
  await access(join(output, 'images', name));
await access(join(output, 'index.html'));
const route =
  item.target === 'hexo'
    ? `${fixtureId}/index.html`
    : item.target === 'astro'
      ? `posts/${fixtureId}/index.html`
      : `articles/指南/${fixtureId}.html`;
const html = await readFile(join(output, route), 'utf8');
assert.ok(html.includes('离线验证'));
assert.ok(html.includes('/images/'));
await rm(join(directory, 'elog.cache.offline.json'), { force: true });
console.log(`${id}: 发布包配置加载、离线文档/图片/封面输出与网站构建通过。`);
