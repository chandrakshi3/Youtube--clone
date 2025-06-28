import React from 'react'
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";
import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { IoMdTrendingUp } from "react-icons/io";
import { SiYoutubeshorts } from "react-icons/si";
import { FaHistory } from "react-icons/fa";
import { CgHomeAlt } from "react-icons/cg";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const API_KEY = import.meta.env.VITE_YT_KEY;


function Home() {
    const [theme, setTheme] = useState('dark');
     const [videos, setVideos] = useState([]);
     const [query, setQuery] = useState("");
    const navigate = useNavigate();
    
    // inside Watch.jsx
async function getRelated(videoId) {
  try {
    const { data } = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: API_KEY,
          part: "snippet",
          type: "video",          // <- REQUIRED with relatedToVideoId
          relatedToVideoId: videoId,
          maxResults: 10,
        },
      }
    );
    setRelated(data.items);
  } catch (err) {
    console.warn(
      "relatedToVideoId failed – falling back.",
      err.response?.data?.error?.errors?.[0]?.reason || err.message
    );
    setRelated([]);               // or fetchPopularVideos() instead
  }
}


    function handleSubmit(e) {
  e.preventDefault();
  if (query.trim()) {
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  }
}

    useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.className = savedTheme; // apply class to body
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme; // change body class
    localStorage.setItem('theme', newTheme); // save preference
  };

  /* ––– ADD ▼ fetch once on mount ––– */
  useEffect(() => {
  async function getVideos() {
    const topics = [
      "coding", "music", "travel", "news",
      "gaming", "football", "food", "tutorial"
    ];
    const randomQuery =
      topics[Math.floor(Math.random() * topics.length)];

    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: API_KEY,
            part: "snippet",
            q: randomQuery,     // always a real word now
            type: "video",
            maxResults: 12,
            videoDuration: "medium",
          },
        }
      );
      setVideos(data.items);
    } catch (err) {
      console.error("Home fetch failed:", err.response?.data || err);
      setVideos([]);           // keep UI predictable
    }
  }

  getVideos();
}, []); // still runs only on mount

  return (
     <div class='pura'>
        <div class="navbar">
            <p class="logo">
                Youtube
            </p>
         <div className="search-container">
            <form className="search-form"  onSubmit={handleSubmit}>
                <input className="searchbar" type="text" placeholder="Search" onChange={(e) => setQuery(e.target.value)}/>
                <button className="search-btn">Search</button>
            </form>
        </div>

        <div className="app">
      <button onClick={toggleTheme} className="theme-toggle-btn">
        {theme === 'dark' ? <BsBrightnessHigh/> : <MdOutlineDarkMode/>}
      </button>

      {/* Your other app content goes here */}
    </div>

      
        </div>
        <div className={`bottom ${videos.length ? "has-videos" : ""}`}>

            <div class="margin-panel">
     <NavLink to="/"          className={({isActive}) => isActive ? "active-link" : ""}><CgHomeAlt /> Home</NavLink>
      <NavLink to="/trending"  className={({isActive}) => isActive ? "active-link" : ""}><IoMdTrendingUp /> Trending</NavLink>
      <NavLink to="history"  className={({isActive}) => isActive ? "active-link" : ""}> <FaHistory /> History</NavLink>
            </div>
            
            <div className="video-panel">
                    {videos.map((v) => (
                         <Link
                                to={`/watch/${v.id.videoId}`}
                                className="card"
                                key={v.id.videoId}
                            >
                                <iframe
                                /* thumbnail preview via embed + ?controls=0&mute=1 gives quick poster */
                                src={`https://www.youtube.com/embed/${v.id.videoId}?controls=0&mute=1`}
                                title={v.snippet.title}
                                frameBorder="0"
                                />
                                <b>{v.snippet.title}</b>
                                <p>{v.snippet.channelTitle}</p>
                            </Link>
                    ))}
            </div>

             
        </div>
    </div>
  )
}

export default Home