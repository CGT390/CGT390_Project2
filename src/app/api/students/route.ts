import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { put } from '@vercel/blob';

// const blob = await put(imgFile.name, imgFile, {
// access: 'public',
// allowOverwrite: true,
// });
// const imageUrl = blob.url;
import prisma from '@/app/lib/prisma'

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

const initialProfiles = [
  { name: "Ava Lee", major: "CS", year: 2, gpa: 3.6 },
  { name: "Ben Park", major: "CGT", year: 3, gpa: 3.2 },
];

async function seedProfiles(prisma: PrismaClient) {
  const count = await prisma.student.count();
  if (count === 0) {
    await prisma.student.createMany({
      data: initialProfiles,
      skipDuplicates: true,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    await seedProfiles(prisma);

    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year");
    const name = searchParams.get("name");
    const major = searchParams.get("major");

    const profiles = await prisma.student.findMany({
      where: {
        ...(year  && { year: Number(year) }),
        ...(name  && { name: { contains: name, mode: "insensitive" } }),
        ...(major && { major: { equals: major, mode: "insensitive" } }),
      },
    });

    return Response.json(profiles, { status: 200 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const newProfile = await request.json();

    if (!newProfile.name || typeof newProfile.name !== "string") {
      return Response.json({ error: "Invalid name" }, { status: 400 });
    }
    if (!newProfile.major || typeof newProfile.major !== "string") {
      return Response.json({ error: "Invalid major" }, { status: 400 });
    }
    if (!newProfile.year || newProfile.year < 1 || newProfile.year > 4) {
      return Response.json({ error: "Invalid year" }, { status: 400 });
    }
    if (newProfile.gpa === undefined || newProfile.gpa < 0 || newProfile.gpa > 4) {
      return Response.json({ error: "Invalid GPA" }, { status: 400 });
    }

    const created = await prisma.student.create({
      data: {
        name:  newProfile.name.trim(),
        major: newProfile.major,
        year:  Number(newProfile.year),
        gpa:   Number(newProfile.gpa),
      },
    });
    return Response.json(created, { status: 201 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

    const deleted = await prisma.student.delete({ where: { id } });
    return Response.json({ message: "Profile deleted", deleted }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  } finally {
    await prisma.$disconnect();
  }
}