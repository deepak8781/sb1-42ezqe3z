import type { User, GoogleCredential } from './types';
import { AUTH_ERROR_MESSAGES } from './constants';

export function decodeGoogleCredential(credential: string): GoogleCredential {
  try {
    const payload = credential.split('.')[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    throw new Error(AUTH_ERROR_MESSAGES.TOKEN_DECODE);
  }
}

export function createUserFromGoogle(credential: GoogleCredential): User {
  if (!credential.sub || !credential.name || !credential.email) {
    throw new Error(AUTH_ERROR_MESSAGES.MISSING_CREDENTIALS);
  }

  if (credential.email_verified === false) {
    throw new Error('Email verification required');
  }

  return {
    id: credential.sub,
    name: credential.name,
    email: credential.email,
    picture: credential.picture,
  };
}

export function handleAuthError(error: unknown): string {
  console.error('Authentication error:', error);
  
  if (error instanceof Error) {
    if (error.message.includes('popup')) {
      return 'Popup was blocked. Please allow popups for this site.';
    }
    if (error.message.includes('network')) {
      return AUTH_ERROR_MESSAGES.NETWORK_ERROR;
    }
    return error.message;
  }
  
  return AUTH_ERROR_MESSAGES.GENERAL;
}