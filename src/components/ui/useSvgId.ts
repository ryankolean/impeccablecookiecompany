import { useId } from 'react';

// SVG ids must be unique per instance and stable across the prerender and hydration,
// so they come from useId. Its colons are stripped because some engines mishandle them
// inside url(#...).
export function useSvgId(prefix: string): string {
  return `${prefix}${useId().replace(/:/g, '')}`;
}
