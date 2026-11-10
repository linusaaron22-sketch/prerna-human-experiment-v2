
import { NextRequest } from "next/server";

/**
 * Validates that a browser request originates from this application.
 *
 * Development: uses the actual local request origin.
 * Production: uses NEXT_PUBLIC_SITE_URL.
 *
 * POST requests must include Origin.
 * GET requests may use Referer when Origin is unavailable.
 */
export function validateSameOrigin(
  request: NextRequest,
  requireOrigin = false
): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  try {
    const expectedOrigin =
      process.env.NODE_ENV === "development"
        ? request.nextUrl.origin
        : process.env.NEXT_PUBLIC_SITE_URL
          ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
          : null;

    if (!expectedOrigin) return false;

    if (origin) {
      return new URL(origin).origin === expectedOrigin;
    }

    if (requireOrigin) return false;

    if (referer) {
      return new URL(referer).origin === expectedOrigin;
    }

    return false;
  } catch {
    return false;
  }
}
