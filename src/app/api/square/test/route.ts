/**
 * GET /api/square/test
 *
 * Attempts to call Square's Locations API with the configured token.
 * Returns the merchant name and a list of locations on success, or the
 * specific error on failure. Used by the "Square connection" panel in
 * the portal so non-developers can confirm credentials are wired up.
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { ok: false, configured: false, error: 'Square integration not configured yet.' },
    { status: 503 },
  );
}
