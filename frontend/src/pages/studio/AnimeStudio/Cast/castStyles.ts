/**
 * Cast Module Styles
 * Consolidated styles for Header, Toolbar, Tabs, and Registry Page
 */

export const castStyles = {
  // --- LAYOUT & CONTAINER ---
  container: "space-y-6",
  
  // --- HEADER SECTION ---
  header: {
    wrapper: "relative group",
    glow: "absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#08162a] via-[#041428] to-[#000814] opacity-60 blur-xl pointer-events-none",
    container: "relative header-container px-6 py-5 flex items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#071426]/80 to-[#071022]/60 border border-blue-900/30 shadow-[0_10px_30px_rgba(2,6,23,0.6)]",
    iconBox: "header-icon-box group/icon rounded-2xl p-3 !bg-gradient-to-br !from-fuchsia-900/10 !to-fuchsia-500/6 !border-fuchsia-500/30",
    iconGlow: "absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500 rounded-2xl",
    icon: "w-7 h-7 text-fuchsia-400 relative z-10 drop-shadow-[0_6px_20px_rgba(236,72,153,0.18)]",
    title: "header-title text-white font-extrabold uppercase tracking-widest text-lg",
    subtitle: "header-subtitle text-sm text-fuchsia-300/60",
    
    // Scale Selector
    scaleSelector: "flex items-center bg-black/40 border border-fuchsia-500/20 rounded-lg overflow-hidden h-10",
    scaleLabelBox: "px-3 border-r border-fuchsia-500/20 flex items-center gap-2",
    scaleLabel: "text-xs font-black text-fuchsia-500/50 uppercase tracking-widest",
    scaleSelect: "bg-transparent text-xs font-black text-fuchsia-400 px-3 outline-none cursor-pointer hover:bg-fuchsia-500/5 transition-colors h-full",
    
    // Buttons
    actionButton: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-fuchsia-500/50 hover:text-fuchsia-400 font-black uppercase tracking-widest text-xs transition-all duration-300 group/back shadow-lg",
    actionButtonDanger: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/60 hover:text-red-300 font-black uppercase tracking-widest text-xs transition-all duration-300 group/stop shadow-lg",
    actionButtonPrimary: "relative w-full sm:w-auto h-10 px-8 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/5 text-fuchsia-400 hover:bg-fuchsia-500/10 hover:border-fuchsia-500/60 hover:text-fuchsia-300 font-black uppercase tracking-widest text-xs transition-all duration-300 group/btn shadow-lg",
  },

  // --- TOOLBAR SECTION ---
  toolbar: {
    container: "toolbar-container",
    header: "toolbar-header",
    statusBox: "toolbar-status-box",
    statusIcon: "toolbar-status-icon",
    statusActive: "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]",
    statusInactive: "text-zinc-600",
    statusTitle: "text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-300 to-studio bg-clip-text text-transparent",
    statusSubtitle: "text-xs font-bold text-zinc-500 uppercase tracking-widest",
    actionGroup: "toolbar-action-group",
    btnGroup: "toolbar-btn-group",
    iconButton: "h-9 w-9 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300 group relative overflow-hidden",
  },

  // --- TABS SECTION ---
  tabs: {
    container: "flex items-center gap-1.5 bg-black/60 border border-white/10 p-1.5 rounded-full backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative group overflow-hidden",
    overlay: 'absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none',
    button: 'relative z-20 px-6 py-2.5 text-[10px] font-black tracking-[0.25em] transition-all duration-500 uppercase flex items-center gap-3',
    buttonActive: 'text-white drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]',
    buttonInactive: 'text-zinc-500 hover:text-zinc-300',
    pill: 'absolute inset-0 bg-fuchsia-600 border border-fuchsia-400/40 rounded-full z-10 shadow-[0_0_20px_rgba(236,72,153,0.3)] pointer-events-none',
    icon: 'w-3.5 h-3.5 transition-all duration-500',
    iconActive: 'opacity-100 scale-110 text-white',
    iconInactive: 'opacity-40',
    spinner: 'w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin',
    label: 'inline',
    tabsBar: "studio-tabs-bar sticky top-4 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] shadow-2xl mb-12 relative group overflow-hidden mx-auto max-w-fit",
    tabsBarGlow: "absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    tabsBarInner: "relative z-10 w-full flex justify-center",
  },

  // --- PAGE/CONTENT SECTION ---
  page: {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    card: "relative group bg-zinc-950/40 border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:border-fuchsia-500/30",
  },

  // --- CONTENT SECTION ---
  content: {
    container: "cast-container px-6 py-6",
    contentArea: "cast-content-area grid grid-cols-1 lg:grid-cols-4 gap-8 items-start",
    mainColumn: "cast-main-column lg:col-span-3",
    sidebar: "cast-sidebar lg:col-span-1 sticky top-24 self-start max-h-[80vh] overflow-y-auto pr-4 hide-scrollbar",
    sidebarCard: "p-6 bg-gradient-to-b from-[#040404] to-[#060606] border border-white/5 rounded-2xl space-y-4 relative overflow-hidden group",
    sidebarGlow: "absolute inset-0 blur-[40px] pointer-events-none transition-all duration-700",
    sidebarContent: "relative z-10 space-y-4",
    sidebarTitle: "text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2",
    sidebarNote: "text-xs text-zinc-600 font-bold uppercase tracking-tighter leading-relaxed",
    statCard: "p-6 bg-gradient-to-b from-[#040404] to-[#050505] border border-white/5 rounded-2xl space-y-4 relative group overflow-hidden hover:scale-[1.01] transition-transform duration-200",
    statIconBox: "w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform",
    statLabel: "text-xs font-black text-zinc-500 uppercase tracking-widest",
    statValue: "text-sm font-black text-white uppercase tracking-tighter line-clamp-1",
  },

  // --- GLOBAL LAYOUT ---
  layout: {
    moduleHeader: "studio-module-header mb-8",
  }
};
