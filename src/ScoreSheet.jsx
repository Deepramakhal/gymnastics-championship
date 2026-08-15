/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiAdmin from "./apiConfigAdmin";
import Logo from "./assets/logo.png";

function ScoreSheet() {
  const { ageGroup, type, apparatus } = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    apiAdmin
      .get(`/getPlayersByAgeGroup/${ageGroup}/${type}`)
      .then((res) => setPlayers(res.data));
  }, [ageGroup, type]);

  const pages = [];
  for (let i = 0; i < players.length; i += 8) {
    pages.push(players.slice(i, i + 8));
  }

  const genderLabel = type === "MAG" ? "Boys" : "Girls";

  return (
    <>
      <div className="no-print">
        <button onClick={() => window.print()}>🖨 Print</button>
      </div>

      {pages.map((pagePlayers, pageIndex) => (
        <div className="page" key={pageIndex}>
          {/* HEADER */}
          <div className="header">
            <img src={import.meta.env.VITE_LOGO_URL} className="logo" alt="logo" />
            <div className="header-text">
              <div className="font-bold font-['times-new-roman'] text-3xl">
                {import.meta.env.VITE_MAIN_HEAD}
              </div>
              <div className="font-['times-new-roman'] font-semibold text-xl">
                {/* Regd. Under Societies Act XXVI of 1961 <br /> */}(
                {import.meta.env.VITE_SECOND_LINE}) <br />
                {import.meta.env.VITE_THIRD_LINE}
              </div>
              <div className="sheet-title">CHAIR OF JURY SCORE SHEET</div>
            </div>
          </div>

          {/* META */}
          <div className="meta">
            {/* <div className="font-semibold ml-32">
              COMPETITION NO: I / IV ☐ &nbsp;&nbsp; II ☐ &nbsp;&nbsp; III ☐
            </div> */}
            <div className="ml-96"></div>
            <div className="mr-56 text-xl font-semibold">{apparatus}</div>
            <div className="mr-8 text-[16px] font-['Calibri']">
              {genderLabel} – {ageGroup}
            </div>
          </div>

          {/* TABLE */}
          <table className="score-table">
            <thead>
              <tr>
                <th rowSpan="2">
                  Sl.
                  <br />
                  No
                </th>
                <th rowSpan="2">Name of Gymnast</th>
                <th rowSpan="2">
                  D1/
                  <br />
                  D2
                </th>
                <th rowSpan="2">
                  E Jury
                  <br />
                  Out of
                </th>
                <th rowSpan="2">
                  Start
                  <br />
                  Value
                </th>
                <th colSpan="7">E Jury</th>
                <th rowSpan="2">
                  Total
                  <br />
                  Dedn.
                </th>
                <th rowSpan="2">Avg.</th>
                <th rowSpan="2">
                  Other
                  <br />
                  Dedn.
                </th>
                <th rowSpan="2">
                  Final
                  <br />
                  Scores
                </th>
                <th rowSpan="2">Remarks</th>
              </tr>
              <tr>
                <th>E1</th>
                <th>E2</th>
                <th>E3</th>
                <th>E4</th>
                <th>E5</th>
                <th>E6</th>
                <th>E7</th>
              </tr>
            </thead>

            <tbody>
              {pagePlayers.map((p, i) => (
                <tr key={p.id}>
                  <td>{pageIndex * 8 + i + 1}</td>
                  <td className="name font-2xl">{p.name}</td>
                  {/* remaining 15 cells */}
                  {Array.from({ length: 15 }).map((_, j) => (
                    <td key={j}></td>
                  ))}
                </tr>
              ))}

              {Array.from({ length: 8 - pagePlayers.length }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 17 }).map((_, j) => (
                    <td key={j}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* FOOTER */}
          <div className="footer">
            {/* E JURY */}
            <div className="footer-ejury">
              <div className="footer-title">E Jury</div>
              <div className="ejury-grid">
                <span>E1</span>
                <span>E3</span>
                <span>E5</span>
                <span>E2</span>
                <span>E4</span>
                <span>E6</span>
                <span>E7</span>
              </div>
            </div>

            {/* D JURY */}
            <div className="footer-djury">
              <div className="footer-title">D Jury</div>
              <div className="djury-grid">
                <span>D1</span>
                <span>D2</span>
              </div>
            </div>

            {/* SECRETARY */}
            <div className="footer-secretary">Secretary</div>
          </div>

          {pageIndex < pages.length - 1 && <div className="page-break" />}
        </div>
      ))}

      {/* ================= PRINT STYLES ================= */}
      <style>{`
        @page {
          size: A4 landscape;
          margin: 8mm;
        }

        body {
          font-family: "Times New Roman", serif;
        }

        .header {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }

        .logo {
          width: 85px;
        }

        .header-text {
          flex: 1;
          text-align: center;
        }

        .title {
          font-size: 22px;
          font-weight: bold;
        }

        .subtitle {
          font-size: 13px;
          line-height: 1.2;
        }

        .sheet-title {
          font-size: 15px;
          font-weight: bold;
          text-decoration: underline;
          margin-top: 4px;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin: 6px 0;
        }

        .score-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 13px;
        }

        .score-table th,
        .score-table td {
          border: 1.5px solid black;
          text-align: center;
          height: 40px;
          padding: 2px;
        }

        .name {
          text-align: left;
          padding-left: 6px;
        }

        /* COLUMN WIDTHS */
        .score-table th:nth-child(1) { width: 40px; }
        .score-table th:nth-child(2) { width: 210px; }
        .score-table th:nth-child(3) { width: 60px; }
        .score-table th:nth-child(4) { width: 65px; }
        .score-table th:nth-child(5) { width: 70px; }
        {/* .score-table th:nth-child(6) { width: 80px; } */}

        /* E JURY (E1–E7) */
        .score-table th:nth-child(7)
        .score-table th:nth-child(8)
        .score-table th:nth-child(9)
        .score-table th:nth-child(10)
        .score-table th:nth-child(11)
        .score-table th:nth-child(12)
        .score-table th:nth-child(13) {
          width: 70px;
        }

        .score-table th:nth-child(14) { width: 80px; }
        .score-table th:nth-child(15) { width: 40px; }
        .score-table th:nth-child(16) { width: 100px; }
        .score-table th:nth-child(17) { width: 20px; } 

        .footer {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  margin-top: 30px;
  font-size: 13px;
  align-items: start;
}

/* TITLES */
.footer-title {
  font-weight: bold;
  margin-bottom: 6px;
}

/* E JURY */
.footer-ejury {
  padding-left: 40px;
}

.ejury-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 40px;
  row-gap: 8px;
  font-weight: normal;
}

/* D JURY */
.footer-djury {
  text-align: center;
}

.djury-grid {
  display: grid;
  row-gap: 8px;
  margin-top: 6px;
}

/* SECRETARY */
.footer-secretary {
  text-align: right;
  padding-right: 40px;
  margin-top: 28px;
  font-weight: bold;
}


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

export default ScoreSheet;
