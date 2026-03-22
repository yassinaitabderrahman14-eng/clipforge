import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #080810; }
  ::-webkit-scrollbar-thumb { background: #2a2a45; border-radius: 4px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px #7c3aed44} 50%{box-shadow:0 0 40px #7c3aed88} }
  .fade-up { animation: fadeUp .5s ease forwards; }
  .tab-btn { background:none; border:none; cursor:pointer; padding:10px 16px; border-radius:8px; font-family:'Instrument Sans',sans-serif; font-size:13px; font-weight:500; transition:all .2s; display:flex; align-items:center; gap:7px; color:#666; white-space:nowrap; }
  .tab-btn:hover { background:#1a1a2e; color:#ccc; }
  .tab-btn.active { background:linear-gradient(135deg,#7c3aed22,#a855f722); color:#c084fc; border:1px solid #7c3aed33; }
  .card { background:#0f0f1a; border:1px solid #1e1e32; border-radius:14px; padding:20px; transition:all .2s; }
  .card:hover { border-color:#2a2a45; }
  .btn { border:none; cursor:pointer; font-family:'Instrument Sans',sans-serif; font-weight:600; transition:all .2s; border-radius:8px; }
  .btn-primary { background:linear-gradient(135deg,#7c3aed,#a855f7); color:white; padding:10px 20px; font-size:14px; }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px #7c3aed55; }
  .btn-ghost { background:#1a1a2e; border:1px solid #2a2a3f; color:#888; padding:8px 14px; font-size:13px; }
  .btn-ghost:hover { border-color:#7c3aed55; color:#c084fc; }
  .btn-danger { background:#f8717111; border:1px solid #f8717133; color:#f87171; padding:7px 14px; font-size:13px; }
  .btn-danger:hover { background:#f8717122; }
  .status { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; font-family:'Instrument Sans',sans-serif; }
  .status-done { color:#4ade80; background:#4ade8011; border:1px solid #4ade8033; }
  .status-processing { color:#fbbf24; background:#fbbf2411; border:1px solid #fbbf2433; animation:pulse 1.5s infinite; }
  .status-queued { color:#60a5fa; background:#60a5fa11; border:1px solid #60a5fa33; }
  .upload-zone { border:2px dashed #2a2a45; border-radius:14px; padding:48px 24px; text-align:center; cursor:pointer; transition:all .3s; }
  .upload-zone:hover { border-color:#7c3aed; background:#7c3aed06; transform:scale(1.01); }
  .progress-bar { height:5px; background:#1e1e30; border-radius:3px; overflow:hidden; }
  .progress-fill { height:100%; background:linear-gradient(90deg,#7c3aed,#a855f7,#7c3aed); background-size:200%; animation:shimmer 1.5s linear infinite; border-radius:3px; transition:width .3s; }
  .notif { position:fixed; top:20px; right:20px; padding:12px 20px; border-radius:10px; font-size:13px; font-weight:600; z-index:9999; animation:fadeUp .3s ease; font-family:'Instrument Sans',sans-serif; }
  .notif-success { background:#4ade8018; border:1px solid #4ade8044; color:#4ade80; }
  .notif-error { background:#f8717118; border:1px solid #f8717144; color:#f87171; }
  .chart-bar { background:linear-gradient(to top,#7c3aed,#c084fc); border-radius:4px 4px 0 0; transition:height .6s ease; }
  .slider { -webkit-appearance:none; width:100%; height:5px; border-radius:3px; outline:none; cursor:pointer; background:linear-gradient(to right,#7c3aed 0%,#7c3aed calc(var(--val)*10%),#2a2a45 calc(var(--val)*10%)); }
  .slider::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#a855f7; cursor:pointer; box-shadow:0 0 8px #a855f755; }
  input[type=file] { display:none; }
`;

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onGetStarted }) {
  return (
    <div style={{ minHeight:"100vh", background:"#080810", color:"#e8e8f0", fontFamily:"'Instrument Sans',sans-serif", overflow:"hidden" }}>
      <style>{CSS}</style>

      {/* Bg blobs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", width:600, height:600, background:"#7c3aed0a", borderRadius:"50%", filter:"blur(100px)", top:"-100px", left:"50%", transform:"translateX(-50%)" }} />
        <div style={{ position:"absolute", width:400, height:400, background:"#a855f708", borderRadius:"50%", filter:"blur(80px)", bottom:"-50px", right:"-100px" }} />
      </div>

      {/* Nav */}
      <nav style={{ position:"relative", zIndex:10, padding:"20px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #1e1e3244" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚡</div>
          <span style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:18, fontWeight:800, background:"linear-gradient(135deg,#c084fc,#e879f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ClipForge</span>
        </div>
        <button className="btn btn-primary" onClick={onGetStarted} style={{ padding:"9px 22px", fontSize:13 }}>Get Started Free →</button>
      </nav>

      {/* Hero */}
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"100px 24px 80px", maxWidth:800, margin:"0 auto" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#7c3aed18", border:"1px solid #7c3aed33", borderRadius:20, padding:"6px 14px", fontSize:12, color:"#c084fc", marginBottom:28, fontWeight:600 }}>
          ✨ AI-Powered YouTube Automation
        </div>
        <h1 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:"clamp(40px,6vw,72px)", fontWeight:900, lineHeight:1.1, marginBottom:24 }}>
          Turn Long Videos Into<br />
          <span style={{ background:"linear-gradient(135deg,#c084fc,#e879f9,#c084fc)", backgroundSize:"200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmer 3s linear infinite" }}>Viral Shorts</span>
        </h1>
        <p style={{ fontSize:18, color:"#666", lineHeight:1.7, marginBottom:40, maxWidth:560, margin:"0 auto 40px" }}>
          Upload your long-form YouTube videos. Our AI clips, captions, and schedules them automatically. No editing skills needed.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn btn-primary" onClick={onGetStarted} style={{ padding:"14px 32px", fontSize:15, animation:"glow 3s ease-in-out infinite" }}>
            Start for Free — No credit card
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:32, justifyContent:"center", marginTop:60, flexWrap:"wrap" }}>
          {[["2.4M+","Views Generated"],["1,840+","Shorts Created"],["247+","Videos Processed"]].map(([v,l],i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:28, fontWeight:900, background:"linear-gradient(135deg,#c084fc,#e879f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
              <div style={{ fontSize:12, color:"#555", marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ position:"relative", zIndex:1, padding:"60px 48px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:20 }}>
          {[
            { icon:"✂️", title:"AI Auto-Clipping", desc:"AI detects the most engaging moments and cuts them into perfect shorts automatically." },
            { icon:"💬", title:"Auto Captions", desc:"Generates accurate captions and subtitles for every clip in seconds." },
            { icon:"🚀", title:"Auto-Post to YouTube", desc:"Schedule and publish your shorts automatically at the best times for maximum reach." },
            { icon:"📊", title:"Analytics Dashboard", desc:"Track views, likes, CTR and performance across all your published content." },
          ].map((f,i) => (
            <div key={i} className="card" style={{ padding:24 }}>
              <div style={{ fontSize:32, marginBottom:14 }}>{f.icon}</div>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:17, fontWeight:700, marginBottom:8 }}>{f.title}</div>
              <div style={{ fontSize:13, color:"#666", lineHeight:1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"60px 24px 80px" }}>
        <div style={{ background:"linear-gradient(135deg,#7c3aed11,#a855f711)", border:"1px solid #7c3aed22", borderRadius:20, padding:"48px 32px", maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:32, fontWeight:900, marginBottom:16 }}>Ready to go viral?</h2>
          <p style={{ color:"#666", marginBottom:28, fontSize:15 }}>Join thousands of creators automating their YouTube growth.</p>
          <button className="btn btn-primary" onClick={onGetStarted} style={{ padding:"14px 36px", fontSize:15 }}>Get Started Free →</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid #1e1e3244", padding:"20px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:1 }}>
        <span style={{ fontSize:12, color:"#444" }}>© 2025 ClipForge. All rights reserved.</span>
        <div style={{ display:"flex", gap:20 }}>
          <span style={{ fontSize:12, color:"#444", cursor:"pointer" }}>Privacy Policy</span>
          <span style={{ fontSize:12, color:"#444", cursor:"pointer" }}>About</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage({ onLogin, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (err) {
      setError("Sign in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080810", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Instrument Sans',sans-serif", position:"relative" }}>
      <style>{CSS}</style>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", width:500, height:500, background:"#7c3aed0a", borderRadius:"50%", filter:"blur(100px)", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
      </div>

      <div style={{ width:"100%", maxWidth:400, padding:24, position:"relative", zIndex:1, animation:"fadeUp .4s ease" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:13, marginBottom:24, display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>← Back to home</button>

        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:52, height:52, background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, margin:"0 auto 14px", animation:"glow 3s ease-in-out infinite" }}>⚡</div>
          <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:26, fontWeight:900, background:"linear-gradient(135deg,#c084fc,#e879f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ClipForge</div>
          <div style={{ fontSize:13, color:"#555", marginTop:6 }}>Sign in to your account</div>
        </div>

        <div style={{ background:"#0f0f1a", border:"1px solid #1e1e32", borderRadius:16, padding:28 }}>
          <button onClick={handleGoogle} disabled={loading} style={{ width:"100%", background:"white", border:"none", color:"#222", padding:"13px", borderRadius:10, fontFamily:"inherit", fontSize:14, fontWeight:700, cursor:"pointer", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:10, opacity:loading?0.7:1 }}>
            {loading ? (
              <span style={{ width:18, height:18, border:"2px solid #aaa", borderTopColor:"#333", borderRadius:"50%", display:"inline-block", animation:"spin 1s linear infinite" }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
              </svg>
            )}
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          {error && <div style={{ marginTop:14, color:"#f87171", fontSize:13, textAlign:"center" }}>{error}</div>}

          <div style={{ marginTop:20, fontSize:11, color:"#444", textAlign:"center", lineHeight:1.7 }}>
            By signing in, you agree to our <span style={{ color:"#a855f7", cursor:"pointer" }}>Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
const mockVideos = [
  { id:1, title:"How to Build a SaaS in 2024 — Full Tutorial", duration:"1:24:32", thumbnail:"https://picsum.photos/seed/v1/320/180", shorts:8, status:"done" },
  { id:2, title:"React Advanced Patterns — Deep Dive", duration:"2:10:05", thumbnail:"https://picsum.photos/seed/v2/320/180", shorts:12, status:"done" },
  { id:3, title:"My Morning Routine as a Developer", duration:"0:45:18", thumbnail:"https://picsum.photos/seed/v3/320/180", shorts:4, status:"processing" },
  { id:4, title:"Python Automation for Beginners", duration:"1:55:44", thumbnail:"https://picsum.photos/seed/v4/320/180", shorts:0, status:"queued" },
];

const mockShorts = [
  { id:1, title:"🔥 SaaS secret nobody tells you", caption:"Most devs skip this step...", views:"24.5K", thumb:"https://picsum.photos/seed/s1/120/200" },
  { id:2, title:"React tip that changed everything", caption:"Use this pattern for cleaner code", views:"18.2K", thumb:"https://picsum.photos/seed/s2/120/200" },
  { id:3, title:"How I make $10K/month coding", caption:"My exact stack revealed", views:"52.1K", thumb:"https://picsum.photos/seed/s3/120/200" },
  { id:4, title:"Morning routine = productivity hack", caption:"Wake up at 5am challenge", views:"31.7K", thumb:"https://picsum.photos/seed/s4/120/200" },
];

function Dashboard({ user, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scheduledPerDay, setScheduledPerDay] = useState(4);
  const [notif, setNotif] = useState(null);
  const fileInputRef = useRef(null);

  const showNotif = (msg, type="success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          showNotif(`"${file.name}" uploaded! AI is processing... 🎬`);
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  const tabs = [
    { id:"dashboard", label:"Dashboard", icon:"⚡" },
    { id:"videos", label:"My Videos", icon:"🎬" },
    { id:"shorts", label:"Shorts", icon:"✂️" },
    { id:"schedule", label:"Schedule", icon:"📅" },
    { id:"analytics", label:"Analytics", icon:"📊" },
  ];

  const stats = [
    { label:"Videos Processed", value:"247", change:"+12 this week", icon:"🎬", color:"#c084fc" },
    { label:"Shorts Created", value:"1,840", change:"+94 this week", icon:"✂️", color:"#e879f9" },
    { label:"Total Views", value:"2.4M", change:"+180K this week", icon:"👁️", color:"#818cf8" },
    { label:"Auto-Posted", value:"1,203", change:"+67 this week", icon:"🚀", color:"#34d399" },
  ];

  return (
    <div style={{ fontFamily:"'Instrument Sans',sans-serif", background:"#080810", minHeight:"100vh", color:"#e8e8f0", display:"flex", flexDirection:"column" }}>
      <style>{CSS}</style>

      {notif && <div className={`notif notif-${notif.type}`}>{notif.msg}</div>}
      <input type="file" ref={fileInputRef} accept="video/*" onChange={handleFileSelect} />

      {/* Header */}
      <header style={{ padding:"14px 28px", borderBottom:"1px solid #1e1e3244", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#080810ee", backdropFilter:"blur(16px)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚡</div>
          <div>
            <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:17, fontWeight:900, background:"linear-gradient(135deg,#c084fc,#e879f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ClipForge</div>
          </div>
        </div>

        <nav style={{ display:"flex", gap:2 }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab===t.id?"active":""}`} onClick={() => setActiveTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:7, height:7, background:"#4ade80", borderRadius:"50%", boxShadow:"0 0 6px #4ade80" }} />
            <span style={{ fontSize:12, color:"#555" }}>Live</span>
          </div>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" style={{ width:30, height:30, borderRadius:"50%", border:"2px solid #7c3aed55" }} />
          ) : (
            <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>
              {user?.displayName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <button className="btn btn-danger" onClick={handleLogout} style={{ padding:"6px 12px", fontSize:12 }}>Sign Out</button>
        </div>
      </header>

      <main style={{ flex:1, padding:"24px 28px", maxWidth:1240, margin:"0 auto", width:"100%" }}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="fade-up">
            <div style={{ marginBottom:24 }}>
              <h1 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:24, fontWeight:900 }}>
                Welcome back, {user?.displayName?.split(" ")[0] || "Creator"} 👋
              </h1>
              <p style={{ color:"#555", marginTop:4, fontSize:13 }}>Here's what's happening with your content today.</p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
              {stats.map((s,i) => (
                <div key={i} className="card">
                  <div style={{ fontSize:22, marginBottom:10 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:26, fontWeight:900, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:12, color:"#666", marginTop:2 }}>{s.label}</div>
                  <div style={{ fontSize:11, color:"#4ade80", marginTop:6, fontWeight:600 }}>{s.change}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div className="card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h3 style={{ fontSize:14, fontWeight:700 }}>Upload New Video</h3>
                  {uploadedFile && !uploading && <span style={{ fontSize:11, color:"#4ade80" }}>✓ Ready to process</span>}
                </div>
                {!uploading ? (
                  <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                    <div style={{ fontSize:36, marginBottom:10 }}>🎬</div>
                    <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>
                      {uploadedFile ? uploadedFile.name : "Click to choose a video"}
                    </div>
                    <div style={{ fontSize:12, color:"#555", marginBottom:16 }}>MP4, MOV, AVI · Max 10GB</div>
                    <button className="btn btn-primary" style={{ fontSize:13 }} onClick={e => { e.stopPropagation(); fileInputRef.current.click(); }}>
                      Browse Files
                    </button>
                  </div>
                ) : (
                  <div style={{ padding:"24px 0" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#888", marginBottom:8 }}>
                      <span>Uploading {uploadedFile?.name}...</span>
                      <span style={{ color:"#c084fc", fontWeight:700 }}>{uploadProgress}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width:`${uploadProgress}%` }} /></div>
                    <div style={{ fontSize:11, color:"#555", marginTop:8, textAlign:"center" }}>AI will auto-clip when upload completes</div>
                  </div>
                )}
              </div>

              <div className="card">
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Recent Activity</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {[
                    { icon:"✂️", text:"12 shorts generated from React video", time:"2min ago" },
                    { icon:"🚀", text:"4 videos posted to YouTube", time:"1hr ago" },
                    { icon:"🤖", text:"Captions generated for 8 clips", time:"3hr ago" },
                    { icon:"📊", text:'"SaaS secret" hit 24K views', time:"5hr ago" },
                  ].map((a,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:i<3?"1px solid #1e1e3244":"none" }}>
                      <span style={{ fontSize:16 }}>{a.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, color:"#ccc" }}>{a.text}</div>
                        <div style={{ fontSize:11, color:"#444", marginTop:2 }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIDEOS */}
        {activeTab === "videos" && (
          <div className="fade-up">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:20, fontWeight:900 }}>My Videos</h2>
              <button className="btn btn-primary" style={{ fontSize:13 }} onClick={() => fileInputRef.current.click()}>+ Upload Video</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {mockVideos.map(v => (
                <div key={v.id} className="card" style={{ display:"flex", alignItems:"center", gap:16, padding:16 }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <img src={v.thumbnail} alt="" style={{ width:130, height:74, borderRadius:8, objectFit:"cover" }} />
                    <div style={{ position:"absolute", bottom:5, right:5, background:"#000b", color:"white", fontSize:10, fontWeight:700, padding:"2px 5px", borderRadius:4 }}>{v.duration}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, marginBottom:6, color:"#e8e8f0" }}>{v.title}</div>
                    <div style={{ fontSize:12, color:"#555" }}>✂️ {v.shorts > 0 ? `${v.shorts} shorts generated` : "Not processed yet"}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span className={`status status-${v.status}`}>{v.status}</span>
                    {v.status==="done" && <button className="btn btn-ghost" style={{ fontSize:12 }} onClick={() => { setActiveTab("shorts"); showNotif("Viewing shorts..."); }}>View Shorts</button>}
                    {v.status==="queued" && <button className="btn btn-primary" style={{ fontSize:12 }} onClick={() => showNotif("Processing started! 🚀")}>Process Now</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHORTS */}
        {activeTab === "shorts" && (
          <div className="fade-up">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:20, fontWeight:900 }}>Generated Shorts</h2>
              <span style={{ fontSize:12, color:"#555" }}>{mockShorts.length} clips ready</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {mockShorts.map(s => (
                <div key={s.id} className="card" style={{ padding:0, overflow:"hidden" }}>
                  <div style={{ position:"relative" }}>
                    <img src={s.thumb} alt="" style={{ width:"100%", height:170, objectFit:"cover" }} />
                    <div style={{ position:"absolute", top:8, right:8, background:"#000b", color:"white", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:20 }}>👁️ {s.views}</div>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,#0f0f1aee 30%,transparent)" }} />
                  </div>
                  <div style={{ padding:14 }}>
                    <div style={{ fontSize:13, fontWeight:700, marginBottom:5, lineHeight:1.4, color:"#e8e8f0" }}>{s.title}</div>
                    <div style={{ fontSize:11, color:"#555", marginBottom:12 }}>{s.caption}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
                      <button className="btn btn-ghost" style={{ fontSize:11, padding:"7px" }} onClick={() => showNotif("Opening editor...")}>Edit</button>
                      <button className="btn btn-primary" style={{ fontSize:11, padding:"7px" }} onClick={() => showNotif("Posted to YouTube! 🚀")}>Post Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {activeTab === "schedule" && (
          <div className="fade-up">
            <h2 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:20, fontWeight:900, marginBottom:20 }}>Auto-Post Schedule</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div className="card">
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:20 }}>⚙️ Automation Settings</h3>
                <div style={{ marginBottom:22 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <label style={{ fontSize:13, color:"#888" }}>Videos per day</label>
                    <span style={{ color:"#c084fc", fontWeight:800, fontSize:20, fontFamily:"'Cabinet Grotesk',sans-serif" }}>{scheduledPerDay}</span>
                  </div>
                  <input type="range" min="1" max="10" value={scheduledPerDay} className="slider" style={{ "--val":scheduledPerDay }} onChange={e => setScheduledPerDay(+e.target.value)} />
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:13, color:"#888", display:"block", marginBottom:10 }}>Platform</label>
                  <div style={{ padding:"12px 16px", borderRadius:8, background:"#ff000015", border:"1px solid #ff000033", color:"#ff6666", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:18 }}>▶️</span> YouTube Only
                  </div>
                </div>
                <div style={{ marginBottom:22 }}>
                  <label style={{ fontSize:13, color:"#888", display:"block", marginBottom:10 }}>Best posting times</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {["9:00 AM","12:00 PM","5:00 PM","8:00 PM"].map((t,i) => (
                      <div key={i} style={{ background:"#1a1a2e", border:"1px solid #7c3aed22", borderRadius:8, padding:"9px 12px", fontSize:12, color:"#c084fc", fontWeight:600 }}>🕐 {t}</div>
                    ))}
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width:"100%", padding:"12px" }} onClick={() => showNotif(`Automation saved! ${scheduledPerDay} videos/day 🚀`)}>
                  Save & Activate
                </button>
              </div>

              <div className="card">
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:20 }}>📅 This Week's Queue</h3>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day,i) => (
                  <div key={day} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:i<6?"1px solid #1e1e3244":"none" }}>
                    <span style={{ fontSize:12, color:"#444", width:32 }}>{day}</span>
                    <div style={{ flex:1, display:"flex", gap:4 }}>
                      {Array.from({ length:scheduledPerDay }).map((_,j) => (
                        <div key={j} style={{ height:18, flex:1, borderRadius:3, background:i<3?"linear-gradient(135deg,#7c3aed,#a855f7)":"#1e1e30" }} />
                      ))}
                    </div>
                    <span style={{ fontSize:11, color:i<3?"#4ade80":"#444", fontWeight:600 }}>{i<3?"✓ Posted":"Queued"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="fade-up">
            <h2 style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:20, fontWeight:900, marginBottom:20 }}>Analytics</h2>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:16 }}>
              <div className="card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <h3 style={{ fontSize:14, fontWeight:700 }}>Views This Week</h3>
                  <div style={{ display:"flex", gap:6 }}>
                    {["7D","30D","90D"].map(r => (
                      <button key={r} className="btn btn-ghost" style={{ padding:"4px 10px", fontSize:11 }}>{r}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:130 }}>
                  {[45,72,58,90,120,88,134].map((h,i) => (
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                      <div className="chart-bar" style={{ width:"100%", height:`${(h/134)*110}px` }} />
                      <span style={{ fontSize:10, color:"#444" }}>{["M","T","W","T","F","S","S"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Platform</h3>
                <div style={{ display:"flex", alignItems:"center", gap:14, padding:16, background:"#ff000011", border:"1px solid #ff000033", borderRadius:10 }}>
                  <span style={{ fontSize:28 }}>▶️</span>
                  <div>
                    <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:22, fontWeight:900, color:"#ff6666" }}>100%</div>
                    <div style={{ fontSize:12, color:"#666" }}>YouTube</div>
                  </div>
                </div>
                <div style={{ marginTop:14, padding:12, background:"#7c3aed08", border:"1px solid #7c3aed22", borderRadius:8 }}>
                  <div style={{ fontSize:12, color:"#666", lineHeight:1.7 }}>All content is automatically published to YouTube on your schedule.</div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Top Performing Shorts</h3>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid #1e1e3244" }}>
                    {["Title","Views","Likes","CTR","Status"].map(h => (
                      <th key={h} style={{ textAlign:"left", padding:"8px 12px", fontSize:11, color:"#444", fontWeight:700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title:"How I make $10K/month coding", views:"52.1K", likes:"4.2K", ctr:"8.4%", status:"🔥 Viral" },
                    { title:"Morning routine = productivity", views:"31.7K", likes:"2.8K", ctr:"6.1%", status:"📈 Growing" },
                    { title:"🔥 SaaS secret nobody tells you", views:"24.5K", likes:"1.9K", ctr:"5.7%", status:"📈 Growing" },
                    { title:"React tip that changed my life", views:"18.2K", likes:"1.4K", ctr:"4.2%", status:"✅ Stable" },
                  ].map((row,i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #0f0f1a" }}>
                      <td style={{ padding:"11px 12px", fontSize:13, color:"#ccc" }}>{row.title}</td>
                      <td style={{ padding:"11px 12px", fontSize:13, fontWeight:700, color:"#c084fc" }}>{row.views}</td>
                      <td style={{ padding:"11px 12px", fontSize:13, color:"#666" }}>{row.likes}</td>
                      <td style={{ padding:"11px 12px", fontSize:13, color:"#4ade80", fontWeight:700 }}>{row.ctr}</td>
                      <td style={{ padding:"11px 12px", fontSize:13 }}>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid #1e1e3244", padding:"14px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:11, color:"#333" }}>© 2025 ClipForge. All rights reserved.</span>
        <div style={{ display:"flex", gap:16 }}>
          <button onClick={() => onNavigate("about")} style={{ background:"none", border:"none", color:"#444", fontFamily:"inherit", fontSize:11, cursor:"pointer" }}>About</button>
          <button onClick={() => onNavigate("privacy")} style={{ background:"none", border:"none", color:"#444", fontFamily:"inherit", fontSize:11, cursor:"pointer" }}>Privacy Policy</button>
        </div>
      </footer>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("landing");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setScreen("app");
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#080810", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:36, height:36, border:"3px solid #7c3aed", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (screen === "landing") return <LandingPage onGetStarted={() => setScreen("auth")} />;
  if (screen === "auth") return <AuthPage onLogin={(u) => { setUser(u); setScreen("app"); }} onBack={() => setScreen("landing")} />;
  if (!user) return <LandingPage onGetStarted={() => setScreen("auth")} />;
  return <Dashboard user={user} onLogout={() => { setUser(null); setScreen("landing"); }} onNavigate={setScreen} />;
}