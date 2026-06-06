import { useState, useRef, useEffect } from "react";
import Head from "next/head";

const MODES = [
  { id: "analyze", label: "تحليل القضية", icon: "⚖️", color: "#C9A84C",
    placeholder: "اكتب وقائع القضية بالتفصيل...\n\nمثال: موكلي اشترى عقاراً وسدد كامل الثمن لكن البائع رفض تسليم المستندات..." },
  { id: "draft", label: "صياغة الدعوى", icon: "📜", color: "#7B9E87",
    placeholder: "اذكر نوع الدعوى وأطرافها والوقائع الأساسية..." },
  { id: "contract", label: "تحليل العقد", icon: "📋", color: "#8B7355",
    placeholder: "الصق نص العقد أو اكتب بنوده الرئيسية للتحليل..." },
  { id: "search", label: "البحث القانوني", icon: "🔍", color: "#4A7FA5",
    placeholder: "ما الموضوع القانوني الذي تريد البحث عنه؟\n\nمثال: ما هي شروط صحة عقد البيع في القانون المدني العراقي؟" },
  { id: "defense", label: "اقتراح الدفوع", icon: "🛡️", color: "#8B4545",
    placeholder: "اكتب ملخص الاتهام أو الادعاء الموجه..." },
];

const QUICK = [
  { q: "ما هي مدة التقادم في الدعاوى المدنية العراقية؟", mode: "search" },
  { q: "شروط صحة عقد الزواج في قانون الأحوال الشخصية رقم 188 لسنة 1959", mode: "search" },
  { q: "كيف يتم توزيع الإرث في القانون العراقي؟", mode: "search" },
  { q: "حقوق العامل عند إنهاء الخدمة في قانون العمل العراقي", mode: "search" },
];

export default function Home() {
  const [mode, setMode] = useState("analyze");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef(null);

  const currentMode = MODES.find((m) => m.id === mode);
  const accent = currentMode?.color || "#C9A84C";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text = input, sendMode = mode) => {
    if (!text.trim() || loading) return;
    setInput("");
    const userMsg = { role: "user", content: text.trim(), mode: sendMode };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), mode: sendMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setMessages((p) => [...p, { role: "ai", content: data.result, mode: sendMode }]);
    } catch (e) {
      setMessages((p) => [...p, { role: "ai", content: `⚠️ خطأ: ${e.message}`, mode: sendMode }]);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h3>$1</h3>")
      .replace(/^- (.*$)/gm, "<li>$1</li>")
      .replace(/^(\d+)\. (.*$)/gm, "<li>$2</li>")
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");

  return (
    <>
      <Head>
        <title>ميزان — المساعد القانوني العراقي</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0D0D0D; font-family: 'Amiri','Noto Naskh Arabic',serif; color: #E8DFC8; direction: rtl; overflow: hidden; height: 100vh; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .msg-in { animation: fadeUp 0.35s ease; }
        .dot { width:7px; height:7px; border-radius:50%; animation: pulse 1.2s infinite; }
        .dot:nth-child(2){animation-delay:.2s} .dot:nth-child(3){animation-delay:.4s}
        h3 { color: #C9A84C; margin: 10px 0 5px; font-size: 0.93rem; }
        strong { color: #D4B87A; }
        li { margin-bottom: 4px; line-height: 1.75; margin-right: 16px; }
        a { color: #C9A84C; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ── SIDEBAR ── */}
        {sidebarOpen && (
          <div style={{ width: 255, minWidth: 255, background: "#111", borderLeft: "1px solid #1c1c1c", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Logo */}
            <div style={{ padding: "18px 18px 16px", borderBottom: "1px solid #1c1c1c", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${accent},${accent}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚖️</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>ميزان</div>
                <div style={{ fontSize: "0.6rem", color: "#555" }}>المساعد القانوني العراقي</div>
              </div>
            </div>

            {/* Modes */}
            <div style={{ padding: "12px 10px 0" }}>
              <div style={{ fontSize: "0.6rem", color: "#444", letterSpacing: 1, padding: "0 6px 6px" }}>وضع العمل</div>
              {MODES.map((m) => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  width: "100%", background: mode === m.id ? `${m.color}18` : "transparent",
                  border: "none", borderRight: `3px solid ${mode === m.id ? m.color : "transparent"}`,
                  color: mode === m.id ? m.color : "#666", padding: "9px 12px",
                  textAlign: "right", display: "flex", alignItems: "center", gap: 8,
                  fontSize: "0.83rem", cursor: "pointer", borderRadius: "0 0 0 8px",
                  marginBottom: 2, transition: "all .2s", fontFamily: "inherit",
                }}>
                  <span>{m.icon}</span><span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Quick */}
            <div style={{ padding: "14px 10px 0", flex: 1, overflow: "auto" }}>
              <div style={{ fontSize: "0.6rem", color: "#444", letterSpacing: 1, padding: "0 6px 6px" }}>أسئلة سريعة</div>
              {QUICK.map((q, i) => (
                <button key={i} onClick={() => { setMode(q.mode); send(q.q, q.mode); }} style={{
                  width: "100%", background: "transparent", border: "none", color: "#555",
                  padding: "7px 12px", textAlign: "right", fontSize: "0.72rem",
                  cursor: "pointer", lineHeight: 1.5, transition: "all .2s",
                  fontFamily: "inherit", borderRadius: 6, marginBottom: 2,
                }}>
                  {q.q}
                </button>
              ))}
            </div>

            <div style={{ padding: "12px 16px", borderTop: "1px solid #1c1c1c", fontSize: "0.58rem", color: "#3a3a3a", lineHeight: 1.6 }}>
              ⚠️ للمساعدة فقط — لا يغني عن الاستشارة القانونية المتخصصة
            </div>
          </div>
        )}

        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Topbar */}
          <div style={{ background: "#0D0D0D", borderBottom: "1px solid #1c1c1c", padding: "11px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "transparent", border: "none", color: "#555", fontSize: "1.1rem", cursor: "pointer", padding: "4px 8px" }}>☰</button>
              <div style={{ background: `${accent}18`, color: accent, padding: "5px 14px", borderRadius: 20, fontSize: "0.78rem", border: `1px solid ${accent}33` }}>
                {currentMode?.icon} {currentMode?.label}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {messages.length > 0 && (
                <button onClick={() => setMessages([])} style={{ background: "transparent", border: "none", color: "#555", fontSize: "0.73rem", cursor: "pointer", fontFamily: "inherit" }}>
                  مسح المحادثة
                </button>
              )}
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: loading ? "#F0A500" : "#4CAF50", boxShadow: `0 0 6px ${loading ? "#F0A500" : "#4CAF50"}` }} />
              <span style={{ fontSize: "0.68rem", color: "#555" }}>{loading ? "يعالج..." : "جاهز"}</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "22px 18px", display: "flex", flexDirection: "column", gap: 18 }}>
            {messages.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
                <div style={{ width: 78, height: 78, borderRadius: 22, background: `${accent}18`, border: `1px solid ${accent}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, marginBottom: 18 }}>⚖️</div>
                <div style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 8 }}>مرحباً بك في ميزان</div>
                <div style={{ color: "#555", fontSize: "0.83rem", maxWidth: 360, lineHeight: 1.75 }}>
                  المساعد القانوني العراقي الذكي — اختر وضع العمل وابدأ باستفسارك القانوني
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="msg-in" style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: msg.role === "user" ? `${MODES.find(m=>m.id===msg.mode)?.color}22` : `${accent}28`,
                  border: `1px solid ${msg.role === "user" ? MODES.find(m=>m.id===msg.mode)?.color+"33" : accent+"33"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>
                  {msg.role === "user" ? "👤" : "⚖️"}
                </div>
                <div style={{
                  maxWidth: "74%", padding: "12px 15px", fontSize: "0.875rem", lineHeight: 1.85, color: "#D4CCBA",
                  background: msg.role === "user" ? "#161616" : "#111",
                  border: `1px solid ${msg.role === "user" ? "#1c1c1c" : accent+"1a"}`,
                  borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                }}>
                  {msg.role === "user"
                    ? <span>{msg.content}</span>
                    : <div dangerouslySetInnerHTML={{ __html: formatResponse(msg.content) }} />
                  }
                  {msg.role === "ai" && (
                    <div style={{ marginTop: 8, paddingTop: 7, borderTop: "1px solid #1c1c1c", display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: "0.6rem", color: "#444" }}>{MODES.find(m=>m.id===msg.mode)?.label}</span>
                      <span style={{ fontSize: "0.58rem", color: accent, background: `${accent}11`, padding: "1px 6px", borderRadius: 4 }}>ميزان AI</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg-in" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}28`, border: `1px solid ${accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚖️</div>
                <div style={{ background: "#111", border: `1px solid ${accent}1a`, borderRadius: "4px 16px 16px 16px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0,1,2].map(i => <div key={i} className="dot" style={{ background: accent, animationDelay: `${i*.2}s` }} />)}
                  <span style={{ fontSize: "0.7rem", color: "#555", marginRight: 4 }}>يحلل...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: "1px solid #1c1c1c", background: "#0D0D0D", padding: "13px 16px", flexShrink: 0 }}>
            <div style={{ background: "#111", border: `1px solid ${input ? accent+"44" : "#1c1c1c"}`, borderRadius: 13, overflow: "hidden", transition: "border-color .2s" }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) send(); }}
                placeholder={currentMode?.placeholder}
                rows={3}
                style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "#D4CCBA", fontSize: "0.875rem", padding: "12px 14px", lineHeight: 1.75, fontFamily: "inherit", direction: "rtl", resize: "none" }}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px 9px", borderTop: "1px solid #181818" }}>
                <span style={{ fontSize: "0.6rem", color: "#333" }}>Ctrl + Enter للإرسال</span>
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  style={{
                    background: input.trim() && !loading ? accent : "#1c1c1c",
                    color: input.trim() && !loading ? "#0D0D0D" : "#444",
                    border: "none", padding: "7px 20px", borderRadius: 8,
                    fontSize: "0.78rem", fontWeight: 700, cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                    fontFamily: "inherit", transition: "all .2s",
                  }}
                >
                  {loading ? "⏳" : "إرسال ↵"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
