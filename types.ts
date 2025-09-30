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

// FIX: Define types for content that can have colored parts.
export type ContentPart = string | ColoredText;

export interface PartedContent {
  parts: ContentPart[];
}

// FIX: Define a more flexible list item type that can be a string, parted content, or an item with sub-items.
export type ListItem = string | PartedContent | { text: string; subItems: (string | PartedContent)[] };


export interface ContentBlock {
  type: ContentType;
  text?: string;
  // FIX: Use the new ListItem type to allow for more complex list structures.
  items?: ListItem[];
  // FIX: Use the new ContentPart type for consistency.
  parts?: ContentPart[]; // For COLORED_PARAGRAPH
  rows?: TableCell[][]; // For TABLE
  color?: HighlightColor; // For HIGHLIGHT blocks
}

export interface Topic {
  id: string;
  title: string;
  content: ContentBlock[];
}
