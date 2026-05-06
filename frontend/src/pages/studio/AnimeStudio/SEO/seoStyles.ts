// SEO Tab Shared Style Tokens
// Centralized class strings for common chrome patterns across Keywords, Description, AltText, Tags, Distribution, and Growth tabs

export const seoStyles = {
  // ==== HEADER SECTION ====
  headerContainer: 'flex items-center justify-between',
  headerTitle: 'text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3',
  headerSubtitle: 'text-[10px] text-zinc-500 mt-2',
  statusDot: 'w-1.5 h-1.5 rounded-full',

  // ==== GENERATE BUTTON (base - color added inline) ====
  generateButtonBase: 'h-11 text-white font-black tracking-[0.2em] uppercase text-[10px] border border-white/20 px-8 rounded-2xl transition-all duration-300',

  // ==== CARD CHROME ====
  cardContainer: 'bg-[#050505]/50 border transition-all duration-700 backdrop-blur-md overflow-hidden relative rounded-[2.5rem] group/card min-h-[500px]',
  cardContent: 'relative z-10 p-10 h-full',

  // ==== CONTENT AREA (Markdown display) ====
  contentProseContainer: 'prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000 prose-h1:text-studio prose-strong:text-studio prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-medium',

  // ==== LOADING STATE ====
  loadingStateContainer: 'flex flex-col items-center justify-center h-full min-h-[300px] animate-in fade-in duration-500',
  loadingSpinner: 'w-12 h-12 border-4 rounded-full animate-spin mb-6',
  loadingTitle: 'text-xs font-black uppercase tracking-[0.3em] mb-3',
  loadingText: 'text-[10px] text-zinc-500 uppercase tracking-[0.2em] leading-relaxed text-center max-w-[320px]',

  // ==== EMPTY STATE ====
  emptyStateContainer: 'flex flex-col items-center justify-center h-full min-h-[300px] text-zinc-700 group/empty',
  emptyIconBox: 'w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-700',
  emptyText: 'font-black uppercase tracking-[0.3em] text-[10px] max-w-[220px] text-center leading-loose',

  // ==== GRID PATTERN (Background) ====
  gridPattern: 'absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none',

  // ==== PLATFORM CARD (Distribution tab) ====
  platformCard: 'p-6 bg-[#050505]/60 border transition-all duration-500 group cursor-default hover:scale-[1.02]',
  platformIconBox: 'p-3 rounded-xl',
  platformStatus: 'px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest',
  platformName: 'font-black text-[10px] uppercase tracking-wider',
  platformDesc: 'text-[9px] text-zinc-500 mt-2 leading-tight',

  // ==== DISTRIBUTION HEADER ====
  distributionHeader: 'flex items-center justify-between border-b border-white/5 pb-10',
  distributionIconBox: 'w-16 h-16 rounded-[2rem] flex items-center justify-center',
  distributionTitle: 'text-3xl font-black text-white uppercase tracking-tighter',
  distributionSubtitle: 'text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1',

  // ==== COPY BUTTON (Distribution/Growth) ====
  copyButtonBase: 'h-12 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest gap-2',
  generateButtonLarge: 'h-12 px-8 rounded-xl text-white font-black uppercase tracking-widest text-[10px] gap-3 transition-all',

  // ==== TAGS DISPLAY ====
  tagsContainer: 'flex flex-wrap gap-2',
  tagItem: 'px-4 py-2 border rounded-full text-[10px] font-bold flex items-center gap-2',
  tagManifestHeader: 'text-[10px] font-black uppercase tracking-widest',

  // ==== SIDEBAR CARD (Tags platform specifics) ====
  sidebarCard: 'bg-[#050505]/50 border border-white/5 rounded-[2rem] p-6 space-y-4',
  sidebarTitle: 'text-[9px] font-black text-zinc-400 uppercase tracking-widest',
  platformSpec: 'flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl',
};
