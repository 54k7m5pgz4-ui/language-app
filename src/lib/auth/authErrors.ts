/**
 * Authentication Error Types and Handling
 * 
 * Provides custom error classes and standardized error handling
 * for authentication operations
 */

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'USER_ALREADY_EXISTS'
  | 'INVALID_EMAIL'
  | 'WEAK_PASSWORD'
  | 'SESSION_EXPIRED'
  | 'NO_ACTIVE_SESSION'
  | 'REFRESH_TOKEN_FAILED'
  | 'INVALID_PASSWORD_RESET'
  | 'RATE_LIMIT_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export class AuthError extends Error {
  public code: AuthErrorCode;
  public userFriendlyMessage: string;
  public details?: unknown;

  constructor(
    code: AuthErrorCode,
    message: string,
    userFriendlyMessage: string = message,
    details?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.userFriendlyMessage = userFriendlyMessage;
    this.details = details;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message = 'Ungültige Anmeldedaten', details?: unknown) {
    super(
      'INVALID_CREDENTIALS',
      message,
      'E-Mail oder Passwort ist falsch',
      details
    );
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotFoundError extends AuthError {
  constructor(message = 'Benutzer nicht gefunden', details?: unknown) {
    super(
      'USER_NOT_FOUND',
      message,
      'Es existiert kein Benutzer mit dieser E-Mail-Adresse',
      details
    );
    this.name = 'UserNotFoundError';
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor(message = 'Benutzer existiert bereits', details?: unknown) {
    super(
      'USER_ALREADY_EXISTS',
      message,
      'Diese E-Mail-Adresse ist bereits registriert',
      details
    );
    this.name = 'UserAlreadyExistsError';
  }
}

export class InvalidEmailError extends AuthError {
  constructor(message = 'Ungültige E-Mail-Adresse', details?: unknown) {
    super(
      'INVALID_EMAIL',
      message,
      'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      details
    );
    this.name = 'InvalidEmailError';
  }
}

export class WeakPasswordError extends AuthError {
  constructor(message = 'Passwort ist zu schwach', details?: unknown) {
    super(
      'WEAK_PASSWORD',
      message,
      'Das Passwort muss mindestens 8 Zeichen lang sein und Großbuchstaben, Kleinbuchstaben und Zahlen enthalten',
      details
    );
    this.name = 'WeakPasswordError';
  }
}

export class SessionExpiredError extends AuthError {
  constructor(message = 'Sitzung abgelaufen', details?: unknown) {
    super(
      'SESSION_EXPIRED',
      message,
      'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an',
      details
    );
    this.name = 'SessionExpiredError';
  }
}

export class NoActiveSessionError extends AuthError {
  constructor(message = 'Keine aktive Sitzung', details?: unknown) {
    super(
      'NO_ACTIVE_SESSION',
      message,
      'Sie sind nicht angemeldet',
      details
    );
    this.name = 'NoActiveSessionError';
  }
}

export class RefreshTokenFailedError extends AuthError {
  constructor(message = 'Token-Aktualisierung fehlgeschlagen', details?: unknown) {
    super(
      'REFRESH_TOKEN_FAILED',
      message,
      'Die Sitzung konnte nicht aktualisiert werden. Bitte melden Sie sich erneut an',
      details
    );
    this.name = 'RefreshTokenFailedError';
  }
}

export class RateLimitExceededError extends AuthError {
  constructor(message = 'Zu viele Anfragen', details?: unknown) {
    super(
      'RATE_LIMIT_EXCEEDED',
      message,
      'Sie haben zu viele Anfragen gestellt. Bitte warten Sie einige Minuten',
      details
    );
    this.name = 'RateLimitExceededError';
  }
}

export function mapSupabaseErrorToAuthError(
  error: unknown,
  context: string = 'Authentication'
): AuthError {
  const err = error as Record<string, unknown>;
  const message = (err?.message as string) || '';
  const code = (err?.code as string) || '';
  const status = err?.status as number | undefined;

  console.error(`Auth error in ${context}:`, { message, code, status });

  // Check for specific Supabase error patterns
  if (message.includes('Invalid login credentials')) {
    return new InvalidCredentialsError(message, error);
  }

  if (message.includes('User already registered') || code === 'user_already_exists') {
    return new UserAlreadyExistsError(message, error);
  }

  if (message.includes('invalid email') || code === 'invalid_email_format') {
    return new InvalidEmailError(message, error);
  }

  if (message.includes('Password should be at least 8 characters')) {
    return new WeakPasswordError(message, error);
  }

  if (message.includes('User not found') || status === 404) {
    return new UserNotFoundError(message, error);
  }

  if (message.includes('Session expired') || code === 'session_expired') {
    return new SessionExpiredError(message, error);
  }

  if (message.includes('Rate limit') || status === 429) {
    return new RateLimitExceededError(message, error);
  }

  if (!navigator.onLine || code === 'network_error') {
    return new AuthError(
      'NETWORK_ERROR',
      'Netzwerkfehler',
      'Überprüfen Sie Ihre Internetverbindung',
      error
    );
  }

  return new AuthError(
    'UNKNOWN_ERROR',
    message || `${context} failed`,
    'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut',
    error
  );
}
