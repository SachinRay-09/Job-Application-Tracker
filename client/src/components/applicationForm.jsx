import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function AppForm({
  updating,
  updateForm,
  setUpdateForm,
  setUpdating,
  setUpdateId,
  updateId,
}) {
  const navigate = useNavigate();
  const [appForm, setAppForm] = useState({
    jobTitle: "",
    skill: "",
    link: "",
    status: "pending",
    note: "",
  });
  const [error, setError] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (updating) {
      setAppForm({
        jobTitle: updateForm.jobTitle,
        skill: updateForm.skill,
        link: updateForm.link,
        status: updateForm.status,
        note: updateForm.note,
      });
    }
  }, [updating, updateForm]);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setAppForm((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [`${name}Error`]: "", submitError: "" }));
    setMessage("");
  }

  const validateForm = () => {
    const localErrors = {};
    const trimmedJobTitle = appForm.jobTitle.trim();
    const trimmedSkill = appForm.skill.trim();
    if (!trimmedJobTitle || trimmedJobTitle === "") {
      localErrors.jobTitleError = "Please enter job role";
    }
    if (!trimmedSkill || trimmedSkill === "") {
      localErrors.skillError = "Please enter skill, don't fill spaces";
    }

    setError(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError((prev) => ({ ...prev, submitError: "" }));
    const payloadLink = appForm.link.trim() || "No link provided";

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const url = updating
      ? `${import.meta.env.VITE_BACKEND_URL}/api/user/updateApplication`
      : `${import.meta.env.VITE_BACKEND_URL}/api/user/addData`;

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: updateId,
          jobTitle: appForm.jobTitle,
          skill: appForm.skill,
          link: payloadLink,
          status: appForm.status,
          note: appForm.note,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError((prev) => ({
          ...prev,
          submitError:
            data?.message || "Something went wrong. Please try again.",
        }));
        return;
      }

      const msg = updating
        ? "Data updated successfully"
        : "Data added successfully";

      if (updating) {
        setUpdateForm({
          jobTitle: "",
          skill: "",
          link: "",
          status: "",
          note: "",
        });
        setUpdateId("");
        setUpdating(false);
      }
      setMessage(msg);
      setAppForm({
        jobTitle: "",
        skill: "",
        link: "",
        status: "pending",
        note: "",
      });
      setError({});
      navigate("/home");
    } catch (fetchError) {
      setError((prev) => ({
        ...prev,
        submitError:
          fetchError?.message || "Network error. Please check your connection.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-14">
        <div className="w-full max-w-3xl rounded-[32px] border border-slate-200/80 bg-white p-10 shadow-xl shadow-slate-200/50">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Add an Application to track
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              Manage your job applications smartly and keep your follow-ups
              clear.
            </p>
          </div>

          <form className="mt-10 grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-slate-700"
                >
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  value={appForm.jobTitle}
                  onChange={handleOnChange}
                  autoComplete="job-title"
                  placeholder="Ex. SDE or Front-End Engineer"
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
                {error.jobTitleError && (
                  <p className="text-sm text-red-600">{error.jobTitleError}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="skill"
                  className="block text-sm font-medium text-slate-700"
                >
                  Skills
                </label>
                <input
                  id="skill"
                  name="skill"
                  type="text"
                  value={appForm.skill}
                  onChange={handleOnChange}
                  placeholder="Ex. JS, React, Node"
                  autoComplete="off"
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
                {error.skillError && (
                  <p className="text-sm text-red-600">{error.skillError}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="link"
                  className="block text-sm font-medium text-slate-700"
                >
                  Link
                </label>
                <input
                  id="link"
                  name="link"
                  type="text"
                  value={appForm.link}
                  onChange={handleOnChange}
                  placeholder="Enter job link"
                  autoComplete="off"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-slate-700"
                >
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={appForm.status}
                  onChange={handleOnChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="pending">Pending</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="note"
                className="block text-sm font-medium text-slate-700"
              >
                Note
              </label>
              <textarea
                id="note"
                name="note"
                rows="5"
                value={appForm.note}
                onChange={handleOnChange}
                placeholder="Enter note regarding this job"
                autoComplete="off"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full justify-center rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Working..."
                : updating
                  ? "Update Application"
                  : "Add Application"}
            </button>

            {error.submitError && (
              <p className="text-sm text-red-600">{error.submitError}</p>
            )}
            {message && <p className="text-sm text-emerald-600">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
