export interface LoreEntry {
  id: string;
  title: string;
  category: 'factions' | 'magic' | 'history' | 'rules';
  content: string;
}

export interface LocationEntry {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  seed: string;
}

export function parseLoreWiki(markdown: string): LoreEntry[] {
  if (!markdown) return [];
  const entries: LoreEntry[] = [];
  const sections = markdown.split(/##\s+/).slice(1);

  sections.forEach((section, idx) => {
    const lines = section.split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
    
    let category: LoreEntry['category'] = 'history';
    if (title.toLowerCase().includes('magic') || title.toLowerCase().includes('power')) category = 'magic';
    else if (title.toLowerCase().includes('faction') || title.toLowerCase().includes('group')) category = 'factions';
    else if (title.toLowerCase().includes('rule') || title.toLowerCase().includes('system')) category = 'rules';

    entries.push({ id: `lore-${idx}`, title, content, category });
  });

  return entries;
}

export function parseLocations(markdown: string): LocationEntry[] {
  if (!markdown) return [];
  const entries: LocationEntry[] = [];
  const matches = (markdown.match(/Location:\s*(.*?)(?=\n|$)/gi) || []) as string[];

  matches.forEach((match: string, idx) => {
    const name = match.replace(/Location:\s*/i, '').trim();
    entries.push({
      id: `loc-${idx}`,
      name,
      description: `A key setting in the series: ${name}`,
      seed: `WORLD-LOC-${name.toUpperCase().replace(/\s+/g, '-')}`,
    });
  });

  return entries;
}
