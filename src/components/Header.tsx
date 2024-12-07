import React from 'react';
import { Settings, Database } from 'lucide-react';
import { useStore } from '../store/useStore';
import { UserMenu } from './auth/UserMenu';
import { SignInButton } from './auth/SignInButton';
import { AuthModal } from './auth/AuthModal';
import { CVPotModal } from './cvpot/CVPotModal';
import { useAuthStore } from '../store/useAuthStore';

export function Header() {
  const { showSettings, setShowSettings } = useStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showCVPotModal, setShowCVPotModal] = React.useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/neev-logo.svg" alt="NeevJob Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-900">NeevJob</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowCVPotModal(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="CV Pot"
                >
                  <Database className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <SignInButton onClick={() => setShowAuthModal(true)} />
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <CVPotModal
        isOpen={showCVPotModal}
        onClose={() => setShowCVPotModal(false)}
      />
    </header>
  );
}