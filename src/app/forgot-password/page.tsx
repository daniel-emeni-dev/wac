import Link from "next/link";
import { requestPasswordReset } from "@/app/actions";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="card">
          <h1>Reset your password</h1>
          <p className="muted">We will email you a link to set a new password.</p>

          {sent && (
            <div className="notice info">
              If that email belongs to a member, a reset link is on its way. Check your spam folder too.
            </div>
          )}
          {error && <div className="notice error">Enter your email address.</div>}

          <form action={requestPasswordReset}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
            <button className="btn" type="submit">Send reset link</button>
          </form>
        </div>
        <p className="muted" style={{ textAlign: "center" }}>
          <Link href="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
