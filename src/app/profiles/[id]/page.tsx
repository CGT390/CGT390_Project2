import Link from "next/link";
import prisma from "@/app/lib/prisma";
import "./profile-detail.css";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProfileDetailPage({ params }: PageProps) {
    const { id } = await params;
    const profile = await prisma.profile.findUnique({
        where: { id: parseInt(id) },
    });

    if (!profile) {
        return (
            <main>
                <div className="section">
                    <div className="container">
                        <p className="not-found">Profile not found.</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="section">
                <div className="container">
                    <div className="profile-card">
                        <figure className="profile-image">
                            <img src={profile.image_url} alt={profile.name} />
                        </figure>
                        <div className="profile-info">
                            <h1>{profile.name}</h1>
                            <p className="profile-title">{profile.title}</p>
                            <p className="profile-email">
                                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                            </p>
                            <p className="profile-bio">{profile.bio}</p>
                            <div className="profile-actions">
                                <Link href={`/profiles/${profile.id}/edit`} className="btn-edit">
                                    Edit Profile
                                </Link>
                                <Link href="/" className="btn-back">
                                    Back to Profiles
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}