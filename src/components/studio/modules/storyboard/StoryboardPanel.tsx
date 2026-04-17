import React from 'react';
import { Shield } from 'lucide-react';
import { StudioModulePanel } from '@/components/studio/core/StudioModulePanel';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { StoryboardToolbar } from '@/components/studio/storyboard/StoryboardToolbar';
import { StoryboardSceneCard } from '@/components/studio/storyboard/StoryboardSceneCard';
import { StoryboardScriptView } from '@/components/studio/storyboard/StoryboardScriptView';
import { StoryboardEmptyState } from '@/components/studio/storyboard/StoryboardEmptyState';

interface StoryboardTerminalProps {
  scenes: any[];
  viewMode: 'grid' | 'list' | 'script';
  setViewMode: (mode: 'grid' | 'list' | 'script') => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  totalRuntime: string;
  isContinuing: boolean;
  onContinue: () => void;
  onPlay: () => void;
  onExport: () => void;
  onDragEnd: (result: any) => void;
  visualData: any;
  sceneStatus: any;
  directorsNotes: any;
  alternateTakes: any;
  editingSceneId: string | null;
  editForm: any;
  playingAudioId: string | null;
  calculateDuration: (text: string) => string;
  getStatusColor: (status: string) => string;
  highlightNarrative: (text: string) => any;
  onGenerateVisual: (sceneId: string, prompt: string) => void;
  onGenerateBGM: (sceneId: string, prompt: string) => void;
  onSetSelectedImage: (img: any) => void;
  onDeleteScene: (sceneId: string) => void;
  onStartEditing: (scene: any) => void;
  onStatusChange: (sceneId: string, status: string) => void;
  onAddAlternateTake: (sceneId: string, take: string) => void;
  onSwapAlternateTake: (sceneId: string, idx: number) => void;
  onEditFormChange: (form: any) => void;
  onDirectorsNoteChange: (sceneId: string, note: string) => void;
  onCancelEditing: () => void;
  onSaveSceneEdits: () => void;
  onPlayAudio: (sceneId: string, url: string) => void;
  onAddScene: (idx: number) => void;
}

export function StoryboardPanel({
  scenes,
  viewMode,
  setViewMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  totalRuntime,
  isContinuing,
  onContinue,
  onPlay,
  onExport,
  onDragEnd,
  visualData,
  sceneStatus,
  directorsNotes,
  alternateTakes,
  editingSceneId,
  editForm,
  playingAudioId,
  calculateDuration,
  getStatusColor,
  highlightNarrative,
  onGenerateVisual,
  onGenerateBGM,
  onSetSelectedImage,
  onDeleteScene,
  onStartEditing,
  onStatusChange,
  onAddAlternateTake,
  onSwapAlternateTake,
  onEditFormChange,
  onDirectorsNoteChange,
  onCancelEditing,
  onSaveSceneEdits,
  onPlayAudio,
  onAddScene
}: StoryboardTerminalProps) {
  return (
    <StudioModulePanel
      title="Scene Composer"
      subtitle="Sequencing Terminal"
      icon={<Shield className="w-5 h-5" />}
      scrollClassName="p-0"
      actions={
        <StoryboardToolbar
          viewMode={viewMode}
          onSetViewMode={setViewMode}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
          totalRuntime={totalRuntime}
          isContinuing={isContinuing}
          onContinue={onContinue}
          onPlay={onPlay}
          onExport={onExport}
        />
      }
    >
      <div className="p-10">
        {scenes.length > 0 ? (
          viewMode === 'script' ? (
            <StoryboardScriptView
              scenes={scenes}
              calculateDuration={calculateDuration}
              highlightNarrative={highlightNarrative}
            />
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="storyboard" direction="vertical">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className={`${viewMode === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-10' : 'space-y-16'} pb-32`}>
                    {scenes.map((scene, idx) => (
                      <Draggable key={scene.id} draggableId={scene.id} index={idx}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <StoryboardSceneCard
                              scene={scene}
                              idx={idx}
                              viewMode={viewMode}
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps}
                              visualData={visualData}
                              sceneStatus={sceneStatus}
                              directorsNotes={directorsNotes}
                              alternateTakes={alternateTakes}
                              editingSceneId={editingSceneId}
                              editForm={editForm}
                              playingAudioId={playingAudioId}
                              calculateDuration={calculateDuration}
                              getStatusColor={getStatusColor}
                              highlightNarrative={highlightNarrative}
                              onGenerateVisual={onGenerateVisual}
                              onGenerateBGM={onGenerateBGM}
                              onSetSelectedImage={onSetSelectedImage}
                              onDeleteScene={onDeleteScene}
                              onStartEditing={onStartEditing}
                              onStatusChange={onStatusChange}
                              onAddAlternateTake={onAddAlternateTake}
                              onSwapAlternateTake={onSwapAlternateTake}
                              onEditFormChange={onEditFormChange}
                              onDirectorsNoteChange={onDirectorsNoteChange}
                              onCancelEditing={onCancelEditing}
                              onSaveSceneEdits={onSaveSceneEdits}
                              onPlayAudio={onPlayAudio}
                              onAddScene={onAddScene}
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
          )
        ) : (
          <StoryboardEmptyState />
        )}
      </div>
    </StudioModulePanel>
  );
}
