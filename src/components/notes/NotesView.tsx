import React, { useMemo, useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { ITISS_MODULES } from '../../config/modules';
import { getNotesForModule, hasNotes } from '../../data/notesRegistry';
import { ModuleSelector } from '../common/ModuleSelector';
import { BookOpenText, Info, Search, Sparkles } from 'lucide-react';

/**
 * Short, exam-focused study notes per module and topic. Text only — no PDF
 * download. Content is aligned with the MCQ topic names used in Practice.
 */
export const NotesView: React.FC = () => {
  const { activeModuleId } = useProgress();
  const fallbackModule = hasNotes(activeModuleId) ? activeModuleId : 'fcn';
  const [moduleId, setModuleId] = useState(fallbackModule);
  const [selectedTopic, setSelectedTopic] = useState<string>(getNotesForModule(fallbackModule)[0]?.name || '');
  const [query, setQuery] = useState('');

  const notes = getNotesForModule(moduleId);
  const module = ITISS_MODULES.find(m => m.id === moduleId);

  const filteredTopics = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return notes;
    return notes.filter(
      topic =>
        topic.name.toLowerCase().includes(term) ||
        topic.summary.toLowerCase().includes(term) ||
        topic.sections.some(
          section =>
            section.title.toLowerCase().includes(term) ||
            section.points.some(point => point.toLowerCase().includes(term)),
        ),
    );
  }, [notes, query]);

  const currentTopic = notes.find(topic => topic.name === selectedTopic) || filteredTopics[0] || null;

  const handleModuleChange = (nextModuleId: string) => {
    setModuleId(nextModuleId);
    const nextNotes = getNotesForModule(nextModuleId);
    setSelectedTopic(nextNotes[0]?.name || '');
    setQuery('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#1F2933] pb-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30">
            STUDY NOTES
          </span>
          <span className="text-xs text-[#8C98A6] font-mono">
            {notes.length} topics · short, exam-focused points
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BookOpenText className="w-6 h-6 text-[#76B900]" />
          {module ? `${module.code} Study Notes` : 'Study Notes'}
        </h1>
        <p className="text-xs text-[#9CA3AF] max-w-3xl">
          Important points only, written in simple English and organised by the same topics used in the
          MCQ practice. Read the topic once, then practise its MCQs.
        </p>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ModuleSelector
            value={moduleId}
            onChange={handleModuleChange}
            label="Notes module"
            allowedModuleIds={ITISS_MODULES.filter(m => hasNotes(m.id)).map(m => m.id)}
          />
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#637282]" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search notes (topic, keyword…)"
              className="w-full rounded-lg border border-[#243240] bg-[#0C1014] py-2 pl-9 pr-3 text-xs text-white placeholder:text-[#556372] outline-none focus:border-[#76B900]"
            />
          </div>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="rounded-xl border border-[#232F3B] bg-[#141C24] p-8 text-center text-xs text-[#8C98A6]">
          Study notes for this module are not uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Topic list */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="rounded-xl border border-[#232F3B] bg-[#10171E] p-2 lg:sticky lg:top-20">
              <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#718092]">
                {query ? `${filteredTopics.length} matching topics` : 'Topics'}
              </div>
              <ul className="space-y-1">
                {filteredTopics.map(topic => {
                  const active = currentTopic?.name === topic.name;
                  return (
                    <li key={topic.name}>
                      <button
                        type="button"
                        onClick={() => setSelectedTopic(topic.name)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                          active
                            ? 'bg-[#1B2733] text-white border border-[#76B900]/40'
                            : 'text-[#9CA3AF] hover:bg-[#141C24] hover:text-white border border-transparent'
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate">{topic.name}</span>
                          <span className="shrink-0 font-mono text-[10px] text-[#718092]">
                            {topic.sections.reduce((total, section) => total + section.points.length, 0)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Topic content */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-4">
            {currentTopic ? (
              <>
                <div className="rounded-xl border border-[#232F3B] bg-[#141C24] p-5">
                  <h2 className="text-lg font-bold text-white">{currentTopic.name}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#9CA3AF]">{currentTopic.summary}</p>
                </div>

                {currentTopic.sections.map(section => (
                  <div key={section.title} className="rounded-xl border border-[#232F3B] bg-[#10171E] p-5">
                    <h3 className="flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#76B900]">
                      <Sparkles className="h-3.5 w-3.5" />
                      {section.title}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {section.points.map(point => (
                        <li key={point} className="flex gap-2 text-xs leading-relaxed text-[#C4CDD6]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#76B900]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="flex items-start gap-2 rounded-lg border border-[#232F3B] bg-[#0C1014] px-3 py-2.5 text-[11px] text-[#718092]">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#76B900]" />
                  <span>
                    Tip: after reading this topic, open <strong className="text-[#C4CDD6]">Practice MCQs</strong> and choose the same
                    topic for a focused test.
                  </span>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-[#232F3B] bg-[#141C24] p-8 text-center text-xs text-[#8C98A6]">
                No notes match “{query}”.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default NotesView;
