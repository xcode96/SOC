import React from 'react';

export enum ContentType {
  HEADING2 = 'h2',
  HEADING3 = 'h3',
  PARAGRAPH = 'p',
  LIST = 'ul',
  ORDERED_LIST = 'ol',
  HIGHLIGHT = 'highlight',
  SUB_LIST = 'sub_list',
  COLORED_PARAGRAPH = 'colored_p',
  TABLE = 'table',
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

export type ContentPart = string | ColoredText;

export interface PartedContent {
  parts: ContentPart[];
}

export type ListItem = string | PartedContent | { text: string; subItems: (string | PartedContent)[] };


export interface ContentBlock {
  type: ContentType;
  text?: string;
  items?: ListItem[];
  parts?: ContentPart[]; // For COLORED_PARAGRAPH
  rows?: TableCell[][]; // For TABLE
  color?: HighlightColor; // For HIGHLIGHT blocks
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

export interface HomeCard extends RawHomeCard {
  icon: React.ReactNode;
}

export interface AdminUser {
  username: string;
  password?: string;
}

export interface GuideImportData {
  homeCard: Omit<RawHomeCard, 'status' | 'href'>;
  guideData: {
    title: string;
    topics: Topic[];
  };
}
