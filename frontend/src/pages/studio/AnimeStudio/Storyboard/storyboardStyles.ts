export const storyboardStyles = {
  container: "space-y-12 pb-24",
  headerBox: "relative flex flex-col lg:flex-row items-center justify-between p-6 bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden gap-6 lg:gap-0 transition-all duration-700",
  iconBox: "w-16 h-16 rounded-[2rem] bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.15)] overflow-hidden relative shrink-0 transition-transform duration-700 group-hover:scale-110",
  cinematicGlow: "absolute inset-0 bg-gradient-to-br from-studio/10 via-transparent to-fuchsia-500/10 opacity-30 pointer-events-none blur-3xl",
  pulseSlow: "animate-pulse-slow",
  
  // Scene Card Classes
  sceneCard: "bg-gradient-to-br from-[#0c0d11] to-[#050505] border transition-all duration-700 overflow-hidden rounded-[2.5rem] h-full flex flex-col relative",
  sceneCardDragging: "border-studio shadow-[0_0_50px_rgba(6,182,212,0.4)] scale-[1.05] z-50",
  sceneCardNormal: "border-white/5 hover:border-studio/40 hover:shadow-[0_0_60px_rgba(6,182,212,0.15)] hover:scale-[1.01]",
  sceneImageArea: "aspect-video bg-[#030303] flex items-center justify-center border-b border-white/5 relative overflow-hidden z-10 rounded-t-[2.5rem]",
  sceneLabelBadge: "absolute top-5 left-5 bg-[#050505]/90 backdrop-blur-md border border-white/10 text-zinc-100 text-[10px] font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 uppercase tracking-widest z-20 transition-all duration-700",
  sceneActionOverlay: "absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex items-center justify-center gap-4 p-6",
  sceneContentArea: "p-8 space-y-8 relative z-10 flex-1",
  sceneNarrationBox: "space-y-3 flex-1 pr-8",
  sceneNarrationText: "text-base text-zinc-200 font-medium leading-relaxed tracking-wide font-serif italic",
  sceneVisualBlueprint: "bg-white/[0.02] p-6 rounded-3xl border border-white/5 relative overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10",
  sceneVisualText: "text-xs text-zinc-400 font-mono leading-relaxed relative z-10 tracking-tight",
  sceneStatBox: "bg-white/[0.01] p-5 rounded-3xl border border-white/5 transition-all duration-500 hover:bg-white/[0.03]",
  sceneFooter: "px-8 py-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between mt-auto z-10 relative backdrop-blur-sm",

  // Production Progress Bar
  productionProgressContainer: "absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden z-[100]",
  productionProgressFill: "h-full bg-gradient-to-r from-studio via-fuchsia-500 to-studio bg-[length:200%_auto] animate-[gradient_2s_linear_infinite] transition-all duration-500",

  // Planning Guide Classes
  planningGuideCard: "bg-[#0c0d11]/95 backdrop-blur-2xl border-white/10 p-12 relative overflow-hidden rounded-[4rem] shadow-2xl",
  planningGuideTitle: "text-3xl font-black text-white mb-12 flex items-center gap-6 uppercase tracking-[0.3em] drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]",
  planningGuideItemTitle: "flex items-center gap-4 font-black tracking-[0.4em] uppercase text-[11px] text-studio transition-all duration-500",
  planningGuideItemDesc: "text-xs text-zinc-400 font-bold uppercase tracking-widest leading-loose mt-2 pl-1 group-hover:text-zinc-200 transition-colors",

  // Tabs Classes
  tabsNav: "flex items-center gap-5 p-2.5 bg-[#050505]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] mb-12 overflow-x-auto no-scrollbar",
  tabBtn: "px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-4 shrink-0 whitespace-nowrap",
  framesGrid: "gap-12 pb-20",

  // Tab Content Layouts
  tabContent: "py-12 space-y-20",
  tabSectionHeader: "flex items-center gap-8 border-b border-white/5 pb-12",
  tabHeaderIconBox: "w-20 h-20 rounded-[2.5rem] border flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-105",
  tabSectionTitle: "text-4xl font-black text-white uppercase tracking-tighter italic",
  tabSectionSubtitle: "text-zinc-500 text-[11px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-3",
  tabGridTitle: "text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3 mb-8"
};
