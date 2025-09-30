import { Topic, ContentType } from '../types';

export const socConcepts: Topic[] = [
  {
    id: 'toc',
    title: 'SOC Concepts and Questions',
    content: [
      { type: ContentType.HEADING2, text: 'Welcome to the Interactive SOC Guide' },
      { type: ContentType.PARAGRAPH, text: 'This guide provides a comprehensive overview of key concepts and questions related to Security Operations Centers (SOC). Use the navigation on the left to explore different topics. The content is sourced from a detailed cybersecurity document.' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'Topics cover a wide range from fundamental ideas like ',
          { text: 'IOC vs. IOA', color: 'blue' },
          ' to practical ',
          { text: 'incident response scenarios', color: 'red' },
          ' for various attack types.'
        ]
      },
      { type: ContentType.HIGHLIGHT, color: 'blue', text: 'This is an interactive guide. Click on any topic in the sidebar to begin exploring the world of cybersecurity operations!'}
    ],
  },
  {
    id: 'ioc-and-ioa',
    title: 'IOC and IOA',
    content: [
      { type: ContentType.HEADING2, text: 'Indicators of Compromise (IOC) vs. Indicators of Attack (IOA)' },
      { type: ContentType.PARAGRAPH, text: 'These are critical concepts used to detect, understand, and respond to security incidents.' },
      { type: ContentType.HEADING3, text: 'Indicators of Compromise (IOC)' },
      {
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'Definition: IOCs are pieces of ',
          { text: 'forensic data', color: 'yellow' },
          ' that suggest a ',
          { text: 'potential breach', color: 'red' },
          ' or ',
          { text: 'malicious activity', color: 'red' },
          '. They are artifacts observed on a network or in operating systems that indicate a security incident may have occurred.'
        ]
      },
      { type: ContentType.HEADING3, text: 'Examples:' },
      { type: ContentType.LIST, items: [
          // FIX: Wrapped single colored text items in 'parts' array for type consistency.
          { parts: [{ text: 'Unusual network traffic', color: 'purple' }] }, 
          { parts: [{ text: 'Malicious code signatures', color: 'red' }] }, 
          { parts: [{ text: 'IP addresses, URLs, or domain names associated with known threats', color: 'yellow' }] }
      ]},
      { type: ContentType.HEADING3, text: 'Usage:' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'IOCs help in detecting ',
          { text: 'past and ongoing intrusions.', color: 'red' },
          ' They are typically used in ',
          { text: 'reactive security measures,', color: 'yellow' },
          ' such as after a breach has been detected.'
        ]
      },
      { type: ContentType.HEADING3, text: 'Indicators of Attack (IOA)' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'Definition: IOAs focus on detecting the ',
          { text: 'intent and methods', color: 'purple' },
          ' used by attackers to achieve their objectives. Unlike IOCs, which are often specific and static, IOAs are more about understanding the ',
          { text: 'behavior and tactics', color: 'purple' },
          ' of the attacker.'
        ]
      },
      { type: ContentType.HEADING3, text: 'Examples:' },
      { type: ContentType.LIST, items: [
        'Patterns of behavior that indicate an attacker is attempting to compromise a system', 
        { parts: ['Unusual activity that aligns with known attack techniques (e.g., ', { text: 'lateral movement', color: 'purple' }, ')'] },
        'Sequence of actions that deviate from normal usage patterns', 
        { parts: ['Use of legitimate tools in unusual ways (e.g., ', { text: 'PowerShell', color: 'blue' }, ' used to download malware)'] }
      ]},
      { type: ContentType.HEADING3, text: 'Usage:' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'IOAs are used to identify and ',
          { text: 'prevent potential attacks before they cause damage.', color: 'green' },
          ' They are ',
          { text: 'proactive', color: 'green' },
          ' and help in understanding and mitigating the attacker\'s strategy and techniques.'
        ]
      },
      { type: ContentType.HEADING3, text: 'Comparison' },
      { type: ContentType.LIST, items: [
          { text: 'Focus:', subItems: ['IOCs are evidence of an incident.', 'IOAs are indicators of potential malicious activity based on behavior.'] },
          { text: 'Timeframe:', subItems: ['IOCs are often used in post-incident analysis.', 'IOAs are used for real-time or near-real-time detection and prevention.'] },
          { text: 'Nature:', subItems: ['IOCs are often static and specific.', 'IOAs are dynamic and behavior-based.'] },
      ]},
    ],
  },
  {
    id: 'threat-intelligence',
    title: 'Threat Intelligence',
    content: [
        { type: ContentType.HEADING2, text: 'Threat Intelligence' },
        { 
            type: ContentType.COLORED_PARAGRAPH,
            parts: [
                'Threat intelligence is the practice of ',
                { text: 'gathering, analyzing, and utilizing information', color: 'green' },
                ' about potential or current threats to an organization\'s security.'
            ]
        },
        { 
            type: ContentType.COLORED_PARAGRAPH,
            parts: [
                'It provides ',
                { text: 'context and actionable insights', color: 'purple' },
                ' that help organizations understand, anticipate, and defend against cyber threats.'
            ]
        },
        { type: ContentType.HEADING3, text: 'Key Aspects of Threat Intelligence' },
        { type: ContentType.ORDERED_LIST, items: [
            { text: 'Data Collection:', subItems: [
                { parts: ['Sources: Data can be collected from various sources, including ', { text: 'open-source intelligence (OSINT)', color: 'blue'}, ', ', { text: 'dark web monitoring', color: 'purple' }, ', internal logs, network traffic, and commercial threat intelligence feeds.' ]}, 
                { parts: ['Types of Data: This includes ', { text: 'IOCs,', color: 'yellow' }, ' IP addresses, URLs, malware hashes, and details about threat actors and their ', { text: 'tactics, techniques, and procedures (TTPs).', color: 'red' }] }
            ]},
            { text: 'Analysis:', subItems: ['Correlation and Context: Analyzing the collected data to find correlations, patterns, and context.', 'TTPs: Understanding the tactics, techniques, and procedures of threat actors to predict and mitigate future attacks.'] },
            { text: 'Utilization:', subItems: ['Proactive Defense: Using threat intelligence to anticipate and prevent potential threats by strengthening defenses.', 'Incident Response: Leveraging threat intelligence during and after an incident to understand the attack, identify attackers, and take appropriate remediation steps.'] },
        ] },
        { type: ContentType.HEADING3, text: 'Benefits of Threat Intelligence' },
        { type: ContentType.LIST, items: ['Faster Response', 'Risk Mitigation', 'Enhanced Detection and Prevention', 'Informed Decision-Making'] },
        { type: ContentType.HEADING3, text: 'Well-known Threat Intelligence sources:' },
        { type: ContentType.LIST, items: ['IBM X-Force Exchange', 'Cisco Talos Intelligence', 'AbuseIPDB', 'Virustotal'] },
    ],
  },
  {
    id: 'system-hardening',
    title: 'System Hardening',
    content: [
      { type: ContentType.HEADING2, text: 'System Hardening' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'System hardening is the process of securing a computer system by ',
            { text: 'reducing its surface of vulnerability.', color: 'yellow' }
        ]
      },
      {
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'This involves configuring the system to ',
            { text: 'minimize potential attack vectors,', color: 'red' },
            ' removing unnecessary services and software, and applying security measures to protect against threats.'
        ]
      },
      { type: ContentType.HEADING3, text: 'Steps in System Hardening' },
      { type: ContentType.ORDERED_LIST, items: [
        { text: 'Remove Unnecessary Services and Software:', subItems: ['Disable Unneeded Services.', 'Uninstall Unnecessary Software.'] },
        { text: 'Apply Security Patches and Updates:', subItems: ['Regular Updates.', 'Automated Updates.'] },
        { text: 'User Accounts and Authentication:', subItems: ['Strong Password Policies.', 'Limit Administrative Privileges.', { parts: [{ text: 'Multi-Factor Authentication (MFA).', color: 'green' }] }] },
        { text: 'Network Security Measures:', subItems: [
            { parts: [{ text: 'Firewalls:', color: 'blue' }, ' Configure firewalls to control incoming and outgoing traffic.'] }, 
            { parts: [{ text: 'Intrusion Detection and Prevention Systems (IDPS):', color: 'blue' }, ' Deploy IDPS to monitor network traffic for suspicious activity.'] }
        ]},
        { text: 'Implement Logging and Monitoring:', subItems: ['System Logs.', 'Monitoring Tools.'] },
        { text: 'Data Protection:', subItems: ['Encryption.', 'Backup.'] },
      ]},
      { type: ContentType.HEADING3, text: 'Benefits of System Hardening' },
      { type: ContentType.LIST, items: [
        'Reduced Attack Surface: By minimizing potential entry points, it becomes more difficult for attackers to exploit vulnerabilities.',
        'Performance: Removing unnecessary services and software can improve system performance and stability.',
        'Improved Security Posture.'
      ]},
    ],
  },
  {
    id: 'privilege-escalation',
    title: 'Privilege Escalation',
    content: [
      { type: ContentType.HEADING2, text: 'Privilege Escalation' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'A crucial step in many cyber-attacks, allowing an attacker to move from a ',
            { text: 'lower-privileged account', color: 'yellow' },
            ' to a ',
            { text: 'higher-privileged account', color: 'red' },
            ' (e.g., administrator or root).'
        ]
      },
      { type: ContentType.HEADING3, text: 'Types of Privilege Escalation' },
      { type: ContentType.LIST, items: [
        { text: 'Vertical Privilege Escalation:', subItems: [{ parts: ['An attacker gains ', { text: 'higher-level privileges.', color: 'red' }, ' E.g., a normal user gaining administrative rights.'] }] },
        { text: 'Horizontal Privilege Escalation:', subItems: [{ parts: ['An attacker accesses resources of other users with ', { text: 'similar privileges.', color: 'purple' }, ' E.g., accessing another user’s data.'] }] },
      ]},
      { type: ContentType.HEADING3, text: 'Common Methods' },
      { type: ContentType.ORDERED_LIST, items: [
        { text: 'Exploiting Software Vulnerabilities:', subItems: ['Buffer Overflow', 'Zero-day Exploits'] },
        { text: 'Misconfigurations:', subItems: ['Insecure Permissions'] },
        { text: 'Credential Theft:', subItems: ['Keylogging', 'Pass-the-Hash'] },
        { text: 'Social Engineering:', subItems: ['Phishing'] },
        { text: 'Malicious Software:', subItems: ['Trojan Horses and Rootkits'] },
      ]},
      { type: ContentType.HEADING3, text: 'Preventive Measures' },
      { type: ContentType.LIST, items: [
        'Patch Management',
        'Principle of Least Privilege',
        'Strong Authentication: Multi-Factor Authentication (MFA) and Secure Credential Storage'
      ]},
    ],
  },
  {
    id: 'persistence',
    title: 'Persistence',
    content: [
      { type: ContentType.HEADING2, text: 'Persistence' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'Persistence refers to the techniques used by attackers to ',
          { text: 'maintain their foothold', color: 'red' },
          ' on a compromised system, even after restarts, user logouts, or other attempts to disrupt their access.'
        ]
      },
      { type: ContentType.HEADING3, text: 'Methods of Persistence' },
      { type: ContentType.ORDERED_LIST, items: [
        { text: 'AutoStart Entries:', subItems: [
            { parts: [{ text: 'Registry Keys (Windows):', color: 'blue' }, ' Modifying registry keys to launch malicious programs at startup.'] }, 
            { parts: [{ text: 'Startup Folders (Windows):', color: 'blue' }, ' Placing malicious shortcuts in startup folders.'] }
        ]},
        { text: 'Scheduled Tasks:', subItems: [{ parts: [{ text: 'Task Scheduler (Windows):', color: 'blue' }, ' Creating tasks to execute malicious payloads.'] }] },
        { text: 'Rootkits:', subItems: ['Installing rootkits to hide malicious software and provide ongoing access.'] },
        { text: 'User and System Accounts:', subItems: ['Backdoor Accounts', 'Credential Theft'] },
        { text: 'DLL Injection and Hijacking:', subItems: ['DLL Injection', 'DLL Hijacking'] },
        { text: 'Network-based Persistence:', subItems: [
            { parts: [{ text: 'Remote Access Trojans (RATs):', color: 'red' }, ' Using RATs to maintain remote control.'] }, 
            { parts: [{ text: 'Command and Control (C2) Channels:', color: 'purple' }, ' Establishing covert communication channels.'] }
        ]},
      ]},
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'Understanding and detecting persistence mechanisms is ',
            { text: 'essential for effective incident response', color: 'green' },
            ' and system hardening efforts.'
        ]
      }
    ],
  },
  {
    id: 'lateral-movement',
    title: 'Lateral Movement',
    content: [
      { type: ContentType.HEADING2, text: 'Lateral Movement' },
      {
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'Techniques used by attackers to ',
            { text: 'move within a network', color: 'purple' },
            ' after initially compromising a system. This allows them to gain access to additional systems and data.'
        ]
      },
      {
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'Lateral movement is a critical phase in many ',
            { text: 'advanced persistent threats (APTs)', color: 'red' },
            ' and can be difficult to detect because it often involves using ',
            { text: 'legitimate credentials and tools.', color: 'yellow' }
        ]
      },
      { type: ContentType.HEADING3, text: 'Techniques for Lateral Movement' },
      { type: ContentType.ORDERED_LIST, items: [
        { text: 'Credential Dumping:', subItems: [{ parts: ['Extracting credentials using tools like ', { text: 'Mimikatz', color: 'red' }, ' and ', { text: 'WCE.', color: 'red' }]}] },
        { text: 'Pass-the-Hash:', subItems: ['Using hashed credentials to authenticate without needing to decrypt them.'] },
        { text: 'Pass-the-Ticket:', subItems: ['Using Kerberos tickets to authenticate.'] },
        { text: 'Remote Execution:', subItems: [{ parts: ['Using tools like ', { text: 'PsExec, WMI, RDP,', color: 'blue' }, ' and ', { text: 'SSH', color: 'blue' }, ' to execute commands remotely.'] }] },
        'Service Creation: Creating or modifying services on remote systems.'
      ]},
      { type: ContentType.HEADING3, text: 'Detecting and Preventing Lateral Movement' },
      { type: ContentType.ORDERED_LIST, items: [
        'Network Segmentation',
        'Least Privilege Principle',
        'Monitoring and Logging',
        'Multi-Factor Authentication (MFA)',
        'Behavioral Analysis',
        { parts: [{ text: 'Endpoint Detection and Response (EDR)', color: 'green' }] },
        'Patch Management',
        'Regular Audits and Penetration Testing'
      ]},
    ],
  },
  {
    id: 'incident-response',
    title: 'SANS Incident Response Steps',
    content: [
        { type: ContentType.HEADING2, text: 'SANS Incident Response Steps' },
        { type: ContentType.ORDERED_LIST, items: [
            { text: 'Preparation', subItems: ['Establish Policies and Procedures', 'Form Incident Response Team', 'Tools and Resources', 'Training and Awareness'] },
            { text: 'Identification', subItems: ['Incident Notification', 'Initial Triage'] },
            { text: 'Containment', subItems: ['Contain the Incident', 'Isolation'] },
            { text: 'Eradication', subItems: ['Root Cause Analysis', 'Remediation'] },
            { text: 'Recovery', subItems: ['Data Restoration', 'System Validation'] },
            { text: 'Lessons Learned', subItems: ['Post-Incident Review', 'Documentation', 'Continuous Improvement'] },
        ] },
        { type: ContentType.HEADING3, text: 'Reporting and Communication' },
        { type: ContentType.LIST, items: ['Internal Reporting.', 'External Reporting.']}
    ],
  },
   {
    id: 'log-types',
    title: 'Type of Logs',
    content: [
      { type: ContentType.HEADING2, text: 'Type of Logs' },
      { type: ContentType.LIST, items: [
        { text: 'System Logs:', subItems: ['Record events related to the OS, such as boot events, shutdowns, crashes, and updates.'] },
        { text: 'Application Logs:', subItems: ['Capture events related to applications. E.g., web servers, database servers.'] },
        { text: 'Security Logs:', subItems: [{ parts: ['Record security-related events like authentication attempts, policy changes. E.g., ', { text: 'Firewall logs, IDS/IPS logs, antivirus logs.', color: 'green' }] }] },
        { text: 'Network Logs:', subItems: [{ parts: ['Capture data about network traffic. E.g., router logs, VPN logs, ', { text: 'NetFlow, sFlow.', color: 'blue' }] }] },
        { text: 'Web Server Logs:', subItems: ['Record HTTP requests and responses. E.g., access logs, error logs.'] },
        { text: 'Database Logs:', subItems: ['Capture events related to database operations. E.g., SQL query logs, transaction logs.'] },
        { text: 'Email Logs:', subItems: [{ parts: ['Record email transactions. E.g., ', { text: 'SMTP logs,', color: 'blue' }, ' mail server logs.'] }] },
        { text: 'Authentication Logs:', subItems: [{ parts: ['Capture details about authentication attempts. E.g., login attempts, ', { text: 'MFA events.', color: 'green' }] }] },
        { text: 'Endpoint Logs:', subItems: [{ parts: ['Record events on endpoint devices. E.g., Antivirus scans, ', { text: 'EDR logs.', color: 'green' }] }] },
      ]},
    ],
  },
   {
    id: 'protocol-logs',
    title: 'Protocol Logs',
    content: [
      { type: ContentType.HEADING2, text: 'Protocol Logs' },
      { type: ContentType.HEADING3, text: '1. HTTP/HTTPS Logs' },
      { type: ContentType.LIST, items: ['Access Logs', 'Error Logs'] },
      { type: ContentType.HEADING3, text: '2. DNS Logs' },
      { type: ContentType.LIST, items: ['Query Logs', 'Response Logs'] },
      { type: ContentType.HEADING3, text: '3. SMTP Logs' },
      { type: ContentType.LIST, items: ['Mail Server Logs'] },
      { type: ContentType.HEADING3, text: '4. FTP Logs' },
      { type: ContentType.LIST, items: ['Transfer Logs'] },
      { type: ContentType.HEADING3, text: '5. SSH Logs' },
      { type: ContentType.LIST, items: ['Authentication Logs', 'Command Execution Logs'] },
      { type: ContentType.HEADING3, text: '6. IMAP/POP3 Logs' },
      { type: ContentType.LIST, items: ['Connection Logs'] },
      { type: ContentType.HEADING3, text: '7. Kerberos Logs' },
      { type: ContentType.LIST, items: ['Ticket Granting Logs'] },
    ]
   },
  {
    id: 'windows-logs',
    title: 'Windows Logs',
    content: [
      { type: ContentType.HEADING2, text: 'Windows Logs' },
      { type: ContentType.PARAGRAPH, text: 'Providing detailed information about system events, user activities, security incidents, and application behavior.' },
      { type: ContentType.HEADING3, text: 'Log Categories' },
      { type: ContentType.LIST, items: ['System Logs', 'Application Logs', 'Security Logs', 'Setup Logs'] },
      { type: ContentType.HEADING2, text: 'Common Event IDs' },
      { type: ContentType.HEADING3, text: 'Security Logs' },
      { type: ContentType.LIST, items: [
          { parts: [{ text: '4624:', color: 'green' }, ' An account was successfully logged on.'] },
          { parts: [{ text: '4625:', color: 'red' }, ' An account failed to log on.'] },
          { parts: [{ text: '4648:', color: 'yellow' }, ' A logon was attempted using explicit credentials.'] },
          { parts: [{ text: '4672:', color: 'blue' }, ' Special privileges assigned to a new logon.'] },
          { parts: [{ text: '4720:', color: 'green' }, ' A user account was created.'] },
          { parts: [{ text: '4723:', color: 'yellow' }, ' An attempt was made to change an account\'s password.'] },
          { parts: [{ text: '4740:', color: 'red' }, ' A user account was locked out.'] }
      ]},
      { type: ContentType.HEADING3, text: 'System Logs' },
      { type: ContentType.LIST, items: ['6005: The event log service was started.', '6006: The event log service was stopped.', '6008: The previous system shutdown was unexpected.', '41: The system has rebooted without cleanly shutting down first (Kernel-Power).'] },
      { type: ContentType.HEADING3, text: 'Account Management Event IDs' },
      { type: ContentType.LIST, items: ['4722: User account enabled.', '4725: User account disabled.', '4726: User account deleted.', '4732: Member added to local group.', '4733: Member removed from local group.'] },
      { type: ContentType.HEADING3, text: 'Process Tracking Events' },
      { type: ContentType.LIST, items: ['4688: A new process has been created.', '4689: A process has existed.'] },
    ],
  },
  {
    id: 'kerberos-sam-ntlm',
    title: 'Kerberos, SAM, NTLM',
    content: [
      { type: ContentType.HEADING2, text: 'Kerberos' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'A network authentication protocol for ',
            { text: 'strong authentication', color: 'green' },
            ' using secret-key cryptography.'
        ]
      },
      { type: ContentType.HEADING3, text: 'Main Components' },
      { type: ContentType.LIST, items: ['Authentication Server (AS)', 'Database', 'Ticket Granting Server (TGS)'] },
      { type: ContentType.HEADING3, text: 'Common Kerberos Attacks' },
      { type: ContentType.LIST, items: [
          { parts: [{ text: 'Pass-the-Ticket (PtT)', color: 'red' }] },
          { parts: [{ text: 'Pass-the-Hash (PtH)', color: 'red' }] },
          { parts: [{ text: 'Overpass-the-Hash (Pass-the-Key)', color: 'red' }] },
          { parts: [{ text: 'Golden Ticket Attack', color: 'red' }] }
      ]},
      
      { type: ContentType.HEADING2, text: 'SAM (Security Accounts Manager)' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'A database file in Windows that stores user account info, including ',
          { text: 'hashed passwords', color: 'yellow' },
          ' for local users.'
        ]
      },
      { type: ContentType.LIST, items: [
        'Location: `C:\\Windows\\System32\\config`',
        'Function: Authenticates local user logins.',
        { parts: ['Security: Accessible by processes like ', { text: 'LSASS.', color: 'blue' }] }
      ]},

      { type: ContentType.HEADING2, text: 'NTLM (NT LAN Manager)' },
      { type: ContentType.COLORED_PARAGRAPH,
        parts: [
          'A legacy Microsoft authentication protocol. It is a ',
          { text: 'challenge-response', color: 'purple' },
          ' protocol.'
        ]
      },
      { type: ContentType.LIST, items: [
        'Use Cases: Local logins, workgroup environments, backward compatibility.',
        { parts: ['Security Concerns: Susceptible to ', { text: 'relay attacks, pass-the-hash attacks,', color: 'red' }, ' and ', { text: 'brute-force attacks.', color: 'red' }, { text: ' Kerberos is preferred.', color: 'green' }] }
      ]},
    ],
  },
  {
    id: 'phishing',
    title: 'Phishing',
    content: [
      { type: ContentType.HEADING2, text: 'Phishing Emails' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'A type of cyber-attack where attackers ',
            { text: 'disguise themselves as legitimate entities', color: 'purple' },
            ' to trick individuals into revealing sensitive information.'
        ]
      },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'These emails often contain ',
            { text: 'malicious links or attachments', color: 'red' },
            ' that can install malware or direct the user to fraudulent websites.'
        ]
      },
      { type: ContentType.HEADING3, text: 'Types of Phishing' },
      { type: ContentType.LIST, items: [
          { parts: [{ text: 'Spear Phishing:', color: 'red' }, ' Targeted at specific individuals or organizations.'] },
          { parts: [{ text: 'Clone Phishing:', color: 'yellow' }, ' A copy of a legitimate email with malicious links.'] },
          { parts: [{ text: 'Whaling:', color: 'red' }, ' Targets high-profile individuals like executives.'] },
          { parts: [{ text: 'Vishing and Smishing:', color: 'purple' }, ' Phishing using voice calls or SMS text messages.'] }
      ]},
      { type: ContentType.HEADING3, text: 'Common Tactics' },
      { type: ContentType.LIST, items: [
          'Urgency and Fear',
          'Spoofed Sender Addresses',
          'Compelling Subject Lines',
          'Malicious Links and Attachments'
      ]},
       { type: ContentType.HEADING3, text: 'Defense Against Phishing' },
       { type: ContentType.ORDERED_LIST, items: [
           'User Education and Training',
           'Email Filtering and Anti-Phishing Tools',
           { parts: [{ text: 'Multi-Factor Authentication (MFA)', color: 'green' }] },
           'Secure Email Gateways',
           { parts: ['Email Authentication Protocols (', { text: 'SPF, DKIM, DMARC', color: 'blue' }, ')'] }
       ]},
       { type: ContentType.HIGHLIGHT, color: 'green', text: 'To identify a phishing email, check the sender\'s address, hover over links, look for grammar mistakes, and be wary of urgent requests.'}
    ],
  },
  {
    id: 'siem',
    title: 'SIEM Solutions',
    content: [
      { type: ContentType.HEADING2, text: 'SIEM Solutions' },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'SIEM stands for ',
            { text: 'Security Information and Event Management.', color: 'green' }
        ]
      },
      { 
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
            'A ',
            { text: 'centralized solution', color: 'purple' },
            ' that analyzes event logs for threat monitoring and incident response.'
        ]
      },
      { type: ContentType.HEADING3, text: 'Key Functions' },
      { type: ContentType.ORDERED_LIST, items: [
          'Data Collection',
          'Normalization and Parsing',
          'Alerting and Monitoring',
          'Incident Detection and Response',
          'Forensic Analysis',
          'Compliance Reporting',
          { parts: [{ text: 'User and Entity Behavior Analytics (UEBA)', color: 'blue' }] }
      ]},
      { type: ContentType.HEADING3, text: 'Benefits' },
      { type: ContentType.LIST, items: [
          'Centralized Visibility',
          'Early Threat Detection',
          'Response Efficiency',
          'Compliance Support'
      ]},
      { type: ContentType.HEADING3, text: 'Challenges' },
      { type: ContentType.LIST, items: [
          'Complexity',
          'Tuning and False Positives',
          'Skill Requirements'
      ]},
    ],
  },
  {
    id: 'vulnerabilities',
    title: 'Common Vulnerabilities',
    content: [
        { type: ContentType.HEADING2, text: 'Examples of Common Security Vulnerabilities' },
        { type: ContentType.ORDERED_LIST, items: [
            { parts: [{ text: 'Unpatched Software', color: 'yellow' }] },
            { parts: [{ text: 'Weak Passwords', color: 'yellow' }] },
            { parts: [{ text: 'Lack of Encryption', color: 'yellow' }] },
            { parts: [{ text: 'SQL Injection', color: 'red' }] },
            { parts: [{ text: 'Cross-Site Scripting (XSS)', color: 'red' }] },
            { parts: [{ text: 'Phishing', color: 'purple' }] },
            { parts: [{ text: 'Insider Threats', color: 'purple' }] },
            { parts: [{ text: 'Social Engineering', color: 'purple' }] },
            { parts: [{ text: 'Remote Work Risks', color: 'yellow' }] },
        ]}
    ]
  },
  {
    id: 'attack-response',
    title: 'Incident Response for Attacks',
    content: [
        { type: ContentType.HEADING2, text: 'Incident Response for Common Attack Types' },
        { type: ContentType.HEADING3, text: '1. Brute Forcing' },
        { type: ContentType.LIST, items: [
            {text: 'Details:', subItems: ['Attacker tries to guess a password by attempting many possibilities.']},
            {text: 'Indicators:', subItems: ['Multiple login failures in a short period.']},
            {text: 'Investigate:', subItems: ['Active Directory, Application, and OS logs.']},
            {text: 'Actions:', subItems: ['Disable the account and block the attacker IP.']},
        ]},
        { type: ContentType.HEADING3, text: '2. Botnets' },
        { type: ContentType.LIST, items: [
            {text: 'Details:', subItems: ['Victim server is used to perform DDoS attacks or other malicious activities.']},
            {text: 'Indicators:', subItems: ['Connection to suspicious IPs', 'Abnormal high volume of network traffic.']},
            {text: 'Investigate:', subItems: ['Network traffic, OS logs (new processes).']},
            {text: 'Actions:', subItems: ['Isolate the server', 'Remove malicious processes', 'Patch the vulnerability.']},
        ]},
        { type: ContentType.HEADING3, text: '3. Ransomware' },
        { type: ContentType.LIST, items: [
            {text: 'Details:', subItems: ['Malware that encrypts files and requests a ransom.']},
            {text: 'Indicators:', subItems: ['Anti-Virus alerts', 'Connection to suspicious IPs.']},
            {text: 'Investigate:', subItems: ['AV logs, OS logs, Account logs, Network traffic.']},
            {text: 'Actions:', subItems: ['Request AV checks', 'Isolate the machine.']},
        ]},
        { type: ContentType.HEADING3, text: '4. Data Exfiltration' },
         { type: ContentType.LIST, items: [
            {text: 'Details:', subItems: ['Attacker or rogue employee exfiltrates data to external sources.']},
            {text: 'Indicators:', subItems: ['Abnormal high network traffic', 'Connection to cloud-storage solutions.']},
            {text: 'Investigate:', subItems: ['Network traffic, Proxy logs, OS logs.']},
            {text: 'Actions:', subItems: ['If employee: Contact manager, perform forensics. If external: Isolate the machine.']},
        ]},
        { type: ContentType.HEADING3, text: '5. Advanced Persistent Threats (APTs)' },
        { type: ContentType.LIST, items: [
            {text: 'Details:', subItems: ['Attackers gain access and create backdoors for further exploitation. Usually hard to detect.']},
            {text: 'Indicators:', subItems: ['Suspicious IP connections', 'Abnormal network traffic', 'Off-hour’s access logs', 'New admin accounts.']},
            {text: 'Investigate:', subItems: ['Network traffic, Access logs, OS logs (new processes, connections, users).']},
            {text: 'Actions:', subItems: ['Isolate the machine and start formal forensics process.']},
        ]},
    ]
  },
  {
    id: 'osi-attacks',
    title: 'OSI Layer Attacks',
    content: [
      { type: ContentType.HEADING2, text: 'OSI Layer Attacks' },
      { type: ContentType.LIST, items: [
        { text: '(2) Data Link Layer', subItems: ['ARP Spoofing/Poisoning', 'MAC Flooding'] },
        { text: '(3) Network Layer', subItems: ['IP Spoofing', 'Smurf Attack', 'ICMP Flooding', 'DHCP Spoofing'] },
        { text: '(4) Transport Layer', subItems: ['TCP SYN Flood', 'TCP Session Hijacking', 'TCP Reset attack', 'UDP Flooding'] },
        { text: '(5) Session Layer', subItems: ['Session Hijacking'] },
        { text: '(6) Presentation Layer', subItems: ['SSL/TLS Striping'] },
        { text: '(7) Application Layer', subItems: ['DNS Attacks', 'HTTP/HTTPS (Web Attacks)', 'FTP Attacks', 'TELNET Attacks'] },
      ]}
    ]
  },
  {
    id: 'detection-categories',
    title: 'Detection Categories',
    content: [
      { type: ContentType.HEADING2, text: 'Detection Categories' },
      {
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          '1. A ',
          { text: 'true positive', color: 'green' },
          ' is an ',
          { text: 'alert', color: 'green' },
          ' that correctly detects the presence of an attack.'
        ]
      },
      {
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          '2. A ',
          { text: 'true negative', color: 'fuchsia' },
          ' is when no malicious activity exists, and ',
          { text: 'no alert', color: 'fuchsia' },
          ' is triggered.'
        ]
      },
      {
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          '3. A ',
          { text: 'false positive', color: 'yellow' },
          ' is an alert that incorrectly detects a threat. This is when an IDS identifies an activity as malicious, but it isn\'t.'
        ]
      },
      {
        type: ContentType.COLORED_PARAGRAPH,
        parts: [
          '4. A ',
          { text: 'false negative', color: 'red' },
          ' is a state where a threat is not detected. This is when malicious activity happens but an IDS fails to detect it. False negatives are dangerous.'
        ]
      },
      {
          type: ContentType.TABLE,
          rows: [
              [ { text: 'Positive', color: 'green' }, { text: 'There is an Alert' } ],
              [ { text: 'Negative', color: 'fuchsia' }, { text: 'There is no Alert' } ]
          ]
      }
    ]
  },
  {
    id: 'edr-vs-xdr',
    title: 'EDR vs XDR',
    content: [
      { type: ContentType.HEADING2, text: 'EDR (Endpoint Detection and Response)' },
      { type: ContentType.LIST, items: [
        // FIX: Combined mixed string and object array into a single 'parts' array for type consistency.
        { text: 'Focus:', subItems: [{ parts: ['Monitors and responds to threats at the ', { text: 'endpoint level', color: 'blue' }, ' (computers, servers).'] }] },
        { text: 'Capabilities:', subItems: ['Endpoint Visibility', 'Threat Detection', 'Incident Response', 'Forensic Analysis', 'Endpoint Isolation'] },
      ]},
      { type: ContentType.HEADING2, text: 'XDR (Extended Detection and Response)' },
      { type: ContentType.LIST, items: [
        // FIX: Combined mixed string and object array into a single 'parts' array for type consistency.
        { text: 'Scope:', subItems: [{ parts: ['Expands ', { text: 'beyond endpoints', color: 'purple' }, ' to integrate and correlate data from multiple security layers (endpoints, networks, email, cloud).'] }] },
        { text: 'Capabilities:', subItems: ['Unified Visibility', 'Automated Response', 'Advanced Analytics'] },
      ]},
      { type: ContentType.HIGHLIGHT, color: 'blue', text: 'Summary: EDR is focused on endpoints. XDR provides a more comprehensive, cross-layer view of threats by integrating data from many different security sources.'}
    ]
  },
  {
    id: 'attack-scenarios',
    title: 'Attack Scenarios',
    content: [
        { type: ContentType.HEADING2, text: 'Scenario 1: Ransomware Attack' },
        { type: ContentType.HEADING3, text: 'Detection' },
        { type: ContentType.ORDERED_LIST, items: [
            'Notice Early Signs: Ransom message, inaccessible files, slow performance.',
            'Isolate the Device: Disconnect from the network immediately.',
            'Use Security Software: Run an antivirus/anti-malware scan.',
            'Check Logs and Suspicious Activities.',
        ]},
        { type: ContentType.HEADING3, text: 'Mitigation' },
        { type: ContentType.ORDERED_LIST, items: [
            'Isolate Suspicious Files.',
            'Restore from Backup.',
            'Clean the Device.',
        ]},
        { type: ContentType.HIGHLIGHT, color: 'green', text: 'Log Sources: Firewall Logs, Network logs, and Antivirus/Anti-malware Logs.' },
        
        { type: ContentType.HEADING2, text: 'Scenario 2: Phishing Attack' },
        { type: ContentType.PARAGRAPH, text: 'An employee receives a deceptive email prompting them to click a link or download an attachment.'},
        { type: ContentType.HEADING3, text: 'Response' },
        { type: ContentType.ORDERED_LIST, items: [
            'Identify the Phishing Email.',
            'Contain and Report: Report to IT, delete the email, block the sender.',
            'Scan for Malware if an attachment was downloaded.',
            'Educate users with regular training.'
        ]},
        { type: ContentType.HIGHLIGHT, color: 'green', text: 'Logs to Check: Email Server Logs, Firewall Logs, Endpoint Security Logs.' },

        { type: ContentType.HEADING2, text: 'Scenario 3: Data Breach' },
        { type: ContentType.PARAGRAPH, text: 'Sensitive information is accessed or stolen by an unauthorized party.' },
        { type: ContentType.HEADING3, text: 'Response' },
        { type: ContentType.ORDERED_LIST, items: [
            'Contain the Breach: Disconnect affected systems from the network.',
            'Identify and Close Vulnerabilities: Investigate and patch.',
            'Notify Affected Parties.',
            'Improve Security.'
        ]},
        { type: ContentType.HIGHLIGHT, color: 'green', text: 'Logs to Check: Access Logs, System Event Logs, Network Logs.' },
    ]
  },
];
