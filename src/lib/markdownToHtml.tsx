// lib/markdownToHtml.ts

import { marked } from 'marked';

export default async function markdownToHtml(markdown: string): Promise<string> {
  return await marked(markdown);
}
