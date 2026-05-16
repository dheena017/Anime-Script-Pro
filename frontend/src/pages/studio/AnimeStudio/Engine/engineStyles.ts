/**
 * Engine Module Styles
 * Consolidated styles for Header, Toolbar, Page, and Tabs
 */

export const engineStyles = {
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
    statusTitle: "text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-studio/80 to-studio bg-clip-text text-transparent",
    statusSubtitle: "text-xs font-bold text-zinc-500 uppercase tracking-widest",
    actionGroup: "toolbar-action-group",
    btnGroup: "toolbar-btn-group",
    iconButton: "h-9 w-9 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all duration-300 group relative overflow-hidden",
  },

  // --- TABS SECTION ---
  tabs: {
    tabsBar: "studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden",
    tabsBarGlow: "absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    tabsBarInner: "relative z-10 w-full flex justify-center",
    
    // Internal Tab styles (from engineTabsStyles)
    container: 'flex items-center justify-center gap-10 p-2 relative overflow-x-auto hide-scrollbar',
    overlay: 'absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000',
    button: 'relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shrink-0 whitespace-nowrap',
    buttonActive: 'bg-white/[0.03] shadow-[0_0_20px_rgba(255,255,255,0.02)]',
    buttonInactive: 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]',
    glow: 'absolute inset-0 border border-white/10 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.02)]',
    icon: 'w-3.5 h-3.5 transition-all duration-500',
    iconActive: 'opacity-100 scale-110 rotate-[360deg]',
    iconInactive: 'opacity-40',
    underline: 'absolute -bottom-1 left-4 right-4 h-0.5 bg-current rounded-full opacity-50 blur-[1px]',
  },

  // --- PAGE LAYOUT ---
  page: {
    mainCard: "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700 border-zinc-800/30 hover:border-zinc-700",
    innerBorder: "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700 border-white/5",
    contentWrapper: "w-full p-8 lg:p-10 max-w-[1400px] mx-auto",
  },

  // --- GLOBAL LAYOUT ---
  layout: {
    moduleHeader: "studio-module-header mb-8",
  }
};
