import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/useAuthStore';
import { decodeGoogleCredential, createUserFromGoogle, handleAuthError } from '../../lib/auth/utils';
import { googleConfig } from '../../lib/auth/config';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const signIn = useAuthStore((state) => state.signIn);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSuccess = async (response: { credential: string }) => {
    try {
      setError(null);
      const decoded = decodeGoogleCredential(response.credential);
      const user = createUserFromGoogle(decoded);
      signIn(user);
      onClose();
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Sign in to NeevJob</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <p className="text-gray-600 text-center">
            Sign in to access resume assessment features
          </p>

          {error && (
            <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Login failed. Please try again.')}
              useOneTap={false}
              type="standard"
              theme="filled_blue"
              text="signin_with"
              shape="rectangular"
              width={250}
              context="signin"
              {...googleConfig}
            />
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}