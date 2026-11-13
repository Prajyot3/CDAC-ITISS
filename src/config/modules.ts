import { CourseSection, ITISSModule } from '../types/module';

export const COURSE_SECTIONS: CourseSection[] = [
  {
    id: 'section-a',
    number: 'SECTION A',
    title: 'Course Focus',
    description: 'Core foundational architectures spanning enterprise networking, operating systems internals, system administration, and advanced programming concepts.'
  },
  {
    id: 'section-b',
    number: 'SECTION B',
    title: 'Infrastructure Security with DevOps and Cyber Forensics',
    description: 'DevOps pipelines, cloud infrastructure hardening, forensic data acquisition, evidence preservation, and cryptographic public key infrastructure.'
  },
  {
    id: 'section-c',
    number: 'SECTION C',
    title: 'Network Defense and Cyber Security with Compliance Audit',
    description: 'Defensive network architecture, intrusion prevention, regulatory audit frameworks (ISO/IEC 27001, CERT-In), and threat countermeasures.'
  },
  {
    id: 'section-d',
    number: 'SECTION D',
    title: 'Employability Skills',
    description: 'Analytical aptitude, quantitative problem solving, technical communication, and interpersonal engineering readiness.'
  },
  {
    id: 'section-e',
    number: 'SECTION E',
    title: 'Project',
    description: 'End-to-end applied cybersecurity capstone project demonstrating infrastructure deployment, vulnerability assessment, and defense.'
  }
];

export const ITISS_MODULES: ITISSModule[] = [
  // SECTION A: Course Focus
  {
    id: 'fcn',
    number: 1,
    code: 'FCN',
    name: 'Fundamentals of Computer Networks (FCN)',
    sectionId: 'section-a',
    sectionName: 'SECTION A: Course Focus',
    duration: '120 Hours',
    status: 'AVAILABLE',
    slug: 'fcn',
    route: '/modules/fcn',
    description: 'Comprehensive study of network models, layered protocols, subnetting, IPv4/IPv6 architectures, routing protocols, switching loops, VLANs, NAT, and wireless network security.',
    topics: [
      'OSI Model',
      'TCP/IP',
      'IPv4 and IPv6',
      'Subnetting',
      'Routing',
      'Switching',
      'VLAN',
      'NAT',
      'DNS and DHCP',
      'WAN',
      'Wireless Networks',
      'Network Security',
      'Networking Protocols'
    ],
    syllabusPoints: [
      'OSI 7-Layer Reference Model and TCP/IP Architecture',
      'Physical Media: UTP, STP, Coaxial, and Single/Multi-mode Fiber Optics',
      'Data Link Protocols: Ethernet Frames (802.3), MAC Addressing, Token Ring (802.5)',
      'Network Layer: IPv4/IPv6 Addressing, Subnet Masking, VLSM, CIDR, and EUI-64',
      'Routing Protocols: RIP v1/v2, OSPF, EIGRP, Administrative Distance, and Metric Evaluation',
      'Switching & VLANs: Spanning Tree Protocol (802.1D STP), VTP, and 802.1Q Encapsulation',
      'Transport Layer: TCP Three-Way Handshake, Windowing, Flow Control, and UDP Datagrams',
      'Network Services & Security: NAT/PAT, DHCP DORA Process, DNS Resolution, and ACL Configuration'
    ]
  },
  {
    id: 'os',
    number: 2,
    code: 'OS-ADMIN',
    name: 'Concepts of Operating System and Administration',
    sectionId: 'section-a',
    sectionName: 'SECTION A: Course Focus',
    duration: '210 Hours',
    status: 'AVAILABLE',
    slug: 'os',
    route: '/modules/os',
    description: 'In-depth exploration of Linux and Windows Server administration, kernel architecture, process management, memory virtual memory management, filesystem hierarchies, shell scripting, and PAM authentication.',
    topics: [
      'OS Fundamentals',
      'Process Management',
      'CPU Scheduling',
      'Memory Management',
      'Deadlock and Synchronization',
      'File Systems',
      'Linux Administration',
      'Network Services',
      'Security and Permissions',
      'Windows Administration'
    ],
    syllabusPoints: [
      'Operating System Architectures, Monolithic vs Microkernel Design',
      'Process Scheduling, IPC, Threads, Concurrency, and Deadlock Prevention',
      'Memory Management: Paging, Segmentation, and Virtual Memory',
      'Linux Kernel Architecture, Boot Process (Systemd / Init), and Runlevels',
      'Enterprise User Management, File Permissions, ACLs, and PAM Modules',
      'Storage Administration: LVM, RAID Configurations, and Filesystems (ext4, xfs, btrfs)',
      'Windows Server Active Directory, Group Policy Objects (GPO), and Domain Controllers',
      'Bash Scripting, Task Automation with Cron, and Log Auditing (rsyslog, journalctl)'
    ]
  },
  {
    id: 'programming',
    number: 3,
    code: 'APC',
    name: 'Advanced Programming Concepts',
    sectionId: 'section-a',
    sectionName: 'SECTION A: Course Focus',
    duration: '90 Hours',
    status: 'AVAILABLE',
    slug: 'programming',
    route: '/modules/programming',
    description: 'Advanced programming concepts covering Python scripting, standard library modules, socket programming, regular expressions, automation, and MySQL relational database queries, DDL schemas, constraints, and ACID transactions.',
    topics: [
      'MySQL Query Construction',
      'MySQL Database Administration & DDL',
      'Python Code Tracing & Output',
      'Python Architecture & Standard Library'
    ],
    syllabusPoints: [
      'MySQL Queries: Data Filtering (WHERE, HAVING), Aggregations, GROUP BY, and LIMIT',
      'MySQL Joins and Subqueries: INNER JOIN, LEFT JOIN, and Subquery Evaluations',
      'MySQL Database Administration: DDL Schemas, Constraints, Indexing, and ACID Transactions',
      'Python Syntax & Data Structures: Lists, Tuples, Dictionaries, Sets, and Comprehensions',
      'Python Control Flow & Functions: Closures, Recursion, *args, Lambda, Map, and Filter',
      'Python Standard Library: Regex (re), pathlib, datetime, hashlib, and System Modules',
      'Object-Oriented Python: Classes, Instance Variables, Method Overriding, and Encapsulation',
      'Python Exception Handling & Network Programming: try/except/finally and Sockets'
    ]
  },

  // SECTION B: Infrastructure Security with DevOps and Cyber Forensics
  {
    id: 'it-infrastructure',
    number: 4,
    code: 'INFRA-DEVOPS',
    name: 'IT Infrastructure Management and DevOps',
    sectionId: 'section-b',
    sectionName: 'SECTION B: Infrastructure Security with DevOps and Cyber Forensics',
    duration: '120 Hours',
    status: 'AVAILABLE',
    slug: 'it-infrastructure',
    route: '/modules/it-infrastructure',
    description: 'Comprehensive IT infrastructure management covering ITIL framework services, data center architecture, power, cooling and storage (SAN/NAS/ZFS), and DevOps practices including Docker, Kubernetes, AWS Cloud, Terraform IaC, Ansible, and Prometheus monitoring.',
    topics: [
      'ITIL Service Management',
      'Data Center Management (DCM)',
      'DevOps & Containerization',
      'IaC, Configuration Management & Monitoring'
    ],
    syllabusPoints: [
      'ITIL Service Management: Service Strategy, Service Design (SLA/OLA/SDP), Service Transition & Operation',
      'Data Center Architecture: Power Distribution (UPS/PDU), HVAC/CRAC, Hot/Cold Aisles, and Tier Reliability',
      'DC Cabling & Network Infrastructure: MDF/IDF/POD Structured Cabling, ISP WAN Links, and NOC Operations',
      'Enterprise Storage Systems: SAN, NAS, iSCSI, and ZFS Pooled Storage with High Availability',
      'DevOps Culture & Continuous Delivery: CI/CD Pipelines, Build Artifacts, and Git Distributed Version Control',
      'Containerization & Orchestration: Docker Images, Dockerfile, Compose, Swarm, and Kubernetes (Pods/Nodes/Ingress)',
      'Cloud Architecture & VPC Networking: AWS EC2, S3, Lambda, VPC Subnets, Internet Gateways, and Security Groups',
      'Infrastructure as Code & Observability: Terraform (State/Plan/Apply), Ansible Automation, Jenkins, and Prometheus'
    ]
  },
  {
    id: 'cyber-forensics',
    number: 5,
    code: 'FORENSICS',
    name: 'Cyber Forensics',
    sectionId: 'section-b',
    sectionName: 'SECTION B: Infrastructure Security with DevOps and Cyber Forensics',
    duration: '60 Hours',
    status: 'UPDATED SOON',
    slug: 'cyber-forensics',
    route: '/modules/cyber-forensics',
    description: 'Digital evidence acquisition, live memory forensics, disk carving, filesystem analysis (NTFS/ext4), timeline reconstruction, anti-forensics detection, and chain of custody compliance.',
    syllabusPoints: [
      'Digital Forensics Principles: Chain of Custody, Order of Volatility, and Evidence Preservation',
      'Disk Imaging: Bit-stream Image Acquisition with dd, FTK Imager, and Write Blockers',
      'Filesystem Analysis: MFT Artifacts, Inodes, Journaling Logs, and Unallocated Space Carving',
      'Volatile Memory Analysis with Volatility Framework: Process Memory Dumps and DLL Injections',
      'Network Forensics: PCAP Analysis with Wireshark and Network Traffic Carving',
      'Legal Frameworks: IT Act 2000/2008 and Admissibility of Electronic Evidence'
    ]
  },
  {
    id: 'pki',
    number: 6,
    code: 'PKI',
    name: 'Public Key Infrastructure',
    sectionId: 'section-b',
    sectionName: 'SECTION B: Infrastructure Security with DevOps and Cyber Forensics',
    duration: '60 Hours',
    status: 'UPDATED SOON',
    slug: 'pki',
    route: '/modules/pki',
    description: 'Asymmetric cryptography, X.509 digital certificate lifecycle, Certificate Authorities (CA), Registration Authorities (RA), CRL/OCSP revocation, HSMs, and TLS handshake protocols.',
    syllabusPoints: [
      'Foundational Cryptography: Symmetric vs Asymmetric Algorithms (RSA, ECC, AES)',
      'Hash Functions, Message Authentication Codes (MAC), and Digital Signature Schemes',
      'X.509 Certificate Hierarchy: Root CA, Intermediate CA, Cross-Certification, and Trust Stores',
      'Certificate Revocation: Certificate Revocation Lists (CRL) and Online Certificate Status Protocol (OCSP)',
      'Hardware Security Modules (HSM) and Key Escrow / Recovery Mechanisms',
      'TLS 1.3 Protocol Handshake, Cipher Suites, and Certificate Transparency'
    ]
  },

  // SECTION C: Network Defense and Cyber Security with Compliance Audit
  {
    id: 'ndc',
    number: 7,
    code: 'NDC',
    name: 'Network Defense and Countermeasures (NDC)',
    sectionId: 'section-c',
    sectionName: 'SECTION C: Network Defense and Cyber Security with Compliance Audit',
    duration: '90 Hours',
    status: 'UPDATED SOON',
    slug: 'ndc',
    route: '/modules/ndc',
    description: 'Defense-in-depth security strategies, Next-Gen Firewalls (NGFW), Intrusion Detection and Prevention Systems (Snort / Suricata IDS/IPS), VPN technologies, and honeypots.',
    syllabusPoints: [
      'Defense-in-Depth Architecture, Zero Trust Principles, and Security Perimeter Design',
      'Firewall Technologies: Packet Filtering, Stateful Inspection, Application-Aware Firewalls',
      'Signature and Anomaly-based Intrusion Detection (IDS) and Prevention (IPS) with Snort',
      'Virtual Private Networks (VPN): IPsec (AH/ESP, IKE Phase 1/2) and OpenVPN Deployments',
      'Denial of Service (DoS/DDoS) Mitigation and Web Application Firewalls (WAF)',
      'Honeypots, Deception Technologies, and Security Incident Event Management (SIEM)'
    ]
  },
  {
    id: 'compliance-audit',
    number: 8,
    code: 'AUDIT',
    name: 'Compliance Audit',
    sectionId: 'section-c',
    sectionName: 'SECTION C: Network Defense and Cyber Security with Compliance Audit',
    duration: '30 Hours',
    status: 'UPDATED SOON',
    slug: 'compliance-audit',
    route: '/modules/compliance-audit',
    description: 'Information security governance, risk assessment methodologies, audit checklists, ISO/IEC 27001 standard controls, NIST Cybersecurity Framework, and CERT-In compliance guidelines.',
    syllabusPoints: [
      'Information Security Management System (ISMS) Framework and ISO/IEC 27001 Controls',
      'NIST Cybersecurity Framework: Identify, Protect, Detect, Respond, and Recover',
      'Vulnerability Assessment and Penetration Testing (VAPT) Audit Methodologies',
      'Risk Management and Quantitative / Qualitative Risk Assessment (NIST SP 800-30)',
      'Indian Cyber Law: IT Act 2000, CERT-In Cybersecurity Directives, and Compliance Mandates'
    ]
  },
  {
    id: 'security-concepts',
    number: 9,
    code: 'SEC-CONCEPTS',
    name: 'Security Concepts',
    sectionId: 'section-c',
    sectionName: 'SECTION C: Network Defense and Cyber Security with Compliance Audit',
    duration: '120 Hours',
    status: 'UPDATED SOON',
    slug: 'security-concepts',
    route: '/modules/security-concepts',
    description: 'Fundamental and advanced principles of cybersecurity: CIA triad, AAA security, threat modeling, attack surfaces, social engineering, web security vulnerabilities, and malware mechanics.',
    syllabusPoints: [
      'CIA Triad, Non-Repudiation, Least Privilege, and Defense-in-Depth',
      'Authentication, Authorization, and Accounting (AAA) Framework (RADIUS, TACACS+)',
      'Common Vulnerabilities and Exposures (CVE), CVSS v3 Scoring, and Threat Intelligence',
      'OWASP Top 10 Web Application Vulnerabilities (SQLi, XSS, CSRF, SSRF)',
      'Malware Taxonomies: Viruses, Worms, Trojans, Rootkits, Ransomware, and Botnets',
      'Social Engineering Attack Vectors and Security Awareness Best Practices'
    ]
  },

  // SECTION D: Employability Skills
  {
    id: 'aptitude',
    number: 10,
    code: 'APTITUDE',
    name: 'Aptitude',
    sectionId: 'section-d',
    sectionName: 'SECTION D: Employability Skills',
    duration: '60 Hours',
    status: 'UPDATED SOON',
    slug: 'aptitude',
    route: '/modules/aptitude',
    description: 'Quantitative aptitude, logical reasoning, data interpretation, critical thinking, problem-solving, and algorithmic speed tests for technical interviews and placement assessments.',
    syllabusPoints: [
      'Quantitative Aptitude: Number Systems, Percentages, Profit and Loss, Ratios, Speed & Distance',
      'Logical Reasoning: Syllogisms, Seating Arrangements, Coding-Decoding, Blood Relations',
      'Data Interpretation: Bar Charts, Pie Charts, Tables, and Data Sufficiency',
      'Analytical Thinking and Competitive Technical Interview Assessment Problems'
    ]
  },
  {
    id: 'communication',
    number: 11,
    code: 'COMM',
    name: 'Effective Communication',
    sectionId: 'section-d',
    sectionName: 'SECTION D: Employability Skills',
    duration: '60 Hours',
    status: 'UPDATED SOON',
    slug: 'communication',
    route: '/modules/communication',
    description: 'Professional engineering communication, technical report writing, incident response reporting, executive presentations, group discussions, and interview techniques.',
    syllabusPoints: [
      'Professional Written Communication: Technical Documentation and Security Incident Reports',
      'Verbal Communication: Technical Presentations, Public Speaking, and Active Listening',
      'Group Discussions and Case Study Analysis for Engineering Teams',
      'Behavioral and Technical Interview Strategies, Resume Crafting, and Professional Etiquette'
    ]
  },

  // SECTION E: Project
  {
    id: 'project',
    number: 12,
    code: 'PROJECT',
    name: 'Project',
    sectionId: 'section-e',
    sectionName: 'SECTION E: Project',
    duration: '180 Hours',
    status: 'UPDATED SOON',
    slug: 'project',
    route: '/modules/project',
    description: 'Capstone practical project applying end-to-end security architectures, enterprise infrastructure deployment, automated penetration testing, compliance verification, and defense implementation.',
    syllabusPoints: [
      'Project Selection, Problem Statement Formulation, and Literature Review',
      'System Architecture Design and Threat Modeling',
      'Implementation of Enterprise Secure Network / DevOps Infrastructure',
      'Vulnerability Assessment, Hardening Verification, and Defense Simulation',
      'Final Technical Report Submission, Code Repositories, and Viva Voce Presentation'
    ]
  }
];

export const getModuleById = (id: string): ITISSModule | undefined => {
  return ITISS_MODULES.find(m => m.id.toLowerCase() === id.toLowerCase() || m.slug.toLowerCase() === id.toLowerCase());
};

export const getModulesBySection = (sectionId: string): ITISSModule[] => {
  return ITISS_MODULES.filter(m => m.sectionId === sectionId);
};

