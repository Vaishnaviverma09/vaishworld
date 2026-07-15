import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./PacmanPage.css";

// 0 = wall, 1 = walkable path. Generated with a randomized-DFS maze carve
// so every path cell is guaranteed reachable from START to END.
const MAZE = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,1,0,0,0,0,0,1,0,0,0],
  [0,1,0,1,0,1,1,1,1,1,1,1,0],
  [0,1,0,1,0,1,0,1,0,0,0,1,0],
  [0,1,0,1,1,1,0,1,1,1,0,1,0],
  [0,1,0,0,0,0,0,0,0,1,0,1,0],
  [0,1,1,1,0,1,1,1,0,1,0,1,0],
  [0,1,0,0,0,1,0,1,0,1,0,1,0],
  [0,1,1,1,1,1,0,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const START = { row: 1, col: 1 };
const END = { row: 9, col: 11 };

// The six big pellets, in the order a player moving start -> end will
// naturally cross them, each tied to the song it unlocks.
const SONGS = [
  "☀️ Golden — Harry Styles",
  "❤️ The First Time — Damiano David",
  "🎬 Brooklyn Baby — Lana Del Rey",
  "🌌 Reflection — The Neighbourhood",
  "🌲 Northern Attitude — Noah Kahan & Hozier",
  "🌙 Space Song — Beach House",
];

const PELLETS = [
  { row: 3, col: 3, song: SONGS[0] },
  { row: 5, col: 4, song: SONGS[1] },
  { row: 3, col: 5, song: SONGS[2] },
  { row: 4, col: 7, song: SONGS[3] },
  { row: 5, col: 9, song: SONGS[4] },
  { row: 8, col: 9, song: SONGS[5] },
];

const cellKey = (r, c) => `${r}-${c}`;
const pelletAt = (r, c) => PELLETS.find((p) => p.row === r && p.col === c);

export default function PacmanPage() {
  const navigate = useNavigate();
  const [position, setPosition] = useState(START);
  const [eaten, setEaten] = useState(() => new Set([cellKey(START.row, START.col)]));
  const [unlockedSongs, setUnlockedSongs] = useState([]);
  const [popup, setPopup] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const popupTimer = useRef(null);

  const showPopup = useCallback((song) => {
    setPopup(song);
    if (popupTimer.current) clearTimeout(popupTimer.current);
    popupTimer.current = setTimeout(() => setPopup(null), 1600);
  }, []);

  const move = useCallback(
    (dr, dc) => {
      if (gameOver) return;
      setPosition((prev) => {
        const nr = prev.row + dr;
        const nc = prev.col + dc;
        if (
          nr < 0 ||
          nc < 0 ||
          nr >= MAZE.length ||
          nc >= MAZE[0].length ||
          MAZE[nr][nc] === 0
        ) {
          return prev; // blocked by a wall / edge — stay put
        }

        setEaten((prevEaten) => {
          const next = new Set(prevEaten);
          next.add(cellKey(nr, nc));
          return next;
        });

        const pellet = pelletAt(nr, nc);
        if (pellet && !eaten.has(cellKey(nr, nc))) {
          setUnlockedSongs((prevSongs) =>
            prevSongs.includes(pellet.song) ? prevSongs : [...prevSongs, pellet.song]
          );
          showPopup(pellet.song);
        }

        if (nr === END.row && nc === END.col) {
          setTimeout(() => setGameOver(true), 250);
        }

        return { row: nr, col: nc };
      });
    },
    [eaten, gameOver, showPopup]
  );

  const progress = unlockedSongs.length;

  if (gameOver) {
    return (
      <div className="pacman-page">
        <div
          className="reveal-box"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/qr")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/qr");
          }}
        >
          <p className="reveal-heading">
            You have unlocked {progress} {progress === 1 ? "song" : "songs"}.
          </p>
          <ul className="reveal-list">
            {unlockedSongs.map((song) => (
              <li key={song}>{song}</li>
            ))}
          </ul>
          <p className="reveal-hint">To proceed click on the box.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pacman-page">
      <div className="pacman-copy">
        <p className="pacman-level">LEVEL 2</p>
        <h2 className="pacman-title">Find the Coffee.</h2>
        <p className="pacman-sub">
          Collect enough points
          <br />
          to unlock today&apos;s soundtrack.
        </p>
      </div>

      <div className="game-row">
        <div
          className="maze-grid"
          style={{
            gridTemplateColumns: `repeat(${MAZE[0].length}, 1fr)`,
            gridTemplateRows: `repeat(${MAZE.length}, 1fr)`,
          }}
        >
          {MAZE.map((row, r) =>
            row.map((cell, c) => {
              if (cell === 0) {
                return <div key={cellKey(r, c)} className="maze-wall" />;
              }

              const isGhost = position.row === r && position.col === c;
              const isEnd = END.row === r && END.col === c;
              const pellet = pelletAt(r, c);
              const isEaten = eaten.has(cellKey(r, c));

              return (
                <div key={cellKey(r, c)} className="maze-path">
                  {isEnd && (
                    <img className="maze-cup" src="/coffee-cup.png" alt="Coffee cup" />
                  )}
                  {!isEnd && !isEaten && (
                    <span className={pellet ? "dot dot-big" : "dot dot-small"} />
                  )}
                  {isGhost && (
                    <img className="maze-ghost" src="/ghost.png" alt="You" />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="dpad">
          <button
            type="button"
            className="dpad-btn dpad-up"
            onClick={() => move(-1, 0)}
            aria-label="Move up"
          >
            <img src="/arrow-up.png" alt="" />
          </button>
          <div className="dpad-middle-row">
            <button
              type="button"
              className="dpad-btn dpad-left"
              onClick={() => move(0, -1)}
              aria-label="Move left"
            >
              <img src="/arrow-up.png" alt="" />
            </button>
            <button
              type="button"
              className="dpad-btn dpad-right"
              onClick={() => move(0, 1)}
              aria-label="Move right"
            >
              <img src="/arrow-up.png" alt="" />
            </button>
          </div>
          <button
            type="button"
            className="dpad-btn dpad-down"
            onClick={() => move(1, 0)}
            aria-label="Move down"
          >
            <img src="/arrow-up.png" alt="" />
          </button>
        </div>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${(progress / SONGS.length) * 100}%` }}
          />
        </div>
        <p className="progress-bar-label">
          {progress} / {SONGS.length} songs unlocked
        </p>
      </div>

      {popup && (
        <div className="song-popup">
          <p>You unlocked a song!</p>
          <p className="song-popup-name">{popup}</p>
        </div>
      )}
    </div>
  );
}
