import React from 'react';

export enum ContentType {
  HEADING1 = 'h1',
  HEADING2 = 'h2',
  HEADING3 = 'h3',
  HEADING4 = 'h4',
  PARAGRAPH = 'p',
  LIST = 'ul',
  ORDERED_LIST = 'ol',
  HIGHLIGHT = 'highlight',
  SUB_LIST = 'sub_list',
  COLORED_PARAGRAPH = 'colored_p',
  TABLE = 'table',
  IMAGE = 'img',
  CODE = 'code',
  BLOCKQUOTE = 'blockquote',
  HORIZONTAL_RULE = 'hr',
  DETAILS = 'details',
  STRIKETHROUGH = 's',
  TASK_LIST = 'tasklist',
  HTML_BLOCK = 'html',
  LINK = 'link',
}

export type HighlightColor = 'green' | 'fuchsia' | 'yellow' | 'red' | 'purple' | 'blue' | 'cyan' | 'indigo';

export interface ColoredText {
    text: string;
    color: HighlightColor;
}

export interface TableCell {
    text: string;
    color?: HighlightColor;
}

export type ContentPart = string | ColoredText | { type: ContentType.STRIKETHROUGH; text: string } | { type: ContentType.LINK, text: string, href: string };

export interface PartedContent {
  parts: ContentPart[];
}

export type ListItem = string | PartedContent | { text: string; subItems: (string | PartedContent)[] } | { text: string, checked: boolean, type: ContentType.TASK_LIST };


export interface ContentBlock {
  type: ContentType;
  text?: string;
  items?: ListItem[];
  parts?: ContentPart[]; // For COLORED_PARAGRAPH
  rows?: TableCell[][]; // For TABLE
  headers?: string[]; // For TABLE
  align?: ('left' | 'center' | 'right')[]; // For TABLE
  color?: HighlightColor; // For HIGHLIGHT blocks
  src?: string; // For IMAGE
  alt?: string; // For IMAGE
  language?: string; // For CODE
  summary?: string; // For DETAILS
  children?: ContentBlock[]; // For DETAILS
  alertType?: 'note' | 'tip' | 'important' | 'warning' | 'caution'; // For BLOCKQUOTE
  html?: string; // For HTML_BLOCK
}

export interface Topic {
  id: string;
  title: string;
  content: ContentBlock[];
}

// Fix: Add RawHomeCard and HomeCard types to be used across the application.
export interface RawHomeCard {
  id: string;
  title: string;
  color: string;
  tag?: { name: string; color: string };
  status: string;
  href: string;
}

export interface AdminUser {
  username: string;
  password?: string;
}