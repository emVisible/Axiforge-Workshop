import { create } from 'zustand';

export type EditorPanel = 'core' | 'layers' | 'dynamics';
export type Theme = 'light' | 'dark';

interface UIState {
  activePanel: EditorPanel;
  isPreviewOpen: boolean;
  isSidebarOpen: boolean;
  theme: Theme;

  setActivePanel: (panel: EditorPanel) => void;
  togglePreview: () => void;
  setPreviewOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activePanel: 'core',
  isPreviewOpen: false,
  isSidebarOpen: true,
  theme: 'light',

  setActivePanel: (panel) => set({ activePanel: panel }),

  togglePreview: () => set((state) => ({ isPreviewOpen: !state.isPreviewOpen })),

  setPreviewOpen: (open) => set({ isPreviewOpen: open }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setTheme: (theme) => set({ theme }),
}));