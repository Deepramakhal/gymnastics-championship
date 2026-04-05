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

                    <td className="p-3 font-semibold">{p.playerName || "—"}</td>

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
                    <p className="font-bold">
                      #{p.rank ?? index + 1} {p.playerName || ""}
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
      </div>
    </div>
  );
}

export default ConsolidatedResults;
