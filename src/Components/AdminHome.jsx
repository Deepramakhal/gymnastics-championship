// /* eslint-disable */
// import React, { useState, useEffect } from "react";
// import api from "../apiConfig";
// import apiAdmin from "../apiConfigAdmin";
// import Header from "./Header";
// import { useNavigate } from "react-router-dom";

// function AdminHome() {
//   const navigate = useNavigate();

//   const [addPlayerPopOpen, setAddPlayerPopOpen] = useState(false);
//   const [editPlayerPopOpen, setEditPlayerPopOpen] = useState(false);
//   const [clubPopOpen, setClubPopOpen] = useState(false);
//   const [printPopOpen, setPrintPopOpen] = useState(false);
//   const [consolidatedSheetPopup, setConsolidatedSheetPopup] = useState(false);

//   const [ageGroupForConsolidated, setAgeGroupForConsolidated] = useState("");
//   const [typeForConsolidated, setTypeForConsolidated] = useState("");

//   const [playersList, setPlayersList] = useState([]);
//   const [allPlayers, setAllPlayers] = useState([]);
//   const [clubs, setClubs] = useState([]);

//   const [searchText, setSearchText] = useState("");
//   const [selectedPlayer, setSelectedPlayer] = useState(null);

//   const [clubName, setClubName] = useState("");

//   // null = show MAG/WAG selection
//   // "MAG" = show MAG groups
//   // "WAG" = show WAG groups
//   const [selectedScoringType, setSelectedScoringType] = useState(null);

//   const [printForm, setPrintForm] = useState({
//     ageGroup: "",
//     type: "MAG",
//     apparatus: "",
//   });

//   const [formData, setFormData] = useState({
//     name: "",
//     club_name: "",
//     ageGroup: "",
//     type: "MAG",
//   });

//   const [editFormData, setEditFormData] = useState({
//     id: "",
//     name: "",
//     club_name: "",
//     ageGroup: "",
//     type: "",
//   });

//   /* =========================================================
//      AGE GROUP DEFINITIONS
//      ========================================================= */

//   /*
//    * Backend values:
//    *
//    * Grade 1 IN   -> G1I
//    * Grade 1 OPEN -> G1O
//    * Grade 4 IN   -> G4I
//    * Grade 4 OPEN -> G4O
//    *
//    * Junior -> JUNIOR
//    * Senior -> SENIOR
//    */

//   const MAG_AGE_GROUPS = [
//     { title: "Grade 1", division: "IN", value: "G1IN" },
//     { title: "Grade 2", division: "IN", value: "G2IN" },
//     { title: "Grade 3", division: "IN", value: "G3IN" },

//     { title: "Grade 4", division: "IN", value: "G4IN" },
//     { title: "Grade 4", division: "OPEN", value: "G4OPEN" },

//     { title: "Grade 5", division: "IN", value: "G5IN" },
//     { title: "Grade 5", division: "OPEN", value: "G5OPEN" },

//     { title: "Grade 6", division: "IN", value: "G6IN" },
//     { title: "Grade 6", division: "OPEN", value: "G6OPEN" },

//     { title: "Grade 7", division: "IN", value: "G7IN" },
//     { title: "Grade 7", division: "OPEN", value: "G7OPEN" },

//     { title: "Grade 8", division: "IN", value: "G8IN" },
//     { title: "Grade 8", division: "OPEN", value: "G8OPEN" },

//     { title: "Grade 9", division: "IN", value: "G9IN" },
//     { title: "Grade 9", division: "OPEN", value: "G9OPEN" },

//     { title: "Grade 10(JUNIOR)", division: "IN", value: "G10IN" },

//     { title: "Senior", division: "IN", value: "SENIOR" },
//   ];

//   const WAG_AGE_GROUPS = [
//     { title: "Grade 1", division: "IN", value: "G1IN" },
//     { title: "Grade 2", division: "IN", value: "G2IN" },
//     { title: "Grade 3", division: "IN", value: "G3IN" },

//     { title: "Grade 4", division: "IN", value: "G4IN" },
//     { title: "Grade 4", division: "OPEN", value: "G4OPEN" },

//     { title: "Grade 5", division: "IN", value: "G5IN" },
//     { title: "Grade 5", division: "OPEN", value: "G5OPEN" },

//     { title: "Grade 6", division: "IN", value: "G6IN" },
//     { title: "Grade 6", division: "OPEN", value: "G6OPEN" },

//     { title: "Grade 7", division: "IN", value: "G7IN" },
//     { title: "Grade 7", division: "OPEN", value: "G7OPEN" },

//     { title: "Grade 8", division: "IN", value: "G8IN" },
//     { title: "Grade 8", division: "OPEN", value: "G8OPEN" },

//     { title: "Grade 9", division: "IN", value: "G9IN" },
//     { title: "Grade 9", division: "OPEN", value: "G9OPEN" },

//     { title: "Grade 10", division: "IN", value: "G10IN" },
//     { title: "Grade 10", division: "OPEN", value: "G10OPEN" },

//     { title: "Junior", division: "IN", value: "JUNIOR" },
//     { title: "Senior", division: "IN", value: "SENIOR" },
//   ];
//   const currentScoringGroups =
//     selectedScoringType === "MAG"
//       ? MAG_AGE_GROUPS
//       : selectedScoringType === "WAG"
//         ? WAG_AGE_GROUPS
//         : [];

//   /* =========================================================
//      FETCH
//      ========================================================= */

//   const fetchBaseData = () => {
//     api.get("/getAllPlayers").then((res) => setAllPlayers(res.data));
//     api.get("/club/getAll").then((res) => setClubs(res.data));
//   };

//   useEffect(() => {
//     fetchBaseData();
//   }, []);

//   /* =========================================================
//      SEARCH
//      ========================================================= */

//   const filteredPlayers =
//     searchText.trim() === ""
//       ? []
//       : allPlayers.filter((p) =>
//         p.name.toLowerCase().includes(searchText.toLowerCase()),
//       );

//   /* =========================================================
//      ADD PLAYER
//      ========================================================= */

//   const addPlayerToList = () => {
//     if (!formData.name || !formData.club_name || !formData.ageGroup) return;

//     setPlayersList([...playersList, formData]);

//     setFormData({
//       ...formData,
//       name: "",
//       club_name: "",
//     });
//   };

//   const removePlayerFromList = (index) => {
//     setPlayersList(playersList.filter((_, i) => i !== index));
//   };

//   const submitAllPlayers = async () => {
//     try {
//       for (const p of playersList) {
//         const url =
//           p.type === "MAG"
//             ? "/addPlayer/Mag"
//             : "/addPlayer/Wag";

//         await apiAdmin.post(url, p);
//       }

//       alert("All players added");

//       setPlayersList([]);
//       setAddPlayerPopOpen(false);

//       fetchBaseData();
//     } catch {
//       alert("Error adding players");
//     }
//   };

//   /* =========================================================
//      EDIT PLAYER
//      ========================================================= */

//   const handleSelectPlayer = (player) => {
//     setSelectedPlayer(player);

//     setEditFormData({
//       id: player.id,
//       name: player.name,
//       club_name: player.club_name,
//       ageGroup: player.ageGroup,
//       type: player.type,
//     });

//     setSearchText("");
//   };

//   const submitEditedPlayer = async () => {
//     try {
//       await apiAdmin.post(`/edit/${editFormData.type}`, {
//         id: editFormData.id,
//         name: editFormData.name,
//         club_name: editFormData.club_name,
//         ageGroup: editFormData.ageGroup,
//       });

//       alert("Player updated");

//       setEditPlayerPopOpen(false);
//       setSelectedPlayer(null);

//       fetchBaseData();
//     } catch {
//       alert("Error updating player");
//     }
//   };

//   /* =========================================================
//      CLUB
//      ========================================================= */

//   const clubExists = clubs.some(
//     (c) =>
//       c.name.toLowerCase() === clubName.toLowerCase(),
//   );

//   const addClub = async () => {
//     await apiAdmin.post(`/club/add/${clubName}`);
//     ensureReload("Club added");
//   };

//   const removeClub = async () => {
//     await apiAdmin.delete(`/club/remove/${clubName}`);
//     ensureReload("Club removed");
//   };

//   const ensureReload = (msg) => {
//     alert(msg);
//     setClubName("");
//     setClubPopOpen(false);
//     fetchBaseData();
//   };

//   /* =========================================================
//      PRINT CHAIR OF JURY
//      ========================================================= */

//   const submitPrint = () => {
//     if (!printForm.ageGroup || !printForm.type) return;

//     navigate(
//       `/scoresheet/${printForm.ageGroup}/${printForm.type}/${printForm.apparatus}`,
//     );
//   };

//   /* =========================================================
//      CONSOLIDATED PRINT
//      ========================================================= */

//   const handleConsolidatedPrint = () => {
//     navigate(
//       `/consolidatedsheet/${ageGroupForConsolidated}/${typeForConsolidated}`,
//     );
//   };

//   /* =========================================================
//      SCORING NAVIGATION
//      ========================================================= */

//   const navigateToScoringPage = (ageGroup, type) => {
//     navigate(`/scoring/${ageGroup}/${type}`);
//   };

//   /* =========================================================
//      RENDER
//      ========================================================= */

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <div className="py-6 text-center">
//         <h1 className="text-2xl font-bold">
//           Admin Dashboard
//         </h1>

//         <p className="text-sm text-gray-600">
//           Manage Players & Scoring
//         </p>
//       </div>

//       {/* =====================================================
//           ACTION CARDS
//           ===================================================== */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 max-w-6xl mx-auto">

//         <ActionCard
//           title="Add Players"
//           icon="➕"
//           onClick={() => setAddPlayerPopOpen(true)}
//         />

//         <ActionCard
//           title="Edit Player"
//           icon="✏️"
//           onClick={() => setEditPlayerPopOpen(true)}
//         />

//         <ActionCard
//           title="Add / Remove Unit"
//           icon="🏫"
//           onClick={() => setClubPopOpen(true)}
//         />

//         <ActionCard
//           title="Print Chair of Jury Sheet"
//           icon="🖨️"
//           onClick={() => setPrintPopOpen(true)}
//         />

//         <ActionCard
//           title="Print consolidatedsheet"
//           icon="🖨️"
//           onClick={() => setConsolidatedSheetPopup(true)}
//         />

//         {/* =================================================
//             MAG SCORING
//             ================================================= */}

//         <ActionCard
//           title="MAG Scoring"
//           icon="📊"
//           onClick={() => setSelectedScoringType("MAG")}
//         />

//         {/* =================================================
//             WAG SCORING
//             ================================================= */}

//         <ActionCard
//           title="WAG Scoring"
//           icon="📊"
//           onClick={() => setSelectedScoringType("WAG")}
//         />
//       </div>

//       {/* =====================================================
//           SCORING GROUP PAGE
//           ===================================================== */}

//       {selectedScoringType && (
//         <div className="mt-10 px-4 max-w-6xl mx-auto">

//           {/* HEADER */}
//           <div className="flex items-center justify-between mb-5">

//             <button
//               onClick={() => setSelectedScoringType(null)}
//               className="border border-gray-300 bg-white px-4 py-2 rounded-xl text-sm cursor-pointer hover:bg-gray-100"
//             >
//               ← Back
//             </button>

//             <h2 className="text-xl font-bold">
//               {selectedScoringType} Scoring
//             </h2>

//             <div className="w-16"></div>
//           </div>

//           {/* GROUP BUTTONS */}

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

//             {currentScoringGroups.map((group) => (
//               <ActionCard
//                 key={`${selectedScoringType}-${group.value}`}
//                 title={
//                   group.division === "IN"
//                     ? `${group.title} - IN`
//                     : `${group.title} - OPEN`
//                 }
//                 icon="📊"
//                 onClick={() =>
//                   navigateToScoringPage(
//                     group.value,
//                     selectedScoringType,
//                   )
//                 }
//               />
//             ))}

//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           CLUB MODAL
//           ===================================================== */}

//       {clubPopOpen && (
//         <Modal
//           onClose={() => setClubPopOpen(false)}
//         >
//           <h2 className="modal-title">
//             Add / Remove Unit
//           </h2>

//           <Input
//             placeholder="Unit Name"
//             value={clubName}
//             onChange={(e) =>
//               setClubName(e.target.value)
//             }
//           />

//           {clubName && !clubExists && (
//             <button
//               onClick={addClub}
//               className="success-btn"
//             >
//               ➕ Add Unit
//             </button>
//           )}

//           {clubName && clubExists && (
//             <button
//               onClick={removeClub}
//               className="danger-btn"
//             >
//               ❌ Remove Unit
//             </button>
//           )}
//         </Modal>
//       )}

//       {/* =====================================================
//           PRINT CHAIR OF JURY
//           ===================================================== */}

//       {printPopOpen && (
//         <Modal
//           onClose={() => setPrintPopOpen(false)}
//         >
//           <h2 className="modal-title">
//             Print Chair of Jury Sheet
//           </h2>

//           <Select
//             value={printForm.ageGroup}
//             onChange={(e) =>
//               setPrintForm({
//                 ...printForm,
//                 ageGroup: e.target.value,
//               })
//             }
//           >
//             <option value="">
//               Select Age Group
//             </option>

//             {(printForm.type === "MAG"
//               ? MAG_AGE_GROUPS
//               : WAG_AGE_GROUPS
//             ).map((group) => (
//               <option
//                 key={group.value}
//                 value={group.value}
//               >
//                 {group.title} - {group.division}
//               </option>
//             ))}
//           </Select>

//           <Select
//             value={printForm.type}
//             onChange={(e) =>
//               setPrintForm({
//                 ...printForm,
//                 type: e.target.value,
//                 ageGroup: "",
//               })
//             }
//           >
//             <option value="MAG">MAG</option>
//             <option value="WAG">WAG</option>
//           </Select>

//           <input
//             type="text"
//             placeholder="Apparatus"
//             value={printForm.apparatus}
//             onChange={(e) =>
//               setPrintForm({
//                 ...printForm,
//                 apparatus: e.target.value,
//               })
//             }
//           />

//           <button
//             onClick={submitPrint}
//             className="primary-btn"
//           >
//             🖨️ Print
//           </button>
//         </Modal>
//       )}

//       {/* =====================================================
//           ADD PLAYER MODAL
//           ===================================================== */}

//       {addPlayerPopOpen && (
//         <Modal
//           onClose={() => {
//             setAddPlayerPopOpen(false);
//             setPlayersList([]);
//           }}
//         >
//           <h2 className="modal-title">
//             Add Players
//           </h2>

//           <Input
//             placeholder="Player Name"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 name: e.target.value,
//               })
//             }
//           />

//           <Select
//             value={formData.club_name}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 club_name: e.target.value,
//               })
//             }
//           >
//             <option value="">
//               Select Club
//             </option>

//             {clubs.map((c) => (
//               <option
//                 key={c.id}
//                 value={c.name}
//               >
//                 {c.name}
//               </option>
//             ))}
//           </Select>

//           <Select
//             value={formData.type}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 type: e.target.value,
//                 ageGroup: "",
//               })
//             }
//           >
//             <option value="MAG">MAG</option>
//             <option value="WAG">WAG</option>
//           </Select>

//           <Select
//             value={formData.ageGroup}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 ageGroup: e.target.value,
//               })
//             }
//           >
//             <option value="">
//               Select Grade / Group
//             </option>

//             {(formData.type === "MAG"
//               ? MAG_AGE_GROUPS
//               : WAG_AGE_GROUPS
//             ).map((group) => (
//               <option
//                 key={group.value}
//                 value={group.value}
//               >
//                 {group.title} - {group.division}
//               </option>
//             ))}
//           </Select>

//           <button
//             onClick={addPlayerToList}
//             className="primary-btn"
//           >
//             ➕ Add to List
//           </button>

//           {playersList.length > 0 && (
//             <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
//               {playersList.map((p, i) => (
//                 <div
//                   key={i}
//                   className="flex justify-between bg-gray-100 px-3 py-2 rounded-md text-sm"
//                 >
//                   <span>
//                     {p.name} — {p.ageGroup} — {p.type}
//                   </span>

//                   <button
//                     onClick={() =>
//                       removePlayerFromList(i)
//                     }
//                     className="text-red-500"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {playersList.length > 0 && (
//             <button
//               onClick={submitAllPlayers}
//               className="success-btn mt-3"
//             >
//               ✅ Submit All Players
//             </button>
//           )}
//         </Modal>
//       )}

//       {/* =====================================================
//           CONSOLIDATED SHEET PRINT
//           ===================================================== */}

//       {consolidatedSheetPopup && (
//         <Modal
//           onClose={() =>
//             setConsolidatedSheetPopup(false)
//           }
//         >
//           <h2 className="modal-title">
//             Consolidated Sheet Print
//           </h2>

//           <select
//             onChange={(e) =>
//               setAgeGroupForConsolidated(
//                 e.target.value,
//               )
//             }
//             value={ageGroupForConsolidated}
//           >
//             <option value="" disabled>
//               Select Age Group
//             </option>

//             {(typeForConsolidated === "WAG"
//               ? WAG_AGE_GROUPS
//               : MAG_AGE_GROUPS
//             ).map((group) => (
//               <option
//                 key={group.value}
//                 value={group.value}
//               >
//                 {group.title} - {group.division}
//               </option>
//             ))}
//           </select>

//           <select
//             onChange={(e) => {
//               setTypeForConsolidated(e.target.value);
//               setAgeGroupForConsolidated("");
//             }}
//             value={typeForConsolidated}
//           >
//             <option value="">
//               Select Type
//             </option>

//             <option value="MAG">
//               MAG
//             </option>

//             <option value="WAG">
//               WAG
//             </option>
//           </select>

//           <button
//             onClick={handleConsolidatedPrint}
//             className="primary-btn"
//           >
//             🖨️ Print
//           </button>
//         </Modal>
//       )}

//       {/* =====================================================
//           EDIT PLAYER MODAL
//           ===================================================== */}

//       {editPlayerPopOpen && (
//         <Modal
//           onClose={() => {
//             setEditPlayerPopOpen(false);
//             setSelectedPlayer(null);
//           }}
//         >
//           <h2 className="modal-title">
//             Edit Player
//           </h2>

//           <Input
//             placeholder="Search player..."
//             value={searchText}
//             onChange={(e) =>
//               setSearchText(e.target.value)
//             }
//           />

//           {filteredPlayers.length > 0 && (
//             <div className="border rounded-lg max-h-40 overflow-y-auto mb-3">
//               {filteredPlayers
//                 .slice(0, 8)
//                 .map((p) => (
//                   <div
//                     key={p.id}
//                     className="px-3 py-2 cursor-pointer hover:bg-indigo-50 text-sm"
//                     onClick={() =>
//                       handleSelectPlayer(p)
//                     }
//                   >
//                     {p.name} — {p.ageGroup} — {p.type}
//                   </div>
//                 ))}
//             </div>
//           )}

//           {selectedPlayer && (
//             <>
//               <Input
//                 value={editFormData.name}
//                 onChange={(e) =>
//                   setEditFormData({
//                     ...editFormData,
//                     name: e.target.value,
//                   })
//                 }
//               />

//               <Select
//                 value={editFormData.club_name}
//                 onChange={(e) =>
//                   setEditFormData({
//                     ...editFormData,
//                     club_name: e.target.value,
//                   })
//                 }
//               >
//                 {clubs.map((c) => (
//                   <option
//                     key={c.id}
//                     value={c.name}
//                   >
//                     {c.name}
//                   </option>
//                 ))}
//               </Select>

//               <Select
//                 value={editFormData.type}
//                 onChange={(e) =>
//                   setEditFormData({
//                     ...editFormData,
//                     type: e.target.value,
//                     ageGroup: "",
//                   })
//                 }
//               >
//                 <option value="MAG">
//                   MAG
//                 </option>

//                 <option value="WAG">
//                   WAG
//                 </option>
//               </Select>

//               <Select
//                 value={editFormData.ageGroup}
//                 onChange={(e) =>
//                   setEditFormData({
//                     ...editFormData,
//                     ageGroup: e.target.value,
//                   })
//                 }
//               >
//                 <option value="">
//                   Select Grade / Group
//                 </option>

//                 {(editFormData.type === "MAG"
//                   ? MAG_AGE_GROUPS
//                   : WAG_AGE_GROUPS
//                 ).map((group) => (
//                   <option
//                     key={group.value}
//                     value={group.value}
//                   >
//                     {group.title} - {group.division}
//                   </option>
//                 ))}
//               </Select>

//               <button
//                 onClick={submitEditedPlayer}
//                 className="success-btn"
//               >
//                 ✅ Update Player
//               </button>
//             </>
//           )}
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    UI COMPONENTS
//    ========================================================= */

// const ActionCard = ({
//   title,
//   icon,
//   onClick,
// }) => (
//   <button
//     onClick={onClick}
//     className="bg-white cursor-pointer border rounded-2xl p-4 shadow hover:shadow-md text-left"
//   >
//     <div className="flex justify-between">
//       <span className="font-semibold">
//         {title}
//       </span>

//       <span>{icon}</span>
//     </div>
//   </button>
// );

// const Modal = ({
//   children,
//   onClose,
// }) => (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//     <div className="bg-white rounded-xl p-5 w-full max-w-md relative">
//       <button
//         onClick={onClose}
//         className="absolute cursor-pointer hover:bg-red-300 p-1 rounded-2xl top-2 right-3"
//       >
//         ✕
//       </button>

//       {children}
//     </div>
//   </div>
// );

// const Input = (props) => (
//   <input
//     {...props}
//     className="w-full border px-3 py-2 mb-2 rounded-md"
//   />
// );

// const Select = (props) => (
//   <select
//     {...props}
//     className="w-full border px-3 py-2 mb-2 rounded-md"
//   />
// );

// export default AdminHome;


/* eslint-disable */
import React, { useState, useEffect } from "react";
import api from "../apiConfig";
import apiAdmin from "../apiConfigAdmin";
import Header from "./Header";
import ManageSecretaries from "./ManageSecretaries";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();

  const [addPlayerPopOpen, setAddPlayerPopOpen] = useState(false);
  const [editPlayerPopOpen, setEditPlayerPopOpen] = useState(false);
  const [clubPopOpen, setClubPopOpen] = useState(false);
  const [printPopOpen, setPrintPopOpen] = useState(false);
  const [consolidatedSheetPopup, setConsolidatedSheetPopup] = useState(false);
  const [manageSecretariesOpen, setManageSecretariesOpen] = useState(false);

  const [ageGroupForConsolidated, setAgeGroupForConsolidated] = useState("");
  const [typeForConsolidated, setTypeForConsolidated] = useState("");

  const [playersList, setPlayersList] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [clubName, setClubName] = useState("");

  // null = show MAG/WAG selection
  // "MAG" = show MAG groups
  // "WAG" = show WAG groups
  const [selectedScoringType, setSelectedScoringType] = useState(null);

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

  /* =========================================================
     AGE GROUP DEFINITIONS
     ========================================================= */

  /*
   * Backend values:
   *
   * Grade 1 IN   -> G1I
   * Grade 1 OPEN -> G1O
   * Grade 4 IN   -> G4I
   * Grade 4 OPEN -> G4O
   *
   * Junior -> JUNIOR
   * Senior -> SENIOR
   */

  const MAG_AGE_GROUPS = [
    { title: "Grade 1", division: "IN", value: "G1IN" },
    { title: "Grade 2", division: "IN", value: "G2IN" },
    { title: "Grade 3", division: "IN", value: "G3IN" },

    { title: "Grade 4", division: "IN", value: "G4IN" },
    { title: "Grade 4", division: "OPEN", value: "G4OPEN" },

    { title: "Grade 5", division: "IN", value: "G5IN" },
    { title: "Grade 5", division: "OPEN", value: "G5OPEN" },

    { title: "Grade 6", division: "IN", value: "G6IN" },
    { title: "Grade 6", division: "OPEN", value: "G6OPEN" },

    { title: "Grade 7", division: "IN", value: "G7IN" },
    { title: "Grade 7", division: "OPEN", value: "G7OPEN" },

    { title: "Grade 8", division: "IN", value: "G8IN" },
    { title: "Grade 8", division: "OPEN", value: "G8OPEN" },

    { title: "Grade 9", division: "IN", value: "G9IN" },
    { title: "Grade 9", division: "OPEN", value: "G9OPEN" },

    { title: "Grade 10(JUNIOR)", division: "IN", value: "G10IN" },

    { title: "Senior", division: "IN", value: "SENIOR" },
  ];

  const WAG_AGE_GROUPS = [
    { title: "Grade 1", division: "IN", value: "G1IN" },
    { title: "Grade 2", division: "IN", value: "G2IN" },
    { title: "Grade 3", division: "IN", value: "G3IN" },

    { title: "Grade 4", division: "IN", value: "G4IN" },
    { title: "Grade 4", division: "OPEN", value: "G4OPEN" },

    { title: "Grade 5", division: "IN", value: "G5IN" },
    { title: "Grade 5", division: "OPEN", value: "G5OPEN" },

    { title: "Grade 6", division: "IN", value: "G6IN" },
    { title: "Grade 6", division: "OPEN", value: "G6OPEN" },

    { title: "Grade 7", division: "IN", value: "G7IN" },
    { title: "Grade 7", division: "OPEN", value: "G7OPEN" },

    { title: "Grade 8", division: "IN", value: "G8IN" },
    { title: "Grade 8", division: "OPEN", value: "G8OPEN" },

    { title: "Grade 9", division: "IN", value: "G9IN" },
    { title: "Grade 9", division: "OPEN", value: "G9OPEN" },

    { title: "Grade 10", division: "IN", value: "G10IN" },
    { title: "Grade 10", division: "OPEN", value: "G10OPEN" },

    { title: "Junior", division: "IN", value: "JUNIOR" },
    { title: "Senior", division: "IN", value: "SENIOR" },
  ];
  const currentScoringGroups =
    selectedScoringType === "MAG"
      ? MAG_AGE_GROUPS
      : selectedScoringType === "WAG"
        ? WAG_AGE_GROUPS
        : [];

  /* =========================================================
     FETCH
     ========================================================= */

  const fetchBaseData = () => {
    api.get("/getAllPlayers").then((res) => setAllPlayers(res.data));
    api.get("/club/getAll").then((res) => setClubs(res.data));
  };

  useEffect(() => {
    fetchBaseData();
  }, []);

  /* =========================================================
     SEARCH
     ========================================================= */

  const filteredPlayers =
    searchText.trim() === ""
      ? []
      : allPlayers.filter((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase()),
      );

  /* =========================================================
     ADD PLAYER
     ========================================================= */

  const addPlayerToList = () => {
    if (!formData.name || !formData.club_name || !formData.ageGroup) return;

    setPlayersList([...playersList, formData]);

    setFormData({
      ...formData,
      name: "",
      club_name: "",
    });
  };

  const removePlayerFromList = (index) => {
    setPlayersList(playersList.filter((_, i) => i !== index));
  };

  const submitAllPlayers = async () => {
    try {
      for (const p of playersList) {
        const url =
          p.type === "MAG"
            ? "/addPlayer/Mag"
            : "/addPlayer/Wag";

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

  /* =========================================================
     EDIT PLAYER
     ========================================================= */

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

  /* =========================================================
     CLUB
     ========================================================= */

  const clubExists = clubs.some(
    (c) =>
      c.name.toLowerCase() === clubName.toLowerCase(),
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

  /* =========================================================
     PRINT CHAIR OF JURY
     ========================================================= */

  const submitBlankPrint = () => {
    navigate("/scoresheet/blank/blank/blank?blank=true");
  };

  // Validate selections for options 2 and 3
  const validatePrintSelection = () => {
    if (
      !printForm.ageGroup ||
      !printForm.type ||
      !printForm.apparatus.trim()
    ) {
      alert("Please select grade/group, category, and apparatus.");
      return false;
    }
    return true;
  };

  // Option 2: Names only
  const submitNamesPrint = () => {
    if (!validatePrintSelection()) return;

    navigate(
      `/scoresheet/${printForm.ageGroup}/${printForm.type}/${encodeURIComponent(printForm.apparatus)}?mode=names`
    );
  };

  // Option 3: Names and saved scores
  const submitScoresPrint = () => {
    if (!validatePrintSelection()) return;

    navigate(
      `/scoresheet/${printForm.ageGroup}/${printForm.type}/${encodeURIComponent(printForm.apparatus)}?mode=scores`
    );
  };


  const validateConsolidatedSelection = () => {
    if (!ageGroupForConsolidated || !typeForConsolidated) {
      alert("Please select age group and category.");
      return false;
    }
    return true;
  };

  // Option 1: Blank consolidated sheet
  const handleBlankConsolidatedPrint = () => {
    if (!validateConsolidatedSelection()) return;

    navigate(
      `/consolidatedsheet/${ageGroupForConsolidated}/${typeForConsolidated}?blank=true`
    );
  };

  // Option 2: Consolidated sheet with scores
  const handleConsolidatedPrint = () => {
    if (!validateConsolidatedSelection()) return;

    navigate(
      `/consolidatedsheet/${ageGroupForConsolidated}/${typeForConsolidated}`
    );
  };

  /* =========================================================
     SCORING NAVIGATION
     ========================================================= */

  const navigateToScoringPage = (ageGroup, type) => {
    navigate(`/scoring/${ageGroup}/${type}`);
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-6 text-center">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-sm text-gray-600">
          Manage Players & Scoring
        </p>
      </div>

      {/* =====================================================
          ACTION CARDS
          ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 max-w-6xl mx-auto">

        <ActionCard
          title="Manage Secretaries"
          icon="🔐"
          onClick={() => setManageSecretariesOpen(true)}
        />

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

        {/* =================================================
            MAG SCORING
            ================================================= */}

        <ActionCard
          title="MAG Scoring"
          icon="📊"
          onClick={() => setSelectedScoringType("MAG")}
        />

        {/* =================================================
            WAG SCORING
            ================================================= */}

        <ActionCard
          title="WAG Scoring"
          icon="📊"
          onClick={() => setSelectedScoringType("WAG")}
        />
      </div>

      {/* =====================================================
          SCORING GROUP PAGE
          ===================================================== */}

      {selectedScoringType && (
        <div className="mt-10 px-4 max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-5">

            <button
              onClick={() => setSelectedScoringType(null)}
              className="border border-gray-300 bg-white px-4 py-2 rounded-xl text-sm cursor-pointer hover:bg-gray-100"
            >
              ← Back
            </button>

            <h2 className="text-xl font-bold">
              {selectedScoringType} Scoring
            </h2>

            <div className="w-16"></div>
          </div>

          {/* GROUP BUTTONS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {currentScoringGroups.map((group) => (
              <ActionCard
                key={`${selectedScoringType}-${group.value}`}
                title={
                  group.division === "IN"
                    ? `${group.title} - IN`
                    : `${group.title} - OPEN`
                }
                icon="📊"
                onClick={() =>
                  navigateToScoringPage(
                    group.value,
                    selectedScoringType,
                  )
                }
              />
            ))}

          </div>
        </div>
      )}

      {/* =====================================================
          CLUB MODAL
          ===================================================== */}

      {clubPopOpen && (
        <Modal
          onClose={() => setClubPopOpen(false)}
        >
          <h2 className="modal-title">
            Add / Remove Unit
          </h2>

          <Input
            placeholder="Unit Name"
            value={clubName}
            onChange={(e) =>
              setClubName(e.target.value)
            }
          />

          {clubName && !clubExists && (
            <button
              onClick={addClub}
              className="success-btn"
            >
              ➕ Add Unit
            </button>
          )}

          {clubName && clubExists && (
            <button
              onClick={removeClub}
              className="danger-btn"
            >
              ❌ Remove Unit
            </button>
          )}
        </Modal>
      )}

      {/* =====================================================
          PRINT CHAIR OF JURY
          ===================================================== */}
      {printPopOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* FIXED HEADER */}
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Print Chair of Jury Sheet
                </h2>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Choose a sheet format to print
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPrintPopOpen(false)}
                className="ml-3 rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close print modal"
              >
                ✕
              </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="overflow-y-auto p-4 sm:p-6">

              {/* OPTION 1 */}
              <button
                type="button"
                onClick={submitBlankPrint}
                className="mb-4 flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                  📄
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900">
                    1. Blank Jury Sheet
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Eight empty rows, without player names or category details.
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-blue-700">
                  Print →
                </span>
              </button>

              {/* CATEGORY SELECTION */}
              <div className="mb-4 rounded-xl border border-gray-200 p-4 sm:p-5">
                <h3 className="font-semibold text-gray-900">
                  Category Details
                </h3>
                <p className="mb-4 mt-1 text-sm text-gray-500">
                  Select the same category for either of the next two options.
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Grade / Group
                    </label>
                    <Select
                      value={printForm.ageGroup}
                      onChange={(e) =>
                        setPrintForm({
                          ...printForm,
                          ageGroup: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Grade / Group</option>

                      {(printForm.type === "WAG"
                        ? WAG_AGE_GROUPS
                        : MAG_AGE_GROUPS
                      ).map((group) => (
                        <option key={group.value} value={group.value}>
                          {group.title} - {group.division}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <Select
                      value={printForm.type}
                      onChange={(e) =>
                        setPrintForm({
                          ...printForm,
                          type: e.target.value,
                          ageGroup: "",
                        })
                      }
                    >
                      <option value="MAG">MAG — Boys</option>
                      <option value="WAG">WAG — Girls</option>
                    </Select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Apparatus
                  </label>
                  <Input
                    placeholder="e.g. Floor_Exercise"
                    value={printForm.apparatus}
                    onChange={(e) =>
                      setPrintForm({
                        ...printForm,
                        apparatus: e.target.value,
                      })
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use the exact apparatus name expected by the scoring system.
                  </p>
                </div>
              </div>

              {/* OPTION 2 */}
              <button
                type="button"
                onClick={submitNamesPrint}
                className="mb-4 flex w-full items-center gap-4 rounded-xl border border-indigo-200 p-4 text-left transition hover:bg-indigo-50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                  📝
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900">
                    2. Names Only
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Player names and category details, with empty score cells.
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-indigo-700">
                  Print →
                </span>
              </button>

              {/* OPTION 3 */}
              <button
                type="button"
                onClick={submitScoresPrint}
                className="flex w-full items-center gap-4 rounded-xl border border-emerald-200 p-4 text-left transition hover:bg-emerald-50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                  📊
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900">
                    3. Names with Scores
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Player names, D1/D2, E-jury values, deductions, averages,
                    and final scores.
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-emerald-700">
                  Print →
                </span>
              </button>
            </div>

            {/* FIXED FOOTER */}
            <div className="border-t bg-gray-50 px-5 py-3 text-right sm:px-6">
              <button
                type="button"
                onClick={() => setPrintPopOpen(false)}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD PLAYER MODAL
          ===================================================== */}

      {addPlayerPopOpen && (
        <Modal
          onClose={() => {
            setAddPlayerPopOpen(false);
            setPlayersList([]);
          }}
        >
          <h2 className="modal-title">
            Add Players
          </h2>

          <Input
            placeholder="Player Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <Select
            value={formData.club_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                club_name: e.target.value,
              })
            }
          >
            <option value="">
              Select Club
            </option>

            {clubs.map((c) => (
              <option
                key={c.id}
                value={c.name}
              >
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value,
                ageGroup: "",
              })
            }
          >
            <option value="MAG">MAG</option>
            <option value="WAG">WAG</option>
          </Select>

          <Select
            value={formData.ageGroup}
            onChange={(e) =>
              setFormData({
                ...formData,
                ageGroup: e.target.value,
              })
            }
          >
            <option value="">
              Select Grade / Group
            </option>

            {(formData.type === "MAG"
              ? MAG_AGE_GROUPS
              : WAG_AGE_GROUPS
            ).map((group) => (
              <option
                key={group.value}
                value={group.value}
              >
                {group.title} - {group.division}
              </option>
            ))}
          </Select>

          <button
            onClick={addPlayerToList}
            className="primary-btn"
          >
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
                    onClick={() =>
                      removePlayerFromList(i)
                    }
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {playersList.length > 0 && (
            <button
              onClick={submitAllPlayers}
              className="success-btn mt-3"
            >
              ✅ Submit All Players
            </button>
          )}
        </Modal>
      )}

      {/* =====================================================
          CONSOLIDATED SHEET PRINT
          ===================================================== */}

      {consolidatedSheetPopup && (
        <Modal onClose={() => setConsolidatedSheetPopup(false)}>
          <h2 className="modal-title">Consolidated Sheet Print</h2>

          <p className="mb-3 text-sm text-gray-600">
            Select the age group and category, then choose the sheet format.
          </p>

          {/* CATEGORY SELECTION */}
          <label className="block text-sm font-medium mb-1">
            Grade / Group
          </label>
          <Select
            value={ageGroupForConsolidated}
            onChange={(e) => setAgeGroupForConsolidated(e.target.value)}
          >
            <option value="">Select Grade / Group</option>

            {(typeForConsolidated === "WAG"
              ? WAG_AGE_GROUPS
              : MAG_AGE_GROUPS
            ).map((group) => (
              <option key={group.value} value={group.value}>
                {group.title} - {group.division}
              </option>
            ))}
          </Select>

          <label className="block text-sm font-medium mb-1">
            Category
          </label>
          <Select
            value={typeForConsolidated}
            onChange={(e) => setTypeForConsolidated(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="MAG">MAG — Boys</option>
            <option value="WAG">WAG — Girls</option>
          </Select>

          {/* OPTION 1: BLANK SHEET */}
          <button
            type="button"
            onClick={handleBlankConsolidatedPrint}
            className="mt-3 mb-3 flex w-full items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">
              📄
            </div>

            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                1. Blank Consolidated Sheet
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Empty gymnast rows with apparatus columns, total, and rank.
              </p>
            </div>

            <span className="text-sm font-semibold text-blue-700">
              Print →
            </span>
          </button>

          {/* OPTION 2: SHEET WITH SCORES */}
          <button
            type="button"
            onClick={handleConsolidatedPrint}
            className="flex w-full items-center gap-3 rounded-xl border border-emerald-200 p-4 text-left transition hover:bg-emerald-50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-2xl">
              📊
            </div>

            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                2. Consolidated Sheet with Scores
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Print gymnast names, apparatus scores, totals, and rankings.
              </p>
            </div>

            <span className="text-sm font-semibold text-emerald-700">
              Print →
            </span>
          </button>
        </Modal>
      )}

      {/* =====================================================
          EDIT PLAYER MODAL
          ===================================================== */}

      {editPlayerPopOpen && (
        <Modal
          onClose={() => {
            setEditPlayerPopOpen(false);
            setSelectedPlayer(null);
          }}
        >
          <h2 className="modal-title">
            Edit Player
          </h2>

          <Input
            placeholder="Search player..."
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
          />

          {filteredPlayers.length > 0 && (
            <div className="border rounded-lg max-h-40 overflow-y-auto mb-3">
              {filteredPlayers
                .slice(0, 8)
                .map((p) => (
                  <div
                    key={p.id}
                    className="px-3 py-2 cursor-pointer hover:bg-indigo-50 text-sm"
                    onClick={() =>
                      handleSelectPlayer(p)
                    }
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
                  setEditFormData({
                    ...editFormData,
                    name: e.target.value,
                  })
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
                  <option
                    key={c.id}
                    value={c.name}
                  >
                    {c.name}
                  </option>
                ))}
              </Select>

              <Select
                value={editFormData.type}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    type: e.target.value,
                    ageGroup: "",
                  })
                }
              >
                <option value="MAG">
                  MAG
                </option>

                <option value="WAG">
                  WAG
                </option>
              </Select>

              <Select
                value={editFormData.ageGroup}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    ageGroup: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Grade / Group
                </option>

                {(editFormData.type === "MAG"
                  ? MAG_AGE_GROUPS
                  : WAG_AGE_GROUPS
                ).map((group) => (
                  <option
                    key={group.value}
                    value={group.value}
                  >
                    {group.title} - {group.division}
                  </option>
                ))}
              </Select>

              <button
                onClick={submitEditedPlayer}
                className="success-btn"
              >
                ✅ Update Player
              </button>
            </>
          )}
        </Modal>
      )}

      {/* =====================================================
          MANAGE SECRETARIES
          ===================================================== */}
      {manageSecretariesOpen && (
        <ManageSecretaries onClose={() => setManageSecretariesOpen(false)} />
      )}
    </div>
  );
}

/* =========================================================
   UI COMPONENTS
   ========================================================= */

const ActionCard = ({
  title,
  icon,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="bg-white cursor-pointer border rounded-2xl p-4 shadow hover:shadow-md text-left"
  >
    <div className="flex justify-between">
      <span className="font-semibold">
        {title}
      </span>

      <span>{icon}</span>
    </div>
  </button>
);

const Modal = ({
  children,
  onClose,
}) => (
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
  <input
    {...props}
    className="w-full border px-3 py-2 mb-2 rounded-md"
  />
);

const Select = (props) => (
  <select
    {...props}
    className="w-full border px-3 py-2 mb-2 rounded-md"
  />
);

export default AdminHome;