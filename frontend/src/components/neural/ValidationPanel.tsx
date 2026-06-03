import { useEffect, useState } from 'react';
import { AI_EVENTS } from '@/services/generators/core';

type ValidationDetail = {
  model: string;
  validation: any;
};

type TraceDetail = {
  model: string;
  trace: any;
};

export default function ValidationPanel() {
  const [latest, setLatest] = useState<ValidationDetail | null>(null);
  const [trace, setTrace] = useState<TraceDetail | null>(null);

  useEffect(() => {
    const onValidation = (e: Event) => {
      // @ts-ignore
      const d = e.detail;
      setLatest({ model: d.model, validation: d.validation });
    };
    const onTrace = (e: Event) => {
      // @ts-ignore
      const d = e.detail;
      setTrace({ model: d.model, trace: d.trace });
    };
    AI_EVENTS.addEventListener('ai_validation', onValidation as EventListener);
    AI_EVENTS.addEventListener('ai_context_trace', onTrace as EventListener);
    return () => {
      AI_EVENTS.removeEventListener('ai_validation', onValidation as EventListener);
      AI_EVENTS.removeEventListener('ai_context_trace', onTrace as EventListener);
    };
  }, []);

  return (
    <div style={{ padding: 12, fontSize: 13, fontFamily: 'Inter, Roboto, system-ui' }}>
      <h3 style={{ margin: '0 0 8px 0' }}>AI Validation</h3>
      {latest ? (
        <div>
          <div><strong>Model:</strong> {latest.model}</div>
          <div><strong>Score:</strong> {latest.validation?.score ?? '—'}</div>
          <div style={{ marginTop: 8 }}>
            <strong>Violations:</strong>
            <ul>
              {(latest.validation?.violations || []).map((v: any, i: number) => (
                <li key={i}>{v.rule} — {v.severity} — {v.message}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>No validation events yet.</div>
      )}

      <hr />
      <h4 style={{ margin: '8px 0' }}>Context Trace</h4>
      {trace ? (
        <div>
          <div><strong>World Lore:</strong> {trace.trace.worldLorePresent ? `${trace.trace.worldLoreLength} chars` : 'NONE'}</div>
          <div><strong>Cast DNA:</strong> {trace.trace.characterDNAPresent ? `${trace.trace.characterDNALength} chars` : 'NONE'}</div>
          <div><strong>Episode Plan:</strong> {trace.trace.episodePlanPresent ? `${trace.trace.episodePlanLength} chars` : 'NONE'}</div>
        </div>
      ) : (
        <div>No context trace yet.</div>
      )}
    </div>
  );
}
