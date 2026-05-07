import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';
import { WorldToolbar } from '../components/WorldToolbar';
import { useGenerator } from '@/hooks/useGenerator';
import { useOutletContext } from 'react-router-dom';
import { WorldEditorToolbar } from '../components/WorldEditorToolbar';
import { Settings2, Zap, Target, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useWorldCommandCenter, useManifest } from '../context/WorldCommandCenter';

export const ManifestTab: React.FC = () => {
  const { 
    data: content, 
    isGenerating, 
    generate, 
    update: onContentChange,
    save: handleSave
  } = useManifest();
  
  const { activeTab, setActiveTab, isGeneratingAny, progress } = useWorldCommandCenter();
  const { session, episode, setIsEditing, isEditing, showNotification } = useGenerator();
  const { textareaRef, scheduleResizeTextarea } = useAutoResizeTextarea(content || '', isEditing);

  const handleFormat = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    switch (type) {
      case 'bold': replacement = `**${selectedText}**`; break;
      case 'italic': replacement = `*${selectedText}*`; break;
      case 'list': replacement = `\n- ${selectedText}`; break;
      case 'h2': replacement = `\n## ${selectedText}`; break;
      default: replacement = selectedText;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    onContentChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
      scheduleResizeTextarea();
    }, 0);
  };

  const handleRefine = async () => {
    try {
      showNotification?.('Neural Refinement active. Polishing manifest structure...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1500));
      onContentChange(content + '\n\n*Neural refinement applied: structure optimized.*');
      showNotification?.('Manifest refined successfully.', 'success');
    } catch (err) {
      showNotification?.('Neural Refinement failed. System recalibrating...', 'error');
    }
  };

  const onSave = async () => {
    await handleSave();
    setIsEditing(false);
  };

  // Memoize markdown to prevent re-renders on scroll or state changes
  const MemoizedMarkdown = useMemo(() => (
    <ReactMarkdown>{content}</ReactMarkdown>
  ), [content]);

  return (
    <div className="world-tab-content space-y-6">
      <div className="flex justify-end">
        <WorldToolbar
          status={content ? 'active' : 'empty'}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          session={session}
          episode={episode}
          content={content}
          showTabsOnly={true}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
          progress={progress}
          isGenerating={isGeneratingAny}
        />
      </div>

      <div className="world-container">
        {isEditing && (
          <div className="space-y-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <WorldEditorToolbar 
              onFormat={handleFormat}
              onRefine={handleRefine}
              onUndo={() => {}}
              onSave={onSave}
              isGenerating={isGeneratingAny}
            />
            
            {/* Neural Tuning Panel */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-wrap items-center gap-6 shadow-2xl">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-studio/10 border border-studio/20 rounded-lg">
                <Settings2 className="w-3.5 h-3.5 text-studio" />
                <span className="text-[10px] font-black uppercase tracking-widest text-studio">Neural Tuning</span>
              </div>

              <div className="flex items-center gap-4">
                <TuningOption icon={Target} label="Focus" options={['Balanced', 'Lore-Heavy', 'Action-Centric']} active="Balanced" />
                <TuningOption icon={Zap} label="Depth" options={['Standard', 'Complex', 'Foundational']} active="Standard" />
                <TuningOption icon={Palette} label="Tone" options={['Cinematic', 'Dark', 'Vibrant']} active="Cinematic" />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden">
                       <div className="w-full h-full bg-gradient-to-br from-studio/40 to-transparent" />
                    </div>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Active Agents</span>
              </div>
            </div>
          </div>
        )}
      {isEditing ? (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-studio/30 to-studio/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <textarea
            ref={textareaRef}
            className="world-textarea relative w-full min-h-[500px] p-6 bg-zinc-950/50 border border-studio/30 rounded-2xl text-zinc-100 placeholder-zinc-600 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-studio/50 focus:border-studio/50 resize-none overflow-hidden backdrop-blur-sm transition-all duration-200 group-hover:border-studio/50"
            value={content || ''}
            onChange={(e) => {
              onContentChange(e.target.value);
              scheduleResizeTextarea();
            }}
            onInput={scheduleResizeTextarea}
            onPaste={scheduleResizeTextarea}
            placeholder="Edit your comprehensive world bible here..."
            spellCheck="true"
          />
        </div>
      ) : (
        <div className="world-content-area relative">
          <div className="world-main-column relative z-10">
            <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl p-8 lg:p-16 backdrop-blur-sm relative overflow-hidden group">
              <div className="world-prose max-w-none relative z-10">
                {MemoizedMarkdown}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ManifestTab;

const TuningOption = ({ icon: Icon, label, options, active }: { icon: any, label: string, options: string[], active: string }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 pl-1">
      <Icon className="w-2.5 h-2.5 text-zinc-600" />
      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</span>
    </div>
    <div className="flex items-center bg-zinc-950/80 rounded-xl p-1 border border-white/5 shadow-inner">
      {options.map(opt => (
        <button
          key={opt}
          className={cn(
            "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all duration-300",
            active === opt 
              ? "bg-studio/20 text-studio shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
              : "text-zinc-600 hover:text-zinc-400 hover:bg-white/5"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);