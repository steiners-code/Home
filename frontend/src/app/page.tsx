import Link from "next/link"

const HomePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Home Headquarters</h1>
      <p className="text-lg text-zinc-400">
        Central multi-agent system and organizational architecture.
      </p>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-semibold text-white">Application Functionality</h2>
        <p>
          This application serves as the primary internal orchestration layer for Ateeb Hussain.
          It connects various external APIs to automate routine tasks, manage isolated subordinate
          organizations, and dispatch system notifications via SMTP/Nodemailer.
        </p>
        <p>
          This is an internal, single-user system not intended for public registration or use.
        </p>
      </div>

      <div className="pt-8 border-t border-zinc-800 flex gap-4 text-sm">
        <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
        <span className="text-zinc-600">•</span>
        <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link>
      </div>
    </div>
  )
}

export default HomePage
