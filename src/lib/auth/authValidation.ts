/**
 * Authentication Validation Module
 * 
 * Provides validation for emails, passwords, and user profiles
 */

import { InvalidEmailError, WeakPasswordError } from './authErrors';

/**
 * Regular expression for email validation (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
export function validateEmail(email: string): void {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail) {
    throw new InvalidEmailError('E-Mail-Adresse ist erforderlich');
  }

  if (trimmedEmail.length > 254) {
    throw new InvalidEmailError('E-Mail-Adresse ist zu lang');
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    throw new InvalidEmailError('E-Mail-Adresse hat ein ungültiges Format');
  }
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function validatePassword(password: string): void {
  if (!password) {
    throw new WeakPasswordError('Passwort ist erforderlich');
  }

  if (password.length < 8) {
    throw new WeakPasswordError('Passwort muss mindestens 8 Zeichen lang sein');
  }

  if (!/[A-Z]/.test(password)) {
    throw new WeakPasswordError('Passwort muss mindestens einen Großbuchstaben enthalten');
  }

  if (!/[a-z]/.test(password)) {
    throw new WeakPasswordError('Passwort muss mindestens einen Kleinbuchstaben enthalten');
  }

  if (!/\d/.test(password)) {
    throw new WeakPasswordError('Passwort muss mindestens eine Zahl enthalten');
  }
}

/**
 * Validate full name
 */
export function validateFullName(fullName: string): void {
  const trimmed = fullName.trim();

  if (!trimmed) {
    throw new Error('Name ist erforderlich');
  }

  if (trimmed.length < 2) {
    throw new Error('Name muss mindestens 2 Zeichen lang sein');
  }

  if (trimmed.length > 100) {
    throw new Error('Name ist zu lang');
  }

  if (!/^[a-zA-ZäöüßÄÖÜ\s'-]+$/.test(trimmed)) {
    throw new Error('Name darf nur Buchstaben, Leerzeichen, Bindestriche und Apostrophe enthalten');
  }
}

/**
 * Validate profile updates
 */
export interface ProfileValidationRules {
  fullName?: string;
  nativeLanguage?: string;
  targetLanguage?: string;
  currentLevel?: string;
  learningGoal?: string;
  learningIntensity?: string;
}

export function validateProfileUpdate(updates: ProfileValidationRules): void {
  if (updates.fullName !== undefined) {
    validateFullName(updates.fullName);
  }

  if (updates.nativeLanguage !== undefined && updates.nativeLanguage.trim().length === 0) {
    throw new Error('Muttersprache ist erforderlich');
  }

  if (updates.targetLanguage !== undefined && updates.targetLanguage.trim().length === 0) {
    throw new Error('Zielsprache ist erforderlich');
  }

  if (updates.currentLevel !== undefined) {
    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (!validLevels.includes(updates.currentLevel)) {
      throw new Error('Ungültiges Sprachlevel');
    }
  }

  if (updates.learningGoal !== undefined) {
    const validGoals = ['Reisen', 'Alltag', 'Arbeit', 'Studium', 'Business', 'Auswandern', 'Prüfung', 'Allgemein'];
    if (!validGoals.includes(updates.learningGoal)) {
      throw new Error('Ungültiges Lernziel');
    }
  }

  if (updates.learningIntensity !== undefined) {
    const validIntensities = ['Locker', 'Normal', 'Intensiv'];
    if (!validIntensities.includes(updates.learningIntensity)) {
      throw new Error('Ungültige Lernintensität');
    }
  }
}

/**
 * Normalize email (trim and lowercase)
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normalize full name (trim and proper case each word)
 */
export function normalizeFullName(fullName: string): string {
  return fullName.trim();
}

/**
 * Check password strength score (0-100)
 */
export function getPasswordStrengthScore(password: string): number {
  let score = 0;

  if (!password) return 0;

  // Length scoring
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character variety
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

  return Math.min(score, 100);
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(
  score: number
): 'Sehr schwach' | 'Schwach' | 'Mittel' | 'Stark' | 'Sehr stark' {
  if (score < 20) return 'Sehr schwach';
  if (score < 40) return 'Schwach';
  if (score < 60) return 'Mittel';
  if (score < 80) return 'Stark';
  return 'Sehr stark';
}
