import type { TransformPlugin } from '@elog/plugin-sdk';

function dateValue(value: unknown, fallback: unknown): string {
  const date = new Date(value as string | number);
  if (!Number.isNaN(date.getTime())) return date.toISOString();
  const backup = new Date(fallback as string | number);
  if (!Number.isNaN(backup.getTime())) return backup.toISOString();
  throw new Error('文章缺少有效的发布日期');
}

function tagsValue(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string')
    return value
      .split(/[,，]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  return [];
}

export default function siteMetadata(): TransformPlugin {
  return {
    name: 'transform:site-metadata',
    kind: 'transform',
    async transform(docs) {
      for (const doc of docs) {
        const properties = doc.properties;
        properties.title ||= doc.title;
        properties.date = dateValue(properties.date, doc.updateTime);
        properties.updated = dateValue(properties.updated, doc.updateTime);
        doc.body = doc.body
          .replace(/^:::tips(?=\s|$)/gm, ':::tip')
          .replace(/^:::success(?=\s|$)/gm, ':::tip');
      }
      return docs;
    },
  };
}
