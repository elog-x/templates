import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { DefaultTheme } from 'vitepress';

const articlesDir = fileURLToPath(new URL('../articles/', import.meta.url));

export function sidebar(directory = articlesDir, prefix = '/articles'): DefaultTheme.SidebarItem[] {
  return readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN', { numeric: true }))
    .flatMap((entry): DefaultTheme.SidebarItem[] => {
      if (entry.name.startsWith('.')) return [];
      const path = join(directory, entry.name);
      const segment = encodeURIComponent(entry.name);
      if (entry.isDirectory()) {
        const items = sidebar(path, `${prefix}/${segment}`);
        return items.length ? [{ text: entry.name, collapsed: false, items }] : [];
      }
      if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name === 'index.md') return [];
      const { data } = matter(readFileSync(path, 'utf8'));
      return [
        {
          text: String(data.title || entry.name.slice(0, -3)),
          link: `${prefix}/${segment.slice(0, -3)}`,
        },
      ];
    });
}
