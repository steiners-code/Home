import { getRedirectUrl } from "@/lib/utils";
import SignIn from "@/components/auth/SignIn";

interface LogInPageProps {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function LoginPage({ searchParams }: LogInPageProps) {
  const resolvedParams = await searchParams;
  const params = new URLSearchParams(resolvedParams as Record<string, string>);
  const redirectUrl = getRedirectUrl(params);

  return (
    <main className="min-h-screen w-screen flex items-center justify-center bg-muted/40 px-4">
      <SignIn redirectUrl={redirectUrl} />
    </main>
  );
}