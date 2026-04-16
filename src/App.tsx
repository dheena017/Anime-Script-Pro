import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { LibraryPage } from './pages/Library';
import { CommunityPage } from './pages/Community';
import { DiscoverPage } from './pages/DiscoverPage';
import { SettingsPage } from './pages/Settings';
import { TutorialsPage } from './pages/Tutorials';
import { ErrorBoundary, SystemErrorPanel } from './lib/error-utils';
import { TooltipProvider } from './components/ui/tooltip';
import { GeneratorProvider } from './contexts/GeneratorContext';
import { StudioLayout } from './pages/studio/StudioLayout';
import { ScriptPage } from './pages/studio/ScriptPage';
import { CastPage } from './pages/studio/CastPage';
import { SeriesPage } from './pages/studio/SeriesPage';
import { StoryboardPage } from './pages/studio/StoryboardPage';
import { SEOPage } from './pages/studio/SEOPage';
import { PromptsPage } from './pages/studio/PromptsPage';
import { ExamplePage } from './pages/studio/ExamplePage';
import { TemplatePage } from './pages/studio/TemplatePage';
import { FrameworkPage } from './pages/studio/FrameworkPage';
import { WhatIfPage } from './pages/studio/WhatIfPage';
import { AudioBayPage } from './pages/studio/AudioBayPage';
import { ExportPage } from './pages/studio/ExportPage';

export default function App() {
  return (
    <ErrorBoundary>
      <SystemErrorPanel />
      <GeneratorProvider>
        <TooltipProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<StudioLayout />}>
                  <Route index element={<ScriptPage />} />
                  <Route path="studio/script" element={<ScriptPage />} />
                  <Route path="studio/cast" element={<CastPage />} />
                  <Route path="studio/series" element={<SeriesPage />} />
                  <Route path="studio/storyboard" element={<StoryboardPage />} />
                  <Route path="studio/seo" element={<SEOPage />} />
                  <Route path="studio/prompts" element={<PromptsPage />} />
                  <Route path="studio/example" element={<ExamplePage />} />
                  <Route path="studio/template" element={<TemplatePage />} />
                  <Route path="studio/framework" element={<FrameworkPage />} />
                  <Route path="studio/whatif" element={<WhatIfPage />} />
                  <Route path="studio/audio" element={<AudioBayPage />} />
                  <Route path="studio/export" element={<ExportPage />} />
                </Route>
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/tutorials" element={<TutorialsPage />} />
              </Route>
            </Routes>
          </Router>
        </TooltipProvider>
      </GeneratorProvider>
    </ErrorBoundary>
  );
}
