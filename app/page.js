"use client";
import { useState, useEffect } from "react";

// ── THEME ──
const T = {
  bg: "#06080d", card: "#0e1117", cardAlt: "#161b24",
  accent: "#00e87b", accentDim: "#00e87b15",
  orange: "#ff6b2b", orangeDim: "#ff6b2b15",
  blue: "#3b82f6", blueDim: "#3b82f615",
  text: "#e8eaf0", textMid: "#9ca3b4", textDim: "#555d70",
  border: "#1e2433",
  grad: "linear-gradient(135deg, #00e87b, #00c9a7)",
  gradOrange: "linear-gradient(135deg, #ff6b2b, #ff9a44)",
  gradBlue: "linear-gradient(135deg, #3b82f6, #60a5fa)",
};
const F = `'Segoe UI', -apple-system, system-ui, sans-serif`;

// ── QUIZ STEPS ──
function getQuizSteps(serviceType) {
  const base = [
    { id: "gender", q: "Хүйсээ сонгоно уу", options: [
      { label: "Эрэгтэй", value: "male", emoji: "👨" },
      { label: "Эмэгтэй", value: "female", emoji: "👩" },
    ]},
    { id: "age", q: "Насаа оруулна уу", type: "number", placeholder: "25", unit: "нас" },
    { id: "weight", q: "Одоогийн жин (кг)", type: "number", placeholder: "75", unit: "кг" },
    { id: "targetWeight", q: "Зорилтот жин (кг)", type: "number", placeholder: "68", unit: "кг" },
    { id: "height", q: "Өндөр (см)", type: "number", placeholder: "175", unit: "см" },
    { id: "goal", q: "Гол зорилго", options: [
      { label: "Жин хасах", value: "lose", emoji: "🔥" },
      { label: "Булчин нэмэх", value: "gain", emoji: "💪" },
      { label: "Жин хадгалах", value: "maintain", emoji: "⚖️" },
      { label: "Тэмцээний бэлтгэл", value: "comp", emoji: "🏆" },
      { label: "Эрүүл мэнд сайжруулах", value: "health", emoji: "❤️" },
    ]},
    { id: "timeline", q: "Хугацааны зорилт", options: [
      { label: "2 долоо хоног", value: "2w", emoji: "⚡" },
      { label: "1 сар", value: "1m", emoji: "📅" },
      { label: "3 сар", value: "3m", emoji: "🗓️" },
      { label: "6+ сар", value: "6m", emoji: "🎯" },
    ]},
    { id: "activity", q: "Өдөр тутмын идэвхийн түвшин", options: [
      { label: "Суудлын (оффис)", value: "sedentary", emoji: "🪑" },
      { label: "Бага идэвхтэй", value: "light", emoji: "🚶" },
      { label: "Дунд идэвхтэй", value: "moderate", emoji: "🏃" },
      { label: "Маш идэвхтэй", value: "active", emoji: "⚡" },
    ]},
    { id: "sleep", q: "Өдрийн нойрны хэмжээ", options: [
      { label: "5-с бага цаг", value: "<5", emoji: "😴" },
      { label: "5-6 цаг", value: "5-6", emoji: "🌙" },
      { label: "7-8 цаг", value: "7-8", emoji: "😊" },
      { label: "8-с дээш", value: "8+", emoji: "💤" },
    ]},
    { id: "water", q: "Өдрийн усны хэрэглээ", options: [
      { label: "1 литрээс бага", value: "<1L", emoji: "💧" },
      { label: "1-2 литр", value: "1-2L", emoji: "🥤" },
      { label: "2-3 литр", value: "2-3L", emoji: "🫗" },
      { label: "3+ литр", value: "3L+", emoji: "🌊" },
    ]},
  ];
  const mealQs = [
    { id: "cookTime", q: "Хоол бэлдэхэд зарцуулах цаг", options: [
      { label: "15 мин (хурдан)", value: "15", emoji: "⏱️" },
      { label: "30 мин", value: "30", emoji: "🍳" },
      { label: "45-60 мин", value: "60", emoji: "👨‍🍳" },
      { label: "Цаг хамаагүй", value: "any", emoji: "♾️" },
    ]},
    { id: "budget", q: "Хоолны төсөв (сард)", options: [
      { label: "Хэмнэлтэй (<200к₮)", value: "low", emoji: "💰" },
      { label: "Дунд (200-400к₮)", value: "mid", emoji: "💳" },
      { label: "Өндөр (400к₮+)", value: "high", emoji: "💎" },
    ]},
    { id: "meals_per_day", q: "Өдөрт хэдэн удаа идэх вэ?", options: [
      { label: "3 удаа", value: "3", emoji: "🍽️" },
      { label: "4 удаа (зууштай)", value: "4", emoji: "🥗" },
      { label: "5-6 удаа (бага бага)", value: "5", emoji: "🔄" },
    ]},
    { id: "restrictions", q: "Хоолны хязгаарлалт (олон сонгож болно)", type: "multi", options: [
      { label: "Байхгүй", value: "none", emoji: "✅" },
      { label: "Сүү бүтээгдэхүүн", value: "dairy", emoji: "🥛" },
      { label: "Глютен", value: "gluten", emoji: "🌾" },
      { label: "Самрын харшил", value: "nuts", emoji: "🥜" },
      { label: "Вегетариан", value: "veg", emoji: "🥬" },
    ]},
  ];
  const workoutQs = [
    { id: "experience", q: "Дасгалын туршлага", options: [
      { label: "Шинэхэн (0-6 сар)", value: "beginner", emoji: "🌱" },
      { label: "Дунд (6 сар - 2 жил)", value: "intermediate", emoji: "🏋️" },
      { label: "Туршлагатай (2+ жил)", value: "advanced", emoji: "💪" },
    ]},
    { id: "workoutDays", q: "7 хоногт хэдэн өдөр дасгал хийх вэ?", options: [
      { label: "3 өдөр", value: "3", emoji: "3️⃣" },
      { label: "4 өдөр", value: "4", emoji: "4️⃣" },
      { label: "5 өдөр", value: "5", emoji: "5️⃣" },
      { label: "6 өдөр", value: "6", emoji: "6️⃣" },
    ]},
    { id: "workoutType", q: "Ямар дасгалд илүү дуртай?", type: "multi", options: [
      { label: "Жин өргөх", value: "weights", emoji: "🏋️" },
      { label: "Cardio / гүйлт", value: "cardio", emoji: "🏃" },
      { label: "HIIT", value: "hiit", emoji: "⚡" },
      { label: "Йога / сунгалт", value: "yoga", emoji: "🧘" },
      { label: "Calisthenics", value: "cali", emoji: "🤸" },
    ]},
    { id: "equipment", q: "Ямар тоног төхөөрөмж ашиглах боломжтой?", options: [
      { label: "Gym (бүрэн тоноглогдсон)", value: "gym", emoji: "🏢" },
      { label: "Гэрийн тоног (дамббелл гэх мэт)", value: "home", emoji: "🏠" },
      { label: "Юу ч алга (биеийн жин)", value: "none", emoji: "🙌" },
    ]},
    { id: "injury", q: "Гэмтэл, өвдөлт байгаа юу?", options: [
      { label: "Байхгүй", value: "none", emoji: "✅" },
      { label: "Нуруу", value: "back", emoji: "🔙" },
      { label: "Өвдөг", value: "knee", emoji: "🦵" },
      { label: "Мөр", value: "shoulder", emoji: "💪" },
      { label: "Бусад", value: "other", emoji: "⚠️" },
    ]},
  ];
  if (serviceType === "meal") return [...base, ...mealQs];
  if (serviceType === "workout") return [...base, ...workoutQs];
  return [...base, ...mealQs, ...workoutQs];
}

// ── SHARED UI ──
function Btn({ children, onClick, variant = "primary", disabled, full, style = {} }) {
  const s = {
    padding: "14px 28px", borderRadius: 12, border: "none", fontSize: 15,
    fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: F,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, transition: "all 0.2s", opacity: disabled ? 0.4 : 1,
    width: full ? "100%" : "auto",
    ...(variant === "primary" ? { background: T.grad, color: "#000" } :
      variant === "orange" ? { background: T.gradOrange, color: "#fff" } :
      variant === "blue" ? { background: T.gradBlue, color: "#fff" } :
      { background: T.cardAlt, color: T.textMid, border: `1px solid ${T.border}` }),
    ...style,
  };
  return <button style={s} onClick={onClick} disabled={disabled}>{children}</button>;
}

const Arrow = <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Check = <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LANDING PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: F }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>
          <span style={{ color: T.accent }}>BALANCE</span>HUB<span style={{ color: T.accent }}>.</span><span style={{ fontSize: 11, color: T.textDim }}>mn</span>
        </div>
        <Btn onClick={onStart} style={{ padding: "8px 18px", fontSize: 13 }}>Эхлэх</Btn>
      </nav>
      <section style={{ padding: "50px 20px 30px", textAlign: "center", maxWidth: 560, margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, #00e87b0d, transparent 70%)", pointerEvents: "none" }}/>
        <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: T.accentDim, color: T.accent, fontSize: 11, fontWeight: 700, marginBottom: 18, letterSpacing: 0.5 }}>
          🇲🇳 AI ХООЛ & ДАСГАЛЫН ТӨЛӨВЛӨГЧ
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.15, margin: "0 0 14px", letterSpacing: -1 }}>
          Таны биед тохирсон <span style={{ background: T.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>хоол & дасгал</span>
        </h1>
        <p style={{ fontSize: 15, color: T.textMid, lineHeight: 1.6, margin: "0 0 28px" }}>
          AI ухаалаг системээр хоолны цэс, дасгалын хуваарь автоматаар авч, өдөр бүр хянаарай.
        </p>
        <Btn onClick={onStart} style={{ fontSize: 16, padding: "16px 44px" }}>Үнэгүй эхлэх {Arrow}</Btn>
      </section>
      <section style={{ padding: "20px", maxWidth: 560, margin: "0 auto" }}>
        {[
          { emoji: "🥗", title: "Хоолны төлөвлөгөө", desc: "Калори, макро тооцоотой монгол хоолны цэс", color: T.accent },
          { emoji: "🏋️", title: "Дасгалын төлөвлөгөө", desc: "Зорилгод нийцсэн дасгалын хуваарь", color: T.orange },
          { emoji: "🔥", title: "Хоёуланг нь хамтад нь", desc: "Хоол + дасгал нэг системд, бүрэн хяналт", color: T.blue },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px", background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 28, flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: `${c.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.emoji}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3, color: c.color }}>{c.title}</div>
              <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </section>
      <section style={{ padding: "30px 20px 50px", maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, textAlign: "center" }}>Хэрхэн ажилладаг?</h2>
        {["Үйлчилгээ сонгох", "Асуулга бөглөх (2-3 мин)", "AI төлөвлөгөө үүсгэнэ", "Dashboard дээр хянах"].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.grad, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{s}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERVICE SELECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ServiceSelect({ onSelect }) {
  const opts = [
    { value: "meal", emoji: "🥗", title: "Хоолны төлөвлөгөө", desc: "Калори тооцоо, өдөр бүрийн хоолны цэс", color: T.accent, grad: T.grad },
    { value: "workout", emoji: "🏋️", title: "Дасгалын төлөвлөгөө", desc: "Дасгалын хуваарь, сет, давталт бүгд", color: T.orange, grad: T.gradOrange },
    { value: "both", emoji: "🔥", title: "Хоёуланг нь", desc: "Хоол + дасгал нэгтгэсэн бүрэн төлөвлөгөө", color: T.blue, grad: T.gradBlue, rec: true },
  ];
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: F, display: "flex", flexDirection: "column", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 6 }}>Юу авах вэ?</h2>
        <p style={{ textAlign: "center", color: T.textDim, fontSize: 14, marginBottom: 28 }}>Өөрт тохирох үйлчилгээгээ сонгоно уу</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {opts.map(o => (
            <button key={o.value} onClick={() => onSelect(o.value)} style={{ background: T.card, borderRadius: 16, padding: "20px", border: `2px solid ${T.border}`, cursor: "pointer", fontFamily: F, textAlign: "left", position: "relative", transition: "border-color 0.2s", color: T.text }}>
              {o.rec && <div style={{ position: "absolute", top: -10, right: 16, padding: "3px 12px", borderRadius: 10, background: o.grad, color: "#000", fontSize: 11, fontWeight: 800 }}>Санал болгох</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 30, width: 52, height: 52, borderRadius: 14, background: `${o.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{o.emoji}</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: o.color, marginBottom: 3 }}>{o.title}</div>
                  <div style={{ fontSize: 13, color: T.textDim }}>{o.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// QUIZ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Quiz({ serviceType, onComplete }) {
  const steps = getQuizSteps(serviceType);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [multi, setMulti] = useState(new Set());
  const cur = steps[step];
  const prog = ((step + 1) / steps.length) * 100;

  const next = (id, val) => {
    const updated = { ...answers, [id]: val };
    setAnswers(updated);
    setInputVal("");
    setMulti(new Set());
    if (step < steps.length - 1) setTimeout(() => setStep(step + 1), 150);
    else onComplete(updated);
  };

  const toggleMulti = (val) => {
    const n = new Set(multi);
    if (val === "none") { n.clear(); n.add("none"); }
    else { n.delete("none"); n.has(val) ? n.delete(val) : n.add(val); }
    setMulti(n);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: F, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={() => step > 0 && setStep(step - 1)} style={{ background: "none", border: "none", color: step > 0 ? T.textMid : T.textDim, fontSize: 14, cursor: "pointer", fontFamily: F, opacity: step === 0 ? 0.3 : 1 }}>← Буцах</button>
          <span style={{ fontSize: 12, color: T.textDim, background: T.cardAlt, padding: "4px 12px", borderRadius: 10 }}>{step + 1} / {steps.length}</span>
        </div>
        <div style={{ background: T.cardAlt, borderRadius: 6, height: 4, overflow: "hidden" }}>
          <div style={{ width: `${prog}%`, height: "100%", background: T.grad, borderRadius: 6, transition: "width 0.3s ease" }}/>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px", maxWidth: 480, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28, textAlign: "center" }}>{cur.q}</h2>
        {cur.options && !cur.type && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cur.options.map(o => (
              <button key={o.value} onClick={() => next(cur.id, o.value)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12,
                background: answers[cur.id] === o.value ? T.accentDim : T.card,
                border: `2px solid ${answers[cur.id] === o.value ? T.accent : T.border}`,
                color: T.text, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: F, transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 22 }}>{o.emoji}</span>{o.label}
              </button>
            ))}
          </div>
        )}
        {cur.type === "number" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, borderRadius: 14, padding: "10px 20px", border: `2px solid ${T.border}`, width: "100%", maxWidth: 260 }}>
              <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder={cur.placeholder}
                onKeyDown={e => e.key === "Enter" && inputVal && next(cur.id, Number(inputVal))} autoFocus
                style={{ flex: 1, background: "transparent", border: "none", color: T.text, fontSize: 28, fontWeight: 700, outline: "none", fontFamily: F, textAlign: "center", width: "100%" }}/>
              <span style={{ color: T.textDim, fontSize: 15, fontWeight: 600 }}>{cur.unit}</span>
            </div>
            <Btn onClick={() => inputVal && next(cur.id, Number(inputVal))} disabled={!inputVal}>Үргэлжлүүлэх {Arrow}</Btn>
          </div>
        )}
        {cur.type === "multi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cur.options.map(o => {
              const sel = multi.has(o.value);
              return (
                <button key={o.value} onClick={() => toggleMulti(o.value)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12,
                  background: sel ? T.accentDim : T.card, border: `2px solid ${sel ? T.accent : T.border}`,
                  color: T.text, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: F,
                }}>
                  <span style={{ fontSize: 22 }}>{o.emoji}</span>{o.label}
                  {sel && <span style={{ marginLeft: "auto" }}>{Check}</span>}
                </button>
              );
            })}
            <Btn onClick={() => multi.size > 0 && next(cur.id, [...multi])} disabled={multi.size === 0} full style={{ marginTop: 10 }}>
              {step === steps.length - 1 ? "Төлөвлөгөө авах 🚀" : "Үргэлжлүүлэх"} {Arrow}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOADING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Loading({ serviceType }) {
  const [idx, setIdx] = useState(0);
  const [dots, setDots] = useState("");
  const msgs = serviceType === "meal"
    ? ["Калори тооцоолж байна", "Монгол хоолны цэс бэлдэж байна", "Макро хуваарилж байна", "Төлөвлөгөө үүсгэж байна"]
    : serviceType === "workout"
    ? ["Биеийн бүтэц шинжилж байна", "Дасгалын хуваарь зохиож байна", "Сет давталт тооцоолж байна", "Төлөвлөгөө үүсгэж байна"]
    : ["Калори тооцоолж байна", "Хоолны цэс бэлдэж байна", "Дасгалын хуваарь зохиож байна", "Бүгдийг нэгтгэж байна"];
  useEffect(() => {
    const a = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    const b = setInterval(() => setIdx(i => (i + 1) % msgs.length), 2200);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: F, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "relative", width: 72, height: 72, marginBottom: 28 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", border: `3px solid ${T.border}`, borderTopColor: T.accent, animation: "spin 1s linear infinite" }}/>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 26 }}>
          {serviceType === "meal" ? "🥗" : serviceType === "workout" ? "🏋️" : "🔥"}
        </div>
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{msgs[idx]}{dots}</div>
      <div style={{ fontSize: 13, color: T.textDim }}>10-20 секунд хүлээнэ үү</div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAYMENT MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function PaymentModal({ onClose, onSuccess }) {
  const [plan, setPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const prices = { monthly: { amount: 9900, label: "₮9,900/сар" }, yearly: { amount: 89900, label: "₮89,900/жил (25% хөнгөлөлт)" } };

  const createInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/qpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.success) setInvoice(data);
      else alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } catch { alert("Сүлжээний алдаа. Дахин оролдоно уу."); }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: T.card, borderRadius: 20, padding: 24, maxWidth: 400, width: "100%", border: `1px solid ${T.border}` }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, textAlign: "center" }}>
          <span style={{ color: T.accent }}>BALANCE</span>HUB Premium
        </h3>
        <p style={{ textAlign: "center", color: T.textDim, fontSize: 13, marginBottom: 20 }}>Бүрэн хувийн төлөвлөгөө авах</p>

        {!invoice ? (
          <>
            {Object.entries(prices).map(([key, val]) => (
              <button key={key} onClick={() => setPlan(key)} style={{
                width: "100%", padding: "14px 18px", borderRadius: 12, marginBottom: 8,
                background: plan === key ? T.accentDim : T.cardAlt,
                border: `2px solid ${plan === key ? T.accent : T.border}`,
                color: T.text, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: F, textAlign: "left",
              }}>
                {val.label}
                {key === "yearly" && <span style={{ fontSize: 11, color: T.accent, marginLeft: 8 }}>🔥 Хэмнэлттэй</span>}
              </button>
            ))}
            <Btn onClick={createInvoice} full disabled={loading} style={{ marginTop: 12 }}>
              {loading ? "Уншиж байна..." : "QPay-ээр төлөх"}
            </Btn>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: T.textMid, marginBottom: 8 }}>QR кодыг уншуулна уу</div>
              {invoice.qr_image && (
                <img src={`data:image/png;base64,${invoice.qr_image}`} alt="QR" style={{ width: 180, height: 180, margin: "0 auto", borderRadius: 12, display: "block" }}/>
              )}
            </div>
            {invoice.urls && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 16 }}>
                {invoice.urls.slice(0, 6).map((bank, i) => (
                  <a key={i} href={bank.link} target="_blank" rel="noopener noreferrer" style={{
                    padding: "6px 14px", borderRadius: 8, background: T.cardAlt, color: T.textMid,
                    textDecoration: "none", fontSize: 12, fontWeight: 600, border: `1px solid ${T.border}`,
                  }}>{bank.name}</a>
                ))}
              </div>
            )}
            <Btn onClick={() => { onSuccess?.(); onClose(); }} full variant="primary" style={{ marginTop: 8 }}>
              Төлбөр хийгдсэн ✅
            </Btn>
          </>
        )}

        <button onClick={onClose} style={{ width: "100%", marginTop: 10, padding: "10px", background: "transparent", border: "none", color: T.textDim, cursor: "pointer", fontFamily: F, fontSize: 13 }}>
          Хаах
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Dashboard({ profile, serviceType, mealPlan, workoutPlan, onRestart }) {
  const [tab, setTab] = useState(serviceType === "workout" ? "workout" : "meal");
  const [mealDay, setMealDay] = useState(0);
  const [workDay, setWorkDay] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [showPayment, setShowPayment] = useState(false);

  const goalMap = { lose: "Жин хасах", gain: "Булчин нэмэх", maintain: "Жин хадгалах", comp: "Тэмцээний бэлтгэл", health: "Эрүүл мэнд" };
  let bmr = profile.gender === "male" ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5 : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  const am = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  const tdee = Math.round(bmr * (am[profile.activity] || 1.4));
  const gc = { lose: -500, gain: 400, maintain: 0, comp: -600, health: -200 };
  const targetCal = tdee + (gc[profile.goal] || 0);
  const macros = { protein: Math.round(profile.weight * 2.2), carbs: Math.round((targetCal * 0.4) / 4), fat: Math.round((targetCal * 0.25) / 9) };

  const hasMeal = serviceType !== "workout";
  const hasWorkout = serviceType !== "meal";
  const mDays = mealPlan?.days || [];
  const wDays = workoutPlan?.days || [];

  const toggleDone = (key) => setCompleted(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const tabs = [];
  if (hasMeal) tabs.push({ id: "meal", label: "🥗 Хоол", color: T.accent });
  if (hasWorkout) tabs.push({ id: "workout", label: "🏋️ Дасгал", color: T.orange });
  tabs.push({ id: "stats", label: "📊 Тойм", color: T.blue });

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: F }}>
      {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}

      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 900 }}><span style={{ color: T.accent }}>BALANCE</span>HUB</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowPayment(true)} style={{ background: T.gradOrange, border: "none", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer", fontFamily: F, fontWeight: 700 }}>⭐ Premium</button>
          <button onClick={onRestart} style={{ background: T.cardAlt, border: `1px solid ${T.border}`, color: T.textDim, padding: "6px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer", fontFamily: F, fontWeight: 600 }}>Шинээр</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, padding: "12px 20px", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: F,
            fontWeight: 700, fontSize: 13, whiteSpace: "nowrap",
            background: tab === t.id ? t.color : T.cardAlt, color: tab === t.id ? "#000" : T.textDim,
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "12px 20px 40px", maxWidth: 560, margin: "0 auto" }}>
        {/* STATS TAB */}
        {tab === "stats" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[{ l: "Зорилго", v: goalMap[profile.goal], c: T.accent }, { l: "Өдрийн калори", v: `${targetCal} kcal`, c: T.orange }, { l: "Одоогийн жин", v: `${profile.weight} кг`, c: T.textMid }, { l: "Зорилтот жин", v: `${profile.targetWeight} кг`, c: T.blue }].map((s, i) => (
                <div key={i} style={{ background: T.card, borderRadius: 12, padding: "14px 16px", border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, color: T.textDim, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>{s.l}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[{ l: "Уураг", v: macros.protein, c: "#00e87b" }, { l: "Нүүрс ус", v: macros.carbs, c: "#00b4d8" }, { l: "Өөх тос", v: macros.fat, c: "#ff6b2b" }].map((m, i) => (
                <div key={i} style={{ background: T.card, borderRadius: 12, padding: "14px 10px", border: `1px solid ${T.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: T.textDim, marginBottom: 3 }}>{m.l}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: m.c }}>{m.v}<span style={{ fontSize: 11, color: T.textDim }}>г</span></div>
                </div>
              ))}
            </div>
            <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📈 Гүйцэтгэл</div>
              <div style={{ fontSize: 13, color: T.textMid, marginBottom: 6 }}>Дууссан: {completed.size} / {mDays.length * 4 + wDays.length}</div>
              <div style={{ background: T.cardAlt, borderRadius: 6, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (completed.size / Math.max(1, mDays.length * 4 + wDays.length)) * 100)}%`, height: "100%", background: T.grad, borderRadius: 6, transition: "width 0.3s" }}/>
              </div>
            </div>
            {(mealPlan?.tips || workoutPlan?.tips) && (
              <div style={{ background: T.accentDim, borderRadius: 14, padding: 16, border: `1px solid ${T.accent}22`, marginTop: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.accent, marginBottom: 8 }}>💡 Зөвлөгөө</div>
                {[...(mealPlan?.tips || []), ...(workoutPlan?.tips || [])].map((t, i) => (
                  <div key={i} style={{ fontSize: 13, color: T.textMid, marginBottom: 4, lineHeight: 1.6 }}>• {t}</div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MEAL TAB */}
        {tab === "meal" && hasMeal && (
          <>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, marginBottom: 4 }}>
              {mDays.map((d, i) => (
                <button key={i} onClick={() => setMealDay(i)} style={{ padding: "7px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: F, fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", background: mealDay === i ? T.accent : T.cardAlt, color: mealDay === i ? "#000" : T.textDim }}>{d.dayLabel || `Өдөр ${i + 1}`}</button>
              ))}
            </div>
            {(mDays[mealDay]?.meals || []).map((m, i) => {
              const key = `m-${mealDay}-${i}`;
              const done = completed.has(key);
              return (
                <div key={i} style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${done ? T.accent + "44" : T.border}`, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>{m.time}</span>
                    {m.calories && <span style={{ fontSize: 12, fontWeight: 700, color: T.orange, background: T.orangeDim, padding: "3px 10px", borderRadius: 8 }}>{m.calories} kcal</span>}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{m.name}</div>
                  {m.ingredients && <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.7 }}>{m.ingredients.map((ing, j) => <div key={j}>• {ing}</div>)}</div>}
                  {m.description && <div style={{ fontSize: 13, color: T.textDim, marginTop: 4, lineHeight: 1.5 }}>{m.description}</div>}
                  <button onClick={() => toggleDone(key)} style={{ marginTop: 10, width: "100%", padding: "10px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: F, background: done ? T.cardAlt : T.accentDim, color: done ? T.textDim : T.accent }}>
                    {done ? "✅ Идсэн" : "Идсэн гэж тэмдэглэх"}
                  </button>
                </div>
              );
            })}
          </>
        )}

        {/* WORKOUT TAB */}
        {tab === "workout" && hasWorkout && (
          <>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, marginBottom: 4 }}>
              {wDays.map((d, i) => (
                <button key={i} onClick={() => setWorkDay(i)} style={{ padding: "7px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: F, fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", background: workDay === i ? T.orange : T.cardAlt, color: workDay === i ? "#000" : T.textDim }}>{d.dayLabel || `Өдөр ${i + 1}`}</button>
              ))}
            </div>
            {wDays[workDay] && (
              <div style={{ background: T.orangeDim, borderRadius: 12, padding: "12px 16px", marginBottom: 12, border: `1px solid ${T.orange}22` }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: T.orange }}>{wDays[workDay].type || wDays[workDay].dayLabel}</span>
              </div>
            )}
            {(wDays[workDay]?.exercises || []).map((ex, i) => {
              const key = `w-${workDay}-${i}`;
              const done = completed.has(key);
              return (
                <div key={i} style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${done ? T.orange + "44" : T.border}`, marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <button onClick={() => toggleDone(key)} style={{ width: 28, height: 28, borderRadius: 8, border: `2px solid ${done ? T.orange : T.border}`, background: done ? T.orangeDim : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                    {done && <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke={T.orange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, textDecoration: done ? "line-through" : "none", color: done ? T.textDim : T.text }}>{ex.name}</div>
                    <div style={{ fontSize: 13, color: T.textDim }}>{ex.detail}</div>
                    {ex.note && <div style={{ fontSize: 12, color: T.accent, marginTop: 4 }}>💡 {ex.note}</div>}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FALLBACKS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function fallbackMeal(a) {
  const lo = a.goal === "lose" || a.goal === "comp";
  return { days: [
    { dayLabel: "1-р өдөр", meals: [
      { time: "Өглөө (7:00)", name: "Өндөгний омлет + ногоо", calories: lo ? 300 : 450, ingredients: ["Өндөг 3ш (1 бүтэн + 2 цагаан)", "Шпинат 50г", "Улаан лооль 1ш", "Ногоон цай"], description: "Өндгийг ногоотой хамт шарах" },
      { time: "Өдөр (12:00)", name: "Тахианы цээжтэй хүрэн будаа", calories: lo ? 400 : 550, ingredients: ["Тахианы цээж 150г", "Хүрэн будаа 80г", "Лууван + байцаа салат", "Оливийн тос 1 халбага"], description: "Тахиаг жигнэж эсвэл шарж идэх" },
      { time: "Зууш (15:00)", name: "Грек йогурт + жимс", calories: lo ? 150 : 250, ingredients: ["Грек йогурт 200г", "Аньс 50г"], description: "Хольж идэх" },
      { time: "Орой (19:00)", name: "Загасны шөл", calories: lo ? 350 : 480, ingredients: ["Загас 150г", "Төмс 1ш", "Лууван, сонгино"], description: "Ногоотой хамт чанах" },
    ]},
    { dayLabel: "2-р өдөр", meals: [
      { time: "Өглөө (7:00)", name: "Овъёосны бан", calories: lo ? 320 : 420, ingredients: ["Овъёосны гурил 50г", "Өндөг 1ш", "Банан хагас"], description: "Бан хийж шарах" },
      { time: "Өдөр (12:00)", name: "Үхрийн махтай цуйван", calories: lo ? 420 : 580, ingredients: ["Үхрийн мах 120г", "Гоймон 100г", "Лууван, чинжүү"], description: "Монгол цуйван" },
      { time: "Зууш (15:00)", name: "Уургийн smoothie", calories: lo ? 170 : 280, ingredients: ["Банан 1ш", "Сүү 200мл", "Уураг нунтаг 1 халбага"], description: "Блендерт хийх" },
      { time: "Орой (19:00)", name: "Жигнэсэн бууз", calories: lo ? 380 : 500, ingredients: ["Тахианы мах 150г", "Гурил", "Сонгино, сармис"], description: "Жигнэсэн бууз" },
    ]},
    { dayLabel: "3-р өдөр", meals: [
      { time: "Өглөө (7:00)", name: "Өндөг + талх + авокадо", calories: lo ? 300 : 420, ingredients: ["Өндөг 2ш", "Буудайн талх 1ш", "Авокадо хагас"], description: "Талхан дээр тавих" },
      { time: "Өдөр (12:00)", name: "Хонины махтай шөл", calories: lo ? 400 : 550, ingredients: ["Хонины мах 120г", "Төмс, лууван", "Гоймон 50г"], description: "Монгол маханшөл" },
      { time: "Зууш (15:00)", name: "Самар + алим", calories: lo ? 160 : 230, ingredients: ["Бадам 20г", "Алим 1ш"], description: "Хольж идэх" },
      { time: "Орой (19:00)", name: "Загас + салат", calories: lo ? 340 : 450, ingredients: ["Загас 150г", "Өргөст хэмх, лооль", "Оливийн тос"], description: "Загасыг шарж салаттай идэх" },
    ]},
  ], tips: ["Өдөрт 3-4 литр ус уу", "Орой 20:00-с хойш хоол идэхгүй", "Хоол бүрд уураг оруул", "Нойр 7-8 цаг", "Чихэртэй ундаа хасах"] };
}

function fallbackWorkout(a) {
  const days = Number(a.workoutDays) || 4;
  const t = [
    { dayLabel: "1-р өдөр", type: "Цээж + Triceps", exercises: [
      { name: "Bench Press", detail: "4×10, амрах 60с" }, { name: "Incline DB Press", detail: "4×12" },
      { name: "Cable Fly", detail: "3×15" }, { name: "Tricep Dip", detail: "3×12" },
      { name: "Rope Pushdown", detail: "3×15" }, { name: "HIIT Cardio", detail: "15 мин" },
    ]},
    { dayLabel: "2-р өдөр", type: "Нуруу + Biceps", exercises: [
      { name: "Deadlift", detail: "4×8" }, { name: "Lat Pulldown", detail: "4×12" },
      { name: "Seated Row", detail: "4×12" }, { name: "Barbell Curl", detail: "3×12" },
      { name: "Hammer Curl", detail: "3×15" },
    ]},
    { dayLabel: "3-р өдөр", type: "Хөл + Хэвлий", exercises: [
      { name: "Squat", detail: "5×8" }, { name: "Romanian Deadlift", detail: "4×10" },
      { name: "Leg Press", detail: "4×15" }, { name: "Calf Raise", detail: "4×20" },
      { name: "Plank", detail: "3×60 сек" },
    ]},
    { dayLabel: "4-р өдөр", type: "Мөр + HIIT", exercises: [
      { name: "OHP", detail: "4×10" }, { name: "Lateral Raise", detail: "4×15" },
      { name: "Face Pull", detail: "3×20" },
      { name: "HIIT Circuit", detail: "4 раунд: Burpee ×10, Jump Squat ×15, Mountain Climber ×20" },
    ]},
    { dayLabel: "5-р өдөр", type: "Бүтэн бие", exercises: [
      { name: "Squat", detail: "4×10" }, { name: "Bench Press", detail: "4×10" },
      { name: "Row", detail: "4×10" }, { name: "KB Swing", detail: "3×20" },
      { name: "Cardio", detail: "20 мин" },
    ]},
    { dayLabel: "6-р өдөр", type: "Cardio + Core", exercises: [
      { name: "HIIT Treadmill", detail: "25 мин" }, { name: "Plank", detail: "3×60с" },
      { name: "Russian Twist", detail: "3×20" }, { name: "Leg Raise", detail: "3×15" },
    ]},
  ];
  return { days: t.slice(0, days), tips: ["Warm-up 5-10 мин", "Бүтэн бие сунгалт", "Нойр 7-8 цаг", "Усаа сайн уу"] };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Home() {
  const [page, setPage] = useState("landing");
  const [serviceType, setServiceType] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);

  const restart = () => { setPage("landing"); setServiceType(null); setProfile(null); setMealPlan(null); setWorkoutPlan(null); };

  const generate = async (answers) => {
    setProfile(answers);
    setPage("loading");

    // AI төлөвлөгөө үүсгэх (API route руу дуудна)
    if (serviceType !== "workout") {
      try {
        const res = await fetch("/api/generate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: answers, serviceType: "meal" }),
        });
        const data = await res.json();
        setMealPlan(data.success ? data.plan : fallbackMeal(answers));
      } catch { setMealPlan(fallbackMeal(answers)); }
    }

    if (serviceType !== "meal") {
      try {
        const res = await fetch("/api/generate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: answers, serviceType: "workout" }),
        });
        const data = await res.json();
        setWorkoutPlan(data.success ? data.plan : fallbackWorkout(answers));
      } catch { setWorkoutPlan(fallbackWorkout(answers)); }
    }

    setPage("dashboard");
  };

  if (page === "landing") return <Landing onStart={() => setPage("service")} />;
  if (page === "service") return <ServiceSelect onSelect={s => { setServiceType(s); setPage("quiz"); }} />;
  if (page === "quiz") return <Quiz serviceType={serviceType} onComplete={generate} />;
  if (page === "loading") return <Loading serviceType={serviceType} />;
  if (page === "dashboard") return <Dashboard profile={profile} serviceType={serviceType} mealPlan={mealPlan} workoutPlan={workoutPlan} onRestart={restart} />;
  return null;
}
