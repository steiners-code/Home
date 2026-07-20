import { getEmail } from "@/actions/auth/verify-email";
import EmailVerification from "@/components/auth/EmailVerification";

interface VerificationPageProps {
    searchParams: Promise<{
        from?: string;
        token?: string;
        redirectTo?: string;
    }>;
}

const VerificationPage = async ({ searchParams }: VerificationPageProps) => {
    const { from, redirectTo, token } = await searchParams;

    let email: string = "";
    if (token) email = await getEmail(token);

    return (
        <main className="min-h-screen min-w-screen flex items-center justify-center bg-muted/40 px-4 py-10">
            <EmailVerification
                from={from ?? "signup"}
                redirectTo={redirectTo ?? "/main"}
                token={token ?? ""}
                email={email ?? ""}
            />
        </main>
    );
};

export default VerificationPage;