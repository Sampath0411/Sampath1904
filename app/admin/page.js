import Login from "@/components/admin/Login";
import AdminPanel from "@/components/admin/AdminPanel";
import { isAuthenticated } from "@/lib/auth";
import { getMessages, getProjects, getSite } from "@/lib/data";

export const dynamic = "force-dynamic";

// noindex: robots.txt already disallows /admin, but a disallowed URL can still
// get indexed if it's linked elsewhere — belt and braces on a login page.
export const metadata = {
  title: "Admin | Sampath",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) return <Login />;

  return (
    <main>
      <AdminPanel
        initialSite={await getSite()}
        initialProjects={await getProjects()}
        initialMessages={await getMessages()}
      />
    </main>
  );
}
