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

  const searchRef = useRef(null);

  const APPARATUS_BY_TYPE = {
    MAG: [
      { label: "Floor Exercise", key: "Floor_Exercise" },
      { label: "Pommel Horse/Mushroom", key: "Pommel_Horse" },
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

    const filtered = allPlayers.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredPlayers(filtered);
  }, [searchTerm, allPlayers]);


  /* Click outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFilteredPlayers([]);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  const resultSheets = [
    { title: "Under 4 Boys", ageGroup: "U4", type: "MAG" },
    { title: "Under 4 Girls", ageGroup: "U4", type: "WAG" },
  { title: "Under 6 Boys", ageGroup: "U6", type: "MAG" },
  { title: "Under 6 Girls", ageGroup: "U6", type: "WAG" },
  { title: "Under 8 Boys", ageGroup: "U8", type: "MAG" },
  { title: "Under 8 Girls", ageGroup: "U8", type: "WAG" },
  // { title: "Under 10 Boys", ageGroup: "U10", type: "MAG" },
  // { title: "Under 10 Girls", ageGroup: "U10", type: "WAG" },
  { title: "11 & above Boys", ageGroup: "A11", type: "MAG" },
  { title: "11 & above Girls", ageGroup: "A11", type: "WAG" }
  // {title:"Under 12 Boys", ageGroup:"U12", type:"MAG"},
  // {title:"Under 12 Girls", ageGroup:"U12", type:"WAG"},
  // {title:"Under 14 Boys", ageGroup:"U14", type:"MAG"},
  // {title:"Under 14 Girls", ageGroup:"U14", type:"WAG"},
  // {title:"Under 17 Boys", ageGroup:"U17", type:"MAG"},
  // {title:"Under 17 Girls", ageGroup:"U17", type:"WAG"},
  // {title:"Senior Boys", ageGroup:"SENIOR", type:"MAG"},
  // {title:"Senior Girls", ageGroup:"SENIOR", type:"WAG"},
];


  const handleNavigateToResults = (ageGroup, type) => {
    navigate(`/consolidated/${ageGroup}/${type}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* HERO */}
      <div className="bg-linear-to-b from-indigo-50 to-white py-6 px-4 text-center">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
          Gymnastics Championship Portal
        </h1>
        <div className="mt-3 inline-flex items-center cursor-pointer gap-2 text-xs text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full"
        onClick={()=>window.location.reload()}>
          ⟳ Reload occasionally to see updates
        </div>
      </div>

      {/* SEARCH */}
      <div
        ref={searchRef}
        className="max-w-md mx-auto mt-6 px-4 relative z-40"
      >
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search gymnast by name..."
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setFilteredPlayers([])}}
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
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-xs text-gray-500">
                        {player.club_name}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        player.type === "MAG"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      {player.type === "MAG" ? "Boys" : "Girls"}
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

      {/* RESULT SHEETS */}
      <h2 className="mt-10 text-lg font-semibold text-center">
        Result Sheets
      </h2>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 max-w-5xl mx-auto">
        {resultSheets.map((sheet) => (
          <button
            key={sheet.title}
            onClick={() => handleNavigateToResults(sheet.ageGroup, sheet.type)}
            className="bg-white border rounded-2xl cursor-pointer p-4 text-left shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{sheet.title}</h3>
                <p className="text-xs text-gray-500">
                  View consolidated results
                </p>
              </div>
              <span className="text-xl">📄</span>
            </div>
          </button>
        ))}
      </div>

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

            <div className="grid grid-cols-2 ml-2  gap-42 text-sm mb-3">
              <p><b>Club:</b> {selectedPlayer.club_name}</p>
              <p><b>Age:</b> {selectedPlayer.ageGroup}</p>
            </div>

            <div className="space-y-2">
              {APPARATUS_BY_TYPE[selectedPlayer.type]?.map((item) => (
                <div
                  key={item.key}
                  className="flex justify-between bg-gray-100 rounded-lg px-3 py-2"
                >
                  <span>{item.label}</span>
                  <span className="font-semibold">
                    {selectedPlayer[item.key] ?? "0"}
                  </span>
                </div>
              ))}
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
            <AdminLoginForm onSuccess={() => setAdminLoginPop(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
