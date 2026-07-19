import SignUp from '@/components/auth/SignUp';
import { getRedirectUrl } from '@/lib/utils';

interface SignUpPageProps {
    searchParams: Promise<{ redirectTo?: string }>;
}

const SignUpPage = async ({ searchParams }: SignUpPageProps) => {
    const resolvedParams = await searchParams;
    const params = new URLSearchParams(resolvedParams as Record<string, string>);
    const redirectUrl = getRedirectUrl(params);

    return (
        <main className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-10">
            <SignUp redirectUrl={redirectUrl} />
        </main>
    );
};

export default SignUpPage;