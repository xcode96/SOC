import { Topic, ContentType } from '../types';

export const powershellGuide: Topic[] = [
  {
    id: 'ps-introduction',
    title: 'Introduction to PowerShell',
    content: [
      { type: ContentType.HEADING2, text: 'What is PowerShell?' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'PowerShell is a cross-platform ',
          { text: 'task automation', color: 'blue' },
          ' and ',
          { text: 'configuration management', color: 'purple' },
          ' framework, consisting of a command-line shell and a scripting language.'
        ]
      },
      { type: ContentType.PARAGRAPH, text: 'Built on the .NET Framework, PowerShell helps IT professionals and power users control and automate the administration of the Windows operating system and applications that run on Windows.' },
      { type: ContentType.HIGHLIGHT, color: 'green', text: 'PowerShell is now open-source and available on Windows, macOS, and Linux.' },
    ],
  },
  {
    id: 'ps-cmdlets',
    title: 'Cmdlets and Syntax',
    content: [
      { type: ContentType.HEADING2, text: 'Understanding Cmdlets' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'A cmdlet (pronounced "command-let") is a lightweight command that is used in the PowerShell environment. Cmdlets follow a ',
          { text: 'Verb-Noun', color: 'yellow' },
          ' naming convention.'
        ]
      },
      { type: ContentType.HEADING3, text: 'Common Verbs:' },
      { type: ContentType.LIST, items: ['Get', 'Set', 'Start', 'Stop', 'New', 'Remove'] },
      { type: ContentType.HEADING3, text: 'Example:' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          { text: 'Get-Process', color: 'cyan' },
          ': Retrieves the processes running on the local computer.'
        ]
      },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          { text: 'Stop-Process -Name "Notepad"', color: 'red' },
          ': Stops all instances of the Notepad process.'
        ]
      },
    ],
  },
];
