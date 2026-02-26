import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import DOMPurify from 'dompurify';

export interface ParsedContent {
  title: string;
  content: string; // Markdown
  textContent: string; // Plain text
  excerpt: string;
  byline: string;
  siteName: string;
  url: string;
  publishedTime?: string;
}

export class ContentParser {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '*',
    });

    // Add GitHub-flavored markdown (tables, task lists, strikethrough)
    // For now, basic turndown is fine, can be enhanced later with plugins
  }

  public parse(document: Document, url: string): ParsedContent | null {
    // Clone the document to avoid modifying the live DOM
    const clone = document.cloneNode(true) as Document;

    // Create a reader
    const reader = new Readability(clone);
    const article = reader.parse();

    if (!article) {
      return null;
    }

    // Sanitize HTML before conversion (Readability does some, but extra safety is good)
    const cleanHtml = DOMPurify.sanitize(article.content);

    // Convert to Markdown
    const markdown = this.turndownService.turndown(cleanHtml);

    return {
      title: article.title,
      content: markdown,
      textContent: article.textContent,
      excerpt: article.excerpt,
      byline: article.byline,
      siteName: article.siteName,
      url: url,
      publishedTime: article.publishedTime,
    };
  }

  public parseSelection(selection: Selection, url: string): ParsedContent | null {
    if (selection.rangeCount === 0) return null;

    const container = document.createElement('div');
    for (let i = 0; i < selection.rangeCount; i++) {
      container.appendChild(selection.getRangeAt(i).cloneContents());
    }

    // Sanitize
    const cleanHtml = DOMPurify.sanitize(container.innerHTML);

    // Convert
    const markdown = this.turndownService.turndown(cleanHtml);

    return {
      title: document.title, // Fallback
      content: markdown,
      textContent: container.textContent || '',
      excerpt: '',
      byline: '',
      siteName: '',
      url: url,
    };
  }
}
