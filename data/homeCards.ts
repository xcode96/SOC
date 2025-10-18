// Import React to use React.createElement.
import React from 'react';
import type { RawHomeCard } from '../types';

export const cardData: RawHomeCard[] = [
    {
        id: 'soc',
        title: 'SOC Concepts',
        color: 'bg-red-800/80',
        tag: { name: 'CyberSec', color: 'bg-red-500/50 text-white' },
        status: 'Explore the guide',
        href: '#/guide/soc'
    },
    {
        id: 'powershell',
        title: 'PowerShell',
        color: 'bg-blue-800/80',
        tag: { name: 'Scripting', color: 'bg-blue-500/50 text-white' },
        status: 'Explore the guide',
        href: '#/guide/powershell'
    },
    {
        id: 'audit',
        title: 'Auditing',
        color: 'bg-green-800/80',
        tag: { name: 'CyberSec', color: 'bg-green-500/50 text-white' },
        status: 'Explore the guide',
        href: '#/guide/audit'
    },
    {
        id: 'csharp',
        title: 'C#',
        color: 'bg-green-700/80',
        status: 'Coming Soon',
        href: '#'
    },
    {
        id: 'django',
        title: 'Django',
        color: 'bg-emerald-900/80',
        tag: { name: 'Python', color: 'bg-emerald-600/50 text-white' },
        status: 'Coming Soon',
        href: '#'
    },
    {
        id: 'flask',
        title: 'Flask',
        color: 'bg-purple-700/80',
        tag: { name: 'Python', color: 'bg-purple-500/50 text-white' },
        status: 'Coming Soon',
        href: '#'
    },
    {
        id: 'flutter',
        title: 'Flutter',
        color: 'bg-sky-700/80',
        tag: { name: 'Dart', color: 'bg-sky-500/50 text-white' },
        status: 'Coming Soon',
        href: '#'
    },
    {
        id: 'nest-js',
        title: 'NestJS',
        color: 'bg-rose-800/80',
        status: 'Coming Soon',
        href: '#'
    },
];