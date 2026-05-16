export const projectsStyles = {
  // Container & Layout
  pageContainer: "min-h-screen bg-[#050505] text-white py-24 px-6 md:px-12 relative overflow-hidden",
  contentWrapper: "max-w-7xl mx-auto space-y-10 relative z-10",
  
  // Header & Hero
  heroSection: "space-y-4",
  heroTag: "flex items-center gap-3",
  heroTagLine: "w-10 h-[2px] bg-studio",
  heroTagText: "text-xs font-black uppercase tracking-[0.4em] text-studio",
  heroTitleWrapper: "flex flex-col md:flex-row md:items-end justify-between gap-6",
  heroTitleSection: "space-y-2",
  heroTitle: "text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none",
  heroTitleAccent: "text-studio",
  heroSubtitle: "text-zinc-500 font-bold uppercase text-xs tracking-[0.2em] max-w-xl",
  
  // Metrics Display
  metricsGroup: "flex items-center gap-12 pb-2",
  metricCard: "space-y-1",
  metricLabel: "text-xs font-black text-zinc-700 uppercase tracking-widest block",
  metricValue: "text-3xl font-black text-white uppercase italic trekking-widest tabular-nums",
  metricComplexity: "flex items-center gap-2",
  metricIndicator: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse",
  metricPercentage: "text-sm font-black text-zinc-300 uppercase tracking-[0.2em]",
  
  // Grid Layout
  configGrid: "grid grid-cols-1 lg:grid-cols-12 gap-12",
  configLeftCol: "lg:col-span-8 space-y-12",
  configRightCol: "lg:col-span-4 space-y-8 flex flex-col",
  
  // Config Nodes / Cards
  configCard: "bg-[#0a0a0b] border border-white/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden group",
  configHeader: "flex items-center justify-between mb-12",
  configIcon: "w-10 h-10 rounded-xl bg-studio/10 flex items-center justify-center border border-studio/20",
  configTitle: "text-sm font-black uppercase tracking-[0.3em] text-white italic",
  configBadge: "text-xs font-black text-zinc-700 bg-white/[0.02] px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest",
  
  // Input Elements
  textInput: "w-full bg-black/40 border border-zinc-900 rounded-[2rem] px-10 py-8 text-3xl font-black text-white placeholder:text-zinc-800 focus:border-studio/50 outline-none transition-all shadow-inner uppercase italic tracking-tighter",
  selectInput: "w-full bg-black/60 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:border-studio/50 transition-all appearance-none cursor-pointer uppercase tracking-widest",
  toggleButtonGroup: "flex bg-black/60 border border-zinc-900 rounded-2xl p-1.5",
  toggleButton: "flex-1 py-3 text-xs font-black uppercase rounded-xl transition-all",
  toggleButtonActive: "bg-studio text-black shadow-lg",
  toggleButtonInactive: "text-zinc-600 hover:text-zinc-400",
  
  // Sidebar
  sidebarWrapper: "space-y-8",
  sidebarCard: "bg-[#0a0a0b] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group",
  sidebarTitle: "text-sm font-black uppercase tracking-[0.3em] text-white italic flex items-center gap-3",
  sidebarContent: "space-y-3 mt-6",
  
  // Preset/Option Grid
  presetGrid: "grid grid-cols-2 gap-3",
  presetButton: "px-4 py-3 bg-black/40 border border-zinc-800 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:border-studio/30 hover:text-studio transition-all",
  
  // Toolbar
  toolbar: "flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5",
  toolbarTabs: "flex items-center gap-1 bg-[#0a0a0b] p-1.5 rounded-[1.25rem] border border-white/5 shadow-2xl overflow-x-auto no-scrollbar",
  tabButton: "group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap",
  tabButtonActive: "bg-studio text-black shadow-lg",
  tabButtonInactive: "text-zinc-500 hover:bg-white/5 hover:text-zinc-200",
  tabIcon: "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
  tabIconActive: "text-black",
  tabIconInactive: "text-zinc-600 group-hover:text-studio",
  tabLabel: "text-xs font-black uppercase tracking-[0.2em]",
  tabIndicator: "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full",
  
  // Action Buttons
  primaryButton: "group relative flex items-center gap-3 bg-studio text-black px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]",
  primaryButtonGlow: "absolute inset-x-0 bottom-0 h-1 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform",
  
  // Project List
  projectListContainer: "space-y-6",
  projectListHeader: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0b] border border-white/5 p-4 rounded-2xl",
  projectSearchBox: "relative flex-1",
  projectSearchInput: "w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold uppercase tracking-widest text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-studio/50 transition-colors",
  projectViewToggle: "flex items-center gap-2 border-l border-white/10 pl-2",
  projectViewButton: "p-2.5 rounded-xl transition-all",
  projectViewButtonActive: "bg-studio text-black",
  projectViewButtonInactive: "text-zinc-500 hover:text-white",
  
  // Project Grid
  projectGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  projectListView: "flex flex-col gap-3",
  projectLoading: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  projectLoadingSkele: "h-48 bg-white/5 animate-pulse rounded-2xl border border-white/5",
  
  // Empty State
  emptyState: "flex flex-col items-center justify-center py-20 bg-[#0a0a0b] border border-white/5 rounded-3xl",
  emptyStateIcon: "w-12 h-12 text-zinc-800 mb-4",
  emptyStateText: "text-sm font-black text-zinc-600 uppercase tracking-widest",
  
  // Backdrop / Decorative Elements
  decorBgTopRight: "absolute top-0 right-0 w-[600px] h-[600px] bg-studio/5 blur-[150px] rounded-full pointer-events-none",
  decorBgBottomLeft: "absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none",
  
  // Error/Success States
  errorMessage: "text-red-400 text-sm font-bold uppercase tracking-widest",
  successMessage: "text-emerald-400 text-sm font-bold uppercase tracking-widest",
};
