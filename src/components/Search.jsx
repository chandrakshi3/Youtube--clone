import React, { useState, useEffect } from "react";
import {
  useSearchParams,
  useNavigate,
  Link,
  NavLink,
} from "react-router-dom";
import axios from "axios";
import { IoMdTrendingUp } from "react-icons/io";
import { SiYoutubeshorts } from "react-icons/si";
import { FaHistory } from "react-icons/fa";
import { CgHomeAlt } from "react-icons/cg";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";

const API_KEY = import.meta.env.VITE_YT_KEY;

export default function Search() {
  /* THEME ---------------------------------------------------- */
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.body.className = saved;
  }, []);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.body.className = next;
    localStorage.setItem("theme", next);
  };

  /* ROUTER + STATE ------------------------------------------ */
  const [params] = useSearchParams();
  const paramQuery = params.get("q") || ""; // value from URL
  const [input, setInput] = useState("");   // text box value
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  /* FORM SUBMIT → push /search?q=… -------------------------- */
  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/search?q=${encodeURIComponent(input.trim())}`);
      setInput(""); // clear box
    }
  }

  /* FETCH when paramQuery changes --------------------------- */
  useEffect(() => {
    if (!paramQuery) {
      setResults([]);
      return;
    }

    async function fetchResults() {
      try {
        const { data } = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              key: API_KEY,
              part: "snippet",
              type: "video",
              q: paramQuery,
              maxResults: 12,
              videoEmbeddable: "true",
            },
          }
        );
        setResults(data.items);
      } catch (err) {
        console.error("YouTube API error:", err.response?.data || err.message);
        setResults([]);
      }
    }
    fetchResults();
  }, [paramQuery]);

  /* RENDER --------------------------------------------------- */
  if (!paramQuery)
    return <p style={{ padding: 40 }}>No search term in URL.</p>;

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar1">
        <p className="logo">Youtube</p>
        <div className="search-container">
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              className="searchbar"
              type="text"
              placeholder="Search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </form>
        </div>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === "dark" ? <BsBrightnessHigh /> : <MdOutlineDarkMode />}
        </button>
      </div>

      {/* LAYOUT */}
      <div className="bottom">
        <div className="margin-panel1">
          <NavLink to="/" className="sidebar-link"><CgHomeAlt /></NavLink>
          <NavLink to="/trending" className="sidebar-link"><IoMdTrendingUp /></NavLink>
         
          <NavLink to="/history" className="sidebar-link"><FaHistory /></NavLink>
        </div>

        <div style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 16 }}>Results for “{paramQuery}”</h2>
          <div className="video-panel">
            {results.map((v) => (
              <Link
                key={v.id.videoId}
                to={`/watch/${v.id.videoId || v.id}`}
                className="card"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${v.id.videoId}?controls=0&mute=1`}
                  title={v.snippet.title}
                  width="100%"
                  height="180"
                  frameBorder="0"
                />
                <b>{v.snippet.title}</b>
                <p>{v.snippet.channelTitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
