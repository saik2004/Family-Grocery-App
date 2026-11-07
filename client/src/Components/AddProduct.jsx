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
    <div className="flex min-h-screen flex-col bg-[#F6F8F6]">
      <header className="flex items-center gap-3 bg-emerald-800 px-4 py-4 text-white shadow">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl active:scale-90"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">புதிய பொருள் (Add product)</h1>
      </header>

      <form onSubmit={submit} className="mx-auto w-full max-w-md flex-1 space-y-4 p-4">
        {/* Photo picker with preview */}
        <label className="block cursor-pointer">
          <div className="mx-auto flex aspect-square w-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 text-center">
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="px-2 text-sm font-medium text-emerald-700">
                📷 படம் தேர்வு செய்
                <span className="block text-xs text-slate-500">Choose photo</span>
              </span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
        </label>

        <input
          value={form.nameTa}
          onChange={(e) => setForm({ ...form, nameTa: e.target.value })}
          placeholder="தமிழ் பெயர் (required)"
          className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
        <input
          value={form.nameEn}
          onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
          placeholder="English name"
          className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        {error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}

        <button
          disabled={saving}
          className="w-full rounded-2xl bg-emerald-700 py-4 text-lg font-bold text-white shadow active:scale-95 disabled:bg-gray-300"
        >
          {saving ? "சேர்க்கிறது..." : "சேர் (Add)"}
        </button>
      </form>
    </div>
  );
}