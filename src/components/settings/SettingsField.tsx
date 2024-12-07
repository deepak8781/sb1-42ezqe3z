import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface SettingsFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SettingsField({ label, value, onChange, placeholder }: SettingsFieldProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={label}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showSaved && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}