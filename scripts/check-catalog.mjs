import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = JSON.parse(await readFile(join(root, 'templates.json'), 'utf8'));
assert.equal(catalog.schemaVersion, 1);
const sources = ['notion', 'yuque', 'feishu-space', 'feishu-wiki'];
const targets = ['hexo', 'vitepress', 'astro'];
const expected = sources.flatMap((source) => targets.map((target) => `${source}-${target}`));
assert.deepEqual(catalog.templates.map((item) => item.id).sort(), expected.sort());
const directories = (await readdir(join(root, 'templates'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
assert.deepEqual(directories, expected);

for (const item of catalog.templates) {
  assert.equal(item.path, `templates/${item.id}`);
  const directory = join(root, item.path);
  for (const file of [
    'README.md',
    '.gitignore',
    '.env.elog.example',
    '.github/workflows/sync.yml',
    'elog.config.ts',
    'elog.transforms.ts',
    'package.json',
    'package-lock.json',
    'vercel.json',
  ]) {
    await access(join(directory, file));
  }
  const pkg = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
  assert.equal(pkg.private, true);
  assert.equal(pkg.dependencies['@elog/cli'], item.elogVersion);
  assert.equal(pkg.dependencies['@elog/plugin-transform-image-local'], item.elogVersion);
  assert.ok(
    Object.keys(pkg.dependencies).every(
      (name) => !name.startsWith('@elog/plugin-transform-image-') || name.endsWith('-local'),
    ),
  );
  for (const version of Object.values({ ...pkg.dependencies, ...pkg.devDependencies })) {
    assert.match(version, /^\d+\.\d+\.\d+(?:-[\w.]+)?$/, `${item.id}: 必须锁定确切版本`);
  }
  const env = (await readFile(join(directory, '.env.elog.example'), 'utf8')).trim().split('\n');
  assert.deepEqual(
    env,
    item.env.map((name) => `${name}=`),
  );
  const lock = JSON.parse(await readFile(join(directory, 'package-lock.json'), 'utf8'));
  assert.deepEqual(lock.packages[''].dependencies, pkg.dependencies);
  assert.deepEqual(lock.packages[''].devDependencies, pkg.devDependencies);
  assert.equal(
    JSON.parse(await readFile(join(directory, 'vercel.json'), 'utf8')).outputDirectory,
    item.outputDir,
  );
}
console.log(`模板清单与 ${catalog.templates.length} 个独立项目检查通过。`);
