/**
 * Storyboard Module Styles
 * Consolidated styles for Header, Toolbar, and Content sections
 */

export const storyboardStyles = {
  // --- HEADER SECTION ---
  header: {
    wrapper: "relative group",
    glow: "absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#08162a] via-[#041428] to-[#000814] opacity-60 blur-xl pointer-events-none",
    container: "relative header-container px-6 py-5 flex items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#071426]/80 to-[#071022]/60 border border-blue-900/30 shadow-[0_10px_30px_rgba(2,6,23,0.6)]",
    iconBox: "header-icon-box group/icon rounded-2xl p-3 !bg-gradient-to-br !from-orange-900/10 !to-orange-500/6 !border-orange-500/30",
    iconGlow: "absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500 rounded-2xl",
    icon: "w-7 h-7 text-orange-400 relative z-10 drop-shadow-[0_6px_20px_rgba(249,115,22,0.18)]",
    title: "header-title text-white font-extrabold uppercase tracking-widest text-lg",
    subtitle: "header-subtitle text-sm text-orange-300/60",
    actionButton: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-orange-500/50 hover:text-orange-400 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/back shadow-lg",
    actionButtonDanger: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/60 hover:text-red-300 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/stop shadow-lg",
    actionButtonPrimary: "relative w-full sm:w-auto h-10 px-8 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/60 hover:text-orange-300 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/btn shadow-lg",
  },

  // --- TOOLBAR SECTION ---
  toolbar: {
    container: "toolbar-container",
    header: "toolbar-header",
    statusBox: "toolbar-status-box",
    statusIcon: "toolbar-status-icon",
    statusActive: "text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]",
    statusInactive: "text-zinc-600",
    statusTitle: "text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent",
    statusSubtitle: "text-[8px] font-bold text-zinc-500 uppercase tracking-widest",
    actionGroup: "flex items-center gap-4",
    btnGroup: "flex items-center bg-black/40 border border-white/5 p-1 rounded-xl gap-1",
    primaryButton: "h-9 px-4 rounded-xl font-black uppercase tracking-widest text-[9px] text-zinc-300 border-zinc-700 hover:text-orange-400 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 group",
    iconButton: "h-9 w-9 rounded-lg text-zinc-400 hover:text-orange-400 border border-transparent hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-300",
  },

  // --- PAGE & CARD SECTION ---
  page: {
    container: "space-y-12 pb-24",
    headerBox: "relative flex flex-col lg:flex-row items-center justify-between p-6 bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden gap-6 lg:gap-0 transition-all duration-700",
    iconBox: "w-16 h-16 rounded-[2rem] bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.15)] overflow-hidden relative shrink-0 transition-transform duration-700 group-hover:scale-110",
    cinematicGlow: "absolute inset-0 bg-gradient-to-br from-studio/10 via-transparent to-orange-500/10 opacity-30 pointer-events-none blur-3xl",
    pulseSlow: "animate-pulse-slow",
    mainCard: "relative bg-[#020617]/40 border border-white/5 rounded-[2.5rem] overflow-hidden group/card transition-all duration-700",
    mainCardActive: "border-studio/20 shadow-[0_0_50px_rgba(6,182,212,0.15)]",
    mainCardFrames: "border-orange-500/20 shadow-[0_0_50px_rgba(249,115,22,0.15)] hover:border-orange-500/40",
    mainCardNormal: "border-zinc-800/30 hover:border-zinc-700",
    mainCardInner: "w-full p-8 lg:p-10 max-w-[1400px] mx-auto",
    innerBorder: "absolute inset-0 border-[1px] rounded-[3rem] pointer-events-none transition-colors duration-700",
  },
  
  card: {
    wrapper: "bg-gradient-to-br from-[#0c0d11] to-[#050505] border transition-all duration-700 overflow-hidden rounded-[2.5rem] h-full flex flex-col relative",
    dragging: "border-studio shadow-[0_0_50px_rgba(6,182,212,0.4)] scale-[1.05] z-50",
    normal: "border-white/5 hover:border-studio/40 hover:shadow-[0_0_60px_rgba(6,182,212,0.15)] hover:scale-[1.01]",
    imageArea: "aspect-video bg-[#030303] flex items-center justify-center border-b border-white/5 relative overflow-hidden z-10 rounded-t-[2.5rem]",
    labelBadge: "absolute top-5 left-5 bg-[#050505]/90 backdrop-blur-md border border-white/10 text-zinc-100 text-[10px] font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 uppercase tracking-widest z-20 transition-all duration-700",
    actionOverlay: "absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex items-center justify-center gap-4 p-6",
    contentArea: "p-8 space-y-8 relative z-10 flex-1",
    narrationBox: "space-y-3 flex-1 pr-8",
    narrationText: "text-base text-zinc-200 font-medium leading-relaxed tracking-wide font-serif italic",
    visualBlueprint: "bg-white/[0.02] p-6 rounded-3xl border border-white/5 relative overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10",
    visualText: "text-xs text-zinc-400 font-mono leading-relaxed relative z-10 tracking-tight",
    statBox: "bg-white/[0.01] p-5 rounded-3xl border border-white/5 transition-all duration-500 hover:bg-white/[0.03]",
    footer: "px-8 py-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between mt-auto z-10 relative backdrop-blur-sm",
  },

  progress: {
    container: "absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden z-[100]",
    fill: "h-full bg-gradient-to-r from-studio via-orange-500 to-studio bg-[length:200%_auto] animate-[gradient_2s_linear_infinite] transition-all duration-500",
    label: "text-[8px] font-black uppercase tracking-[0.3em] text-studio/60",
    percent: "text-[8px] font-black text-studio",
  },

  planning: {
    guideCard: "bg-[#0c0d11]/95 backdrop-blur-2xl border-white/10 p-12 relative overflow-hidden rounded-[4rem] shadow-2xl",
    guideTitle: "text-3xl font-black text-white mb-12 flex items-center gap-6 uppercase tracking-[0.3em] drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    itemTitle: "flex items-center gap-4 font-black tracking-[0.4em] uppercase text-[11px] text-studio transition-all duration-500",
    itemDesc: "text-xs text-zinc-400 font-bold uppercase tracking-widest leading-loose mt-2 pl-1 group-hover:text-zinc-200 transition-colors",
  },

  tabs: {
    container: 'flex items-center gap-1 bg-[#020617]/60 border border-white/5 p-1 rounded-2xl backdrop-blur-xl shadow-2xl',
    overlay: 'absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000',
    button: 'relative px-5 py-2 text-[10px] font-black tracking-[0.2em] transition-all duration-500 uppercase flex items-center gap-2.5',
    buttonActive: 'text-orange-400',
    buttonInactive: 'text-zinc-500 hover:text-zinc-300',
    pill: 'absolute inset-0 bg-white/10 border border-white/20 rounded-full z-0',
    icon: 'w-3.5 h-3.5 transition-all duration-500',
    iconActive: 'opacity-100 scale-110',
    iconInactive: 'opacity-40',
    spinner: 'w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin',
    label: 'hidden md:inline',
    nav: "flex items-center gap-5 p-2.5 bg-[#050505]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] mb-12 overflow-x-auto no-scrollbar",
    btn: "px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-4 shrink-0 whitespace-nowrap",
    grid: "gap-12 pb-20",
    content: "py-12 space-y-20",
    sectionHeader: "flex items-center gap-8 border-b border-white/5 pb-12",
    headerIconBox: "w-20 h-20 rounded-[2.5rem] border flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-105",
    sectionTitle: "text-4xl font-black text-white uppercase tracking-tighter italic",
    sectionSubtitle: "text-zinc-500 text-[11px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-3",
    gridTitle: "text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3 mb-8",
    tabsBar: "studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden",
    tabsBarGlow: "absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    tabsBarInner: "relative z-10 w-full flex justify-center",
  }
};
