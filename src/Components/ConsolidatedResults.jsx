/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../apiConfig";
import Header from "./Header";

const APPARATUS_BY_TYPE = {
  MAG: [
    { label: "All around", value: "" },
    { label: "Floor Exercise", value: "Floor_Exercise" },
    { label: "Table Vault", value: "Table_Vault" },
    { label: "Pommel Horse", value: "Pommel_Horse" },
    { label: "Rings", value: "Rings" },
    { label: "Parallel Bars", value: "Parallel_Bars" },
    { label: "Horizontal Bar", value: "Horizontal_Bar" },
  ],
  WAG: [
    { label: "All around", value: "" },
    { label: "Floor Exercise", value: "Floor_Exercise" },
    { label: "Table Vault", value: "Table_Vault" },
    { label: "Balancing Beam", value: "Balancing_Beam" },
    { label: "Uneven Bars", value: "Uneven_Bars" },
  ],
};

function ConsolidatedResults() {
  const { ageGroup, type } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApparatus, setSelectedApparatus] = useState("");

  const [selectedPlayerScore, setSelectedPlayerScore] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState("");

  const isMAG = type === "MAG";

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const url = selectedApparatus
          ? `/getConsolidated/${ageGroup}/${type}/${selectedApparatus}`
          : `/getConsolidated/${ageGroup}/${type}`;

        const res = await api.get(url);
        setResults(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [ageGroup, type, selectedApparatus]);

  const handlePlayerClick = async (player) => {
    if (!selectedApparatus) return;

    const playerId = player.playerId ?? player.id;

    if (!playerId) {
      setScoreError("Player ID is not available.");
      setSelectedPlayerScore({});
      return;
    }

    setSelectedPlayerScore({});
    setScoreError("");
    setScoreLoading(true);

    try {
      const url = `/getConsolidated/${ageGroup}/${type}/${selectedApparatus}/${playerId}`;

      const res = await api.get(url);

      setSelectedPlayerScore(res.data);
    } catch (err) {
      console.error("Unable to fetch player score:", err);
      setScoreError(
        err.response?.data?.message ||
        "Unable to load score details. Please try again."
      );
    } finally {
      setScoreLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-4">
          Consolidated Results – {ageGroup} {isMAG ? "Boys" : "Girls"}
        </h1>

        {/* ================= APPARATUS SELECT ================= */}
        <div className="flex justify-center mb-6">
          <select
            value={selectedApparatus}
            onChange={(e) => setSelectedApparatus(e.target.value)}
            className="border px-4 py-2 rounded-lg text-sm bg-white shadow-sm"
          >
            {APPARATUS_BY_TYPE[type]?.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="text-center text-gray-500">Loading results...</div>
        )}

        {/* ================= NO DATA ================= */}
        {!loading && results.length === 0 && (
          <div className="text-center text-gray-500">
            No results available. Wait for score update after completion of the
            event.
          </div>
        )}

        {/* ================= DESKTOP ================= */}
        {!loading && results.length > 0 && (
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="p-3 text-left">Rank</th>
                  <th className="p-3 text-left">Player</th>
                  <th className="p-3 text-left">Unit</th>

                  {!selectedApparatus && (
                    <>
                      <th className="p-3 text-center">Floor</th>
                      <th className="p-3 text-center">Vault</th>

                      {isMAG ? (
                        <>
                          <th className="p-3 text-center">Pommel</th>
                          <th className="p-3 text-center">Rings</th>
                          <th className="p-3 text-center">P.Bars</th>
                          <th className="p-3 text-center">H.Bar</th>
                        </>
                      ) : (
                        <>
                          <th className="p-3 text-center">Beam</th>
                          <th className="p-3 text-center">U.Bars</th>
                        </>
                      )}
                    </>
                  )}

                  <th className="p-3 text-center font-bold">
                    {selectedApparatus ? "Score" : "Total"}
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.map((p, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-semibold">{p.rank ?? index + 1}</td>

                    {/* <td className="p-3 font-semibold">{p.playerName || "—"}</td> */}

                    <td className="p-3 font-semibold">
                      {selectedApparatus ? (
                        <button
                          type="button"
                          onClick={() => handlePlayerClick(p)}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
                        >
                          {p.playerName || "—"}
                        </button>
                      ) : (
                        p.playerName || "—"
                      )}
                    </td>

                    <td className="p-3">{p.clubName}</td>

                    {!selectedApparatus && (
                      <>
                        <td className="p-3 text-center">{p.floorExercise}</td>
                        <td className="p-3 text-center">{p.tableVault}</td>

                        {isMAG ? (
                          <>
                            <td className="p-3 text-center">{p.pommelHorse}</td>
                            <td className="p-3 text-center">{p.rings}</td>
                            <td className="p-3 text-center">
                              {p.parallelBars}
                            </td>
                            <td className="p-3 text-center">
                              {p.horizontalBar}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3 text-center">
                              {p.balancingBeam}
                            </td>
                            <td className="p-3 text-center">{p.unevenBars}</td>
                          </>
                        )}
                      </>
                    )}

                    <td className="p-3 text-center font-bold">
                      {p.totalScore.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= MOBILE ================= */}
        {!loading && results.length > 0 && (
          <div className="md:hidden space-y-4">
            {results.map((p, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    {/* <p className="font-bold">
                      #{p.rank ?? index + 1} {p.playerName || ""}
                    </p> */}

                    <p className="font-bold">
                      #{p.rank ?? index + 1}{" "}
                      {selectedApparatus ? (
                        <button
                          type="button"
                          onClick={() => handlePlayerClick(p)}
                          className="text-indigo-600 hover:underline"
                        >
                          {p.playerName || ""}
                        </button>
                      ) : (
                        p.playerName || ""
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{p.clubName}</p>
                  </div>
                  <div className="font-bold text-indigo-600">
                    {Math.round(p.totalScore * 1000) / 1000}
                  </div>
                </div>

                {!selectedApparatus && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>Floor: {p.floorExercise}</p>
                    <p>Vault: {p.tableVault}</p>

                    {isMAG ? (
                      <>
                        <p>Pommel: {p.pommelHorse}</p>
                        <p>Rings: {p.rings}</p>
                        <p>P.Bars: {p.parallelBars}</p>
                        <p>H.Bar: {p.horizontalBar}</p>
                      </>
                    ) : (
                      <>
                        <p>Beam: {p.balancingBeam}</p>
                        <p>U.Bars: {p.unevenBars}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* ================= PLAYER SCORE MODAL ================= */}

        {selectedPlayerScore !== null && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
            onClick={() => {
              if (!scoreLoading) {
                setSelectedPlayerScore(null);
                setScoreError("");
              }
            }}
          >
            <div
              className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="bg-indigo-700 text-white px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
                      Score Breakdown
                    </p>

                    <h2 className="text-xl font-bold mt-1">
                      {scoreLoading
                        ? "Loading..."
                        : selectedPlayerScore.playerName || "Player Score"}
                    </h2>

                    {!scoreLoading && selectedPlayerScore.ageGroup && (
                      <p className="text-sm text-indigo-200 mt-1">
                        {selectedPlayerScore.ageGroup} ·{" "}
                        {selectedPlayerScore.type}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlayerScore(null);
                      setScoreError("");
                    }}
                    disabled={scoreLoading}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-50"
                    aria-label="Close score details"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* BODY */}
              <div className="p-5">
                {scoreLoading ? (
                  <div className="py-12 text-center">
                    <div className="h-9 w-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />

                    <p className="text-gray-500 text-sm mt-4">
                      Fetching score details...
                    </p>
                  </div>
                ) : scoreError ? (
                  <div className="py-8 text-center">
                    <p className="text-red-600 font-medium">
                      {scoreError}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedPlayerScore(null)}
                      className="mt-5 px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    {/* APPARATUS */}
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">
                      {selectedPlayerScore.apparatus?.replace(/_/g, " ")}
                    </p>

                    {/* SCORE DETAILS */}
                    <div className="space-y-3">

                      {/* D1 / D2 */}
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            D1 / D2 Score
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Difficulty score
                          </p>
                        </div>

                        <p className="text-xl font-bold text-gray-900 tabular-nums">
                          {Number(selectedPlayerScore.d1d2 ?? 0).toFixed(3)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Execution
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            E Jury score 
                          </p>
                        </div>

                        <p className="text-xl font-bold text-gray-900 tabular-nums">
                          {(Number(selectedPlayerScore.eJuryOutOf ?? 0) - Number(selectedPlayerScore.avg ?? 0)).toFixed(3)}
                        </p>
                      </div>

                      {/* OTHER DEDUCTION */}
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Other Deduction
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Additional deduction
                          </p>
                        </div>

                        <p className="text-xl font-bold text-gray-600 tabular-nums">
                          {Number(
                            selectedPlayerScore.otherDeduction ?? 0
                          ).toFixed(3)}
                        </p>
                      </div>

                    </div>

                    {/* TOTAL SCORE */}
                    <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                      <p className="text-sm font-semibold text-indigo-700">
                        TOTAL SCORE
                      </p>

                      <p className="text-4xl font-extrabold text-indigo-800 mt-1 tabular-nums">
                        {Number(
                          selectedPlayerScore.totalScore ?? 0
                        ).toFixed(3)}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* FOOTER */}
              {!scoreLoading && !scoreError && (
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => setSelectedPlayerScore(null)}
                    className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsolidatedResults;
