import { create } from 'zustand';

export const useWorkspaceStore = create((set) => ({
  selectedFile: null,
  activeTab: null,
  openFiles: [],
  panelSizes: [20, 55, 25], // resizable panels defaults: [Explorer, Editor, Preview/Chat]
  terminalLogs: [],
  isTerminalBooted: false,
  collaborators: [],
  collaboratorCursors: {}, // { [userId]: { cursorLine, cursorChar, email } }

  setSelectedFile: (file) => set({ selectedFile: file }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setOpenFiles: (files) => set({ openFiles: files }),
  addOpenFile: (file) => set((state) => {
    if (state.openFiles.includes(file)) {
      return { selectedFile: file };
    }
    return { 
      openFiles: [...state.openFiles, file],
      selectedFile: file 
    };
  }),
  closeOpenFile: (file) => set((state) => {
    const newOpenFiles = state.openFiles.filter((f) => f !== file);
    let newSelected = state.selectedFile;
    if (state.selectedFile === file) {
      newSelected = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
    }
    return {
      openFiles: newOpenFiles,
      selectedFile: newSelected
    };
  }),
  setPanelSizes: (sizes) => set({ panelSizes: sizes }),
  addTerminalLog: (log) => set((state) => ({ 
    terminalLogs: [...state.terminalLogs, log] 
  })),
  clearTerminalLogs: () => set({ terminalLogs: [] }),
  setTerminalBooted: (isBooted) => set({ isTerminalBooted: isBooted }),
  setCollaborators: (collabs) => set({ collaborators: collabs }),
  updateCollaboratorCursor: (userId, cursorData) => set((state) => ({
    collaboratorCursors: {
      ...state.collaboratorCursors,
      [userId]: cursorData
    }
  })),
  removeCollaboratorCursor: (userId) => set((state) => {
    const updated = { ...state.collaboratorCursors };
    delete updated[userId];
    return { collaboratorCursors: updated };
  })
}));
