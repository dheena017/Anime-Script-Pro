import React from 'react';
import { motion } from 'framer-motion';
import { 
  ScrollText, Sparkles, Film, PlayCircle, Zap, 
  AlignLeft, Grid3X3, List, Maximize2, Minimize2, 
  Film as FilmIcon, User, UserCircle
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { SceneCard } from '../components/SceneCard';
import { EmptyState } from '../components/EmptyState';
import { StudioEditor } from '../../components/StudioEditor';
import { storyboardStyles as s } from '../storyboardStyles';
import { StoryboardPageContext } from '../StoryboardPage';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
  duration: string;
  linkedPrompt?: string;
  videoPrompt?: string;
  soulFocus?: string;
  vfxCompounds?: string;
  emotionalKey?: string;
  subtext?: string;
  assets?: string;
}

interface FramesTabProps {
  scenes: Scene[];
  visualData: Record<number, string[]>;
  videoData: Record<number, string>;
  viewMode?: 'grid' | 'list';
  promptList: string[];
  editingSceneId: string | null;
  editForm: Partial<Scene>;
  isEnhancingNarration: boolean;
  isEnhancing: boolean;
  isRewritingTension: boolean;
  isSuggestingDuration: boolean;
  enhancingSceneIds: Set<string>;
  setEditForm: (form: Partial<Scene>) => void;
  handleDragEnd: (result: DropResult) => void;
  handleGenerateVisual: (originalIndex: number, visualsDescription: string) => void;
  handleGenerateVideo: (originalIndex: number, imageUrl: string, prompt: string) => void;
  startEditing: (scene: Scene) => void;
  cancelEditing: () => void;
  saveSceneEdits: () => void;
  handleEnhanceNarration: () => void;
  handleEnhanceVisuals: () => void;
  handleRewriteTension: () => void;
  handleSuggestDuration: () => void;
  handleAddScene: () => void;
  isGenerating: boolean;
  handleManifestScene: (sceneId: string) => void;
  isManifestingSceneId: string | null;
  onLoadDemo?: () => void;
}

export const FramesTab = React.memo<Partial<FramesTabProps>>((props) => {
  const context = React.useContext(StoryboardPageContext);

  const {
    scenes = context?.scenes || [],
    visualData = context?.visualData || {},
    videoData = context?.videoData || {},
    viewMode = props.viewMode || context?.viewMode || 'list',
    promptList = context?.promptList || [],
    editingSceneId = context?.editingSceneId || null,
    editForm = context?.editForm || {},
    isEnhancingNarration = context?.isEnhancingNarration || false,
    isEnhancing = context?.isEnhancing || false,
    isRewritingTension = context?.isRewritingTension || false,
    isSuggestingDuration = context?.isSuggestingDuration || false,
    enhancingSceneIds = context?.enhancingSceneIds || new Set<string>(),
    setEditForm = context?.setEditForm || (() => {}),
    handleDragEnd = context?.handleDragEnd || (() => {}),
    handleGenerateVisual = context?.handleGenerateVisual || (() => {}),
    handleGenerateVideo = context?.handleGenerateVideo || (() => {}),
    startEditing = context?.startEditing || (() => {}),
    cancelEditing = context?.cancelEditing || (() => {}),
    saveSceneEdits = context?.saveSceneEdits || (() => {}),
    handleEnhanceNarration = context?.handleEnhanceNarration || (() => {}),
    handleEnhanceVisuals = context?.handleEnhanceVisuals || (() => {}),
    handleRewriteTension = context?.handleRewriteTension || (() => {}),
    handleSuggestDuration = context?.handleSuggestDuration || (() => {}),
    handleAddScene = context?.handleAddScene || (() => {}),
    isGenerating = context?.isGenerating || false,
    handleManifestScene = context?.handleManifestScene || (() => {}),
    isManifestingSceneId = context?.isManifestingSceneId || null,
    onLoadDemo = context?.onLoadDemo || (() => {}),
  } = props;
  if (scenes.length === 0) {
    return <EmptyState onLaunch={handleAddScene} onLoadDemo={onLoadDemo} isGenerating={isGenerating} />;
  }

  const handleSetEditForm = React.useCallback((form: Partial<Scene> | ((prevState: Partial<Scene>) => Partial<Scene>)) => {
    if (typeof form === 'function') {
      setEditForm(form(editForm));
    } else {
      setEditForm(form);
    }
  }, [setEditForm, editForm]);

  const scrollToScene = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className={s.content.contentArea}>
      <div className={s.content.mainColumn}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="storyboard">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={cn(
                  "frames-grid",
                  viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "grid grid-cols-1 gap-8"
                )}
              >
                {scenes.map((scene, idx) => (
                  <Draggable key={scene.id} draggableId={scene.id} index={idx}>
                    {(provided, snapshot) => (
                      <div id={`scene-card-${scene.id}`} className="transition-all duration-300">
                        <SceneCard
                          scene={scene}
                          index={idx}
                          visualData={visualData}
                          promptList={promptList}
                          editingSceneId={editingSceneId}
                          editForm={editForm}
                          isEnhancingNarration={isEnhancingNarration}
                          isEnhancing={isEnhancing}
                          isRewritingTension={isRewritingTension}
                          isSuggestingDuration={isSuggestingDuration}
                          setEditForm={handleSetEditForm}
                          handleGenerateVisual={handleGenerateVisual}
                          handleGenerateVideo={handleGenerateVideo}
                          videoData={videoData}
                          startEditing={startEditing}
                          cancelEditing={cancelEditing}
                          saveSceneEdits={saveSceneEdits}
                          handleEnhanceNarration={handleEnhanceNarration}
                          handleEnhanceVisuals={handleEnhanceVisuals}
                          handleRewriteTension={handleRewriteTension}
                          handleSuggestDuration={handleSuggestDuration}
                          dragHandleProps={provided.dragHandleProps}
                          draggableProps={provided.draggableProps}
                          innerRef={provided.innerRef}
                          isDragging={snapshot.isDragging}
                          isBulkEnhancing={enhancingSceneIds.has(scene.id)}
                          handleManifestScene={handleManifestScene}
                          isManifestingScene={isManifestingSceneId === scene.id}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Sidebar */}
      <aside className={s.content.sidebar + " space-y-8"}>
         <div className={s.content.sidebarCard}>
            <div className={s.content.sidebarGlow + " bg-orange-500/5 group-hover:bg-orange-500/10"} />
            <div className={s.content.sidebarContent}>
               <h4 className={s.content.sidebarTitle}>
                 <Sparkles className="w-3 h-3 text-orange-400" /> Production Matrix
               </h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-zinc-600 uppercase">Scene Nodes</span>
                     <span className="text-xs font-black text-white">{scenes.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-zinc-600 uppercase">Assets Ready</span>
                     <span className="text-xs font-black text-emerald-400">{Object.keys(visualData).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-zinc-600 uppercase">Engine Status</span>
                     <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">Optimized</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <h5 className={s.content.sidebarTitle}>
              <ScrollText className="w-3 h-3" /> Scene Navigator
            </h5>
            <div className="grid grid-cols-4 gap-2">
               {scenes.map((scene, i) => (
                 <motion.button
                   key={i}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => scrollToScene(`scene-card-${scene.id}`)}
                   className="aspect-square flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-lg hover:border-orange-500/40 hover:bg-orange-500/5 transition-all group"
                 >
                    <span className="text-[10px] font-black text-zinc-600 group-hover:text-orange-400">{i + 1}</span>
                 </motion.button>
               ))}
            </div>
         </div>

         <div className="p-6 bg-gradient-to-br from-orange-500/10 to-studio/10 border border-white/5 rounded-[2rem] space-y-4">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <PlayCircle className="w-3 h-3 text-orange-400" /> Continuity Note
            </h4>
            <p className="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase">
              The visual sequence is now locked into the production pipeline. Use the navigator to verify frame consistency across keys.
            </p>
         </div>
      </aside>
    </div>
  );
});



