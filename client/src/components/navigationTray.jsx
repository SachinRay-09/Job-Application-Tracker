import { useMemo } from "react";
import { useNavigate } from "react-router";

export const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = useMemo(
    () => ["interviewing", "rejected", "offers", "pending"],
    [],
  );
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await fetch("http://localhost:8000/jobapptracker/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res) console.log("Log Out failed");
      const data = await res.json();
      console.log(data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-72 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-2xl shadow-slate-900/8 backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="mb-8">
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
                className={`w-full rounded-3xl border px-4 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                }}
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
            onClick={() => navigate("/profile")}
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
  );
};
