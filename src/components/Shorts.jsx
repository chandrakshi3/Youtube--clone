import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";
import { CgHomeAlt } from "react-icons/cg";
import { IoMdTrendingUp } from "react-icons/io";
import { SiYoutubeshorts } from "react-icons/si";
import { FaHistory } from "react-icons/fa";
import "./Shorts.css";


const API_KEY = import.meta.env.VITE_YT_KEY;// replace with your key



export default function Shorts() {
  const [theme, setTheme] = useState("dark");
  const [shorts, setShorts] = useState([]);
  
  
  const feedRef = useRef(null);

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

  const scrollByCard = (direction = 1) => {
    const feed = feedRef.current;
    if (!feed) return;
    const cardHeight = feed.firstChild?.getBoundingClientRect().height || 0;
    feed.scrollBy({ top: direction * cardHeight, behavior: "smooth" });
  };

  useEffect(() => {
    async function fetchShorts() {
      try {
        const { data } = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              key: API_KEY,
              part: "snippet",
              maxResults: 100,
              type: "video",
              q: "yt shorts", // simulate short content
              videoDuration: "short",
              videoEmbeddable: "true",
            },
          }
        );
        setShorts(data.items);
      } catch (err) {
        console.error("Error fetching shorts:", err);
      }
    }
    fetchShorts();
  }, []);

  return (
    <>
      <div className="navbar1">
        <p className="logo">Youtube</p>
        <div className="search-container">
          <form className="search-form">
            <input className="searchbar" type="text" placeholder="Search" />
            <button className="search-btn">Search</button>
          </form>
        </div>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === "dark" ? <BsBrightnessHigh /> : <MdOutlineDarkMode />}
        </button>
      </div>

      <div className="bottom">
        <div className="margin-panel1">
          <NavLink to="/"         className="sidebar-link"><CgHomeAlt /></NavLink>
          <NavLink to="/trending" className="sidebar-link"><IoMdTrendingUp /></NavLink>
          <NavLink to="/shorts"   className="sidebar-link"><SiYoutubeshorts /></NavLink>
          <NavLink to="/history"  className="sidebar-link"><FaHistory /></NavLink>
        </div>

        <div className="shorts-wrapper">
          <button className="scroll-btn up-btn" onClick={() => scrollByCard(-1)}>↑</button>

          <div className="shorts-feed" ref={feedRef}>
            {shorts.map((v) => (
              <div className="short-card" key={v.id.videoId}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.id.videoId}?autoplay=1&controls=0`}
                  
                  title={v.snippet.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ))}
          </div>

          <button className="scroll-btn down-btn" onClick={() => scrollByCard(1)}>↓</button>
        </div>
      </div>
    </>
  );
}
