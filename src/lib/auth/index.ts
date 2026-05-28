/**
 * Authentication Module Exports
 * 
 * Provides centralized access to all authentication functionality
 */

// Main service
export { AuthService, getAuthService, resetAuthService } from './authService';
export type { UserProfile } from './authService';

// Error types and handling
export {
  AuthError,
  InvalidCredentialsError,
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidEmailError,
  WeakPasswordError,
  SessionExpiredError,
  NoActiveSessionError,
  RefreshTokenFailedError,
  RateLimitExceededError,
  mapSupabaseErrorToAuthError,
} from './authErrors';
export type { AuthErrorCode } from './authErrors';

// Validation utilities
export {
  validateEmail,
  validatePassword,
  validateFullName,
  validateProfileUpdate,
  normalizeEmail,
  normalizeFullName,
  getPasswordStrengthScore,
  getPasswordStrengthLabel,
} from './authValidation';
export type { ProfileValidationRules } from './authValidation';

// Storage utilities
export {
  saveSession,
  getSession,
  clearSession,
  updateSessionToken,
  getRememberedEmail,
  clearRememberedEmail,
  isSessionExpiringSoon,
  getSessionTimeRemaining,
  clearAllAuthStorage,
  getLastAuthTime,
} from './authStorage';
export type { AuthSession, RememberMeData } from './authStorage';
