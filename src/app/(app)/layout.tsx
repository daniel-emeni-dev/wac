import Link from "next/link";
import { signOut } from "@/app/actions";
import { requireMember } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const member = await requireMember();
  const isStaff = member.role !== "member";

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <span className="brand">WAC</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="badge">{member.role}</span>
            <form action={signOut}>
              <button className="btn secondary small" type="submit">Sign out</button>
            </form>
          </span>
        </div>
        <nav className="nav">
          <Link href="/dashboard">Home</Link>
          <Link href="/profile">My profile</Link>
          {isStaff && <Link href="/members">Members</Link>}
        </nav>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
