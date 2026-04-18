import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { LibraryPage } from './pages/Library';
import { CommunityPage } from './pages/Community';
import { DiscoverPage } from './pages/DiscoverPage';
import { SettingsPage } from './pages/Settings';
import { TutorialsPage } from './pages/Tutorials';
import { ErrorBoundary } from './lib/error-utils';
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

export default function App() {
  return (
    <ErrorBoundary>
      <GeneratorProvider>
        <TooltipProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                {/* Default redirect to anime if at root */}
                <Route path="/" element={<StudioLayout type="Anime" />}>
                  <Route index element={<ScriptPage />} />
                  <Route path="script" element={<ScriptPage />} />
                  <Route path="cast" element={<CastPage />} />
                  <Route path="series" element={<SeriesPage />} />
                  <Route path="storyboard" element={<StoryboardPage />} />
                  <Route path="seo" element={<SEOPage />} />
                  <Route path="prompts" element={<PromptsPage />} />
                  <Route path="example" element={<ExamplePage />} />
                  <Route path="template" element={<TemplatePage />} />
                  <Route path="framework" element={<FrameworkPage />} />
                </Route>

                <Route path="/anime" element={<StudioLayout type="Anime" />}>
                  <Route index element={<ScriptPage />} />
                  <Route path="script" element={<ScriptPage />} />
                  <Route path="cast" element={<CastPage />} />
                  <Route path="series" element={<SeriesPage />} />
                  <Route path="storyboard" element={<StoryboardPage />} />
                  <Route path="seo" element={<SEOPage />} />
                  <Route path="prompts" element={<PromptsPage />} />
                  <Route path="example" element={<ExamplePage />} />
                  <Route path="template" element={<TemplatePage />} />
                  <Route path="framework" element={<FrameworkPage />} />
                </Route>

                <Route path="/manhwa" element={<StudioLayout type="Manhwa" />}>
                  <Route index element={<ScriptPage />} />
                  <Route path="script" element={<ScriptPage />} />
                  <Route path="cast" element={<CastPage />} />
                  <Route path="series" element={<SeriesPage />} />
                  <Route path="storyboard" element={<StoryboardPage />} />
                  <Route path="seo" element={<SEOPage />} />
                  <Route path="prompts" element={<PromptsPage />} />
                  <Route path="example" element={<ExamplePage />} />
                  <Route path="template" element={<TemplatePage />} />
                  <Route path="framework" element={<FrameworkPage />} />
                </Route>

                <Route path="/comic" element={<StudioLayout type="Comic" />}>
                  <Route index element={<ScriptPage />} />
                  <Route path="script" element={<ScriptPage />} />
                  <Route path="cast" element={<CastPage />} />
                  <Route path="series" element={<SeriesPage />} />
                  <Route path="storyboard" element={<StoryboardPage />} />
                  <Route path="seo" element={<SEOPage />} />
                  <Route path="prompts" element={<PromptsPage />} />
                  <Route path="example" element={<ExamplePage />} />
                  <Route path="template" element={<TemplatePage />} />
                  <Route path="framework" element={<FrameworkPage />} />
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
