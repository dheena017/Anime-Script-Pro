export interface ParsedScene {
  sceneNum: number;
  section: string;
  soulFocus: string;
  narration: string;
  visualDirection: string;
  vfxCompounds: string;
  audioForge: string;
  emotionalKey: string;
  subtext: string;
  activeAssetList: string;
  time: string;
  videoPrompt?: string;
  imagePrompt?: string;
}

export function parseScriptTable(scriptText: string | null): ParsedScene[] {
  if (!scriptText) return [];
  
  const lines = scriptText.split('\n').filter(l => l.includes('|') && !l.includes('---'));
  if (lines.length < 2) return [];
  
  // Parse rows
  const parsed: ParsedScene[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    if (cells.length === 0 || isNaN(Number(cells[0]))) continue;
    
    // Default indices based on the prompt specification:
    // 0: Scene #, 1: Section, 2: Soul Focus, 3: Narration, 4: Visual Direction, 5: VFX Compounds, 6: Audio Forge, 7: Emotional Key, 8: Subtext, 9: Active Asset List, 10: Time, 11: Video Prompt, 12: Image Prompt
    parsed.push({
      sceneNum: Number(cells[0]) || i,
      section: cells[1] || 'Scene',
      soulFocus: cells[2] || 'Unknown',
      narration: cells[3] || '',
      visualDirection: cells[4] || '',
      vfxCompounds: cells[5] || '',
      audioForge: cells[6] || '',
      emotionalKey: cells[7] || 'Neutral',
      subtext: cells[8] || '',
      activeAssetList: cells[9] || '',
      time: cells[10] || '0:00',
      videoPrompt: cells[11] || '',
      imagePrompt: cells[12] || ''
    });
  }
  
  return parsed;
}

// Extract speaking characters, line counts, tones, and featured lines
export interface CharacterDialogue {
  name: string;
  lines: number;
  tone: string;
  featuredLine: string;
  sceneNum: number;
}

export function getDialogueMatrix(parsedScenes: ParsedScene[]): CharacterDialogue[] {
  const charactersMap: Record<string, { lines: number; tones: Record<string, number>; linesList: { text: string; scene: number }[] }> = {};
  
  parsedScenes.forEach(scene => {
    const name = scene.soulFocus.trim();
    if (!name || name.toLowerCase() === 'unknown' || name.toLowerCase() === 'none' || name.toLowerCase() === 'system') {
      return;
    }
    
    // Clean Narration to extract tone in parentheses and featured line
    const toneMatch = scene.narration.match(/\(([^)]+)\)/);
    const extractedTone = toneMatch ? toneMatch[1] : scene.emotionalKey;
    const lineCleaned = scene.narration
      .replace(/\[[^\]]+\]/g, '') // remove [DSP] tags
      .replace(/\([^)]+\)/g, '')   // remove (Tone) parens
      .trim();
    
    if (!charactersMap[name]) {
      charactersMap[name] = {
        lines: 0,
        tones: {},
        linesList: []
      };
    }
    
    charactersMap[name].lines += 1;
    charactersMap[name].tones[extractedTone] = (charactersMap[name].tones[extractedTone] || 0) + 1;
    if (lineCleaned) {
      charactersMap[name].linesList.push({ text: lineCleaned, scene: scene.sceneNum });
    }
  });
  
  return Object.keys(charactersMap).map(name => {
    const entry = charactersMap[name];
    
    // Find the most frequent tone
    let primaryTone = 'Determined';
    let maxCount = 0;
    Object.keys(entry.tones).forEach(tone => {
      if (entry.tones[tone] > maxCount) {
        maxCount = entry.tones[tone];
        primaryTone = tone;
      }
    });
    
    // Select the best featured line (longest one usually has the most dramatic flair)
    let bestLine = '...';
    let sceneNum = 1;
    if (entry.linesList.length > 0) {
      const sortedLines = [...entry.linesList].sort((a, b) => b.text.length - a.text.length);
      bestLine = sortedLines[0].text;
      sceneNum = sortedLines[0].scene;
    }
    
    return {
      name,
      lines: entry.lines,
      tone: primaryTone,
      featuredLine: bestLine.startsWith('"') ? bestLine : `"${bestLine}"`,
      sceneNum
    };
  });
}

// Calculate emotional intensity per scene
export function getSceneIntensity(scene: ParsedScene): number {
  let intensity = 50;
  const emotionalKey = scene.emotionalKey.toLowerCase();
  const section = scene.section.toLowerCase();
  const visuals = scene.visualDirection.toLowerCase();
  const audio = scene.audioForge.toLowerCase();
  
  if (
    emotionalKey.includes('climax') || 
    emotionalKey.includes('peak') || 
    emotionalKey.includes('domination') ||
    section.includes('zenith') ||
    visuals.includes('climax')
  ) {
    intensity = 95 + Math.floor(Math.random() * 5); // 95-100
  } else if (
    emotionalKey.includes('threat') || 
    emotionalKey.includes('crisis') || 
    emotionalKey.includes('tension') ||
    emotionalKey.includes('urgent') ||
    section.includes('impact') ||
    audio.includes('screech')
  ) {
    intensity = 78 + Math.floor(Math.random() * 12); // 78-90
  } else if (
    emotionalKey.includes('resolution') || 
    emotionalKey.includes('release') || 
    section.includes('afterglow')
  ) {
    intensity = 40 + Math.floor(Math.random() * 12); // 40-52
  } else if (
    emotionalKey.includes('melancholy') || 
    section.includes('genesis') ||
    visuals.includes('walking')
  ) {
    intensity = 55 + Math.floor(Math.random() * 10); // 55-65
  } else {
    // Math curve as a fallback
    intensity = 45 + Math.round(Math.sin(scene.sceneNum * 0.8) * 25) + Math.floor(Math.random() * 10);
  }
  
  return Math.min(100, Math.max(20, intensity));
}

// Dynamic Analysis Calculations
export function getScriptAnalysis(parsedScenes: ParsedScene[]) {
  if (parsedScenes.length === 0) {
    return {
      avgTension: 'N/A',
      narrativeArc: 'N/A',
      emotionalBias: 'N/A',
      intensities: []
    };
  }
  
  const intensities = parsedScenes.map(scene => getSceneIntensity(scene));
  const avgTension = Math.round(intensities.reduce((a, b) => a + b, 0) / intensities.length);
  
  // Count emotional keys
  const emotionCounts: Record<string, number> = {};
  parsedScenes.forEach(s => {
    const key = s.emotionalKey.trim();
    if (key) {
      emotionCounts[key] = (emotionCounts[key] || 0) + 1;
    }
  });
  
  let emotionalBias = 'Neutral';
  let maxCount = 0;
  Object.keys(emotionCounts).forEach(k => {
    if (emotionCounts[k] > maxCount) {
      maxCount = emotionCounts[k];
      emotionalBias = k;
    }
  });
  
  // Determine Narrative Arc style based on peak intensity and final scene
  let narrativeArc = 'Action-Driven Pacing';
  const peakIndex = intensities.indexOf(Math.max(...intensities));
  const finalIntensity = intensities[intensities.length - 1];
  
  if (peakIndex === intensities.length - 1) {
    narrativeArc = 'Rising Climax Arc';
  } else if (peakIndex > intensities.length / 2 && finalIntensity < 60) {
    narrativeArc = 'Classic Hero Journey';
  } else if (avgTension > 75) {
    narrativeArc = 'High-Octane Thriller';
  } else if (avgTension < 55) {
    narrativeArc = 'Slow-Burn Drama';
  } else {
    narrativeArc = 'Balanced Exposition';
  }
  
  return {
    avgTension: `${avgTension}%`,
    narrativeArc,
    emotionalBias,
    intensities
  };
}

// Extract visual prompt metadata from parsed scenes
export interface PromptBlueprint {
  sceneNum: number;
  soulFocus: string;
  videoPrompt: string;
  imagePrompt: string;
}

export function getPromptBlueprints(parsedScenes: ParsedScene[]): PromptBlueprint[] {
  return parsedScenes.map(scene => ({
    sceneNum: scene.sceneNum,
    soulFocus: scene.soulFocus,
    videoPrompt: scene.videoPrompt || '',
    imagePrompt: scene.imagePrompt || ''
  }));
}
