// ==============================================================================
// src/app/api/schools/route.ts
// Fetches a list of all schools.
// ==============================================================================
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      // You can add ordering or filtering here if needed
      orderBy: {
        id: 'asc',
      },
    });
    // The `funded` amount is now directly from the DB, so we need a way to calculate percentage client-side or here.
    const schoolsWithPercentage = schools.map(school => ({
      ...school,
      percentage: school.goal > 0 ? Math.round((school.funded / school.goal) * 100) : 0,
      panelGridConfigs: school.panelGridConfigs, // Ensure this is returned
    }));

    return NextResponse.json(schoolsWithPercentage);
  } catch (error) {
    console.error("Failed to fetch schools:", error);
    return NextResponse.json({ error: "Failed to fetch schools" }, { status: 500 });
  }
}