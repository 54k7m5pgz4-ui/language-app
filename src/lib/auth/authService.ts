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
  UserAlreadyExistsError,
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

      // If Supabase is not configured, use local fallback
      if (!AuthService.isSupabaseConfigured()) {
        // Local users stored in localStorage under 'local_users'
        const raw = localStorage.getItem('local_users') || '[]'
        const users = JSON.parse(raw) as Array<{ id: string; email: string; password: string; fullName?: string }>

        if (users.find(u => u.email === normalizedEmail)) {
          throw new UserAlreadyExistsError('Ein Konto mit dieser E-Mail existiert bereits')
        }

        const id = `local-${Date.now()}`
        const newUser = { id, email: normalizedEmail, password: btoa(password), fullName: normalizedName }
        users.push(newUser)
        localStorage.setItem('local_users', JSON.stringify(users))

        const authSession: AuthSession = {
          accessToken: id,
          refreshToken: '',
          expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24h
          user: { id, email: normalizedEmail, fullName: normalizedName },
        }

        saveSession(authSession, false)

        return { user: { id, email: normalizedEmail, fullName: normalizedName }, session: authSession }
      }

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

      // Local fallback when Supabase isn't configured
      if (!AuthService.isSupabaseConfigured()) {
        const raw = localStorage.getItem('local_users') || '[]'
        const users = JSON.parse(raw) as Array<{ id: string; email: string; password: string; fullName?: string }>
        const found = users.find(u => u.email === normalizedEmail)
        if (!found) {
          throw new InvalidCredentialsError('Benutzer nicht gefunden')
        }

        if (found.password !== btoa(password)) {
          throw new InvalidCredentialsError('Ungültige Anmeldedaten')
        }

        const authSession: AuthSession = {
          accessToken: found.id,
          refreshToken: '',
          expiresAt: Date.now() + 1000 * 60 * 60 * 24,
          user: { id: found.id, email: found.email, fullName: found.fullName },
        }

        saveSession(authSession, rememberMe)

        return { user: { id: found.id, email: found.email, fullName: found.fullName }, session: authSession }
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

      if (AuthService.isSupabaseConfigured()) {
        const { error } = await this.getSupabaseClient().auth.signOut();

        if (error) {
          console.error('Supabase sign out error:', error);
          // Don't throw - session is already cleared
        }
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

      if (!AuthService.isSupabaseConfigured()) {
        const rawProfiles = localStorage.getItem('local_profiles') || '{}'
        const profiles = JSON.parse(rawProfiles) as Record<string, Partial<UserProfile>>
        const profile = profiles[session.user.id] || {}

        return {
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.fullName,
          nativeLanguage: profile.nativeLanguage,
          targetLanguage: profile.targetLanguage,
          currentLevel: profile.currentLevel,
          learningGoal: profile.learningGoal,
          learningIntensity: profile.learningIntensity,
        };
      }

      const { data, error } = await this.getSupabaseClient().auth.getSession();
      if (error || !data.session?.user) {
        return await this.getUserProfile(session.user.id);
      }

      return await this.getUserProfile(data.session.user.id);
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

      if (!AuthService.isSupabaseConfigured()) {
        return session;
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

      const session = getSession();
      if (!session) {
        throw new NoActiveSessionError();
      }

      if (!AuthService.isSupabaseConfigured()) {
        const raw = localStorage.getItem('local_users') || '[]'
        const users = JSON.parse(raw) as Array<{ id: string; email: string; password: string; fullName?: string }>
        const found = users.find(u => u.id === session.user.id)
        if (!found) {
          throw new InvalidCredentialsError('Benutzer nicht gefunden');
        }

        if (found.password !== btoa(oldPassword)) {
          throw new InvalidCredentialsError('Altes Passwort ist falsch');
        }

        found.password = btoa(newPassword)
        localStorage.setItem('local_users', JSON.stringify(users))
        return
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

      validateProfileUpdate(updates);

      if (!AuthService.isSupabaseConfigured()) {
        const rawUsers = localStorage.getItem('local_users') || '[]'
        const users = JSON.parse(rawUsers) as Array<{ id: string; email: string; password: string; fullName?: string }>
        const rawProfiles = localStorage.getItem('local_profiles') || '{}'
        const profiles = JSON.parse(rawProfiles) as Record<string, Partial<UserProfile>>

        const user = users.find(u => u.id === session.user.id)
        if (!user) {
          throw new NoActiveSessionError();
        }

        if (updates.fullName !== undefined) {
          user.fullName = updates.fullName
          session.user.fullName = updates.fullName
        }

        const profile = profiles[session.user.id] || {}
        if (updates.nativeLanguage !== undefined) {
          profile.nativeLanguage = updates.nativeLanguage
        }
        if (updates.targetLanguage !== undefined) {
          profile.targetLanguage = updates.targetLanguage
        }
        if (updates.currentLevel !== undefined) {
          profile.currentLevel = updates.currentLevel
        }
        if (updates.learningGoal !== undefined) {
          profile.learningGoal = updates.learningGoal
        }
        if (updates.learningIntensity !== undefined) {
          profile.learningIntensity = updates.learningIntensity
        }

        users.splice(users.findIndex(u => u.id === user.id), 1, user)
        profiles[session.user.id] = profile
        localStorage.setItem('local_users', JSON.stringify(users))
        localStorage.setItem('local_profiles', JSON.stringify(profiles))
        saveSession(session, !!localStorage.getItem('auth_remember_me'))

        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          nativeLanguage: profile.nativeLanguage,
          targetLanguage: profile.targetLanguage,
          currentLevel: profile.currentLevel,
          learningGoal: profile.learningGoal,
          learningIntensity: profile.learningIntensity,
        }
      }

      const client = this.getSupabaseClient() as any

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
