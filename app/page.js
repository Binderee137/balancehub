"use client";
import { useState, useEffect } from "react";

const T = {
  bg: "#030712", card: "#0a0f1a", cardAlt: "#111827",
  accent: "#a78bfa", accentDim: "#a78bfa12",
  orange: "#fb923c", orangeDim: "#fb923c12",
  blue: "#38bdf8", blueDim: "#38bdf812",
  text: "#f8fafc", textMid: "#94a3b8", textDim: "#475569",
  border: "#1e293b",
  grad: "linear-gradient(135deg, #a78bfa, #7c3aed)",
  gradWarm: "linear-gradient(135deg, #fb923c, #f97316)",
  gradBlue: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
};
const F = `'Inter', -apple-system, system-ui, sans-serif`;

function getQuizSteps(svc) {
  const base = [
    { id: "gender", q: "Таны хүйс", options: [
      { label: "Эрэгтэй", value: "male", emoji: "👨" },
      { label: "Эмэгтэй", value: "female", emoji: "👩" },
    ]},
    { id: "age", q: "Таны нас", type: "number", placeholder: "25", unit: "нас" },
    { id: "weight", q: "Одоогийн жин", type: "number", placeholder: "75", unit: "кг" },
    { id: "targetWeight", q: "Зорилтот жин", type: "number", placeholder: "68", unit: "кг" },
    { id: "height", q: "Таны өндөр", type: "number", placeholder: "175", unit: "см" },
    { id: "goal", q: "Гол зорилгоо сонгоно уу", options: [
      { label: "Жин хасах", value: "lose", emoji: "🔥" },
      { label: "Булчин нэмэх", value: "gain", emoji: "💪" },
      { label: "Жин хадгалах", value: "maintain", emoji: "⚖️" },
      { label: "Тэмцээний бэлтгэл", value: "comp", emoji: "🏆" },
      { label: "Эрүүл мэнд сайжруулах", value: "health", emoji: "❤️" },
    ]},
    { id: "timeline", q: "Зорилтот хугацаа", options: [
      { label: "2 долоо хоног", value: "2w", emoji: "⚡" },
      { label: "1 сар", value: "1m", emoji: "📅" },
      { label: "3 сар", value: "3m", emoji: "🗓️" },
      { label: "6 сар ба түүнээс дээш", value: "6m", emoji: "🎯" },
    ]},
    { id: "activity", q: "Өдөр тутмын идэвхийн түвшин", options: [
      { label: "Суудлын амьдралтай", value: "sedentary", emoji: "🪑" },
      { label: "Бага зэрэг идэвхтэй", value: "light", emoji: "🚶" },
      { label: "Дунд зэрэг идэвхтэй", value: "moderate", emoji: "🏃" },
      { label: "Маш идэвхтэй", value: "active", emoji: "⚡" },
    ]},
    { id: "sleep", q: "Өдрийн нойрны хэмжээ", options: [
      { label: "5 цагаас бага", value: "<5", emoji: "😴" },
      { label: "5–6 цаг", value: "5-6", emoji: "🌙" },
      { label: "7–8 цаг", value: "7-8", emoji: "😊" },
      { label: "8 цагаас дээш", value: "8+", emoji: "💤" },
    ]},
    { id: "water", q: "Өдрийн усны хэрэглээ", options: [
      { label: "1 литрээс бага", value: "<1L", emoji: "💧" },
      { label: "1–2 литр", value: "1-2L", emoji: "🥤" },
      { label: "2–3 литр", value: "2-3L", emoji: "🫗" },
      { label: "3 литрээс дээш", value: "3L+", emoji: "🌊" },
    ]},
  ];
  const mealQs = [
    { id: "cookTime", q: "Хоол бэлдэхэд зарцуулах цаг", options: [
      { label: "15 минут (хурдан)", value: "15", emoji: "⏱️" },
      { label: "30 минут", value: "30", emoji: "🍳" },
      { label: "45–60 минут", value: "60", emoji: "👨‍🍳" },
      { label: "Цаг хамаагүй", value: "any", emoji: "♾️" },
    ]},
    { id: "budget", q: "Сарын хоолны төсөв", options: [
      { label: "Хэмнэлттэй (200,000₮-аас бага)", value: "low", emoji: "💰" },
      { label: "Дунд зэрэг (200,000–400,000₮)", value: "mid", emoji: "💳" },
      { label: "Өндөр (400,000₮-аас дээш)", value: "high", emoji: "💎" },
    ]},
    { id: "meals_per_day", q: "Өдөрт хэдэн удаа хооллох вэ?", options: [
      { label: "3 удаа", value: "3", emoji: "🍽️" },
      { label: "4 удаа (зууштай)", value: "4", emoji: "🥗" },
      { label: "5–6 удаа (бага багаар)", value: "5", emoji: "🔄" },
    ]},
    { id: "restrictions", q: "Хоолны хязгаарлалт (олон сонгож болно)", type: "multi", options: [
      { label: "Байхгүй", value: "none", emoji: "✅" },
      { label: "Сүү бүтээгдэхүүн", value: "dairy", emoji: "🥛" },
      { label: "Глютен", value: "gluten", emoji: "🌾" },
      { label: "Самрын харшил", value: "nuts", emoji: "🥜" },
      { label: "Цагаан хоолтон", value: "veg", emoji: "🥬" },
    ]},
  ];
  const workoutQs = [
    { id: "experience", q: "Дасгалын туршлага", options: [
      { label: "Шинэхэн (0–6 сар)", value: "beginner", emoji: "🌱" },
      { label: "Дунд зэрэг (6 сар – 2 жил)", value: "intermediate", emoji: "🏋️" },
      { label: "Туршлагатай (2 жилээс дээш)", value: "advanced", emoji: "💪" },
    ]},
    { id: "workoutDays", q: "Долоо хоногт хэдэн өдөр дасгал хийх вэ?", options: [
      { label: "3 өдөр", value: "3", emoji: "3️⃣" },
      { label: "4 өдөр", value: "4", emoji: "4️⃣" },
      { label: "5 өдөр", value: "5", emoji: "5️⃣" },
      { label: "6 өдөр", value: "6", emoji: "6️⃣" },
    ]},
    { id: "workoutType", q: "Ямар төрлийн дасгалд дуртай вэ?", type: "multi", options: [
      { label: "Жин өргөх", value: "weights", emoji: "🏋️" },
      { label: "Зүрхний дасгал", value: "cardio", emoji: "🏃" },
      { label: "Өндөр эрчимтэй (HIIT)", value: "hiit", emoji: "⚡" },
      { label: "Йога, сунгалт", value: "yoga", emoji: "🧘" },
      { label: "Биеийн жинтэй дасгал", value: "cali", emoji: "🤸" },
    ]},
    { id: "equipment", q: "Ямар тоног төхөөрөмж ашиглах боломжтой вэ?", options: [
      { label: "Фитнесс зал (бүрэн тоноглогдсон)", value: "gym", emoji: "🏢" },
      { label: "Гэрийн тоног (дамбелл гэх мэт)", value: "home", emoji: "🏠" },
      { label: "Юу ч алга (зөвхөн биеийн жин)", value: "none", emoji: "🙌" },
    ]},
    { id: "injury", q: "Гэмтэл эсвэл өвдөлт бий юу?", options: [
      { label: "Байхгүй", value: "none", emoji: "✅" },
      { label: "Нуруу", value: "back", emoji: "🔙" },
      { label: "Өвдөг", value: "knee", emoji: "🦵" },
      { label: "Мөр", value: "shoulder", emoji: "💪" },
      { label: "Бусад", value: "other", emoji: "⚠️" },
    ]},
  ];
  if (svc === "meal") return [...base, ...mealQs];
  if (svc === "workout") return [...base, ...workoutQs];
  return [...base, ...mealQs, ...workoutQs];
}

function Btn({ children, onClick, variant = "primary", disabled, full, style = {} }) {
  const base = {
    padding: "13px 26px", borderRadius: 14, border: "none", fontSize: 14,
    fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", fontFamily: F,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, transition: "all 0.25s", opacity: disabled ? 0.35 : 1,
    width: full ? "100%" : "auto",
    ...(variant === "primary" ? { background: T.grad, color: "#fff", boxShadow: "0 4px 20px #a78bfa30" } :
      variant === "orange" ? { background: T.gradWarm, color: "#fff" } :
      { background: T.cardAlt, color: T.textMid, border: `1px solid ${T.border}` }),
    ...style,
  };
  return <button style={base} onClick={onClick} disabled={disabled}>{children}</button>;
}

const Arrow = <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Check = <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const BackIcon = <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M19 12H5m6 6l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

function Logo() {
  return (
    <div style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: T.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <span style={{ color: T.text }}>Balance<span style={{ color: T.accent }}>Hub</span></span>
    </div>
  );
}

function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: F }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
        <Logo />
        <Btn onClick={onStart} style={{ padding: "9px 20px", fontSize: 13 }}>Эхлэх</Btn>
      </nav>
      <section style={{ padding: "56px 20px 36px", textAlign: "center", maxWidth: 560, margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #a78bfa08, transparent 70%)", pointerEvents: "none" }}/>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: T.accentDim, color: T.accent, fontSize: 11, fontWeight: 600, marginBottom: 20, letterSpacing: 0.8, textTransform: "uppercase" }}>
          10,000+ хэрэглэгч итгэн ашиглаж байна
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: -0.8 }}>
          Зөвхөн танд зориулсан{" "}
          <span style={{ background: T.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>дахин давтагдашгүй төлөвлөгөө</span>
        </h1>
        <p style={{ fontSize: 15, color: T.textMid, lineHeight: 1.7, margin: "0 0 32px", maxWidth: 460, marginInline: "auto" }}>
          Таны өгөгдөлд тулгуурлан эхний өдрөөс л танд тохирсон дасгал, хооллолтын зөвлөмжийг хиймэл оюун ухаан санал болгоно. Ахиц дэвшлээ өдөр бүр хянаарай.
        </p>
        <Btn onClick={onStart} style={{ fontSize: 15, padding: "16px 48px", borderRadius: 16 }}>Төлөвлөгөөгөө авах {Arrow}</Btn>
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 40 }}>
          {[{ n: "10,000+", l: "Идэвхтэй хэрэглэгч" }, { n: "50,000+", l: "Үүсгэсэн төлөвлөгөө" }, { n: "98%", l: "Сэтгэл ханамж" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.accent }}>{s.n}</div>
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "32px 20px", maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>Яагаад BalanceHub гэж?</h2>
        {[
          { emoji: "🧬", title: "Таны биед л зориулагдсан", desc: "Нас, жин, зорилго, амьдралын хэв маягт тохируулсан 100% хувийн төлөвлөгөө", color: T.accent, bg: T.accentDim },
          { emoji: "🤖", title: "AI ухаалаг зөвлөгч", desc: "Хиймэл оюун ухаан таны мэдээлэлд тулгуурлан хоол, дасгалыг оновчтой тооцоолно", color: T.orange, bg: T.orangeDim },
          { emoji: "🇲🇳", title: "Монгол хоолонд бүрэн тохирсон", desc: "Бууз, цуйван, маханшөлнөөс эхлээд эрүүл орчин үеийн хоол хүртэл", color: T.blue, bg: T.blueDim },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px", background: T.card, borderRadius: 16, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 26, flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.emoji}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: c.color }}>{c.title}</div>
              <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </section>

      <section style={{ padding: "20px", maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>Юу авах боломжтой вэ?</h2>
        {[
          { emoji: "🥗", title: "Хоолны төлөвлөгөө", desc: "Калори, макро тооцоотой монгол хоолны өдөр тутмын цэс", color: T.accent, bg: T.accentDim },
          { emoji: "🏋️", title: "Дасгалын төлөвлөгөө", desc: "Зорилгод нийцсэн, тоног төхөөрөмжид тохирсон хуваарь", color: T.orange, bg: T.orangeDim },
          { emoji: "🔥", title: "Бүрэн хослол", desc: "Хоол, дасгалын хослолтой бүрэн төлөвлөгөө, нэг дороос хяналт", color: T.blue, bg: T.blueDim },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px", background: T.card, borderRadius: 16, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 26, flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.emoji}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: c.color }}>{c.title}</div>
              <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </section>

      <section style={{ padding: "32px 20px 20px", maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>Хэрхэн ажилладаг вэ?</h2>
        {["Үйлчилгээ сонгоно", "2–3 минутын асуулга бөглөнө", "AI таны төлөвлөгөөг шууд үүсгэнэ", "Хяналтын самбараас өдөр бүр хянана"].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.grad, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 14, fontWeight: 500, color: T.textMid }}>{s}</span>
          </div>
        ))}
      </section>

      <section style={{ padding: "32px 20px 60px", textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
        <div style={{ background: T.card, borderRadius: 20, padding: "32px 24px", border: `1px solid ${T.accent}22`, boxShadow: "0 0 40px #a78bfa10" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Өнөөдрөөс эхлээрэй</h3>
          <p style={{ color: T.textDim, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>Мянга мянган хүн өдөр бүр BalanceHub ашиглан зорилгодоо хүрч байна. Та ч гэсэн нэгдээрэй.</p>
          <Btn onClick={onStart} full style={{ fontSize: 15, padding: 16, borderRadius: 14 }}>Үнэгүй эхлэх {Arrow}</Btn>
        </div>
      </section>
    </div>
  );
}

function ServiceSelect({ onSelect, onBack }) {
  const opts = [
    { value: "meal", emoji: "🥗", title: "Хоолны төлөвлөгөө", desc: "Калори тооцоо, өдөр бүрийн хоолны цэс", color: T.accent, bg: T.accentDim },
    { value: "workout", emoji: "🏋️", title: "Дасгалын төлөвлөгөө", desc: "Дасгалын хуваарь, сет, давталт бүрэн", color: T.orange, bg: T.orangeDim },
    { value: "both", emoji: "🔥", title: "Бүрэн хослол", desc: "Хоол, дасгал нэг системд, бүрэн хяналт", color: T.blue, bg: T.blueDim, rec: true },
  ];
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: F, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: T.textMid, fontSize: 14, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>{BackIcon} Буцах</button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 6 }}>Ямар төлөвлөгөө авах вэ?</h2>
          <p style={{ textAlign: "center", color: T.textDim, fontSize: 14, marginBottom: 28 }}>Өөрт тохирох үйлчилгээгээ сонгоно уу</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {opts.map(o => (
              <button key={o.value} onClick={() => onSelect(o.value)} style={{ background: T.card, borderRadius: 16, padding: "20px", border: `1.5px solid ${T.border}`, cursor: "pointer", fontFamily: F, textAlign: "left", position: "relative", transition: "all 0.25s", color: T.text }}>
                {o.rec && <div style={{ position: "absolute", top: -10, right: 16, padding: "4px 14px", borderRadius: 10, background: T.gradBlue, color: "#fff", fontSize: 11, fontWeight: 700 }}>Зөвлөмж</div>}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 28, width: 52, height: 52, borderRadius: 14, background: o.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{o.emoji}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: o.color, marginBottom: 3 }}>{o.title}</div>
                    <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>{o.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Quiz({ serviceType, onComplete, onBack }) {
  const steps = getQuizSteps(serviceType);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [multi, setMulti] = useState(new Set());
  const cur = steps[step];
  const prog = ((step + 1) / steps.length) * 100;

  const goBack = () => { if (step > 0) { setStep(step - 1); setInputVal(""); setMulti(new Set()); } else { onBack(); } };
  const next = (id, val) => {
    const u = { ...answers, [id]: val }; setAnswers(u); setInputVal(""); setMulti(new Set());
    if (step < steps.length - 1) setTimeout(() => setStep(step + 1), 120); else onComplete(u);
  };
  const toggleMulti = (val) => {
    const n = new Set(multi);
    if (val === "none") { n.clear(); n.add("none"); } else { n.delete("none"); n.has(val) ? n.delete(val) : n.add(val); }
    setMulti(n);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: F, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={goBack} style={{ background: "none", border: "none", color: T.textMid, fontSize: 14, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>{BackIcon} Буцах</button>
          <span style={{ fontSize: 12, color: T.textDim, background: T.cardAlt, padding: "4px 14px", borderRadius: 10, fontWeight: 500 }}>{step + 1} / {steps.length}</span>
        </div>
        <div style={{ background: T.cardAlt, borderRadius: 6, height: 3, overflow: "hidden" }}>
          <div style={{ width: `${prog}%`, height: "100%", background: T.grad, borderRadius: 6, transition: "width 0.3s ease" }}/>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px", maxWidth: 480, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28, textAlign: "center" }}>{cur.q}</h2>
        {cur.options && !cur.type && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cur.options.map(o => (
              <button key={o.value} onClick={() => next(cur.id, o.value)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "15px 18px", borderRadius: 14,
                background: answers[cur.id] === o.value ? T.accentDim : T.card,
                border: `1.5px solid ${answers[cur.id] === o.value ? T.accent : T.border}`,
                color: T.text, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: F, transition: "all 0.15s",
              }}><span style={{ fontSize: 22 }}>{o.emoji}</span>{o.label}</button>
            ))}
          </div>
        )}
        {cur.type === "number" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, borderRadius: 14, padding: "12px 24px", border: `1.5px solid ${T.border}`, width: "100%", maxWidth: 240 }}>
              <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder={cur.placeholder}
                onKeyDown={e => e.key === "Enter" && inputVal && next(cur.id, Number(inputVal))} autoFocus
                style={{ flex: 1, background: "transparent", border: "none", color: T.text, fontSize: 32, fontWeight: 700, outline: "none", fontFamily: F, textAlign: "center", width: "100%" }}/>
              <span style={{ color: T.textDim, fontSize: 16, fontWeight: 500 }}>{cur.unit}</span>
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
                  display: "flex", alignItems: "center", gap: 12, padding: "15px 18px", borderRadius: 14,
                  background: sel ? T.accentDim : T.card, border: `1.5px solid ${sel ? T.accent : T.border}`,
                  color: T.text, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: F,
                }}><span style={{ fontSize: 22 }}>{o.emoji}</span>{o.label}
                  {sel && <span style={{ marginLeft: "auto" }}>{Check}</span>}
                </button>
              );
            })}
            <Btn onClick={() => multi.size > 0 && next(cur.id, [...multi])} disabled={multi.size === 0} full style={{ marginTop: 12 }}>
              {step === steps.length - 1 ? "Төлөвлөгөө авах" : "Үргэлжлүүлэх"} {Arrow}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function Loading({ serviceType }) {
  const [idx, setIdx] = useState(0);
  const [dots, setDots] = useState("");
  const msgs = serviceType === "meal"
    ? ["Калори тооцоолж байна", "Монгол хоолны цэс бэлдэж байна", "Макро хуваарилж байна", "Төлөвлөгөө боловсруулж байна"]
    : serviceType === "workout"
    ? ["Биеийн бүтцийг шинжилж байна", "Дасгалын хуваарь зохиож байна", "Сет, давталт тооцоолж байна", "Төлөвлөгөө боловсруулж байна"]
    : ["Калори тооцоолж байна", "Хоолны цэс бэлдэж байна", "Дасгалын хуваарь зохиож байна", "Нэгтгэж байна"];
  useEffect(() => {
    const a = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    const b = setInterval(() => setIdx(i => (i + 1) % msgs.length), 2200);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: F, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "relative", width: 72, height: 72, marginBottom: 28 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", border: `3px solid ${T.border}`, borderTopColor: T.accent, animation: "spin 1s linear infinite" }}/>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 24 }}>
          {serviceType === "meal" ? "🥗" : serviceType === "workout" ? "🏋️" : "🔥"}
        </div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{msgs[idx]}{dots}</div>
      <div style={{ fontSize: 13, color: T.textDim }}>Түр хүлээнэ үү</div>
    </div>
  );
}

function PaymentModal({ onClose }) {
  const [plan, setPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const prices = { monthly: { label: "₮9,900 / сар" }, yearly: { label: "₮89,900 / жил (25% хөнгөлөлт)" } };
  const createInvoice = async () => {
    setLoading(true);
    try { const r = await fetch("/api/qpay/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) }); const d = await r.json(); if (d.success) setInvoice(d); else alert("Алдаа гарлаа."); } catch { alert("Сүлжээний алдаа."); }
    setLoading(false);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: T.card, borderRadius: 20, padding: 28, maxWidth: 380, width: "100%", border: `1px solid ${T.border}` }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: "center" }}>BalanceHub <span style={{ color: T.accent }}>Premium</span></h3>
        <p style={{ textAlign: "center", color: T.textDim, fontSize: 13, marginBottom: 20 }}>Бүрэн хувийн төлөвлөгөө авах</p>
        {!invoice ? (<>
          {Object.entries(prices).map(([k, v]) => (
            <button key={k} onClick={() => setPlan(k)} style={{ width: "100%", padding: "14px 18px", borderRadius: 14, marginBottom: 8, background: plan === k ? T.accentDim : T.cardAlt, border: `1.5px solid ${plan === k ? T.accent : T.border}`, color: T.text, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F, textAlign: "left" }}>{v.label}</button>
          ))}
          <Btn onClick={createInvoice} full disabled={loading} style={{ marginTop: 12 }}>{loading ? "Уншиж байна..." : "QPay-аар төлөх"}</Btn>
        </>) : (<>
          {invoice.qr_image && <img src={`data:image/png;base64,${invoice.qr_image}`} alt="QR" style={{ width: 180, height: 180, margin: "12px auto", display: "block", borderRadius: 12 }}/>}
          {invoice.urls && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", margin: "12px 0" }}>{invoice.urls.slice(0, 6).map((b, i) => <a key={i} href={b.link} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 14px", borderRadius: 8, background: T.cardAlt, color: T.textMid, textDecoration: "none", fontSize: 12, fontWeight: 600, border: `1px solid ${T.border}` }}>{b.name}</a>)}</div>}
        </>)}
        <button onClick={onClose} style={{ width: "100%", marginTop: 10, padding: "10px", background: "transparent", border: "none", color: T.textDim, cursor: "pointer", fontFamily: F, fontSize: 13 }}>Хаах</button>
      </div>
    </div>
  );
}

function Dashboard({ profile, serviceType, mealPlan, workoutPlan, onRestart }) {
  const [tab, setTab] = useState(serviceType === "workout" ? "workout" : "meal");
  const [mealDay, setMealDay] = useState(0);
  const [workDay, setWorkDay] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [showPay, setShowPay] = useState(false);

  const goalMap = { lose: "Жин хасах", gain: "Булчин нэмэх", maintain: "Жин хадгалах", comp: "Тэмцээний бэлтгэл", health: "Эрүүл мэнд" };
  let bmr = profile.gender === "male" ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5 : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  const am = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  const tdee = Math.round(bmr * (am[profile.activity] || 1.4));
  const gc = { lose: -500, gain: 400, maintain: 0, comp: -600, health: -200 };
  const targetCal = tdee + (gc[profile.goal] || 0);
  const macros = { protein: Math.round(profile.weight * 2.2), carbs: Math.round((targetCal * 0.4) / 4), fat: Math.round((targetCal * 0.25) / 9) };
  const hasMeal = serviceType !== "workout"; const hasWorkout = serviceType !== "meal";
  const mDays = mealPlan?.days || []; const wDays = workoutPlan?.days || [];
  const totalItems = mDays.reduce((s, d) => s + (d.meals?.length || 0), 0) + wDays.reduce((s, d) => s + (d.exercises?.length || 0), 0);
  const progress = totalItems > 0 ? Math.round((completed.size / totalItems) * 100) : 0;
  const toggleDone = (key) => setCompleted(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const tabs = [];
  if (hasMeal) tabs.push({ id: "meal", label: "Хоол", icon: "🥗", color: T.accent });
  if (hasWorkout) tabs.push({ id: "workout", label: "Дасгал", icon: "🏋️", color: T.orange });
  tabs.push({ id: "stats", label: "Тойм", icon: "📊", color: T.blue });

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: F }}>
      {showPay && <PaymentModal onClose={() => setShowPay(false)} />}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowPay(true)} style={{ background: T.gradWarm, border: "none", color: "#fff", padding: "7px 14px", borderRadius: 10, fontSize: 11, cursor: "pointer", fontFamily: F, fontWeight: 600 }}>Premium</button>
          <button onClick={onRestart} style={{ background: T.cardAlt, border: `1px solid ${T.border}`, color: T.textDim, padding: "7px 14px", borderRadius: 10, fontSize: 11, cursor: "pointer", fontFamily: F, fontWeight: 500 }}>Шинээр</button>
        </div>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
          <span style={{ color: T.textDim }}>Гүйцэтгэл</span>
          <span style={{ color: T.accent, fontWeight: 600 }}>{progress}%</span>
        </div>
        <div style={{ background: T.cardAlt, borderRadius: 4, height: 3, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: T.grad, borderRadius: 4, transition: "width 0.3s" }}/>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, padding: "14px 20px", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: F, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", background: tab === t.id ? t.color : T.cardAlt, color: tab === t.id ? "#fff" : T.textDim }}>{t.icon} {t.label}</button>
        ))}
      </div>
      <div style={{ padding: "8px 20px 40px", maxWidth: 560, margin: "0 auto" }}>
        {tab === "stats" && (<>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[{ l: "Зорилго", v: goalMap[profile.goal], c: T.accent }, { l: "Өдрийн калори", v: `${targetCal} kcal`, c: T.orange }, { l: "Одоогийн жин", v: `${profile.weight} кг`, c: T.textMid }, { l: "Зорилтот жин", v: `${profile.targetWeight} кг`, c: T.blue }].map((s, i) => (
              <div key={i} style={{ background: T.card, borderRadius: 14, padding: "16px", border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, color: T.textDim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 500 }}>{s.l}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[{ l: "Уураг", v: macros.protein, c: T.accent }, { l: "Нүүрс ус", v: macros.carbs, c: T.blue }, { l: "Өөх тос", v: macros.fat, c: T.orange }].map((m, i) => (
              <div key={i} style={{ background: T.card, borderRadius: 14, padding: "14px 10px", border: `1px solid ${T.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: T.textDim, marginBottom: 3 }}>{m.l}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: m.c }}>{m.v}<span style={{ fontSize: 11, color: T.textDim }}>г</span></div>
              </div>
            ))}
          </div>
          {(mealPlan?.tips || workoutPlan?.tips) && (
            <div style={{ background: T.accentDim, borderRadius: 14, padding: 16, border: `1px solid ${T.accent}22` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.accent, marginBottom: 8 }}>Зөвлөмж</div>
              {[...(mealPlan?.tips || []), ...(workoutPlan?.tips || [])].map((t, i) => <div key={i} style={{ fontSize: 13, color: T.textMid, marginBottom: 4, lineHeight: 1.6 }}>• {t}</div>)}
            </div>
          )}
        </>)}
        {tab === "meal" && hasMeal && (<>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }}>
            {mDays.map((d, i) => <button key={i} onClick={() => setMealDay(i)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: F, fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", background: mealDay === i ? T.accent : T.cardAlt, color: mealDay === i ? "#fff" : T.textDim }}>{d.dayLabel || `${i + 1}-р өдөр`}</button>)}
          </div>
          {(mDays[mealDay]?.meals || []).map((m, i) => {
            const key = `m-${mealDay}-${i}`; const done = completed.has(key);
            return (
              <div key={i} style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${done ? T.accent + "44" : T.border}`, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.accent }}>{m.time}</span>
                  {m.calories && <span style={{ fontSize: 12, fontWeight: 600, color: T.orange, background: T.orangeDim, padding: "3px 10px", borderRadius: 8 }}>{m.calories} kcal</span>}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{m.name}</div>
                {m.ingredients && <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.7 }}>{m.ingredients.map((ing, j) => <div key={j}>• {ing}</div>)}</div>}
                {m.description && <div style={{ fontSize: 13, color: T.textDim, marginTop: 4, lineHeight: 1.5 }}>{m.description}</div>}
                <button onClick={() => toggleDone(key)} style={{ marginTop: 10, width: "100%", padding: "10px", borderRadius: 10, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: F, background: done ? T.cardAlt : T.accentDim, color: done ? T.textDim : T.accent }}>
                  {done ? "✅ Идсэн" : "Идсэн гэж тэмдэглэх"}
                </button>
              </div>
            );
          })}
        </>)}
        {tab === "workout" && hasWorkout && (<>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }}>
            {wDays.map((d, i) => <button key={i} onClick={() => setWorkDay(i)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: F, fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", background: workDay === i ? T.orange : T.cardAlt, color: workDay === i ? "#fff" : T.textDim }}>{d.dayLabel || `${i + 1}-р өдөр`}</button>)}
          </div>
          {wDays[workDay] && <div style={{ background: T.orangeDim, borderRadius: 12, padding: "12px 16px", marginBottom: 12, border: `1px solid ${T.orange}22` }}><span style={{ fontSize: 14, fontWeight: 700, color: T.orange }}>{wDays[workDay].type || wDays[workDay].dayLabel}</span></div>}
          {(wDays[workDay]?.exercises || []).map((ex, i) => {
            const key = `w-${workDay}-${i}`; const done = completed.has(key);
            return (
              <div key={i} style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${done ? T.orange + "44" : T.border}`, marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <button onClick={() => toggleDone(key)} style={{ width: 28, height: 28, borderRadius: 8, border: `2px solid ${done ? T.orange : T.border}`, background: done ? T.orangeDim : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                  {done && <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke={T.orange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, textDecoration: done ? "line-through" : "none", color: done ? T.textDim : T.text }}>{ex.name}</div>
                  <div style={{ fontSize: 13, color: T.textDim }}>{ex.detail}</div>
                  {ex.note && <div style={{ fontSize: 12, color: T.accent, marginTop: 4 }}>{ex.note}</div>}
                </div>
              </div>
            );
          })}
        </>)}
      </div>
    </div>
  );
}

function fallbackMeal(a) {
  const lo = a.goal === "lose" || a.goal === "comp";
  return { days: [
    { dayLabel: "1-р өдөр", meals: [
      { time: "Өглөөний цай (07:00)", name: "Өндөгний омлет, ногоотой", calories: lo ? 300 : 450, ingredients: ["Өндөг 3 ширхэг", "Шпинат 50 грамм", "Улаан лооль 1 ширхэг", "Ногоон цай"], description: "Өндгийг ногоотой хамт шарна" },
      { time: "Өдрийн хоол (12:00)", name: "Тахианы цээжтэй хүрэн будаа", calories: lo ? 400 : 550, ingredients: ["Тахианы цээж 150 грамм", "Хүрэн будаа 80 грамм", "Лууван, байцааны салат"], description: "Тахиаг жигнэж эсвэл шарна" },
      { time: "Зууш (15:00)", name: "Грек йогурт, жимстэй", calories: lo ? 150 : 250, ingredients: ["Грек йогурт 200 грамм", "Аньс 50 грамм"], description: "Хольж идэх" },
      { time: "Оройн хоол (19:00)", name: "Загасны шөл", calories: lo ? 350 : 480, ingredients: ["Загас 150 грамм", "Төмс 1 ширхэг", "Лууван, сонгино"], description: "Ногоотой хамт чанах" },
    ]},
    { dayLabel: "2-р өдөр", meals: [
      { time: "Өглөөний цай (07:00)", name: "Овъёосны гурилтай бялуу", calories: lo ? 320 : 420, ingredients: ["Овъёосны гурил 50 грамм", "Өндөг 1 ширхэг", "Банан хагас"], description: "Бялуу хийж шарна" },
      { time: "Өдрийн хоол (12:00)", name: "Үхрийн махтай цуйван", calories: lo ? 420 : 580, ingredients: ["Үхрийн мах 120 грамм", "Гоймон 100 грамм", "Лууван, чинжүү"], description: "Монгол цуйван" },
      { time: "Зууш (15:00)", name: "Уургийн коктейль", calories: lo ? 170 : 280, ingredients: ["Банан 1 ширхэг", "Сүү 200 мл", "Уураг нунтаг 1 халбага"], description: "Холигч машинд хийнэ" },
      { time: "Оройн хоол (19:00)", name: "Жигнэсэн бууз", calories: lo ? 380 : 500, ingredients: ["Тахианы мах 150 грамм", "Гурил", "Сонгино, сармис"], description: "Жигнэсэн бууз — шарснаас эрүүл" },
    ]},
    { dayLabel: "3-р өдөр", meals: [
      { time: "Өглөөний цай (07:00)", name: "Өндөг, талх, авокадо", calories: lo ? 300 : 420, ingredients: ["Өндөг 2 ширхэг", "Буудайн талх 1 зүсэм", "Авокадо хагас"], description: "Талхан дээр тавих" },
      { time: "Өдрийн хоол (12:00)", name: "Хонины махтай шөл", calories: lo ? 400 : 550, ingredients: ["Хонины мах 120 грамм", "Төмс, лууван", "Гоймон 50 грамм"], description: "Монгол маханшөл" },
      { time: "Зууш (15:00)", name: "Самар, алим", calories: lo ? 160 : 230, ingredients: ["Бадам 20 грамм", "Алим 1 ширхэг"], description: "Хольж идэх" },
      { time: "Оройн хоол (19:00)", name: "Загас, ногооны салат", calories: lo ? 340 : 450, ingredients: ["Загас 150 грамм", "Өргөст хэмх, лооль", "Оливын тос"], description: "Загасыг шарж, салаттай идэх" },
    ]},
  ], tips: ["Өдөрт 3–4 литр ус уугаарай", "Орой 20:00-оос хойш хоол идэхгүй байх нь зүйтэй", "Хоол бүрд уураг заавал оруулаарай", "Нойрыг 7–8 цаг байлгах нь жин хасалтад чухал", "Чихэртэй ундааг хязгаарлаарай"] };
}

function fallbackWorkout(a) {
  const days = Number(a.workoutDays) || 4;
  const t = [
    { dayLabel: "1-р өдөр", type: "Цээж + гурвалжин булчин", exercises: [
      { name: "Хэвтээ шахалт (Bench Press)", detail: "4×10, амрах 60 секунд" },
      { name: "Incline Dumbbell Press", detail: "4×12" },
      { name: "Cable Fly", detail: "3×15" },
      { name: "Tricep Dip", detail: "3×12" },
      { name: "Rope Pushdown", detail: "3×15" },
      { name: "Зүрхний дасгал (HIIT)", detail: "15 минут" },
    ]},
    { dayLabel: "2-р өдөр", type: "Нуруу + бицепс", exercises: [
      { name: "Суурь татах (Deadlift)", detail: "4×8" },
      { name: "Lat Pulldown", detail: "4×12" },
      { name: "Seated Row", detail: "4×12" },
      { name: "Barbell Curl", detail: "3×12" },
      { name: "Hammer Curl", detail: "3×15" },
    ]},
    { dayLabel: "3-р өдөр", type: "Хөл + хэвлий", exercises: [
      { name: "Суниалт (Squat)", detail: "5×8" },
      { name: "Romanian Deadlift", detail: "4×10" },
      { name: "Leg Press", detail: "4×15" },
      { name: "Calf Raise", detail: "4×20" },
      { name: "Хавтан (Plank)", detail: "3×60 секунд" },
    ]},
    { dayLabel: "4-р өдөр", type: "Мөр + өндөр эрчимтэй", exercises: [
      { name: "Overhead Press", detail: "4×10" },
      { name: "Lateral Raise", detail: "4×15" },
      { name: "Face Pull", detail: "3×20" },
      { name: "HIIT давталт", detail: "4 раунд: Burpee ×10, Jump Squat ×15, Mountain Climber ×20" },
    ]},
    { dayLabel: "5-р өдөр", type: "Бүтэн бие", exercises: [
      { name: "Squat", detail: "4×10" },
      { name: "Bench Press", detail: "4×10" },
      { name: "Row", detail: "4×10" },
      { name: "Kettlebell Swing", detail: "3×20" },
      { name: "Зүрхний дасгал", detail: "20 минут" },
    ]},
    { dayLabel: "6-р өдөр", type: "Зүрхний дасгал + хэвлий", exercises: [
      { name: "HIIT гүйлт", detail: "25 минут" },
      { name: "Хавтан (Plank)", detail: "3×60 секунд" },
      { name: "Russian Twist", detail: "3×20" },
      { name: "Leg Raise", detail: "3×15" },
    ]},
  ];
  return { days: t.slice(0, days), tips: ["Дасгалын өмнө 5–10 минут халаалт хийгээрэй", "Бүтэн биеийн сунгалтыг бүү мартаарай", "7–8 цаг унтах нь булчин сэргэхэд маш чухал", "Дасгалын үед усаа сайн уугаарай"] };
}

export default function Home() {
  const [page, setPage] = useState("landing");
  const [serviceType, setServiceType] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);

  const restart = () => { setPage("landing"); setServiceType(null); setProfile(null); setMealPlan(null); setWorkoutPlan(null); };

  const generate = async (answers) => {
    setProfile(answers); setPage("loading");
    if (serviceType !== "workout") {
      try { const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: answers, serviceType: "meal" }) }); const d = await r.json(); setMealPlan(d.success ? d.plan : fallbackMeal(answers)); } catch { setMealPlan(fallbackMeal(answers)); }
    }
    if (serviceType !== "meal") {
      try { const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: answers, serviceType: "workout" }) }); const d = await r.json(); setWorkoutPlan(d.success ? d.plan : fallbackWorkout(answers)); } catch { setWorkoutPlan(fallbackWorkout(answers)); }
    }
    setPage("dashboard");
  };

  if (page === "landing") return <Landing onStart={() => setPage("service")} />;
  if (page === "service") return <ServiceSelect onSelect={s => { setServiceType(s); setPage("quiz"); }} onBack={() => setPage("landing")} />;
  if (page === "quiz") return <Quiz serviceType={serviceType} onComplete={generate} onBack={() => setPage("service")} />;
  if (page === "loading") return <Loading serviceType={serviceType} />;
  if (page === "dashboard") return <Dashboard profile={profile} serviceType={serviceType} mealPlan={mealPlan} workoutPlan={workoutPlan} onRestart={restart} />;
  return null;
}
