
import React, { useEffect, useState } from "react";
import apiSecretary from "../apiSecretary";
import Header from "./Header";

const DISPLAY_MS = 30_000;
const readable = (value) =>
  String(value || "").replaceAll("_", " ");

export default function LivePage() {
  const [scores, setScores] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchLiveScores = async () => {
      try {
        const response = await apiSecretary.get(
          "/live-scores/active"
        );

        if (active) {
          setScores(Array.isArray(response.data) ? response.data : []);
          setConnectionError(false);
        }
      } catch (error) {
        if (active) setConnectionError(true);
        console.error("Unable to fetch live scores:", error);
      }
    };

    fetchLiveScores();

    const pollId = setInterval(fetchLiveScores, 2000);
    const clockId = setInterval(() => setNow(Date.now()), 250);

    return () => {
      active = false;
      clearInterval(pollId);
      clearInterval(clockId);
    };
  }, []);

  const activeScores = scores.filter((score) => {
    const pushedAt = new Date(score.pushedAt).getTime();

    return (
      Number.isFinite(pushedAt) &&
      now < pushedAt + DISPLAY_MS
    );
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <Header />

      <section className="mx-auto max-w-[1800px] px-5 py-8 lg:px-10">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            LIVE SCORES
          </p>

          {/* <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            LIVE SCORES
          </h1> */}

          <p className="mt-3 text-slate-300">
            Official results · {activeScores.length} live
            {activeScores.length === 1 ? " score" : " scores"}
          </p>
        </div>

        {connectionError && (
          <p className="mb-5 text-center text-amber-300">
            Reconnecting to the live scoring server…
          </p>
        )}

        {activeScores.length === 0 ? (
          <div className="flex min-h-[45vh] items-center justify-center">
            <div className="text-center">
              <div className="text-6xl">✦</div>
              <h2 className="mt-5 text-2xl font-bold">
                Awaiting the next performance
              </h2>
              <p className="mt-2 text-slate-400">
                Scores will appear here when pushed by the secretary.
              </p>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            activeScores.length === 1
              ? "grid-cols-1 max-w-5xl mx-auto"
              : activeScores.length === 2
              ? "grid-cols-1 xl:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2"
          }`}>
            {activeScores.slice(0, 4).map((score) => {
              const remaining = Math.max(
                0,
                score.pushedAt
                  ? (new Date(score.pushedAt).getTime() +
                      DISPLAY_MS - now) / 1000
                  : 0
              );

              return (
                <article
                  key={score.id}
                  className="live-score-card relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-6 shadow-2xl sm:p-9"
                >
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

                  <div className="relative">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-cyan-200">
                        {score.type}
                      </span>

                      <span className="text-sm text-slate-300">
                        {readable(score.ageGroup)}
                      </span>
                    </div>

                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">
                      {readable(score.apparatus)}
                    </p>

                    <h2 className="mt-2 break-words text-3xl font-black leading-tight sm:text-4xl">
                      {score.playerName}
                    </h2>

                    <p className="mt-2 text-slate-300">
                      {score.clubName}
                    </p>

                    <div className="my-7 h-px bg-white/15" />

                    <div className="grid grid-cols-2 gap-4">
                      <ScoreValue
                        label="Start Value"
                        value={score.startValue}
                      />
                      <ScoreValue
                        label="E-Score Average"
                        value={score.avg}
                      />
                      <ScoreValue
                        label="Total Deduction"
                        value={score.totalDeduction}
                      />
                      <ScoreValue
                        label="Other Deduction"
                        value={score.otherDeduction}
                      />
                    </div>

                    <div className="mt-6 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-5 text-center">
                      <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
                        Final Score
                      </p>
                      <p className="mt-2 text-5xl font-black tabular-nums text-white sm:text-6xl">
                        {Number(score.totalScore).toFixed(3)}
                      </p>
                    </div>

                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-300"
                        style={{
                          width: `${Math.min(100, remaining / 30 * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <style>{`
        .live-score-card {
          animation: score-enter 650ms cubic-bezier(.2,.8,.2,1) both;
        }

        @keyframes score-enter {
          from { opacity: 0; transform: translateY(24px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </main>
  );
}

function ScoreValue({ label, value }) {
  const numeric = Number(value);
  const display = value == null || value === "" || !Number.isFinite(numeric)
    ? "—"
    : numeric.toFixed(2);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tabular-nums sm:text-3xl">
        {display}
      </p>
    </div>
  );
}
