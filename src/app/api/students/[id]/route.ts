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

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const profile = profiles.find((p) => p.id === Number(id));
  if (!profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }
  return Response.json(profile, { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const updates: Partial<Profile> = await request.json();
  const { id } = await params;
  const index = profiles.findIndex((p) => p.id === Number(id));
  if (index === -1) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }
  if (updates.year !== undefined && (updates.year < 1 || updates.year > 4)) {
    return Response.json({ error: "Invalid year" }, { status: 400 });
  }
  if (updates.gpa !== undefined && (updates.gpa < 0 || updates.gpa > 4)) {
    return Response.json({ error: "Invalid GPA" }, { status: 400 });
  }
  profiles[index] = { ...profiles[index], ...updates, id: profiles[index].id };
  return Response.json(profiles[index], { status: 200 });
}