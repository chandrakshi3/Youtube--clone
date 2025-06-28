import React from 'react'
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";
import { useState, useEffect } from 'react';
import { CgHomeAlt } from "react-icons/cg";
import { NavLink } from 'react-router-dom';
import { IoMdTrendingUp } from "react-icons/io";
import { SiYoutubeshorts } from "react-icons/si";
import { FaHistory } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Trending.css'
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_YT_KEY;

function Trending() {
    const [theme, setTheme] = useState('dark');
    const [videos, setVideos] = useState([]);
         const [query, setQuery] = useState("");
        const navigate = useNavigate();
        
    
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

      
      
      const [selectedCountry, setSelectedCountry] = useState("IN"); // default: India

const countries = [
  { code: "IN", name: "India" },
  { code: "US", name: "USA" },
  { code: "GB", name: "UK" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "BR", name: "Brazil" },
  { code: "RU", name: "Russia" },
  { code: "CA", name: "Canada" },
];
<select
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.target.value)}
>
  {countries.map(c => (
    <option key={c.code} value={c.code}>{c.name}</option>
  ))}
  </select>
const ss = countries[Math.floor(Math.random() * countries.length)].code;
        /* ––– ADD ▼ fetch once on mount ––– */
       useEffect(() => {
  async function getTrending() {
    try {
      const { data } = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          key: API_KEY,
          part: "snippet,contentDetails",
          chart: "mostPopular",
          regionCode: selectedCountry,
          videoDuration: "medium",
          maxResults: 16
        }
      });
      setVideos(data.items);
    } catch (err) {
      console.error("YouTube API error:", err.response?.data || err.message);
      setVideos([]);
    }
  }

  getTrending();
}, [selectedCountry]); // Refetch when user selects new country

  return (
    
  <div className='trending'>
    
     <div class="navbar1">
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
            <div class="bottom">
                <div class="margin-panel1">
                    <NavLink to="/" className="sidebar-link">
                        <CgHomeAlt />
                    </NavLink>
                   <NavLink to ="/trending" className="sidebar-link">
                        <IoMdTrendingUp />
                   </NavLink>

                   <NavLink to ="/history" className="sidebar-link">
                     <FaHistory />
                   </NavLink>
                    
                </div>
                 <div class="video-panel1">
                    <h3 class="panel-heading">
                        Trending <IoMdTrendingUp />
                    </h3>
                     {videos.map((v) => (
                                           <Link to={`/watch/${v.id.videoId || v.id}`} className="card" key={v.id} >

                                                    <img
                                                        src={v.snippet.thumbnails.high.url}
                                                        alt={v.snippet.title}
                                                        className="thumb"
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

export default Trending