/* eslint-disable */
import React, { useState, useEffect } from "react";
import api from "../apiConfig";
import apiAdmin from "../apiConfigAdmin";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();

  const [addPlayerPopOpen, setAddPlayerPopOpen] = useState(false);
  const [editPlayerPopOpen, setEditPlayerPopOpen] = useState(false);
  const [clubPopOpen, setClubPopOpen] = useState(false);
  const [printPopOpen, setPrintPopOpen] = useState(false);
  const [consolidatedSheetPopup, setConsolidatedSheetPopup] = useState(false);
  const [ageGroupForConsolidated, setAgeGroupForConsolidated] = useState("");
  const [typeForConsolidated, setTypeForConsolidated] = useState("");

  const [playersList, setPlayersList] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [clubName, setClubName] = useState("");

  const [printForm, setPrintForm] = useState({
    ageGroup: "",
    type: "MAG",
    apparatus: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    club_name: "",
    ageGroup: "",
    type: "MAG",
  });

  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    club_name: "",
    ageGroup: "",
    type: "",
  });

  /* ================= FETCH ================= */
  const fetchBaseData = () => {
    api.get("/getAllPlayers").then((res) => setAllPlayers(res.data));
    api.get("/club/getAll").then((res) => setClubs(res.data));
  };

  useEffect(() => {
    fetchBaseData();
  }, []);

  /* ================= SEARCH ================= */
  const filteredPlayers =
    searchText.trim() === ""
      ? []
      : allPlayers.filter((p) =>
          p.name.toLowerCase().includes(searchText.toLowerCase()),
        );

  /* ================= ADD PLAYER ================= */
  const addPlayerToList = () => {
    if (!formData.name || !formData.club_name || !formData.ageGroup) return;
    setPlayersList([...playersList, formData]);
    setFormData({ ...formData, name: "", club_name: "" });
  };

  const removePlayerFromList = (index) => {
    setPlayersList(playersList.filter((_, i) => i !== index));
  };

  const submitAllPlayers = async () => {
    try {
      for (const p of playersList) {
        const url = p.type === "MAG" ? "/addPlayer/Mag" : "/addPlayer/Wag";
        await apiAdmin.post(url, p);
      }
      alert("All players added");
      setPlayersList([]);
      setAddPlayerPopOpen(false);
      fetchBaseData();
    } catch {
      alert("Error adding players");
    }
  };

  /* ================= EDIT PLAYER ================= */
  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    setEditFormData({
      id: player.id,
      name: player.name,
      club_name: player.club_name,
      ageGroup: player.ageGroup,
      type: player.type,
    });
    setSearchText("");
  };

  const submitEditedPlayer = async () => {
    try {
      await apiAdmin.post(`/edit/${editFormData.type}`, {
        id: editFormData.id,
        name: editFormData.name,
        club_name: editFormData.club_name,
        ageGroup: editFormData.ageGroup,
      });
      alert("Player updated");
      setEditPlayerPopOpen(false);
      setSelectedPlayer(null);
      fetchBaseData();
    } catch {
      alert("Error updating player");
    }
  };

  /* ================= CLUB ================= */
  const clubExists = clubs.some(
    (c) => c.name.toLowerCase() === clubName.toLowerCase(),
  );

  const addClub = async () => {
    await apiAdmin.post(`/club/add/${clubName}`);
    ensureReload("Club added");
  };

  const removeClub = async () => {
    await apiAdmin.delete(`/club/remove/${clubName}`);
    ensureReload("Club removed");
  };

  const ensureReload = (msg) => {
    alert(msg);
    setClubName("");
    setClubPopOpen(false);
    fetchBaseData();
  };

  /* ================= PRINT ================= */
  const submitPrint = () => {
    if (!printForm.ageGroup || !printForm.type) return;
    navigate(
      `/scoresheet/${printForm.ageGroup}/${printForm.type}/${printForm.apparatus}`,
    );
  };

  const handleConsolidatedPrint = () => {
    navigate(
      `/consolidatedsheet/${ageGroupForConsolidated}/${typeForConsolidated}`,
    );
  };

  const navigateToScoringPage = (ageGroup, type) => {
    navigate(`/scoring/${ageGroup}/${type}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-6 text-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-600">Manage Players & Scoring</p>
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 max-w-6xl mx-auto">
        <ActionCard
          title="Add Players"
          icon="➕"
          onClick={() => setAddPlayerPopOpen(true)}
        />
        <ActionCard
          title="Edit Player"
          icon="✏️"
          onClick={() => setEditPlayerPopOpen(true)}
        />
        <ActionCard
          title="Add / Remove Unit"
          icon="🏫"
          onClick={() => setClubPopOpen(true)}
        />
        <ActionCard
          title="Print Chair of Jury Sheet"
          icon="🖨️"
          onClick={() => setPrintPopOpen(true)}
        />
        <ActionCard
          title="Print consolidatedsheet"
          icon="🖨️"
          onClick={() => setConsolidatedSheetPopup(true)}
        />

        <ActionCard
          title="U4 Boys Scoring"
          icon="📊"
          onClick={() => navigateToScoringPage("U4", "MAG")}
        />
        <ActionCard
          title="U4 Girls Scoring"
          icon="📊"
          onClick={() => navigateToScoringPage("U4", "WAG")}
        />
        <ActionCard
          title="U6 Boys Scoring"
          icon="📊"
          onClick={() => navigateToScoringPage("U6", "MAG")}
        />
        <ActionCard
          title="U6 Girls Scoring"
          icon="📊"
          onClick={() => navigateToScoringPage("U6", "WAG")}
        />
        <ActionCard
          title="U8 Boys Scoring"
          icon="📊"
          onClick={() => navigateToScoringPage("U8", "MAG")}
        />
        <ActionCard
          title="U8 Girls Scoring"
          icon="📊"
          onClick={() => navigateToScoringPage("U8", "WAG")}
        />
        <ActionCard
          title="U10 Boys Scoring"
          icon="📊"
          onClick={() => navigateToScoringPage("U10", "MAG")}
        />
        <ActionCard
          title="U10 Girls Scoring"
          icon="📊"
          onClick={() => navigateToScoringPage("U10", "WAG")}
        />
        <ActionCard
          title="11 & above Boys Scoring"
          icon="📊"
          onClick={() => navigateToScoringPage("A11", "MAG")}
        />
        <ActionCard
          title="11 & above Girls Scoring"
          icon="📊"
          onClick={() => navigateToScoringPage("A11", "WAG")}
        />
        {/* <ActionCard title="U10 Boys Scoring" icon="📊" onClick={() => navigateToScoringPage("U10", "MAG")} /> */}
        {/* <ActionCard title="U10 Girls Scoring" icon="📊" onClick={() => navigateToScoringPage("U10", "WAG")} /> */}
        {/* <ActionCard title="U12 Boys Scoring" icon="📊" onClick={() => navigateToScoringPage("U12", "MAG")} /> */}
        {/* <ActionCard title="U12 Girls Scoring" icon="📊" onClick={() => navigateToScoringPage("U12", "WAG")} /> */}
        {/* <ActionCard title="U14 Boys Scoring" icon="📊" onClick={() => navigateToScoringPage("U14", "MAG")} /> */}
        {/* <ActionCard title="U14 Girls Scoring" icon="📊" onClick={() => navigateToScoringPage("U14", "WAG")} /> */}
        {/* <ActionCard title="U17 Boys Scoring" icon="📊" onClick={() => navigateToScoringPage("U17", "MAG")} /> */}
        {/* <ActionCard title="U17 Girls Scoring" icon="📊" onClick={() => navigateToScoringPage("U17", "WAG")} /> */}
        {/* <ActionCard title="SENIOR Boys Scoring" icon="📊" onClick={() => navigateToScoringPage("SENIOR", "MAG")} /> */}
        {/* <ActionCard title="SENIOR Girls Scoring" icon="📊" onClick={() => navigateToScoringPage("SENIOR", "WAG")} /> */}
      </div>

      {/* ================= CLUB MODAL ================= */}
      {clubPopOpen && (
        <Modal onClose={() => setClubPopOpen(false)}>
          <h2 className="modal-title">Add / Remove Unit</h2>

          <Input
            placeholder="Unit Name"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
          />

          {clubName && !clubExists && (
            <button onClick={addClub} className="success-btn">
              ➕ Add Unit
            </button>
          )}

          {clubName && clubExists && (
            <button onClick={removeClub} className="danger-btn">
              ❌ Remove Unit
            </button>
          )}
        </Modal>
      )}

      {/* ================= PRINT MODAL ================= */}
      {printPopOpen && (
        <Modal onClose={() => setPrintPopOpen(false)}>
          <h2 className="modal-title">Print Chair of Jury Sheet</h2>

          <Select
            value={printForm.ageGroup}
            onChange={(e) =>
              setPrintForm({ ...printForm, ageGroup: e.target.value })
            }
          >
            <option value="">Select Age Group</option>
            {["U4", "U6", "U8","U10", "A11"].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>

          <Select
            value={printForm.type}
            onChange={(e) =>
              setPrintForm({ ...printForm, type: e.target.value })
            }
          >
            <option value="MAG">MAG</option>
            <option value="WAG">WAG</option>
          </Select>

          <input
            type="text"
            placeholder="Apparatus"
            value={printForm.apparatus}
            onChange={(e) =>
              setPrintForm({ ...printForm, apparatus: e.target.value })
            }
          />

          <button onClick={submitPrint} className="primary-btn">
            🖨️ Print
          </button>
        </Modal>
      )}

      {/* ================= ADD MODAL ================= */}
      {addPlayerPopOpen && (
        <Modal
          onClose={() => {
            setAddPlayerPopOpen(false);
            setPlayersList([]);
          }}
        >
          <h2 className="modal-title">Add Players</h2>

          <Input
            placeholder="Player Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Select
            value={formData.club_name}
            onChange={(e) =>
              setFormData({ ...formData, club_name: e.target.value })
            }
          >
            <option value="">Select Club</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            value={formData.ageGroup}
            onChange={(e) =>
              setFormData({ ...formData, ageGroup: e.target.value })
            }
          >
            <option value="">Select Age Group</option>
            {["U4", "U6", "U8","U10", "A11"].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>

          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="MAG">MAG</option>
            <option value="WAG">WAG</option>
          </Select>

          <button onClick={addPlayerToList} className="primary-btn">
            ➕ Add to List
          </button>

          {playersList.length > 0 && (
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
              {playersList.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-gray-100 px-3 py-2 rounded-md text-sm"
                >
                  <span>
                    {p.name} — {p.ageGroup} — {p.type}
                  </span>
                  <button
                    onClick={() => removePlayerFromList(i)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {playersList.length > 0 && (
            <button onClick={submitAllPlayers} className="success-btn mt-3">
              ✅ Submit All Players
            </button>
          )}
        </Modal>
      )}
      {consolidatedSheetPopup && (
        <Modal onClose={() => setConsolidatedSheetPopup(false)}>
          <h2 className="modal-title">Consolidated Sheet Print</h2>
          <select
            onChange={(e) => setAgeGroupForConsolidated(e.target.value)}
            value={ageGroupForConsolidated}
          >
            <option value="" disabled>
              Select Age Group
            </option>
            <option value="U4">U4</option>
            <option value="U6">U6</option>
            <option value="U8">U8</option>
            <option value="U10">U10</option>
            <option value="A11">A11</option>
            {/* <option value="U12">U12</option>
        <option value="U14">U14</option>
        <option value="U17">U17</option>
        <option value="SENIOR">SENIOR</option> */}
          </select>
          <select
            onChange={(e) => setTypeForConsolidated(e.target.value)}
            value={typeForConsolidated}
          >
            <option value="">Select Type</option>
            <option value="MAG">MAG</option>
            <option value="WAG">WAG</option>
          </select>
          <button onClick={handleConsolidatedPrint} className="primary-btn">
            🖨️ Print
          </button>
        </Modal>
      )}
      {/* ================= EDIT MODAL ================= */}
      {editPlayerPopOpen && (
        <Modal
          onClose={() => {
            setEditPlayerPopOpen(false);
            setSelectedPlayer(null);
          }}
        >
          <h2 className="modal-title">Edit Player</h2>

          <Input
            placeholder="Search player..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {filteredPlayers.length > 0 && (
            <div className="border rounded-lg max-h-40 overflow-y-auto mb-3">
              {filteredPlayers.slice(0, 8).map((p) => (
                <div
                  key={p.id}
                  className="px-3 py-2 cursor-pointer hover:bg-indigo-50 text-sm"
                  onClick={() => handleSelectPlayer(p)}
                >
                  {p.name} — {p.ageGroup} — {p.type}
                </div>
              ))}
            </div>
          )}

          {selectedPlayer && (
            <>
              <Input
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />

              <Select
                value={editFormData.club_name}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    club_name: e.target.value,
                  })
                }
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>

              <Select
                value={editFormData.ageGroup}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, ageGroup: e.target.value })
                }
              >
                {["U4", "U6", "U8", "U10", "A11"].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Select>

              <button onClick={submitEditedPlayer} className="success-btn">
                ✅ Update Player
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ================= UI ================= */

const ActionCard = ({ title, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white cursor-pointer border rounded-2xl p-4 shadow hover:shadow-md text-left"
  >
    <div className="flex justify-between">
      <span className="font-semibold">{title}</span>
      <span>{icon}</span>
    </div>
  </button>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-5 w-full max-w-md relative">
      <button
        onClick={onClose}
        className="absolute cursor-pointer hover:bg-red-300 p-1 rounded-2xl top-2 right-3"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

const Input = (props) => (
  <input {...props} className="w-full border px-3 py-2 mb-2 rounded-md" />
);

const Select = (props) => (
  <select {...props} className="w-full border px-3 py-2 mb-2 rounded-md" />
);

export default AdminHome;
