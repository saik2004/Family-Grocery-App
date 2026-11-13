import { useState } from "react";
import { productApi } from "../api";
import { resizeToSquare } from "../utils/resizeImage";

export default function AddProduct({ onBack, onAdded }) {
  const [form, setForm] = useState({ nameTa: "", nameEn: "" });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const pickPhoto = (e) => {
    const file = e.target.files[0] || null;
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nameTa.trim()) {
      setError("தமிழ் பெயர் தேவை (Tamil name is required)");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const fd = new FormData();
      fd.append("nameTa", form.nameTa);
      fd.append("nameEn", form.nameEn);
      if (photo) {
        const blob = await resizeToSquare(photo);
        fd.append("photo", blob, "photo.webp");
      }
      await productApi.post("/", fd);
      onAdded(); // refetch the catalog and go back to Mom's screen
    } catch (err) {
      setError(err.response?.data?.message || "சேர்க்க முடியவில்லை (Failed)");
    } finally {
      setSaving(false);
    }
  };

  return (
   <div className="flex min-h-dvh flex-col bg-[#F6F8F6]">
  {/* Header */}
  <header className="sticky top-0 z-20 flex shrink-0 items-center gap-3 bg-[#166534] px-4 py-3.5 text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_6px_16px_-4px_rgba(0,0,0,0.18)] sm:px-6">
    <button
      type="button"
      onClick={onBack}
      aria-label="Back"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 transition active:scale-90"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </button>
    <h1 className="min-w-0 leading-tight">
      <span className="block truncate text-base font-bold sm:text-lg">புதிய பொருள்</span>
      <span className="block text-[11px] font-medium uppercase tracking-wider text-emerald-200">
        Add product
      </span>
    </h1>
  </header>

  <form onSubmit={submit} className="flex flex-1 flex-col">
    <div className="mx-auto w-full max-w-md flex-1 px-4 pb-6 pt-5 sm:px-6 md:max-w-2xl md:pt-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_12px_24px_-12px_rgba(15,23,42,0.15)] sm:p-5 md:grid md:grid-cols-[220px_1fr] md:gap-6">
        {/* Photo picker */}
        <label className="group relative mx-auto block w-full max-w-[260px] cursor-pointer md:mx-0 md:max-w-none">
          <div
            className={`relative aspect-square w-full overflow-hidden rounded-2xl transition ${
              preview
                ? "border border-slate-200 shadow-[0_4px_12px_-4px_rgba(15,23,42,0.25)]"
                : "border-2 border-dashed border-slate-300 bg-slate-50 group-hover:border-emerald-400 group-active:scale-[0.98]"
            }`}
          >
            {preview ? (
              <>
                <img src={preview} alt="" className="h-full w-full object-cover" />
                <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                  மாற்று · Change
                </span>
              </>
            ) : (
              <span className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-700 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.2)] ring-1 ring-slate-200">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                </span>
                <span className="text-sm font-bold text-slate-700">படம் தேர்வு செய்</span>
                <span className="text-xs text-slate-500">Choose photo</span>
              </span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={pickPhoto} className="sr-only" />
        </label>

        {/* Fields */}
        <div className="mt-5 space-y-4 md:mt-0 md:self-center">
          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm font-bold text-slate-800">
              <span>
                தமிழ் பெயர்{" "}
                <span className="text-xs font-medium text-slate-500">Tamil name</span>
              </span>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 ring-1 ring-rose-200">
                Required
              </span>
            </label>
            <input
              value={form.nameTa}
              onChange={(e) => setForm({ ...form, nameTa: e.target.value })}
              placeholder="எ.கா. தக்காளி"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-base text-[#17231C] shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm font-bold text-slate-800">
              <span>
                English name{" "}
                <span className="text-xs font-medium text-slate-500">ஆங்கிலப் பெயர்</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Optional
              </span>
            </label>
            <input
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              placeholder="e.g. Tomato"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-base text-[#17231C] shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700">
              <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16.5v.01" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Sticky action bar */}
    <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-6">
      <button
        disabled={saving}
        className="mx-auto flex h-14 w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-emerald-900/30 bg-gradient-to-b from-emerald-600 to-emerald-800 text-lg font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_14px_-4px_rgba(6,78,59,0.5)] transition active:scale-[0.97] disabled:border-transparent disabled:bg-none disabled:bg-slate-300 disabled:shadow-none md:max-w-2xl"
      >
        {saving ? "சேர்க்கிறது..." : "சேர் · Add"}
      </button>
    </div>
  </form>
</div>
  );
}