/**
 * Series Module Styles
 * Consolidated styles for Header and Toolbar
 */

export const seriesStyles = {
  // --- HEADER SECTION ---
  header: {
    wrapper: "relative group mb-10",
    glow: "absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-emerald-500/20 via-studio/10 to-transparent opacity-40 blur-2xl pointer-events-none group-hover:opacity-60 transition-opacity duration-1000",
    container: "relative header-container px-8 py-6 flex flex-col lg:flex-row items-center justify-between gap-8 rounded-[2.5rem] bg-[#050505]/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden",
    iconBox: "header-icon-box relative group/icon rounded-[1.5rem] p-4 bg-gradient-to-br from-emerald-500/20 to-studio/5 border border-emerald-500/30 overflow-hidden",
    iconGlow: "absolute inset-0 bg-gradient-to-br from-emerald-400/40 via-transparent to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700",
    icon: "w-8 h-8 text-emerald-400 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-transform duration-500 group-hover/icon:scale-110",
    title: "header-title text-white font-black uppercase tracking-[0.3em] text-xl md:text-2xl drop-shadow-2xl",
    subtitle: "header-subtitle text-[10px] font-black text-emerald-300/40 uppercase tracking-[0.4em]",
    actionButton: "relative px-6 py-2.5 rounded-full border border-white/5 bg-white/[0.03] text-zinc-500 hover:text-white hover:bg-white/[0.08] hover:border-white/20 font-black uppercase tracking-widest text-[10px] transition-all duration-500 shadow-xl backdrop-blur-md",
    actionButtonDanger: "relative px-6 py-2.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/40 font-black uppercase tracking-widest text-[10px] transition-all duration-500 shadow-xl",
    actionButtonPrimary: "relative px-8 py-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/60 font-black uppercase tracking-widest text-[10px] transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    nextButton: "relative px-10 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500",
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
    iconButton: "h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all duration-300",
  },

  // --- TABS SECTION ---
  tabs: {
    container: 'flex items-center gap-1.5 bg-black/60 border border-white/10 p-1.5 rounded-full backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative group overflow-hidden',
    overlay: 'absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none',
    button: 'relative z-20 px-6 py-2.5 text-[10px] font-black tracking-[0.25em] transition-all duration-500 uppercase flex items-center gap-3',
    buttonActive: 'text-white drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]',
    buttonInactive: 'text-zinc-500 hover:text-zinc-300',
    pill: 'absolute inset-0 bg-emerald-600 border border-emerald-400/40 rounded-full z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)] pointer-events-none',
    icon: 'w-3.5 h-3.5 transition-all duration-500',
    iconActive: 'opacity-100 scale-110 text-white',
    iconInactive: 'opacity-40',
    spinner: 'w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin',
    label: 'inline',
    tabsBar: "studio-tabs-bar sticky top-4 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] shadow-2xl mb-12 relative group overflow-hidden mx-auto max-w-fit",
    tabsBarGlow: "absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    tabsBarInner: "relative z-10 w-full flex justify-center",
  },

  // --- CONTENT SECTION ---
  content: {
    container: "series-container px-6 py-6",
    contentArea: "series-content-area grid grid-cols-1 lg:grid-cols-4 gap-8 items-start",
    mainColumn: "series-main-column lg:col-span-3",
    sidebar: "series-sidebar lg:col-span-1 sticky top-24 self-start max-h-[80vh] overflow-y-auto pr-4 hide-scrollbar",
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

  // --- PAGE LAYOUT ---
  page: {
    mainCard: "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700 border-zinc-800/30 hover:border-zinc-700",
    innerBorder: "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700 border-white/5",
    contentWrapper: "w-full p-8 lg:p-10 max-w-[1400px] mx-auto",
  }
};
