import { NextRequest } from "next/server";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET – filter profiles from DB
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get("year");
  const name = searchParams.get("name");
  const major = searchParams.get("major");

  const profiles = await prisma.user.findMany({
    where: {
      ...(year && { year: Number(year) }),
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(major && { major: { equals: major, mode: "insensitive" } }),
    },
  });

  return Response.json(profiles, { status: 200 });
}

// POST – create a new profile
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || typeof body.name !== "string") {
    return Response.json({ error: "Invalid name" }, { status: 400 });
  }
  if (!body.major || typeof body.major !== "string") {
    return Response.json({ error: "Invalid major" }, { status: 400 });
  }
  if (!body.year || body.year < 1 || body.year > 4) {
    return Response.json({ error: "Invalid year" }, { status: 400 });
  }
  if (body.gpa === undefined || body.gpa < 0 || body.gpa > 4) {
    return Response.json({ error: "Invalid GPA" }, { status: 400 });
  }

  try {
    const created = await prisma.user.create({
      data: {
        name: body.name.trim(),
        major: body.major,
        year: Number(body.year),
        gpa: Number(body.gpa),
      },
    });
    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
}

// DELETE – remove a profile by id
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const deleted = await prisma.user.delete({
      where: { id: id },
    });
    return Response.json({ message: "Profile deleted", deleted }, { status: 200 });
  } catch (error) {
    // Prisma throws P2025 when the record doesn't exist
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }
}