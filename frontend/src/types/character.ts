export interface EmotionalTriggers {
  喜悦: string[];
  愤怒: string[];
  悲伤: string[];
}

export interface CharacterCore {
  name: string;
  archetype: string;
  voice: string;
  core_memory: string;
  desire: string;
  fear: string;
}

export interface CharacterLayers {
  surface: string;
  intimate: string;
  under_stress: string;
}

export interface CharacterDynamics {
  emotional_triggers: EmotionalTriggers;
  growth_arc: string;
  relationship_patterns: string;
}

export interface CharacterData {
  core: CharacterCore;
  layers: CharacterLayers;
  dynamics: CharacterDynamics;
}

export interface Character {
  id: string;
  name: string;
  author_id: string;
  character_data: CharacterData;
  is_public: boolean;
  tags: string[];
  fork_from: string | null;
  created_at: string;
  updated_at: string;
}

export interface CharacterCreate {
  name: string;
  character_data: CharacterData;
  is_public: boolean;
  tags: string[];
}

export interface CharacterUpdate {
  name?: string;
  character_data?: CharacterData;
  is_public?: boolean;
  tags?: string[];
}

export interface PreviewResponse {
  character_name: string;
  user_message: string;
  response: string;
  mode: string;
}

export interface ForkChainItem {
  id: string;
  name: string;
  author_id: string;
  created_at: string;
  is_current: boolean;
}

export interface ForkChain {
  original_id: string;
  original_name: string;
  total_forks: number;
  chain: ForkChainItem[];
}

export interface ForkRequest {
  new_name?: string;
  author_id?: string;
}