import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apiConfig";

/**
 * Secretary login modal.
 *
 * Expected backend endpoints (from the Spring Boot secretary-auth controller):
 *   POST /secretary-auth/login
 *   POST /secretary-auth/change-password
 *
 * The shared Axios instance should have its API base URL configured and
 * allow credentials. Per-request withCredentials is also set below.
 */
export default function SecretaryLoginModal({ onClose, onSuccess }) {
  const navigate = useNavigate();

  const finishLogin = (data) => {
    onSuccess?.(data);
    navigate("/secretary", { replace: true });
  };
  const [stage, setStage] = useState("login");
  const [secretaryCode, setSecretaryCode] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretaryName, setSecretaryName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getErrorMessage = (err) => {
    const data = err?.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    if (data?.detail) return data.detail;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (err?.response?.status === 401) return "Invalid secretary ID or password.";
    if (err?.response?.status === 403) {
      return "This secretary account is bound to another browser, or access was denied. Please contact the administrator.";
    }
    return "Unable to connect or sign in. Please try again.";
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await api.post(
        "/secretary-auth/login",
        {
          secretaryCode: secretaryCode.trim(),
          password,
        },
        { withCredentials: true }
      );

      const data = response.data || {};
      setSecretaryName(data.name || data.secretaryName || "");
      if (data.passwordChangeRequired) {
        setStage("change-password");
      } else {
        finishLogin(data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("The new password and confirmation do not match.");
      return;
    }
    if (newPassword === password) {
      setError("Choose a new password different from your temporary password.");
      return;
    }

    setBusy(true);
    try {
      await api.post(
        "/secretary-auth/change-password",
        {
          currentPassword: password,
          newPassword,
        },
        { withCredentials: true }
      );
      finishLogin({
        secretaryCode: secretaryCode.trim(),
        name: secretaryName,
        passwordChangeRequired: false,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4 py-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="secretary-login-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close secretary login"
          className="absolute right-4 top-3 rounded-lg px-2 py-1 text-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          ×
        </button>

        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl">
            🔐
          </div>
          <h2 id="secretary-login-title" className="text-xl font-bold text-gray-900">
            {stage === "login" ? "Secretary Login" : "Set Your New Password"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {stage === "login"
              ? "Sign in with the credentials provided by the administrator."
              : `Welcome${secretaryName ? `, ${secretaryName}` : ""}. Please replace your temporary password to continue.`}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {stage === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="secretary-code" className="mb-1 block text-sm font-medium text-gray-700">
                Secretary ID (or Mobile number)
              </label>
              <input
                id="secretary-code"
                type="text"
                autoComplete="username"
                required
                maxLength={40}
                value={secretaryCode}
                onChange={(event) => setSecretaryCode(event.target.value)}
                placeholder="e.g. SEC-1A2B3C4D"
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="secretary-password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="flex overflow-hidden rounded-xl border border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                <input
                  id="secretary-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="px-3 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <p className="text-xs leading-5 text-gray-500">
              Your login is remembered for up to 24 hours on this browser. A secretary account is restricted to its registered browser.
            </p>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="secretary-current-password" className="mb-1 block text-sm font-medium text-gray-700">
                Temporary password
              </label>
              <input
                id="secretary-current-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label htmlFor="secretary-new-password" className="mb-1 block text-sm font-medium text-gray-700">
                New password
              </label>
              <input
                id="secretary-new-password"
                type="password"
                autoComplete="new-password"
                required
                maxLength={128}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="At least 12 characters"
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label htmlFor="secretary-confirm-password" className="mb-1 block text-sm font-medium text-gray-700">
                Confirm new password
              </label>
              <input
                id="secretary-confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={12}
                maxLength={128}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <p className="text-xs leading-5 text-gray-500">
              Use a password you can remember easily. Password is needed only once in a day for log-in.
            </p>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Updating password…" : "Change Password"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
