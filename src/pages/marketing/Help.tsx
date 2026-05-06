import { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageSquare, 
  Zap, 
  LifeBuoy, 
  ExternalLink,
  Cpu,
  ShieldCheck,
  FileText,
  Mail,
  Activity,
  ArrowRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supportService, HelpCategory, FAQ } from '@/services/api/support';
import { marketingStyles as s } from './marketingStyles';

const ICON_MAP: Record<string, any> = {
  Zap,
  FileText,
  Cpu,
  ShieldCheck,
  BookOpen,
  HelpCircle
};

export default function HelpPage() {
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ faqs: FAQ[] } | null>(null);

  useEffect(() => {
    async function hydrate() {
      try {
        const [cats, frequentFaqs] = await Promise.all([
          supportService.getHelpCategories(),
          supportService.getFAQs(true)
        ]);
        setCategories(cats);
        setFaqs(frequentFaqs);
      } catch (err) {
        console.error("Transmission failed", err);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const results = await supportService.searchHelp(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error("Search protocol failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const displayFaqs = searchResults ? searchResults.faqs : faqs;

  if (loading && categories.length === 0) {
    return (
      <div className={s.helpLoadingRoot}>
        <div className={s.helpLoadingSpinnerWrapper}>
           <div className={s.helpLoadingSpinner} />
           <div className={s.helpLoadingIconWrapper}>
              <Zap className={s.helpLoadingIcon} />
           </div>
        </div>
        <span className={s.helpLoadingLabel}>Initializing Terminal</span>
      </div>
    );
  }

  return (
    <div className={s.pageAlt}>
      {/* Visual Decor */}
      <div className={s.decorTop} />
      <div className={s.decorBottom} />

      <div className={s.wrapper}>
        
        {/* 1. KNOWLEDGE SEARCH MATRIX */}
        <header className={s.sectionHeader}>
          <div className={s.helpIntroStack}>
            <div className={s.helpIntroRow}>
              <div className={s.badgePill}>
                <Database className={s.helpBadgeIcon} />
                <span className={s.badgeText}>Help Archive</span>
              </div>
            </div>
            <h1 className={s.pageTitle}>
              How can we <span className={s.helpHighlight}>Assist?</span>
            </h1>
            <p className={s.pageDescription}>
              Global knowledge terminal for autonomous production protocols. Search the archive or initialize a support directive.
            </p>
          </div>

          <div className={s.helpSearchSurface}>
            <div className={s.helpSearchFocusRing} />
            <div className={s.inputCard}>
              <Search className={cn(s.searchIcon, isSearching ? "text-studio animate-pulse" : "text-zinc-600")} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className={s.searchInput} 
                placeholder="SEARCH PROTOCOLS, MODELS, OR BILLING..." 
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className={s.searchButton}
              >
                {isSearching ? "SEARCHING..." : "INITIALIZE"}
              </Button>
            </div>
          </div>
        </header>

        {/* 2. PROTOCOL GRID */}
        {!searchResults && (
          <div className={s.supportGrid}>
            {categories.map((cat, idx) => {
              const Icon = ICON_MAP[cat.icon] || HelpCircle;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={s.supportCard}>
                    <div className={s.supportCardOverlay}>
                      <Icon className={cn("w-32 h-32", cat.color)} />
                    </div>
                    <div className={s.supportCardInner}>
                      <div className={cn(s.supportCardIcon, cat.color)}>
                        <Icon className={s.helpSupportCardIcon} />
                      </div>
                      <div className={s.helpCategoryRow}>
                        <span className={s.helpCategoryId}>NODE-P{idx + 1}</span>
                        <h3 className={s.supportCardHeading}>{cat.label}</h3>
                      </div>
                      <p className={s.helpCategorySub}>{cat.sub}</p>
                      <div className={s.helpProtocolAction}>
                        OPEN PROTOCOL <ArrowRight className={s.externalLinkIcon} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className={s.helpContentGrid}>
          {/* 3. ARCHIVE MONITOR */}
          <div className={s.helpContentColumn}>
            <div className={s.helpPanelHeader}>
               <div className={s.helpPanelBadgeRow}>
                  <div className={s.helpPanelBadge}>
                     <Zap className={s.helpPanelIcon} />
                  </div>
                  <h2 className={s.helpPanelHeading}>
                    {searchResults ? `Archive Search (${displayFaqs.length})` : 'Frequent Inquiries'}
                  </h2>
               </div>
               {searchResults && (
                 <button onClick={() => { setSearchQuery(''); setSearchResults(null); }} className={s.resetButton}>
                    Reset Archive
                 </button>
               )}
            </div>
            
            <div className={s.helpFaqGrid}>
              <AnimatePresence mode="popLayout">
                {displayFaqs.length > 0 ? displayFaqs.map((faq, idx) => (
                  <motion.div 
                    layout
                    key={faq.id || idx} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={s.helpFaqCard}
                  >
                    <div className={s.helpFaqContent}>
                      <div className={s.helpFaqMeta}>
                        <div className={s.helpFaqRow}>
                           <div className={s.helpFaqDot} />
                           <p className={s.helpFaqQuestion}>{faq.question}</p>
                        </div>
                        <p className={s.helpFaqAnswer}>
                           {faq.answer}
                        </p>
                      </div>
                      <div className={s.helpFaqLink}>
                        <ExternalLink className={s.externalLinkIcon} />
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className={s.helpNoResultsCard}>
                     <LifeBuoy className={s.helpNoResultsIcon} />
                     <p className={s.helpNoResultsText}>Transmission Error: Protocol Not Found In Archive.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 4. SYNC MONITOR (SIDEBAR) */}
          <div className={s.helpSidebarColumn}>
            <div className={s.helpSupportHeader}>
               <div className={s.helpSupportTag}>
                  <Activity className={s.helpSupportBadgeIcon} />
               </div>
               <h2 className={s.helpSupportTitle}>Support Core</h2>
            </div>

            <div className={s.helpSidebarStack}>
               <Card className={s.helpCardPanel}>
                  <div className={s.helpCardBody}>
                    <div className={s.helpCardIconWrap}>
                      <Mail className={s.helpCardIconLarge} />
                      <div className={s.helpNotificationDot} />
                    </div>
                    <h3 className={s.helpSupportTitle}>Priority Support</h3>
                    <p className={s.helpSupportCopy}>Response Latency: &lt; 2 hours</p>
                  </div>
                  <Button className={s.helpCallToActionButton}>
                    INITIATE CONTACT LINK
                  </Button>
               </Card>

               <div className={s.helpSidebarLinks}>
                  {[
                    { icon: BookOpen, label: 'API Protocols', link: '/documentation' },
                    { icon: MessageSquare, label: 'Global Collective', link: '#' }
                  ].map((item, idx) => (
                    <a 
                      key={idx}
                      href={item.link} 
                      className={s.helpSidebarLink}
                    >
                      <div className={s.helpSidebarLinkContent}>
                        <item.icon className={s.helpSidebarLinkIcon} />
                        <span className={s.helpSidebarLinkText}>{item.label}</span>
                      </div>
                      <ExternalLink className={s.helpSidebarLinkIcon} />
                    </a>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* 5. SYSTEM STATUS FOOTER */}
        <footer className={s.footerStats}>
           <div className={s.footerRow}>
              <div className={s.footerMeta}>
                 <div className={s.helpFooterStatusDot} />
                 <span>Studio Uptime: 99.98%</span>
              </div>
              <div className={s.footerDivider} />
              <span>Node: Global-Archive-Main</span>
           </div>
           <div className={s.footerLinks}>
              <a href="#" className={s.footerLink}>Privacy Policy</a>
              <a href="#" className={s.footerLink}>Terms of Service</a>
              <a href="/system/status" className={s.footerLink}>System Status</a>
           </div>
        </footer>
      </div>
    </div>
  );
}
