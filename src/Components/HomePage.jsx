/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import api from "../apiConfig";
import AdminLoginForm from "./AdminLoginForm";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const [allPlayers, setAllPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [adminLoginPop, setAdminLoginPop] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  // null = main page
  // MAG  = MAG groups
  // WAG  = WAG groups
  const [selectedType, setSelectedType] = useState(null);

  const searchRef = useRef(null);

  const APPARATUS_BY_TYPE = {
    MAG: [
      { label: "Floor Exercise", key: "Floor_Exercise" },
      { label: "Pommel Horse", key: "Pommel_Horse" },
      { label: "Rings", key: "Rings" },
      { label: "Table Vault", key: "Table_Vault" },
      { label: "Parallel Bars", key: "Parallel_Bars" },
      { label: "Horizontal Bar", key: "Horizontal_Bar" },
    ],
    WAG: [
      { label: "Floor Exercise", key: "Floor_Exercise" },
      { label: "Table Vault", key: "Table_Vault" },
      { label: "Balancing Beam", key: "Balancing_Beam" },
      { label: "Uneven Bars", key: "Uneven_Bars" },
    ],
  };

  /*
   * =========================
   * NEW GROUPING
   * =========================
   *
   * divisions:
   * ["IN"]           -> only IN
   * ["IN", "OPEN"]   -> IN + OPEN
   *
   * ageGroup is the value that will be sent to backend.
   */

  const MAG_GROUPS = [
    {
      title: "Grade 1",
      ageGroup: "G1",
      type: "MAG",
      divisions: ["IN"],
    },
    {
      title: "Grade 2",
      ageGroup: "G2",
      type: "MAG",
      divisions: ["IN"],
    },
    {
      title: "Grade 3",
      ageGroup: "G3",
      type: "MAG",
      divisions: ["IN"],
    },
    {
      title: "Grade 4",
      ageGroup: "G4",
      type: "MAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 5",
      ageGroup: "G5",
      type: "MAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 6",
      ageGroup: "G6",
      type: "MAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 7",
      ageGroup: "G7",
      type: "MAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 8",
      ageGroup: "G8",
      type: "MAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 9",
      ageGroup: "G9",
      type: "MAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 10(JUNIOR)",
      ageGroup: "G10",
      type: "MAG",
      divisions: ["IN"],
    },
    {
      title: "Senior",
      ageGroup: "SENIOR",
      type: "MAG",
      divisions: ["IN"],
    },
  ];

  const WAG_GROUPS = [
    {
      title: "Grade 1",
      ageGroup: "G1",
      type: "WAG",
      divisions: ["IN"],
    },
    {
      title: "Grade 2",
      ageGroup: "G2",
      type: "WAG",
      divisions: ["IN"],
    },
    {
      title: "Grade 3",
      ageGroup: "G3",
      type: "WAG",
      divisions: ["IN"],
    },
    {
      title: "Grade 4",
      ageGroup: "G4",
      type: "WAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 5",
      ageGroup: "G5",
      type: "WAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 6",
      ageGroup: "G6",
      type: "WAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 7",
      ageGroup: "G7",
      type: "WAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 8",
      ageGroup: "G8",
      type: "WAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 9",
      ageGroup: "G9",
      type: "WAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Grade 10",
      ageGroup: "G10",
      type: "WAG",
      divisions: ["IN", "OPEN"],
    },
    {
      title: "Junior",
      ageGroup: "JUNIOR",
      type: "WAG",
      divisions: ["IN"],
    },
    {
      title: "Senior",
      ageGroup: "SENIOR",
      type: "WAG",
      divisions: ["IN"],
    },
  ];

  /* Fetch players */
  useEffect(() => {
    const getAllPlayers = async () => {
      const res = await api.get("/getAllPlayers");
      setAllPlayers(res.data);
      setLoadingPlayers(false);
    };

    getAllPlayers();
  }, []);

  /* Search */
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPlayers([]);
      return;
    }

    const filtered = allPlayers.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredPlayers(filtered);
  }, [searchTerm, allPlayers]);

  /* Click outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setFilteredPlayers([]);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "pointerdown",
        handleClickOutside
      );
  }, []);

  const handleNavigateToResults = (
    ageGroup,
    type,
    division
  ) => {
    /*
     * Current backend route only uses:
     * /consolidated/{ageGroup}/{type}
     *
     * So for now division is not added to the URL.
     *
     * We can change this later to:
     * /consolidated/{ageGroup}/{type}/{division}
     *
     * when backend is updated.
     */
    const ageGroupWithDivision =
      division === "IN"
        ? `${ageGroup}IN`
        : `${ageGroup}OPEN`;

    navigate(`/consolidated/${ageGroupWithDivision}/${type}`);
  };

  const currentGroups =
    selectedType === "MAG"
      ? MAG_GROUPS
      : selectedType === "WAG"
        ? WAG_GROUPS
        : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* HERO */}
      <div className="bg-linear-to-b from-indigo-50 to-white py-6 px-4 text-center">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
          Gymnastics Championship Portal
        </h1>

        <div
          className="mt-3 inline-flex items-center cursor-pointer gap-2 text-xs text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full"
          onClick={() => window.location.reload()}
        >
          ⟳ Reload occasionally to get updated scores
        </div>
      </div>

      {/* SEARCH */}
      <div
        ref={searchRef}
        className="max-w-md mx-auto mt-6 px-4 relative z-40"
      >
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search gymnast by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFilteredPlayers([]);
            }}
            className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* SKELETON LOADER */}
        {searchTerm && loadingPlayers && (
          <div className="mt-2 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded-md animate-pulse"
              />
            ))}
          </div>
        )}

        {/* SEARCH RESULTS */}
        {searchTerm && !loadingPlayers && (
          <>
            {filteredPlayers.length > 0 ? (
              <ul className="absolute left-4 right-4 bg-white border rounded-xl mt-2 shadow-lg max-h-64 overflow-y-auto">
                {filteredPlayers.map((player) => (
                  <li
                    key={player.id}
                    onClick={() => {
                      setSelectedPlayer(player);
                      setSearchTerm("");
                      setFilteredPlayers([]);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-indigo-50 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">
                        {player.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {player.club_name}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${player.type === "MAG"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-pink-100 text-pink-700"
                        }`}
                    >
                      {player.type === "MAG"
                        ? "Boys"
                        : "Girls"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="absolute left-4 right-4 bg-white border rounded-xl mt-2 px-3 py-2 text-sm text-gray-500 shadow">
                No player found
              </div>
            )}
          </>
        )}
      </div>

      {/* =========================
          RESULT SHEETS
          ========================= */}

      <h2 className="mt-10 text-lg font-semibold text-center">
        Result Sheets
      </h2>

      {/* MAIN CATEGORY SELECTION */}
      {!selectedType && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5 px-4 max-w-4xl mx-auto">

          {/* MAG */}
          <button
            onClick={() => setSelectedType("MAG")}
            className="bg-white border rounded-2xl cursor-pointer p-6 text-left shadow-sm hover:shadow-md hover:border-indigo-300 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  MAG
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Men's Artistic Gymnastics
                </p>
              </div>

              <span className="text-3xl">
                🤸
              </span>
            </div>
          </button>

          {/* WAG */}
          <button
            onClick={() => setSelectedType("WAG")}
            className="bg-white border rounded-2xl cursor-pointer p-6 text-left shadow-sm hover:shadow-md hover:border-indigo-300 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  WAG
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Women's Artistic Gymnastics
                </p>
              </div>

              <span className="text-3xl">
                🤸‍♀️
              </span>
            </div>
          </button>

          {/* GRADE HELPER */}
          <button
            onClick={() => navigate("/grade-helper")}
            className="bg-white border rounded-2xl cursor-pointer p-6 text-left shadow-sm hover:shadow-md hover:border-indigo-300 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  Grade Helper
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  View official age-group rules
                </p>
              </div>

              <span className="text-3xl">
                📋
              </span>
            </div>
          </button>
        </div>
      )}

      {/* =========================
          MAG / WAG GROUPS
          ========================= */}

      {selectedType && (
        <div className="mt-5 px-4 max-w-5xl mx-auto">

          {/* BACK BUTTON + TITLE */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => setSelectedType(null)}
              className="border border-gray-300 bg-white px-4 py-2 rounded-xl text-sm cursor-pointer hover:bg-gray-100"
            >
              ← Back
            </button>

            <h3 className="text-xl font-bold">
              {selectedType} Grades
            </h3>

            <div className="w-16"></div>
          </div>

          {/* GROUP BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {currentGroups.map((group) => (
              <div
                key={`${group.type}-${group.ageGroup}`}
                className="bg-white border rounded-2xl p-4 shadow-sm"
              >
                {/* GROUP NAME */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {group.title}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {group.type}
                    </p>
                  </div>

                  <span className="text-xl">
                    📄
                  </span>
                </div>

                {/* DIVISIONS */}
                <div className="flex gap-2">
                  {group.divisions.map((division) => (
                    <button
                      key={division}
                      onClick={() =>
                        handleNavigateToResults(
                          group.ageGroup,
                          group.type,
                          division
                        )
                      }
                      className="flex-1 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-indigo-100 transition"
                    >
                      {division}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* ADMIN */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setAdminLoginPop(true)}
          className="border mb-12 cursor-pointer border-red-300 text-red-600 px-5 py-2 rounded-full text-sm hover:bg-red-50"
        >
          🔐 Admin Panel
        </button>
      </div>

      {/* PLAYER MODAL */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 relative">

            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute cursor-pointer top-2 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-center mb-3">
              {selectedPlayer.name}
            </h2>

            <div className="grid grid-cols-2 ml-2 gap-42 text-sm mb-3">
              <p>
                <b>Unit:</b> {selectedPlayer.club_name}
              </p>

              <p>
                <b>Group:</b> {selectedPlayer.ageGroup}
              </p>
            </div>

            <div className="space-y-2">
              {APPARATUS_BY_TYPE[selectedPlayer.type]?.map(
                (item) => (
                  <div
                    key={item.key}
                    className="flex justify-between bg-gray-100 rounded-lg px-3 py-2"
                  >
                    <span>{item.label}</span>

                    <span className="font-semibold">
                      {selectedPlayer[item.key] ?? "0"}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN LOGIN */}
      {adminLoginPop && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 relative">

            <button
              onClick={() => setAdminLoginPop(false)}
              className="absolute top-2 right-3"
            >
              ✕
            </button>

            <AdminLoginForm
              onSuccess={() => setAdminLoginPop(false)}
            />

          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
