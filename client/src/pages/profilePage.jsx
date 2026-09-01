import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    age: "",
    occupation: "",
    year: "",
    stack: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [`${name}Error`]: "", submitError: "" }));
  };

  const validateForm = () => {
    const localErrors = {};
    const trimmedUsername = userData.username.trim();
    const trimmedEmail = userData.email.trim();
    const trimmedName = userData.name.trim();
    const trimmedAge = userData.age.trim();
    const trimmedOccupation = userData.occupation.trim();
    const trimmedYear = userData.year.trim();
    const trimmedStack = userData.stack.trim();
    if (!trimmedUsername || trimmedUsername === "") {
      localErrors.UsernameError = "Please enter a valid Username";
    }

    if (!trimmedName || trimmedName === "") {
      localErrors.NameError = "Please enter a valid Name";
    }

    if (!trimmedAge || trimmedAge === "") {
      localErrors.AgeError = "Please enter a valid Age";
    }

    if (!trimmedOccupation || trimmedOccupation === "") {
      localErrors.OccupationError = "Please enter a valid Occupation";
    }

    if (!trimmedYear || trimmedYear === "") {
      localErrors.YearError = "Please enter a valid Year";
    }

    if (!trimmedStack || trimmedStack === "") {
      localErrors.StackError = "Please enter a valid Stack";
    }

    if (!trimmedEmail) {
      localErrors.emailError = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      localErrors.emailError = "Enter a valid email address.";
    }

    if (!userData.password || userData.password.length < 6) {
      localErrors.passwordError = "Password must be at least 6 characters.";
    }

    setError(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const getUserData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/data`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await res.json();
      console.log(data);
      setUserData({
        username: data.username || "",
        password: data.password || "",
        email: data.email || "",
        name: data.name || "",
        age: data.age || "",
        occupation: data.occupation || "",
        year: data.year || "",
        stack: data.stack || "",
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError((prev) => ({ ...prev, submitError: "" }));

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/updateData`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userData.username,
            password: userData.password,
            email: userData.email,
            name: userData.name,
            age: userData.age,
            occupation: userData.occupation,
            year: userData.year,
            stack: userData.stack,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError((prev) => ({
          ...prev,
          submitError:
            data?.message || "Something went wrong. Please try again.",
        }));
        return;
      }
      console.log(data);
      setUserData({
        username: "",
        password: "",
        email: "",
        name: "",
        age: "",
        occupation: "",
        year: "",
        stack: "",
      });
      setUpdating(false);
      setError({});
      getUserData();
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

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <section className="mx-auto mb-6 max-w-6xl rounded-[32px] border border-slate-200/80 bg-white/90 px-6 py-8 shadow-sm shadow-slate-900/5">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Application workspace
            </p>
            <h1
              onClick={() => {
                navigate("/home");
              }}
              className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl cursor-pointer"
            >
              Job Application Tracker
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              A calm, refined workspace for your job pipeline. Keep your current
              roles, statuses, and next steps visible at a glance.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5 text-sm text-slate-600 shadow-sm shadow-slate-900/5">
            <p className="font-medium text-slate-900">Profile Overview</p>
            <p className="mt-1">
              Manage your account details and update profile info.
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto flex w-full min-h-[calc(100vh-170px)] max-w-6xl items-start justify-center px-6 py-10">
        <div className="w-full max-w-3xl rounded-[32px] border border-slate-200/80 bg-white p-10 shadow-xl shadow-slate-200/50">
          <div className="space-y-4 border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Profile
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              Update your Profile to your liking.
            </p>
          </div>

          {updating ? (
            <form onSubmit={handleSubmit} className="mt-10 grid gap-6 pb-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={userData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    placeholder="Put a username"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                  {error.UsernameError && (
                    <p className="text-sm text-red-600">
                      {error.UsernameError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Ex. xyz@gmail.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                  {error.emailError && (
                    <p className="text-sm text-red-600">{error.emailError}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={userData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                  {error.NameError && (
                    <p className="text-sm text-red-600">{error.NameError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Age
                  </label>
                  <input
                    name="age"
                    id="age"
                    type="text"
                    value={userData.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    autoComplete="age"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                  {error.AgeError && (
                    <p className="text-sm text-red-600">{error.AgeError}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Occupation
                  </label>
                  <input
                    name="occupation"
                    id="occupation"
                    type="text"
                    value={userData.occupation}
                    onChange={handleChange}
                    placeholder="Enter your occupation"
                    autoComplete="occupation"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                  {error.OccupationError && (
                    <p className="text-sm text-red-600">
                      {error.OccupationError}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Year
                  </label>
                  <input
                    name="year"
                    id="year"
                    type="text"
                    value={userData.year}
                    onChange={handleChange}
                    placeholder="Enter your College year or Work experience"
                    autoComplete="year"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                  {error.YearError && (
                    <p className="text-sm text-red-600">{error.YearError}</p>
                  )}
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <label
                    htmlFor="stack"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Stack
                  </label>
                  <input
                    name="stack"
                    id="stack"
                    type="text"
                    value={userData.stack}
                    onChange={handleChange}
                    placeholder="Enter your stack"
                    autoComplete="stack"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                  {error.StackError && (
                    <p className="text-sm text-red-600">{error.StackError}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
                {error.passwordError && (
                  <p className="text-sm text-red-600">{error.passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Save Profile
              </button>
            </form>
          ) : (
            <form className="mt-10 grid gap-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={userData.username}
                    autoComplete="username"
                    placeholder="Put a username"
                    readOnly
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    value={userData.email}
                    placeholder="Ex. xyz@gmail.com"
                    autoComplete="email"
                    readOnly
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={userData.name}
                    placeholder="Enter your name"
                    autoComplete="name"
                    readOnly
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Age
                  </label>
                  <input
                    name="age"
                    id="age"
                    type="text"
                    value={userData.age}
                    placeholder="Enter your age"
                    readOnly
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Occupation
                  </label>
                  <input
                    name="occupation"
                    id="occupation"
                    type="text"
                    value={userData.occupation}
                    placeholder="Enter your occupation"
                    autoComplete="occupation"
                    readOnly
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Year
                  </label>
                  <input
                    name="year"
                    id="year"
                    type="text"
                    value={userData.year}
                    placeholder="Enter your College year or Work experience"
                    autoComplete="year"
                    readOnly
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <label
                    htmlFor="stack"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Stack
                  </label>
                  <input
                    name="stack"
                    id="stack"
                    type="text"
                    value={userData.stack}
                    placeholder="Enter your stack"
                    autoComplete="stack"
                    readOnly
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setUpdating(true)}
                className="inline-flex w-full justify-center rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Update Profile
              </button>
              <p className="mt-6 text-center text-sm text-slate-600">
                If you want to change the password then click Update Profile
                button*
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
