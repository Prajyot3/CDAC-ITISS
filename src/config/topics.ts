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

