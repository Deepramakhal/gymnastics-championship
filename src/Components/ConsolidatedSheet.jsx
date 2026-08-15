/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiAdmin from "../apiConfigAdmin";
import Logo from "../assets/logo.png";

function ConsolidatedPrint() {
  const { ageGroup, type } = useParams();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    apiAdmin.get(`/getConsolidated/${ageGroup}/${type}`).then((res) => {
      const data = res.data;
      console.log(data);
      // 🔹 Create sorted copy ONLY for ranking
      const sortedByScore = [...data].sort(
        (a, b) => b.totalScore - a.totalScore,
      );

      // 🔹 Build rank map (playerId → rank)
      const rankMap = new Map();
      sortedByScore.forEach((item, index) => {
        rankMap.set(item.playerId, index + 1);
      });

      // 🔹 Attach computedRank WITHOUT reordering rows
      const withFrontendRank = data.map((item) => ({
        ...item,
        computedRank: rankMap.get(item.playerId),
      }));

      setRows(withFrontendRank);
    });
  }, [ageGroup, type]);

  // 10 rows per page (as per PDF)
  const pages = [];
  for (let i = 0; i < rows.length; i += 10) {
    pages.push(rows.slice(i, i + 10));
  }

  const genderLabel = type === "MAG" ? "MAG" : "WAG";

  const MAG_HEADERS = ["FLOOR", "VAULT", "P.HORSE", "RINGS", "P.BARS", "H.BAR"];

  const WAG_HEADERS = ["VAULT", "UNEVEN BAR", "BALANCE BEAM", "FLOOR"];

  return (
    <>
      <div className="no-print">
        <button className="cursor-pointer" onClick={() => window.print()}>
          🖨 Print / Save PDF
        </button>
      </div>

      {pages.map((page, pageIndex) => (
        <div className="page" key={pageIndex}>
          {/* ================= HEADER ================= */}
          <div className="header">
            <img src={import.meta.env.VITE_LOGO_URL} className="logo" alt="logo" />
            <div className="header-text">
              <div className="main-title">{import.meta.env.VITE_MAIN_HEAD}</div>
              <div className="sub-title">
                {/* Regd. Under Societies Act XXVI of 1961 <br /> */}
                {import.meta.env.VITE_SECOND_LINE} <br />
                {import.meta.env.VITE_THIRD_LINE}
              </div>
              <div className="sheet-title">CONSOLIDATED SCORE SHEET</div>
            </div>
          </div>

          {/* ================= META ================= */}
          <div className="meta">
            <div className="meta-left">
              GROUP : <b>{ageGroup}</b>
            </div>
            <div className="meta-center mr-116">{genderLabel}</div>
          </div>

          {/* ================= TABLE ================= */}
          <table className="cons-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>NAME OF GYMNAST</th>
                <th>UNIT</th>

                {(type === "MAG" ? MAG_HEADERS : WAG_HEADERS).map((h) => (
                  <th key={h}>{h}</th>
                ))}

                <th>TOTAL</th>
                <th>RANK</th>
              </tr>
            </thead>

            <tbody>
              {page.map((r, i) => (
                <tr key={i}>
                  <td>{pageIndex * 10 + i + 1}</td>
                  <td className="name">{r.playerName}</td>
                  <td>{r.clubName}</td>

                  {type === "MAG" && (
                    <>
                      <td>{r.floorExercise}</td>
                      <td>{r.tableVault}</td>
                      <td>{r.pommelHorse}</td>
                      <td>{r.rings}</td>
                      <td>{r.parallelBars}</td>
                      <td>{r.horizontalBar}</td>
                    </>
                  )}

                  {type === "WAG" && (
                    <>
                      <td>{r.tableVault}</td>
                      <td>{r.unevenBars}</td>
                      <td>{r.balancingBeam}</td>
                      <td>{r.floorExercise}</td>
                    </>
                  )}
                  <td className="bold">{r.totalScore.toFixed(3)}</td>
                  <td className="bold">{r.computedRank}</td>
                </tr>
              ))}

              {/* EMPTY ROWS */}
              {Array.from({ length: 10 - page.length }).map((_, i) => (
                <tr key={i}>
                  {Array.from({
                    length: type === "MAG" ? 11 : 9,
                  }).map((_, j) => (
                    <td key={j}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {pageIndex < pages.length - 1 && <div className="page-break" />}
        </div>
      ))}

      {/* ================= PRINT STYLES ================= */}
      <style>{`
        @page {
          size: A4 landscape;
          margin: 12mm;
        }

        body {
          font-family: "Times New Roman", serif;
        }

        .header {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
        }

        .logo {
          width: 85px;
        }

        .header-text {
          flex: 1;
          text-align: center;
        }

        .main-title {
          font-size: 26px;
          font-weight: bold;
        }

        .sub-title {
          font-size: 14px;
          line-height: 1.2;
          margin-top: 2px;
        }

        .sheet-title {
          font-size: 16px;
          font-weight: bold;
          text-decoration: underline;
          margin-top: 6px;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          margin: 10px 0;
          font-weight: bold;
        }

        .cons-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 14px;
        }

        .cons-table th,
        .cons-table td {
          border: 1.8px solid black;
          text-align: center;
          padding: 4px;
          height: 38px;
        }

        .name {
          text-align: left;
          padding-left: 8px;
        }

        .bold {
          font-weight: bold;
        }

        /* COLUMN WIDTHS */
        .cons-table th:nth-child(1) { width: 40px; }
        .cons-table th:nth-child(2) { width: 260px; }
        .cons-table th:nth-child(3) { width: 150px; }

        .cons-table th:last-child { width: 60px; }
        .cons-table th:nth-last-child(2) { width: 80px; }

        .page-break {
          page-break-after: always;
        }

        .no-print {
          margin: 10px;
        }

        @media print {
          .no-print {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default ConsolidatedPrint;
