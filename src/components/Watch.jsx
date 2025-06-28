import { useParams } from "react-router-dom";
import axios from "axios";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";
import { useState, useEffect } from 'react';
import { CgHomeAlt } from "react-icons/cg";
import { NavLink } from 'react-router-dom';
import { IoMdTrendingUp } from "react-icons/io";

import { FaHistory } from "react-icons/fa";
import './Watch.css';
import { Link, useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_YT_KEY;

export default function Watch() {
  const { id } = useParams(); // video ID from URL
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [input, setInput] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
    if (!video) return;                // run only after video data is ready

    const stored = JSON.parse(localStorage.getItem("watchHistory")) || [];

    // strip to the essentials you need in History.jsx
    const item = {
      id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.medium.url,
    };

    // keep newest first, no duplicates
    const withoutThis = stored.filter((v) => v.id !== id);
    const updated     = [item, ...withoutThis].slice(0, 50); // cap at 50

    localStorage.setItem("watchHistory", JSON.stringify(updated));
  }, [id, video]);
  
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

function handleSubmit(e) {
  e.preventDefault();
  if (input.trim()) {
    navigate(`/search?q=${encodeURIComponent(input.trim())}`);
    setInput("");
  }
}


useEffect(() => {
  async function fetchData() {
    try {
      // 1. Fetch main video info
     const main = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
  params: {
    key: API_KEY,
    part: "snippet",
    id
  }
});

      const mainVideo = main.data.items[0];
      // 🧠 Safety check: If video doesn't exist, exit early
if (!mainVideo) {
  console.warn("No video found for id:", id);
  setVideo(null);
  setRelated([]);
  return;
}

setVideo(mainVideo);

      let relatedItems = [];

      try {
        // 2. Try relatedToVideoId method
        const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
  params: {
    key: API_KEY,
    part: "snippet",
    type: "video",
    relatedToVideoId: id,
    maxResults: 10
  }
});
setRelated(res.data.items);

      } catch (relErr) {
        console.warn(
          "relatedToVideoId failed – falling back. Reason:",
          relErr.response?.data?.error?.errors?.[0]?.reason || relErr.message
        );

        // 3. Fall back to text search using title
        const title = mainVideo.snippet.title;
        const fallbackRes = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              key: API_KEY,
              part: "snippet",
              type: "video",
              q: title,
              maxResults: 10,
            },
          }
        );
        relatedItems = fallbackRes.data.items;
      }

      setRelated(relatedItems);
    } catch (err) {
      console.error("YouTube API error:", err.response?.data || err.message);
      setRelated([]);
    }
  }

  fetchData();
}, [id]);




  if (!video) return <p style={{ padding: 20 }}>Video not available or failed to load.</p>;


  return (
    <>
      {/* ───────── NAVBAR ───────── */}
      <div className="navbar1">
        <p className="logo">Youtube</p>
        <div className="search-container">
          <form className="search-form" onSubmit={handleSubmit}>
            <input className="searchbar" type="text" placeholder="Search" value={input} onChange={(e) => setInput(e.target.value)} />
            <button className="search-btn">Search</button>
          </form>
        </div>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === "dark" ? <BsBrightnessHigh /> : <MdOutlineDarkMode />}
        </button>
      </div>

      {/* ───────── MAIN LAYOUT ───────── */}
      <div className="bottom">
        {/* Sidebar */}
        <div className="margin-panel1">
          <NavLink to="/" className="sidebar-link"><CgHomeAlt /></NavLink>
          <NavLink to="/trending" className="sidebar-link"><IoMdTrendingUp /></NavLink>
          <NavLink to="/history" className="sidebar-link"><FaHistory /></NavLink>
        </div>

        {/* Watch Page */}
        <div className="watch-page">
          {/* Main Video Player */}
          <div className="player-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=1`}
              title={video?.snippet?.title}
              width="100%"
              height="450"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <h2>{video?.snippet?.title}</h2>
            <p>{video?.snippet?.channelTitle}</p>
          </div>

          {/* Recommended Video List */}
          <div className="recommend-list">
  {related.length === 0 ? (
    <p>No related videos.</p>
  ) : (
    related.map((rv) =>
      rv.id?.videoId ? (
        <Link to={`/watch/${rv.id.videoId}`} key={rv.id.videoId} className="recommend-card">
          <img src={rv.snippet.thumbnails.medium.url} alt={rv.snippet.title} />
          <div className="rec-text">
            <b>{rv.snippet.title}</b>
            <span>{rv.snippet.channelTitle}</span>
          </div>
        </Link>
      ) : null
    )
  )}
</div>


        </div>
      </div>
      
    </>
  );
}
