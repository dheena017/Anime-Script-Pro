export type HighlightKind =
  | 'heading'
  | 'character'
  | 'dialogue'
  | 'table-heading'
  | 'table-dialogue'
  | 'table-scene'
  | 'table-sound'
  | 'plain';

const LORE_STOP_WORDS = new Set([
  'Hook',
  'Intro',
  'Rising',
  'Action',
  'Climax',
  'Conclusion',
  'Outro',
  'Section',
  'Voiceover',
  'Narration',
  'Visual',
  'Scene',
  'Description',
  'Sound',
  'Effect',
  'BGM',
  'Anime',
  'Script',
  'Production',
  'Generated',
  'Character',
  'Characters',
  'Location',
  'Locations',
  'The',
  'A',
  'An',
  'And',
  'Or',
  'But',
  'With',
  'From',
  'Into',
  'Of',
  'To',
  'For',
  'In',
  'On',
  'At',
  'By',
]);

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractLoreCandidates(text: string) {
  const matches = text.match(/\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}|[A-Z]{2,})\b/g) ?? [];
  const candidates = Array.from(
    new Set(
      matches
        .map((match) => match.trim())
        .filter((match) => match.length > 2)
        .filter((match) => !LORE_STOP_WORDS.has(match))
    )
  );
  return candidates.slice(0, 6);
}

export function getHighlightKind(line: string): HighlightKind {
  const trimmed = line.trim();

  if (/^\|\s*Section\s*\|/i.test(trimmed)) return 'table-heading';
  if (/^\|\s*Voiceover/i.test(trimmed) || /^\|\s*Narration/i.test(trimmed)) return 'table-dialogue';
  if (/^\|\s*Visual/i.test(trimmed) || /^\|\s*Scene/i.test(trimmed)) return 'table-scene';
  if (/^\|\s*Sound/i.test(trimmed) || /^\|\s*BGM/i.test(trimmed)) return 'table-sound';
  if (/^\|/.test(trimmed)) return 'plain';
  if (/^(INT\.|EXT\.|EST\.|INT\/.+EXT\.)/i.test(trimmed)) return 'heading';
  if (/^[A-Z][A-Z0-9 _'-]{2,}:?$/.test(trimmed)) return 'character';
  if (/^[-–—]/.test(trimmed) || /^\s{2,}/.test(line)) return 'dialogue';

  return 'plain';
}

export function extractDialogueLines(script: string): string[] {
  const lines = script.split('\n');
  const tableRows = lines.filter((line) => line.includes('|') && !line.includes('---'));
  const fromTable = tableRows
    .slice(1)
    .map((row) => row.split('|').filter((cell) => cell.trim() !== '').map((cell) => cell.trim())[1] || '')
    .map((line) => line.replace(/`|\*|_/g, '').trim())
    .filter(Boolean);

  if (fromTable.length > 0) {
    return fromTable;
  }

  const spokenLines = lines
    .map((line) => line.trim())
    .filter((line) => /^[A-Z][A-Z\s'-]{2,}:\s+/.test(line) || /^".+"$/.test(line));
  return spokenLines;
}

export function calculateDuration(text: string | null): string {
  if (!text) return "0:00";
  const words = text.split(/\s+/).length;
  const minutes = Math.floor(words / 150);
  const seconds = Math.floor((words % 150) / (150 / 60));
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getCharacterStats(script: string) {
  const dialogueLines = extractDialogueLines(script);
  const stats: Record<string, number> = {};

  dialogueLines.forEach(line => {
    const match = line.match(/^([A-Z][A-Z\s'-]+):/);
    if (match) {
      const char = match[1].trim();
      stats[char] = (stats[char] || 0) + 1;
    }
  });

  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

export type SentimentTone = 'action' | 'sad' | 'comedy' | 'plain';

export function analyzeSentimentMap(script: string): SentimentTone[] {
  const lines = script.split('\n').filter(l => l.trim().length > 0);
  
  return lines.map(line => {
    const l = line.toLowerCase();
    
    // Action: Explosion, Fight, Slam, Run, Fast
    if (l.includes('fight') || l.includes('explosion') || l.includes('slam') || l.includes('attack') || l.includes('dash') || l.includes('clash')) {
      return 'action';
    }
    
    // Sad/Slow: Tears, Cry, Silence, Soft, Dark
    if (l.includes('tears') || l.includes('cry') || l.includes('whisper') || l.includes('silence') || l.includes('alone') || l.includes('sad')) {
      return 'sad';
    }
    
    // Comedy: Laugh, Silly, Joke, Funny, Grin
    if (l.includes('laugh') || l.includes('silly') || l.includes('joke') || l.includes('funny') || l.includes('grin') || l.includes('awkward')) {
      return 'comedy';
    }
    
    return 'plain';
  });
}

export function extractDirectorNotes(script: string): string[] {
  const matches = script.match(/\[\[Note:\s*(.*?)\]\]/gi) ?? [];
  return matches.map(m => m.replace(/\[\[Note:\s*/i, '').replace(/\]\]/, '').trim());
}

export interface Beat {
  id: string;
  label: string;
  lineIndex: number;
}

export function detectBeats(script: string): Beat[] {
  const lines = script.split('\n');
  const beats: Beat[] = [];
  
  const beatKeywords = [
    { label: 'Hook', pattern: /hook/i },
    { label: 'Recap', pattern: /recap|intro/i },
    { label: 'Rising Action', pattern: /rising/i },
    { label: 'Climax', pattern: /climax/i },
    { label: 'Conclusion', pattern: /conclusion|outro/i },
  ];

  lines.forEach((line, idx) => {
    // Check headings or table sections
    beatKeywords.forEach(kb => {
      if (kb.pattern.test(line) && (line.includes('#') || line.includes('|'))) {
        // Only add if not already added
        if (!beats.find(b => b.label === kb.label)) {
          beats.push({
            id: `beat-${idx}`,
            label: kb.label,
            lineIndex: idx
          });
        }
      }
    });
  });

  return beats;
}
