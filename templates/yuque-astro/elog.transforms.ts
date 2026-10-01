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
        properties.pubDatetime = dateValue(
          properties.pubDatetime ?? properties.date,
          doc.updateTime,
        );
        if (properties.modDatetime || properties.updated) {
          properties.modDatetime = dateValue(
            properties.modDatetime ?? properties.updated,
            doc.updateTime,
          );
        }
        properties.description = String(
          properties.description || properties.excerpt || properties.title,
        );
        properties.tags = tagsValue(properties.tags);
        properties.draft =
          properties.draft === true || properties.draft === 'true' || properties.publish === false;
        properties.featured = properties.featured === true || properties.featured === 'true';
        if (!properties.ogImage && typeof properties.cover === 'string')
          properties.ogImage = properties.cover;
      }
      return docs;
    },
  };
}
