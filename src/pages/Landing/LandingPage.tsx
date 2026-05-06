import React from 'react';
import { NavItem, DropdownLink } from './ui/NavComponents';
import { HeroPromptBar } from './ui/HeroPromptBar';
import { Gallery } from './ui/Gallery';
import { landingStyles as s } from './landingStyles';
import { Features } from './ui/Features';
import FooterLanding from './FooterLanding';
import { GALLERY_DATA, PLACEHOLDER_PROMPTS } from './constants';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LifeBuoy, Mail, BookOpen, Video, Globe, X, Menu, Play, Code, Palette, Download, ChevronDown, Sparkles, CreditCard } from 'lucide-react';

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
    <div className={s.page}>
      <div className={s.pageGridOverlay}>
        <div className={s.gridBackground} />
        <div className={s.decorTop} />
        <div className={s.decorBottom} />
      </div>

      <header className={s.header}>
        <nav className={s.nav}>
          <div className="flex items-center gap-12">
            <a href="/" className={s.navBrand}>
              <span className={s.brandText}>AnimeScript <span className={s.brandAccent}>Pro</span></span>
            </a>

            <div className={s.navLinks}>
              <NavItem label="Support" isOpen={activeMenu === 'support'} onClick={() => toggleMenu('support')}>
                <DropdownLink icon={LifeBuoy} title="Contact support" description="Get help from our technical specialists." href="#" />
                <DropdownLink icon={Mail} title="Email us" description="Direct line to our support inbox." href="mailto:support@animescript.pro" />
              </NavItem>

              <NavItem label="Tutorials" isOpen={activeMenu === 'tutorials'} onClick={() => toggleMenu('tutorials')}>
                <DropdownLink icon={BookOpen} title="Learn" description="Master the God Mode engine mechanics." href="/tutorials" />
                <DropdownLink icon={Video} title="Youtube Channel" description="Visual guides and production workflows." href="https://youtube.com" />
                <DropdownLink icon={Globe} title="Instagram Inspiration" description="Daily art and narrative snippets." href="https://instagram.com" />
              </NavItem>

              <a href="/community" className={s.navLink}>Community</a>
              <a href="/pricing" className={s.navLink}>Pricing</a>
            </div>
          </div>

          <div className={s.navActions}>
            <button onClick={() => navigate('/login')} className={s.navLogin}>Login</button>
            <Button onClick={() => navigate('/login')} className={s.navSignupButton}>Sign up</Button>
            <button className={s.mobileToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </nav>
      </header>

      <main className={s.heroSection}>
        <div className={s.heroContent}>
          <div className={s.heroBadge}>
            <Sparkles className="w-4 h-4 text-studio" />
            <span className={s.heroBadgeText}>Autonomous Production Engine v2.0</span>
          </div>

          <h1 className={s.heroTitle}>
            <span className="relative z-10">TURN YOUR IMAGINATION</span> <br />
            <span className={s.heroGradientText}>INTO STUDIO-QUALITY ANIME.</span>
            <div className="absolute inset-0 -z-0 bg-studio/5 blur-[100px] rounded-full scale-110" />
          </h1>

          <p className={s.heroSubtitle}>The fastest AI generator for anime, manga, and concept art. Type a prompt. Get perfect anime art in seconds. Start creating for free.</p>

          <HeroPromptBar
            promptText={promptText}
            setPromptText={setPromptText}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            placeholderIndex={placeholderIndex}
            handleGenerate={handleGenerate}
          />

          <div className={s.heroActions}>
            <Button onClick={() => navigate('/login')} className={s.actionPrimary}>Start Generating for Free</Button>
            <Button variant="outline" className={s.actionSecondary}>Watch Demo <Play className="ml-2 w-5 h-5 fill-white" /></Button>
          </div>

          <section className={s.videoSection}>
            <div className={s.videoCard}>
              <div className={s.videoLabel}>
                <Video className="w-4 h-4 text-studio" />
                <span className={s.videoLabelText}>Live Demo</span>
              </div>
              <video className="w-full h-auto aspect-video object-cover" controls poster="/cyberpunk_thumbnail_1776537282821.png">
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>
              <div className={s.videoOverlay}>
                <Button className={s.videoPlayButton}>
                  <Play className="w-10 h-10 fill-black translate-x-1" />
                </Button>
              </div>
            </div>
          </section>

          <section className={s.sectionBlock}>
            <h2 className={s.sectionTitle}>How It Works</h2>
            <div className={s.featureGrid}>
              <div className={s.featureCard}>
                <div className={s.featureIcon}>
                  <Code className="w-8 h-8 text-studio" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Describe</h3>
                <p className="text-zinc-400">Type your prompt or describe your scene.</p>
              </div>

              <div className={s.featureCard}>
                <div className={s.featureIcon}>
                  <Palette className="w-8 h-8 text-studio" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Customize</h3>
                <p className="text-zinc-400">Choose your style – Cyberpunk, 90s Cel‑Shaded, Watercolor, etc.</p>
              </div>

              <div className={s.featureCard}>
                <div className={s.featureIcon}>
                  <Download className="w-8 h-8 text-studio" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Download</h3>
                <p className="text-zinc-400">Get high‑res, royalty‑free anime art in seconds.</p>
              </div>
            </div>
          </section>

          <Gallery images={galleryImages} setActivePrompt={setActivePrompt} activePrompt={activePrompt} onTryPrompt={() => navigate('/login')} />

          <Features />

          <section className={s.sectionBlockCenter}>
            <h2 className={s.sectionTitle}>Pricing</h2>
            <p className={s.sectionText}>Free tier gives you 10 credits daily. Upgrade for unlimited generations, private mode, and commercial rights.</p>
            <Button onClick={() => navigate('/pricing')} className={s.pricingActionButton}>View Plans <CreditCard className="ml-2 w-5 h-5" /></Button>
          </section>

          <section className={s.sectionBlock}>
            <h2 className={s.faqHeading}>FAQ</h2>
            <div className={s.faqGroup}>
              {[
                { q: 'Do I own the images I generate?', a: 'Yes – you receive full commercial rights for all creations on paid plans. Free-tier images are for personal use.' },
                { q: 'What happens when I run out of credits?', a: 'You can wait for your daily refresh (resets at midnight UTC) or upgrade to a Pro plan for unlimited usage.' },
                { q: 'Are there content restrictions?', a: 'Yes. Our safety filters block NSFW and illegal content to keep the community safe and compliant.' },
                { q: 'Can I use this for manhwa / manga panels?', a: 'Absolutely. Our engine supports consistent character generation across multiple panels, perfect for sequential art.' },
                { q: 'What resolution are the generated images?', a: 'Standard output is 1024×1024. Pro and Master plans include 4K upscaling up to 4096×4096.' },
              ].map((faq, i) => (
                <details key={i} className={s.faqItem}>
                  <summary className={s.faqSummary}>
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className={s.faqDesc}>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <FooterLanding />
    </div>
  );
}
