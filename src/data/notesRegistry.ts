import fcnNotesRaw from './fcnNotes.json';

export interface NoteSection {
  title: string;
  points: string[];
}

export interface TopicNote {
  name: string;
  summary: string;
  sections: NoteSection[];
}

const NOTES_BY_MODULE: Record<string, TopicNote[]> = {
  fcn: fcnNotesRaw as TopicNote[],
};

export const getNotesForModule = (moduleId: string): TopicNote[] =>
  NOTES_BY_MODULE[(moduleId || '').toLowerCase()] || [];

export const getNotesTopicNames = (moduleId: string): string[] =>
  getNotesForModule(moduleId).map(topic => topic.name);

export const hasNotes = (moduleId: string): boolean => getNotesForModule(moduleId).length > 0;
