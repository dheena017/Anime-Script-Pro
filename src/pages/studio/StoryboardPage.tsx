import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { AnimaticPlayer } from '@/components/studio/storyboard/AnimaticPlayer';
import { useStoryboardState } from '@/hooks/useStoryboardState';
import { StoryboardTopBar } from '@/components/studio/modules/storyboard/StoryboardTopBar';
import { StoryboardPanel } from '@/components/studio/modules/storyboard/StoryboardPanel';

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
      <StoryboardTopBar>
        <StoryboardPanel
          scenes={scenes}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onUndo={undo}
          onRedo={redo}
          canUndo={pastScripts.length > 0}
          canRedo={futureScripts.length > 0}
          totalRuntime={totalRuntime}
          isContinuing={isContinuing}
          onContinue={handleGenerateNext}
          onPlay={handlePlayAnimatic}
          onExport={handleExport}
          onDragEnd={onDragEnd}
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
          onStatusChange={(sceneId, status) => setSceneStatus((prev: any) => ({ ...prev, [sceneId]: status }))}
          onAddAlternateTake={handleAddAlternateTake}
          onSwapAlternateTake={handleSwapAlternateTake}
          onEditFormChange={setEditForm}
          onDirectorsNoteChange={(sceneId, note) => setDirectorsNotes((prev: any) => ({ ...prev, [sceneId]: note }))}
          onCancelEditing={cancelEditing}
          onSaveSceneEdits={saveSceneEdits}
          onPlayAudio={handlePlayAudio}
          onAddScene={addScene}
        />

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
      </StoryboardTopBar>
    </TooltipProvider>
  );
}
