export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  traits: string[];
  visualSpecs: string;
  relationships: Record<string, string>;
  voiceId?: string;
  imageUrl?: string;
}

export function parseCharacterData(markdown: string): Character[] {
  if (!markdown) return [];
  
  // Basic parsing logic for markdown headings or lists
  const characters: Character[] = [];
  const sections = markdown.split(/##\s+/).slice(1);

  sections.forEach((section, idx) => {
    const lines = section.split('\n');
    const name = lines[0].trim();
    const rest = lines.slice(1).join('\n');
    
    const roleMatch = rest.match(/Role:\s*(.*)/i);
    const descMatch = rest.match(/Description:\s*(.*)/i);
    const traitsMatch = rest.match(/Traits:\s*(.*)/i);
    
    characters.push({
      id: `char-${idx}`,
      name,
      role: roleMatch ? roleMatch[1].trim() : 'Unknown',
      description: descMatch ? descMatch[1].trim() : 'No description provided.',
      traits: traitsMatch ? traitsMatch[1].split(',').map(t => t.trim()) : [],
      visualSpecs: section.includes('Visual') ? section.split('Visual')[1].split('\n')[0].trim() : '',
      relationships: {},
    });
  });

  return characters;
}
