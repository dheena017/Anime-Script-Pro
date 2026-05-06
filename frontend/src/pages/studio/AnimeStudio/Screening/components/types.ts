export interface RenderPhase {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done';
}

export interface Scene {
  id: string;
  scene_number: number;
  status: string;
  script: string;
}



