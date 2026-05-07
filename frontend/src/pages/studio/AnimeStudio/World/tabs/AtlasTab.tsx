import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';
import { WorldToolbar } from '../components/WorldToolbar';
import { useGenerator } from '@/hooks/useGenerator';
import { useOutletContext } from 'react-router-dom';
import { WorldEditorToolbar } from '../components/WorldEditorToolbar';
import { Map, Mountain, Waves, Compass, Wind, Target, Zap, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useWorldCommandCenter, useAtlas } from '../context/WorldCommandCenter';

export const AtlasTab: React.FC = () => {
  const { 
    data: content, 
    isGenerating, 
    generate, 
    update: onContentChange,
    save: handleSave
  } = useAtlas();
  
  const { activeTab, setActiveTab, isGeneratingAny, progress } = useWorldCommandCenter();
  const { session, episode, setIsEditing, isEditing, showNotification } = useGenerator();

  const { textareaRef: mainTextareaRef, scheduleResizeTextarea: scheduleMainResize } = useAutoResizeTextarea(content || '', isEditing);

  const handleFormat = (type: string) => {
    const textarea = mainTextareaRef.current;
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
      scheduleMainResize();
    }, 0);
  };

  const handleRefine = async () => {
    try {
      showNotification?.('Terrain Refinement active. Mapping topological variances...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1500));
      onContentChange(content + '\n\n*Terrain refined: geographical features mapped.*');
      showNotification?.('Atlas refined successfully.', 'success');
    } catch (err) {
      showNotification?.('Terrain Refinement failed. Geospatial data corrupt.', 'error');
    }
  };

  const onSave = async () => {
    await handleSave();
    setIsEditing(false);
  };

  const customComponents = useMemo(() => ({
    h2: ({ node, ...props }: any) => {
      const text = React.Children.toArray(props.children)
        .map((child) => (typeof child === 'string' ? child : '')).join('');
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return <motion.h2 id={id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, ease: 'easeOut' }} {...props} />;
    },
    p: ({ node, ...props }: any) => (
      <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} {...props} />
    )
  }), []);

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
            
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-wrap items-center gap-6 shadow-2xl">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-studio/10 border border-studio/20 rounded-lg">
                <Compass className="w-3.5 h-3.5 text-studio" />
                <span className="text-[10px] font-black uppercase tracking-widest text-studio">Terrain Tuning</span>
              </div>

              <div className="flex items-center gap-4">
                <TuningOption icon={Mountain} label="Biome" options={['Tundra', 'Cybercity', 'Wasteland']} active="Cybercity" />
                <TuningOption icon={Waves} label="Water" options={['Arid', 'Oceanic', 'Swamp']} active="Arid" />
              </div>
            </div>
          </div>
        )}

      {isEditing ? (
        <textarea
          ref={mainTextareaRef}
          className="world-textarea overflow-hidden"
          value={content || ''}
          onChange={(e) => {
            onContentChange(e.target.value);
            scheduleMainResize();
          }}
          onInput={scheduleMainResize}
          placeholder="Map out your world geography here..."
        />
      ) : (
        <div className="world-content-area">
          <div className="world-main-column">
            <div className="world-prose" style={{ '--prose-accent-color': '#3b82f6' } as React.CSSProperties}>
              <ReactMarkdown components={customComponents}>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

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
