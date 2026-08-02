import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Exact match for the OAuth App Name */}
      <h1 className="text-4xl font-bold text-white">Home</h1>

      {/* Clear, explicit purpose statement for automated Google reviewers */}
      <p className="text-xl text-zinc-300 font-medium">
        Home is a centralized internal workflow automation and task management application designed for Ateeb Hussain.
      </p>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4 text-zinc-300">
        <h2 className="text-2xl font-semibold text-white">Core Functionality</h2>
        <p>
          The primary purpose of the Home application is to orchestrate backend workflows, handle automated task routing, and dispatch secure system email notifications via Gmail API integrations.
        </p>
        <p>
          This is a private, single-user system restricted exclusively to the system administrator and is not open to public registration or commercial use.
        </p>
      </div>

      <div className="pt-8 border-t border-zinc-800 flex gap-4 text-sm">
        <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
        <span className="text-zinc-600">•</span>
        <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link>
      </div>
    </div>
  );
}