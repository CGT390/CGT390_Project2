import prisma from "@/app/lib/prisma";
import AddProfileForm from "../../../components/add-profile";
import DeleteButton from "../../../components/delete-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchProfile(id: string) {
  const data = await prisma.profile.findUnique({
    where: { id: parseInt(id) },
  });
  return data ?? null;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Edit Profile ${id}`,
    description: `Edit details of profile with ID ${id}`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  const profile = await fetchProfile(id);

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  return (
    <div>
      <h1>Edit Profile {profile.name}</h1>
      <AddProfileForm existingProfile={profile} />
      <DeleteButton profileId={profile.id} />
    </div>
  );
}