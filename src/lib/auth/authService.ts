/**
 * Authentication Service
 * 
 * Comprehensive auth service with Supabase integration
 * Handles user authentication, session management, and profile updates
 */

import { getSupabaseOrNull, isSupabaseAvailable } from '../supabase/client';
import type { AuthUser } from '@supabase/supabase-js';
import {
  AuthError,
  InvalidCredentialsError,
  NoActiveSessionError,
  RefreshTokenFailedError,
  mapSupabaseErrorToAuthError,
} from './authErrors';
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateProfileUpdate,
  normalizeEmail,
  normalizeFullName,
  type ProfileValidationRules,
} from './authValidation';
import {
  saveSession,
  getSession,
  clearSession,
  getRememberedEmail,
  clearRememberedEmail,
  isSessionExpiringSoon,
  getSessionTimeRemaining,
  type AuthSession,
} from './authStorage';

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  nativeLanguage?: string;
  targetLanguage?: string;
  currentLevel?: string;
  learningGoal?: string;
  learningIntensity?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Authentication Service
 * 
 * Provides all authentication operations with comprehensive error handling
 * and session management
 */
export class AuthService {
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.setupAutoRefresh();
  }

  private getSupabaseClient() {
    const client = getSupabaseOrNull()
    if (!client) {
      throw new AuthError(
        'UNKNOWN_ERROR',
        'Supabase ist noch nicht konfiguriert. Bitte fügen Sie VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY zu Ihrer .env-Datei hinzu.',
        'Supabase-Konfiguration fehlt'
      )
    }
    return client
  }

  static isSupabaseConfigured(): boolean {
    return isSupabaseAvailable()
  }

  /**
   * Sign up a new user
   */
  async signUp(
    email: string,
    password: string,
    fullName: string
  ): Promise<{ user: UserProfile; session: AuthSession }> {
    try {
      // Validate inputs
      const normalizedEmail = normalizeEmail(email);
      const normalizedName = normalizeFullName(fullName);

      validateEmail(normalizedEmail);
      validatePassword(password);
      validateFullName(normalizedName);

      // Sign up with Supabase
      const { data, error } = await this.getSupabaseClient().auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: normalizedName,
          },
        },
      });

      if (error) {
        throw mapSupabaseErrorToAuthError(error, 'Sign up');
      }

      if (!data.user || !data.session) {
        throw new AuthError(
          'UNKNOWN_ERROR',
          'Sign up failed: No user or session returned',
          'Registrierung fehlgeschlagen'
        );
      }

      // Create user profile in database
      const profile = await this.createUserProfile(data.user.id, normalizedEmail, normalizedName);

      // Save session
      const authSession = this.mapAuthSessionFromSupabase(data.user, data.session);
      saveSession(authSession, false);

      return { user: profile, session: authSession };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw mapSupabaseErrorToAuthError(error, 'Sign up');
    }
  }

  /**
   * Sign in user
   */
  async signIn(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ user: UserProfile; session: AuthSession }> {
    try {
      const normalizedEmail = normalizeEmail(email);

      validateEmail(normalizedEmail);

      if (!password) {
        throw new InvalidCredentialsError('Passwort ist erforderlich');
      }

      const { data, error } = await this.getSupabaseClient().auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        throw mapSupabaseErrorToAuthError(error, 'Sign in');
      }

      if (!data.user || !data.session) {
        throw new NoActiveSessionError('Anmeldung fehlgeschlagen');
      }

      // Get user profile
      const profile = await this.getUserProfile(data.user.id);

      // Save session
      const authSession = this.mapAuthSessionFromSupabase(data.user, data.session);
      saveSession(authSession, rememberMe);

      return { user: profile, session: authSession };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw mapSupabaseErrorToAuthError(error, 'Sign in');
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      // Clear session storage first
      clearSession();
      clearRememberedEmail();

      // Sign out from Supabase
      const { error } = await this.getSupabaseClient().auth.signOut();

      if (error) {
        console.error('Supabase sign out error:', error);
        // Don't throw - session is already cleared
      }

      // Clear session check interval
      this.clearSessionCheckInterval();
    } catch (error) {
      console.error('Sign out error:', error);
      // Ensure cleanup happens
      clearSession();
      clearRememberedEmail();
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const session = getSession();
      if (!session) {
        return null;
      }

      return await this.getUserProfile(session.user.id);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const session = getSession();
    return !!session;
  }

  /**
   * Refresh authentication session
   */
  async refreshSession(): Promise<AuthSession | null> {
    try {
      const session = getSession();
      if (!session) {
        throw new NoActiveSessionError();
      }

      const { data, error } = await this.getSupabaseClient().auth.refreshSession({
        refresh_token: session.refreshToken,
      });

      if (error || !data.session) {
        throw mapSupabaseErrorToAuthError(
          error || new Error('Session refresh failed'),
          'Refresh session'
        );
      }

      // Update stored session
      const newSession = this.mapAuthSessionFromSupabase(data.user!, data.session);
      saveSession(newSession, !!localStorage.getItem('auth_remember_me'));

      return newSession;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new RefreshTokenFailedError('Session refresh failed', error);
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const normalizedEmail = normalizeEmail(email);
      validateEmail(normalizedEmail);

      const { error } = await this.getSupabaseClient().auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw mapSupabaseErrorToAuthError(error, 'Password reset');
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw mapSupabaseErrorToAuthError(error, 'Password reset');
    }
  }

  /**
   * Update user password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      if (!oldPassword) {
        throw new Error('Altes Passwort ist erforderlich');
      }

      validatePassword(newPassword);

      if (oldPassword === newPassword) {
        throw new Error('Neues Passwort darf nicht dem alten Passwort entsprechen');
      }

      // Verify old password by attempting sign in
      const session = getSession();
      if (!session) {
        throw new NoActiveSessionError();
      }

      const { error: signInError } = await this.getSupabaseClient().auth.signInWithPassword({
        email: session.user.email,
        password: oldPassword,
      });

      if (signInError) {
        throw new InvalidCredentialsError('Altes Passwort ist falsch');
      }

      // Update password
      const { error } = await this.getSupabaseClient().auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw mapSupabaseErrorToAuthError(error, 'Change password');
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw mapSupabaseErrorToAuthError(error, 'Change password');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: ProfileValidationRules): Promise<UserProfile> {
    try {
      const session = getSession();
      if (!session) {
        throw new NoActiveSessionError();
      }

      const client = this.getSupabaseClient() as any

      validateProfileUpdate(updates);

      // Update user table fields
      if (updates.fullName !== undefined) {
        await client
          .from('users')
          .update({ full_name: updates.fullName } as unknown)
          .eq('id', session.user.id)
          .select()
          .single();
      }

      // Update profile table fields
      const profileUpdates: Record<string, unknown> = {};
      if (updates.nativeLanguage !== undefined) {
        profileUpdates.native_language = updates.nativeLanguage;
      }
      if (updates.targetLanguage !== undefined) {
        profileUpdates.target_language = updates.targetLanguage;
      }
      if (updates.currentLevel !== undefined) {
        profileUpdates.level = updates.currentLevel;
      }
      if (updates.learningGoal !== undefined) {
        profileUpdates.goal = updates.learningGoal;
      }
      if (updates.learningIntensity !== undefined) {
        profileUpdates.intensity = updates.learningIntensity;
      }

      if (Object.keys(profileUpdates).length > 0) {
        await client
          .from('profiles')
          .update(profileUpdates as unknown)
          .eq('user_id', session.user.id)
          .select()
          .single();
      }

      // Return updated profile
      return await this.getUserProfile(session.user.id);
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw mapSupabaseErrorToAuthError(error, 'Update profile');
    }
  }

  /**
   * Get remembered email
   */
  getRememberedEmail(): string | null {
    return getRememberedEmail();
  }

  /**
   * Clear remembered email
   */
  clearRememberedEmail(): void {
    clearRememberedEmail();
  }

  /**
   * Check session time remaining
   */
  getSessionTimeRemaining(): number {
    return getSessionTimeRemaining();
  }

  // Private helper methods

  /**
   * Create user profile in database
   */
  private async createUserProfile(
    userId: string,
    email: string,
    fullName: string
  ): Promise<UserProfile> {
    try {
      const client = this.getSupabaseClient() as any

      // Create user record in users table
      await client
        .from('users')
        .insert({
          id: userId,
          full_name: fullName,
          email,
        } as unknown)
        .select()
        .single();

      // Create profile record in profiles table
      const { data: profileData } = await client
        .from('profiles')
        .insert({
          user_id: userId,
        } as unknown)
        .select()
        .single();

      return {
        id: userId,
        email,
        fullName,
        nativeLanguage: profileData?.native_language,
        targetLanguage: profileData?.target_language,
        currentLevel: profileData?.level,
        learningGoal: profileData?.goal,
        learningIntensity: profileData?.intensity,
      };
    } catch (error) {
      console.error('Create user profile error:', error);
      return {
        id: userId,
        email,
        fullName,
      };
    }
  }

  /**
   * Get user profile from database
   */
  private async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const client = this.getSupabaseClient() as any

      // Get user record
      const { data: userData } = await client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      // Get profile record
      const { data: profileData } = await client
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      return {
        id: userId,
        email: userData?.email || '',
        fullName: userData?.full_name,
        nativeLanguage: profileData?.native_language,
        targetLanguage: profileData?.target_language,
        currentLevel: profileData?.level,
        learningGoal: profileData?.goal,
        learningIntensity: profileData?.intensity,
        createdAt: userData?.created_at,
        updatedAt: userData?.updated_at,
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      // Return a basic profile from session
      const session = getSession();
      if (!session) throw new NoActiveSessionError();

      return {
        id: session.user.id,
        email: session.user.email,
        fullName: session.user.fullName,
      };
    }
  }

  /**
   * Map Supabase auth session to our AuthSession type
   */
  private mapAuthSessionFromSupabase(user: AuthUser, session: any): AuthSession {
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token || '',
      expiresAt: Date.now() + (session.expires_in || 3600) * 1000,
      user: {
        id: user.id,
        email: user.email || '',
        fullName: user.user_metadata?.full_name,
      },
    };
  }

  /**
   * Setup automatic token refresh
   */
  private setupAutoRefresh(): void {
    // Check session expiration every minute
    this.sessionCheckInterval = setInterval(() => {
      if (isSessionExpiringSoon()) {
        this.refreshSession().catch((error) => {
          console.error('Auto-refresh failed:', error);
          // Logout on refresh failure
          this.signOut().catch(console.error);
        });
      }
    }, 60000);
  }

  /**
   * Clear session check interval
   */
  private clearSessionCheckInterval(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.clearSessionCheckInterval();
  }
}

// Create singleton instance
let authServiceInstance: AuthService | null = null;

/**
 * Get or create AuthService instance
 */
export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService();
  }
  return authServiceInstance;
}

/**
 * Reset AuthService (for testing)
 */
export function resetAuthService(): void {
  if (authServiceInstance) {
    authServiceInstance.destroy();
  }
  authServiceInstance = null;
}
