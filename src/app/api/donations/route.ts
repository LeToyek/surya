// ==============================================================================
// src/app/api/donations/route.ts
// Handles the creation of a new donation.
// ==============================================================================
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // 1. Check for authenticated user from session
  const session = (await cookies()).get('session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please log in to donate.' }, { status: 401 });
  }
  const user = JSON.parse(session);
  if (!user?.id) {
    return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
  }

  // 2. Parse request body
  const { schoolId, panelIds, donationAmount, logo, donorName } = await request.json();

  if (!schoolId || !panelIds || !Array.isArray(panelIds) || panelIds.length === 0 || !donationAmount || !donorName) {
    return NextResponse.json({ error: 'Missing required donation fields.' }, { status: 400 });
  }

  try {
    // 3. Use a transaction to ensure all database operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // a. Create the Donation record
      const newDonation = await tx.donation.create({
        data: {
          amount: donationAmount,
          logo: logo,
          userId: user.id, // Link to the logged-in user
          // We will connect the panels shortly
        },
      });

      // b. Update all the selected SolarPanel records to link them to the new donation
      await tx.solarPanel.updateMany({
        where: {
          id: { in: panelIds },
          schoolId: schoolId,
          donationId: null, // Ensure we are only claiming unclaimed panels
        },
        data: {
          donationId: newDonation.id,
        },
      });
      
      // c. Update the school's total funded amount
      await tx.school.update({
        where: { id: schoolId },
        data: {
          funded: {
            increment: donationAmount,
          },
        },
      });

      return newDonation;
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error("Donation creation failed:", error);
    return NextResponse.json({ error: "An internal server error occurred during the donation process." }, { status: 500 });
  }
}