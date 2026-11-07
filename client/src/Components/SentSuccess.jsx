import { useEffect } from "react";
import ProductImage from "./ProductImage";

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
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#F8FAF7] px-5 pb-10 pt-12 sm:pt-16">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-64 h-48 w-48 rounded-full bg-lime-100/40 blur-3xl" />

      {/* Animated circle + tick */}
      <div
        className={`animate-pop relative z-10 flex h-28 w-28 items-center justify-center rounded-full shadow-xl ring-8 ${
          allSkipped
            ? "bg-amber-500 shadow-amber-500/20 ring-amber-100"
            : "bg-[#166534] shadow-emerald-900/20 ring-emerald-100"
        }`}
      >
        {allSkipped ? (
          <span className="text-5xl font-bold text-white">!</span>
        ) : (
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
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

      {/* Confirmation heading */}
      <h1 className="animate-rise relative z-10 mt-7 text-center text-2xl font-extrabold tracking-tight text-[#17231C] sm:text-3xl">
        {allSkipped
          ? "ஏற்கனவே பட்டியலில் உள்ளது"
          : "அப்பாவுக்கு அனுப்பப்பட்டது!"}
      </h1>

      <p className="animate-rise relative z-10 mt-2 text-center text-sm font-medium text-slate-500">
        {allSkipped ? "Already in Dad's list" : "Successfully sent to Dad"} ·{" "}
        {sentAt}
      </p>

      {/* Details card */}
      <div className="animate-rise relative z-10 mt-9 w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-green-900/5">
        {/* Receipt header */}
        <div className="border-b border-dashed border-gray-200 bg-emerald-50/70 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">
            Order Summary
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">
            உங்கள் அனுப்பிய பொருட்கள்
          </p>
        </div>

        <div className="p-5">
          {created.length > 0 && (
            <>
              <p className="mb-3 flex items-center justify-between text-sm font-bold text-[#17231C]">
                அனுப்பியவை
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  {created.length} Items
                </span>
              </p>

              <ul className="divide-y divide-gray-100">
                {created.map((item) => (
                  <li
                    key={item._id}
                    className="flex min-w-0 items-center gap-3 py-3"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-green-50">
                      <ProductImage src={item.image} fill />
                    </div>

                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-base font-bold leading-snug text-[#17231C]">
                        {item.nameTa}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-slate-400">
                        {item.nameEn}
                      </span>
                    </span>

                    <span className="shrink-0 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-extrabold text-[#166534] ring-1 ring-emerald-100">
                      × {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {skipped.length > 0 && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs">
                  !
                </span>
                ஏற்கனவே உள்ளவை
              </p>

              <p className="mt-2 text-xs font-medium text-amber-700">
                Already in list
              </p>

              <p className="mt-2 break-words text-sm leading-relaxed text-amber-900">
                {skipped.join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Receipt footer */}
        <div className="border-t border-dashed border-gray-200 bg-[#FAFCF9] px-5 py-3">
          <p className="text-center text-xs font-medium text-slate-400">
            Fresh Organic · Family Grocery
          </p>
        </div>
      </div>

      {/* Done button */}
      <button
        onClick={onDone}
        className="animate-rise relative z-10 mt-8 w-full max-w-md rounded-2xl bg-[#166534] py-4 text-lg font-bold text-white shadow-lg shadow-green-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#14532D] hover:shadow-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
      >
        சரி (Done)
      </button>

      {/* Countdown bar */}
      <div className="relative z-10 mt-5 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-emerald-100">
        <div className="animate-shrink h-full rounded-full bg-emerald-600" />
      </div>
    </div>
  );
}
