import { hash, compare } from "bcryptjs";

/**
 * Hashes a password using bcrypt with configurable salt rounds
 * Higher salt rounds = more secure but slower
 */
export async function hashPassword(
  password: string,
  saltRounds = 12,
): Promise<string> {
  return await hash(password, saltRounds);
}

/**
 * Securely compares a plain text password against a hash
 * Returns true if the password matches the hash
 */
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await compare(password, hashedPassword);
}

/**
 * Validates password strength against common requirements
 * Returns validation error message or null if valid
 */
export function validatePasswordStrength(password: string): string | null {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return null;
}
