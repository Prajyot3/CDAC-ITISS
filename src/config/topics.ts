export interface TopicMeta {
  id: string;
  name: string;
  shortDescription: string;
}

export const FCN_TOPICS: TopicMeta[] = [
  { id: 'OSI Model', name: 'OSI Model', shortDescription: '7-Layer ISO reference architecture, encapsulation, PDUs, and layer duties' },
  { id: 'TCP/IP', name: 'TCP/IP', shortDescription: 'TCP three-way handshake, windowing, flow control, UDP connectionless datagrams' },
  { id: 'IPv4 and IPv6', name: 'IPv4 and IPv6', shortDescription: 'IP addressing schemes, header fields, TTL, IPv6 128-bit format, EUI-64' },
  { id: 'Subnetting', name: 'Subnetting', shortDescription: 'Custom subnet masks, CIDR, VLSM, network/broadcast IDs, usable host ranges' },
  { id: 'Routing', name: 'Routing', shortDescription: 'Static routes, default routes, RIP, OSPF, EIGRP, administrative distance' },
  { id: 'Switching', name: 'Switching', shortDescription: 'Layer 2 MAC learning, collision domains, Spanning Tree Protocol (STP)' },
  { id: 'VLAN', name: 'VLAN', shortDescription: 'Virtual LANs, 802.1Q tagging, trunking, access ports, VTP domain pruning' },
  { id: 'NAT', name: 'NAT', shortDescription: 'Static NAT, Dynamic NAT, PAT / NAT Overload, private-to-public IP mapping' },
  { id: 'DNS and DHCP', name: 'DNS and DHCP', shortDescription: 'Name resolution hierarchy, nslookup, DHCP DORA lease cycle, ipconfig' },
  { id: 'WAN', name: 'WAN', shortDescription: 'Serial lines, PPP, HDLC, Frame Relay, clock rate, DTE vs DCE devices' },
  { id: 'Wireless Networks', name: 'Wireless Networks', shortDescription: 'IEEE 802.11 standards (a/b/g/n/ac), WEP, WPA-Personal, WPA-Enterprise RADIUS' },
  { id: 'Network Security', name: 'Network Security', shortDescription: 'Cisco IOS passwords, enable secret, console/VTY lines, ACLs, encryption' },
  { id: 'Networking Protocols', name: 'Networking Protocols', shortDescription: 'ICMP error messages, ARP/RARP address resolution, SNMP, FTP, TFTP' },
];

export const OS_TOPICS: TopicMeta[] = [
  {
    id: 'os-fundamentals',
    name: 'OS Fundamentals',
    shortDescription: 'Kernel types, boot sequence, runlevels, shells, system calls and OS services'
  },
  {
    id: 'process-management',
    name: 'Process Management',
    shortDescription: 'Process states, PCB, threads, context switching, IPC and multiprogramming'
  },
  {
    id: 'cpu-scheduling',
    name: 'CPU Scheduling',
    shortDescription: 'FCFS, SJF, round robin, priority scheduling, waiting time, throughput and aging'
  },
  {
    id: 'memory-management',
    name: 'Memory Management',
    shortDescription: 'Paging, segmentation, fragmentation, virtual memory, page replacement and thrashing'
  },
  {
    id: 'deadlock-sync',
    name: 'Deadlock and Synchronization',
    shortDescription: 'Critical sections, semaphores, monitors, deadlock prevention, avoidance and detection'
  },
  {
    id: 'file-systems',
    name: 'File Systems',
    shortDescription: 'inodes, FAT/NTFS/ext4, directory trees, disk scheduling, partitions and LVM'
  },
  {
    id: 'linux-administration',
    name: 'Linux Administration',
    shortDescription: 'Shell commands, cron, vi, /proc, services, users, networking files and package tools'
  },
  {
    id: 'network-services',
    name: 'Network Services',
    shortDescription: 'DNS/BIND, DHCP, NFS, Apache, sendmail/postfix, CUPS, Samba and Squid'
  },
  {
    id: 'security-permissions',
    name: 'Security and Permissions',
    shortDescription: 'chmod/chown, umask, ACLs, sticky/setuid bits, SSH and firewall filtering'
  },
  {
    id: 'windows-administration',
    name: 'Windows Administration',
    shortDescription: 'Active Directory, Group Policy, DNS/DHCP on Windows, NTFS permissions and quotas'
  },
];

export const PROGRAMMING_TOPICS: TopicMeta[] = [
  {
    id: 'mysql-queries',
    name: 'MySQL Query Construction',
    shortDescription: 'SELECT, WHERE, HAVING, GROUP BY, ORDER BY, LIMIT, INNER/LEFT JOINs, subqueries and aggregations'
  },
  {
    id: 'mysql-ddl-admin',
    name: 'MySQL Database Administration & DDL',
    shortDescription: 'CREATE/ALTER/DROP, schemas, constraints, indexes, transactions, ACID properties and SQL injection defense'
  },
  {
    id: 'python-code-tracing',
    name: 'Python Code Tracing & Output',
    shortDescription: 'Code execution tracing: list/dict manipulations, slicing, closures, recursion, regex, OOP, and exception handling'
  },
  {
    id: 'python-architecture',
    name: 'Python Architecture & Standard Library',
    shortDescription: 'Virtual environments, data model, standard libraries (hashlib, datetime, pathlib, socket) and network programming'
  }
];

export const INFRA_TOPICS: TopicMeta[] = [
  {
    id: 'itil-service-mgmt',
    name: 'ITIL Service Management',
    shortDescription: 'Service Strategy, Service Design (SLA/OLA, SDP, RACI), Service Transition, and Service Operation (Incident, Problem, Change)'
  },
  {
    id: 'data-center-mgmt',
    name: 'Data Center Management (DCM)',
    shortDescription: 'DC Architecture, PUE, UPS/HVAC/CRAC, Hot/Cold aisle containment, Cabling (MDF/IDF/POD), SNMP, MTBF/MTTR, and High Availability'
  },
  {
    id: 'devops-containerization',
    name: 'DevOps & Containerization',
    shortDescription: 'DevOps culture, Git workflows, Docker images/containers/Compose/Swarm, Kubernetes (Pods, Nodes, ReplicaSets, Ingress), and AWS Cloud/VPC'
  },
  {
    id: 'iac-config-monitoring',
    name: 'IaC, Configuration Management & Monitoring',
    shortDescription: 'Infrastructure as Code with Terraform, Configuration Automation (Ansible, Chef, Puppet), CI/CD with Jenkins, and Monitoring (Prometheus, Grafana)'
  }
];

const MODULE_TOPICS: Record<string, TopicMeta[]> = {
  fcn: FCN_TOPICS,
  os: OS_TOPICS,
  programming: PROGRAMMING_TOPICS,
  'it-infrastructure': INFRA_TOPICS,
};

export const getModuleTopics = (moduleId: string): TopicMeta[] =>
  MODULE_TOPICS[(moduleId || '').toLowerCase()] || [];

export const getModuleTopicNames = (moduleId: string): string[] =>
  getModuleTopics(moduleId).map(topic => topic.name);
