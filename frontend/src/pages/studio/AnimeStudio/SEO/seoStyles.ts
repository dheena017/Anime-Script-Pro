/**
 * SEO Module Styles
 * Consolidated styles for Header, Toolbar, Page, and Tabs
 */

export const seoStyles = {
  // --- HEADER SECTION ---
  header: {
    wrapper: "relative group",
    glow: "absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#08162a] via-[#041428] to-[#000814] opacity-60 blur-xl pointer-events-none",
    container: "relative header-container px-6 py-5 flex items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#071426]/80 to-[#071022]/60 border border-blue-900/30 shadow-[0_10px_30px_rgba(2,6,23,0.6)]",
    iconBox: "header-icon-box group/icon rounded-2xl p-3 !bg-gradient-to-br !from-emerald-900/10 !to-emerald-500/6 !border-emerald-500/30",
    iconGlow: "absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500 rounded-2xl",
    icon: "w-7 h-7 text-emerald-400 relative z-10 drop-shadow-[0_6px_20px_rgba(16,185,129,0.18)]",
    title: "header-title text-white font-extrabold uppercase tracking-widest text-lg",
    subtitle: "header-subtitle text-sm text-emerald-300/60",
    actionButton: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-emerald-500/50 hover:text-emerald-400 font-black uppercase tracking-widest text-xs transition-all duration-300 group/back shadow-lg",
    actionButtonDanger: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/60 hover:text-red-300 font-black uppercase tracking-widest text-xs transition-all duration-300 group/stop shadow-lg",
    actionButtonPrimary: "relative w-full sm:w-auto h-10 px-8 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:text-emerald-300 font-black uppercase tracking-widest text-xs transition-all duration-300 group/btn shadow-lg",
  },

  // --- TOOLBAR SECTION ---
  toolbar: {
    container: "toolbar-container",
    header: "toolbar-header",
    statusBox: "toolbar-status-box",
    statusIcon: "toolbar-status-icon",
    statusActive: "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]",
    statusInactive: "text-zinc-600",
    statusTitle: "text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent",
    statusSubtitle: "text-xs font-bold text-zinc-500 uppercase tracking-widest",
    actionGroup: "toolbar-action-group",
    btnGroup: "toolbar-btn-group",
    iconButton: "h-9 w-9 rounded-lg text-zinc-400 hover:text-emerald-400 border border-transparent hover:border-emerald-400/40 hover:bg-emerald-500/10 transition-all duration-300",
  },

  // --- PAGE LAYOUT ---
  page: {
    container: "space-y-12 pb-24",
    mainCard: "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700",
    mainCardActive: "border-studio/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:border-studio/50",
    mainCardInactive: "border-zinc-800/30 hover:border-zinc-700",
    innerBorder: "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700",
    innerBorderActive: "border-studio/20 group-hover/card:border-studio/40",
    innerBorderInactive: "border-white/5",
    contentWrapper: "w-full p-0",
    contentArea: "p-8 lg:p-10 mx-auto",
  },

  // --- TABS SECTION ---
  tabs: {
    container: 'flex items-center gap-1 bg-[#050505]/60 border border-white/5 p-1.5 rounded-full backdrop-blur-2xl shadow-2xl relative group overflow-x-auto md:overflow-hidden max-w-full no-scrollbar select-none',
    overlay: 'absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none',
    button: 'relative px-4 py-2 md:px-5 md:py-2.5 text-[10px] md:text-xs font-black tracking-[0.12em] md:tracking-[0.2em] transition-all duration-500 uppercase flex items-center gap-2 md:gap-2.5 flex-shrink-0 z-10 cursor-pointer',
    buttonActive: '',
    buttonInactive: 'text-zinc-500 hover:text-zinc-300',
    pill: 'absolute inset-0 bg-white/5 border border-white/10 rounded-full z-0 pointer-events-none',
    icon: 'w-3.5 h-3.5 md:w-4 h-4 transition-all duration-500',
    iconActive: 'opacity-100 scale-110',
    iconInactive: 'opacity-40 group-hover:opacity-70',
    spinner: 'w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin',
    label: 'inline-block transition-all duration-300',
    tabsBar: "studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden",
    tabsBarGlow: "absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    tabsBarInner: "relative z-10 w-full flex justify-center",
  },

  // --- FLAT ALIASES FOR BACKWARD COMPATIBILITY ---
  headerContainer: "relative header-container px-6 py-5 flex items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#071426]/80 to-[#071022]/60 border border-blue-900/30 shadow-[0_10px_30px_rgba(2,6,23,0.6)]",
  headerTitle: "header-title text-white font-extrabold uppercase tracking-widest text-lg",
  headerSubtitle: "header-subtitle text-sm text-emerald-300/60",
  generateButtonBase: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-emerald-500/50 hover:text-emerald-400 font-black uppercase tracking-widest text-xs transition-all duration-300 group/back shadow-lg",
  generateButtonLarge: "relative w-full sm:w-auto h-12 px-8 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:text-emerald-300 font-black uppercase tracking-widest text-sm transition-all duration-300 group/btn shadow-lg",
  cardContainer: "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700 border border-zinc-800/30",
  loadingStateContainer: "flex flex-col items-center justify-center py-20 text-zinc-700",
  loadingSpinner: "w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-6",
  loadingTitle: "text-lg font-black text-white uppercase tracking-widest mb-2",
  loadingText: "text-sm text-zinc-500 uppercase tracking-widest",
  emptyStateContainer: "flex flex-col items-center justify-center py-20 text-zinc-700",
  emptyIconBox: "w-16 h-16 rounded-2xl bg-zinc-900/50 flex items-center justify-center mb-6",
  emptyText: "text-sm text-zinc-500 uppercase tracking-widest text-center",
  contentProseContainer: "prose prose-invert prose-emerald max-w-none",
  gridPattern: "absolute inset-0 bg-[url('/noise.svg')] opacity-5 mix-blend-overlay",
  cardContent: "relative z-10 p-8 md:p-10",
  distributionHeader: "flex items-center gap-4 mb-6",
  distributionIconBox: "w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400",
  distributionTitle: "text-lg font-black text-white uppercase tracking-widest",
  distributionSubtitle: "text-xs text-zinc-500 uppercase tracking-widest",
  copyButtonBase: "h-9 px-4 rounded-xl font-black uppercase tracking-widest text-xs text-zinc-300 border border-zinc-700 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300",
  platformCard: "bg-white/[0.02] border border-white/5 p-6 rounded-2xl",
  platformIconBox: "w-10 h-10 rounded-lg bg-zinc-900/50 flex items-center justify-center",
  platformStatus: "w-2 h-2 rounded-full",
  platformName: "text-sm font-bold text-white uppercase tracking-widest",
  platformDesc: "text-xs text-zinc-500 uppercase tracking-widest",
  tagManifestHeader: "text-sm font-black uppercase tracking-widest",
  tagsContainer: "flex flex-wrap gap-3",
  tagItem: "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border",
  sidebarCard: "bg-white/[0.02] border border-white/5 p-6 rounded-2xl",
  sidebarTitle: "text-sm font-black text-white uppercase tracking-widest mb-4",
  platformSpec: "flex items-center justify-between py-2 border-b border-white/5 last:border-0",
};
