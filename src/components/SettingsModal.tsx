import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SettingsField } from './settings/SettingsField';
import { useAuthStore } from '../store/useAuthStore';

export function SettingsModal() {
  const { 
    showSettings, 
    setShowSettings, 
    apiKey, 
    setApiKey,
    agencyName,
    setAgencyName,
    logoText,
    setLogoText
  } = useStore();

  const { isAuthenticated } = useAuthStore();

  if (!showSettings || !isAuthenticated) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            <SettingsField
              label="Logo Text"
              value={logoText}
              onChange={setLogoText}
              placeholder="Enter logo text"
            />
            
            <SettingsField
              label="Agency Name"
              value={agencyName}
              onChange={setAgencyName}
              placeholder="Enter agency name"
            />

            <div className="space-y-1">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                OpenAI API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey || ''}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sk-..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Your API key will be stored locally and never shared.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}