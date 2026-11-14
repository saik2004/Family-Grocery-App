import { useState, useEffect } from "react";
import api from "../api";
import ProductImage from "../Components/ProductImage";
import OfflineBanner from "./OfflineBanner";
import useOnline from "../hooks/useOnline";

const SPARKS = [
  { l: "12%", d: "0s", c: "bg-amber-400" },
  { l: "28%", d: "0.5s", c: "bg-emerald-400" },
  { l: "44%", d: "1.1s", c: "bg-lime-400" },
  { l: "60%", d: "0.3s", c: "bg-amber-500" },
  { l: "76%", d: "0.9s", c: "bg-emerald-500" },
  { l: "90%", d: "1.5s", c: "bg-lime-500" },
];

const formatAdded = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const isSameDay = (a, b) => a.toDateString() === b.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return `இன்று ${time}`;
  if (isSameDay(date, yesterday)) return `நேற்று ${time}`;

  const day = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  return `${day}, ${time}`;
};

export default function DadView({ onReset }) {
  const online = useOnline();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toIgnore, setToIgnore] = useState(null); // the item being confirmed

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/");
        setItems(res.data.items);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
    const timer = setInterval(fetchItems, 8000);
    return () => clearInterval(timer);
  }, [online]);

  const toggleItem = async (id) => {
    try {
      const res = await api.patch(`/${id}`);
      setItems((prev) => prev.map((i) => (i._id === id ? res.data.item : i)));
    } catch (err) {
      setError(true);
    }
  };

  const confirmIgnore = async () => {
    if (!toIgnore) return;
    const id = toIgnore._id;
    setToIgnore(null);
    try {
      await api.delete(`/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      setError(true);
    }
  };

  const pending = items.filter((i) => i.status === "pending");
  const bought = items.filter((i) => i.status === "bought");
  const total = items.length;
  const percent = total === 0 ? 0 : Math.round((bought.length / total) * 100);

  // Items added in the last 2 minutes get a "NEW" badge
  const isNew = (item) =>
    Date.now() - new Date(item.addedAt).getTime() < 2 * 60 * 1000;

  return (
    <div className="min-h-screen bg-[#F8FAF7] pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 overflow-hidden border-b border-emerald-900/40 bg-gradient-to-b from-[#16803d] to-[#166534] px-4 pb-4 pt-3.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(22,101,52,0.2),0_8px_20px_-6px_rgba(22,101,52,0.45)] sm:px-6 sm:pb-5 sm:pt-4">
        {/* Soft glow */}
        <span className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        {/* Top row */}
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-white/25 sm:h-12 sm:w-12 sm:text-2xl">
              👨
            </span>
            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-xl font-extrabold tracking-tight sm:text-2xl">
                அப்பா
              </h1>
              <p className="truncate text-xs font-semibold text-emerald-100/90 sm:text-sm">
                இன்றைய பட்டியல் · Today's list
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            aria-label="Change role"
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_2px_rgba(0,0,0,0.15)] outline-none backdrop-blur transition hover:border-white/50 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-emerald-200 active:scale-95"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3l4 4-4 4M21 7H8M7 21l-4-4 4-4M3 17h13" />
            </svg>
            மாற்று
          </button>
        </div>

        {/* Progress */}
        {total > 0 && (
          <div className="relative mt-4 rounded-2xl border border-white/15 bg-black/10 px-3.5 py-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2 text-emerald-50">
                <span className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-white/15 px-1.5 text-xs font-extrabold ring-1 ring-white/20">
                  {bought.length}/{total}
                </span>
                வாங்கியது
              </span>
              <span className="text-base font-extrabold tabular-nums">
                {percent}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2.5 overflow-hidden rounded-full bg-green-950/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
            >
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-400 shadow-[0_0_10px_rgba(110,231,183,0.7)] transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <OfflineBanner />

      {/* Connection error */}
      {error && online && (
        <div className="bg-red-500 px-4 py-2 text-center text-sm font-medium text-white">
          இணைப்பு இல்லை (Can't reach server)
        </div>
      )}

      <main className="mx-auto max-w-2xl space-y-8 p-4 sm:p-6">
        {loading ? (
          <p className="pt-16 text-center text-sm font-medium text-slate-400">
            ஏற்றுகிறது...
          </p>
        ) : (
          <>
            {/* To buy */}
            <section>
              <h2 className="mb-4 flex items-center gap-3 text-lg font-extrabold tracking-tight text-[#17231C] sm:text-xl">
                வாங்க வேண்டியவை
                <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-bold text-white shadow-sm shadow-amber-900/10">
                  {pending.length}
                </span>
              </h2>

              {pending.length === 0 ? (
                total > 0 ? (
                  <div className="animate-pop relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50 via-white to-amber-50 px-6 pb-8 pt-10 text-center shadow-[0_1px_2px_rgba(22,101,52,0.08),0_16px_32px_-16px_rgba(22,101,52,0.35)]">
                    {SPARKS.map((s, i) => (
                      <span
                        key={i}
                        className={`animate-float-up pointer-events-none absolute bottom-6 h-2 w-2 rounded-sm ${s.c}`}
                        style={{ left: s.l, animationDelay: s.d }}
                      />
                    ))}

                    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-amber-300/40 blur-xl" />
                      <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-5xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_24px_-8px_rgba(180,83,9,0.55)] ring-4 ring-amber-100">
                        <svg
                          width="56"
                          height="56"
                          viewBox="0 0 64 64"
                          fill="none"
                          className="relative"
                        >
                          <path
                            d="M16 33 L28 45 L48 21"
                            stroke="white"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-draw"
                          />
                        </svg>
                      </span>
                    </div>

                    <p className="relative mt-5 text-2xl font-extrabold tracking-tight text-[#17231C]">
                      எல்லாம் வாங்கியாச்சு!
                    </p>
                    <p className="relative mt-1 text-sm font-semibold text-emerald-700">
                      All done · நன்றி அப்பா 👏
                    </p>

                    <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#166534] text-xs text-white">
                        ✓
                      </span>
                      {total} / {total} வாங்கியது
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-3xl ring-1 ring-slate-200">
                      📭
                    </div>
                    <p className="mt-4 text-lg font-bold text-[#17231C]">
                      எதுவும் இல்லை
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Nothing to buy yet · அம்மா அனுப்பியதும் இங்கே வரும்
                    </p>
                  </div>
                )
              ) : (
                <ul className="space-y-3 sm:space-y-4">
                  {pending.map((item) => (
                    <li key={item._id}>
                      <div className="group flex w-full items-center gap-2.5 rounded-xl border border-amber-200 border-l-4 border-l-amber-500 bg-[#FFFBEB] p-2 shadow-[0_1px_2px_rgba(180,83,9,0.08)] transition-all duration-200 hover:bg-amber-50 sm:gap-3 sm:p-2.5">
                        {/* Tap area: image + text (marks as bought) */}
                        <button
                          onClick={() => toggleItem(item._id)}
                          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg text-left outline-none focus-visible:ring-4 focus-visible:ring-amber-200 active:scale-[0.98] sm:gap-3"
                        >
                          <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-amber-900/10 sm:h-14 sm:w-14">
                            <ProductImage src={item.image} fill />
                          </span>

                          <span className="flex min-w-0 flex-1 flex-col leading-tight">
                            {/* Tamil name */}
                            <span className="line-clamp-2 break-words text-base font-bold tracking-tight text-[#17231C] sm:text-lg">
                              {item.nameTa}
                            </span>

                            {/* English name */}
                            {item.nameEn && item.nameEn !== item.nameTa && (
                              <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500 sm:text-sm">
                                {item.nameEn}
                              </span>
                            )}

                            {/* Meta row */}
                            <span className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-amber-700">
                              <span className="truncate">
                                🕒 {formatAdded(item.addedAt)}
                              </span>
                              {isNew(item) && (
                                <span className="shrink-0 rounded-full bg-amber-200 px-1.5 py-px text-[9px] font-bold text-amber-900 ring-1 ring-amber-300">
                                  புதியது
                                </span>
                              )}
                            </span>
                          </span>
                        </button>

                        {/* Qty */}
                        <span className="flex h-10 min-w-[48px] shrink-0 flex-col items-center justify-center rounded-lg border border-amber-200 bg-amber-100 px-1.5 leading-none">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-amber-700">
                            Qty
                          </span>
                          <span className="mt-0.5 whitespace-nowrap text-sm font-extrabold text-amber-900">
                            {item.quantity}
                          </span>
                        </span>

                        {/* Bought */}
                        <button
                          onClick={() => toggleItem(item._id)}
                          aria-label="Mark as bought"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-300 bg-white text-base font-bold text-amber-800 outline-none transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-300 active:scale-90"
                        >
                          ✓
                        </button>

                        {/* Ignore */}
                        <button
                          onClick={() => setToIgnore(item)}
                          aria-label="Ignore item"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-500 outline-none transition-all duration-200 hover:border-rose-300 hover:bg-rose-100 focus-visible:ring-2 focus-visible:ring-rose-300 active:scale-90"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Bought */}
            {bought.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-emerald-800 sm:text-lg">
                  வாங்கியது
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                    {bought.length}
                  </span>
                </h2>

                <ul className="space-y-2.5">
                  {bought.map((item) => (
                    <li key={item._id}>
                      <button
                        onClick={() => toggleItem(item._id)}
                        aria-label="Undo bought"
                        className="group flex w-full items-center gap-2.5 rounded-xl border border-emerald-200 border-l-4 border-l-emerald-600 bg-[#ECFDF5] p-2 text-left shadow-[0_1px_2px_rgba(22,101,52,0.08)] outline-none transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100/70 focus-visible:ring-4 focus-visible:ring-emerald-200 active:scale-[0.98] sm:gap-3 sm:p-2.5"
                      >
                        {/* Image with tick badge */}
                        <span className="relative block h-12 w-12 shrink-0 sm:h-14 sm:w-14">
                          <span className="block h-full w-full overflow-hidden rounded-lg bg-white opacity-80 ring-1 ring-emerald-900/10">
                            <ProductImage src={item.image} fill />
                          </span>
                          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white shadow-sm ring-2 ring-[#ECFDF5]">
                            ✓
                          </span>
                        </span>

                        {/* Text column */}
                        <span className="flex min-w-0 flex-1 flex-col leading-tight">
                          {/* Tamil name */}
                          <span className="line-clamp-2 break-words text-base font-bold tracking-tight text-emerald-900/60 line-through decoration-emerald-500 sm:text-lg">
                            {item.nameTa}
                          </span>

                          {/* English name */}
                          {item.nameEn && item.nameEn !== item.nameTa && (
                            <span className="mt-0.5 block truncate text-xs font-semibold text-emerald-800/70 sm:text-sm">
                              {item.nameEn}
                            </span>
                          )}

                          {/* Meta row */}
                          <span className="mt-1 flex min-w-0 items-center gap-1.5">
                            <span className="shrink-0 whitespace-nowrap rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-800 ring-1 ring-emerald-200">
                              × {item.quantity}
                            </span>
                            <span className="truncate text-[11px] font-medium text-emerald-700">
                              {formatAdded(item.boughtAt)}
                            </span>
                          </span>
                        </span>

                        {/* Status pill */}
                        <span className="shrink-0 rounded-full bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                          Bought
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-center text-xs font-medium text-slate-400">
                  தவறாக தொட்டால் மீண்டும் தொடவும் (Tap again to undo)
                </p>
              </section>
            )}
          </>
        )}
      </main>

      {toIgnore && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ignore-title"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setToIgnore(null)}
            className="animate-fade-in absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
          />

          {/* Sheet */}
          <div className="animate-sheet-up relative w-full max-w-md rounded-t-3xl border border-slate-200 bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_-8px_rgba(15,23,42,0.3)] sm:rounded-3xl sm:pb-5">
            <span className="mx-auto mb-4 block h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" />

            <div className="flex items-center gap-3">
              <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
                <ProductImage src={toIgnore.image} fill />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-lg font-extrabold text-[#17231C]">
                  {toIgnore.nameTa}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  Qty · {toIgnore.quantity}
                </p>
              </div>
            </div>

            <h3
              id="ignore-title"
              className="mt-4 text-xl font-extrabold tracking-tight text-[#17231C]"
            >
              இது தேவையில்லையா?
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              பட்டியலில் இருந்து நீக்கப்படும் · Remove from the list?
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setToIgnore(null)}
                className="h-12 rounded-2xl border border-slate-300 bg-white text-base font-bold text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-slate-200 active:scale-95"
              >
                வேண்டாம்
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Keep
                </span>
              </button>
              <button
                type="button"
                onClick={confirmIgnore}
                className="h-12 rounded-2xl border border-rose-700 bg-gradient-to-b from-rose-500 to-rose-600 text-base font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_16px_-6px_rgba(190,18,60,0.55)] outline-none transition focus-visible:ring-4 focus-visible:ring-rose-200 active:scale-95"
              >
                நீக்கு
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-rose-100">
                  Remove
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
