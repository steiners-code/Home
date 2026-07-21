import Link from "next/link";

export default function Bummer404() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 text-[#e0e0e0] font-sans">
            <div className="max-w-md w-full bg-[#141414] border border-[#2a2a2a] rounded-lg p-8 text-center shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-[#e53935]/10 p-4 rounded-full border border-[#e53935]/30">
                        {/* Dependency-free SVG warning icon */}
                        <svg
                            className="w-12 h-12 text-[#e53935]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold tracking-widest text-white mb-2">
                    404 // BUMMER
                </h1>
                <h2 className="text-xs font-medium tracking-[0.2em] text-[#666666] uppercase mb-6">
                    OAuth Client Not Recognized
                </h2>

                <div className="bg-[#050505] border border-[#333333] p-5 rounded text-sm text-[#a0a0a0] mb-8 text-left leading-relaxed font-mono">
                    <p>
                        <span className="text-[#e53935] font-bold">ERROR:</span> The requested application is not registered within the HQ network.
                    </p>
                    <p className="mt-4 text-xs text-[#666666]">
                        Authorization request aborted to maintain syndicate security. Return to base.
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-block w-full bg-[#e0e0e0] text-[#0a0a0a] font-bold tracking-wide py-3 px-4 rounded hover:bg-white transition-colors duration-200"
                >
                    RETURN TO HQ
                </Link>
            </div>
        </div>
    );
}