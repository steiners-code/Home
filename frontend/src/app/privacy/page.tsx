export default function Privacy() {
    return (
        <div className="space-y-6 max-w-none">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            <p className="text-sm text-zinc-500">Last updated: August 2026</p>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">1. Overview</h2>
                <p>
                    Home (&quot;we&quot;, &quot;our&quot;, or &quot;the Application&quot;) is a central internal automation tool.
                    This Privacy Policy explains how we collect, use, and safeguard information.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">2. Google API Services User Data Policy (Limited Use)</h2>
                <p>
                    Home&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
                    <a
                        href="https://developers.google.com/terms/api-services-user-data-policy"
                        className="text-blue-400 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Google API Services User Data Policy
                    </a>
                    , including the Limited Use requirements.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                    <li><strong>Access:</strong> The application accesses Google Workspace APIs (specifically Gmail via Nodemailer) solely for the purpose of dispatching automated internal system emails.</li>
                    <li><strong>Use:</strong> The requested scopes are used strictly to send emails on behalf of the authenticated user.</li>
                    <li><strong>Storage:</strong> The application does not read, store, or log personal emails. OAuth tokens are stored securely in our internal database to maintain the SMTP connection.</li>
                    <li><strong>Sharing:</strong> Google user data is never transferred, shared, or sold to third parties, advertising networks, or external AI models.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">3. Data Security</h2>
                <p>
                    Security procedures are in place to protect the confidentiality of your data. We use encryption to protect OAuth tokens and restrict database access exclusively to the system administrator.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">4. Contact</h2>
                <p>
                    If you have any questions regarding this privacy policy or our data handling practices, please contact the system administrator directly.
                </p>
            </section>
        </div>
    );
}