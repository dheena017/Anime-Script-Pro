/**
 * Series Module Styles
 * Consolidated styles for Header and Toolbar
 */

export const seriesStyles = {
  // --- HEADER SECTION ---
  header: {
    wrapper: "relative group",
    glow: "absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#08162a] via-[#041428] to-[#000814] opacity-60 blur-xl pointer-events-none",
    container: "relative header-container px-6 py-5 flex items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#071426]/80 to-[#071022]/60 border border-blue-900/30 shadow-[0_10px_30px_rgba(2,6,23,0.6)]",
    iconBox: "header-icon-box group/icon rounded-2xl p-3 !bg-gradient-to-br !from-emerald-900/10 !to-emerald-500/6 !border-emerald-500/30",
    iconGlow: "absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500 rounded-2xl",
    icon: "w-7 h-7 text-emerald-400 relative z-10 drop-shadow-[0_6px_20px_rgba(16,185,129,0.18)]",
    title: "header-title text-white font-extrabold uppercase tracking-widest text-base md:text-lg",
    subtitle: "header-subtitle text-xs text-emerald-300/60",
    actionButton: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-emerald-500/50 hover:text-emerald-400 font-black uppercase tracking-widest text-xs transition-all duration-300 group/back shadow-lg",
    actionButtonDanger: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/60 hover:text-red-300 font-black uppercase tracking-widest text-xs transition-all duration-300 group/stop shadow-lg",
    actionButtonPrimary: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:text-emerald-300 font-black uppercase tracking-widest text-xs transition-all duration-300 group/btn shadow-lg",
    blueprintButton: "relative w-full sm:w-auto h-12 px-6 bg-[#050505] border-white/10 text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/50 font-black uppercase tracking-widest text-xs rounded-full transition-all duration-500 shadow-2xl group/blueprint",
    nextButton: "relative w-full sm:w-auto h-10 px-8 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:text-emerald-300 font-black uppercase tracking-widest text-xs transition-all duration-300 group/next shadow-lg",
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
    container: 'flex items-center gap-1 bg-black/50 border border-white/10 p-1.5 rounded-full backdrop-blur-xl shadow-2xl relative group overflow-hidden',
    overlay: 'absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000',
    button: 'relative px-5 py-2 text-xs font-black tracking-[0.2em] transition-all duration-500 uppercase flex items-center gap-2.5',
    buttonActive: 'text-studio',
    buttonInactive: 'text-zinc-500 hover:text-zinc-300',
    pill: 'absolute inset-0 bg-white/10 border border-white/20 rounded-full z-0',
    icon: 'w-3.5 h-3.5 transition-all duration-500',
    iconActive: 'opacity-100 scale-110',
    iconInactive: 'opacity-40',
    spinner: 'w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin',
    label: 'hidden md:inline',
    tabsBar: "studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden",
    tabsBarGlow: "absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    tabsBarInner: "relative z-10 w-full flex justify-center",
  },

  // --- PAGE LAYOUT ---
  page: {
    mainCard: "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700 border-zinc-800/30 hover:border-zinc-700",
    innerBorder: "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700 border-white/5",
    contentWrapper: "w-full p-8 lg:p-10 max-w-[1400px] mx-auto",
  }
};
