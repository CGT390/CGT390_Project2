import Link from 'next/link';

// Fetch a single profile by id from the same API
async function fetchProfile(id: string) {
    const response = await fetch(
        `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?limit=1000`,
        { cache: 'no-store' }
    );
    const data = await response.json();
    const profiles = data?.profiles || [];
    console.log('profiles fetched:', profiles.length, 'looking for id:', id);

    return profiles.find((p: any) => String(p.id) === id) ?? null;
}

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
    const { id } = await params;
    const profile = await fetchProfile(id);



    if (!profile) {
        return (
            <main style={{ padding: '2rem' }}>
                <p>Profile not found.</p>
                <Link href="/">← Back to profiles</Link>
            </main>
        );
    }

    return (
        <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
                ← Back to profiles
            </Link>

            <img
                src={profile.image_url}
                alt={profile.name}
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
            />

            <h1>{profile.name}</h1>
            <h2 style={{ fontWeight: 'normal', color: '#666' }}>{profile.title}</h2>

            <p>{profile.bio}</p>
            <p>📧 {profile.email}</p>
            <p>📞 {profile.phone}</p>
        </main>
    );
}