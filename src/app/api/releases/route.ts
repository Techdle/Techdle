import { getGitHubReleases } from '@/lib/github';
import { NextResponse } from 'next/server';

export const revalidate = 1800; // Cache the entire route response for 30 minutes at the Edge

export async function GET() {
  const releases = await getGitHubReleases();
  return NextResponse.json(releases);
}
