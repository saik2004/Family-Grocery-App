import { useState, useEffect } from "react";
import api, { productApi } from "../api";
import SentSuccess from "./SentSuccess";
import { resizeToSquare } from "../utils/resizeImage";
import ProductImage from "../Components/ProductImage";
import AddProduct from "../Components/AddProduct";

const QTY_OPTIONS = ["1/2 kg", "1 kg", "1", "2", "3", "4", "5", "6", "10"];

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
  }, [refreshKey]); // re-runs whenever refreshKey changes

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
      <header className="z-10 flex shrink-0 items-center justify-between bg-[#166534] px-4 py-4 text-white shadow-md sm:px-6">
        <div className="min-w-0">
          <h1 className="font-tamil text-xl font-bold tracking-tight sm:text-3xl">
            அம்மா
          </h1>
          <p className="font-tamil text-xl font-bold text-emerald-100 sm:text-sm">
            தேவையான பொருட்களை தொடவும்
          </p>
        </div>

        <button
          onClick={onReset}
          className="font-tamil text-xl font-bold ml-3 shrink-0 rounded-full bg-white/10 px-3 py-2 text-white underline-offset-4 transition hover:bg-white/20 hover:underline sm:text-sm"
        >
          மாற்று (Change)
        </button>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden px-3 pt-4 sm:px-5">
        {/* Catalog */}
        <section className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-4">
          <div className="mb-3 flex shrink-0 items-center justify-between">
            <h2 className="font-tamil text-xl font-bold tracking-tight text-[#17231C] sm:text-lg">
              பொருட்கள்
            </h2>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition active:scale-95"
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
        <section className="max-h-[32%] shrink-0 overflow-y-auto overscroll-contain rounded-t-2xl border border-gray-100 bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] sm:p-4">
          <h2 className="mb-3 flex flex-wrap items-center gap-2 text-sm font-bold text-[#17231C] sm:text-lg">
            அனுப்பப்படவில்லை (Not sent yet)
            <span className="rounded-full bg-[#166534] px-2.5 py-0.5 text-xs font-bold text-white">
              {box.length}
            </span>
          </h2>

          {box.length === 0 ? (
            <p className="py-2 text-sm text-slate-400">
              Box is empty. Tap items above.
            </p>
          ) : (
            <ul className="space-y-2">
              {box.map((item) => (
                <li
                  key={item.nameTa}
                  className="flex min-w-0 items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-2 py-2 sm:gap-3 sm:px-3"
                >
                  <span className="min-w-0 flex-1 break-words text-sm font-medium leading-snug text-[#17231C] sm:text-base">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white sm:h-12 sm:w-12">
                      <ProductImage src={item.image} fill />
                    </div>
                    {item.nameTa}{" "}
                    <span className="text-xs font-normal text-slate-500 sm:text-sm">
                      ({item.nameEn})
                    </span>
                  </span>

                  <select
                    value={item.quantity}
                    onChange={(e) => changeQty(item.nameTa, e.target.value)}
                    className="shrink-0 rounded-lg border border-emerald-100 bg-white px-2 py-2 text-sm font-semibold text-[#166534] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {QTY_OPTIONS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromBox(item.nameTa)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-500 transition hover:bg-red-100 active:scale-90"
                  >
                    ✕
                  </button>
                </li>
              ))}
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
          disabled={box.length === 0 || sending}
          className="mx-auto block w-full max-w-3xl rounded-2xl bg-[#166534] py-3.5 text-base font-bold text-white shadow-lg shadow-green-900/10 transition-all duration-200 hover:bg-[#14532D] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none sm:py-4 sm:text-lg"
        >
          {sending ? "அனுப்புகிறது..." : `அப்பாவுக்கு அனுப்பு (${box.length})`}
        </button>
      </div>
    </div>
  );
}
