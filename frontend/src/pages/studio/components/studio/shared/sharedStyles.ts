export const sharedStyles = {
  // Layout Containers
  moduleContainer: "max-w-[1700px] mx-auto px-6 space-y-10 pb-32",
  moduleContent: "relative min-h-[400px]",
  
  // Header Components
  moduleHeader: "relative overflow-hidden flex flex-col gap-8 rounded-[2.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,12,12,0.94),rgba(6,6,6,0.88))] p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(189,74,74,0.10),transparent_38%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_28%)] before:pointer-events-none",
  headerMain: "relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8",
  brandSection: "flex items-center gap-6",
  titleSection: "space-y-4",
  headerTitle: "text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white leading-none drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]",
  headerSubtitle: "text-[10px] font-bold text-zinc-500 uppercase tracking-[0.42em] mt-4",
  headerBadges: "flex flex-wrap items-center gap-3",
  headerBadge: "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] border transition-all backdrop-blur-md",
  headerBadgeRed: "bg-[#bd4a4a]/12 border-[#bd4a4a]/25 text-[#ff8a8a] shadow-[0_0_20px_rgba(189,74,74,0.12)]",
  
  // Stats
  statsGrid: "flex flex-wrap items-center gap-4",
  statCard: "relative overflow-hidden bg-white/[0.03] border border-white/5 rounded-[1.75rem] px-6 py-4 flex flex-col gap-2 min-w-[150px] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.045] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/10",
  statLabel: "flex items-center gap-2",
  statValue: "text-sm font-black text-white uppercase tracking-wider",
  
  // Toolbar
  toolbar: "flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-950/30 border border-white/5 p-4 rounded-[2rem] backdrop-blur-md",
  moduleToolbar: "flex flex-col md:flex-row items-center justify-between gap-6 rounded-[2rem] border border-white/5 bg-zinc-950/30 p-4 backdrop-blur-md shadow-[0_18px_50px_rgba(0,0,0,0.18)]",
  toolbarLeft: "flex items-center gap-4 flex-1 w-full md:w-auto",
  toolbarCenter: "flex items-center gap-2",
  toolbarRight: "flex items-center gap-4",
  toolbarButton: "px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2",
  searchContainer: "relative flex-1 max-w-md",
  searchIcon: "absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500",
  searchHint: "absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-600 bg-zinc-950 px-1.5 py-0.5 rounded border border-white/5",
  searchInput: "w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-14 pr-14 py-3.5 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-[#bd4a4a]/50 focus:bg-zinc-900 transition-all",
  viewToggleGroup: "flex items-center p-1 bg-zinc-900/50 border border-white/5 rounded-xl",
  viewToggleBtn: "p-2 rounded-lg transition-all",
  viewToggleBtnActive: "bg-[#bd4a4a] text-white shadow-[0_0_15px_rgba(189,74,74,0.3)]",
  primaryActionBtn: "bg-[#bd4a4a] hover:bg-[#a63d3d] text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(189,74,74,0.2)] transition-all",
  
  // Tabs
  tabList: "flex items-center gap-2 p-2 bg-[linear-gradient(180deg,rgba(10,10,10,0.96),rgba(5,5,5,0.9))] border border-white/10 rounded-[2rem] overflow-x-auto hide-scrollbar shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-md",
  tabItem: "relative px-6 py-3.5 rounded-[1.15rem] text-xs font-black uppercase tracking-[0.16em] flex items-center gap-3 transition-[transform,background-color,color,border-color,box-shadow] duration-500 ease-out whitespace-nowrap overflow-hidden border border-transparent shrink-0 group hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
  tabActive: "text-white border-white/15 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(0,0,0,0.26)]",
  tabInactive: "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.035] hover:border-white/5",
  tabIndicator: "absolute inset-0 rounded-[1.15rem] bg-[linear-gradient(135deg,#bd4a4a_0%,#a63d3d_55%,#651f1f_100%)] shadow-[0_12px_34px_rgba(189,74,74,0.26)] transition-all duration-500 ease-out",
  tabRail: "relative",
  tabArrowButton: "absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-zinc-400 shadow-[0_10px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.05] hover:text-white active:scale-95",
  tabArrowButtonDisabled: "pointer-events-none opacity-30",
  
  // Card System
  cardGrid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8",
  card: "relative bg-zinc-950/40 border border-white/5 rounded-[3rem] p-10 flex flex-col gap-10 hover:border-[#bd4a4a]/20 transition-all overflow-hidden",
  cardHeader: "flex items-start justify-between relative z-10",
  cardTitle: "text-xl font-black text-white uppercase tracking-widest flex items-center gap-2",
  cardSubtitle: "text-xs font-bold text-zinc-600 uppercase tracking-widest",
  cardFooter: "flex items-center justify-between pt-4 border-t border-white/5 relative z-10",
  
  // Common Elements
  iconBox: "p-4 bg-zinc-900/50 border border-white/5 rounded-2xl transition-colors",
  badge: "px-3 py-1 bg-zinc-900 border border-white/5 rounded-full text-xs font-black uppercase tracking-widest text-zinc-500",
};
