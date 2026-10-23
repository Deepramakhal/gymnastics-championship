import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiSecretary from "../apiSecretary";

const GROUPS = {
    MAG: [
        { title: "Grade 1", code: "G1", divisions: ["IN"] },
        { title: "Grade 2", code: "G2", divisions: ["IN"] },
        { title: "Grade 3", code: "G3", divisions: ["IN"] },
        { title: "Grade 4", code: "G4", divisions: ["IN", "OPEN"] },
        { title: "Grade 5", code: "G5", divisions: ["IN", "OPEN"] },
        { title: "Grade 6", code: "G6", divisions: ["IN", "OPEN"] },
        { title: "Grade 7", code: "G7", divisions: ["IN", "OPEN"] },
        { title: "Grade 8", code: "G8", divisions: ["IN", "OPEN"] },
        { title: "Grade 9", code: "G9", divisions: ["IN", "OPEN"] },
        { title: "Grade 10 (Junior)", code: "G10", divisions: ["IN"] },
        { title: "Senior", code: "SENIOR", divisions: ["IN"] },
    ],
    WAG: [
        { title: "Grade 1", code: "G1", divisions: ["IN"] },
        { title: "Grade 2", code: "G2", divisions: ["IN"] },
        { title: "Grade 3", code: "G3", divisions: ["IN"] },
        { title: "Grade 4", code: "G4", divisions: ["IN", "OPEN"] },
        { title: "Grade 5", code: "G5", divisions: ["IN", "OPEN"] },
        { title: "Grade 6", code: "G6", divisions: ["IN", "OPEN"] },
        { title: "Grade 7", code: "G7", divisions: ["IN", "OPEN"] },
        { title: "Grade 8", code: "G8", divisions: ["IN", "OPEN"] },
        { title: "Grade 9", code: "G9", divisions: ["IN", "OPEN"] },
        { title: "Grade 10", code: "G10", divisions: ["IN", "OPEN"] },
        { title: "Junior", code: "JUNIOR", divisions: ["IN"] },
        { title: "Senior", code: "SENIOR", divisions: ["IN"] },
    ],
};

const APPARATUS = {
    MAG: [
        "Floor_Exercise",
        "Pommel_Horse",
        "Rings",
        "Table_Vault",
        "Parallel_Bars",
        "Horizontal_Bar",
        "Table_Vault_2",
    ],
    WAG: [
        "Floor_Exercise",
        "Table_Vault",
        "Balancing_Beam",
        "Uneven_Bars",
        "Table_Vault_2",
    ],
};

const E_FIELDS = ["e1", "e2", "e3", "e4", "e5", "e6", "e7"];

const EMPTY_FORM = {
    d1d2: "",
    eJuryOutOf: "",
    e1: "",
    e2: "",
    e3: "",
    e4: "",
    e5: "",
    e6: "",
    e7: "",
    otherDeduction: "",
};

const ALL_GROUPS = ["MAG", "WAG"].flatMap((type) =>
    GROUPS[type].flatMap((group) =>
        group.divisions.map((division) => ({
            ...group,
            type,
            division,
            ageGroup: `${group.code}${division}`,
            label: `${group.title} (${division})`,
        }))
    )
);

const readable = (value) =>
    String(value || "")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

function getErrorMessage(error) {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (error?.response?.status === 401) {
        return "Your secretary session has expired, or this endpoint rejected the session.";
    }

    if (error?.response?.status === 403) {
        return "Your secretary account cannot access this resource.";
    }

    if (error?.response?.status === 409) {
        return "A score has already been submitted. Contact the administrator if it needs correction.";
    }

    return "The request could not be completed. Please try again.";
}

function SecretaryScoringPage() {
    const navigate = useNavigate();
    const { ageGroup, type } = useParams();

    const isScoringView = Boolean(ageGroup && type);

    const selectedGroup = ALL_GROUPS.find(
        (group) => group.ageGroup === ageGroup && group.type === type
    );

    const validRoute =
        !isScoringView ||
        (Boolean(selectedGroup) && ["MAG", "WAG"].includes(type));

    const groupTitle = selectedGroup?.label || ageGroup;

    const [authStatus, setAuthStatus] = useState("checking");
    const [secretary, setSecretary] = useState(null);
    const [authError, setAuthError] = useState("");

    const [players, setPlayers] = useState([]);
    const [playersLoading, setPlayersLoading] = useState(false);
    const [playersError, setPlayersError] = useState("");

    const [apparatus, setApparatus] = useState("");
    const [scores, setScores] = useState([]);
    const [scoresLoading, setScoresLoading] = useState(false);
    const [scoresError, setScoresError] = useState("");

    const [searchText, setSearchText] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const [globalValue, setGlobalValue] = useState("");

    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // Verify secretary session.
    useEffect(() => {
        let active = true;

        apiSecretary
            .get("/secretary-auth/me")
            .then((response) => {
                if (!active) return;

                const data = response.data || {};
                setSecretary(data.secretary || data);
                setAuthStatus("authenticated");
            })
            .catch((error) => {
                if (!active) return;

                setAuthError(getErrorMessage(error));
                setAuthStatus("unauthenticated");
            });

        return () => {
            active = false;
        };
    }, []);

    // Fetch players using the same combined age-group identifier as admin.
    useEffect(() => {
        setPlayers([]);
        setPlayersError("");
        setSearchText("");
        setApparatus("");
        setScores([]);
        setScoresError("");
        setSelectedPlayer(null);

        if (
            authStatus !== "authenticated" ||
            !isScoringView ||
            !validRoute
        ) {
            return;
        }

        let active = true;

        setPlayersLoading(true);

        apiSecretary
            .get(
                `/getPlayersByAgeGroup/${encodeURIComponent(ageGroup)}/${type}`
            )
            .then((response) => {
                if (!active) return;

                const data = Array.isArray(response.data) ? response.data : [];

                setPlayers(
                    [...data].sort((a, b) => Number(a.id) - Number(b.id))
                );
            })
            .catch((error) => {
                if (active) {
                    setPlayersError(getErrorMessage(error));
                }
            })
            .finally(() => {
                if (active) setPlayersLoading(false);
            });

        return () => {
            active = false;
        };
    }, [authStatus, ageGroup, type, isScoringView, validRoute]);

    // Fetch score sheets using the same endpoint as admin.
    const refreshScores = useCallback(async () => {
        if (!apparatus || !ageGroup || !type) {
            setScores([]);
            setScoresError("");
            return;
        }

        setScoresLoading(true);
        setScoresError("");

        try {
            const response = await apiSecretary.post(
                `/secretary-scoring/getConsolidated/${ageGroup}/${type}/${apparatus}`
            )
            setScores(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setScores([]);
            setScoresError(getErrorMessage(error));
        } finally {
            setScoresLoading(false);
        }
    }, [apparatus, ageGroup, type]);

    useEffect(() => {
        if (authStatus === "authenticated" && apparatus) {
            refreshScores();
        }
    }, [authStatus, refreshScores, apparatus]);

    const filteredPlayers = useMemo(() => {
        const query = searchText.trim().toLowerCase();

        if (!query) return players;

        return players.filter((player) =>
            `${player.name || player.playerName || ""} ${player.club_name || player.clubName || ""
                }`
                .toLowerCase()
                .includes(query)
        );
    }, [players, searchText]);

    const getScore = (player) =>
        scores.find(
            (score) => String(score.playerId) === String(player.id)
        );

    const openScoring = (player) => {
        if (
            !apparatus ||
            scoresLoading ||
            scoresError ||
            getScore(player)
        ) {
            return;
        }

        setSubmitError("");
        setForm(EMPTY_FORM);
        setSelectedPlayer(player);
    };

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const applyGlobalValue = async () => {
        if (
            globalValue.trim() === "" ||
            !Number.isFinite(Number(globalValue))
        ) {
            alert("Enter a valid global value");
            return;
        }

        if (!selectedPlayer || !apparatus) return;

        try {
            await apiSecretary.post(
                `/secretary-scoring/globalValue/${selectedPlayer.id}/${Number(globalValue)}/${type}/${apparatus}`
            );

            alert("Global value applied successfully");
            setSelectedPlayer(null);
            setGlobalValue("");
            await refreshScores();
        } catch (error) {
            console.error("Global value update failed:", error);
            alert(getErrorMessage(error));
        }
    };

    const submitScore = async (event) => {
        event.preventDefault();
        setSubmitError("");

        if (!selectedPlayer || !apparatus) return;

        const juryValues = E_FIELDS.map((field) =>
            Number(form[field] || 0)
        );

        let zeroSeen = false;

        for (let index = 0; index < juryValues.length; index += 1) {
            if (juryValues[index] <= 0) {
                zeroSeen = true;
            } else if (zeroSeen) {
                setSubmitError(
                    `Enter E-jury values continuously from E1. E${index + 1} cannot be filled after a blank value.`
                );
                return;
            }
        }

        if (juryValues.filter((value) => value > 0).length < 3) {
            setSubmitError("At least 3 E-jury values are required.");
            return;
        }

        const playerName =
            selectedPlayer.name ||
            selectedPlayer.playerName ||
            `Player ${selectedPlayer.id}`;

        const confirmed = window.confirm(
            `Submit the score for ${playerName}? You will not be able to edit it after submission.`
        );

        if (!confirmed) return;

        const payload = {
            playerId: selectedPlayer.id,
            playerName,
            ageGroup,
            type,
            apparatus,
            d1d2: Number(form.d1d2 || 0),
            eJuryOutOf: Number(form.eJuryOutOf || 0),
            e1: Number(form.e1 || 0),
            e2: Number(form.e2 || 0),
            e3: Number(form.e3 || 0),
            e4: Number(form.e4 || 0),
            e5: Number(form.e5 || 0),
            e6: Number(form.e6 || 0),
            e7: Number(form.e7 || 0),
            otherDeduction: Number(form.otherDeduction || 0),
        };

        setSubmitting(true);

        try {
            await apiSecretary.post(
                "/secretary-scoring/scoring",
                payload
            );

            setSelectedPlayer(null);
            setForm(EMPTY_FORM);

            await refreshScores();
        } catch (error) {
            setSubmitError(getErrorMessage(error));

            if (error?.response?.status === 409) {
                await refreshScores();
            }
        } finally {
            setSubmitting(false);
        }
    };

    const logout = async () => {
        setLoggingOut(true);

        try {
            await apiSecretary.post(
                "/secretary-auth/logout",
                {},
                { withCredentials: true }
            );
        } catch {
            // Return to the public page even if the session has expired.
        } finally {
            navigate("/", { replace: true });
        }
    };

    if (authStatus === "checking") {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-600">
                    Checking secretary session…
                </p>
            </main>
        );
    }

    if (authStatus === "unauthenticated") {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
                <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-3 text-3xl">🔒</div>
                    <h1 className="text-xl font-bold text-slate-900">
                        Secretary session required
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">{authError}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white"
                    >
                        Return to login
                    </button>
                </section>
            </main>
        );
    }

    if (!validRoute) {
        return (
            <main className="min-h-screen bg-slate-50 p-5">
                <button
                    onClick={() => navigate("/secretary")}
                    className="rounded-xl bg-white px-4 py-3 font-semibold shadow-sm"
                >
                    ← All grades
                </button>
                <p className="mt-5 text-sm text-red-700">
                    This age group or scoring type is not available.
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-8">
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            HDGA • Secretary
                        </p>

                        <h1 className="truncate text-lg font-bold text-slate-900">
                            {isScoringView
                                ? `${groupTitle} · ${type === "MAG" ? "Boys" : "Girls"}`
                                : "Scoring Dashboard"}
                        </h1>

                        <p className="truncate text-xs text-slate-500">
                            {secretary?.name ||
                                secretary?.secretaryName ||
                                secretary?.secretaryCode ||
                                "Signed in"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        disabled={loggingOut}
                        className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
                    >
                        {loggingOut ? "Signing out…" : "Sign out"}
                    </button>
                </div>
            </header>

            {!isScoringView ? (
                <section className="mx-auto max-w-3xl px-4 py-6">
                    <div className="mb-5 rounded-2xl bg-indigo-700 p-5 text-white shadow-sm">
                        <p className="text-sm text-indigo-100">
                            Welcome to the scoring desk
                        </p>
                        <h2 className="mt-1 text-2xl font-bold">
                            Choose your category
                        </h2>
                        <p className="mt-2 text-sm leading-5 text-indigo-100">
                            Select the grade and division to see players and submit
                            scores. Submitted scores cannot be edited by a secretary.
                        </p>
                    </div>

                    {["MAG", "WAG"].map((groupType) => (
                        <section key={groupType} className="mb-7">
                            <div className="mb-3 flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-700">
                                    {groupType === "MAG" ? "♂" : "♀"}
                                </span>

                                <h3 className="text-lg font-bold text-slate-900">
                                    {groupType === "MAG"
                                        ? "Boys Artistic Gymnastics (MAG)"
                                        : "Girls Artistic Gymnastics (WAG)"}
                                </h3>
                            </div>

                            <div className="space-y-2">
                                {ALL_GROUPS.filter(
                                    (group) => group.type === groupType
                                ).map((group) => (
                                    <button
                                        key={`${group.ageGroup}-${groupType}`}
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/secretary/scoring/${group.ageGroup}/${group.type}`
                                            )
                                        }
                                        className="flex min-h-14 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
                                    >
                                        <span className="font-semibold text-slate-900">
                                            {group.label}
                                        </span>
                                        <span className="text-xl text-slate-400">›</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    ))}
                </section>
            ) : (
                <section className="mx-auto max-w-3xl px-3 py-4 sm:px-4 sm:py-6">
                    <button
                        type="button"
                        onClick={() => navigate("/secretary")}
                        className="mb-4 rounded-lg px-2 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                    >
                        ← All grades
                    </button>

                    <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                            {type === "MAG" ? "Boys MAG" : "Girls WAG"}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            {groupTitle}
                        </h2>

                        <label
                            htmlFor="apparatus"
                            className="mb-2 mt-4 block text-sm font-semibold text-slate-700"
                        >
                            Apparatus
                        </label>

                        <select
                            id="apparatus"
                            value={apparatus}
                            onChange={(event) => setApparatus(event.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">Choose apparatus</option>
                            {(APPARATUS[type] || []).map((item) => (
                                <option key={item} value={item}>
                                    {readable(item)}
                                </option>
                            ))}
                        </select>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            Submitted scores are locked. Contact the administrator if
                            a score needs correction.
                        </p>
                    </div>

                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            Players{" "}
                            <span className="text-sm font-medium text-slate-500">
                                ({filteredPlayers.length})
                            </span>
                        </h2>

                        {apparatus && (
                            <button
                                type="button"
                                onClick={refreshScores}
                                disabled={scoresLoading}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                            >
                                {scoresLoading ? "Refreshing…" : "Refresh"}
                            </button>
                        )}
                    </div>

                    <input
                        type="search"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        placeholder="Search player or club…"
                        aria-label="Search player or club"
                        className="mb-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                    {playersError && (
                        <div
                            role="alert"
                            className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                        >
                            Could not load players. {playersError}
                        </div>
                    )}

                    {scoresError && apparatus && (
                        <div
                            role="alert"
                            className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                        >
                            Could not verify submitted scores. Scoring is disabled
                            until the score list can be loaded. {scoresError}
                        </div>
                    )}

                    {playersLoading ? (
                        <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500">
                            Loading players…
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredPlayers.map((player) => {
                                const score = getScore(player);
                                const submitted = Boolean(score);

                                const disabled =
                                    !apparatus ||
                                    scoresLoading ||
                                    Boolean(scoresError) ||
                                    submitted;

                                return (
                                    <button
                                        type="button"
                                        key={player.id}
                                        disabled={disabled}
                                        onClick={() => openScoring(player)}
                                        className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left shadow-sm transition ${submitted
                                            ? "border-emerald-200 bg-emerald-50"
                                            : disabled
                                                ? "border-slate-200 bg-white opacity-70"
                                                : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50"
                                            }`}
                                    >
                                        <span
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${submitted
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {submitted
                                                ? "✓"
                                                : (
                                                    player.name ||
                                                    player.playerName ||
                                                    "?"
                                                )
                                                    .trim()
                                                    .charAt(0)
                                                    .toUpperCase()}
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate font-semibold text-slate-900">
                                                {player.name ||
                                                    player.playerName ||
                                                    `Player ${player.id}`}
                                            </span>
                                            <span className="mt-1 block truncate text-sm text-slate-500">
                                                {player.club_name ||
                                                    player.clubName ||
                                                    "Club not listed"}
                                            </span>
                                        </span>

                                        <span className="shrink-0 text-right">
                                            <span
                                                className={`block rounded-full px-2.5 py-1 text-xs font-bold ${submitted
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-amber-100 text-amber-800"
                                                    }`}
                                            >
                                                {submitted ? "Submitted" : "Pending"}
                                            </span>

                                            {submitted && (
                                                <span className="mt-1 block text-xs font-semibold text-emerald-800">
                                                    {score.totalScore ?? "Saved"}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}

                            {!filteredPlayers.length && (
                                <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500">
                                    {playersError
                                        ? "Players could not be loaded."
                                        : "No players found for this category."}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            )}

            {selectedPlayer && (
                <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/50 sm:items-center sm:p-4">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="score-entry-title"
                        className="flex max-h-[96dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl"
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6">
                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                    New score · {readable(apparatus)}
                                </p>

                                <h2
                                    id="score-entry-title"
                                    className="mt-1 truncate text-xl font-bold text-slate-900"
                                >
                                    {selectedPlayer.name || selectedPlayer.playerName}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {selectedPlayer.club_name ||
                                        selectedPlayer.clubName ||
                                        ""}{" "}
                                    · {groupTitle} · {type}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedPlayer(null)}
                                disabled={submitting}
                                aria-label="Close score form"
                                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={submitScore}
                            className="flex min-h-0 flex-1 flex-col"
                        >
                            <div className="overflow-y-auto px-4 py-4 sm:px-6">
                                <div className="grid grid-cols-2 gap-3">
                                    <ScoreInput
                                        label="D1 / D2"
                                        value={form.d1d2}
                                        onChange={(value) => updateField("d1d2", value)}
                                    />

                                    <ScoreInput
                                        label="E Jury Out Of"
                                        value={form.eJuryOutOf}
                                        onChange={(value) =>
                                            updateField("eJuryOutOf", value)
                                        }
                                    />

                                    {E_FIELDS.map((field, index) => (
                                        <ScoreInput
                                            key={field}
                                            label={`E${index + 1}`}
                                            value={form[field]}
                                            onChange={(value) => updateField(field, value)}
                                        />
                                    ))}

                                    <ScoreInput
                                        label="Other Deduction"
                                        value={form.otherDeduction}
                                        onChange={(value) =>
                                            updateField("otherDeduction", value)
                                        }
                                    />
                                </div>


                                {/* GLOBAL VALUE */}
                                <div className="mt-6 border-t border-slate-200 pt-4">
                                    <label
                                        htmlFor="globalValue"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Apply Global Value
                                    </label>

                                    <div className="flex gap-3">
                                        <input
                                            id="globalValue"
                                            type="number"
                                            step="any"
                                            value={globalValue}
                                            onChange={(event) => setGlobalValue(event.target.value)}
                                            placeholder="Enter global value"
                                            className="w-full rounded-xl border border-slate-300 px-3 py-3
                 text-base outline-none focus:border-red-500
                 focus:ring-2 focus:ring-red-100"
                                        />

                                        <button
                                            type="button"
                                            onClick={applyGlobalValue}
                                            disabled={submitting}
                                            className="shrink-0 rounded-xl bg-red-600 px-4 py-3
                 font-semibold text-white hover:bg-red-700
                 disabled:opacity-50"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                                {submitError && (
                                    <div
                                        role="alert"
                                        className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
                                    >
                                        {submitError}
                                    </div>
                                )}

                                <p className="mt-4 text-xs leading-5 text-slate-500">
                                    Check every value before submitting. After the backend
                                    accepts this score, it cannot be edited by a secretary.
                                </p>
                            </div>

                            <div className="border-t border-slate-200 bg-white p-4 sm:px-6">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPlayer(null)}
                                        disabled={submitting}
                                        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {submitting ? "Submitting…" : "Confirm & Submit"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}

function ScoreInput({ label, value, onChange }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                {label}
            </span>

            <input
                type="number"
                inputMode="decimal"
                step="any"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
        </label>
    );
}

export default SecretaryScoringPage;