import { requireMember } from "@/lib/auth";

export default async function DashboardPage() {
  const member = await requireMember();

  return (
    <>
      <h1>Welcome, {member.full_name.split(" ")[0]}</h1>
      <p className="muted">Member code {member.member_code}</p>

      <div className="card">
        <h2>Your savings</h2>
        <p className="muted">
          Your contributions and standing will show here once the contributions ledger is built (Phase 2).
        </p>
      </div>
    </>
  );
}
