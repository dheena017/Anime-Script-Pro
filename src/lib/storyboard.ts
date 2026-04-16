import type { Scene } from '@/components/studio/storyboard/types';

export function parseStoryboard(script: string | null): Scene[] {
  if (!script) return [];
  const lines = script.split('\n');
  const tableLines = lines.filter((line) => line.includes('|') && !line.includes('---'));
  if (tableLines.length <= 1) return [];

  return tableLines.slice(1).map((row, idx) => {
    const cells = row
      .split('|')
      .filter((cell) => cell.trim() !== '')
      .map((cell) => cell.trim());

    return {
      id: `scene-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      originalIndex: idx,
      section: cells[0] || '',
      narration: cells[1] || '',
      visuals: cells[2] || '',
      sound: cells[3] || '',
    };
  });
}

export function calculateSceneDuration(narration: string): number {
  const words = narration.split(' ').length;
  return Math.max(3, Math.ceil(words / 2.5) + 2);
}

export function buildUpdatedStoryboardMarkdown(generatedScript: string | null, items: Scene[]): string | null {
  if (!generatedScript) return null;

  const lines = generatedScript.split('\n');
  const tableHeaderIndex = lines.findIndex((line) => line.includes('|') && line.toLowerCase().includes('section'));
  if (tableHeaderIndex === -1) return null;

  const preTable = lines.slice(0, tableHeaderIndex + 2);
  let tableEndIndex = tableHeaderIndex + 2;
  while (tableEndIndex < lines.length && lines[tableEndIndex].includes('|')) tableEndIndex++;
  const postTable = lines.slice(tableEndIndex);

  const newTableRows = items.map(
    (scene) => `| ${scene.section} | ${scene.narration} | ${scene.visuals} | ${scene.sound} |`
  );

  return [...preTable, ...newTableRows, ...postTable].join('\n');
}

export function getStoryboardStatusColor(status: string): string {
  switch (status) {
    case 'Revision':
      return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
    case 'Ready':
      return 'text-purple-500 border-purple-500/20 bg-purple-500/10';
    case 'Completed':
      return 'text-green-500 border-green-500/20 bg-green-500/10';
    default:
      return 'text-zinc-500 border-zinc-500/20 bg-zinc-500/5';
  }
}
