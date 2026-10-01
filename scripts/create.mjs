import { cp, mkdir, readdir, rename, rm, mkdtemp, readFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = JSON.parse(await readFile(join(root, 'templates.json'), 'utf8'));
const [id, destination] = process.argv.slice(2);
const template = catalog.templates.find((item) => item.id === id);

if (!template || !destination) {
  console.error('用法：node scripts/create.mjs <模板 ID> <新项目目录>');
  console.error(`可用模板：${catalog.templates.map((item) => item.id).join(', ')}`);
  process.exitCode = 1;
} else {
  const target = resolve(destination);
  await mkdir(dirname(target), { recursive: true });
  let exists = false;
  try {
    const entries = await readdir(target);
    exists = true;
    if (entries.length) throw new Error(`目标目录不是空目录：${target}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const temporary = await mkdtemp(join(dirname(target), '.elog-template-'));
  try {
    await cp(join(root, template.path), temporary, {
      recursive: true,
      filter: (source) => {
        const path = relative(join(root, template.path), source).split('\\').join('/');
        const name = basename(source);
        if (name.startsWith('.env') && name !== '.env.elog.example') return false;
        if (/^elog\.cache.*\.json$/.test(name) || name === 'db.json' || name.endsWith('.log'))
          return false;
        if (
          path
            .split('/')
            .some((part) =>
              ['node_modules', '.git', '.idea', '.vscode', '.astro', 'dist', 'cache'].includes(
                part,
              ),
            )
        )
          return false;
        if (template.target === 'hexo' && (path === 'public' || path.startsWith('public/')))
          return false;
        if (
          template.target === 'astro' &&
          (path === 'public/pagefind' || path.startsWith('public/pagefind/'))
        )
          return false;
        return true;
      },
    });
    if (exists) {
      // 删除空目录也由 rmdir 的原子检查保护，避免覆盖并发写入的文件。
      const { rmdir } = await import('node:fs/promises');
      await rmdir(target);
    }
    await rename(temporary, target);
    console.log(`已创建 ${template.id}：${target}`);
    console.log('进入项目后运行 npm ci，然后按 README 配置环境变量。');
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
