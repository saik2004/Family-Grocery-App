export default function RoleSelect({ onChoose }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-7 bg-[#F8FAF7] px-5 py-10 sm:gap-8">
  <h1 className="font-tamil text-xl font-bold text-center tracking-tight text-[#17231C] sm:text-4xl">
    நீங்கள் யார்?
    <span className="font-english text-xl font-bold mt-2 block tracking-normal text-slate-500 sm:text-lg">
      Are you Mom or Dad?
    </span>
  </h1>

  <button
    onClick={() => onChoose("mom")}
    className="w-full max-w-sm rounded-2xl border border-emerald-700 bg-[#166534] px-6 py-5  text-white shadow-lg shadow-green-900/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#14532D] hover:shadow-xl hover:shadow-green-900/15 active:scale-[0.98] sm:py-6 sm:text-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
  >
     <p className="font-tamil text-xl font-bold flex justify-center gap-2">அம்மா <p className="font-english text-xl font-bold">(Mom)</p></p>
  </button>

  <button
    onClick={() => onChoose("dad")}
    className="font-tamil text-xl font-bold w-full max-w-sm rounded-2xl border-2 border-[#166534] bg-white px-6 py-5 text-xl font-bold text-[#166534] shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-50 hover:shadow-lg active:scale-[0.98] sm:py-6 sm:text-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
  >
    <p className="font-tamil text-xl font-bold flex justify-center gap-2">அப்பா <p className="font-english text-xl font-bold"> (Dad)</p></p>
  </button>
</div>
  );
}