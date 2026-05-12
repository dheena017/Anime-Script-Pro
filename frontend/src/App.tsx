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
const AnimeScript = lazy(() => import('@/pages/studio/AnimeStudio/Script/ScriptPage').then(m => ({ default: m.ScriptPage })));
const AnimeSeries = lazy(() => import('@/pages/studio/AnimeStudio/Series/SeriesPage').then(m => ({ default: m.SeriesPage })));
const AnimeStoryboard = lazy(() => import('@/pages/studio/AnimeStudio/Storyboard/StoryboardPage').then(m => ({ default: m.StoryboardPage })));
const SEOPage = lazy(() => import('@/pages/studio/AnimeStudio/SEO/SEOPage').then(m => ({ default: m.SEOPage })));
const PromptsPage = lazy(() => import('@/pages/studio/AnimeStudio/Prompts/PromptsPage').then(m => ({ default: m.PromptsPage })));
const AnimeScreening = lazy(() => import('@/pages/studio/AnimeStudio/Screening/ScreeningRoom').then(m => ({ default: m.ScreeningRoom })));
const AnimeEngine = lazy(() => import('@/pages/studio/AnimeStudio/Engine/EnginePage').then(m => ({ default: m.EnginePage })));
const AnimeWorld = lazy(() => import('@/pages/studio/AnimeStudio/World/WorldPage').then(m => ({ default: m.WorldPage })));

// Production System Layouts (Shared/Contextual)
const WorldLayout = lazy(() => import('@/pages/studio/AnimeStudio/World/WorldLayout'));
const CastLayout = lazy(() => import('@/pages/studio/AnimeStudio/Cast/CastLayout'));
const RegistryTab = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/RegistryTab').then(m => ({ default: m.RegistryTab })));
const VoiceTab = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/VoiceTab').then(m => ({ default: m.VoiceTab })));
const CombatTab = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/CombatTab').then(m => ({ default: m.CombatTab })));
const ArcsTab = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/ArcsTab').then(m => ({ default: m.ArcsTab })));
const DynamicsTab = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/DynamicsTab').then(m => ({ default: m.DynamicsTab })));
const RelationshipsPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Relationships/RelationshipsPage'));
const RelationshipViewPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Relationships/RelationshipViewPage'));
const RelationshipEditPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Relationships/RelationshipEditPage'));
const TechnicalTab = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/TechnicalTab').then(m => ({ default: m.TechnicalTab })));
const CharacterViewPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Characters/CharacterViewPage'));
const CharacterEditPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Characters/CharacterEditPage'));

const SeriesLayout = lazy(() => import('@/pages/studio/AnimeStudio/Series/SeriesLayout'));
const ScriptLayout = lazy(() => import('@/pages/studio/AnimeStudio/Script/ScriptLayout'));
const StoryboardLayout = lazy(() => import('@/pages/studio/AnimeStudio/Storyboard/StoryboardLayout'));
const SceneViewPage = lazy(() => import('@/pages/studio/AnimeStudio/Storyboard/SceneViewPage').then(m => ({ default: m.SceneViewPage })));
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
      <Routes location={location}>
        {/* Public Routes */}
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
        {/* Studio Global Layout */}
        <Route element={<AuthRoute><StudioLayout /></AuthRoute>}>
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
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
            <Route index element={<Navigate to="engine" replace />} />
            <Route path="engine" element={<EngineLayout />}>
              <Route index element={<PageTransition><AnimeEngine /></PageTransition>} />
            </Route>
            <Route path="world" element={<WorldLayout />}>
              <Route index element={<PageTransition><AnimeWorld /></PageTransition>} />
            </Route>
            <Route path="cast" element={<CastLayout />} />
            <Route path="series" element={<SeriesLayout />}>
              <Route index element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="roadmap" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="arcs" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="blueprint" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="assets" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="timeline" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="episodes" element={<PageTransition><AnimeSeries /></PageTransition>} />
              <Route path="episodes/:id" element={<PageTransition><EpisodeViewPage /></PageTransition>} />
              <Route path="episodes/:id/edit" element={<PageTransition><EpisodeEditPage /></PageTransition>} />
            </Route>
            <Route path="script" element={<ScriptLayout />}>
              <Route index element={<PageTransition><AnimeScript /></PageTransition>} />
            </Route>
            <Route path="storyboard" element={<StoryboardLayout />}>
              <Route index element={<PageTransition><AnimeStoryboard /></PageTransition>} />
              <Route path="scenes" element={<PageTransition><AnimeStoryboard /></PageTransition>} />
              <Route path="scenes/:id" element={<PageTransition><SceneViewPage /></PageTransition>} />
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
