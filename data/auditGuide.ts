import { Topic, ContentType } from '../types';

export const auditGuide: Topic[] = [
  {
    id: 'audit-introduction',
    title: 'Intro to Auditing',
    content: [
      { type: ContentType.HEADING2, text: 'What is a Cybersecurity Audit?' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'A cybersecurity audit is a ',
          { text: 'comprehensive review', color: 'green' },
          ' and analysis of an organization\'s IT infrastructure, policies, and operations. The goal is to identify threats and vulnerabilities, ensure compliance with regulations, and recommend security improvements.'
        ]
      },
      { type: ContentType.HIGHLIGHT, color: 'blue', text: 'Audits are different from vulnerability assessments; they are more formal and focus on compliance and policies.' },
    ],
  },
  {
    id: 'audit-process',
    title: 'The Audit Process',
    content: [
      { type: ContentType.HEADING2, text: 'Key Phases of a Cybersecurity Audit' },
      { type: ContentType.ORDERED_LIST, items: [
        'Planning and Scoping',
        'Information Gathering & Review',
        'Vulnerability Scanning & Penetration Testing',
        'Analysis and Reporting',
        'Remediation and Follow-up',
      ]},
    ],
  },
];
