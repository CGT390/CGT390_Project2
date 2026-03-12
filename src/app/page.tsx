import Navbar from './components/navbar';
import ProfileCard from './components/profile-card';
import Filters from './components/filters';
import './css/homepage.css';

async function fetchTitles(): Promise<string[]> {
  const response = await fetch(
    "https://web.ics.purdue.edu/~zong6/profile-app/get-titles.php",
    { cache: 'no-store' }
  );
  const data = await response.json();
  console.log("Fetched titles:", data?.data);

  return data?.titles || [];
}

async function fetchProfiles(title: string, search: string) {
  const response = await fetch(
    `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=${title}&name=${search}&limit=1000`,
    { cache: 'no-store' }
  );
  const data = await response.json();
  console.log("Fetched profiles:", data?.profiles);
  return data?.profiles || [];
}
type PageProps = {
  searchParams?: Promise<{
    title?: string;
    search?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const selectedTitle = resolvedParams?.title || "";
  const selectedSearch = resolvedParams?.search || "";

  const [titles, profiles] = await Promise.all([
    fetchTitles(),
    fetchProfiles(selectedTitle, selectedSearch),
  ]);

  return (
    <main>
      <h1>Profiles</h1>
      <Filters
        titles={titles}
        title={selectedTitle}
        name={selectedSearch}
      />
      <div key={`${selectedTitle}-${selectedSearch}`} className="profile-list">
        {profiles.length > 0 ? (
          profiles.map((p) => (
            <ProfileCard key={p.id} {...p} />
          ))
        ) : (
          <p>No profiles found.</p>
        )}
      </div>
    </main>
  );
}
