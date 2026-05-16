/**
 * Prompts Module Styles
 * Consolidated styles for Header, Toolbar, Page, and Tabs
 */

export const promptsStyles = {
  // --- HEADER SECTION ---
  header: {
    wrapper: "relative group",
    glow: "absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#08162a] via-[#041428] to-[#000814] opacity-60 blur-xl pointer-events-none",
    container: "relative header-container px-6 py-5 flex items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#071426]/80 to-[#071022]/60 border border-blue-900/30 shadow-[0_10px_30px_rgba(2,6,23,0.6)]",
    iconBox: "header-icon-box group/icon rounded-2xl p-3 !bg-gradient-to-br !from-red-900/10 !to-red-500/6 !border-red-500/30",
    iconGlow: "absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500 rounded-2xl",
    icon: "w-7 h-7 text-red-400 relative z-10 drop-shadow-[0_6px_20px_rgba(239,68,68,0.18)]",
    title: "header-title text-white font-extrabold uppercase tracking-widest text-lg",
    subtitle: "header-subtitle text-sm text-red-300/60",
    actionButton: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-red-500/50 hover:text-red-400 font-black uppercase tracking-widest text-xs transition-all duration-300 group/back shadow-lg",
    actionButtonDanger: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/60 hover:text-red-300 font-black uppercase tracking-widest text-xs transition-all duration-300 group/stop shadow-lg",
    actionButtonPrimary: "relative w-full sm:w-auto h-10 px-8 rounded-full border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 hover:text-red-300 font-black uppercase tracking-widest text-xs transition-all duration-300 group/btn shadow-lg",
  },

  // --- TOOLBAR SECTION ---
  toolbar: {
    container: "toolbar-container",
    header: "toolbar-header",
    statusBox: "toolbar-status-box",
    statusIcon: "toolbar-status-icon",
    statusActive: "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]",
    statusInactive: "text-zinc-600",
    statusTitle: "text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent",
    statusSubtitle: "text-xs font-bold text-zinc-500 uppercase tracking-widest",
    actionGroup: "toolbar-action-group",
    btnGroup: "toolbar-btn-group",
    iconButton: "h-9 w-9 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300 group relative overflow-hidden",
  },

  // --- PAGE LAYOUT ---
  page: {
    mainCard: "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700 border-zinc-800/30 hover:border-zinc-700",
    innerBorder: "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700 border-white/5",
    contentWrapper: "w-full p-8 lg:p-10 max-w-[1400px] mx-auto",
  },

  // --- TABS SECTION ---
  tabs: {
    container: 'tabs-nav-container group',
    overlay: 'absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[1.5rem]',
    button: 'tabs-nav-button group/tab',
    buttonActive: 'text-studio',
    buttonInactive: 'text-zinc-500 hover:text-zinc-300',
    glow: 'storyboard-tab-glow',
    glowMotion: 'absolute inset-0 rounded-xl bg-white/[0.04] border border-white/10',
    icon: 'w-3.5 h-3.5 transition-all duration-300',
    iconActive: 'opacity-100 scale-110',
    iconInactive: 'opacity-40 group-hover/tab:opacity-70 group-hover/tab:scale-105',
    underline: 'absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r rounded-full',
    spinner: 'w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin',
    tabsBar: "studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden",
    tabsBarGlow: "absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    tabsBarInner: "relative z-10 w-full flex justify-center",
  }
};
