import React from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../lib/supabase/auth/context';
import { useAuthStore } from '../../store/useAuthStore';

export function SignInButton() {
  const { signInWithGoogle } = useAuth();
  const { isLoading } = useAuthStore();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogIn className="w-4 h-4 mr-2" />
      {isLoading ? 'Signing in...' : 'Sign In'}
    </button>
  );
}