/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiAdmin from "../apiConfigAdmin";
import Header from "./Header";
import ScoreEditModal from "./ScoreEditModal.jsx";

function ScoringPage() {
  const { ageGroup, type } = useParams();
  let i = 1;
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [editPlayer, setEditPlayer] = useState(null);


  const [apparatus, setApparatus] = useState("");
  const [scoreSheetData, setScoreSheetData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [selectedClub, setSelectedClub] = useState("");

  const [loadingScores, setLoadingScores] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  const MAG_Apparatus = [
    "Floor_Exercise",
    "Pommel_Horse",
    "Rings",
    "Table_Vault",
    "Parallel_Bars",
    "Horizontal_Bar",
    "Table_Vault_2"
  ];

  const WAG_Apparatus = [
    "Floor_Exercise",
    "Table_Vault",
    "Balancing_Beam",
    "Uneven_Bars",
    "Table_Vault_2"
  ];

  /* ---------------- FETCH PLAYERS ---------------- */
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await apiAdmin.get(
          `/getPlayersByAgeGroup/${ageGroup}/${type}`
        );

        const sortedPlayers = [...res.data].sort((a, b) => a.id - b.id);
        setPlayers(sortedPlayers);
      } catch (err) {
        console.error("Error fetching players:", err);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, [ageGroup, type]);

  /* ---------------- FETCH CLUBS ---------------- */
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await apiAdmin.get("/club/getAll");
        setClubs(res.data);
      } catch (err) {
        console.error("Error fetching clubs:", err);
      }
    };

    fetchClubs();
  }, []);

  /* ---------------- FETCH SCORES ---------------- */
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Don't run if required params aren't ready
    if (!apparatus || !ageGroup || !type) {
      setScoreSheetData([]);
      return;
    }

    const fetchScores = async () => {
      try {
        setLoadingScores(true);

        const res = await apiAdmin.post(
          `/score/getConsolidated/${ageGroup}/${type}/${apparatus}`
        );

        setScoreSheetData(res.data || []); // Ensure it's always an array
      } catch (err) {
        console.error("Error fetching scores:", err);
        setScoreSheetData([]); // Clear on error
      } finally {
        setLoadingScores(false);
      }
    };

    fetchScores();
  }, [apparatus, ageGroup, type, refreshKey]);

  /* ---------------- RELOAD SCORES HANDLER ---------------- */
  const handleReloadScores = async () => {
    if (!apparatus) return;

    try {
      setLoadingScores(true);

      const res = await apiAdmin.post(
        `/score/getConsolidated/${ageGroup}/${type}/${apparatus}`
      );

      setScoreSheetData(res.data || []);
    } catch (err) {
      console.error("Error fetching scores:", err);
      setScoreSheetData([]);
    } finally {
      setLoadingScores(false);
    }
  };
  const handleReloadPage = () => {
    window.location.reload();
  };

  /* ---------------- HELPERS ---------------- */
  const getScoreByPlayerId = (playerId) =>
    scoreSheetData.find((s) => s.playerId === playerId);

  const filteredPlayers = players.filter((player) => {
    const matchName = player.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchClub =
      !selectedClub || player.club_name === selectedClub;

    return matchName && matchClub;
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Scoring Page
          </h1>

          <div className="mt-2 text-gray-600 flex gap-6">
            <p>
              <span className="font-semibold">Age Group:</span> {ageGroup}
            </p>
            <p>
              <span className="font-semibold">Type:</span> {type}
            </p>
          </div>

          {/* Filters Row */}
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            {/* Apparatus */}
            <select
              className="w-56 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={apparatus}
              onChange={(e) => setApparatus(e.target.value)}
            >
              <option value="">Select Apparatus</option>
              {(type === "MAG" ? MAG_Apparatus : WAG_Apparatus).map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>

            {/* Search */}
            <input
              type="text"
              placeholder="Search player..."
              className="w-56 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {/* Club Filter */}
            <select
              className="w-56 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
            >
              <option value="">All Units</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.name}>
                  {club.name}
                </option>
              ))}
            </select>

            {/* Reload Button */}
            <button
              onClick={handleReloadScores}
              disabled={!apparatus || loadingScores}
              className="px-5 py-2 cursor-pointer rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400"
            >
              <span className="animate-spin mr-2">
                &#x21bb;
              </span>
              Reload Scores
            </button>
            <button
              onClick={handleReloadPage}
              disabled={!apparatus || loadingScores}
              className="px-5 cursor-pointer py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400"
            >
              Reload Page <span className="animate-spin">&#x21bb;</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {apparatus && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            {loadingScores && (
              <div className="p-4 text-center text-gray-500">
                Loading scores...
              </div>
            )}

            <table className="min-w-full border border-gray-300 text-sm text-center">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {[
                    "Player",
                    "D1/D2",
                    "E Jury Out Of",
                    "Start Value",
                    "E1",
                    "E2",
                    "E3",
                    "E4",
                    "E5",
                    "E6",
                    "E7",
                    "Total Deduction",
                    "Avg",
                    "Other Ded.",
                    "Total Score",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border border-gray-400 px-3 py-2"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredPlayers.map((player, idx) => {
                  const score = getScoreByPlayerId(player.id);

                  return (
                    <tr
                      key={player.id}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="border px-3 py-2 text-blue-700 cursor-pointer font-medium flex justify-between items-center"
                        onClick={() => setEditPlayer(player)}>
                        {i++}. {player.name}
                        <span className="text-xs text-gray-500">
                          {player.club_name}
                        </span>
                      </td>
                      <td className="border px-3 py-2">{score?.d1d2 ?? "-"}</td>
                      <td className="border px-3 py-2">{score?.eJuryOutOf ?? "-"}</td>
                      <td className="border px-3 py-2">{score?.startValue ?? "-"}</td>
                      <td className="border px-3 py-2">{score?.e1 ?? "-"}</td>
                      <td className="border px-3 py-2">{score?.e2 ?? "-"}</td>
                      <td className="border px-3 py-2">{score?.e3 ?? "-"}</td>
                      <td className="border px-3 py-2">{score?.e4 ?? "-"}</td>
                      <td className="border px-3 py-2">{score?.e5 ?? "-"}</td>
                      <td className="border px-3 py-2">{score?.e6 ?? "-"}</td>
                      <td className="border px-3 py-2">{score?.e7 ?? "-"}</td>
                      <td className="border px-3 py-2">
                        {score?.totalDeduction?.toFixed(2) ?? "-"}
                      </td>
                      <td className="border px-3 py-2">
                        {score?.avg?.toFixed(2) ?? "-"}
                      </td>
                      <td className="border px-3 py-2">
                        {score?.otherDeduction ?? "-"}
                      </td>
                      <td className="border px-3 py-2 font-bold text-blue-600">
                        {score?.totalScore ?? "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!filteredPlayers.length && (
              <div className="p-4 text-center text-gray-500">
                No players match the current filter
              </div>
            )}
          </div>
        )}

        {loadingPlayers && (
          <div className="text-center text-gray-500 mt-4">
            Loading players...
          </div>
        )}
      </div>
      <ScoreEditModal
        open={!!editPlayer}
        onClose={() => setEditPlayer(null)}
        player={editPlayer}
        apparatus={apparatus}
        ageGroup={ageGroup}
        type={type}
        existingScore={
          editPlayer ? getScoreByPlayerId(editPlayer.id) : null
        }
        onSuccess={handleReloadScores}
      />
    </div>
  );
}

export default ScoringPage;