// History.jsx – cleaned‑up version
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";
import { CgHomeAlt } from "react-icons/cg";
import { IoMdTrendingUp } from "react-icons/io";
import { FaHistory } from "react-icons/fa";

import "./History.css";

function History() {
  /* ── STATE ─────────────────────────────────────────── */
  const [theme, setTheme] = useState("dark");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  /* ── LOAD THEME + HISTORY ON FIRST RENDER ─────────── */
  useEffect(() => {
    // theme
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.className = savedTheme;

    // watch history
    const stored = JSON.parse(localStorage.getItem("watchHistory")) || [];
    setHistory(stored);
  }, []);

  /* ── THEME TOGGLE ─────────────────────────────────── */
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  /* ── HISTORY HANDLERS ─────────────────────────────── */
  const handleDelete = (id) => {
    const updated = history.filter((v) => v.id !== id);
    setHistory(updated);
    localStorage.setItem("watchHistory", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    localStorage.removeItem("watchHistory");
    setHistory([]);
  };

  /* ── RENDER ───────────────────────────────────────── */
  return (
    <>
      {/* NAVBAR */}
      <header className="navbar1">
        <p className="logo">Youtube</p>
        <div className="search-container" />
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === "dark" ? <BsBrightnessHigh /> : <MdOutlineDarkMode />}
        </button>
      </header>

      {/* MAIN LAYOUT */}
      <div className="bottom">
        {/* SIDEBAR */}
        <nav className="margin-panel1">
          <NavLink to="/" className="sidebar-link">
            <CgHomeAlt />
          </NavLink>
          <NavLink to="/trending" className="sidebar-link">
            <IoMdTrendingUp />
          </NavLink>
          <NavLink to="/history" className="sidebar-link">
            <FaHistory />
          </NavLink>
        </nav>

        {/* HISTORY SECTION */}
        <section className="history-page">
          <h2>Watch History</h2>

          {history.length === 0 ? (
            <p>No watch history found.</p>
          ) : (
            <>
              <button onClick={handleClearAll} className="clear-btn">
                Clear All
              </button>
              <div className="history-grid">
                {history.map((video) => (
                  <article className="history-card" key={video.id}>
                    <Link to={`/watch/${video.id}`}>
                      <img src={video.thumbnail} alt={video.title} />
                      <h3>{video.title}</h3>
                      <p>{video.channelTitle}</p>
                    </Link>
                    <button onClick={() => handleDelete(video.id)}>Delete</button>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default History;
