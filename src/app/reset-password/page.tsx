import { updatePassword } from "@/app/actions";

const MESSAGES: Record<string, string> = {
  short: "Use at least 8 characters.",
  mismatch: "The two passwords do not match.",
  failed: "Could not update your password. Request a new reset link and try again.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="card">
          <h1>Set a new password</h1>
          <p className="muted">Choose a password you have not used elsewhere.</p>

          {error && MESSAGES[error] && <div className="notice error">{MESSAGES[error]}</div>}

          <form action={updatePassword}>
            <label htmlFor="password">New password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />

            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />

            <button className="btn" type="submit">Save password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
