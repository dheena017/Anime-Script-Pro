import React from 'react';
import { SpeedLines, DigitalScanline, HUDDecoration } from './ui/Effects';
import { NavItem, DropdownLink } from './ui/NavComponents';
import { HeroPromptBar } from './ui/HeroPromptBar';
import { Gallery } from './ui/Gallery';
import { Features } from './ui/Features';
import { FAQ } from './ui/FAQ';
import FooterLanding from './FooterLanding';
import { GALLERY_DATA, PLACEHOLDER_PROMPTS } from './constants';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LifeBuoy, Mail, BookOpen, Video, Globe, X, Menu, Play, Code, Palette, Download, Sparkles, CreditCard } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [galleryImages] = React.useState(GALLERY_DATA);
  const [activePrompt, setActivePrompt] = React.useState<string>('');
  const [promptText, setPromptText] = React.useState<string>('');
  const [selectedStyle, setSelectedStyle] = React.useState<string>('Cyberpunk');
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setPlaceholderIndex((p) => (p + 1) % PLACEHOLDER_PROMPTS.length), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = () => {
    navigate(`/login?prompt=${encodeURIComponent(promptText || PLACEHOLDER_PROMPTS[placeholderIndex])}&style=${encodeURIComponent(selectedStyle)}`);
  };

  const toggleMenu = (menu: string) => setActiveMenu(activeMenu === menu ? null : menu);

  return (
    <div className="min-h-screen w-full max-w-full bg-[#030303] text-zinc-100 selection:bg-studio/30 selection:text-studio">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-studio/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <SpeedLines />
        <DigitalScanline />
        <HUDDecoration />
      </div>

      <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-black/50 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center gap-3 no-underline group">
              <span className="text-xl font-black tracking-tighter uppercase text-white">AnimeScript <span className="text-studio">Pro</span></span>
            </a>

            <div className="hidden lg:flex items-center gap-2">
              <NavItem label="Support" isOpen={activeMenu === 'support'} onClick={() => toggleMenu('support')}>
                <DropdownLink icon={LifeBuoy} title="Contact support" description="Get help from our support team." href="#" />
                <DropdownLink icon={Mail} title="Email us" description="Direct line to our support inbox." href="mailto:support@animescript.pro" />
              </NavItem>

              <NavItem label="Tutorials" isOpen={activeMenu === 'tutorials'} onClick={() => toggleMenu('tutorials')}>
                <DropdownLink icon={BookOpen} title="Learn" description="Learn how to use the studio." href="/tutorials" />
                <DropdownLink icon={Video} title="Youtube Channel" description="Visual guides and production workflows." href="https://youtube.com" />
                <DropdownLink icon={Globe} title="Instagram Inspiration" description="Daily art and narrative snippets." href="https://instagram.com" />
              </NavItem>

              <a href="/community" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors no-underline">Community</a>
              <a href="/pricing" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors no-underline">Pricing</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors hidden sm:block">Login</button>
            <Button onClick={() => navigate('/login')} className="bg-white text-black hover:bg-zinc-200 font-bold rounded-full px-6 transition-all transform hover:scale-105">Sign up</Button>
            <button className="lg:hidden p-2 text-zinc-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </nav>
      </header>

      <main className="pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio/10 border border-studio/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-studio" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-studio-glow">Advanced AI Studio v2.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-[0.9] text-white relative">
            <span className="relative z-10">TURN YOUR IMAGINATION</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-purple-500 to-studio drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] relative z-10">INTO STUDIO-QUALITY ANIME.</span>
            <div className="absolute inset-0 -z-0 bg-studio/5 blur-[100px] rounded-full scale-110 animate-pulse" />
          </h1>

          <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">The fastest AI generator for anime, manga, and concept art. Type a prompt. Get perfect anime art in seconds. Start creating for free.</p>

          <HeroPromptBar
            promptText={promptText}
            setPromptText={setPromptText}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            placeholderIndex={placeholderIndex}
            handleGenerate={handleGenerate}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Button onClick={() => navigate('/login')} className="h-16 px-10 rounded-2xl bg-studio text-black hover:bg-studio/90 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95">Start Generating for Free</Button>
            <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-sm transition-all">Watch Demo <Play className="ml-2 w-5 h-5 fill-white" /></Button>
          </div>

          <section className="max-w-5xl mx-auto py-16">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)] group">
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Video className="w-4 h-4 text-studio" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Demo</span>
              </div>
              <video className="w-full h-auto aspect-video object-cover" autoPlay muted loop playsInline poster="/cyberpunk_thumbnail_1776537282821.png">
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <Button className="w-20 h-20 rounded-full bg-studio text-black hover:scale-110 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center">
                  <Play className="w-10 h-10 fill-black translate-x-1" />
                </Button>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto py-20">
            <h2 className="text-4xl font-black text-center text-white uppercase tracking-wider mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center mb-6 group-hover:bg-studio/20 group-hover:scale-110 transition-all">
                  <Code className="w-8 h-8 text-studio" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Describe</h3>
                <p className="text-zinc-400">Type your prompt or describe your scene.</p>
              </div>

              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center mb-6 group-hover:bg-studio/20 group-hover:scale-110 transition-all">
                  <Palette className="w-8 h-8 text-studio" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Customize</h3>
                <p className="text-zinc-400">Choose your style – Cyberpunk, 90s Cel‑Shaded, Watercolor, etc.</p>
              </div>

              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-studio/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(6,182,212,0.15)] transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center mb-6 group-hover:bg-studio/20 group-hover:scale-110 transition-all">
                  <Download className="w-8 h-8 text-studio" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Download</h3>
                <p className="text-zinc-400">Get high‑res, royalty‑free anime art in seconds.</p>
              </div>
            </div>
          </section>

          <Gallery images={galleryImages} setActivePrompt={setActivePrompt} activePrompt={activePrompt} onTryPrompt={() => navigate('/login')} />

          <Features />

          <section className="max-w-7xl mx-auto py-20 text-center">
            <h2 className="text-4xl font-black text-white uppercase tracking-wider mb-8">Pricing</h2>
            <p className="text-zinc-400 mb-6 max-w-xl mx-auto">Free tier gives you 10 credits daily. Upgrade for unlimited generations, private mode, and commercial rights.</p>
            <Button onClick={() => navigate('/pricing')} className="h-14 px-12 rounded-2xl bg-studio text-black font-black uppercase tracking-widest hover:bg-studio/90 transition-all hover:scale-105">View Plans <CreditCard className="ml-2 w-5 h-5" /></Button>
          </section>

          <FAQ />
        </div>
      </main>

      <FooterLanding />
    </div>
  );
}
