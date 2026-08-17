import { memo } from "react";

const statusStyles = {
  interviewing: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  offers: "bg-sky-100 text-sky-700",
  pending: "bg-amber-100 text-amber-700",
};

const CardComponent = ({
  id,
  deleteApplication,
  submittedAt,
  jobTitle,
  skills,
  link,
  status = "pending",
  note,
  handleUpdate,
}) => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "-");
  const submittedDate = new Date(submittedAt).toLocaleDateString();
  const statusClass =
    statusStyles[normalizedStatus] || "bg-slate-100 text-slate-700";

  return (
    <article className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-900/5 transition hover:shadow-md h-full flex flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <span className="text-sm uppercase tracking-[0.24em] text-slate-500">
          {submittedDate}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusClass}`}
        >
          {status}
        </span>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {jobTitle}
      </h2>

      <div className="mt-5 flex-1 grid gap-6 sm:grid-cols-2">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Skills
          </span>
          <p className="mt-2 text-sm leading-6 text-slate-700">{skills}</p>
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Link
          </span>
          <a
            className="mt-2 inline-block max-w-full text-sm font-medium text-slate-900 transition hover:text-slate-700 break-all"
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            {link}
          </a>
        </div>
      </div>

      {note && (
        <div className="mt-5">
          <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Note
          </span>
          <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 max-h-24 overflow-y-auto">
              {note}
            </p>
          </div>
        </div>
      )}

      <div className="mt-auto flex gap-2 pt-4">
        <button
          onClick={() => handleUpdate(id, jobTitle, skills, link, status, note)}
          className="flex-1 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Update
        </button>
        <button
          onClick={() => deleteApplication(id)}
          className="flex-1 inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white border-[1px] border-red-500 transition hover:bg-white hover:border-red-500 hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export const Card = memo(CardComponent);
