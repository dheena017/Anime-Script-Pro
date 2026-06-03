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
    actionButton: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-studio/50 hover:text-studio font-black uppercase tracking-widest text-xs transition-all duration-300 group/back shadow-lg",
    actionButtonDanger: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/60 hover:text-red-300 font-black uppercase tracking-widest text-xs transition-all duration-300 group/stop shadow-lg",
    actionButtonPrimary: "relative w-full sm:w-auto h-10 px-8 rounded-full border border-studio/30 bg-studio/5 text-studio hover:bg-studio/10 hover:border-studio/60 hover:text-studio-light font-black uppercase tracking-widest text-xs transition-all duration-300 group/btn shadow-lg",
  },

  // --- TOOLBAR SECTION ---
  toolbar: {
    container: "toolbar-container",
    header: "toolbar-header",
    statusBox: "toolbar-status-box",
    statusIcon: "toolbar-status-icon",
    statusActive: "text-studio drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]",
    statusInactive: "text-zinc-600",
    statusTitle: "text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-studio/80 to-cyan-400/60 bg-clip-text text-transparent",
    statusSubtitle: "text-xs font-bold text-zinc-500 uppercase tracking-widest",
    actionGroup: "toolbar-action-group",
    btnGroup: "toolbar-btn-group",
    iconButton: "h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all duration-300 group relative overflow-hidden",
    iconButtonActive: "h-9 px-4 gap-2 rounded-lg transition-all duration-300 group relative overflow-hidden border text-studio bg-studio/20 border-studio shadow-[0_0_15px_rgba(var(--studio-rgb),0.3)]",
  },

  // --- CONTENT SHARED ---
  content: {
    container: "world-container px-6 py-6",
    header: "world-header",
    headerTitle: "world-header-title",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8",
    textarea: "world-textarea",
    // Layout: main content spans two columns, sidebar occupies one column on large screens
    contentArea: "world-content-area grid grid-cols-1 lg:grid-cols-3 gap-8 items-start",
    mainColumn: "world-main-column lg:col-span-2",
    // Sidebar is sticky so TOC / cards remain visible while scrolling
    sidebar: "world-sidebar lg:col-span-1 sticky top-24 self-start max-h-[70vh] overflow-y-auto pr-4 hide-scrollbar",
    badge: "world-badge inline-flex items-center gap-2 px-3 py-1 rounded-full border",
    badgeText: "world-badge-text text-xs font-black",
    // Prose: ensure readable widths and accent support
    prose: "world-prose prose prose-invert max-w-none text-sm [&>h2]:text-lg [&>h2]:font-extrabold [&>h2]:uppercase",
    buttonBase: "inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
    sidebarCard: "p-6 bg-gradient-to-b from-[#040404] to-[#060606] border border-white/5 rounded-2xl space-y-4 relative overflow-hidden group",
    sidebarGlow: "absolute inset-0 blur-[40px] pointer-events-none transition-all duration-700",
    sidebarContent: "relative z-10 space-y-4",
    sidebarTitle: "text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 group-hover:text-zinc-400 transition-colors duration-500",
    sidebarPromptInput: "w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs font-medium text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-white/20 transition-colors min-h-[100px] resize-none overflow-hidden",
    sidebarPromptBox: "p-4 bg-black/40 border border-white/5 rounded-xl",
    sidebarPromptText: "text-xs font-medium text-zinc-500 leading-relaxed italic",
    sidebarNote: "text-xs text-zinc-600 font-bold uppercase tracking-tighter leading-relaxed",
    // Stat card: stronger visual separation, subtle lift on hover
    statCard: "p-6 bg-gradient-to-b from-[#040404] to-[#050505] border border-white/5 rounded-2xl space-y-4 relative group overflow-hidden hover:scale-[1.01] transition-transform duration-200",
    statIconBox: "w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform",
    statLabel: "text-xs font-black text-zinc-500 uppercase tracking-widest",
    statValue: "text-sm font-black text-white uppercase tracking-tighter line-clamp-1",
    // small helpers for TableOfContents and internal layout
    tocContainer: "space-y-3",
    tocItem: "text-xs text-zinc-500 hover:text-zinc-300 transition-colors",
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
    tabsBar: "studio-tabs-bar sticky top-0 z-40 flex items-center justify-center px-2 sm:px-3 md:px-4 py-2 sm:py-3 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl mb-6 sm:mb-8 relative group overflow-hidden",
    tabsBarGlow: "absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    tabsBarInner: "relative z-10 w-full overflow-x-auto hide-scrollbar",
    
    // Internal Tab styles
    container: 'inline-flex min-w-max items-center justify-start gap-2 sm:gap-3 md:gap-4 p-1 sm:p-2 relative mx-auto',
    overlay: "absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none",
    button: 'relative flex min-w-fit items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] transition-all duration-300 shrink-0 whitespace-nowrap',
    buttonActive: 'bg-white/[0.04] shadow-[0_0_20px_rgba(255,255,255,0.03)] text-white drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]',
    buttonInactive: 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]',
    glow: 'absolute inset-0 border border-white/10 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.02)] pointer-events-none',
    icon: 'w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-500',
    iconActive: 'opacity-100 scale-110 rotate-[360deg] text-white',
    iconInactive: 'opacity-40 group-hover:opacity-70',
    underline: 'absolute -bottom-1 left-4 right-4 h-0.5 bg-current rounded-full opacity-50 blur-[1px] pointer-events-none',
    spinner: "w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin",
    label: "inline",
  },
  
  // --- FLAT ALIASES FOR BACKWARD COMPATIBILITY ---
  actionButtonGhost: "relative h-10 px-6 rounded-full border border-white/5 bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white font-black uppercase tracking-widest text-xs transition-all duration-300",
  actionIconButtonSmall: "h-8 w-8 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all duration-300",
  actionToolbarButton: "h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all duration-300 flex items-center justify-center",
};
