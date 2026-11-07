import { useState, useEffect } from "react";
import api from "../api";
import ProductImage from "../Components/ProductImage";

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
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const toggleItem = async (id) => {
    try {
      const res = await api.patch(`/${id}`);
      setItems((prev) => prev.map((i) => (i._id === id ? res.data.item : i)));
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
      <header className="sticky top-0 z-10 border-b border-emerald-900/10 bg-[#166534] px-4 pb-5 pt-5 text-white shadow-lg shadow-green-900/10 sm:px-6 sm:pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              அப்பா
            </h1>

            <p className="mt-1 text-sm font-medium text-emerald-100">
              இன்றைய பட்டியல் (Today's list)
            </p>
          </div>

          <button
            onClick={onReset}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-95 sm:text-sm"
          >
            மாற்று
          </button>
        </div>

        {/* Progress */}
        {total > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-sm font-semibold">
              <span className="text-emerald-50">
                {bought.length} / {total} வாங்கியது
              </span>

              <span className="text-white">{percent}%</span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-green-950/40">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Connection error */}
      {error && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
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
                <div className="rounded-3xl border border-emerald-100 bg-white px-6 py-10 text-center shadow-sm">
                  <div className="text-5xl">{total > 0 ? "🎉" : "📭"}</div>

                  <p className="mt-4 text-xl font-bold text-[#17231C]">
                    {total > 0 ? "எல்லாம் வாங்கியாச்சு!" : "எதுவும் இல்லை"}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {total > 0 ? "All done" : "Nothing to buy yet"}
                  </p>
                </div>
              ) : (
                <ul className="space-y-3 sm:space-y-4">
                  {pending.map((item) => (
                    <li key={item._id}>
                      <button
                        onClick={() => toggleItem(item._id)}
                        className="group flex w-full items-center gap-3 rounded-2xl border border-amber-200 border-l-4 border-l-amber-500 bg-[#FFFBEB] p-3.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md active:scale-[0.98] sm:gap-4 sm:rounded-3xl sm:p-5"
                      >
                        {/* Product details */}
                        <span className="flex min-w-0 flex-1 items-center gap-3">
                          {/* Fixed square image, same size on every card */}
                          <span className="block h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-blue-50 sm:h-20 sm:w-20">
                            <ProductImage src={item.image} fill />
                          </span>

                          {/* Text column */}
                          <span className="flex min-w-0 flex-1 flex-col justify-center">
                            <span className="block truncate text-xl font-bold leading-snug tracking-tight text-[#17231C] sm:text-2xl">
                              {item.nameTa}
                            </span>

                            {item.nameEn && item.nameEn !== item.nameTa && (
                              <span className="block truncate text-xs font-medium text-slate-500 sm:text-sm">
                                {item.nameEn}
                              </span>
                            )}

                            <span className="mt-1 block text-xs font-medium text-amber-700">
                              🕒 {formatAdded(item.addedAt)}
                            </span>
                          </span>
                        </span>

                        {/* Quantity */}
                        <span className="flex h-[58px] min-w-[68px] shrink-0 flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-100 px-3 shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            Qty
                          </span>
                          <span className="mt-0.5 whitespace-nowrap text-lg font-extrabold leading-tight text-amber-900">
                            {item.quantity}
                          </span>
                        </span>

                        {/* New badge */}
                        {isNew(item) && (
                          <span className="shrink-0 rounded-full bg-amber-200 px-2 py-1 text-[10px] font-bold text-amber-900 ring-1 ring-amber-300 sm:text-xs">
                            புதியது
                          </span>
                        )}

                        {/* Bought action */}
                        <span className="flex h-[58px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 text-xs font-bold text-amber-800 shadow-sm transition-all duration-200 group-hover:border-emerald-500 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-active:scale-95 sm:px-4 sm:text-sm">
                          வாங்கியது
                          <span className="text-base">✓</span>
                        </span>
                      </button>
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
                        className="relative flex w-full items-center gap-3 rounded-2xl border border-emerald-200 bg-[#ECFDF5] p-3.5 pr-4 text-left transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100/70 active:scale-[0.98] sm:rounded-2xl sm:p-4"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-sm ring-4 ring-emerald-100">
                          ✓
                        </span>

                        <span className="flex min-w-0 flex-1 items-center gap-3">
                          {/* Small fixed square image */}
                          <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white opacity-80 sm:h-14 sm:w-14">
                            <ProductImage src={item.image} fill />
                          </span>

                          {/* Text column */}
                          <span className="flex min-w-0 flex-1 flex-col justify-center">
                            <span className="block truncate text-base font-semibold leading-snug text-emerald-900/60 line-through decoration-emerald-500 sm:text-lg">
                              {item.nameTa}
                            </span>

                            <span className="block truncate text-xs text-emerald-700/70">
                              {item.nameEn && item.nameEn !== item.nameTa
                                ? `${item.nameEn} · `
                                : ""}
                              {item.quantity}
                            </span>

                            <span className="mt-0.5 block text-[11px] font-medium text-emerald-700">
                              ✓ {formatAdded(item.boughtAt)}
                            </span>
                          </span>
                        </span>

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
    </div>
  );
}
