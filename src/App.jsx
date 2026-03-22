import { useState, useEffect } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// ─── Auth Page ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (err) {
      setError("فشل تسجيل الدخول. حاول مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans','Segoe UI',sans-serif", position: "relative", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .google-btn { width:100%; background:#fff; border:none; color:#222; padding:14px; border-radius:12px; font-family:inherit; font-size:15px; font-weight:700; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:12px; box-shadow:0 2px 12px #0004; }
        .google-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px #0006; }
        .google-btn:disabled { opacity:.6; cursor:not-allowed; }
        .orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
      `}</style>

      <div className="orb" style={{ width:400, height:400, background:"#7c3aed18", top:-100, right:-100, animation:"float 8s ease-in-out infinite" }} />
      <div className="orb" style={{ width:300, height:300, background:"#a855f712", bottom:-80, left:-80, animation:"float 10s ease-in-out infinite reverse" }} />

      <div style={{ width:"100%", maxWidth:400, padding:24, animation:"fadeUp .5s ease" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:60, height:60, background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 16px" }}>⚡</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, background:"linear-gradient(135deg,#c084fc,#e879f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ClipForge</div>
          <div style={{ fontSize:14, color:"#555", marginTop:6 }}>AI Video Automation for YouTube</div>
        </div>

        <div style={{ background:"#111118", border:"1px solid #1e1e30", borderRadius:20, padding:32 }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:16, fontWeight:600, color:"#e8e8f0", marginBottom:8 }}>مرحباً بك! 👋</div>
            <div style={{ fontSize:13, color:"#666" }}>سجّل دخولك بحساب Google ديالك</div>
          </div>

          <button className="google-btn" onClick={handleGoogle} disabled={loading}>
            {loading ? (
              <span style={{ width:20, height:20, border:"3px solid #aaa", borderTopColor:"#333", borderRadius:"50%", display:"inline-block", animation:"spin 1s linear infinite" }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
              </svg>
            )}
            {loading ? "جاري تسجيل الدخول..." : "Continue with Google"}
          </button>

          {error && <div style={{ marginTop:16, color:"#f87171", fontSize:13, textAlign:"center" }}>{error}</div>}

          <div style={{ marginTop:24, fontSize:11, color:"#444", textAlign:"center", lineHeight:1.7 }}>
            بتسجيل الدخول، أنت توافق على{" "}
            <span style={{ color:"#a855f7", cursor:"pointer" }}>سياسة الخصوصية</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Privacy Page ─────────────────────────────────────────────────────────────
function PrivacyPage({ onBack }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", color:"#e8e8f0", fontFamily:"'DM Sans',sans-serif", padding:"40px 24px" }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>
        <button onClick={onBack} style={{ background:"none", border:"1px solid #2a2a45", color:"#888", padding:"8px 16px", borderRadius:8, fontFamily:"inherit", fontSize:13, cursor:"pointer", marginBottom:32 }}>← رجوع</button>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, marginBottom:8, background:"linear-gradient(135deg,#c084fc,#e879f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>سياسة الخصوصية</div>
        <div style={{ fontSize:13, color:"#555", marginBottom:40 }}>آخر تحديث: {new Date().toLocaleDateString("ar")}</div>
        {[
          { title:"1. المعلومات التي نجمعها", body:"نجمع المعلومات التي تقدمها مباشرة عند تسجيل الدخول بحساب Google، مثل اسمك وعنوان بريدك الإلكتروني وصورتك الشخصية." },
          { title:"2. كيف نستخدم معلوماتك", body:"نستخدم المعلومات لتوفير الخدمة وتحسينها، وإرسال إشعارات تتعلق بحسابك، وتحليل أنماط الاستخدام لتحسين تجربتك." },
          { title:"3. بيانات الفيديو", body:"مقاطع الفيديو التي ترفعها تُعالج فقط لغرض إنشاء مقاطع قصيرة. لا نشارك محتوى الفيديو الخام مع أطراف ثالثة." },
          { title:"4. أمان البيانات", body:"نطبق تدابير تقنية وتنظيمية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف." },
          { title:"5. حقوقك", body:"يحق لك الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها في أي وقت عبر إعدادات حسابك." },
          { title:"6. تواصل معنا", body:"إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك التواصل مع مالك المنصة مباشرة." },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom:28 }}>
            <div style={{ fontSize:16, fontWeight:700, color:"#c084fc", marginBottom:8 }}>{s.title}</div>
            <div style={{ fontSize:14, color:"#888", lineHeight:1.8 }}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────
function AboutPage({ onBack }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", color:"#e8e8f0", fontFamily:"'DM Sans',sans-serif", padding:"40px 24px" }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>
        <button onClick={onBack} style={{ background:"none", border:"1px solid #2a2a45", color:"#888", padding:"8px 16px", borderRadius:8, fontFamily:"inherit", fontSize:13, cursor:"pointer", marginBottom:32 }}>← رجوع</button>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ width:72, height:72, background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px" }}>⚡</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800, background:"linear-gradient(135deg,#c084fc,#e879f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ClipForge</div>
          <div style={{ fontSize:16, color:"#666", marginTop:8 }}>منصة أتمتة الفيديو بالذكاء الاصطناعي</div>
        </div>
        <div style={{ background:"#111118", border:"1px solid #1e1e30", borderRadius:18, padding:32, marginBottom:24 }}>
          <div style={{ fontSize:18, fontWeight:700, marginBottom:14 }}>مهمتنا</div>
          <div style={{ fontSize:15, color:"#888", lineHeight:1.9 }}>ClipForge صُمِّم لمساعدة صنّاع المحتوى على تحويل فيديوهاتهم الطويلة إلى مقاطع قصيرة جاهزة للنشر على YouTube تلقائياً، بدون قضاء ساعات في المونتاج.</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:24 }}>
          {[
            { icon:"🤖", title:"ذكاء اصطناعي", desc:"يجد أفضل اللحظات تلقائياً" },
            { icon:"✂️", title:"قطع تلقائي", desc:"يقطع الفيديو ويضيف captions" },
            { icon:"📊", title:"تحليلات", desc:"تتبع الأداء وانمو بالبيانات" },
          ].map((f, i) => (
            <div key={i} style={{ background:"#111118", border:"1px solid #1e1e30", borderRadius:14, padding:20, textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:10 }}>{f.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>{f.title}</div>
              <div style={{ fontSize:12, color:"#666", lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#111118", border:"1px solid #1e1e30", borderRadius:18, padding:32 }}>
          <div style={{ fontSize:18, fontWeight:700, marginBottom:20 }}>تواصل مع المالك</div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, background:"#7c3aed22", border:"1px solid #7c3aed44", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📧</div>
              <div>
                <div style={{ fontSize:12, color:"#555", marginBottom:2 }}>البريد الإلكتروني</div>
                <div style={{ fontSize:14, color:"#c084fc", fontWeight:600 }}>YOUR_EMAIL@gmail.com</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, background:"#7c3aed22", border:"1px solid #7c3aed44", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📱</div>
              <div>
                <div style={{ fontSize:12, color:"#555", marginBottom:2 }}>الهاتف / WhatsApp</div>
                <div style={{ fontSize:14, color:"#c084fc", fontWeight:600 }}>YOUR_PHONE_NUMBER</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const mockVideos = [
  { id:1, title:"How to Build a SaaS in 2024", duration:"1:24:32", thumbnail:"https://picsum.photos/seed/v1/320/180", shorts:8, status:"done" },
  { id:2, title:"React Advanced Patterns", duration:"2:10:05", thumbnail:"https://picsum.photos/seed/v2/320/180", shorts:12, status:"done" },
  { id:3, title:"My Morning Routine", duration:"0:45:18", thumbnail:"https://picsum.photos/seed/v3/320/180", shorts:4, status:"processing" },
  { id:4, title:"Python Automation Basics", duration:"1:55:44", thumbnail:"https://picsum.photos/seed/v4/320/180", shorts:0, status:"queued" },
];

const mockShorts = [
  { id:1, title:"🔥 SaaS secret nobody tells you", caption:"Most devs skip this step...", views:"24.5K", thumb:"https://picsum.photos/seed/s1/120/200" },
  { id:2, title:"React tip that changed my life", caption:"Use this pattern for cleaner code", views:"18.2K", thumb:"https://picsum.photos/seed/s2/120/200" },
  { id:3, title:"How I make $10K/month coding", caption:"My exact stack revealed", views:"52.1K", thumb:"https://picsum.photos/seed/s3/120/200" },
  { id:4, title:"Morning routine = productivity hack", caption:"Wake up at 5am challenge", views:"31.7K", thumb:"https://picsum.photos/seed/s4/120/200" },
];

function ClipForge({ user, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scheduledPerDay, setScheduledPerDay] = useState(4);
  const [notification, setNotification] = useState(null);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) { clearInterval(interval); setUploading(false); showNotif("تم رفع الفيديو! 🎬"); return 0; }
        return p + 5;
      });
    }, 120);
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
    { label:"Videos Processed", value:"247", change:"+12 this week", icon:"🎬" },
    { label:"Shorts Created", value:"1,840", change:"+94 this week", icon:"✂️" },
    { label:"Total Views", value:"2.4M", change:"+180K this week", icon:"👁️" },
    { label:"Auto-Posted", value:"1,203", change:"+67 this week", icon:"🚀" },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#0a0a0f", minHeight:"100vh", color:"#e8e8f0", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#0a0a0f; }
        ::-webkit-scrollbar-thumb { background:#2a2a3f; border-radius:4px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideIn { from{transform:translateY(-10px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .tab-btn { background:none; border:none; cursor:pointer; padding:10px 18px; border-radius:10px; font-family:inherit; font-size:14px; font-weight:500; transition:all .2s; display:flex; align-items:center; gap:8px; color:#888; }
        .tab-btn:hover { background:#1a1a2e; color:#e8e8f0; }
        .tab-btn.active { background:linear-gradient(135deg,#7c3aed22,#a855f722); color:#c084fc; border:1px solid #7c3aed44; }
        .card { background:#111118; border:1px solid #1e1e30; border-radius:16px; padding:20px; transition:border-color .2s; }
        .card:hover { border-color:#2a2a45; }
        .btn-primary { background:linear-gradient(135deg,#7c3aed,#a855f7); border:none; color:white; padding:10px 20px; border-radius:10px; font-family:inherit; font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; }
        .btn-primary:hover { transform:translateY(-1px); box-shadow:0 8px 24px #7c3aed44; }
        .btn-ghost { background:#1a1a2e; border:1px solid #2a2a45; color:#aaa; padding:8px 16px; border-radius:8px; font-family:inherit; font-size:13px; cursor:pointer; transition:all .2s; }
        .btn-ghost:hover { border-color:#7c3aed; color:#c084fc; }
        .status-done { color:#4ade80; background:#4ade8011; border:1px solid #4ade8033; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
        .status-processing { color:#fbbf24; background:#fbbf2411; border:1px solid #fbbf2433; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; animation:pulse 1.5s infinite; }
        .status-queued { color:#60a5fa; background:#60a5fa11; border:1px solid #60a5fa33; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
        .upload-zone { border:2px dashed #2a2a45; border-radius:16px; padding:40px; text-align:center; cursor:pointer; transition:all .2s; }
        .upload-zone:hover { border-color:#7c3aed; background:#7c3aed08; }
        .progress-bar { height:6px; background:#1e1e30; border-radius:3px; overflow:hidden; }
        .progress-fill { height:100%; background:linear-gradient(90deg,#7c3aed,#a855f7,#7c3aed); background-size:200% auto; animation:shimmer 1.5s linear infinite; border-radius:3px; transition:width .3s; }
        .notif { position:fixed; top:20px; right:20px; padding:14px 20px; border-radius:12px; font-size:14px; font-weight:500; z-index:999; animation:slideIn .3s ease; }
        .notif.success { background:#4ade8022; border:1px solid #4ade8055; color:#4ade80; }
        .slider { -webkit-appearance:none; width:100%; height:6px; border-radius:3px; background:linear-gradient(to right,#7c3aed 0%,#7c3aed calc(var(--val)*100%/10),#2a2a45 calc(var(--val)*100%/10)); outline:none; cursor:pointer; }
        .slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#a855f7; cursor:pointer; }
        .chart-bar { background:linear-gradient(to top,#7c3aed,#a855f7); border-radius:4px 4px 0 0; }
      `}</style>

      {notification && <div className={`notif ${notification.type}`}>{notification.msg}</div>}

      {/* Header */}
      <header style={{ padding:"16px 28px", borderBottom:"1px solid #1e1e30", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#0a0a0fdd", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, background:"linear-gradient(135deg,#c084fc,#e879f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ClipForge</div>
            <div style={{ fontSize:11, color:"#555", marginTop:-2 }}>AI Video Automation</div>
          </div>
        </div>
        <nav style={{ display:"flex", gap:4 }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab===t.id?"active":""}`} onClick={() => setActiveTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:8, height:8, background:"#4ade80", borderRadius:"50%", boxShadow:"0 0 8px #4ade80" }} />
          <span style={{ fontSize:13, color:"#888" }}>Live</span>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" style={{ width:34, height:34, borderRadius:"50%", border:"2px solid #7c3aed" }} />
          ) : (
            <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700 }}>
              {user?.displayName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <button onClick={handleLogout} className="btn-ghost" style={{ fontSize:12, padding:"6px 12px" }}>خروج</button>
        </div>
      </header>

      <main style={{ flex:1, padding:"28px", maxWidth:1200, margin:"0 auto", width:"100%" }}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ marginBottom:28 }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800 }}>
                مرحباً {user?.displayName?.split(" ")[0] || "بك"} 👋
              </h1>
              <p style={{ color:"#666", marginTop:4, fontSize:14 }}>هاد شنو كيوقع مع المحتوى ديالك اليوم.</p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
              {stats.map((s, i) => (
                <div key={i} className="card">
                  <div style={{ fontSize:24, marginBottom:10 }}>{s.icon}</div>
                  <div style={{ fontSize:28, fontWeight:700, fontFamily:"'Syne',sans-serif", background:"linear-gradient(135deg,#c084fc,#e879f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.value}</div>
                  <div style={{ fontSize:13, color:"#888", marginTop:2 }}>{s.label}</div>
                  <div style={{ fontSize:11, color:"#4ade80", marginTop:6 }}>{s.change}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              <div className="card">
                <h3 style={{ fontSize:15, fontWeight:600, marginBottom:16 }}>رفع فيديو جديد</h3>
                {!uploading ? (
                  <div className="upload-zone" onClick={handleUpload}>
                    <div style={{ fontSize:40, marginBottom:12 }}>🎬</div>
                    <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>حط الفيديو هنا</div>
                    <div style={{ fontSize:13, color:"#555" }}>MP4, MOV, AVI • Max 10GB</div>
                    <button className="btn-primary" style={{ marginTop:16 }} onClick={e => { e.stopPropagation(); handleUpload(); }}>اختر ملف</button>
                  </div>
                ) : (
                  <div style={{ padding:20, textAlign:"center" }}>
                    <div style={{ fontSize:13, color:"#888", marginBottom:12 }}>جاري الرفع... {uploadProgress}%</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width:`${uploadProgress}%` }} /></div>
                    <div style={{ fontSize:12, color:"#555", marginTop:8 }}>AI غادي يقطع تلقائياً</div>
                  </div>
                )}
              </div>

              <div className="card">
                <h3 style={{ fontSize:15, fontWeight:600, marginBottom:16 }}>النشاط الأخير</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { icon:"✂️", text:"12 shorts تولدت من فيديو React", time:"منذ 2 دقيقة" },
                    { icon:"🚀", text:"4 فيديوهات نُشرت على YouTube", time:"منذ ساعة" },
                    { icon:"🤖", text:"Captions تولدت لـ 8 مقاطع", time:"منذ 3 ساعات" },
                    { icon:"📊", text:'"SaaS secret" وصل 24K مشاهدة', time:"منذ 5 ساعات" },
                  ].map((a, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<3?"1px solid #1e1e30":"none" }}>
                      <span style={{ fontSize:18 }}>{a.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, color:"#ccc" }}>{a.text}</div>
                        <div style={{ fontSize:11, color:"#555", marginTop:2 }}>{a.time}</div>
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
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>فيديوهاتي</h2>
              <button className="btn-primary" onClick={handleUpload}>+ رفع فيديو</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {mockVideos.map(v => (
                <div key={v.id} className="card" style={{ display:"flex", alignItems:"center", gap:18 }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <img src={v.thumbnail} alt="" style={{ width:140, height:80, borderRadius:10, objectFit:"cover" }} />
                    <div style={{ position:"absolute", bottom:6, right:6, background:"#000000cc", color:"white", fontSize:11, fontWeight:700, padding:"2px 6px", borderRadius:4 }}>{v.duration}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>{v.title}</div>
                    <div style={{ fontSize:13, color:"#666" }}>✂️ {v.shorts > 0 ? `${v.shorts} shorts` : "لم يُعالج بعد"}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span className={`status-${v.status}`}>{v.status}</span>
                    {v.status==="done" && <button className="btn-ghost" onClick={() => showNotif("فتح محرر الـ shorts...")}>عرض Shorts</button>}
                    {v.status==="queued" && <button className="btn-primary" onClick={() => showNotif("بدأت المعالجة! 🚀")}>معالجة الآن</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHORTS */}
        {activeTab === "shorts" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>Shorts المولّدة</h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {mockShorts.map(s => (
                <div key={s.id} className="card" style={{ padding:0, overflow:"hidden" }}>
                  <div style={{ position:"relative" }}>
                    <img src={s.thumb} alt="" style={{ width:"100%", height:180, objectFit:"cover" }} />
                    <div style={{ position:"absolute", top:10, right:10, background:"#000000bb", color:"white", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:20 }}>👁️ {s.views}</div>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,#111118ee,transparent 60%)" }} />
                  </div>
                  <div style={{ padding:14 }}>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:6, lineHeight:1.4 }}>{s.title}</div>
                    <div style={{ fontSize:12, color:"#666", marginBottom:12 }}>{s.caption}</div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="btn-ghost" style={{ flex:1, fontSize:12 }} onClick={() => showNotif("تعديل الـ caption...")}>تعديل</button>
                      <button className="btn-primary" style={{ flex:1, fontSize:12 }} onClick={() => showNotif("تم النشر! 🚀")}>نشر الآن</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {activeTab === "schedule" && (
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, marginBottom:24 }}>جدول النشر التلقائي</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              <div className="card">
                <h3 style={{ fontSize:15, fontWeight:600, marginBottom:20 }}>⚙️ إعدادات الأتمتة</h3>
                <div style={{ marginBottom:24 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                    <label style={{ fontSize:14, color:"#aaa" }}>عدد الفيديوهات في اليوم</label>
                    <span style={{ color:"#c084fc", fontWeight:700, fontSize:18 }}>{scheduledPerDay}</span>
                  </div>
                  <input type="range" min="1" max="10" value={scheduledPerDay} className="slider" style={{ "--val":scheduledPerDay }} onChange={e => setScheduledPerDay(+e.target.value)} />
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:14, color:"#aaa", display:"block", marginBottom:12 }}>المنصة</label>
                  <div style={{ padding:"12px 16px", borderRadius:8, background:"#ff000022", border:"1px solid #ff000044", color:"#ff6666", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:20 }}>▶️</span> YouTube
                  </div>
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:14, color:"#aaa", display:"block", marginBottom:12 }}>أوقات النشر المثلى</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {["9:00 ص","12:00 ظ","5:00 م","8:00 م"].map((t,i) => (
                      <div key={i} style={{ background:"#1a1a2e", border:"1px solid #7c3aed33", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#c084fc", fontWeight:600 }}>🕐 {t}</div>
                    ))}
                  </div>
                </div>
                <button className="btn-primary" style={{ width:"100%" }} onClick={() => showNotif(`تم الحفظ! ${scheduledPerDay} فيديوهات/يوم 🚀`)}>
                  حفظ وتفعيل الأتمتة
                </button>
              </div>

              <div className="card">
                <h3 style={{ fontSize:15, fontWeight:600, marginBottom:20 }}>📅 قائمة هذا الأسبوع</h3>
                {["الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت","الأحد"].map((day,i) => (
                  <div key={day} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<6?"1px solid #1a1a2a":"none" }}>
                    <span style={{ fontSize:12, color:"#555", width:60 }}>{day}</span>
                    <div style={{ flex:1, display:"flex", gap:4 }}>
                      {Array.from({ length:scheduledPerDay }).map((_,j) => (
                        <div key={j} style={{ height:20, flex:1, borderRadius:4, background:i<3?"linear-gradient(135deg,#7c3aed,#a855f7)":"#1e1e30" }} />
                      ))}
                    </div>
                    <span style={{ fontSize:12, color:i<3?"#4ade80":"#555" }}>{i<3?"✓ نُشر":"في الانتظار"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, marginBottom:24 }}>التحليلات</h2>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20, marginBottom:20 }}>
              <div className="card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                  <h3 style={{ fontSize:15, fontWeight:600 }}>المشاهدات هذا الأسبوع</h3>
                  <div style={{ display:"flex", gap:8 }}>
                    {["7 أيام","30 يوم","90 يوم"].map(r => (
                      <button key={r} className="btn-ghost" style={{ padding:"4px 12px", fontSize:12 }}>{r}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:140 }}>
                  {[45,72,58,90,120,88,134].map((h,i) => (
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <div className="chart-bar" style={{ width:"100%", height:`${(h/134)*120}px` }} />
                      <span style={{ fontSize:11, color:"#444" }}>{["إ","ث","أ","خ","ج","س","أح"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontSize:15, fontWeight:600, marginBottom:20 }}>YouTube فقط</h3>
                <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px", background:"#ff000011", border:"1px solid #ff000033", borderRadius:12 }}>
                  <span style={{ fontSize:32 }}>▶️</span>
                  <div>
                    <div style={{ fontSize:18, fontWeight:700, color:"#ff6666" }}>100%</div>
                    <div style={{ fontSize:13, color:"#888" }}>YouTube</div>
                  </div>
                </div>
                <div style={{ marginTop:16, fontSize:13, color:"#666", lineHeight:1.7 }}>
                  كل المحتوى ديالك كينشر على YouTube تلقائياً حسب الجدول.
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize:15, fontWeight:600, marginBottom:16 }}>أفضل Shorts أداءً</h3>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid #1e1e30" }}>
                    {["العنوان","المشاهدات","الإعجابات","CTR","الحالة"].map(h => (
                      <th key={h} style={{ textAlign:"left", padding:"8px 12px", fontSize:12, color:"#555", fontWeight:600 }}>{h}</th>
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
                    <tr key={i} style={{ borderBottom:"1px solid #111118" }}>
                      <td style={{ padding:"12px", fontSize:13, color:"#ccc" }}>{row.title}</td>
                      <td style={{ padding:"12px", fontSize:13, fontWeight:600, color:"#c084fc" }}>{row.views}</td>
                      <td style={{ padding:"12px", fontSize:13, color:"#888" }}>{row.likes}</td>
                      <td style={{ padding:"12px", fontSize:13, color:"#4ade80", fontWeight:600 }}>{row.ctr}</td>
                      <td style={{ padding:"12px", fontSize:13 }}>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid #1e1e30", padding:"16px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:12, color:"#444" }}>© 2025 ClipForge. جميع الحقوق محفوظة.</div>
        <div style={{ display:"flex", gap:20 }}>
          <button onClick={() => onNavigate("about")} style={{ background:"none", border:"none", color:"#555", fontFamily:"inherit", fontSize:12, cursor:"pointer" }}>من نحن</button>
          <button onClick={() => onNavigate("privacy")} style={{ background:"none", border:"none", color:"#555", fontFamily:"inherit", fontSize:12, cursor:"pointer" }}>سياسة الخصوصية</button>
          <button onClick={handleLogout} style={{ background:"none", border:"none", color:"#a855f7", fontFamily:"inherit", fontSize:12, cursor:"pointer" }}>تسجيل الخروج</button>
        </div>
      </footer>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("auth");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setScreen(u ? "app" : "auth");
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:"3px solid #7c3aed", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (screen === "privacy") return <PrivacyPage onBack={() => setScreen("app")} />;
  if (screen === "about") return <AboutPage onBack={() => setScreen("app")} />;
  if (screen === "auth" || !user) return <AuthPage onLogin={(u) => { setUser(u); setScreen("app"); }} />;
  return <ClipForge user={user} onLogout={() => { setUser(null); setScreen("auth"); }} onNavigate={setScreen} />;
}