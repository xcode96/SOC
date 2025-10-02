
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

// Fix: Replaced JSX syntax with `React.createElement` to resolve TypeScript parsing errors in a .ts file.
export const icons: Record<string, React.ReactNode> = {
    soc: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-white/80", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" })),
    powershell: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-white/80", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement('path', { d: "M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 6.5l4 4-4 4L8.5 19l5-5-5-5L7 9.5zM13 14h4v2h-4v-2z" })),
    audit: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-white/80", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" })),
    csharp: React.createElement('p', { className: "text-3xl font-bold text-white/70" }, 'C#'),
    django: React.createElement('p', { className: "text-3xl font-bold text-white/70" }, 'dj'),
    flask: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-white/80", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" })),
    flutter: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-white/80", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" })),
    'nest-js': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-white/80", viewBox: "0 0 24 24", fill: "currentColor" }, React.createElement('path', { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.89 12.42l-3.32 3.32c-.39.39-1.02.39-1.41 0l-3.32-3.32c-.5-.5-.14-1.42.59-1.42h6.53c.73 0 1.09.92.59 1.42zM12 4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z" })),
};