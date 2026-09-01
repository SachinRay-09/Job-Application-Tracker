import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/card.jsx";
import { Navigation } from "../components/navigationTray.jsx";

export const Homepage = ({ setUpdateForm, setUpdating, setUpdateId }) => {
  const navigate = useNavigate();
  const isFirstRender = useRef(true);
  const [inHome, setInHome] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [applicationData, setApplicationData] = useState(null);
  const [latestApplicationData, setLatestApplicationData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleUpdate = (id, jobTitle, skills, link, status, note) => {
    setUpdating(true);
    setUpdateForm({
      jobTitle: jobTitle,
      skill: skills,
      link: link,
      status: status,
      note: note,
    });
    setUpdateId(id);
    navigate("/addApplication");
  };

  const getData = async (status) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/specificapplicationData`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestedData: status }),
        },
      );

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        const text = await res.text();
        setError("Failed to parse server response");
        setApplicationData(null);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data?.message || "Server error");
        setApplicationData(null);
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Something went wrong");
        setApplicationData(null);
      } else {
        setApplicationData(data);
      }
    } catch (err) {
      console.error("getData: fetch error", err);
      setError("Network error while fetching data");
      setApplicationData(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/deleteApplication`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId: id }),
        },
      );
      const data = await res.json();
      console.log(data, id);
      fetchData();
      if (activeTab) {
        getData(activeTab);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [latestApplicationData]);

  useEffect(() => {
    console.log(applicationData);
  }, [applicationData]);

  useEffect(() => {
    // don't run on initial mount or when activeTab is empty
    if (!activeTab) return;
    setInHome(false);
    getData(activeTab);
    console.log(activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/allApplicationData`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await res.json();
      if (!data) {
        setError("No application data found");
        return;
      }
      const latestApplication = data[data.length - 1] || null;
      setLatestApplicationData(latestApplication);
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mx-auto min-h-screen px-6 pt-20 pb-8 sm:pt-8 sm:ml-80 sm:px-10 lg:px-14">
        <div className="space-y-8">
          <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-sm shadow-slate-900/5">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Application workspace
                </p>
                <h1
                  onClick={() => {
                    setActiveTab("");
                    setInHome(true);
                  }}
                  className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl cursor-pointer"
                >
                  Job Application Tracker
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  A calm, refined workspace for your job pipeline. Keep your
                  current roles, statuses, and next steps visible at a glance.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    navigate("/addApplication");
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  New application
                </button>
                <button className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Recent summary
                </button>
              </div>
            </div>
          </section>

          {inHome ? (
            <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
              <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">
                        Overview
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Your current workflow, laid out cleanly with balanced
                        space and subtle detail.
                      </p>
                    </div>
                    <button className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                      Refresh view
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                        Interviewing
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-slate-950">
                        0
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                        Offers
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-slate-950">
                        0
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">
                        Latest application
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        A refined card preview for your next step.
                      </p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                      Compact
                    </span>
                  </div>
                  {loading ? (
                    "Loading..."
                  ) : latestApplicationData ? (
                    <Card
                      id={latestApplicationData._id}
                      deleteApplication={deleteApplication}
                      submittedAt={latestApplicationData.submittedAt}
                      jobTitle={latestApplicationData.jobTitle}
                      skills={latestApplicationData.skill}
                      link={latestApplicationData.link}
                      status={latestApplicationData.status}
                      note={latestApplicationData.note}
                      handleUpdate={handleUpdate}
                    />
                  ) : (
                    <p className="text-sm text-slate-600">
                      No applications found.
                    </p>
                  )}
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Focus panel
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    The left panel keeps your status categories visible while
                    the content area grows naturally.
                  </p>
                  <div className="mt-6 grid gap-3">
                    <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                      No extra color. Just clarity, structure, and calm spacing.
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                      A classic modern surface for your workflow.
                    </div>
                  </div>
                </div>
              </aside>
            </section>
          ) : (
            <section className="grid gap-6">
              <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Applications
                  </h2>

                  <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                    {loading ? (
                      "Loading..."
                    ) : applicationData && applicationData.length > 0 ? (
                      applicationData.map((app) => (
                        <div key={app._id} className="h-full">
                          <Card
                            id={app._id}
                            deleteApplication={deleteApplication}
                            submittedAt={app.submittedAt}
                            jobTitle={app.jobTitle}
                            skills={app.skill}
                            link={app.link}
                            status={app.status}
                            note={app.note}
                            handleUpdate={handleUpdate}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600">
                        No applications in this category.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {inHome && (
            <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5">
              <h2 className="text-lg font-semibold text-slate-950">
                Ready for action
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use the left panel to move between stages and keep the homepage
                clean and balanced.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
