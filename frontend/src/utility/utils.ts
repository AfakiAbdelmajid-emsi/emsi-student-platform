import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
// utils/extractImages.ts
export function extractImageUrls(content: any): string[] {
  const urls: string[] = [];
  
  const traverse = (node: any) => {
    if (node.type === 'image' && node.attrs?.src) {
      urls.push(node.attrs.src);
    }
    if (node.content) {
      node.content.forEach(traverse);
    }
  };

  if (content?.content) {
    content.content.forEach(traverse);
  }
  
  return urls;
}