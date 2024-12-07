import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../lib/supabase/auth/context';
import { useAuthStore } from '../../store/useAuthStore';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();
  const { user, isLoading } = useAuthStore();

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-2"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user.name.charAt(0)}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
          </button>
        </div>
      )}
    </div>
  );
}