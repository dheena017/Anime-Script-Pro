import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGenerator } from '@/contexts/GeneratorContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { SectionHeading } from '@/components/page/PageShell';
import { StoryboardToolbar } from '@/components/studio/storyboard/StoryboardToolbar';
import { StoryboardSceneCard } from '@/components/studio/storyboard/StoryboardSceneCard';
import { AnimaticPlayer } from '@/components/studio/storyboard/AnimaticPlayer';
import { StoryboardEmptyState } from '@/components/studio/storyboard/StoryboardEmptyState';
import { StoryboardScriptView } from '@/components/studio/storyboard/StoryboardScriptView';
import { useStoryboardState } from '@/hooks/useStoryboardState';

export function StoryboardPage() {
  const { generatedScript, setGeneratedScript, selectedModel } = useGenerator();
  const {
    viewMode,
    setViewMode,
    scenes,
    visualData,
    sceneStatus,
    directorsNotes,
    alternateTakes,
    editingSceneId,
    editForm,
    playingAudioId,
    selectedImage,
    setSelectedImage,
    isPlayingAnimatic,
    currentAnimaticIndex,
    setCurrentAnimaticIndex,
    pastScripts,
    futureScripts,
    totalRuntime,
    isContinuing,
    calculateDuration,
    getStatusColor,
    highlightNarrative,
    onDragEnd,
    addScene,
    deleteScene,
    startEditing,
    cancelEditing,
    saveSceneEdits,
    handleGenerateVisual,
    handleGenerateBGM,
    handleGenerateNext,
    handlePlayAnimatic,
    stopAnimatic,
    handleAddAlternateTake,
    handleSwapAlternateTake,
    handlePlayAudio,
    handleExport,
    setSceneStatus,
    setDirectorsNotes,
    setEditForm,
    undo,
    redo,
  } = useStoryboardState({ generatedScript, setGeneratedScript, selectedModel });

  return (
    <TooltipProvider>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <SectionHeading
          title="Storyboard"
          icon={<Layout className="w-5 h-5 text-red-500" />}
        />

        <Card className="studio-panel">
          <StoryboardToolbar
            viewMode={viewMode}
            onSetViewMode={setViewMode}
            canUndo={pastScripts.length > 0}
            canRedo={futureScripts.length > 0}
            onUndo={undo}
            onRedo={redo}
            totalRuntime={totalRuntime}
            isContinuing={isContinuing}
            onContinue={handleGenerateNext}
            onPlay={handlePlayAnimatic}
            onExport={handleExport}
          />

          <ScrollArea className="h-[760px] w-full p-6">
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
                    <div {...provided.droppableProps} ref={provided.innerRef} className={`${viewMode === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-10' : 'space-y-16'} pb-32 pt-4 px-2`}>
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
                                onGenerateVisual={handleGenerateVisual}
                                onGenerateBGM={handleGenerateBGM}
                                onSetSelectedImage={setSelectedImage}
                                onDeleteScene={deleteScene}
                                onStartEditing={startEditing}
                                onStatusChange={(sceneId, status) => setSceneStatus((prev) => ({ ...prev, [sceneId]: status }))}
                                onAddAlternateTake={handleAddAlternateTake}
                                onSwapAlternateTake={handleSwapAlternateTake}
                                onEditFormChange={setEditForm}
                                onDirectorsNoteChange={(sceneId, note) => setDirectorsNotes((prev) => ({ ...prev, [sceneId]: note }))}
                                onCancelEditing={cancelEditing}
                                onSaveSceneEdits={saveSceneEdits}
                                onPlayAudio={handlePlayAudio}
                                onAddScene={addScene}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )
          ) : (
            <StoryboardEmptyState />
          )}
          </ScrollArea>
        </Card>

        {/* Global Overlays */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-10" onClick={() => setSelectedImage(null)}>
              <Button variant="ghost" size="icon" className="absolute top-10 right-10 text-white"><X className="w-8 h-8" /></Button>
              <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={selectedImage.src} className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10" onClick={e => e.stopPropagation()} />
            </motion.div>
          )}
          {isPlayingAnimatic && (
            <AnimaticPlayer
              scenes={scenes}
              currentAnimaticIndex={currentAnimaticIndex}
              visualData={visualData}
              onStop={stopAnimatic}
              onPrev={() => setCurrentAnimaticIndex((i) => Math.max(0, i - 1))}
              onNext={() => setCurrentAnimaticIndex((i) => Math.min(scenes.length - 1, i + 1))}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  );
}
