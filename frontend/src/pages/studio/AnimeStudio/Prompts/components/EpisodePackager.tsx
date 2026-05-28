import React from 'react';
import { Button } from '@/components/ui/button';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { generateEpisodeAssets, generateScene, generateImagePrompts, generateVideoPrompts, generateSceneImage, generateVideo } from '@/services/api/gemini';
import { seriesRenderService, type ServerRenderJobStatus } from '@/services/api/seriesRender';

const TERMINAL_JOB_STATUSES = ['completed', 'failed', 'cancelled'];

export default function EpisodePackager() {
  const {
    prompt,
    generatedScript,
    episode,
    session,
    selectedModel,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    generatedCharacters,
    castDNA,
    castDynamics,
    castIntegrity,
    characterRelationships,
  } = useGeneratorState();
  const {
    setGeneratedImagePrompts,
    setGeneratedScript,
  } = useGeneratorDispatch();

  const [isLoading, setIsLoading] = React.useState(false);
  const [packageJson, setPackageJson] = React.useState<any | null>(null);
  const [selectedSceneIndex, setSelectedSceneIndex] = React.useState<number>(1);
  const [sceneLoading, setSceneLoading] = React.useState<boolean>(false);
  const [thumbnails, setThumbnails] = React.useState<Record<number, string | null>>({});
  const [thumbnailLoading, setThumbnailLoading] = React.useState<Record<number, boolean>>({});
  const [sceneVideoUrls, setSceneVideoUrls] = React.useState<Record<number, string | null>>({});
  const [videoLoading, setVideoLoading] = React.useState<Record<number, boolean>>({});
  const [serverRenderLoading, setServerRenderLoading] = React.useState(false);
  const [serverRenderDeleteLoading, setServerRenderDeleteLoading] = React.useState(false);
  const [serverRenderJobId, setServerRenderJobId] = React.useState<string | null>(null);
  const [serverRenderStatus, setServerRenderStatus] = React.useState<ServerRenderJobStatus | null>(null);
  const [renderJobHistory, setRenderJobHistory] = React.useState<ServerRenderJobStatus[]>([]);

  React.useEffect(() => {
    if (renderJobHistory.length === 0) return;

    const pendingJobs = renderJobHistory.filter((job) => !TERMINAL_JOB_STATUSES.includes(job.status));
    if (pendingJobs.length === 0) return;

    const pollAll = async () => {
      const updates = await Promise.all(
        pendingJobs.map(async (job) => {
          try {
            return await seriesRenderService.getRenderJobStatus(job.job_id);
          } catch {
            return job;
          }
        }),
      );

      setRenderJobHistory((prev) =>
        prev.map((job) => updates.find((update) => update.job_id === job.job_id) || job),
      );

      if (serverRenderJobId) {
        const latest = updates.find((update) => update.job_id === serverRenderJobId);
        if (latest) setServerRenderStatus(latest);
      }
    };

    void pollAll();
    const id = window.setInterval(() => {
      void pollAll();
    }, 2500);

    return () => window.clearInterval(id);
  }, [renderJobHistory, serverRenderJobId]);

  const loadSceneAssets = React.useCallback(async (index: number) => {
    const scene = packageJson?.scenes.find((s: any) => s.index === index);
    if (!scene) return;

    if (typeof thumbnails[index] === 'undefined' && !thumbnailLoading[index]) {
      setThumbnailLoading((prev) => ({ ...prev, [index]: true }));
      try {
        const img = await generateSceneImage(scene.imagePrompts || scene.sceneOutput.visuals || scene.sceneOutput.narration);
        setThumbnails((prev) => ({ ...prev, [index]: img }));
      } catch (e) {
        console.warn('Thumbnail generation failed:', e);
        setThumbnails((prev) => ({ ...prev, [index]: null }));
      } finally {
        setThumbnailLoading((prev) => ({ ...prev, [index]: false }));
      }
    }

    if (typeof sceneVideoUrls[index] === 'undefined' && !videoLoading[index]) {
      setVideoLoading((prev) => ({ ...prev, [index]: true }));
      try {
        const videoPrompt = scene.videoPrompts || scene.sceneOutput.narration || scene.sceneOutput.visuals;
        const videoUrl = await generateVideo(videoPrompt, selectedModel);
        setSceneVideoUrls((prev) => ({ ...prev, [index]: videoUrl }));
      } catch (e) {
        console.warn('Video generation failed:', e);
        setSceneVideoUrls((prev) => ({ ...prev, [index]: null }));
      } finally {
        setVideoLoading((prev) => ({ ...prev, [index]: false }));
      }
    }
  }, [packageJson, sceneVideoUrls, thumbnails, thumbnailLoading, videoLoading]);

  React.useEffect(() => {
    if (!packageJson?.scenes?.length) return;
    const firstSceneIndex = packageJson.scenes[0].index;
    setSelectedSceneIndex(firstSceneIndex);
    void loadSceneAssets(firstSceneIndex);
  }, [packageJson, loadSceneAssets]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const assets = await generateEpisodeAssets({
        prompt: prompt || generatedScript || '',
        script: generatedScript || undefined,
        episode,
        session,
        numScenes: '6',
        model: selectedModel,
      });

      setPackageJson(assets);
      // Optionally store some generated outputs in generator context
      setGeneratedImagePrompts(assets.episodeImagePrompts as any);
      setGeneratedScript(assets.script);
    } catch (err) {
      console.error('Episode generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScene = (index: number) => {
    setSelectedSceneIndex(index);
    void loadSceneAssets(index);
  };

  const handleRegenerateScene = async (index: number) => {
    if (!packageJson) return;
    setSceneLoading(true);
    try {
      const scene = packageJson.scenes.find((s:any) => s.index === index);
      const beatDescription = (scene?.parsed && (scene.parsed['Narration'] || scene.parsed['Visual Direction'])) || scene?.sceneOutput?.narration || '';

      // Compile unified World and Cast DNA context dynamically
      const worldSections: string[] = [];
      if (generatedWorld) worldSections.push(`=== WORLD MANIFEST ===\n${generatedWorld}`);
      if (generatedWorldLore) worldSections.push(`=== HISTORY & ERAS ===\n${generatedWorldLore}`);
      if (generatedWorldFactions) worldSections.push(`=== FACTIONS & POWER BALANCE ===\n${generatedWorldFactions}`);
      if (generatedWorldPowers) worldSections.push(`=== SYSTEMS & MECHANICS ===\n${generatedWorldPowers}`);
      if (generatedWorldArchitecture) worldSections.push(`=== VISUAL STYLE & ARCHITECTURE ===\n${generatedWorldArchitecture}`);
      if (generatedWorldAtlas) worldSections.push(`=== GEOGRAPHY & ENVIRONMENT ===\n${generatedWorldAtlas}`);
      if (generatedWorldCulture) worldSections.push(`=== CUSTOMS & ETHOS ===\n${generatedWorldCulture}`);
      if (generatedWorldSystems) worldSections.push(`=== TECHNOLOGICAL INFRASTRUCTURE ===\n${generatedWorldSystems}`);
      const compiledWorldLore = worldSections.length > 0 ? worldSections.join("\n\n") : null;

      const castSections: string[] = [];
      if (generatedCharacters) castSections.push(`=== CAST SUMMARY ===\n${generatedCharacters}`);
      if (castDNA) castSections.push(`=== IDENTITY & VOICE DNA ===\n${castDNA}`);
      if (castDynamics) castSections.push(`=== RELATIONSHIP DYNAMICS ===\n${castDynamics}`);
      if (castIntegrity) castSections.push(`=== TECHNICAL DESIGN RULES ===\n${castIntegrity}`);
      if (characterRelationships) castSections.push(`=== INTERPERSONAL NETWORKS ===\n${characterRelationships}`);
      const compiledCastDNA = castSections.length > 0 ? castSections.join("\n\n") : null;

      const newSceneOutput = await generateScene(packageJson.script, beatDescription, selectedModel, compiledWorldLore, compiledCastDNA, { temperature: 0.7, maxTokens: 1024 });
      const newImagePrompts = await generateImagePrompts(newSceneOutput.visuals || newSceneOutput.narration, selectedModel);
      let newVideoPrompts: string | null = null;
      try {
        newVideoPrompts = await generateVideoPrompts(newSceneOutput.narration || newSceneOutput.visuals, selectedModel);
      } catch (e) {
        console.warn('Scene video regenerate failed', e);
      }

      const updatedScenes = packageJson.scenes.map((s:any) => {
        if (s.index === index) {
          return {
            ...s,
            sceneOutput: newSceneOutput,
            imagePrompts: newImagePrompts,
            videoPrompts: newVideoPrompts,
          };
        }
        return s;
      });

      const updatedPackage = { ...packageJson, scenes: updatedScenes };
      setPackageJson(updatedPackage);
      setThumbnails((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      setSceneVideoUrls((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      void loadSceneAssets(index);
    } catch (err) {
      console.error('Regenerate scene failed:', err);
    } finally {
      setSceneLoading(false);
    }
  };

  const handleExportSidecar = () => {
    if (!packageJson) return;
    const sidecar = {
      meta: {
        episode: episode,
        session: session,
        title: packageJson?.meta?.title || null,
      },
      scenes: packageJson.scenes.map((s:any) => ({
        index: s.index,
        narration: s.sceneOutput?.narration,
        visuals: s.sceneOutput?.visuals,
        sound: s.sceneOutput?.sound,
        imagePrompts: s.imagePrompts,
        videoPrompts: s.videoPrompts,
      })),
    };

    const blob = new Blob([JSON.stringify(sidecar, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `episode-${session}-${episode}-sidecar.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCreateZip = async () => {
    if (!packageJson) return;
    setSceneLoading(true);
    try {
      if (!(window as any).JSZip) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
          s.onload = () => resolve();
          s.onerror = (e) => reject(e);
          document.head.appendChild(s);
        });
      }
      const JSZipLib = (window as any).JSZip;
      const zip = new JSZipLib();

      // Add sidecar
      zip.file('sidecar.json', JSON.stringify({ meta: { episode, session }, scenes: packageJson.scenes.map((s:any) => ({ index: s.index, narration: s.sceneOutput.narration })) }, null, 2));

      // README
      zip.file('README.txt', `Episode ${session}-${episode} package\nGenerated by Episode Packager`);

      // For each scene, generate an image preview and a text-backed video preview
      for (const s of packageJson.scenes) {
        const videoPrompt = s.videoPrompts || s.sceneOutput?.narration || s.sceneOutput?.visuals || '';

        // Image
        try {
          const imageData = await generateSceneImage(s.imagePrompts || s.sceneOutput.visuals || s.sceneOutput.narration);
          if (imageData && imageData.startsWith('data:')) {
            const res = await fetch(imageData);
            const blob = await res.blob();
            zip.file(`images/scene-${s.index}.png`, blob);
          }
        } catch (e) {
          console.warn('Failed to generate scene image for zip:', e);
        }

        // Video preview
        try {
          const videoUrl = await generateVideo(videoPrompt, selectedModel);
          if (videoUrl) {
            zip.file(`videos/scene-${s.index}-url.txt`, videoUrl);
            zip.file(`videos/scene-${s.index}-prompt.txt`, videoPrompt);
          }
        } catch (e) {
          console.warn('Failed to generate video preview for zip:', e);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `episode-${session}-${episode}-assets.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Create ZIP failed:', err);
    } finally {
      setSceneLoading(false);
    }
  };

  const handleQueueServerRender = async () => {
    if (!packageJson) return;
    setServerRenderLoading(true);
    try {
      const response = await seriesRenderService.createRenderJob({
        episode_package: packageJson,
        generate_assets: true,
      });
      const nowSeconds = Math.floor(Date.now() / 1000);
      const queuedItem: ServerRenderJobStatus = {
        job_id: response.jobId,
        status: 'queued',
        created_at: nowSeconds,
        updated_at: nowSeconds,
        user_id: 'current',
        generate_assets: true,
        download_url: null,
        filename: null,
        error: null,
      };
      setServerRenderJobId(response.jobId);
      setServerRenderStatus(queuedItem);
      setRenderJobHistory((prev) => [queuedItem, ...prev.filter((job) => job.job_id !== queuedItem.job_id)].slice(0, 8));
    } catch (error) {
      console.error('Failed to queue server render job:', error);
    } finally {
      setServerRenderLoading(false);
    }
  };

  const handleDeleteServerRenderJob = async (jobId?: string) => {
    const targetJobId = jobId || serverRenderJobId;
    if (!targetJobId) return;
    setServerRenderDeleteLoading(true);
    try {
      await seriesRenderService.deleteRenderJob(targetJobId);
      setRenderJobHistory((prev) =>
        prev.map((job) =>
          job.job_id === targetJobId
            ? {
                ...job,
                status: 'cancelled',
                updated_at: Math.floor(Date.now() / 1000),
              }
            : job,
        ),
      );
      if (targetJobId === serverRenderJobId) {
        setServerRenderStatus((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
        setServerRenderJobId(null);
      }
    } catch (error) {
      console.error('Failed to delete/cancel server render job:', error);
    } finally {
      setServerRenderDeleteLoading(false);
    }
  };

  const handleClearFinishedJobs = () => {
    setRenderJobHistory((prev) => prev.filter((job) => !TERMINAL_JOB_STATUSES.includes(job.status)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Episode Packager</h3>
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Episode Package'}
        </Button>
      </div>

      {!packageJson && (
        <div className="p-4 rounded-lg bg-black/40 border border-white/5">Provide a production prompt and click "Generate Episode Package".</div>
      )}

      {packageJson && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 space-y-4">
            <h4 className="font-semibold">Scenes</h4>
            <div className="space-y-2 max-h-[520px] overflow-auto">
              {packageJson.scenes.map((s:any) => (
                <button
                  key={s.index}
                  onClick={() => handleSelectScene(s.index)}
                  className={`w-full text-left p-3 rounded border ${selectedSceneIndex === s.index ? 'border-studio text-studio' : 'border-white/5 bg-black/30'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-3">
                      <strong>Scene {s.index}</strong>
                      <div className="mt-1 h-10 w-16 rounded bg-black/50 overflow-hidden border border-white/10">
                        {thumbnailLoading[s.index] ? (
                          <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400">Loading</div>
                        ) : thumbnails[s.index] ? (
                          <img src={thumbnails[s.index] || ''} alt={`thumb-${s.index}`} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500">No Img</div>
                        )}
                      </div>
                      <div className="mt-2 space-y-1 text-xs leading-relaxed text-zinc-400">
                        <p className="whitespace-normal break-words"><span className="font-bold text-zinc-200">Narration:</span> {s.sceneOutput?.narration || 'No narration generated.'}</p>
                        <p className="whitespace-normal break-words"><span className="font-bold text-zinc-200">Visuals:</span> {s.sceneOutput?.visuals || 'No visuals generated.'}</p>
                        <p className="whitespace-normal break-words"><span className="font-bold text-zinc-200">Sound:</span> {s.sceneOutput?.sound || 'No sound generated.'}</p>
                      </div>
                    </div>
                    <div>
                      <Button size="icon" onClick={(e) => { e.stopPropagation(); handleRegenerateScene(s.index); }} disabled={sceneLoading}>
                        {sceneLoading ? '...' : '⟳'}
                      </Button>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Button onClick={handleExportSidecar} className="w-full">Export Sidecar Assets</Button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="font-semibold">Script</h4>
            <pre className="whitespace-pre-wrap p-3 rounded bg-black/30 border border-white/5 max-h-[240px] overflow-auto">{packageJson.script}</pre>

            <h4 className="font-semibold">Selected Scene — {selectedSceneIndex}</h4>
            {(() => {
              const s = packageJson.scenes.find((x:any) => x.index === selectedSceneIndex);
              if (!s) return <div className="p-3 bg-black/30 border border-white/5">Scene not found.</div>;
              return (
                <div className="p-3 rounded bg-black/30 border border-white/5">
                  <div className="space-y-4">
                    <div>
                      <strong className="block text-zinc-200 mb-2">Narration</strong>
                      <pre className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed bg-black/30 border border-white/5 rounded-xl p-3">{s.sceneOutput.narration}</pre>
                    </div>
                    <div>
                      <strong className="block text-zinc-200 mb-2">Visuals</strong>
                      <pre className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed bg-black/30 border border-white/5 rounded-xl p-3">{s.sceneOutput.visuals}</pre>
                    </div>
                    <div>
                      <strong className="block text-zinc-200 mb-2">Sound</strong>
                      <pre className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed bg-black/30 border border-white/5 rounded-xl p-3">{s.sceneOutput.sound}</pre>
                    </div>
                  </div>
                  <div className="mt-3">
                    <strong>Thumbnail</strong>
                    {thumbnailLoading[selectedSceneIndex] ? (
                      <div className="mt-2 text-xs text-zinc-500">Thumbnail generating...</div>
                    ) : thumbnails[selectedSceneIndex] ? (
                      <img src={thumbnails[selectedSceneIndex] || ''} alt={`scene-${selectedSceneIndex}`} className="w-full mt-2 rounded" />
                    ) : (
                      <div className="mt-2 text-xs text-zinc-500">Thumbnail unavailable.</div>
                    )}
                  </div>
                  <div className="mt-3">
                    <strong>Video Preview</strong>
                    {videoLoading[selectedSceneIndex] ? (
                      <div className="mt-2 text-xs text-zinc-500">Video preview generating...</div>
                    ) : sceneVideoUrls[selectedSceneIndex] ? (
                      <video src={sceneVideoUrls[selectedSceneIndex] || ''} controls className="w-full mt-2 rounded" />
                    ) : (
                      <div className="mt-2 text-xs text-zinc-500">Video preview unavailable.</div>
                    )}
                  </div>
                  <div className="mt-3">
                    <strong>Image Prompts</strong>
                    <pre className="whitespace-pre-wrap max-h-[160px] overflow-auto mt-2">{s.imagePrompts}</pre>
                  </div>
                  <div className="mt-3">
                    <strong>Video Prompts</strong>
                    <pre className="whitespace-pre-wrap max-h-[160px] overflow-auto mt-2">{s.videoPrompts}</pre>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="md:col-span-1 space-y-4">
            <h4 className="font-semibold">Episode Prompts</h4>
            <div className="p-3 rounded bg-black/30 border border-white/5">
              <strong>Image Prompts</strong>
              <pre className="whitespace-pre-wrap max-h-[200px] overflow-auto mt-2">{packageJson.episodeImagePrompts}</pre>
            </div>
            <div className="p-3 rounded bg-black/30 border border-white/5">
              <strong>Video Prompts</strong>
              <pre className="whitespace-pre-wrap max-h-[200px] overflow-auto mt-2">{packageJson.episodeVideoPrompts}</pre>
            </div>

            <div className="p-3 rounded bg-black/30 border border-white/5">
              <Button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(packageJson, null, 2))}
                className="w-full"
              >
                Copy JSON
              </Button>
              <Button className="w-full mt-2" onClick={handleCreateZip} disabled={sceneLoading}>Export ZIP</Button>
              <Button className="w-full mt-2" onClick={handleQueueServerRender} disabled={serverRenderLoading || !packageJson}>
                {serverRenderLoading ? 'Queueing...' : 'Queue Server Render'}
              </Button>

              {serverRenderJobId && (
                <div className="mt-3 text-xs space-y-1">
                  <div><strong>Job ID:</strong> {serverRenderJobId}</div>
                  <div><strong>Status:</strong> {serverRenderStatus?.status || 'queued'}</div>
                  {serverRenderStatus?.error && (
                    <div className="text-red-400"><strong>Error:</strong> {serverRenderStatus.error}</div>
                  )}
                  {serverRenderStatus?.download_url && (
                    <a className="underline" href={serverRenderStatus.download_url} target="_blank" rel="noreferrer">
                      Download Server ZIP
                    </a>
                  )}
                  <Button
                    className="w-full mt-2"
                    onClick={() => handleDeleteServerRenderJob(serverRenderJobId)}
                    disabled={serverRenderDeleteLoading}
                  >
                    {serverRenderDeleteLoading ? 'Working...' : 'Cancel/Delete Server Job'}
                  </Button>
                </div>
              )}

              {renderJobHistory.length > 0 && (
                <div className="mt-3 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong>Recent Server Jobs</strong>
                    <button type="button" onClick={handleClearFinishedJobs} className="underline text-zinc-400 hover:text-zinc-200">Clear Finished</button>
                  </div>
                  <div className="max-h-[180px] overflow-auto space-y-2">
                    {renderJobHistory.map((job) => (
                      <div key={job.job_id} className="border border-white/10 rounded p-2">
                        <div className="truncate"><strong>ID:</strong> {job.job_id}</div>
                        <div><strong>Status:</strong> {job.status}</div>
                        <div><strong>Updated:</strong> {new Date(job.updated_at * 1000).toLocaleTimeString()}</div>
                        {job.download_url && (
                          <a className="underline block mt-1" href={job.download_url} target="_blank" rel="noreferrer">
                            Download ZIP
                          </a>
                        )}
                        {!TERMINAL_JOB_STATUSES.includes(job.status) && (
                          <Button
                            className="w-full mt-2"
                            onClick={() => handleDeleteServerRenderJob(job.job_id)}
                            disabled={serverRenderDeleteLoading}
                          >
                            {serverRenderDeleteLoading ? 'Working...' : 'Cancel'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <a
                className="block mt-2 text-center underline"
                href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(packageJson, null, 2))}`}
                download={`episode-${session}-${episode}-package.json`}
              >
                Download JSON
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
