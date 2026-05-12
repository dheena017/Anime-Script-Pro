/**
 * Script Module Styles
 * Consolidated styles for Header, Toolbar, Page, and Tabs
 */

export const scriptStyles = {
  // --- HEADER SECTION ---
  header: {
    wrapper: "relative group",
    glow: "absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#08162a] via-[#041428] to-[#000814] opacity-60 blur-xl pointer-events-none",
    container: "relative header-container px-6 py-5 flex items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#071426]/80 to-[#071022]/60 border border-blue-900/30 shadow-[0_10px_30px_rgba(2,6,23,0.6)]",
    iconBox: "header-icon-box group/icon rounded-2xl p-3 !bg-gradient-to-br !from-blue-900/10 !to-blue-500/6 !border-blue-500/30",
    iconGlow: "absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500 rounded-2xl",
    icon: "w-7 h-7 text-blue-400 relative z-10 drop-shadow-[0_6px_20px_rgba(59,130,246,0.18)]",
    title: "header-title text-white font-extrabold uppercase tracking-widest text-lg",
    subtitle: "header-subtitle text-sm text-blue-300/60",
    actionButton: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-blue-500/50 hover:text-blue-400 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/back shadow-lg",
    actionButtonDanger: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/60 hover:text-red-300 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/stop shadow-lg",
    actionButtonPrimary: "relative w-full sm:w-auto h-10 px-8 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/60 hover:text-blue-300 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/btn shadow-lg",
  },

  // --- TOOLBAR SECTION ---
  toolbar: {
    container: "toolbar-container",
    header: "toolbar-header",
    statusBox: "toolbar-status-box",
    statusIcon: "toolbar-status-icon",
    statusActive: "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]",
    statusInactive: "text-zinc-600",
    statusTitle: "text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent",
    statusSubtitle: "text-[8px] font-bold text-zinc-500 uppercase tracking-widest",
    actionGroup: "toolbar-action-group",
    btnGroup: "toolbar-btn-group",
    navButton: "h-8 px-3 rounded-lg text-zinc-400 hover:text-studio border border-transparent hover:border-studio/40 hover:bg-studio/10 transition-all text-[9px] font-black uppercase tracking-widest gap-2 group relative overflow-hidden",
    navButtonActive: "h-8 px-3 rounded-lg text-studio/80 hover:text-studio transition-all text-[9px] font-black uppercase tracking-widest gap-2 bg-studio/10 border border-studio/30 hover:border-studio/50 group",
    iconButton: "h-8 w-8 rounded-lg text-zinc-400 hover:text-cyan-400 border border-transparent hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300",
  },

  // --- PAGE LAYOUT ---
  page: {
    mainCard: "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700",
    mainCardActive: "border-studio/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:border-studio/50",
    mainCardInactive: "border-zinc-800/30 hover:border-zinc-700",
    innerBorder: "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700",
    innerBorderActive: "border-studio/20 group-hover/card:border-studio/40",
    innerBorderInactive: "border-white/5",
    contentWrapper: "w-full p-0",
  },

  // --- TABS SECTION ---
  tabs: {
    container: 'tabs-nav-container flex-wrap group',
    overlay: 'absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[1.5rem]',
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