import fcnNotesRaw from './fcnNotes.json';
import fcnSessionNotes from './fcnSessionNotes.json';
import osNotesLinuxRaw from './osNotesLinux.json';
import osNotesWindowsRaw from './osNotesWindows.json';

export interface NoteSection {
  title: string;
  points: string[];
  example?: string;
}

export interface TopicNote {
  name: string;
  summary: string;
  sections: NoteSection[];
  sessionNumbers?: number[];
}

export interface NoteGroup {
  name: string;
  description?: string;
  topics: TopicNote[];
}

export interface ModuleNotes {
  groups: NoteGroup[];
}

const NOTES_BY_MODULE: Record<string, ModuleNotes> = {
  fcn: {
    groups: [
      {
        name: 'Sessions',
        description: 'Sessions 1–20 from the ACTS Pune teaching guide (August 2026), with theory, worked examples and lab walkthroughs.',
        topics: fcnSessionNotes,
      },
      {
        name: 'Topic Reference',
        description: 'Thirteen FCN topics aligned with the MCQ practice bank.',
        topics: fcnNotesRaw as TopicNote[],
      },
    ],
  },
  os: {
    groups: [
      {
        name: 'Linux',
        description: 'Linux basics, processes, memory, files, commands, shell scripting and administration.',
        topics: osNotesLinuxRaw as TopicNote[],
      },
      {
        name: 'Windows',
        description: 'Windows Server deployment, DNS, DHCP, Active Directory, certificates, VPN, DFS and PowerShell.',
        topics: osNotesWindowsRaw as TopicNote[],
      },
    ],
  },
};

export const getNoteGroups = (moduleId: string): NoteGroup[] =>
  NOTES_BY_MODULE[(moduleId || '').toLowerCase()]?.groups || [];

/** Flat list of every topic in a module (all groups). */
export const getNotesForModule = (moduleId: string): TopicNote[] =>
  getNoteGroups(moduleId).flatMap(group => group.topics);

export const getNotesTopicNames = (moduleId: string): string[] =>
  getNotesForModule(moduleId).map(topic => topic.name);

export const hasNotes = (moduleId: string): boolean => getNotesForModule(moduleId).length > 0;

export const countNotePoints = (topic: TopicNote): number =>
  topic.sections.reduce((total, section) => total + section.points.length, 0);
