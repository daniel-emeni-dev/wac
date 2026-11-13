import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/app/actions";
import { getCurrentMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const MESSAGES: Record<string, string> = {
  missing: "Enter your email and password.",
  invalid: "Email or password is not correct.",
  link: "That link has expired. Request a new one.",
  no_member: "Your login is not linked to a WAC member profile yet. Please contact leadership.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const member = await getCurrentMember();
    if (member) redirect("/dashboard");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="card">
          <h1>Wealth Accountability Circle</h1>
          <p className="muted">Sign in to see your savings and standing.</p>

          {error && MESSAGES[error] && <div className="notice error">{MESSAGES[error]}</div>}

          {user ? (
            <form action={signOut}>
              <button className="btn secondary" type="submit">Sign out</button>
            </form>
          ) : (
            <form action={signIn}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required />

              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required />

              <button className="btn" type="submit">Sign in</button>
            </form>
          )}
        </div>
        {!user && (
          <p className="muted" style={{ textAlign: "center" }}>
            <Link href="/forgot-password">Forgot your password?</Link>
          </p>
        )}
      </div>
    </div>
  );
}
