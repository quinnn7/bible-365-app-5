"use client";

import { useState, useEffect } from "react";
import { days } from "../data/days";

// ------------------ Achievements ------------------
const achievementsList = [
  { name: "Brass", streak: 30, message: "Congrats on a full month of reading the Bible!", color: "#B5A642" },
  { name: "Bronze", streak: 50, message: "50 days of dedication! Amazing!", color: "#CD7F32" },
  { name: "Silver", streak: 100, message: "100 days! Incredible consistency!", color: "#C0C0C0" },
  { name: "Gold", streak: 200, message: "200 days! Outstanding!", color: "#FFD700" },
  { name: "Platinum", streak: 365, message: "365 days! Legendary!", color: "#E5E4E2" },
];

// ------------------ Streak Intro ------------------
function StreakIntro({ streak, onContinue }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 100); return () => clearTimeout(t); }, []);
  
  return (
    <div style={{
      position:"fixed", top:0, left:0, width:"100%", height:"100%",
      backgroundColor:"#FBF7F2", display:"flex", justifyContent:"center", alignItems:"center",
      zIndex:9999, transition:"opacity 0.5s ease", opacity: animate?1:0
    }}>
      <div style={{
        transform: animate?"scale(1)":"scale(0.5)", opacity: animate?1:0,
        transition:"all 0.5s ease", textAlign:"center", padding:20, borderRadius:16,
        background:"#FFF", boxShadow:"0 8px 24px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{fontSize:36, color:"#6B3E26", marginBottom:20}}>🔥 Your Current Streak 🔥</h1>
        <p style={{fontSize:24, color:"#8A6A52", marginBottom:30}}>{streak} {streak===1?"day":"days"}</p>
        <button onClick={onContinue} style={{
          padding:"12px 24px", fontSize:18, borderRadius:12, border:"none",
          backgroundColor:"#6B3E26", color:"#FBF7F2", cursor:"pointer",
          transition:"transform 0.2s ease", width:"100%"
        }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          Continue
        </button>
      </div>
    </div>
  );
}

// ------------------ Modal Template ------------------
function Modal({ children, onClose, width=320 }) {
  return (
    <div style={{
      position:"fixed", top:0, left:0, width:"100%", height:"100%",
      backgroundColor:"rgba(0,0,0,0.5)", display:"flex",
      justifyContent:"center", alignItems:"center", zIndex:9999, padding:16
    }}>
      <div style={{
        background:"#FFF", padding:20, borderRadius:16, width:"100%",
        maxWidth:width, boxShadow:"0 8px 24px rgba(0,0,0,0.2)"
      }}>
        {children}
        <button onClick={onClose} style={{
          marginTop:16, width:"100%", padding:10, borderRadius:8,
          border:"none", background:"#8B4513", color:"#FFF", cursor:"pointer"
        }}>Close</button>
      </div>
    </div>
  );
}

// ------------------ Profile Modal ------------------
function ProfileModal({ onClose, onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = () => {
    if(mode==="login") onLogin({email,password});
    else onSignup({email,password,username,avatar});
  }

  return (
    <Modal onClose={onClose}>
      <h2 style={{marginBottom:12}}>{mode==="login"?"Log In":"Sign Up"}</h2>
      {mode==="signup" && <>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={{width:"100%",marginBottom:8,padding:8,borderRadius:8,border:"1px solid #ccc"}}/>
        <input type="file" accept="image/png, image/jpeg" onChange={(e) => {
          const file = e.target.files?.[0]; if (!file) return;
          const reader = new FileReader();
          reader.onload = () => { if(typeof reader.result==="string") setAvatar(reader.result); }
          reader.readAsDataURL(file);
        }} style={{width:"100%",marginBottom:8}}/>
      </>}
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",marginBottom:8,padding:8,borderRadius:8,border:"1px solid #ccc"}}/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%",marginBottom:8,padding:8,borderRadius:8,border:"1px solid #ccc"}}/>
      <button onClick={handleSubmit} style={{width:"100%",padding:10,marginBottom:8,borderRadius:8,border:"none",background:"#6B3E26",color:"#FFF",cursor:"pointer"}}>{mode==="login"?"Log In":"Sign Up"}</button>
      <button onClick={()=>setMode(mode==="login"?"signup":"login")} style={{width:"100%",padding:10,borderRadius:8,border:"1px solid #6B3E26",background:"#FFF",color:"#6B3E26",cursor:"pointer"}}>{mode==="login"?"Switch to Sign Up":"Switch to Log In"}</button>
    </Modal>
  );
}

// ------------------ Profile Page ------------------
function ProfilePage({ profile, onClose }) {
  if(!profile) return null;
  return (
    <Modal onClose={onClose} width={350}>
      <h2>Profile</h2>
      <img src={profile.avatar||"/default-avatar.png"} style={{width:80,height:80,borderRadius:"50%",marginBottom:12}}/>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      <p>Current Streak: {profile.currentStreak||0}</p>
      <p>Best Streak: {profile.bestStreak||0}</p>
      <h3>Achievements:</h3>
      <ul>
        {achievementsList.map(a => profile.bestStreak>=a.streak?<li key={a.name} style={{color:a.color}}>{a.name}: {a.message}</li>:null)}
      </ul>
    </Modal>
  )
}

// ------------------ Settings Modal ------------------
function SettingsModal({ darkMode, setDarkMode, musicVolume, setMusicVolume, onClear, onClose }) {
  return (
    <Modal onClose={onClose}>
      <h2>Settings</h2>
      <label style={{display:"block",marginBottom:8}}>
        <input type="checkbox" checked={darkMode} onChange={()=>{setDarkMode(!darkMode); localStorage.setItem("darkMode", JSON.stringify(!darkMode));}}/>
        Dark Mode
      </label>
      <div style={{marginBottom:12}}>
        <label>Music Volume: {Math.round(musicVolume*100)}%</label>
        <input type="range" min={0} max={1} step={0.01} value={musicVolume} onChange={e=>{setMusicVolume(parseFloat(e.target.value)); localStorage.setItem("musicVolume", e.target.value);}} style={{width:"100%"}}/>
      </div>
      <button onClick={onClear} style={{width:"100%",padding:10,borderRadius:8,border:"none",background:"#6B3E26",color:"#FFF",cursor:"pointer"}}>Clear Cache</button>
    </Modal>
  );
}

// ------------------ Resources Modal ------------------
function ResourcesModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <h2>Resources</h2>
      <p><a href="https://www.bible.com/" target="_blank">Bible.com</a></p>
      <p><a href="https://www.youtube.com/@bibleproject" target="_blank">BibleProject YouTube</a></p>
    </Modal>
  );
}

// ------------------ Contact Modal ------------------
function ContactModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:plaworkshop7@gmail.com">plaworkshop7@gmail.com</a></p>
    </Modal>
  );
}

// ------------------ Main Page ------------------
export default function Page() {
  const [userInteracted, setUserInteracted] = useState(false);
  const [currentDay,setCurrentDay]=useState(1);
  const [dayOpacity,setDayOpacity]=useState(1);
  const [journal,setJournal]=useState("");
  const [completedDays,setCompletedDays]=useState(0);
  const [streak,setStreak]=useState(0);
  const [showIntro,setShowIntro]=useState(false);
  const [darkMode,setDarkMode]=useState(false);
  const [musicVolume,setMusicVolume]=useState(0.5);
  const [jumpDay,setJumpDay]=useState("");
  const [profile,setProfile]=useState(null);
  const [showProfileModal,setShowProfileModal]=useState(false);
  const [showProfilePage,setShowProfilePage]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [showResources,setShowResources]=useState(false);
  const [showContact,setShowContact]=useState(false);
  const [showStreak, setShowStreak] = useState(false);
  // ------------------ Handlers ------------------
const handleLogin = (data) => {
  const saved = JSON.parse(localStorage.getItem("profile"));
  if (saved && saved.email === data.email && saved.password === data.password) {
    setProfile(saved);
    setShowProfileModal(false);
  } else {
    alert("Invalid login");
  }
};

const handleSignup = (data) => {
  const newProfile = { ...data, currentStreak: 0, bestStreak: 0 };
  setProfile(newProfile);
  localStorage.setItem("profile", JSON.stringify(newProfile));
  setShowProfileModal(false);
};

const clearCache = () => {
  localStorage.clear();
  window.location.reload();
};


  const day = days.find(d=>d.day===currentDay);
  if(!day) return null;

  // ...[keep all existing useEffect hooks and handlers as in your original code]...

  const progressPercent = Math.round((completedDays/365)*100);

  if(showIntro) return <StreakIntro streak={streak} onContinue={()=>{
    localStorage.setItem("introSeen", "true");
    setShowIntro(false);
    setUserInteracted(true);
    const audio = document.getElementById("backgroundMusic");
    if(audio){ audio.volume = musicVolume; audio.muted=false; audio.play().catch(()=>{}); }
  }}/>;


  return (
    <div style={{
      minHeight:"100vh", backgroundColor:darkMode?"#2B2B2B":"#FBF7F2",
      color:darkMode?"#EDEDED":"#000", fontFamily:"Georgia, serif",
      padding:16, transition:"all 0.5s ease"
    }}>
      <audio id="backgroundMusic" loop preload="auto">
        <source src="/music/peaceful.mp3" type="audio/mpeg"/>
      </audio>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",marginBottom:20}}>
        <h1 style={{flex:"1 1 100%",textAlign:"center",color:"#8B4513",marginBottom:12}}>Bible in 365 Days</h1>
        <div style={{display:"flex",gap:8, flexWrap:"wrap", justifyContent:"center"}}>
          <button onClick={()=>setCurrentDay(1)} style={buttonStyle}>Home</button>
          <button onClick={()=>setShowResources(true)} style={buttonStyle}>Resources</button>
          <button onClick={()=>setShowSettings(true)} style={buttonStyle}>Settings</button>
          <button onClick={()=>setShowStreak(true)} style={buttonStyle}>🔥 Streak 🔥</button>
          <button onClick={()=>setShowContact(true)} style={buttonStyle}>Contact</button>
        </div>
      </div>

      {/* Profile */}
      <div style={{textAlign:"center",marginBottom:20}}>
        <button onClick={()=>{profile?setShowProfilePage(true):setShowProfileModal(true)}} style={{
          borderRadius:"50%", width:80, height:80, overflow:"hidden",
          border:"2px solid #8B4513", cursor:"pointer"
        }}>
          <img src={profile?.avatar||"/default-avatar.png"} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{height:12,width:"100%",background:"#ddd",borderRadius:6,marginBottom:20}}>
        <div style={{
          width:`${progressPercent}%`, height:"100%", background:"#6B3E26",
          borderRadius:6, transition:"width 0.5s ease"
        }}></div>
      </div>

      {/* Jump to Day */}
      <div style={{marginBottom:20, display:"flex",gap:8, flexWrap:"wrap"}}>
        <input type="number" placeholder="Go to day" value={jumpDay} onChange={e=>setJumpDay(e.target.value)} style={{width:100,padding:8,borderRadius:8,border:"1px solid #ccc"}}/>
        <button onClick={()=>{const d=parseInt(jumpDay); if(d>=1 && d<=365) setCurrentDay(d)}} style={buttonStyle}>Go</button>
        <button onClick={()=>localStorage.removeItem("bookmarkedDay")} style={buttonStyle}>Clear Bookmark</button>
      </div>

      {/* Day Content */}
      <div style={{
        opacity:dayOpacity, transition:"opacity 0.3s ease, transform 0.3s ease",
        transform: dayOpacity===0?"translateY(20px)":"translateY(0px)",
        padding:20, backgroundColor:darkMode?"#3B3B3B":"#FFF8E7",
        borderRadius:16, marginBottom:20, boxShadow:"0 4px 16px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{textAlign:"center", fontSize:28, marginBottom:20, color:"#8B4513"}}>Day {day.day}</h2>
        <div style={{background: darkMode?"#4B4B4B":"#FDEBD0", padding:15, borderRadius:10, marginBottom:15}}>
          <strong>Old Testament:</strong> <span style={{fontWeight:"bold"}}>{day.oldTestament}</span>
        </div>
        <div style={{background: darkMode?"#4B4B4B":"#FDEBD0", padding:15, borderRadius:10, marginBottom:15}}>
          <strong>New Testament:</strong> <span style={{fontWeight:"bold"}}>{day.newTestament}</span>
        </div>
        <h3 style={{fontSize:22,color:"#6B3E26"}}>Reflection</h3>
        <p style={{fontSize:18,marginBottom:15}}>{day.reflection}</p>
        <h3 style={{fontSize:22,color:"#6B3E26"}}>Journaling Prompt</h3>
        <textarea value={journal} onChange={e=>{setJournal(e.target.value); localStorage.setItem(`journal-day-${currentDay}`,e.target.value)}} style={{width:"100%",minHeight:80,fontSize:16,padding:8,borderRadius:8,resize:"vertical"}}/>
      </div>

      {/* Navigation */}
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>currentDay>1 && setCurrentDay(currentDay-1)} style={buttonStyle}>Previous</button>
        <button onClick={()=>currentDay<365 && setCurrentDay(currentDay+1)} style={buttonStyle}>Next</button>
      </div>

      {/* Modals */}
      {showProfileModal && <ProfileModal onClose={()=>setShowProfileModal(false)} onLogin={handleLogin} onSignup={handleSignup}/>}
      {showProfilePage && <ProfilePage profile={profile} onClose={()=>setShowProfilePage(false)}/>}
      {showSettings && <SettingsModal darkMode={darkMode} setDarkMode={setDarkMode} musicVolume={musicVolume} setMusicVolume={setMusicVolume} onClear={clearCache} onClose={()=>setShowSettings(false)}/>}
      {showResources && <ResourcesModal onClose={()=>setShowResources(false)}/>}
      {showContact && <ContactModal onClose={()=>setShowContact(false)}/>}
      {showStreak && <StreakIntro streak={streak} onContinue={()=>setShowStreak(false)} />}
    </div>
  );
}

// ------------------ Shared Button Style ------------------
const buttonStyle = {
  padding:"10px 16px", borderRadius:12, border:"none", background:"#6B3E26",
  color:"#FFF", cursor:"pointer", fontSize:16, transition:"all 0.2s ease"
};
