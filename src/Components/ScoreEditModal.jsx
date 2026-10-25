/* eslint-disable */
import React, { useEffect, useState } from "react";
import apiAdmin from "../apiConfigAdmin";

const EMPTY_FORM = {
  playerId: null,
  ageGroup: "",
  type: "",
  apparatus: "",

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

function ScoreEditModal({
  open,
  onClose,
  player,
  apparatus,
  ageGroup,
  type,
  existingScore,
  onSuccess,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [globalValue, setGlobalValue] = useState("");
  const [useGlobal, setUseGlobal] = useState(false);


  /* ================= PREFILL ================= */
  useEffect(() => {
    if (!player || !apparatus) return;

    setForm({
      playerId: player.id,
      ageGroup,
      type,
      apparatus,

      d1d2: existingScore?.d1d2?.toString() ?? "",
      eJuryOutOf: existingScore?.eJuryOutOf?.toString() ?? "",

      e1: existingScore?.e1?.toString() ?? "",
      e2: existingScore?.e2?.toString() ?? "",
      e3: existingScore?.e3?.toString() ?? "",
      e4: existingScore?.e4?.toString() ?? "",
      e5: existingScore?.e5?.toString() ?? "",
      e6: existingScore?.e6?.toString() ?? "",
      e7: existingScore?.e7?.toString() ?? "",

      otherDeduction: existingScore?.otherDeduction?.toString() ?? "",
    });
  }, [player, existingScore, apparatus, ageGroup, type]);

  if (!open || !player) return null;

  /* ================= CHANGE ================= */
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleGlobalSubmit = async () => {
    if (!globalValue) {
      alert("Enter global value");
      return;
    }

    try {
      await apiAdmin.post(
        `score/globalValue/${player.id}/${Number(globalValue)}/${type}/${apparatus}`
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Global value update failed:", err);
      alert("Failed to apply global value");
    }
  };

  const handleDeleteScoring = async () => {
    const confirmed = window.confirm(
      `Delete scoring for ${player.name} in ${apparatus} (${type})? This will also reset the player's apparatus score.`
    );

    if (!confirmed) return;

    try {
      await apiAdmin.delete(
        `/score/scoresheet?playerId=${player.id}&apparatus=${encodeURIComponent(apparatus)}&type=${encodeURIComponent(type)}`
      );

      alert("Scoring deleted successfully.");

      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Scoring deletion failed:", err);

      if (err.response?.status === 404) {
        alert("No matching scoresheet was found.");
      } else {
        alert(
          err.response?.data?.message ||
          "Failed to delete scoring. Please try again."
        );
      }
    }
  };



  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      await apiAdmin.post("score/scoring", {
        ...form,
        playerName: player.name,

        // ✅ convert ONLY here
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
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Score update failed:", err);
      alert("Failed to update score");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-6xl p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute cursor-pointer hover:bg-red-300 p-2 rounded-2xl top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-4">
          Now Scoring for – {player.name}
        </h2>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-indigo-50 text-gray-700">
                <Th>D1 / D2</Th>
                <Th>E Jury Out Of</Th>
                <Th>E1</Th>
                <Th>E2</Th>
                <Th>E3</Th>
                <Th>E4</Th>
                <Th>E5</Th>
                <Th>E6</Th>
                <Th>E7</Th>
                <Th>Other Deduction</Th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <Td><Input value={form.d1d2} onChange={(v) => handleChange("d1d2", v)} /></Td>
                <Td><Input value={form.eJuryOutOf} onChange={(v) => handleChange("eJuryOutOf", v)} /></Td>

                {["e1", "e2", "e3", "e4", "e5", "e6", "e7"].map((e) => (
                  <Td key={e}>
                    <Input value={form[e]} onChange={(v) => handleChange(e, v)} />
                  </Td>
                ))}

                <Td>
                  <Input
                    value={form.otherDeduction}
                    onChange={(v) => handleChange("otherDeduction", v)}
                  />
                </Td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* ================= GLOBAL VALUE ================= */}
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              value={globalValue}
              onChange={(e) => {
                setGlobalValue(e.target.value);
                setUseGlobal(true);
              }}
              placeholder="Enter global value"
              className="
        w-40
        border
        rounded-md
        px-3
        py-2
        text-center
        focus:outline-none
        focus:ring-2
        focus:ring-red-400
      "
            />

            <button
              onClick={handleGlobalSubmit}
              className="
        px-4
        py-2
        rounded-lg
        bg-red-600
        text-white
        hover:bg-red-700
      "
            >
              Apply Global Value
            </button>
          </div>
        </div>


        {/* ================= ACTIONS ================= */}
        <div className="mt-6 flex justify-between items-center gap-3">
          <button
            onClick={handleDeleteScoring}
            disabled={!existingScore}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Delete Scoring
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save Scores
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */

const Th = ({ children }) => (
  <th className="border px-3 py-2 font-semibold">{children}</th>
);

const Td = ({ children }) => (
  <td className="border px-2 py-2">{children}</td>
);

function Input({ value, onChange }) {
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        border
        rounded-md
        px-2
        py-1
        text-center
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
      "
    />
  );
}

export default ScoreEditModal;
