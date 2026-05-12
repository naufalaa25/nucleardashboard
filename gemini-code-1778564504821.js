import { useState } from "react";

const C = {
  bg: "#060b14", bgCard: "#0d1420", bgHover: "#131d2e",
  accent: "#00e4b8", accentDim: "#00e4b822",
  blue: "#4f8fff", blueDim: "#4f8fff22",
  amber: "#f5a623", red: "#ff4757", purple: "#a78bfa",
  pink: "#f472b6", cyan: "#22d3ee", green: "#22c55e",
  text: "#e8edf5", textDim: "#8b9ec0", textMuted: "#5a6d8a",
  border: "#182035",
};
const SC = { A: "#22c55e", S: "#f5a623", E: "#ff4757" };
const SL = { A: "Active", S: "Superseded", E: "Expired" };
const TC = { Requirement: C.accent, Regulation: C.blue, Standard: C.purple, Guide: C.amber, Guideline: C.amber, Treaty: C.red, Directive: C.pink, Recommendation: C.cyan, Law: C.red, Fundamentals: C.green, Plan: C.cyan };

// ... (Data konstanta INTL dan INDO Anda sangat panjang dan sudah benar, saya persingkat di tampilan ini agar Anda mudah membacanya, tetapi Anda tetap menggunakan data lengkap Anda) ...
// CATATAN: Masukkan seluruh objek INTL dan INDO Anda di sini.

const TOPICS = ["Planning Phase (Feasibility & Licensing)", "Construction Phase", "Safety & Licensing", "Design & Engineering", "Environmental & Waste", "Emergency Preparedness", "Security & Safeguards", "Decommissioning & Transport"];
const IC = { "Planning Phase (Feasibility & Licensing)": "📋", "Construction Phase": "🏗️", "Safety & Licensing": "⚛️", "Design & Engineering": "⚙️", "Environmental & Waste": "♻️", "Emergency Preparedness": "🚨", "Security & Safeguards": "🛡️", "Decommissioning & Transport": "🔄" };

function Dot({ s }) { const c = SC[s] || C.textMuted; return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 700, color: c }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: c, boxShadow: `0 0 5px ${c}55`, display: "inline-block" }} />{SL[s]}</span>; }
function Badge({ t }) { const c = TC[t] || C.textDim; return <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: c, background: c + "15", border: `1px solid ${c}30`, borderRadius: 3, padding: "1px 6px" }}>{t}</span>; }

function Card({ r, tag, open, toggle }) {
  return (
    <div onClick={toggle} style={{ background: open ? C.bgHover : C.bgCard, border: `1px solid ${open ? C.accent + "44" : C.border}`, borderRadius: 7, padding: "10px 12px", cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: tag === "i" ? C.accent : C.blue, background: tag === "i" ? C.accentDim : C.blueDim, padding: "1px 6px", borderRadius: 3 }}>{r.code}</span>
            <Badge t={r.type} />
            <Dot s={r.status} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text, lineHeight: 1.35 }}>{r.title}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
          <span style={{ fontSize: 8, color: C.textMuted, background: C.border, borderRadius: 3, padding: "1px 4px" }}>{r.body}</span>
          <span style={{ fontSize: 8, color: C.textMuted }}>{r.year}</span>
        </div>
      </div>
      {open && <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textDim, lineHeight: 1.75, textAlign: "justify" }}>{r.desc}</div>}
    </div>
  );
}

function Radar({ data, sz = 260 }) {
  const cx = sz / 2, cy = sz / 2, r = sz * 0.32, n = data.length;
  const a = data.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);
  const gp = (ai, v) => ({ x: cx + Math.cos(ai) * r * v, y: cy + Math.sin(ai) * r * v });
  const poly = (vs, f, s) => <polygon points={vs.map((v, i) => `${gp(a[i], v).x},${gp(a[i], v).y}`).join(" ")} fill={f} stroke={s} strokeWidth={1.5} />;
  return (
    <svg viewBox={`0 0 ${sz} ${sz}`} style={{ width: "100%", maxWidth: sz }}>
      {[.25, .5, .75, 1].map(l => <polygon key={l} points={a.map(ai => `${cx + Math.cos(ai) * r * l},${cy + Math.sin(ai) * r * l}`).join(" ")} fill="none" stroke={C.border} strokeWidth={.5} />)}
      {a.map((ai, i) => <g key={i}><line x1={cx} y1={cy} x2={cx + Math.cos(ai) * r} y2={cy + Math.sin(ai) * r} stroke={C.border} strokeWidth={.5} /><text x={cx + Math.cos(ai) * (r + 18)} y={cy + Math.sin(ai) * (r + 18)} fill={C.textMuted} fontSize={6.5} fontWeight={600} textAnchor="middle" dominantBaseline="middle">{data[i].l}</text></g>)}
      {poly(data.map(d => d.i), C.accentDim, C.accent)}{poly(data.map(d => d.d), C.blueDim, C.blue)}
    </svg>
  );
}

export default function App() {
  const [scope, setScope] = useState("all");
  const [topic, setTopic] = useState("Planning Phase (Feasibility & Licensing)");
  const [search, setSearch] = useState("");
  const [exp, setExp] = useState(null);
  const [tab, setTab] = useState("list");
  const [sf, setSf] = useState("all");

  const intl = INTL[topic] || [], indo = INDO[topic] || [];
  const f = rs => rs.filter(r => (!search || [r.code, r.title, r.body, r.desc, r.type].join(" ").toLowerCase().includes(search.toLowerCase())) && (sf === "all" || r.status === sf));
  const fI = f(intl), fD = f(indo);
  const tI = Object.values(INTL).flat().length, tD = Object.values(INDO).flat().length;
  const aI = Object.values(INTL).flat().filter(r => r.status === "A").length, aD = Object.values(INDO).flat().filter(r => r.status === "A").length;
  const mx = Math.max(...TOPICS.map(t => Math.max(INTL[t]?.length || 0, INDO[t]?.length || 0))) || 1;
  const rd = TOPICS.map(t => ({ l: t.split(" ")[0].replace("(", ""), i: (INTL[t]?.length || 0) / mx, d: (INDO[t]?.length || 0) / mx }));

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      <div style={{ background: "linear-gradient(135deg, #0a1628, #0d1b30)", borderBottom: `1px solid ${C.border}`, padding: "20px 16px 14px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "#00e4b811", filter: "blur(40px)" }} />
        <div style={{ position: "relative", maxWidth: 920, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>☢️</span>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 900, margin: 0, background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nuclear Power Plant</h1>
              <h2 style={{ fontSize: 10, fontWeight: 500, color: C.textDim, margin: 0, letterSpacing: 2, textTransform: "uppercase" }}>Standards & Regulations Database — International & Indonesia</h2>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 12px 36px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, margin: "12px 0" }}>
          {[{ l: "International", v: tI, a: aI, c: C.accent }, { l: "Indonesia", v: tD, a: aD, c: C.blue }, { l: "Topics", v: 8, c: C.purple }, { l: "Active Total", v: aI + aD, c: C.green }].map((s, i) => (
            <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.c, fontFamily: "monospace" }}>{s.v}</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: .7 }}>{s.l}</div>
              {s.a != null && <div style={{ fontSize: 7, color: C.green, marginTop: 1 }}>● {s.a} active</div>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 3, background: C.bgCard, borderRadius: 7, padding: 3, marginBottom: 8, border: `1px solid ${C.border}` }}>
          {[{ id: "all", l: "All" }, { id: "international", l: "🌐 International" }, { id: "indonesia", l: "🇮🇩 Indonesia" }].map(s => (
            <button key={s.id} onClick={() => setScope(s.id)} style={{ flex: 1, padding: "8px 4px", borderRadius: 5, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, background: scope === s.id ? (s.id === "indonesia" ? C.blue : s.id === "international" ? C.accent : `linear-gradient(135deg, ${C.accent}, ${C.blue})`) : "transparent", color: scope === s.id ? "#fff" : C.textDim }}>{s.l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 5, marginBottom: 8 }}>
          {TOPICS.map(t => (
            <button key={t} onClick={() => { setTopic(t); setExp(null); }} style={{ flexShrink: 0, padding: "7px 10px", borderRadius: 6, border: `1px solid ${topic === t ? C.accent + "55" : C.border}`, cursor: "pointer", fontSize: 9, fontWeight: 600, background: topic === t ? C.accentDim : C.bgCard, color: topic === t ? C.accent : C.textDim, whiteSpace: "nowrap" }}>{IC[t]} {t}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search code, title, body, description..." style={{ flex: "1 1 140px", padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}`, background: C.bgCard, color: C.text, fontSize: 10, outline: "none" }} />
          <div style={{ display: "flex", background: C.bgCard, borderRadius: 6, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            {[{ id: "all", l: "All", c: C.accent }, { id: "A", l: "Active", c: C.green }, { id: "S", l: "Superseded", c: C.amber }].map(x => (
              <button key={x.id} onClick={() => setSf(x.id)} style={{ padding: "6px 8px", border: "none", cursor: "pointer", fontSize: 9, fontWeight: 700, background: sf === x.id ? x.c + "22" : "transparent", color: sf === x.id ? x.c : C.textMuted }}>{x.l}</button>
            ))}
          </div>
          <div style={{ display: "flex", background: C.bgCard, borderRadius: 6, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            {["list", "chart"].map(v => (
              <button key={v} onClick={() => setTab(v)} style={{ padding: "6px 10px", border: "none", cursor: "pointer", fontSize: 9, fontWeight: 700, textTransform: "uppercase", background: tab === v ? C.accent : "transparent", color: tab === v ? "#000" : C.textDim }}>{v === "list" ? "📋 List" : "📊 Charts"}</button>
            ))}
          </div>
        </div>
        {tab === "chart" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, margin: "0 0 6px" }}>Coverage Radar — International vs Indonesia</h3>
              <div style={{ display: "flex", justifyContent: "center" }}><Radar data={rd} /></div>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 6 }}>
                <span style={{ fontSize: 8, color: C.accent, fontWeight: 600 }}>● International</span>
                <span style={{ fontSize: 8, color: C.blue, fontWeight: 600 }}>● Indonesia</span>
              </div>
            </div>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, margin: "0 0 8px" }}>Per-Topic Breakdown</h3>
              {TOPICS.map(t => {
                const iC = INTL[t]?.length || 0, dC = INDO[t]?.length || 0;
                return (
                  <div key={t} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: C.textDim, marginBottom: 3 }}>{IC[t]} {t}</div>
                    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                      <span style={{ fontSize: 8, color: C.accent, width: 16, textAlign: "right", fontWeight: 700 }}>{iC}</span>
                      <div style={{ flex: 1, height: 5, background: C.border, borderRadius: 3 }}><div style={{ width: `${(iC / mx) * 100}%`, height: "100%", background: C.accent, borderRadius: 3 }} /></div>
                    </div>
                    <div style={{ display: "flex", gap: 3, alignItems: "center", marginTop: 1 }}>
                      <span style={{ fontSize: 8, color: C.blue, width: 16, textAlign: "right", fontWeight: 700 }}>{dC}</span>
                      <div style={{ flex: 1, height: 5, background: C.border, borderRadius: 3 }}><div style={{ width: `${(dC / mx) * 100}%`, height: "100%", background: C.blue, borderRadius: 3 }} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, margin: "0 0 8px" }}>Status Distribution</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{ l: "International", d: Object.values(INTL).flat(), c: C.accent }, { l: "Indonesia", d: Object.values(INDO).flat(), c: C.blue }].map(({ l, d, c }) => {
                  const tot = d.length, ac = d.filter(r => r.status === "A").length, su = d.filter(r => r.status === "S").length;
                  return (
                    <div key={l}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: c, marginBottom: 4 }}>{l} ({tot})</div>
                      {[{ lb: "Active", v: ac, co: C.green }, { lb: "Superseded", v: su, co: C.amber }].filter(x => x.v > 0).map(x => (
                        <div key={x.lb} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: x.co }} />
                          <span style={{ fontSize: 8, color: C.textDim, flex: 1 }}>{x.lb}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: x.co }}>{x.v}</span>
                          <div style={{ width: 50, height: 4, background: C.border, borderRadius: 2 }}><div style={{ width: `${(x.v / tot) * 100}%`, height: "100%", background: x.co, borderRadius: 2 }} /></div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {tab === "list" && (
          <>
            <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 600, marginBottom: 6 }}>
              {scope === "all" ? `${fI.length} int'l + ${fD.length} IDN` : scope === "international" ? `${fI.length} international` : `${fD.length} Indonesia`} in <span style={{ color: C.accent }}>{topic}</span>
              {sf !== "all" && <span style={{ color: SC[sf] }}> — {SL[sf]}</span>}
            </div>
            {(scope === "all" || scope === "international") && fI.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                  <div style={{ width: 3, height: 12, background: C.accent, borderRadius: 2 }} />
                  <span style={{ fontSize: 10, fontWeight: 800, color: C.accent, textTransform: "uppercase", letterSpacing: .8 }}>🌐 International ({fI.length})</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {fI.map(r => <Card key={`i-${r.code}`} r={r} tag="i" open={exp === `i-${r.code}`} toggle={() => setExp(exp === `i-${r.code}` ? null : `i-${r.code}`)} />)}
                </div>
              </div>
            )}
            {(scope === "all" || scope === "indonesia") && fD.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                  <div style={{ width: 3, height: 12, background: C.blue, borderRadius: 2 }} />
                  <span style={{ fontSize: 10, fontWeight: 800, color: C.blue, textTransform: "uppercase", letterSpacing: .8 }}>🇮🇩 Indonesia ({fD.length})</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {fD.map(r => <Card key={`d-${r.code}`} r={r} tag="d" open={exp === `d-${r.code}`} toggle={() => setExp(exp === `d-${r.code}` ? null : `d-${r.code}`)} />)}
                </div>
              </div>
            )}
            {fI.length === 0 && fD.length === 0 && <div style={{ textAlign: "center", padding: 24, color: C.textMuted, fontSize: 11 }}>No regulations match your filters.</div>}
          </>
        )}
        <div style={{ marginTop: 16, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 7, padding: 12 }}>
          <h4 style={{ fontSize: 9, fontWeight: 700, margin: "0 0 6px", color: C.textDim, textTransform: "uppercase", letterSpacing: .8 }}>Status Legend</h4>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[{ s: "A", l: "Active — Currently in force" }, { s: "S", l: "Superseded — Replaced by newer version" }, { s: "E", l: "Expired — No longer in effect" }].map(x => (
              <div key={x.s} style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: SC[x.s], boxShadow: `0 0 5px ${SC[x.s]}44` }} /><span style={{ fontSize: 8, color: C.textDim }}>{x.l}</span></div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 12, textAlign: "center", fontSize: 8, color: C.textMuted, lineHeight: 1.7 }}>
          Nuclear Power Plant Standards & Regulations Database — Reference only. Click any regulation card to read its detailed coverage paragraph.
          <br />Sources: IAEA, ASME, IEEE, IEC, US NRC, EU, AFCEN, KTA, ACI, AISC, AWS, CSA, BAPETEN, BSN, Indonesian Government.
          <br />Includes latest standards through 2025 (SSG-4 Rev.1, SSG-88, SSG-89, SSG-90, SSG-91, GSG-13 Rev.1, GSG-19, Perba BAPETEN 5/2024, 4/2024, 2/2025).
          <br />Status verified as of May 2026.
        </div>
      </div>
    </div>
  );
}