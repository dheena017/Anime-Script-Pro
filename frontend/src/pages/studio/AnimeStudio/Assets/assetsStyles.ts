/**
 * Assets Module Styles
 * Consolidated styles for Header, Toolbar, and Page
 */

export const assetsStyles = {
  // --- LAYOUT & CONTAINER ---
  container: "space-y-6",
  
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
    actionButton: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-emerald-500/50 hover:text-emerald-400 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/back shadow-lg",
    actionButtonDanger: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/60 hover:text-red-300 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/stop shadow-lg",
    actionButtonPrimary: "relative w-full sm:w-auto h-10 px-8 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:text-emerald-300 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/btn shadow-lg",
    btnPrev: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-emerald-500/50 hover:text-emerald-400 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/back shadow-lg",
    btnRegen: "relative w-full sm:w-auto h-10 px-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-emerald-500/50 hover:text-emerald-400 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/regen shadow-lg",
    btnNext: "relative w-full sm:w-auto h-10 px-8 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 hover:text-emerald-300 font-black uppercase tracking-widest text-[9px] transition-all duration-300 group/btn shadow-lg",
  },

  // --- PAGE/CONTENT SECTION ---
  page: {
    hero: "p-8 lg:p-12 rounded-[2.5rem] bg-gradient-to-br from-zinc-900/40 via-[#030303]/60 to-black/40 border border-white/5 mb-8 relative overflow-hidden group/hero flex flex-col md:flex-row md:items-center justify-between gap-8",
    heroBadge: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studio/10 border border-studio/20 text-[10px] font-black text-studio uppercase tracking-widest mb-4",
    heroTitle: "text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter italic leading-none",
    heroLogline: "text-zinc-500 text-sm font-medium max-w-xl leading-relaxed mt-4",
    statGrid: "grid grid-cols-3 gap-4 shrink-0",
    statCard: "bg-black/40 border border-white/5 rounded-2xl p-4 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:border-studio/30 transition-all duration-500",
    mainCard: "bg-[#030303] overflow-hidden border border-zinc-800/30 rounded-[3rem] shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-all duration-700 relative",
    mainCardInner: "w-full p-8 lg:p-10 max-w-[1400px] mx-auto",
    innerBorder: "absolute inset-0 border-[1px] rounded-[3rem] border-white/5 pointer-events-none z-10",
    topGlow: "absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-studio/40 to-transparent blur-sm",
  },

  // --- CARD STYLES ---
  card: {
    wrapper: "relative group/card bg-[#050505]/60 backdrop-blur-xl border rounded-[2.5rem] overflow-hidden transition-all duration-700",
    gridOverlay: "absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.02] pointer-events-none",
    header: "p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-20",
    iconBox: "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-500",
    title: "text-sm font-black text-white uppercase tracking-widest",
    subtitle: "text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1",
    actionIconButton: "h-10 w-10 rounded-xl border transition-all duration-300",
    actionButton: "h-10 border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-studio/50 hover:text-studio font-black uppercase tracking-widest text-[9px] transition-all duration-300",
    actionButtonPrimary: "h-10 rounded-xl bg-white text-black hover:bg-zinc-100 font-black uppercase tracking-widest text-[9px] px-6 transition-all duration-300",
    contentArea: "p-8 lg:p-10",
    loadingSpinner: "w-12 h-12 border-2 border-studio/20 border-t-studio rounded-full animate-spin mb-6",
    emptyState: "flex flex-col items-center justify-center py-20 group/empty",
  },

  // --- TABS SECTION ---
  tabs: {
    tabsBar: "sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden",
    tabsBarGlow: "absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
    tabsBarInner: "relative z-10 w-full flex justify-center",
    nexusBadge: "flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl",
    nexusIcon: "w-4 h-4 text-studio",
    nexusLabel: "text-[10px] font-black text-studio uppercase tracking-[0.2em]",
  }
};