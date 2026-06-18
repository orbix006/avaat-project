/**
 * Centralized Error Handler
 * Parses technical Supabase, PostgreSQL, and network errors into human-friendly messages
 * and logs detailed error debug output to the server/browser console.
 */
export function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'Submission failed. Please try again.';

  const message = typeof error === 'string' ? error : (error.message || '');
  const code = error.code || '';

  // Log detailed error telemetry to console
  console.error('[DATABASE/AUTH TELEMETRY LOG]', {
    code,
    message,
    details: error.details,
    hint: error.hint,
    raw: error
  });

  const lowerMsg = message.toLowerCase();

  // 1. Connection / Network Errors
  if (
    code === '08001' || 
    code === '08004' || 
    code === '08006' || 
    code === '08P01' ||
    lowerMsg.includes('fetch') || 
    lowerMsg.includes('network') || 
    lowerMsg.includes('timeout') ||
    lowerMsg.includes('failed to fetch')
  ) {
    return 'Unable to connect to server.';
  }

  // 2. PostgreSQL Constraint & Policy Errors
  if (code) {
    switch (code) {
      case '23505': // Unique constraint violation
        if (lowerMsg.includes('email') || lowerMsg.includes('profiles') || lowerMsg.includes('newsletter_subscribers')) {
          return 'Email already registered.';
        }
        return 'A record with these details already exists.';
      case '42501': // RLS policy violation
        if (lowerMsg.includes('profiles')) {
          return 'Account creation failed.';
        }
        return 'Submission failed. Please try again.';
      case '23502': // Not null violation
        return 'Required field missing.';
      case '23503': // Foreign key violation
        return 'Referenced record not found.';
    }
  }

  // 3. Supabase Auth specific error codes & messages
  if (code === 'email_not_confirmed' || lowerMsg.includes('email not confirmed') || lowerMsg.includes('confirm your email')) {
    return 'Account not verified. Please check your email.';
  }
  if (code === 'user_already_exists' || lowerMsg.includes('already registered') || lowerMsg.includes('already exists')) {
    return 'Email already registered.';
  }
  if (code === 'weak_password' || lowerMsg.includes('should be at least') || lowerMsg.includes('password too weak')) {
    return 'Password must contain at least 8 characters.';
  }
  if (code === 'invalid_credentials' || lowerMsg.includes('invalid login credentials') || lowerMsg.includes('invalid credentials')) {
    // Return precise validation error
    return 'Incorrect password or email not found.';
  }
  if (lowerMsg.includes('email not found')) {
    return 'Email not found.';
  }
  if (lowerMsg.includes('incorrect password')) {
    return 'Incorrect password.';
  }

  // 4. Default Fallback
  return message || 'Submission failed. Please try again.';
}
