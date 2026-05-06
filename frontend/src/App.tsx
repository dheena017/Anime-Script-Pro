import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/pages/auth/components/ProtectedRoute';
import { ErrorBoundary } from '@/lib/error-utils';
import { NavigationMonitor } from '@/pages/studio/components/studio/NavigationMonitor';
import { RootProviders } from '@/contexts/RootProviders';
import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';
import { StudioContextWrapper } from '@/components/layout/StudioContextWrapper';

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
const ManhwaLayout = lazy(() => import('@/pages/studio/ManhwaStudio/ManhwaStudioLayout'));
const ComicLayout = lazy(() => import('@/pages/studio/ComicStudio/Layout'));

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

// Manhwa Studio Phase Layouts
const ManhwaWorldLayout = lazy(() => import('@/pages/studio/ManhwaStudio/World/WorldLayout'));
const ManhwaCastLayout = lazy(() => import('@/pages/studio/ManhwaStudio/Cast/CastLayout'));

// Comic Studio Phase Layouts
const ComicWorldLayout = lazy(() => import('@/pages/studio/ComicStudio/World/WorldLayout'));

const EpisodeViewPage = lazy(() => import('@/pages/studio/AnimeStudio/Series/Episodes/EpisodeViewPage'));
const EpisodeEditPage = lazy(() => import('@/pages/studio/AnimeStudio/Series/Episodes/EpisodeEditPage'));

const CharactersPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Characters/CharactersPage'));
const CharacterViewPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Characters/CharacterViewPage'));
const CharacterEditPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Characters/CharacterEditPage'));
const CharacterCreationPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/CharacterCreationPage').then(m => ({ default: m.CharacterCreationPage })));
const DNAPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/DNAPage').then(m => ({ default: m.DNAPage })));
const DynamicsPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/DynamicsPage').then(m => ({ default: m.DynamicsPage })));

const RelationshipsPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Relationships/RelationshipsPage'));
const AddRelationshipPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Relationships/AddRelationshipPage'));
const RelationshipViewPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Relationships/RelationshipViewPage'));
const RelationshipEditPage = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/Relationships/RelationshipEditPage'));

const RegistryTab = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/RegistryTab').then(m => ({ default: m.RegistryTab })));
const IntegrityTab = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/IntegrityTab').then(m => ({ default: m.IntegrityTab })));
const AddLeadTab = lazy(() => import('@/pages/studio/AnimeStudio/Cast/Tabs/AddLeadTab').then(m => ({ default: m.AddLeadTab })));

export default function App() {
  return (
    <ErrorBoundary>
      <RootProviders>
        <Router>
          <NavigationMonitor />
          <Suspense fallback={<StudioLoading fullPage message="Starting Anime Script Pro" />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Studio Global Layout */}
              <Route element={<AuthRoute><StudioLayout /></AuthRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects/*" element={<ProjectsPage />} />
                <Route path="/notifications/*" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/system/*" element={<SystemModule />} />
                <Route path="/discover/*" element={<DiscoverModule />} />
                <Route path="/community/*" element={<CommunityModule />} />
                <Route path="/academy/*" element={<AcademyModule />} />
                <Route path="/tutorials/*" element={<AcademyModule />} />
                <Route path="/settings/*" element={<SettingsModule />} />

                <Route path="/library/*" element={<LibraryModule />} />
              </Route>

              {/* INDEPENDENT STUDIO CONTEXTS (No global StudioLayout) */}
              {/* Anime Studio Context */}
              <Route
                path="/anime"
                element={
                  <StudioContextWrapper>
                    <AnimeLayout />
                  </StudioContextWrapper>
                }
              >
                <Route index element={<Navigate to="/anime/Engine" replace />} />

                <Route path="world" element={<WorldLayout />}>
                  <Route index element={<AnimeWorld />} />
                </Route>

           

                <Route path="assets" element={<AssetsLayout />}>
                  <Route index element={<AssetsPage />} />
                  <Route path="seo" element={<AssetsPage />} />
                  <Route path="prompts" element={<AssetsPage />} />
                </Route>

                <Route path="cast" element={<CastLayout />}>
                  <Route index element={<RegistryTab />} />
                  <Route path="registry" element={<RegistryTab />} />
                  <Route path="characters" element={<CharactersPage />} />
                  <Route path="characters/:id" element={<CharacterViewPage />} />
                  <Route path="characters/:id/edit" element={<CharacterEditPage />} />
                  <Route path="creation" element={<CharacterCreationPage />} />
                  <Route path="dna" element={<DNAPage />} />
                  <Route path="dynamics" element={<DynamicsPage />} />
                  <Route path="integrity" element={<IntegrityTab />} />
                  <Route path="add-lead" element={<AddLeadTab />} />
                  <Route path="relationships" element={<RelationshipsPage />} />
                  <Route path="matrix" element={<RelationshipsPage />} />
                  <Route path="relationships/add" element={<AddRelationshipPage />} />
                  <Route path="relationships/:id" element={<RelationshipViewPage />} />
                  <Route path="relationships/:id/edit" element={<RelationshipEditPage />} />
                </Route>

                <Route path="series" element={<SeriesLayout />}>
                  <Route index element={<AnimeSeries />} />
                  <Route path="roadmap" element={<AnimeSeries />} />
                  <Route path="arcs" element={<AnimeSeries />} />
                  <Route path="blueprint" element={<AnimeSeries />} />
                  <Route path="assets" element={<AnimeSeries />} />
                  <Route path="timeline" element={<AnimeSeries />} />
                  <Route path="episodes" element={<AnimeSeries />} />
                  <Route path="episodes/:id" element={<EpisodeViewPage />} />
                  <Route path="episodes/:id/edit" element={<EpisodeEditPage />} />
                </Route>

                <Route path="script" element={<ScriptLayout />}>
                  <Route index element={<AnimeScript />} />
                </Route>

                <Route path="storyboard" element={<StoryboardLayout />}>
                  <Route index element={<AnimeStoryboard />} />
                  <Route path="scenes" element={<AnimeStoryboard />} />
                  <Route path="scenes/:id" element={<SceneViewPage />} />
                </Route>

                <Route path="seo" element={<SEOLayout />}>
                  <Route index element={<SEOPage />} />
                </Route>

                <Route path="prompts" element={<PromptsLayout />}>
                  <Route index element={<PromptsPage />} />
                </Route>

                <Route path="screening" element={<ScreeningLayout />}>
                  <Route index element={<AnimeScreening />} />
                </Route>

                <Route path="engine" element={<EngineLayout />}>
                  <Route index element={<AnimeEngine />} />
                </Route>
              </Route>

              {/* Manhwa Studio Context */}
              <Route
                path="/manhwa"
                element={
                  <StudioContextWrapper>
                    <ManhwaLayout />
                  </StudioContextWrapper>
                }
              >
                <Route index element={<Navigate to="/manhwa/world" replace />} />
                <Route path="world" element={<ManhwaWorldLayout />} />
                <Route path="cast" element={<ManhwaCastLayout />} />
                <Route path="engine" element={<EngineLayout />} />
                <Route path="script" element={<ScriptLayout />} />
                <Route path="storyboard" element={<StoryboardLayout />} />
                <Route path="seo" element={<SEOLayout />} />
                <Route path="prompts" element={<PromptsLayout />} />
                <Route path="screening" element={<ScreeningLayout />} />
              </Route>

              {/* Comic Studio Context */}
              <Route
                path="/comic"
                element={
                  <StudioContextWrapper>
                    <ComicLayout />
                  </StudioContextWrapper>
                }
              >
                <Route index element={<Navigate to="/comic/world" replace />} />
                <Route path="world" element={<ComicWorldLayout />} />
                <Route path="engine" element={<EngineLayout />} />
                <Route path="script" element={<ScriptLayout />} />
                <Route path="storyboard" element={<StoryboardLayout />} />
                <Route path="seo" element={<SEOLayout />} />
                <Route path="prompts" element={<PromptsLayout />} />
                <Route path="screening" element={<ScreeningLayout />} />
              </Route>

              {/* Legacy Redirects */}
              <Route path="/projects/new" element={<AuthRoute><CreateProject /></AuthRoute>} />
              <Route path="/api-reference" element={<AuthRoute><ApiReferencePage /></AuthRoute>} />
              <Route path="/lore-database" element={<AuthRoute><LoreDatabasePage /></AuthRoute>} />
              <Route path="/projects/wizard" element={<AuthRoute><ProjectWizard /></AuthRoute>} />
              <Route path="/status/*" element={<Navigate to="/system" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </RootProviders>
    </ErrorBoundary>
  );
}
