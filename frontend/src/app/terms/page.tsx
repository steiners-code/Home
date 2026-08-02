export default function Terms() {
    return (
        <div className="space-y-6 max-w-none">
            <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
            <p className="text-sm text-zinc-500">Last updated: August 2026</p>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
                <p>
                    By accessing and using the Home system, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
                <p>
                    The application is a proprietary, central internal tool built for workflow automation, agentic task management, and system notifications. It is not available for public use or commercial resale.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">3. Access and Security</h2>
                <p>
                    Access is strictly limited to authorized personnel (Ateeb Hussain). Any attempt to bypass security measures, reverse engineer the platform, or exploit the external API connections is strictly prohibited.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">4. Modifications</h2>
                <p>
                    We reserve the right to modify or discontinue the service with or without notice at any time.
                </p>
            </section>
        </div>
    );
}