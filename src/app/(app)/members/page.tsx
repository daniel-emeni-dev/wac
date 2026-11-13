import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function MembersPage() {
  await requireStaff();
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("members")
    .select("id, member_code, full_name, status, role")
    .order("member_code");

  return (
    <>
      <h1>Members</h1>
      <p className="muted">{members?.length ?? 0} on record</p>
      <div className="card">
        {(members ?? []).map((m) => (
          <div className="row" key={m.id}>
            <span>
              {m.full_name} <span className="muted">{m.member_code}</span>
            </span>
            <span className="badge">{m.status}</span>
          </div>
        ))}
        {(members ?? []).length === 0 && <p className="muted">No members yet.</p>}
      </div>
      <p className="muted">Adding and editing members is the next step.</p>
    </>
  );
}
