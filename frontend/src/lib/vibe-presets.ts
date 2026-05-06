export interface VibePreset {
  id: string;
  name: string;
  camera: string;
  lighting: string;
  colorGrading: string;
  styleParams: string;
}

export const VIBE_LIBRARY: Record<string, VibePreset> = {
  "ufotable-noir": {
    id: "ufotable-noir",
    name: "Ufotable Noir",
    camera: "Dynamic tracking, extreme low angle, sharp focus",
    lighting: "High contrast, volumetric shadows, electric highlights",
    colorGrading: "Deep blacks, saturated primary accents, teal shadows",
    styleParams: "Crisp lines, digital polish, lens flares"
  },
  "mappa-brutalist": {
    id: "mappa-brutalist",
    name: "Mappa Brutalist",
    camera: "Handheld shake, rapid cuts, close-up grit",
    lighting: "Harsh daylight, realistic shadows, bloom effects",
    colorGrading: "Muted earth tones, high grain, filmic contrast",
    styleParams: "Rough edges, character pain focus, realistic hair"
  },
  "shaft-geometry": {
    id: "shaft-geometry",
    name: "Shaft Geometry",
    camera: "Tilted head, abstract framing, 90-degree switches",
    lighting: "Flat artistic lighting, neon gradients",
    colorGrading: "Dreamy pastels, high saturation, monochrome backgrounds",
    styleParams: "Minimalist environments, symbolic imagery, smooth motion"
  }
};



