import { NextResponse } from 'next/server';
import { getUfValue } from '@/lib/payments/uf';

export async function GET() {
  try {
    const uf = await getUfValue();
    return NextResponse.json({ uf }, { 
        headers: { 
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' 
        } 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch UF' }, { status: 500 });
  }
}
