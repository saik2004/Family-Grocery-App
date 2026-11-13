import { useEffect } from "react";
import ProductImage from "./ProductImage";

const CONFETTI = [
  { x: "-92px", y: "-70px", c: "bg-emerald-500" },
  { x: "-60px", y: "-104px", c: "bg-amber-400" },
  { x: "-10px", y: "-118px", c: "bg-lime-400" },
  { x: "48px", y: "-104px", c: "bg-emerald-400" },
  { x: "90px", y: "-66px", c: "bg-amber-500" },
  { x: "104px", y: "-14px", c: "bg-lime-500" },
  { x: "-104px", y: "-12px", c: "bg-amber-300" },
  { x: "-80px", y: "34px", c: "bg-emerald-300" },
  { x: "82px", y: "36px", c: "bg-emerald-600" },
];

export default function SentSuccess({ created, skipped, onDone }) {
  // Go back to Mom's screen after 5 seconds
  useEffect(() => {
    const timer = setTimeout(onDone, 10000);
    return () => clearTimeout(timer);
  }, [onDone]);

  const allSkipped = created.length === 0;
  const sentAt = new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
  <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#F8FAF7]">
    {/* Background glow */}
    <div
      className={`pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${
        allSkipped ? "bg-amber-200/60" : "bg-emerald-200/70"
      }`}
    />

    <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 pb-6 pt-10 sm:px-6 sm:pt-14">
      {/* Hero */}
      <div className="relative flex h-28 w-28 items-center justify-center">
        {!allSkipped && (
          <>
            <span className="animate-ripple absolute inset-0 rounded-full bg-emerald-400/40" />
            {CONFETTI.map((p, i) => (
              <span
                key={i}
                className={`animate-burst absolute left-1/2 top-1/2 h-2 w-2 rounded-sm ${p.c}`}
                style={{ "--x": p.x, "--y": p.y, animationDelay: `${0.35 + i * 0.03}s` }}
              />
            ))}
          </>
        )}

        <div
          className={`animate-pop relative flex h-24 w-24 items-center justify-center rounded-full ring-8 ${
            allSkipped
              ? "bg-gradient-to-b from-amber-400 to-amber-600 ring-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_14px_28px_-8px_rgba(180,83,9,0.55)]"
              : "bg-gradient-to-b from-[#16a34a] to-[#166534] ring-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_14px_28px_-8px_rgba(6,78,59,0.6)]"
          }`}
        >
          {allSkipped ? (
            <span className="text-5xl font-bold text-white">!</span>
          ) : (
            <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
              <path
                d="M16 33 L28 45 L48 21"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Heading */}
      <h1 className="animate-rise mt-6 text-center text-2xl font-extrabold leading-tight tracking-tight text-[#17231C] sm:text-3xl">
        {allSkipped ? "ஏற்கனவே பட்டியலில் உள்ளது" : "அப்பாவுக்கு அனுப்பப்பட்டது!"}
      </h1>
      <p className="animate-rise mt-1.5 text-center text-sm font-medium text-slate-500">
        {allSkipped ? "Already in Dad's list" : "Successfully sent to Dad"}
      </p>

      {/* Summary chips */}
      <div className="animate-rise mt-4 flex flex-wrap items-center justify-center gap-2">
        {created.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {created.length} அனுப்பப்பட்டது · sent
          </span>
        )}
        {skipped.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {skipped.length} ஏற்கனவே · existing
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
          🕒 {sentAt}
        </span>
      </div>

      {/* Receipt */}
      <div className="animate-rise relative mt-7 w-full">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05),0_18px_36px_-16px_rgba(15,23,42,0.22)]">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-lime-50 px-4 py-3.5 sm:px-5">
            <div className="leading-tight">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800">
                Order Summary
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                அனுப்பிய பொருட்கள்
              </p>
            </div>
            <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-[#166534] px-2 text-sm font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              {created.length}
            </span>
          </div>

          {/* Perforation */}
          <div className="relative">
            <div className="border-t-2 border-dashed border-slate-200" />
            <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-[#F8FAF7]" />
            <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-[#F8FAF7]" />
          </div>

          {/* Items */}
          {created.length > 0 && (
            <ul className="max-h-[38dvh] divide-y divide-slate-100 overflow-y-auto px-4 sm:px-5">
              {created.map((item, i) => (
                <li
                  key={item._id}
                  className="animate-rise flex min-w-0 items-center gap-3 py-3"
                  style={{ animationDelay: `${0.7 + i * 0.07}s` }}
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-emerald-50 ring-1 ring-emerald-900/10 shadow-[0_1px_3px_rgba(22,101,52,0.12)]">
                    <ProductImage src={item.image} fill />
                  </div>

                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-base font-bold text-[#17231C]">
                      {item.nameTa}
                    </p>
                    {item.nameEn && item.nameEn !== item.nameTa && (
                      <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                        {item.nameEn}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 whitespace-nowrap rounded-xl bg-emerald-50 px-3 py-2 text-sm font-extrabold text-[#166534] ring-1 ring-emerald-200">
                    × {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Skipped */}
          {skipped.length > 0 && (
            <div className="m-4 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 sm:mx-5">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[11px]">
                  !
                </span>
                ஏற்கனவே உள்ளவை
                <span className="text-xs font-medium text-amber-700">· Already in list</span>
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {skipped.map((name) => (
                  <span
                    key={name}
                    className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold text-amber-900"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-dashed border-slate-200 bg-slate-50/70 px-4 py-2.5">
            <p className="text-center text-[11px] font-medium tracking-wide text-slate-400">
              Family Grocery
            </p>
          </div>
        </div>
      </div>
    </main>

    {/* Sticky action bar with built-in countdown */}
    <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/90 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-6">
      <button
        onClick={onDone}
        className="relative mx-auto flex h-14 w-full max-w-md items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[#14532D] bg-gradient-to-b from-[#16803d] to-[#166534] text-lg font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(6,78,59,0.3),0_8px_18px_-6px_rgba(6,78,59,0.55)] outline-none transition active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-emerald-200"
      >
        <span className="animate-shrink absolute inset-y-0 left-0 bg-white/15" />
        <span className="relative">சரி · Done</span>
        <svg className="relative" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  </div>
);
}
