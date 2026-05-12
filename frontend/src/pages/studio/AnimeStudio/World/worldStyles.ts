/**
 * World Module Styles
 * Consolidated styles for Header, Toolbar, and Content components
 */

export const worldStyles = {
  // --- HEADER SECTION ---
  header: {
    wrapper: "relative group",
    glow: "absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#08162a] via-[#041428] to-[#000814] opacity-60 blur-xl pointer-events-none",
    container: "relative header-container px-6 py-5 flex items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#071426]/80 to-[#071022]/60 border border-blue-900/30 shadow-[0_10px_30px_rgba(2,6,23,0.6)]",
    iconBox: "header-icon-box group/icon rounded-2xl p-3 !bg-gradient-to-br !from-studio/10 !to-studio/6 !border-studio/30",
    iconGlow: "absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500 rounded-2xl",
    icon: "w-7 h-7 text-studio relative z-10 drop-shadow-[0_6px_20px_rgba(6,182,212,0.2)]",
    title: "header-title text-white font-extrabold uppercase tracking-widest text-lg",
    subtitle: "header-subtitle text-sm text-studio/60",
    actionButton: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-studio/50 hover:text-studio font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/back shadow-lg",
    actionButtonDanger: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/60 hover:text-red-300 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/stop shadow-lg",
    actionButtonPrimary: "relative w-full sm:w-auto h-10 px-8 rounded-full border border-studio/30 bg-studio/5 text-studio hover:bg-studio/10 hover:border-studio/60 hover:text-studio-light font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/btn shadow-lg",
  },

  // --- TOOLBAR SECTION ---
  toolbar: {
    container: "toolbar-container",
    header: "toolbar-header",
    statusBox: "toolbar-status-box",
    statusIcon: "toolbar-status-icon",
    statusActive: "text-studio drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]",
    statusInactive: "text-zinc-600",
    statusTitle: "text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-studio/80 to-cyan-400/60 bg-clip-text text-transparent",
    statusSubtitle: "text-[8px] font-bold text-zinc-500 uppercase tracking-widest",
    actionGroup: "toolbar-action-group",
    btnGroup: "toolbar-btn-group",
    iconButton: "h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all duration-300 group relative overflow-hidden",
    iconButtonActive: "h-9 px-4 gap-2 rounded-lg transition-all duration-300 group relative overflow-hidden border text-studio bg-studio/20 border-studio shadow-[0_0_15px_rgba(var(--studio-rgb),0.3)]",
  },

  // --- CONTENT SHARED ---
  content: {
    container: "world-container",
    header: "world-header",
    headerTitle: "world-header-title",
    grid: "world-grid",
    textarea: "world-textarea",
    contentArea: "world-content-area",
    mainColumn: "world-main-column",
    sidebar: "world-sidebar",
    badge: "world-badge",
    badgeText: "world-badge-text",
    prose: "world-prose",
    buttonBase: "inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
    sidebarCard: "p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative overflow-hidden group",
    sidebarGlow: "absolute inset-0 blur-[40px] pointer-events-none transition-all duration-700",
    sidebarContent: "relative z-10 space-y-4",
    sidebarTitle: "text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2",
    sidebarPromptInput: "w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] font-medium text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-white/10 transition-colors min-h-[100px] resize-none overflow-hidden",
    sidebarPromptBox: "p-4 bg-black/40 border border-white/5 rounded-xl",
    sidebarPromptText: "text-[9px] font-medium text-zinc-500 leading-relaxed italic",
    sidebarNote: "text-[8px] text-zinc-600 font-bold uppercase tracking-tighter leading-relaxed",
    statCard: "p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative group overflow-hidden hover:border-white/10 transition-all",
    statIconBox: "w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform",
    statLabel: "text-[10px] font-black text-zinc-500 uppercase tracking-widest",
    statValue: "text-sm font-black text-white uppercase tracking-tighter line-clamp-1",
  },

  // --- PAGE LAYOUT ---
  page: {
    container: "space-y-8 pb-20",
    emptyWrapper: "w-full max-w-[1400px] mx-auto animate-in fade-in zoom-in-95 duration-700",
    mainCard: "bg-[#030303] overflow-hidden border border-zinc-800/30 rounded-[3rem] shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-all duration-700",
    mainCardInner: "w-full p-8 lg:p-10 max-w-[1400px] mx-auto",
  },

  // --- TABS SECTION ---
  tabs: {
    container: "flex items-center gap-1 bg-black/50 border border-white/10 p-1.5 rounded-full backdrop-blur-xl shadow-2xl relative group overflow-hidden",
    overlay: "absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    button: "relative px-5 py-2 text-[10px] font-black tracking-[0.2em] transition-all duration-500 uppercase flex items-center gap-2.5",
    buttonActive: "text-studio",
    buttonInactive: "text-zinc-500 hover:text-zinc-300",
    pill: "absolute inset-0 bg-white/10 border border-white/20 rounded-full z-0",
    icon: "w-3.5 h-3.5 transition-all duration-500",
    iconActive: "opacity-100 scale-110",
    iconInactive: "opacity-40 group-hover:opacity-70",
    spinner: "w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin",
    label: "hidden lg:inline",
    tabsBar: "studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden",
    tabsBarGlow: "absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    tabsBarInner: "relative z-10 w-full flex justify-center",
  }
};
