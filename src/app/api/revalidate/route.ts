import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// ponytail: Sync manual barato — invalida tag del Sheet y deja revalidar en background
// Upgrade path: webhook onChange de Sheets si se necesita push <2s
export async function POST() {
    revalidateTag('sheet-dashboard');
    return NextResponse.json({ revalidated: true });
}
