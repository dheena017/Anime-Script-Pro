import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Send, 
  Globe, 
  Zap, 
  CheckCircle2, 
  Activity,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { marketingStyles as s } from './marketingStyles';

const SUPPORT_NODES = [
  { location: 'Tokyo Sector', lat: '35.6895° N', status: 'Optimal' },
  { location: 'L.A. Sector', lat: '34.0522° N', status: 'Optimal' },
  { location: 'London Sector', lat: '51.5074° N', status: 'Maintenance' },
];

const CATEGORIES = ['Technical Support', 'Billing', 'Partnership', 'General Inquiry'];

export function ContactPage() {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Technical Support');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    
    // Simulate Neural Link established
    setTimeout(() => {
      setIsTransmitting(false);
      setIsConfirmed(true);
      setTimeout(() => setIsConfirmed(false), 5000);
    }, 2000);
  };

  return (
    <div className={s.pageAlt}>
      {/* Background Decor */}
      <div className={s.decorTop} />
      <div className={s.decorBottom} />

      <div className={s.wrapper}>
        
        {/* 1. HEADER PROTOCOL */}
        <div className={s.sectionHeaderAlt}>
           <div className={s.heroBadge}>
              <Activity className={s.contactHeroIcon} />
              <span className={s.heroBadgeText}>Support Command Center</span>
           </div>
           <h1 className={s.pageTitleAlt}>Initialize <span className={s.pageTitleAccent}>Contact</span></h1>
           <p className={s.pageDescriptionAlt}>
             Direct uplink to the AnimeScript Pro engineering team. Transmission latency optimized for 24/7 global support.
           </p>
        </div>

        {/* 2. COMMUNICATION NODES */}
        <div className={s.nodeGrid}>
          {[
            { icon: Mail, label: 'Email Protocol', value: 'support@animescript.pro', sub: '2hr Avg Response' },
            { icon: MessageSquare, label: 'Discord Node', value: 'Join Community', sub: 'Instant Support' },
            { icon: Phone, label: 'Enterprise Line', value: '1-800-ANIME-PRO', sub: 'High Priority Only' }
          ].map((node, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={s.nodeCard}
            >
              <div className={s.nodeCardDecor}>
                 <node.icon className={s.nodeCardDecorIcon} />
              </div>
              <node.icon className={s.nodeIcon} />
              <div className={s.nodeCardBody}>
                 <h3 className={s.nodeCardLabel}>{node.label}</h3>
                 <p className={s.nodeCardValue}>{node.value}</p>
                 <div className={s.nodeCardMeta}>
                    <Clock className={s.contactMetaIcon} />
                    <span className={s.nodeCardMetaText}>{node.sub}</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. TRANSMISSION FORM MATRIX */}
        <div className={s.gridPanel}>
           {/* LEFT: GLOBAL NODES */}
           <div className={s.sidebar}>
              <div className={s.sectionGroup}>
                 <h4 className={s.sectionSubtitle}>Active Support Hubs</h4>
                 <div className={s.hubList}>
                    {SUPPORT_NODES.map((hub, i) => (
                      <div key={i} className={s.hubCard}>
                         <div className={s.hubInfo}>
                            <Globe className={s.hubIcon} />
                            <div className={s.hubTextGroup}>
                               <span className={s.hubLocation}>{hub.location}</span>
                               <span className={s.hubLat}>{hub.lat}</span>
                            </div>
                         </div>
                         <div className={s.hubStatusRow}>
                            <div className={cn(s.statusDot, hub.status === 'Optimal' ? s.statusOptimal : s.statusWarning)} />
                            <span className={s.hubStatusText}>{hub.status}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className={s.helpCard}>
                 <div className={s.helpCardTitle}>
                    <Zap className={s.helpCardIcon} />
                    <span className={s.helpCardHeading}>Protocol Sync</span>
                 </div>
                 <p className={s.helpCardText}>
                    All support transmissions are encrypted via neural-link protocols and prioritized by architect tier level.
                 </p>
              </div>
           </div>

           {/* RIGHT: FORM */}
           <div className={s.formPanel}>
              <div className={s.formOverlay} />
              
              <form onSubmit={handleSubmit} className={s.form}>
                {/* DIRECTIVE CATEGORY SELECTOR */}
                <div className={s.formSection}>
                   <h4 className={s.formSectionTitle}>Directive Category</h4>
                   <div className={s.categoryButtonGroup}>
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            s.categoryButton,
                            selectedCategory === cat ? s.categoryActive : s.categoryInactive
                          )}
                        >
                           {cat}
                        </button>
                      ))}
                   </div>
                </div>

                <div className={s.formGrid}>
                  <div className={s.formField}>
                    <label className={s.formLabel}>Architect Name</label>
                    <Input required className={s.formInput} placeholder="ENTER NAME..." />
                  </div>
                  <div className={s.formField}>
                    <label className={s.formLabel}>Terminal Address</label>
                    <Input required type="email" className={s.formInput} placeholder="ARCHITECT@STUDIO.IO" />
                  </div>
                </div>

                <div className={s.formSection}>
                  <label className={s.formLabel}>Transmission Directive</label>
                  <textarea 
                    required 
                    rows={6} 
                    className={s.textarea} 
                    placeholder="DESCRIBE YOUR INQUIRY..." 
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isTransmitting}
                  className={cn(
                    s.submitButton,
                    isTransmitting ? s.submitButtonDisabled : s.submitButtonActive
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isTransmitting ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={s.submitButtonContent}>
                        <div className={s.submitSpinner} />
                        Transmitting...
                      </motion.div>
                    ) : isConfirmed ? (
                      <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn(s.submitButtonContent, "text-emerald-500")}>
                        <CheckCircle2 className={s.contactConfirmedIcon} /> Transmission Confirmed
                      </motion.div>
                    ) : (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={s.submitButtonContent}>
                        <Send className={s.contactSendIcon} /> Initialize Transmission
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;





