import { create } from 'zustand';
import type { CharacterData } from '@/types/character';

export const emptyCharacterData: CharacterData = {
  core: {
    name: '',
    archetype: '',
    voice: '',
    core_memory: '',
    desire: '',
    fear: '',
  },
  layers: {
    surface: '',
    intimate: '',
    under_stress: '',
  },
  dynamics: {
    emotional_triggers: {
      喜悦: [],
      愤怒: [],
      悲伤: [],
    },
    growth_arc: '',
    relationship_patterns: '',
  },
};

interface EditorState {
  draft: CharacterData | null;
  isDirty: boolean;
  lastSaved: Date | null;
  currentCharacterId: string | null;

  setDraft: (draft: CharacterData, characterId?: string) => void;
  updateField: (path: string, value: any) => void;
  addEmotionTrigger: (emotion: '喜悦' | '愤怒' | '悲伤', trigger: string) => void;
  removeEmotionTrigger: (emotion: '喜悦' | '愤怒' | '悲伤', index: number) => void;
  markClean: () => void;
  reset: () => void;
}

function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.');
  const newObj = JSON.parse(JSON.stringify(obj));
  let current = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
  return newObj;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  draft: null,
  isDirty: false,
  lastSaved: null,
  currentCharacterId: null,

  setDraft: (draft, characterId) =>
    set({ draft, isDirty: false, lastSaved: null, currentCharacterId: characterId }),

  updateField: (path, value) => {
    const currentDraft = get().draft;
    if (!currentDraft) return;

    const newDraft = setNestedValue(currentDraft, path, value);
    set({ draft: newDraft, isDirty: true });
  },

  addEmotionTrigger: (emotion, trigger) => {
    const currentDraft = get().draft;
    if (!currentDraft) return;

    const newDraft = JSON.parse(JSON.stringify(currentDraft));
    newDraft.dynamics.emotional_triggers[emotion].push(trigger);
    set({ draft: newDraft, isDirty: true });
  },

  removeEmotionTrigger: (emotion, index) => {
    const currentDraft = get().draft;
    if (!currentDraft) return;

    const newDraft = JSON.parse(JSON.stringify(currentDraft));
    newDraft.dynamics.emotional_triggers[emotion].splice(index, 1);
    set({ draft: newDraft, isDirty: true });
  },

  markClean: () => set({ isDirty: false, lastSaved: new Date() }),

  reset: () =>
    set({ draft: null, isDirty: false, lastSaved: null, currentCharacterId: null }),
}));