import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  Database,
  Lock,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { marketingStyles as s } from './marketingStyles';

const SECTIONS = [
  { id: 'NODE-L1', title: 'Acceptance of Protocol', icon: Shield },
  { id: 'NODE-L2', title: 'Content Ownership', icon: FileText },
  { id: 'NODE-L3', title: 'Acceptable Use', icon: AlertTriangle },
  { id: 'NODE-L4', title: 'Service Continuity', icon: Activity },
];

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className={s.termsRoot}>
      {/* Visual Decor */}
      <div className={s.decorTop} />
      <div className={s.decorBottom} />

      <div className={s.termsWrapper}>
        
        {/* 1. HEADER PROTOCOL */}
        <div className={s.termsHeader}>
           <div className={s.termsBadge}>
              <Lock className={s.termsBadgeIcon} />
              <span className={s.termsBadgeText}>Legal Archive Terminal</span>
           </div>
           <h1 className={s.termsTitle}>
             Terms of <span className={s.termsTitleAccent}>Protocol.</span>
           </h1>
           <p className={s.termsDescriptionText}>
             Global legal documentation for the AnimeScript Pro production environment. <br />
             Last Transmitted: {new Date().toLocaleDateString()}
           </p>
        </div>

        <div className={s.termsGrid}>
          
          {/* 2. PROTOCOL INDEX (SIDEBAR) */}
          <div className={s.termsIndex}>
             <div className={s.termsIndexSticky}>
                <div className={s.termsIndexHeader}>
                   <div className={s.termsIndexBadge}>
                      <Database className={s.termsIndexBadgeIcon} />
                   </div>
                   <h2 className={s.termsIndexTitle}>Protocol Index</h2>
                </div>
                
                <div className={s.termsIndexList}>
                   {SECTIONS.map((section, idx) => (
                     <a 
                      key={idx}
                      href={`#${section.id}`}
                      className={s.termsIndexLink}
                     >
                        <div className={s.termsIndexRow}>
                           <span className={s.termsIndexId}>{section.id}</span>
                           <span className={s.termsIndexLabel}>{section.title}</span>
                        </div>
                        <ChevronRight className={s.termsIndexIcon} />
                     </a>
                   ))}
                </div>

                <div className={s.termsInfoCard}>
                   <div className={s.termsInfoMeta}>
                      <ShieldCheck className={s.termsInfoIcon} />
                      <span className={s.termsInfoHeading}>Legal Sovereignty</span>
                   </div>
                   <p className={s.termsInfoText}>
                      All protocols are binding under global digital production governance. 
                      Account data is subject to encryption standards.
                   </p>
                </div>
             </div>
          </div>

          {/* 3. LEGAL NODE MATRIX */}
          <div className={s.termsContentColumn}>
             {/* NODE L1 */}
             <section id="NODE-L1" className={s.termsSection}>
                <div className={s.termsSectionDecor}>
                   <Shield className={s.termsSectionIllustration} />
                </div>
                <div className={s.termsSectionBlock}>
                   <div className={s.termsSectionMeta}>
                      <div className={s.termsSectionDot} />
                      <span className={s.termsSectionTag}>NODE-L1</span>
                   </div>
                   <h2 className={s.termsSectionHeading}>Acceptance of Protocol</h2>
                   <p className={s.termsSectionCopy}>
                      By accessing and using AnimeScript Pro ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
                      The Platform provides an AI-powered studio environment for autonomous anime and manga generation. 
                      Protocol link initialization confirms your total agreement with all listed nodes.
                   </p>
                </div>
             </section>

             {/* NODE L2 */}
             <section id="NODE-L2" className={s.termsSection}>
                <div className={s.termsSectionDecor}>
                   <FileText className={s.termsSectionIllustration} />
                </div>
                <div className={s.termsSectionBlock}>
                   <div className={s.termsSectionMeta}>
                      <div className={s.termsSectionDot} />
                      <span className={s.termsSectionTag}>NODE-L2</span>
                   </div>
                   <h2 className={s.termsSectionHeading}>Content Ownership & Rights</h2>
                   <div className={s.termsSectionGroup}>
                      <p className={s.termsSectionCopy}>
                         Users retain all rights, title, and interest in and to their original prompts and directives.
                         For users on a paid tier, all generated images and assets belong entirely to the user for commercial and non-commercial use.
                      </p>
                      <div className={s.termsSubCard}>
                         <span className={s.termsSubBadge}>Free Tier Restriction</span>
                         <p className={s.termsSubText}>
                            Users on the Aspirant tier are granted a non-exclusive license for personal use only. Commercialization requires Architect or Master protocol.
                         </p>
                      </div>
                   </div>
                </div>
             </section>

             {/* NODE L3 */}
             <section id="NODE-L3" className={s.termsSection}>
                <div className={s.termsSectionDecor}>
                   <AlertTriangle className={s.termsSectionIllustration} />
                </div>
                <div className={s.termsSectionBlock}>
                   <div className={s.termsSectionMeta}>
                      <div className={s.termsSectionDot} />
                      <span className={s.termsSectionTag}>NODE-L3</span>
                   </div>
                   <h2 className={s.termsSectionHeading}>Acceptable Use Policy</h2>
                   <div className={s.termsSectionGroupLarge}>
                      <p className={s.termsSectionCopy}>
                         You agree not to use the Platform to generate directives that violate the following protocols:
                      </p>
                      <div className={s.policyGrid}>
                         {[
                           "Illegal Content Or Imagery",
                           "IP Infringement Nodes",
                           "Defamatory Directives",
                           "Sensitive Political Content",
                           "NSFW Production Filter Bypass",
                           "Automated Scraper Protocols"
                         ].map((policy, i) => (
                           <div key={i} className={s.policyItem}>
                              <div className={s.policyDot} />
                              <span className={s.policyText}>{policy}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </section>

             {/* 4. PROTOCOL ACCEPTANCE */}
             <div className={s.termsAcceptCard}>
                <div className={s.termsAcceptOverlay} />
                <div className={s.termsAcceptHero}>
                      <div className={s.termsAcceptBadge}>
                         <Zap className={s.termsAcceptBadgeIcon} />
                      </div>
                      <h3 className={s.termsAcceptTitle}>Confirm Protocols</h3>
                </div>
                <p className={s.termsAcceptDescription}>
                   By clicking below, you confirm your synchronization with all listed legal nodes and production protocols.
                </p>
                <Button 
                  onClick={() => navigate('/login')}
                  className={s.protocolAcceptButton}
                >
                   ACCEPT PROTOCOLS <ArrowRight className={s.buttonIcon} />
                </Button>
             </div>

             {/* SYSTEM FOOTER */}
             <footer className={s.termsFooter}>
                <div className={s.termsFooterRow}>
                   <div className={s.termsFooterMeta}>
                      <ShieldCheck className={s.termsFooterVerifiedIcon} />
                      <span>Verified Legal Hash: #ASP-8842-X</span>
                   </div>
                   <div className={s.termsFooterDivider} />
                   <span>Compliant with Global AI Standards</span>
                </div>
                <div className={s.termsFooterLinks}>
                   <a href="#" className={s.termsFooterLink}>Terms of Service</a>
                   <a href="#" className={s.termsFooterLink}>Cookie Protocol</a>
                </div>
             </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
