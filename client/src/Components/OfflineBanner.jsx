import { useEffect, useState } from "react";
import useOnline from "../hooks/useOnline";

export default function OfflineBanner() {
  const online = useOnline();
  const [showBack, setShowBack] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!online) {
      setWasOffline(true);
      setShowBack(false);
    } else if (wasOffline) {
      setShowBack(true);
      const t = setTimeout(() => setShowBack(false), 2500);
      return () => clearTimeout(t);
    }
  }, [online, wasOffline]);

  if (online && !showBack) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`animate-fade-in relative z-30 flex shrink-0 items-center justify-center gap-2 px-4 py-2 text-center text-sm font-bold text-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.3)] ${
        online ? "bg-[#166534]" : "bg-rose-600"
      }`}
    >
      {online ? (
        <>✓ இணைப்பு மீண்டது · Back online</>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01M3 3l18 18" />
          </svg>
          இணையம் இல்லை · No internet connection
        </>
      )}
    </div>
  );
}