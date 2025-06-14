// ==============================================================================
// src/app/api/schools/[id]/route.ts
// Fetches details for a single school.
// ==============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;

  try {
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid school ID" }, { status: 400 });
    }

    const school = await prisma.school.findUnique({
      where: { id },
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const schoolWithPercentage = {
      ...school,
      percentage: school.goal > 0 ? Math.round((school.funded / school.goal) * 100) : 0,
      panelGridConfigs: school.panelGridConfigs,
    };

    return NextResponse.json(schoolWithPercentage);
  } catch (error) {
    console.error(`Failed to fetch school ${idParam}:`, error);
    return NextResponse.json({ error: "Failed to fetch school data" }, { status: 500 });
  }
}