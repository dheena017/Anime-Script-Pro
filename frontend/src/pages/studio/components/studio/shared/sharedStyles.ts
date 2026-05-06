export const sharedStyles = {
  // Layout Containers
  moduleContainer: "max-w-[1700px] mx-auto px-6 space-y-10 pb-32",
  moduleContent: "relative min-h-[400px]",
  
  // Header Components
  moduleHeader: "flex flex-col gap-8 border-b border-white/5 pb-10",
  headerMain: "flex flex-col lg:flex-row lg:items-end justify-between gap-8",
  brandSection: "flex items-center gap-8",
  titleSection: "space-y-3",
  headerTitle: "text-6xl font-black italic uppercase tracking-tighter text-white leading-none",
  headerSubtitle: "text-[11px] font-bold text-zinc-500 uppercase tracking-[0.4em] mt-4",
  headerBadges: "flex items-center gap-3",
  headerBadge: "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
  headerBadgeRed: "bg-[#bd4a4a]/10 border-[#bd4a4a]/20 text-[#bd4a4a]",
  
  // Stats
  statsGrid: "flex items-center gap-4",
  statCard: "bg-zinc-950/50 border border-white/5 rounded-3xl px-6 py-4 flex flex-col gap-2 min-w-[140px] backdrop-blur-sm hover:border-white/10 transition-all",
  statLabel: "flex items-center gap-2",
  statValue: "text-sm font-black text-white uppercase tracking-wider",
  
  // Toolbar
  toolbar: "flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-950/30 border border-white/5 p-4 rounded-[2rem] backdrop-blur-md",
  moduleToolbar: "flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-950/30 border border-white/5 p-4 rounded-[2rem] backdrop-blur-md",
  toolbarLeft: "flex items-center gap-4 flex-1 w-full md:w-auto",
  toolbarCenter: "flex items-center gap-2",
  toolbarRight: "flex items-center gap-4",
  toolbarButton: "px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2",
  searchContainer: "relative flex-1 max-w-md",
  searchIcon: "absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500",
  searchHint: "absolute right-5 top-1/2 -translate-y-1/2 text-[8px] font-black text-zinc-600 bg-zinc-950 px-1.5 py-0.5 rounded border border-white/5",
  searchInput: "w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-14 pr-14 py-3.5 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-[#bd4a4a]/50 focus:bg-zinc-900 transition-all",
  viewToggleGroup: "flex items-center p-1 bg-zinc-900/50 border border-white/5 rounded-xl",
  viewToggleBtn: "p-2 rounded-lg transition-all",
  viewToggleBtnActive: "bg-[#bd4a4a] text-white shadow-[0_0_15px_rgba(189,74,74,0.3)]",
  primaryActionBtn: "bg-[#bd4a4a] hover:bg-[#a63d3d] text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(189,74,74,0.2)] transition-all",
  
  // Tabs
  tabList: "flex items-center gap-2 p-1.5 bg-[#080808] border border-white/5 rounded-[1.8rem] overflow-x-auto hide-scrollbar",
  tabItem: "relative px-6 py-3.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-3 transition-all whitespace-nowrap overflow-hidden",
  tabActive: "text-white",
  tabInactive: "text-zinc-500 hover:text-zinc-300 hover:bg-white/5",
  tabIndicator: "absolute inset-0 bg-[#bd4a4a] shadow-[0_0_20px_rgba(189,74,74,0.3)]",
  
  // Card System
  cardGrid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8",
  card: "relative bg-zinc-950/40 border border-white/5 rounded-[3rem] p-10 flex flex-col gap-10 hover:border-[#bd4a4a]/20 transition-all overflow-hidden",
  cardHeader: "flex items-start justify-between relative z-10",
  cardTitle: "text-xl font-black text-white uppercase tracking-widest flex items-center gap-2",
  cardSubtitle: "text-[10px] font-bold text-zinc-600 uppercase tracking-widest",
  cardFooter: "flex items-center justify-between pt-4 border-t border-white/5 relative z-10",
  
  // Common Elements
  iconBox: "p-4 bg-zinc-900/50 border border-white/5 rounded-2xl transition-colors",
  badge: "px-3 py-1 bg-zinc-900 border border-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-500",
};
