import { requireMember } from "@/lib/auth";

export default async function ProfilePage() {
  const member = await requireMember();

  return (
    <>
      <h1>My profile</h1>
      <div className="card">
        <div className="row"><span className="muted">Name</span><span>{member.full_name}</span></div>
        <div className="row"><span className="muted">Member code</span><span>{member.member_code}</span></div>
        <div className="row"><span className="muted">Email</span><span>{member.email}</span></div>
        <div className="row"><span className="muted">Status</span><span>{member.status}</span></div>
      </div>
      <p className="muted">Editing your details, bank information and next of kin comes in the next step.</p>
    </>
  );
}
