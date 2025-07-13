'use client';

import React from 'react';
import { usePluginStore } from '@/stores/pluginStore';

const PluginManager = () => {
  const { plugins, addPlugin } = usePluginStore();

  const handleLoadPlugin = () => {
    // Logic to load plugin from file or URL
    // For example, prompt for JSON
    const pluginData = prompt('Enter plugin JSON:');
    if (pluginData) {
      const plugin = JSON.parse(pluginData);
      addPlugin(plugin);
    }
  };

  return (
    <div className="plugin-manager p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Plugin Manager</h2>
      <button onClick={handleLoadPlugin} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-4">Load Plugin</button>
      <ul>
        {plugins.map((plugin) => (
          <li key={plugin.id} className="mb-2">{plugin.name} ({plugin.type})</li>
        ))}
      </ul>
    </div>
  );
};

export default PluginManager; 