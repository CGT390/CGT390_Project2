import { NextRequest } from "next/server";

type Profile = {
  id: number;
  name: string;
  major: string;
  year: number;
  gpa: number;
};

let profiles: Profile[] = [
  { id: 1, name: "Ava Lee", major: "CS", year: 2, gpa: 3.6 },
  { id: 2, name: "Ben Park", major: "CGT", year: 3, gpa: 3.2 },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get("year") || "";
  const name = searchParams.get("name") || "";
  const major = searchParams.get("major") || "";
  let filteredProfiles = [...profiles];

  if (year) {
    filteredProfiles = filteredProfiles.filter(
      (p) => p.year === Number(year)
    );
  }
  if (name) {
    filteredProfiles = filteredProfiles.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (major) {
    filteredProfiles = filteredProfiles.filter(
      (p) => p.major.toLowerCase() === major.toLowerCase()
    );
  }
  return Response.json(filteredProfiles, { status: 200 });
}

export async function POST(request: NextRequest) {
  const newProfile: Partial<Profile> = await request.json();
  try {
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
    const createdProfile: Profile = {
      id: Date.now(),
      name: newProfile.name.trim(),
      major: newProfile.major,
      year: Number(newProfile.year),
      gpa: Number(newProfile.gpa),
    };
    profiles.push(createdProfile);
    return Response.json(createdProfile, { status: 201 });
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }
  const index = profiles.findIndex((p) => p.id === Number(id));
  if (index === -1) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }
  profiles.splice(index, 1);
  return Response.json({ message: "Profile deleted" }, { status: 200 });
}