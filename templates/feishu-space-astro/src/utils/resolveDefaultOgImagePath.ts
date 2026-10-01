import type { ResolvedAstroPaperConfig } from '@/types/config';
import { getAssetPath } from './withBase';

const publicFiles = import.meta.glob('/public/*', { eager: false });

export function resolveDefaultOgImagePath(config: ResolvedAstroPaperConfig): string {
  const filename = config.site.ogImage;
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    throw new Error('site.ogImage must be a filename under public/');
  }
  if (!(`/public/${filename}` in publicFiles)) {
    throw new Error(`Missing public/${filename}`);
  }
  return getAssetPath(filename);
}
