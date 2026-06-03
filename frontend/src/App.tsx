import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/animation/PageTransition';
import { ProtectedRoute } from '@/pages/auth/components/ProtectedRoute';
import { ErrorBoundary } from '@/lib/error-utils';
import { NavigationMonitor } from '@/pages/studio/components/studio/NavigationMonitor';
import { RootProviders } from '@/contexts/RootProviders';
import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';
import { StudioContextWrapper } from '@/components/layout/StudioContextWrapper';
import ApiReferencePage from './pages/projects/ApiReference';
import LoreDatabasePage from './pages/projects/LoreDatabase';
import NotFoundPage from './pages/errors/NotFoundPage';

function AuthRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

const StudioLayout = lazy(() => import('@/layouts/StudioLayout').then(m => ({ default: m.StudioLayout })));

// Core Pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const NotificationsPage = lazy(() => import('@/pages/studio/Notifications/NotificationsPage'));
const PopNotificationShowcase = lazy(() => import('@/pages/studio/Notifications/PopNotificationShowcase'));
const CreateProject = lazy(() => import('@/pages/projects/CreateProject'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage').then(m => ({ default: m.ProfilePage })));
const LandingPage = lazy(() => import('@/pages/Landing/LandingPage'));
const AuthPage = lazy(() => import('@/pages/auth/Auth'));
const PricingPage = lazy(() => import('@/pages/marketing/Pricing'));
const HelpPage = lazy(() => import('@/pages/marketing/Help'));
const ContactPage = lazy(() => import('@/pages/marketing/Contact'));
const TermsPage = lazy(() => import('@/pages/marketing/Terms'));
const ProjectsPage = lazy(() => import('@/pages/projects/Projects'));
const ProjectWizard = lazy(() => import('@/pages/projects/ProjectWizard'));

// New Modular Pages
const SystemModule = lazy(() => import('@/pages/studio/system/SystemPage'));
const DiscoverModule = lazy(() => import('@/pages/studio/Discover/DiscoverPage'));
const CommunityModule = lazy(() => import('@/pages/studio/Community/CommunityPage'));
const AcademyModule = lazy(() => import('@/pages/studio/Tutorials/AcademyPage'));
const SettingsModule = lazy(() => import('@/pages/studio/Settings/SettingsPage'));
const LibraryModule = lazy(() => import('@/pages/studio/Library/LibraryPage'));

// Studio Layouts
const AnimeLayout = lazy(() => import('@/pages/studio/AnimeStudio/Layout'));

// Anime Studio Pages
const AnimeSeries = lazy(() => import('@/pages/studio/AnimeStudio/Series/SeriesPage').then(m => ({ default: (m as any).default || (m as any).SeriesPage })));
const AnimeStoryboard = lazy(() => import('@/pages/studio/AnimeStudio/Storyboard/StoryboardPage').then(m => ({ default: m.StoryboardPage })));
const SEOPage = lazy(() => import('@/pages/studio/AnimeStudio/SEO/SEOPage').then(m => ({ default: m.SEOPage })));
const PromptsPage = lazy(() => import('@/pages/studio/AnimeStudio/Prompts/PromptsPage').then(m => ({ default: m.PromptsPage })));
const AnimeScreening = lazy(() => import('@/pages/studio/AnimeStudio/Screening/ScreeningRoom').then(m => ({ default: m.ScreeningRoom })));
const AnimeEngine = lazy(() => import('@/pages/studio/AnimeStudio/Engine/EnginePage').then(m => ({ default: m.EnginePage })));
const AnimeWorld = lazy(() => import('@/pages/studio/AnimeStudio/World/WorldPage').then(m => ({ default: m.WorldPage })));
const AnimeConsole = lazy(() => import('@/pages/studio/AnimeStudio/Console/ConsolePage').then(m => ({ default: m.ConsolePage })));

// Production System Layouts (Shared/Contextual)
const WorldLayout = lazy(() => import('@/pages/studio/AnimeStudio/World/WorldLayout'));
const CharactersLayout = lazy(() => import('@/pages/studio/AnimeStudio/Characters/CharactersLayout'));
const VoiceTab = lazy(() => import('@/pages/studio/AnimeStudio/Characters/Tabs/VoiceTab').then(m => ({ default: m.VoiceTab })));
const CombatTab = lazy(() => import('@/pages/studio/AnimeStudio/Characters/Tabs/CombatTab').then(m => ({ default: m.CombatTab })));
const ArcsTab = lazy(() => import('@/pages/studio/AnimeStudio/Characters/Tabs/ArcsTab').then(m => ({ default: m.ArcsTab })));
const DynamicsTab = lazy(() => import('@/pages/studio/AnimeStudio/Characters/Tabs/DynamicsTab').then(m => ({ default: m.DynamicsTab })));
const RelationshipsPage = lazy(() => import('@/pages/studio/AnimeStudio/Characters/Tabs/RelationshipsPage'));
const RelationshipViewPage = lazy(() => import('@/pages/studio/AnimeStudio/Characters/Tabs/RelationshipViewPage'));
const RelationshipEditPage = lazy(() => import('@/pages/studio/AnimeStudio/Characters/components/EditPage').then(m => ({ default: m.RelationshipEditPage })));
const TechnicalTab = lazy(() => import('@/pages/studio/AnimeStudio/Characters/Tabs/TechnicalTab').then(m => ({ default: m.TechnicalTab })));
const CharacterViewPage = lazy(() => import('@/pages/studio/AnimeStudio/Characters/components/CharacterViewPage'));
const CharacterEditPage = lazy(() => import('@/pages/studio/AnimeStudio/Characters/components/EditPage').then(m => ({ default: m.CharacterEditPage })));

const SeriesLayout = lazy(() => import('@/pages/studio/AnimeStudio/Series/SeriesLayout'));
// Script page removed
const StoryboardLayout = lazy(() => import('@/pages/studio/AnimeStudio/Storyboard/StoryboardLayout'));

const FramesTab = lazy(() => import('@/pages/studio/AnimeStudio/Storyboard/Tabs/FramesTab').then(m => ({ default: m.FramesTab })));
const AnglesTab = lazy(() => import('@/pages/studio/AnimeStudio/Storyboard/Tabs/AnglesTab').then(m => ({ default: m.AnglesTab })));
const CompositionTab = lazy(() => import('@/pages/studio/AnimeStudio/Storyboard/Tabs/CompositionTab').then(m => ({ default: m.CompositionTab })));
const AnimaticTab = lazy(() => import('@/pages/studio/AnimeStudio/Storyboard/Tabs/AnimaticTab').then(m => ({ default: m.AnimaticTab })));
const AudioTab = lazy(() => import('@/pages/studio/AnimeStudio/Storyboard/Tabs/AudioTab').then(m => ({ default: m.AudioTab })));
const SEOLayout = lazy(() => import('@/pages/studio/AnimeStudio/SEO/SEOLayout'));
const PromptsLayout = lazy(() => import('@/pages/studio/AnimeStudio/Prompts/PromptsLayout'));
const ScreeningLayout = lazy(() => import('@/pages/studio/AnimeStudio/Screening/ScreeningLayout'));
const EngineLayout = lazy(() => import('@/pages/studio/AnimeStudio/Engine/EngineLayout'));
const AssetsLayout = lazy(() => import('@/pages/studio/AnimeStudio/Assets/AssetsLayout'));
const AssetsPage = lazy(() => import('@/pages/studio/AnimeStudio/Assets/AssetsPage').then(m => ({ default: m.AssetsPage })));

// (Manhwa and Comic studios removed)

const EpisodeViewPage = lazy(() => import('@/pages/studio/AnimeStudio/Series/Episodes/EpisodeViewPage'));
const EpisodeEditPage = lazy(() => import('@/pages/studio/AnimeStudio/Series/Episodes/EpisodeEditPage'));


function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/series" element={<Navigate to="/studio/series" replace />} />
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
        <Route path="/help" element={<PageTransition><HelpPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />

        {/* Studio Global Layout */}
        <Route element={<AuthRoute><StudioLayout /></AuthRoute>}>
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/notifications/showcase" element={<PageTransition><PopNotificationShowcase /></PageTransition>} />
          <Route path="/notifications/*" element={<PageTransition><NotificationsPage /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
          <Route path="/system/*" element={<PageTransition><SystemModule /></PageTransition>} />
          <Route path="/discover/*" element={<PageTransition><DiscoverModule /></PageTransition>} />
          <Route path="/community/*" element={<PageTransition><CommunityModule /></PageTransition>} />
          <Route path="/academy/*" element={<PageTransition><AcademyModule /></PageTransition>} />
          <Route path="/tutorials/*" element={<PageTransition><AcademyModule /></PageTransition>} />
          <Route path="/settings/*" element={<PageTransition><SettingsModule /></PageTransition>} />
          <Route path="/library/*" element={<PageTransition><LibraryModule /></PageTransition>} />

          {/* Projects Management */}
          <Route path="/projects">
            <Route index element={<Navigate to="all" replace />} />
            <Route path="new" element={<PageTransition><CreateProject /></PageTransition>} />
            <Route path="all" element={<PageTransition><ProjectsPage /></PageTransition>} />
            <Route path="draft" element={<PageTransition><ProjectsPage /></PageTransition>} />
            <Route path="active" element={<PageTransition><ProjectsPage /></PageTransition>} />
            <Route path="completed" element={<PageTransition><ProjectsPage /></PageTransition>} />
            <Route path="history" element={<PageTransition><ProjectsPage /></PageTransition>} />
          </Route>
        </Route>

        {/* Project Studio Context (Studio Environment) */}
        {['/projects/:projectId', '/studio'].map(basePath => (
          <Route
            key={basePath}
            path={basePath}
            element={
              <AuthRoute>
                <StudioContextWrapper>
                  <AnimeLayout />
                </StudioContextWrapper>
              </AuthRoute>
            }
          >
            <Route index element={<Navigate to="console" replace />} />
            <Route path="console" element={<PageTransition><AnimeConsole /></PageTransition>} />
            <Route path="engine" element={<EngineLayout />}>
              <Route index element={<PageTransition><AnimeEngine /></PageTransition>} />
            </Route>
            <Route path="world" element={<WorldLayout />}>
              <Route index element={<PageTransition><AnimeWorld /></PageTransition>} />
            </Route>
            <Route path="cast" element={<CharactersLayout />} />
            <Route path="cast/characters/:characterName" element={<PageTransition><CharacterViewPage /></PageTransition>} />
            <Route path="cast/characters/:characterName/edit" element={<PageTransition><CharacterEditPage /></PageTransition>} />
            <Route path="series" element={<SeriesLayout />}>
              <Route index element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="roadmap" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="arcs" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="blueprint" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="ai-output" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="assets" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="timeline" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="episodes" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="episodes/:id" element={<PageTransition><EpisodeViewPage /></PageTransition>} />
              <Route path="episodes/:id/edit" element={<PageTransition><EpisodeEditPage /></PageTransition>} />
            </Route>
            {/* Script page removed */}
            <Route path="storyboard" element={<StoryboardLayout />}>
              <Route element={<AnimeStoryboard />}>
                <Route index element={<Navigate to="video" replace />} />
                <Route path="video" element={<PageTransition><FramesTab /></PageTransition>} />
                <Route path="angles" element={<PageTransition><AnglesTab /></PageTransition>} />
                <Route path="composition" element={<PageTransition><CompositionTab /></PageTransition>} />
                <Route path="animatic" element={<PageTransition><AnimaticTab /></PageTransition>} />
                <Route path="audio" element={<PageTransition><AudioTab /></PageTransition>} />
              </Route>
              <Route path="scenes" element={<PageTransition><AnimeStoryboard /></PageTransition>} />
            </Route>
            <Route path="seo" element={<SEOLayout />}>
              <Route index element={<PageTransition><SEOPage /></PageTransition>} />
            </Route>
            <Route path="prompts" element={<PromptsLayout />}>
              <Route index element={<PageTransition><PromptsPage /></PageTransition>} />
            </Route>
            <Route path="screening" element={<ScreeningLayout />}>
              <Route index element={<PageTransition><AnimeScreening /></PageTransition>} />
            </Route>
            <Route path="assets" element={<AssetsLayout />}>
              <Route index element={<PageTransition><AssetsPage /></PageTransition>} />
            </Route>
            <Route path="api" element={<PageTransition><ApiReferencePage /></PageTransition>} />
            <Route path="lore" element={<PageTransition><LoreDatabasePage /></PageTransition>} />
          </Route>
        ))}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <RootProviders>
          <NavigationMonitor />
          <Suspense fallback={<StudioLoading fullPage message="Starting Anime Script Pro" />}>
            <AppRoutes />
          </Suspense>
        </RootProviders>
      </ErrorBoundary>
    </Router>
  );
}
