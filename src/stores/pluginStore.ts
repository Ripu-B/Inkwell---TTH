import { create } from 'zustand';

type Plugin = { id: string; name: string; type: string; assets: any };

type PluginState = {
  plugins: Plugin[];
  addPlugin: (plugin: Plugin) => void;
};

export const usePluginStore = create<PluginState>((set) => ({
  plugins: [],
  addPlugin: (plugin) => set((state) => ({ plugins: [...state.plugins, plugin] })),
})); 