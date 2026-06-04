import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0a0f 100%)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px 24px',
  borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
  background: 'rgba(139, 92, 246, 0.04)',
  backdropFilter: 'blur(12px)',
};

const iconWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  background: 'rgba(139, 92, 246, 0.15)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
};

const titleStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 900,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(139, 92, 246, 0.9)',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 500,
  letterSpacing: '0.1em',
  color: 'rgba(255,255,255,0.3)',
  marginTop: '1px',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  overflow: 'hidden',
};

const loadingStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 20px',
  fontSize: '10px',
  fontWeight: 900,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(139, 92, 246, 0.4)',
};

export function ModelsManagementLayout() {
  const location = useLocation();

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle} className="studio-module-header">
        <div style={iconWrapStyle}>
          <Cpu size={16} color="rgba(139, 92, 246, 0.9)" />
        </div>
        <div>
          <div style={titleStyle}>Models_Management</div>
          <div style={subtitleStyle}>AI Provider Registry &amp; Configuration</div>
        </div>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Suspense fallback={<div style={loadingStyle}>Loading...</div>}>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ModelsManagementLayout;
