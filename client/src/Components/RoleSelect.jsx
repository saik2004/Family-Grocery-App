export default function RoleSelect({ onChoose }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#F8FAF7] px-5 py-10">
  {/* Soft background glows */}
  <span className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
  <span className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />

  <main className="relative flex w-full max-w-sm flex-col items-center">
    {/* Brand mark */}
    <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-b from-[#16803d] to-[#166534] text-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_20px_-8px_rgba(6,78,59,0.6)] ring-1 ring-emerald-900/20">
      🛒
    </span>

    {/* Title */}
    <h1 className="mt-5 text-center leading-tight">
      <span className="font-tamil block text-3xl font-bold tracking-tight text-[#17231C] sm:text-4xl">
        நீங்கள் யார்?
      </span>
      <span className="font-english mt-1.5 block text-base font-medium text-slate-500">
        Are you Mom or Dad?
      </span>
    </h1>

    {/* Role cards */}
    <div className="mt-8 flex w-full flex-col gap-4">
      {/* Mom */}
      <button
        onClick={() => onChoose("mom")}
        className="group relative flex h-24 w-full items-center gap-4 overflow-hidden rounded-3xl border border-[#14532D] bg-gradient-to-b from-[#16803d] to-[#166534] px-4 text-left text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(6,78,59,0.3),0_12px_24px_-8px_rgba(6,78,59,0.55)] outline-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(6,78,59,0.3),0_16px_28px_-8px_rgba(6,78,59,0.6)] focus-visible:ring-4 focus-visible:ring-emerald-300 active:translate-y-0 active:scale-[0.98] sm:h-28"
      >
        <span className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl ring-1 ring-white/25 sm:h-16 sm:w-16">
          👩
        </span>
        <span className="relative min-w-0 flex-1 leading-tight">
          <span className="font-tamil block truncate text-2xl font-bold sm:text-3xl">அம்மா</span>
          <span className="font-english block text-sm font-medium text-emerald-100">Mom · List போடுபவர்</span>
        </span>
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 transition-transform duration-200 group-hover:translate-x-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </span>
      </button>

      {/* Dad */}
      <button
        onClick={() => onChoose("dad")}
        className="group relative flex h-24 w-full items-center gap-4 overflow-hidden rounded-3xl border-2 border-[#166534] bg-white px-4 text-left text-[#166534] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(15,23,42,0.06),0_12px_24px_-12px_rgba(15,23,42,0.25)] outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:ring-4 focus-visible:ring-emerald-300 active:translate-y-0 active:scale-[0.98] sm:h-28"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-3xl ring-1 ring-emerald-200 sm:h-16 sm:w-16">
          👨
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="font-tamil block truncate text-2xl font-bold sm:text-3xl">அப்பா</span>
          <span className="font-english block text-sm font-medium text-slate-500">Dad · வாங்குபவர்</span>
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200 transition-transform duration-200 group-hover:translate-x-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </span>
      </button>
    </div>

    <p className="font-tamil mt-6 text-center text-xs font-medium text-slate-400">
      ஒரு முறை தேர்வு செய்தால் போதும் · You only choose once
    </p>
  </main>
</div>
  );
}