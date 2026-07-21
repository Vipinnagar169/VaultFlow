import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a cryptographically random idempotency key (UUID v4)
 * Must be generated ONCE per transaction attempt and stored in component state.
 * Do NOT regenerate on re-renders.
 */
export function generateIdempotencyKey(): string {
  return uuidv4();
}
