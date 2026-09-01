import { useState } from "react";
import { useNavigate } from "react-router";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [`${name}Error`]: "", submitError: "" }));
    setMessage("");
  }

  const handleModeSwitch = () => {
    setIsLogin((prev) => !prev);
    setError({});
    setMessage("");
    setFormData({ username: "", password: "", email: "" });
  };

  const validateForm = () => {
    const trimmedEmail = formData.email.trim();
    const trimmedUsername = formData.username.trim();
    const localErrors = {};

    if (!trimmedEmail) {
      localErrors.emailError = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      localErrors.emailError = "Enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 6) {
      localErrors.passwordError = "Password must be at least 6 characters.";
    }

    if (!isLogin) {
      if (!trimmedUsername) {
        localErrors.usernameError = "Username is required for registration.";
      }
    }

    setError(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError((prev) => ({ ...prev, submitError: "" }));

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const url = isLogin
      ? `${import.meta.env.VITE_BACKEND_URL}/login`
      : `${import.meta.env.VITE_BACKEND_URL}/register`;

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
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

      setMessage(
        isLogin
          ? "You are now logged in. Welcome back!"
          : "Registration successful. You can now log in.",
      );
      navigate("/home");
      setFormData({ username: "", password: "", email: "" });
      setError({});
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
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-10">
        <div className="w-full rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
              Job Tracker
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              {isLogin
                ? "Login to manage your applications and stay on top of progress."
                : "Register to save job applications, deadlines, and notes all in one place."}
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
                type="email"
                value={formData.email}
                onChange={handleOnChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
              {error.emailError && (
                <p className="text-sm text-red-600">{error.emailError}</p>
              )}
            </div>

            {!isLogin && (
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
                  value={formData.username}
                  onChange={handleOnChange}
                  placeholder="Your display name"
                  autoComplete="username"
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
                {error.usernameError && (
                  <p className="text-sm text-red-600">{error.usernameError}</p>
                )}
              </div>
            )}

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
                value={formData.password}
                onChange={handleOnChange}
                placeholder="At least 6 characters"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
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
              {loading ? "Working..." : isLogin ? "Login" : "Register"}
            </button>

            {error.submitError && (
              <p className="text-sm text-red-600">{error.submitError}</p>
            )}
            {message && <p className="text-sm text-emerald-600">{message}</p>}
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={handleModeSwitch}
              className="ml-1 font-semibold text-sky-600 hover:text-sky-700"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
