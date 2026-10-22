import React, { useCallback, useEffect, useState } from "react";
import apiAdmin from "../apiConfigAdmin";

const getMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  return data?.message || data?.detail || fallback;
};

export default function ManageSecretaries({ onClose }) {
  const [secretaries, setSecretaries] = useState([]);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchSecretaries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiAdmin.get("/admin/secretaries");
      setSecretaries(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(getMessage(err, "Could not load secretaries. Check admin authentication and API configuration."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecretaries();
  }, [fetchSecretaries]);

  const createSecretary = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setCreatedCredentials(null);
    setSaving(true);
    try {
      const response = await apiAdmin.post("/admin/secretaries", {
        name: name.trim(),
        mobileNumber: mobileNumber.replace(/[()\s-]/g, ""),
      });
      setCreatedCredentials(response.data);
      setName("");
      setMobileNumber("");
      setNotice("Secretary created. Share these credentials privately; the temporary password will not be shown again here.");
      await fetchSecretaries();
    } catch (err) {
      setError(getMessage(err, "Could not create secretary."));
    } finally {
      setSaving(false);
    }
  };

  const updateActive = async (secretary) => {
    const nextActive = !secretary.active;
    const prompt = nextActive
      ? `Activate secretary ${secretary.name}?`
      : `Deactivate ${secretary.name}? Their active sessions will be revoked.`;
    if (!window.confirm(prompt)) return;

    setBusyId(secretary.id);
    setError("");
    setNotice("");
    try {
      await apiAdmin.patch(`/admin/secretaries/${secretary.id}/active`, { active: nextActive });
      setNotice(nextActive ? "Secretary activated." : "Secretary deactivated and sessions revoked.");
      await fetchSecretaries();
    } catch (err) {
      setError(getMessage(err, "Could not update secretary status."));
    } finally {
      setBusyId("");
    }
  };

  const resetDevice = async (secretary) => {
    if (!window.confirm(`Reset the registered browser for ${secretary.name}? Their current sessions will be revoked, and their next login will bind a new browser.`)) return;

    setBusyId(secretary.id);
    setError("");
    setNotice("");
    try {
      await apiAdmin.post(`/admin/secretaries/${secretary.id}/reset-device`);
      setNotice("Browser binding reset. The secretary can register a new browser on their next successful login.");
      await fetchSecretaries();
    } catch (err) {
      setError(getMessage(err, "Could not reset the registered browser."));
    } finally {
      setBusyId("");
    }
  };

  const copyCredentials = async () => {
    if (!createdCredentials) return;
    const text = `Secretary: ${createdCredentials.name}\nSecretary ID: ${createdCredentials.secretaryCode}\nTemporary password: ${createdCredentials.temporaryPassword}`;
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Credentials copied. Share them privately and do not post them in a group.");
    } catch {
      setError("Clipboard access failed. Select and copy the credentials manually.");
    }
  };

  const dateText = (value) => {
    if (!value) return "Never";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-3 py-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-secretaries-title"
        className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Manage Secretaries"
          className="absolute right-4 top-3 rounded-lg px-2 py-1 text-xl text-gray-500 hover:bg-gray-100"
        >
          ×
        </button>

        <div className="mb-6 pr-8">
          <h2 id="manage-secretaries-title" className="text-2xl font-bold text-gray-900">
            Manage Secretaries
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create accounts, view account status, deactivate access, or reset a secretary’s registered browser.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <form onSubmit={createSecretary} className="h-fit rounded-xl border border-gray-200 p-4">
            <h3 className="mb-3 text-lg font-semibold">Create Secretary</h3>
            <label htmlFor="new-secretary-name" className="mb-1 block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              id="new-secretary-name"
              required
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Secretary name"
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <label htmlFor="new-secretary-mobile" className="mb-1 block text-sm font-medium text-gray-700">
              Mobile number
            </label>
            <input
              id="new-secretary-mobile"
              type="tel"
              required
              minLength={10}
              maxLength={18}
              value={mobileNumber}
              onChange={(event) => setMobileNumber(event.target.value)}
              placeholder="10–15 digits, optional +"
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="mb-4 text-xs leading-5 text-gray-500">
              The backend generates the Secretary ID and temporary password. Give the credentials directly to the secretary.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Creating…" : "Create Secretary"}
            </button>
          </form>

          <div className="min-w-0">
            {createdCredentials && (
              <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
                <h3 className="font-semibold text-amber-950">Temporary credentials — shown once</h3>
                <p className="mt-1 text-xs text-amber-900">
                  Copy these now and share privately. The secretary should change the temporary password at first login.
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div><dt className="inline font-medium">Name: </dt><dd className="inline">{createdCredentials.name}</dd></div>
                  <div><dt className="inline font-medium">Secretary ID: </dt><dd className="inline select-all font-mono">{createdCredentials.secretaryCode}</dd></div>
                  <div><dt className="inline font-medium">Temporary password: </dt><dd className="inline select-all font-mono">{createdCredentials.temporaryPassword}</dd></div>
                </dl>
                <button
                  type="button"
                  onClick={copyCredentials}
                  className="mt-3 rounded-lg border border-amber-400 px-3 py-2 text-sm font-medium text-amber-950 hover:bg-amber-100"
                >
                  Copy credentials
                </button>
              </div>
            )}

            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Registered Secretaries</h3>
              <button
                type="button"
                onClick={fetchSecretaries}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? "Loading…" : "Refresh"}
              </button>
            </div>

            {loading ? (
              <p className="rounded-xl border border-gray-200 p-5 text-sm text-gray-500">Loading secretary accounts…</p>
            ) : secretaries.length === 0 ? (
              <p className="rounded-xl border border-gray-200 p-5 text-sm text-gray-500">No secretary accounts found.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-3">Secretary</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Browser</th>
                      <th className="px-3 py-3">Last login</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {secretaries.map((secretary) => (
                      <tr key={secretary.id} className="align-top">
                        <td className="px-3 py-3">
                          <div className="font-semibold text-gray-900">{secretary.name}</div>
                          <div className="mt-0.5 font-mono text-xs text-indigo-700">{secretary.secretaryCode}</div>
                          <div className="mt-0.5 text-xs text-gray-500">{secretary.mobileNumber}</div>
                          {secretary.passwordChangeRequired && (
                            <div className="mt-1 text-xs font-medium text-amber-700">Temporary password not changed</div>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${secretary.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                            {secretary.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-600">
                          <div>{secretary.deviceRegistered ? "Registered" : "Not bound"}</div>
                          <div className="mt-1">{dateText(secretary.deviceBoundAt)}</div>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-600">{dateText(secretary.lastLoginAt)}</td>
                        <td className="px-3 py-3">
                          <div className="flex flex-col items-start gap-2">
                            <button
                              type="button"
                              disabled={busyId === secretary.id}
                              onClick={() => updateActive(secretary)}
                              className={`rounded-md border px-2 py-1 text-xs font-medium disabled:opacity-50 ${secretary.active ? "border-red-200 text-red-700 hover:bg-red-50" : "border-green-200 text-green-700 hover:bg-green-50"}`}
                            >
                              {secretary.active ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              type="button"
                              disabled={busyId === secretary.id}
                              onClick={() => resetDevice(secretary)}
                              className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              Reset browser
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
