import { NextRequest } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
const prisma = new PrismaClient();


type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const profile = await prisma.user.findUnique({
    where: { id },
  });

  if (!profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  return Response.json(profile, { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const updates = await request.json();

  if (updates.year !== undefined && (updates.year < 1 || updates.year > 4)) {
    return Response.json({ error: "Invalid year" }, { status: 400 });
  }
  if (updates.gpa !== undefined && (updates.gpa < 0 || updates.gpa > 4)) {
    return Response.json({ error: "Invalid GPA" }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(updates.name  && { name: updates.name.trim() }),
        ...(updates.major && { major: updates.major }),
        ...(updates.year  && { year: Number(updates.year) }),
        ...(updates.gpa   !== undefined && { gpa: Number(updates.gpa) }),
      },
    });

    return Response.json(updated, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }
}