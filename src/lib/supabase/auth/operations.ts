import { supabase } from '../client';
import { AuthError } from './errors';
import type { User } from './types';

export async function signInWithGoogle(): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw new AuthError(error.message);
    if (!data) throw new AuthError('Sign in failed with no error');

    return {
      id: data.user?.id || '',
      email: data.user?.email || '',
      name: data.user?.user_metadata?.full_name || '',
      picture: data.user?.user_metadata?.avatar_url
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error instanceof AuthError ? error : new AuthError('Sign in failed');
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new AuthError(error.message);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw new AuthError(error.message);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || '',
    picture: user.user_metadata?.avatar_url
  };
}