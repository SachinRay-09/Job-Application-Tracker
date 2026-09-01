import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

export const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = useMemo(
    () => ["interviewing", "rejected", "offers", "pending"],
    [],
  );
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating toggle button — mobile only */}
      <button
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((prev) => !prev)}
        className="sm:hidden fixed top-4 left-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg transition-transform duration-150 hover:bg-slate-800 active:scale-95"
      >
        {/* Hamburger / X — CSS opacity swap, no layout shift */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-5 w-5 absolute transition-opacity duration-150"
          style={{ opacity: isOpen ? 0 : 1 }}
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-5 w-5 absolute transition-opacity duration-150"
          style={{ opacity: isOpen ? 1 : 0 }}
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/*
        Backdrop — always in the DOM, toggled via opacity + pointer-events.
        This avoids mount/unmount layout thrash on tap.
      */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className="sm:hidden fixed inset-0 z-30 bg-slate-950/40 transition-opacity duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/*
        Sidebar — always in the DOM.
        Uses transform: translateX() only (GPU composited, no layout/paint).
        will-change pre-promotes the layer so the first frame isn't janky.
        No backdrop-blur on mobile — blur forces repaint every frame.
      */}
      <aside
        style={{
          willChange: "transform",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-72
          bg-white
          border-r border-slate-200/80
          shadow-2xl shadow-slate-900/10
          flex flex-col justify-between p-6
          transition-transform duration-300 ease-in-out
          sm:!transform-none sm:top-6 sm:bottom-6 sm:left-6
          sm:rounded-[32px] sm:border sm:bg-white/95 sm:backdrop-blur-xl
        `}
      >
        <div>
          <div className="mb-8 mt-14 sm:mt-0">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Application status
            </p>
            <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950">
              Stage panel
            </h2>
          </div>

          <div className="space-y-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  className={`w-full rounded-3xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Keep a clean, vertical navigation panel on the left to balance the
            content area with a classic, modern feel.
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-700 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">Profile</p>
              <p className="text-xs text-slate-500">View your account</p>
            </div>
            <button
              type="button"
              onClick={() => { navigate("/profile"); setIsOpen(false); }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <circle cx="12" cy="8" r="3" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            onClick={handleLogOut}
          >
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};
