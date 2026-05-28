/**
 * Authentication Storage Module
 * 
 * Handles secure session storage using localStorage and sessionStorage
 * Provides type-safe session management
 */

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    fullName?: string;
  };
}

export interface RememberMeData {
  email: string;
  expiresAt: number;
}

// Storage keys
const STORAGE_KEYS = {
  SESSION: 'auth_session',
  REMEMBER_ME: 'auth_remember_me',
  LAST_AUTH: 'auth_last_auth_time',
};

// Constants
const REMEMBER_ME_TIMEOUT_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Save session to secure storage
 */
export function saveSession(session: AuthSession, rememberMe: boolean = false): void {
  try {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.LAST_AUTH, Date.now().toString());

    if (rememberMe) {
      const rememberData: RememberMeData = {
        email: session.user.email,
        expiresAt: Date.now() + REMEMBER_ME_TIMEOUT_MS,
      };
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, JSON.stringify(rememberData));
    }
  } catch (error) {
    console.error('Failed to save session:', error);
    // Silently fail if storage quota exceeded
  }
}

/**
 * Retrieve session from secure storage
 */
export function getSession(): AuthSession | null {
  try {
    // Try sessionStorage first, then localStorage
    let sessionData = sessionStorage.getItem(STORAGE_KEYS.SESSION);

    if (!sessionData) {
      sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
    }

    if (!sessionData) {
      return null;
    }

    const session = JSON.parse(sessionData) as AuthSession;

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    return null;
  }
}

/**
 * Update session access token
 */
export function updateSessionToken(accessToken: string, expiresAt: number): void {
  try {
    const session = getSession();
    if (!session) return;

    const updated: AuthSession = {
      ...session,
      accessToken,
      expiresAt,
    };

    // Determine which storage had the session
    const inSessionStorage = sessionStorage.getItem(STORAGE_KEYS.SESSION) !== null;
    const storage = inSessionStorage ? sessionStorage : localStorage;

    storage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update session token:', error);
  }
}

/**
 * Clear session from storage
 */
export function clearSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.LAST_AUTH);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

/**
 * Get remembered email for auto-fill
 */
export function getRememberedEmail(): string | null {
  try {
    const rememberData = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    if (!rememberData) return null;

    const data = JSON.parse(rememberData) as RememberMeData;

    // Check if remember me data is expired
    if (data.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      return null;
    }

    return data.email;
  } catch (error) {
    console.error('Failed to retrieve remembered email:', error);
    return null;
  }
}

/**
 * Clear remember me data
 */
export function clearRememberedEmail(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  } catch (error) {
    console.error('Failed to clear remembered email:', error);
  }
}

/**
 * Check if session is about to expire (within 5 minutes)
 */
export function isSessionExpiringSoon(): boolean {
  const session = getSession();
  if (!session) return false;

  const timeUntilExpiry = session.expiresAt - Date.now();
  const REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

  return timeUntilExpiry < REFRESH_BUFFER_MS;
}

/**
 * Get time remaining on current session (in milliseconds)
 */
export function getSessionTimeRemaining(): number {
  const session = getSession();
  if (!session) return 0;

  return Math.max(0, session.expiresAt - Date.now());
}

/**
 * Clear all auth-related storage (emergency cleanup)
 */
export function clearAllAuthStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear all auth storage:', error);
  }
}

/**
 * Get last authentication timestamp
 */
export function getLastAuthTime(): number | null {
  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_AUTH);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Failed to get last auth time:', error);
    return null;
  }
}
