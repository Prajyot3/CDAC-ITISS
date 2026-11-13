import React from 'react';
import { getActiveModules } from '../../data/moduleRegistry';
import { Layers } from 'lucide-react';

interface ModuleSelectorProps {
  value: string;
  onChange: (moduleId: string) => void;
  includeAll?: boolean;
  label?: string;
}

/**
 * Picks which module's question bank to work on. Every module with an imported
 * bank appears automatically (FCN, OS-ADMIN, and future modules).
 */
export const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  value,
  onChange,
  includeAll = false,
  label = 'Module',
}) => {
  const modules = getActiveModules();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#718092]">
        <Layers className="w-3.5 h-3.5" />
        {label}
      </span>

      {includeAll && (
        <button
          type="button"
          onClick={() => onChange('all')}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
            value === 'all'
              ? 'bg-[#76B900] text-black border-[#76B900]'
              : 'bg-[#141C24] text-[#9CA3AF] border-[#26323F] hover:border-[#76B900] hover:text-white'
          }`}
        >
          All Modules
        </button>
      )}

      {modules.map(module => (
        <button
          key={module.id}
          type="button"
          onClick={() => onChange(module.id)}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
            value === module.id
              ? 'bg-[#76B900] text-black border-[#76B900]'
              : 'bg-[#141C24] text-[#9CA3AF] border-[#26323F] hover:border-[#76B900] hover:text-white'
          }`}
          title={module.name}
        >
          {module.code}
        </button>
      ))}
    </div>
  );
};

export default ModuleSelector;
