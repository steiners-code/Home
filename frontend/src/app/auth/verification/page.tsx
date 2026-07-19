import EmailVerification from "@/components/auth/EmailVerification";

interface VerificationPageProps {
    searchParams: Promise<{
        from?: string;
        userId?: string;
        email?: string;
        redirectTo?: string;
    }>;
}

const VerificationPage = async ({ searchParams }: VerificationPageProps) => {
    const { from, redirectTo, userId, email } = await searchParams;

    return (
        <main className="min-h-screen min-w-screen flex items-center justify-center bg-muted/40 px-4 py-10">
            <EmailVerification
                from={from ?? "signup"}
                redirectTo={redirectTo ?? "/dashboard"}
                userId={userId ?? ""}
                email={email ?? ""}
            />
        </main>
    );
};

export default VerificationPage;