import { useState, useEffect } from "react";
import api, { productApi } from "../api";
import SentSuccess from "./SentSuccess";
import { resizeToSquare } from "../utils/resizeImage";
import ProductImage from "../Components/ProductImage";
import AddProduct from "../Components/AddProduct";
import OfflineBanner from "./OfflineBanner";
import useOnline from "../hooks/useOnline";

const QTY_OPTIONS = [
  // Weight
  "250 g",
  "500 g",
  "750 g",
  "1 kg",
  "1.5 kg",
  "2 kg",
  "2.5 kg",
  "3 kg",

  // Liquid
  "250 ml",
  "500 ml",
  "750 ml",
  "1 liter",
  "2 liter",

  // Count (1 to 20)
  ...Array.from({ length: 20 }, (_, i) => String(i + 1)),
];

const DRAFT_KEY = "momDraft";
const TWO_HOURS = 2 * 60 * 60 * 1000;

const loadDraft = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (!saved) return [];

    const expired = Date.now() - saved.savedAt > TWO_HOURS;
    if (expired) {
      localStorage.removeItem(DRAFT_KEY);
      return [];
    }
    return saved.items;
  } catch {
    return [];
  }
};

export default function MomView({ onReset }) {
  const online = useOnline();
  const [products, setProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const [box, setBox] = useState(loadDraft);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const [photo, setPhoto] = useState(null);
  const [fileKey, setFileKey] = useState(0); // used to clear the file input
  const [showAdd, setShowAdd] = useState(false);
  const [openQty, setOpenQty] = useState(null); // nameTa of the row whose picker is open

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.get("/");
        setProducts(res.data.products);
      } catch (err) {
        setMessage("பொருட்களை ஏற்ற முடியவில்லை (Can't load products)");
      } finally {
        setLoadingCatalog(false);
      }
    };
    fetchProducts();
  }, [refreshKey,online]); // re-runs whenever refreshKey changes

  useEffect(() => {
    if (box.length === 0) {
      localStorage.removeItem(DRAFT_KEY);
    } else {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ items: box, savedAt: Date.now() }),
      );
    }
  }, [box]);

  const addToBox = (item) => {
    const alreadyInBox = box.some((b) => b.nameTa === item.nameTa);
    if (alreadyInBox) return;
    setBox([...box, { ...item, quantity: "1" }]);
  };

  const changeQty = (nameTa, quantity) => {
    setBox(box.map((b) => (b.nameTa === nameTa ? { ...b, quantity } : b)));
  };

  const removeFromBox = (nameTa) => {
    setBox(box.filter((b) => b.nameTa !== nameTa));
  };

  const sendToDad = async () => {
    try {
      setSending(true);
      setMessage("");
      const res = await api.post("/bulk", { items: box });
      setBox([]);
      setResult({ created: res.data.created, skipped: res.data.skipped });
    } catch (err) {
      setMessage(
        "அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும். (Failed, try again)",
      );
    } finally {
      setSending(false);
    }
  };

  if (result) {
    return (
      <SentSuccess
        created={result.created}
        skipped={result.skipped}
        onDone={() => setResult(null)}
      />
    );
  }

  if (showAdd) {
    return (
      <AddProduct
        onBack={() => setShowAdd(false)}
        onAdded={() => {
          setRefreshKey((k) => k + 1); // reload the grid
          setShowAdd(false); // back to Mom's screen
        }}
      />
    );
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#F8FAF7]">
      {/* Header */}
      <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 overflow-hidden border-b border-emerald-900/40 bg-gradient-to-b from-[#16803d] to-[#166534] px-4 py-3.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(22,101,52,0.2),0_8px_20px_-6px_rgba(22,101,52,0.45)] sm:px-6 sm:py-4">
        {/* Soft decorative glow */}
        <span className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        {/* Left: avatar + title */}
        <div className="relative flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-white/25 sm:h-12 sm:w-12 sm:text-2xl">
            👩
          </span>

          <div className="min-w-0 leading-tight">
            <h1 className="font-tamil truncate text-xl font-bold tracking-tight sm:text-2xl">
              அம்மா
            </h1>
            <p className="font-tamil truncate text-xs font-semibold text-emerald-100/90 sm:text-sm">
              தேவையான பொருட்களை தொடவும்
            </p>
          </div>
        </div>

        {/* Right: switch role */}
        <button
          onClick={onReset}
          aria-label="Change role"
          className="font-tamil relative flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_2px_rgba(0,0,0,0.15)] outline-none backdrop-blur transition hover:border-white/50 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-emerald-200 active:scale-95"
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
          <span>மாற்று</span>
          <span className="hidden text-xs font-medium text-emerald-100/80 min-[400px]:inline">
            Change
          </span>
        </button>
      </header>

      <OfflineBanner />

      {/* Main Content */}
      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden px-3 pt-4 sm:px-5">
        {/* Catalog */}
        <section className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain  pb-4">
          <div className="flex shrink-0 items-center justify-between mt-1 mb-3">
            <h2 className="font-tamil text-xl font-bold tracking-tight text-[#17231C] sm:text-lg">
              பொருட்கள்
            </h2>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-gradient-to-b from-emerald-600 to-emerald-800 px-4 py-2 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(6,78,59,0.3),0_6px_14px_-4px_rgba(6,78,59,0.5)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:from-emerald-500 hover:to-emerald-700 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(6,78,59,0.3),0_10px_20px_-4px_rgba(6,78,59,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 active:translate-y-0 active:scale-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] mr-2"
            >
              <span className="text-lg leading-none">+</span> சேர்
            </button>
          </div>

          {loadingCatalog ? (
            <p className="py-10 text-center text-sm text-slate-400">
              ஏற்றுகிறது... (Loading)
            </p>
          ) : products.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              பொருட்கள் இல்லை. "சேர்" பொத்தானை தொடவும். (No products yet)
            </p>
          ) : (
            <div className="grid grid-cols-4 auto-rows-fr content-start gap-2 sm:gap-3">
              {products.map((item) => {
                const inBox = box.some((b) => b.nameTa === item.nameTa);

                return (
                  <button
                    key={item.nameTa}
                    onClick={() => addToBox(item)}
                    className={`relative flex h-full w-full min-w-0 flex-col items-stretch gap-1.5 overflow-hidden rounded-2xl border p-1.5 text-center transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:scale-95 sm:p-2 ${
                      inBox
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-gray-100 bg-white shadow-sm hover:border-emerald-200"
                    }`}
                  >
                    {/* Same square for every card */}
                    <div className="aspect-square w-full overflow-hidden rounded-xl">
                      <ProductImage src={item.image} fill />
                    </div>

                    {/* Fixed two-line text block, same height on every card */}
                    <div className="flex min-w-0 flex-col gap-0.5 px-0.5">
                      <span className="block truncate text-xs font-semibold leading-snug text-[#17231C] sm:text-sm">
                        {item.nameTa}
                      </span>
                      <span className="block h-3.5 truncate text-[10px] leading-tight text-slate-500 sm:h-4 sm:text-xs">
                        {item.nameEn || "\u00A0"}
                      </span>
                    </div>

                    {inBox && (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* <section className="rounded-2xl bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold text-gray-700">
            புதிய பொருள் (Add new product)
          </h2>
          <form onSubmit={addProduct} className="space-y-2">
            <input
              value={form.nameTa}
              onChange={(e) => setForm({ ...form, nameTa: e.target.value })}
              placeholder="தமிழ் பெயர் (required)"
              className="w-full rounded-xl border p-3"
            />
            <input
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              placeholder="English name"
              className="w-full rounded-xl border p-3"
            />
            <input
              key={fileKey}
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0] || null)}
              className="w-full rounded-xl border p-3 text-sm"
            />
            <button
              onClick={addProduct}
              className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white"
            >
              சேர்
            </button>
          </form>
        </section> */}

        {/* Shopping Box */}
        <section className="max-h-[52%] shrink-0 overflow-y-auto overscroll-contain rounded-t-3xl border-3 border-b-0 border-t-4 border-slate-400 bg-white pt-0 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_-1px_0_rgba(15,23,42,0.06),0_-8px_24px_-8px_rgba(15,23,42,0.18)] sm:p-4 md:pt-0 lg:pt-0">
          <div className="sticky top-0 z-10 -mx-3 mb-3 flex items-center justify-between gap-3 border-b border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-2.5 shadow-[0_6px_8px_-6px_rgba(190,18,60,0.25)] ">
            {/* Left: count badge + stacked title */}
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-amber-600 px-2 text-sm font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_6px_-1px_rgba(120,53,15,0.5)]">
                {box.length}
              </span>

              <h2 className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-bold text-rose-950 sm:text-base">
                  அனுப்பப்படவில்லை
                </span>
                <span className="block text-[11px] mt-1 font-medium uppercase tracking-wider text-rose-700/70">
                  Not sent yet
                </span>
              </h2>
            </div>

            {/* Right: compact clear button */}
            {box.length > 0 && (
              <button
                onClick={() => setBox([])}
                aria-label="Clear all items"
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-rose-300 bg-white/80 px-3 py-1.5 text-xs font-bold text-rose-700 shadow-[0_1px_2px_rgba(190,18,60,0.15)] transition hover:bg-rose-100 active:scale-95 sm:text-sm"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
                </svg>
                அழி/All
              </button>
            )}
          </div>

          {box.length === 0 ? (
            <p className="py-2 text-sm text-slate-400">
              Box is empty. Tap items above.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {box.map((item) => {
                const isOpen = openQty === item.nameTa;

                return (
                  <li
                    key={item.nameTa}
                    className={`relative overflow-hidden rounded-2xl border bg-gradient-to-b from-white to-emerald-50/60 p-2 pl-3.5 transition-all duration-200 ${
                      isOpen
                        ? "border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15),0_6px_16px_-6px_rgba(22,101,52,0.35)]"
                        : "border-emerald-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(22,101,52,0.08),0_4px_10px_-6px_rgba(22,101,52,0.2)] hover:border-emerald-300"
                    }`}
                  >
                    {/* Left accent bar */}
                    <span
                      className={`absolute inset-y-0 left-0 w-1.5 transition-colors ${
                        isOpen ? "bg-[#166534]" : "bg-emerald-500/70"
                      }`}
                    />

                    <div className="flex min-w-0 items-center gap-3">
                      {/* Image with crisp frame */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-emerald-900/10 shadow-[0_1px_3px_rgba(22,101,52,0.15)] sm:h-20 sm:w-20">
                        <ProductImage src={item.image} fill />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1 leading-tight">
                        <p className="truncate text-sm font-bold text-[#17231C] sm:text-base">
                          {item.nameTa}
                        </p>
                        {item.nameEn && item.nameEn !== item.nameTa && (
                          <p className="truncate text-xs text-slate-500">
                            {item.nameEn}
                          </p>
                        )}
                      </div>

                      {/* Quantity trigger */}
                      <button
                        type="button"
                        onClick={() => setOpenQty(isOpen ? null : item.nameTa)}
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        aria-label="Change quantity"
                        className={`flex h-10 min-w-[84px] shrink-0 items-center justify-between gap-1.5 rounded-xl border px-3 py-5.5  text-sm font-bold outline-none transition active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 ${
                          isOpen
                            ? "border-[#14532d] bg-[#166534] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_6px_-1px_rgba(22,101,52,0.5)]"
                            : "border-emerald-300 bg-white text-[#166534] shadow-[0_1px_2px_rgba(22,101,52,0.1)] hover:border-emerald-500"
                        }`}
                      >
                        <span className="flex flex-col items-start leading-none">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider ${
                              isOpen
                                ? "text-emerald-200"
                                : "text-emerald-600/80"
                            }`}
                          >
                            அளவு · Qty
                          </span>
                          <span className="mt-0.5 whitespace-nowrap text-sm font-extrabold">
                            {item.quantity}
                          </span>
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeFromBox(item.nameTa)}
                        aria-label="Remove item"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 shadow-[0_1px_2px_rgba(190,18,60,0.08)] outline-none transition hover:border-red-300 hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-300 active:scale-90"
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

                    {/* Option chips */}
                    {isOpen && (
                      <div
                        role="listbox"
                        className="mt-2.5 grid grid-cols-4 gap-1.5 border-t border-dashed border-emerald-300/70 pt-2.5"
                      >
                        {QTY_OPTIONS.map((q) => {
                          const selected = item.quantity === q;
                          return (
                            <button
                              key={q}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              onClick={() => {
                                changeQty(item.nameTa, q);
                                setOpenQty(null);
                              }}
                              className={`h-10 whitespace-nowrap rounded-lg border text-sm font-bold outline-none transition active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                                selected
                                  ? "border-[#14532d] bg-[#166534] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_6px_-1px_rgba(22,101,52,0.5)]"
                                  : "border-emerald-200 bg-white text-[#166534] hover:border-emerald-400 hover:bg-emerald-50"
                              }`}
                            >
                              {q}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      {/* Sticky Send Bar */}
      <div className="z-20 shrink-0 border-t border-gray-100 bg-white px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] sm:px-5 sm:pt-4">
        {message && (
          <p className="mx-auto mb-2 max-w-3xl text-center text-sm text-slate-500">
            {message}
          </p>
        )}

        <button
          onClick={sendToDad}
          disabled={box.length === 0 || sending || !online}
          className="group relative mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 overflow-hidden rounded-2xl border border-[#14532D] bg-gradient-to-b from-[#16803d] to-[#166534] pl-5 pr-2 text-base font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(6,78,59,0.3),0_8px_18px_-6px_rgba(6,78,59,0.55)] outline-none transition-all duration-200 hover:from-[#15803d] hover:to-[#14532D] focus-visible:ring-4 focus-visible:ring-emerald-200 active:scale-[0.98] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-none disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none sm:h-16 sm:text-lg"
        >
          <span className="truncate">
            {sending ? "அனுப்புகிறது..." : !online ? "இணையம் இல்லை" : "அப்பாவுக்கு அனுப்பு"}
          </span>

          <span className="flex shrink-0 items-center gap-2">
            {!sending && (
              <span
                className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-sm font-extrabold ${
                  box.length === 0
                    ? "bg-slate-300/60 text-slate-500"
                    : "bg-white/20 text-white ring-1 ring-white/30"
                }`}
              >
                {box.length}
              </span>
            )}
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 transition-transform duration-200 ${
                box.length > 0 && !sending ? "group-hover:translate-x-0.5" : ""
              }`}
            >
              {sending ? (
                <svg
                  className="animate-spin"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path d="M12 3a9 9 0 1 0 9 9" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
