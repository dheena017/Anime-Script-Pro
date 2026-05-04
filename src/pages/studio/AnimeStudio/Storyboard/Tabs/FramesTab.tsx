import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { SceneCard } from '../components/SceneCard';
import { EmptyState } from '../components/EmptyState';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
  duration: string;
  linkedPrompt?: string;
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
  handleManifestScene: (sceneId: string) => void;
  isManifestingSceneId: string | null;
}

export const FramesTab = React.memo<FramesTabProps>(({
  scenes,
  visualData,
  videoData,
  viewMode = 'list',
  promptList,
  editingSceneId,
  editForm,
  isEnhancingNarration,
  isEnhancing,
  isRewritingTension,
  isSuggestingDuration,
  enhancingSceneIds,
  setEditForm,
  handleDragEnd,
  handleGenerateVisual,
  handleGenerateVideo,
  startEditing,
  cancelEditing,
  saveSceneEdits,
  handleEnhanceNarration,
  handleEnhanceVisuals,
  handleRewriteTension,
  handleSuggestDuration,
  handleAddScene,
  handleManifestScene,
  isManifestingSceneId,
}) => {
  if (scenes.length === 0) {
    return <EmptyState handleAddScene={handleAddScene} />;
  }

  const handleSetEditForm = React.useCallback((form: Partial<Scene> | ((prevState: Partial<Scene>) => Partial<Scene>)) => {
    if (typeof form === 'function') {
      setEditForm(form(editForm));
    } else {
      setEditForm(form);
    }
  }, [setEditForm, editForm]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="storyboard">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "frames-grid",
              viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-2" : "grid grid-cols-1"
            )}
          >

            {scenes.map((scene, idx) => (
              <Draggable key={scene.id} draggableId={scene.id} index={idx}>
                {(provided, snapshot) => (
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
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});



