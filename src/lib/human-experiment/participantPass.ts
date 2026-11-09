
import { createHash, randomBytes } from "node:crypto";

/**
 * Generates a cryptographically secure participant pass token.
 * The raw token is intended for the QR URL and must not be stored in the database.
 */
export function generateParticipantPassToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Hashes a raw participant pass token using SHA-256.
 * Store this hash in participant_passes.token_hash.
 */
export function hashParticipantPassToken(token: string): string {
  return createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}
