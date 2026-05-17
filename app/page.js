"use client";
import { useState, useEffect, useRef } from "react";

const F = `'DM Sans', -apple-system, system-ui, sans-serif`;
const GRAD = "linear-gradient(135deg, #7c3aed, #4f46e5)";

function getQuizSteps(svc) {
  const base = [
    { id: "gender", q: "Таны хүйс", options: [{ label: "Эрэгтэй", value: "male", emoji: "👨" }, { label: "Эмэгтэй", value: "female", emoji: "👩" }] },
    { id: "age", q: "Таны нас", type: "number", placeholder: "25", unit: "нас" },
    { id: "weight", q: "Одоогийн жин", type: "number", placeholder: "75", unit: "кг" },
    { id: "targetWeight", q: "Зорилтот жин", type: "number", placeholder: "68", unit: "кг" },
    { id: "height", q: "Таны өндөр", type: "number", placeholder: "175", unit: "см" },
    { id: "goal", q: "Гол зорилго", options: [
      { label: "Жин хасах", value: "lose", emoji: "🔥" }, { label: "Булчин нэмэх", value: "gain", emoji: "💪" },
      { label: "Жин хадгалах", value: "maintain", emoji: "⚖️" }, { label: "Тэмцээний бэлтгэл", value: "comp", emoji: "🏆" },
      { label: "Эрүүл мэнд", value: "health", emoji: "❤️" },
    ]},
    { id: "activity", q: "Идэвхийн түвшин", options: [
      { label: "Суудлын амьдралтай", value: "sedentary", emoji: "🪑" }, { label: "Бага идэвхтэй", value: "light", emoji: "🚶" },
      { label: "Дунд идэвхтэй", value: "moderate", emoji: "🏃" }, { label: "Маш идэвхтэй", value: "active", emoji: "⚡" },
    ]},
    { id: "sleep", q: "Нойрны хэмжээ", options: [
      { label: "5 цагаас бага", value: "<5", emoji: "😴" }, { label: "5–6 цаг", value: "5-6", emoji: "🌙" },
      { label: "7–8 цаг", value: "7-8", emoji: "😊" }, { label: "8+ цаг", value: "8+", emoji: "💤" },
    ]},
    { id: "water", q: "Усны хэрэглээ", options: [
      { label: "1 литрээс бага", value: "<1L", emoji: "💧" }, { label: "1–2 литр", value: "1-2L", emoji: "🥤" },
      { label: "2–3 литр", value: "2-3L", emoji: "🫗" }, { label: "3+ литр", value: "3L+", emoji: "🌊" },
    ]},
  ];
  const mealQs = [
    { id: "cookTime", q: "Хоол бэлдэх цаг", options: [
      { label: "15 минут", value: "15", emoji: "⏱️" }, { label: "30 минут", value: "30", emoji: "🍳" },
      { label: "45–60 минут", value: "60", emoji: "👨‍🍳" }, { label: "Хамаагүй", value: "any", emoji: "♾️" },
    ]},
    { id: "meals_per_day", q: "Өдөрт хэдэн удаа хооллох вэ?", options: [
      { label: "3 удаа", value: "3", emoji: "🍽️" }, { label: "4 удаа", value: "4", emoji: "🥗" }, { label: "5–6 удаа", value: "5", emoji: "🔄" },
    ]},
    { id: "restrictions", q: "Хоолны хязгаарлалт", type: "multi", options: [
      { label: "Байхгүй", value: "none", emoji: "✅" }, { label: "Сүү", value: "dairy", emoji: "🥛" },
      { label: "Глютен", value: "gluten", emoji: "🌾" }, { label: "Самар", value: "nuts", emoji: "🥜" },
      { label: "Цагаан хоолтон", value: "veg", emoji: "🥬" },
    ]},
  ];
  const workQs = [
    { id: "experience", q: "Дасгалын туршлага", options: [
      { label: "Шинэхэн", value: "beginner", emoji: "🌱" }, { label: "Дунд", value: "intermediate", emoji: "🏋️" },
      { label: "Туршлагатай", value: "advanced", emoji: "💪" },
    ]},
    { id: "workoutDays", q: "Долоо хоногт хэдэн өдөр?", options: [
      { label: "3 өдөр", value: "3", emoji: "3️⃣" }, { label: "4 өдөр", value: "4", emoji: "4️⃣" },
      { label: "5 өдөр", value: "5", emoji: "5️⃣" }, { label: "6 өдөр", value: "6", emoji: "6️⃣" },
    ]},
    { id: "workoutType", q: "Дуртай дасгал", type: "multi", options: [
      { label: "Жин өргөх", value: "weights", emoji: "🏋️" }, { label: "Cardio", value: "cardio", emoji: "🏃" },
      { label: "HIIT", value: "hiit", emoji: "⚡" }, { label: "Йога", value: "yoga", emoji: "🧘" },
    ]},
    { id: "equipment", q: "Тоног төхөөрөмж", options: [
      { label: "Фитнесс зал", value: "gym", emoji: "🏢" }, { label: "Гэрийн тоног", value: "home", emoji: "🏠" },
      { label: "Тоноггүй", value: "none", emoji: "🙌" },
    ]},
    { id: "injury", q: "Гэмтэл бий юу?", options: [
      { label: "Байхгүй", value: "none", emoji: "✅" }, { label: "Нуруу", value: "back", emoji: "🔙" },
      { label: "Өвдөг", value: "knee", emoji: "🦵" }, { label: "Мөр", value: "shoulder", emoji: "💪" },
    ]},
  ];
  if (svc === "meal") return [...base, ...mealQs];
  if (svc === "workout") return [...base, ...workQs];
  return [...base, ...mealQs, ...workQs];
}

const BackIcon = <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M19 12H5m6 6l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ArrowR = <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Chk = <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

function LogoNav() {
  return (
    <div style={{ fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 8, fontFamily: F }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px #7c3aed30" }}>
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      Balance<span style={{ color: "#7c3aed" }}>Hub</span>
    </div>
  );
}

function useInView(ref) {
  const [v, setV] = useState(false);
  useEffect(() => { if (!ref.current) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 }); o.observe(ref.current); return () => o.disconnect(); }, [ref]);
  return v;
}
function Sec({ children, bg, style = {} }) {
  const r = useRef(null); const v = useInView(r);
  return <section ref={r} style={{ padding: "64px 24px", background: bg || "transparent", opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease", ...style }}><div style={{ maxWidth: 680, margin: "0 auto" }}>{children}</div></section>;
}

// ═══════ LANDING ═══════
function Landing({ onStart }) {
  const [scrollY, setScrollY] = useState(0);
  const [faqOpen, setFaqOpen] = useState(null);
  const [revIdx, setRevIdx] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

  const reviews = [
    { name: "Б. Солонго", age: 28, lost: "12 кг", time: "3 сар", text: "Фитнесс багшид 150,000₮ төлдөг байсан. BalanceHub ашиглаад илүү сайн үр дүн гарсан." },
    { name: "Д. Бат-Эрдэнэ", age: 32, lost: "5 кг булчин+", time: "2 сар", text: "Хоол дасгал хоёуланг нь нэг дороос авснаар бүх зүйл хялбар боллоо." },
    { name: "М. Оюунчимэг", age: 29, lost: "6 кг", time: "1 сар", text: "Хүүхэд төрүүлснээс хойш жин хасаж чадахгүй байсан. Яг тохирсон хоол зааж өгсөн." },
    { name: "Т. Мөнхбаяр", age: 41, lost: "Өвдөлт ↓", time: "2 сар", text: "Гэмтэлтэй хүнд тохирсон дасгал маш сайн зааж өгдөг." },
    { name: "С. Алтанцэцэг", age: 26, lost: "8 кг", time: "2 сар", text: "Монгол хоол байдаг нь маш сайн. Бууз цуйван ч оруулсан." },
    { name: "Ц. Болормаа", age: 22, lost: "5 кг", time: "1 сар", text: "Оюутан. Фитнесс багштай ижил чанартай төлөвлөгөө маш хямд авсан." },
    { name: "Р. Батбаяр", age: 29, lost: "10 кг", time: "2 сар", text: "15 минутын хоол бэлдэх сонголт надад яг таарсан." },
    { name: "Л. Ганбат", age: 45, lost: "15 кг", time: "5 сар", text: "45 настай ч хожуу биш гэдгийг BalanceHub харуулсан." },
    { name: "Ш. Энхтүвшин", age: 37, lost: "20 кг", time: "5 сар", text: "Урт хугацааны төлөвлөгөөгөөр тогтвортой хасалаа." },
  ];
  const vis = reviews.slice(revIdx, revIdx + 3);
  const faqs = [
    { q: "BalanceHub үнэгүй юу?", a: "Үндсэн төлөвлөгөө үнэгүй. Premium сарын 9,900₮." },
    { q: "Хэр хурдан үр дүн гарах вэ?", a: "Ихэнхдээ эхний 2 долоо хоногт өөрчлөлт мэдэрдэг." },
    { q: "Монгол хоол бий юу?", a: "Тийм! Бууз, цуйван, маханшөл зэрэг уламжлалт хоолноос орчин үеийн хоол хүртэл." },
    { q: "Фитнесс зал шаардлагатай юу?", a: "Үгүй. Гэрийн тоног эсвэл тоноггүйгээр хийж болно." },
    { q: "Гэмтэлтэй бол тохирох уу?", a: "Тийм. AI гэмтэлд тохирсон дасгал зөвлөнө." },
    { q: "Мөчлөгийн хооллолт гэж юу?", a: "Сарын тэмдгийн 4 үе шатад тохирсон хоол дасгалын зөвлөмж." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fefefe", color: "#0f172a", fontFamily: F }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet" />
      <style>{`@keyframes gm{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`}</style>

      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", background: scrollY > 50 ? "rgba(255,255,255,0.92)" : "transparent", backdropFilter: scrollY > 50 ? "blur(16px)" : "none", borderBottom: scrollY > 50 ? "1px solid #f1f5f9" : "1px solid transparent", position: "sticky", top: 0, zIndex: 100, transition: "all 0.3s" }}>
        <LogoNav />
        <button onClick={onStart} style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: GRAD, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: F }}>Эхлэх</button>
      </nav>

      {/* Hero */}
      <section style={{ padding: "72px 24px 48px", textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
        <span style={{ display: "inline-block", padding: "6px 18px", borderRadius: 24, background: "linear-gradient(135deg, #ede9fe, #e0e7ff)", color: "#6d28d9", fontSize: 12, fontWeight: 700, marginBottom: 20 }}>✨ 10,000+ хэрэглэгч итгэн ашиглаж байна</span>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1.5 }}>
          Жин хасах замыг<br/><span style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb, #7c3aed)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gm 4s ease infinite" }}>хялбар болгоё</span>
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 520 }}>
          Таны биед тулгуурлан AI эхний өдрөөс яг тохирсон хоол, дасгалын төлөвлөгөө гаргана. Фитнесс багшаас <strong style={{ color: "#7c3aed" }}>10 дахин хямд.</strong>
        </p>
        <button onClick={onStart} style={{ padding: "18px 56px", borderRadius: 16, border: "none", background: GRAD, color: "#fff", fontWeight: 700, fontSize: 17, cursor: "pointer", fontFamily: F, boxShadow: "0 8px 32px #7c3aed30" }}>Үнэгүй эхлэх →</button>
        <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 12 }}>Карт шаардлагагүй • 2 минутад бэлэн</p>
      </section>

      {/* Stats */}
      <Sec bg="#f8fafc" style={{ padding: "48px 24px", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[{ i: "👥", v: "10,000+", l: "Хэрэглэгч" }, { i: "⚖️", v: "25,000+ кг", l: "Хассан жин" }, { i: "⭐", v: "4.8 / 5", l: "Үнэлгээ" }, { i: "🏆", v: "98%", l: "Сэтгэл ханамж" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>{s.i}</div><div style={{ fontSize: 28, fontWeight: 800, color: "#7c3aed", marginTop: 4 }}>{s.v}</div><div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{s.l}</div></div>
          ))}
        </div>
      </Sec>

      {/* Features */}
      <Sec>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 32 }}>Шаардлагатай бүх хэрэгсэл</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { i: "📋", t: "Хувийн хоолны цэс", d: "AI таны биед тохирсон калори макро тооцоотой цэс үүсгэнэ", c: "#7c3aed" },
            { i: "🌸", t: "Мөчлөгийн хооллолт", d: "Сарын тэмдгийн үе шатад тохирсон хоол дасгалын зөвлөмж", c: "#e11d48" },
            { i: "🏋️", t: "Дасгалын хуваарь", d: "Зорилго туршлага тоногт тохирсон сет давталт бүхий хуваарь", c: "#0284c7" },
            { i: "📊", t: "Хяналтын самбар", d: "Хоол дасгалаа тэмдэглэж гүйцэтгэлээ өдөр бүр хянана", c: "#16a34a" },
            { i: "💧", t: "Ус нойрны трекер", d: "Усны хэрэглээ нойрны хэмжээг бүртгэж хянана", c: "#ea580c" },
            { i: "🤖", t: "AI зөвлөгч", d: "24/7 AI хоолзүйчээс хувийн зөвлөмж аваарай", c: "#7c3aed" },
          ].map((f, i) => (
            <div key={i} style={{ padding: "22px", background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 26, width: 48, height: 48, borderRadius: 14, background: `${f.c}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{f.i}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: f.c }}>{f.t}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </Sec>

      {/* Pricing */}
      <Sec bg="#f8fafc" style={{ borderTop: "1px solid #f1f5f9" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 28 }}>Фитнесс багшаас <span style={{ color: "#7c3aed" }}>10x хямд</span></h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "#fff", borderRadius: 22, padding: "28px 20px", border: "1px solid #e2e8f0", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Фитнесс багш</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#ef4444" }}>150,000₮</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>сар бүр</div>
            {["7 хоногт 1–2 уулзалт", "Хоол багтаагүй", "Цаг товлох шаардлагатай"].map((t, i) => <div key={i} style={{ fontSize: 12, color: "#94a3b8", padding: "4px 0" }}>✗ {t}</div>)}
          </div>
          <div style={{ background: "#fff", borderRadius: 22, padding: "28px 20px", border: "2px solid #7c3aed", textAlign: "center", position: "relative", boxShadow: "0 8px 40px #7c3aed12" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 16px", borderRadius: 10, background: GRAD, color: "#fff", fontSize: 11, fontWeight: 700 }}>Хэмнэлттэй</div>
            <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>BalanceHub</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#7c3aed" }}>9,900₮</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>сар бүр</div>
            {["24/7 AI зөвлөгч", "Хоол + дасгал багтсан", "Мөчлөгийн хооллолт ✨"].map((t, i) => <div key={i} style={{ fontSize: 12, color: "#16a34a", padding: "4px 0" }}>✓ {t}</div>)}
          </div>
        </div>
      </Sec>

      {/* Testimonials */}
      <Sec>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 24 }}>Бодит үр дүн</h2>
        {vis.map((r, i) => (
          <div key={revIdx + i} style={{ background: "#f8fafc", borderRadius: 18, padding: "20px", border: "1px solid #e2e8f0", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div><div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>{r.age} нас • {r.time}</div></div>
              <div style={{ padding: "4px 12px", borderRadius: 8, background: "#ede9fe", color: "#6d28d9", fontSize: 13, fontWeight: 700 }}>−{r.lost}</div>
            </div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>"{r.text}"</p>
            <div style={{ marginTop: 6, color: "#f59e0b", letterSpacing: 2, fontSize: 13 }}>★★★★★</div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 14 }}>
          <button onClick={() => setRevIdx(i => Math.max(i - 3, 0))} disabled={revIdx === 0} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: revIdx === 0 ? "#cbd5e1" : "#0f172a", cursor: "pointer", fontSize: 14, fontFamily: F }}>←</button>
          <button onClick={() => setRevIdx(i => Math.min(i + 3, reviews.length - 3))} disabled={revIdx >= reviews.length - 3} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: revIdx >= reviews.length - 3 ? "#cbd5e1" : "#0f172a", cursor: "pointer", fontSize: 14, fontFamily: F }}>→</button>
        </div>
      </Sec>

      {/* FAQ */}
      <Sec bg="#f8fafc" style={{ borderTop: "1px solid #f1f5f9" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 28 }}>Түгээмэл асуултууд</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", padding: "18px 0", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: F }}>
              <span style={{ fontSize: 15, fontWeight: 600, textAlign: "left", color: "#0f172a" }}>{f.q}</span>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: faqOpen === i ? "#7c3aed" : "#f1f5f9", color: faqOpen === i ? "#fff" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, marginLeft: 12 }}>{faqOpen === i ? "−" : "+"}</span>
            </button>
            {faqOpen === i && <div style={{ padding: "0 0 18px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{f.a}</div>}
          </div>
        ))}
      </Sec>

      {/* CTA */}
      <Sec>
        <div style={{ textAlign: "center", background: GRAD, borderRadius: 24, padding: "48px 28px", boxShadow: "0 16px 60px #7c3aed20", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "#ffffff15" }} />
          <div style={{ fontSize: 40, marginBottom: 14 }}>🚀</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Зорилгодоо хүрэх цаг боллоо</h2>
          <p style={{ color: "#e0d4ff", fontSize: 15, marginBottom: 24, lineHeight: 1.6, maxWidth: 400, margin: "0 auto 24px" }}>10,000 гаруй хүн амьдралаа өөрчилсөн. Дараагийнх нь та.</p>
          <button onClick={onStart} style={{ padding: "16px 48px", borderRadius: 14, border: "none", background: "#fff", color: "#7c3aed", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: F }}>Одоо эхлэх →</button>
        </div>
      </Sec>

      <footer style={{ padding: "28px 24px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", textAlign: "center", fontSize: 12, color: "#94a3b8" }}>© 2025 BalanceHub. Бүх эрх хуулиар хамгаалагдсан.</footer>
    </div>
  );
}

// ═══════ SERVICE SELECT ═══════
function ServiceSelect({ onSelect, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#0f172a", fontFamily: F, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 24px" }}><button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>{BackIcon} Буцах</button></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 6 }}>Ямар төлөвлөгөө авах вэ?</h2>
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>Өөрт тохирохоо сонгоно уу</p>
          {[
            { v: "meal", e: "🥗", t: "Хоолны төлөвлөгөө", d: "Калори тооцоотой хоолны цэс", c: "#7c3aed" },
            { v: "workout", e: "🏋️", t: "Дасгалын төлөвлөгөө", d: "Сет давталт бүхий хуваарь", c: "#ea580c" },
            { v: "both", e: "🔥", t: "Бүрэн хослол", d: "Хоол + дасгал нэг дор", c: "#0284c7", rec: true },
          ].map(o => (
            <button key={o.v} onClick={() => onSelect(o.v)} style={{ width: "100%", background: "#f8fafc", borderRadius: 16, padding: "20px", border: "1.5px solid #e2e8f0", cursor: "pointer", fontFamily: F, textAlign: "left", position: "relative", marginBottom: 12, color: "#0f172a" }}>
              {o.rec && <div style={{ position: "absolute", top: -10, right: 16, padding: "4px 14px", borderRadius: 10, background: "linear-gradient(135deg, #0284c7, #0369a1)", color: "#fff", fontSize: 11, fontWeight: 700 }}>Зөвлөмж</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 26, width: 50, height: 50, borderRadius: 14, background: `${o.c}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>{o.e}</div>
                <div><div style={{ fontSize: 16, fontWeight: 700, color: o.c }}>{o.t}</div><div style={{ fontSize: 13, color: "#94a3b8" }}>{o.d}</div></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════ QUIZ ═══════
function Quiz({ serviceType, onComplete, onBack }) {
  const steps = getQuizSteps(serviceType);
  const [step, setStep] = useState(0); const [ans, setAns] = useState({}); const [inp, setInp] = useState(""); const [multi, setMulti] = useState(new Set());
  const cur = steps[step]; const prog = ((step + 1) / steps.length) * 100;
  const goBack = () => { if (step > 0) { setStep(step - 1); setInp(""); setMulti(new Set()); } else onBack(); };
  const next = (id, val) => { const u = { ...ans, [id]: val }; setAns(u); setInp(""); setMulti(new Set()); if (step < steps.length - 1) setTimeout(() => setStep(step + 1), 120); else onComplete(u); };
  const toggleM = (v) => { const n = new Set(multi); if (v === "none") { n.clear(); n.add("none"); } else { n.delete("none"); n.has(v) ? n.delete(v) : n.add(v); } setMulti(n); };
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#0f172a", fontFamily: F, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={goBack} style={{ background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>{BackIcon} Буцах</button>
          <span style={{ fontSize: 12, color: "#94a3b8", background: "#f1f5f9", padding: "4px 14px", borderRadius: 10 }}>{step + 1}/{steps.length}</span>
        </div>
        <div style={{ background: "#f1f5f9", borderRadius: 6, height: 4, overflow: "hidden" }}><div style={{ width: `${prog}%`, height: "100%", background: GRAD, borderRadius: 6, transition: "width 0.3s" }}/></div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, maxWidth: 480, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28, textAlign: "center" }}>{cur.q}</h2>
        {cur.options && !cur.type && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{cur.options.map(o =>
          <button key={o.value} onClick={() => next(cur.id, o.value)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 18px", borderRadius: 14, background: ans[cur.id] === o.value ? "#7c3aed10" : "#f8fafc", border: `1.5px solid ${ans[cur.id] === o.value ? "#7c3aed" : "#e2e8f0"}`, color: "#0f172a", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: F }}><span style={{ fontSize: 22 }}>{o.emoji}</span>{o.label}</button>
        )}</div>}
        {cur.type === "number" && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", borderRadius: 14, padding: "12px 24px", border: "1.5px solid #e2e8f0", width: "100%", maxWidth: 240 }}>
            <input type="number" value={inp} onChange={e => setInp(e.target.value)} placeholder={cur.placeholder} onKeyDown={e => e.key === "Enter" && inp && next(cur.id, Number(inp))} autoFocus style={{ flex: 1, background: "transparent", border: "none", color: "#0f172a", fontSize: 32, fontWeight: 700, outline: "none", fontFamily: F, textAlign: "center", width: "100%" }}/>
            <span style={{ color: "#94a3b8", fontSize: 16 }}>{cur.unit}</span>
          </div>
          <button onClick={() => inp && next(cur.id, Number(inp))} disabled={!inp} style={{ padding: "13px 32px", borderRadius: 14, border: "none", background: inp ? GRAD : "#e2e8f0", color: inp ? "#fff" : "#94a3b8", fontWeight: 600, fontSize: 14, cursor: inp ? "pointer" : "not-allowed", fontFamily: F }}>Үргэлжлүүлэх {ArrowR}</button>
        </div>}
        {cur.type === "multi" && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{cur.options.map(o => {
          const sel = multi.has(o.value);
          return <button key={o.value} onClick={() => toggleM(o.value)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 18px", borderRadius: 14, background: sel ? "#7c3aed10" : "#f8fafc", border: `1.5px solid ${sel ? "#7c3aed" : "#e2e8f0"}`, color: "#0f172a", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: F }}><span style={{ fontSize: 22 }}>{o.emoji}</span>{o.label}{sel && <span style={{ marginLeft: "auto" }}>{Chk}</span>}</button>;
        })}
          <button onClick={() => multi.size > 0 && next(cur.id, [...multi])} disabled={multi.size === 0} style={{ width: "100%", marginTop: 12, padding: "14px", borderRadius: 14, border: "none", background: multi.size > 0 ? GRAD : "#e2e8f0", color: multi.size > 0 ? "#fff" : "#94a3b8", fontWeight: 600, fontSize: 14, cursor: multi.size > 0 ? "pointer" : "not-allowed", fontFamily: F }}>{step === steps.length - 1 ? "Төлөвлөгөө авах" : "Үргэлжлүүлэх"} {ArrowR}</button>
        </div>}
      </div>
    </div>
  );
}

// ═══════ LOADING ═══════
function Loading() {
  const [idx, setIdx] = useState(0); const [dots, setDots] = useState("");
  const msgs = ["Калори тооцоолж байна", "Хоолны цэс бэлдэж байна", "Дасгалын хуваарь зохиож байна", "Төлөвлөгөө боловсруулж байна"];
  useEffect(() => { const a = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400); const b = setInterval(() => setIdx(i => (i + 1) % msgs.length), 2200); return () => { clearInterval(a); clearInterval(b); }; }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#0f172a", fontFamily: F, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 72, height: 72, marginBottom: 28 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid #f1f5f9", borderTopColor: "#7c3aed", animation: "spin 1s linear infinite" }}/>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 24 }}>🔥</div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{msgs[idx]}{dots}</div>
      <div style={{ fontSize: 13, color: "#94a3b8" }}>Түр хүлээнэ үү</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ═══════ DASHBOARD ═══════
function Dashboard({ profile, serviceType, mealPlan, workoutPlan, onRestart }) {
  const [tab, setTab] = useState(serviceType === "workout" ? "workout" : "meal");
  const [mealDay, setMealDay] = useState(0); const [workDay, setWorkDay] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const goalMap = { lose: "Жин хасах", gain: "Булчин нэмэх", maintain: "Хадгалах", comp: "Тэмцээн", health: "Эрүүл мэнд" };
  let bmr = profile.gender === "male" ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5 : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  const tdee = Math.round(bmr * ({ sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }[profile.activity] || 1.4));
  const targetCal = tdee + ({ lose: -500, gain: 400, maintain: 0, comp: -600, health: -200 }[profile.goal] || 0);
  const macros = { p: Math.round(profile.weight * 2.2), c: Math.round((targetCal * 0.4) / 4), f: Math.round((targetCal * 0.25) / 9) };
  const hasMeal = serviceType !== "workout"; const hasWork = serviceType !== "meal";
  const mDays = mealPlan?.days || []; const wDays = workoutPlan?.days || [];
  const total = mDays.reduce((s, d) => s + (d.meals?.length || 0), 0) + wDays.reduce((s, d) => s + (d.exercises?.length || 0), 0);
  const prog = total > 0 ? Math.round((completed.size / total) * 100) : 0;
  const toggle = k => setCompleted(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const tabs = []; if (hasMeal) tabs.push({ id: "meal", l: "🥗 Хоол", c: "#7c3aed" }); if (hasWork) tabs.push({ id: "workout", l: "🏋️ Дасгал", c: "#ea580c" }); tabs.push({ id: "stats", l: "📊 Тойм", c: "#0284c7" });

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#0f172a", fontFamily: F }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <LogoNav />
        <button onClick={onRestart} style={{ background: "#f1f5f9", border: "none", color: "#64748b", padding: "7px 14px", borderRadius: 10, fontSize: 12, cursor: "pointer", fontFamily: F, fontWeight: 500 }}>Шинээр</button>
      </div>
      <div style={{ padding: "12px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}><span style={{ color: "#94a3b8" }}>Гүйцэтгэл</span><span style={{ color: "#7c3aed", fontWeight: 600 }}>{prog}%</span></div>
        <div style={{ background: "#f1f5f9", borderRadius: 4, height: 4, overflow: "hidden" }}><div style={{ width: `${prog}%`, height: "100%", background: GRAD, borderRadius: 4, transition: "width 0.3s" }}/></div>
      </div>
      <div style={{ display: "flex", gap: 4, padding: "14px 24px", overflowX: "auto" }}>
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: F, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", background: tab === t.id ? t.c : "#f1f5f9", color: tab === t.id ? "#fff" : "#94a3b8" }}>{t.l}</button>)}
      </div>
      <div style={{ padding: "8px 24px 40px", maxWidth: 560, margin: "0 auto" }}>
        {tab === "stats" && <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[{ l: "Зорилго", v: goalMap[profile.goal], c: "#7c3aed" }, { l: "Калори", v: `${targetCal} kcal`, c: "#ea580c" }, { l: "Одоо", v: `${profile.weight} кг`, c: "#64748b" }, { l: "Зорилт", v: `${profile.targetWeight} кг`, c: "#0284c7" }].map((s, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: 16, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 500 }}>{s.l}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[{ l: "Уураг", v: macros.p, c: "#7c3aed" }, { l: "Нүүрс ус", v: macros.c, c: "#0284c7" }, { l: "Өөх тос", v: macros.f, c: "#ea580c" }].map((m, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>{m.l}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: m.c }}>{m.v}<span style={{ fontSize: 11, color: "#94a3b8" }}>г</span></div>
              </div>
            ))}
          </div>
          {(mealPlan?.tips || workoutPlan?.tips) && <div style={{ background: "#7c3aed08", borderRadius: 14, padding: 16, border: "1px solid #7c3aed12" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#7c3aed", marginBottom: 8 }}>Зөвлөмж</div>
            {[...(mealPlan?.tips || []), ...(workoutPlan?.tips || [])].map((t, i) => <div key={i} style={{ fontSize: 13, color: "#64748b", marginBottom: 4, lineHeight: 1.6 }}>• {t}</div>)}
          </div>}
        </>}
        {tab === "meal" && hasMeal && <>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }}>
            {mDays.map((d, i) => <button key={i} onClick={() => setMealDay(i)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: F, fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", background: mealDay === i ? "#7c3aed" : "#f1f5f9", color: mealDay === i ? "#fff" : "#94a3b8" }}>{d.dayLabel || `${i + 1}-р өдөр`}</button>)}
          </div>
          {(mDays[mealDay]?.meals || []).map((m, i) => { const k = `m-${mealDay}-${i}`; const d = completed.has(k); return (
            <div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: 16, border: `1px solid ${d ? "#7c3aed33" : "#e2e8f0"}`, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed" }}>{m.time}</span>
                {m.calories && <span style={{ fontSize: 12, fontWeight: 600, color: "#ea580c", background: "#ea580c10", padding: "3px 10px", borderRadius: 8 }}>{m.calories} kcal</span>}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{m.name}</div>
              {m.ingredients && <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{m.ingredients.map((g, j) => <div key={j}>• {g}</div>)}</div>}
              {m.description && <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{m.description}</div>}
              <button onClick={() => toggle(k)} style={{ marginTop: 10, width: "100%", padding: 10, borderRadius: 10, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: F, background: d ? "#f1f5f9" : "#7c3aed10", color: d ? "#94a3b8" : "#7c3aed" }}>{d ? "✅ Идсэн" : "Идсэн гэж тэмдэглэх"}</button>
            </div>
          ); })}
        </>}
        {tab === "workout" && hasWork && <>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }}>
            {wDays.map((d, i) => <button key={i} onClick={() => setWorkDay(i)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: F, fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", background: workDay === i ? "#ea580c" : "#f1f5f9", color: workDay === i ? "#fff" : "#94a3b8" }}>{d.dayLabel || `${i + 1}-р өдөр`}</button>)}
          </div>
          {wDays[workDay] && <div style={{ background: "#ea580c10", borderRadius: 12, padding: "12px 16px", marginBottom: 12, border: "1px solid #ea580c15" }}><span style={{ fontSize: 14, fontWeight: 700, color: "#ea580c" }}>{wDays[workDay].type || wDays[workDay].dayLabel}</span></div>}
          {(wDays[workDay]?.exercises || []).map((ex, i) => { const k = `w-${workDay}-${i}`; const d = completed.has(k); return (
            <div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: 16, border: `1px solid ${d ? "#ea580c33" : "#e2e8f0"}`, marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <button onClick={() => toggle(k)} style={{ width: 28, height: 28, borderRadius: 8, border: `2px solid ${d ? "#ea580c" : "#e2e8f0"}`, background: d ? "#ea580c10" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                {d && <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
              <div><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, textDecoration: d ? "line-through" : "none", color: d ? "#94a3b8" : "#0f172a" }}>{ex.name}</div><div style={{ fontSize: 13, color: "#94a3b8" }}>{ex.detail}</div></div>
            </div>
          ); })}
        </>}
      </div>
    </div>
  );
}

// ═══════ FALLBACKS ═══════
function fbMeal(a) {
  const lo = a.goal === "lose" || a.goal === "comp";
  return { days: [
    { dayLabel: "1-р өдөр", meals: [
      { time: "Өглөө (07:00)", name: "Өндөгний омлет, ногоотой", calories: lo ? 300 : 450, ingredients: ["Өндөг 3ш", "Шпинат 50г", "Лооль 1ш"], description: "Ногоотой хамт шарна" },
      { time: "Өдөр (12:00)", name: "Тахианы цээж, хүрэн будаа", calories: lo ? 400 : 550, ingredients: ["Тахианы цээж 150г", "Хүрэн будаа 80г", "Салат"], description: "Жигнэж шарна" },
      { time: "Зууш (15:00)", name: "Грек йогурт, жимс", calories: lo ? 150 : 250, ingredients: ["Йогурт 200г", "Аньс 50г"], description: "Хольж идэх" },
      { time: "Орой (19:00)", name: "Загасны шөл", calories: lo ? 350 : 480, ingredients: ["Загас 150г", "Төмс 1ш", "Лууван"], description: "Ногоотой чанах" },
    ]},
    { dayLabel: "2-р өдөр", meals: [
      { time: "Өглөө (07:00)", name: "Овъёосны бялуу", calories: lo ? 320 : 420, ingredients: ["Овъёос 50г", "Өндөг 1ш", "Банан хагас"], description: "Шарна" },
      { time: "Өдөр (12:00)", name: "Үхрийн махтай цуйван", calories: lo ? 420 : 580, ingredients: ["Үхрийн мах 120г", "Гоймон 100г", "Лууван"], description: "Цуйван" },
      { time: "Зууш (15:00)", name: "Уургийн коктейль", calories: lo ? 170 : 280, ingredients: ["Банан 1ш", "Сүү 200мл", "Уураг нунтаг"], description: "Холигчид хийнэ" },
      { time: "Орой (19:00)", name: "Жигнэсэн бууз", calories: lo ? 380 : 500, ingredients: ["Тахианы мах 150г", "Гурил", "Сонгино"], description: "Жигнэсэн бууз" },
    ]},
    { dayLabel: "3-р өдөр", meals: [
      { time: "Өглөө (07:00)", name: "Өндөг, талх, авокадо", calories: lo ? 300 : 420, ingredients: ["Өндөг 2ш", "Талх 1 зүсэм", "Авокадо хагас"], description: "Талхан дээр тавих" },
      { time: "Өдөр (12:00)", name: "Хонины махтай шөл", calories: lo ? 400 : 550, ingredients: ["Хонины мах 120г", "Төмс, лууван", "Гоймон 50г"], description: "Маханшөл" },
      { time: "Зууш (15:00)", name: "Самар, алим", calories: lo ? 160 : 230, ingredients: ["Бадам 20г", "Алим 1ш"], description: "Хольж идэх" },
      { time: "Орой (19:00)", name: "Загас, салат", calories: lo ? 340 : 450, ingredients: ["Загас 150г", "Өргөст хэмх, лооль"], description: "Загасыг шарж салаттай" },
    ]},
  ], tips: ["Өдөрт 3–4 литр ус уугаарай", "Орой 20:00-оос хойш хоол идэхгүй", "Хоол бүрд уураг оруулаарай", "7–8 цаг унтаарай"] };
}
function fbWork(a) {
  const d = Number(a.workoutDays) || 4;
  const t = [
    { dayLabel: "1-р өдөр", type: "Цээж + Triceps", exercises: [{ name: "Bench Press", detail: "4×10, амрах 60с" }, { name: "Incline DB Press", detail: "4×12" }, { name: "Cable Fly", detail: "3×15" }, { name: "Tricep Dip", detail: "3×12" }, { name: "HIIT", detail: "15 мин" }] },
    { dayLabel: "2-р өдөр", type: "Нуруу + Biceps", exercises: [{ name: "Deadlift", detail: "4×8" }, { name: "Lat Pulldown", detail: "4×12" }, { name: "Seated Row", detail: "4×12" }, { name: "Barbell Curl", detail: "3×12" }] },
    { dayLabel: "3-р өдөр", type: "Хөл + Хэвлий", exercises: [{ name: "Squat", detail: "5×8" }, { name: "Romanian Deadlift", detail: "4×10" }, { name: "Leg Press", detail: "4×15" }, { name: "Plank", detail: "3×60с" }] },
    { dayLabel: "4-р өдөр", type: "Мөр + HIIT", exercises: [{ name: "Overhead Press", detail: "4×10" }, { name: "Lateral Raise", detail: "4×15" }, { name: "Face Pull", detail: "3×20" }, { name: "HIIT давталт", detail: "4 раунд" }] },
    { dayLabel: "5-р өдөр", type: "Бүтэн бие", exercises: [{ name: "Squat", detail: "4×10" }, { name: "Bench Press", detail: "4×10" }, { name: "Row", detail: "4×10" }, { name: "Cardio", detail: "20 мин" }] },
    { dayLabel: "6-р өдөр", type: "Cardio + Core", exercises: [{ name: "HIIT гүйлт", detail: "25 мин" }, { name: "Plank", detail: "3×60с" }, { name: "Russian Twist", detail: "3×20" }] },
  ];
  return { days: t.slice(0, d), tips: ["Дасгалын өмнө 5–10 мин халаалт", "Бүтэн бие сунгалт хийгээрэй", "7–8 цаг унтаарай", "Ус сайн уугаарай"] };
}

// ═══════ MAIN APP ═══════
export default function Home() {
  const [page, setPage] = useState("landing"); const [svc, setSvc] = useState(null);
  const [profile, setProfile] = useState(null); const [mealPlan, setMealPlan] = useState(null); const [workoutPlan, setWorkoutPlan] = useState(null);
  const restart = () => { setPage("landing"); setSvc(null); setProfile(null); setMealPlan(null); setWorkoutPlan(null); };
  const generate = async (ans) => {
    setProfile(ans); setPage("loading");
    if (svc !== "workout") { try { const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: ans, serviceType: "meal" }) }); const d = await r.json(); setMealPlan(d.success ? d.plan : fbMeal(ans)); } catch { setMealPlan(fbMeal(ans)); } }
    if (svc !== "meal") { try { const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: ans, serviceType: "workout" }) }); const d = await r.json(); setWorkoutPlan(d.success ? d.plan : fbWork(ans)); } catch { setWorkoutPlan(fbWork(ans)); } }
    setPage("dashboard");
  };
  if (page === "landing") return <Landing onStart={() => setPage("service")} />;
  if (page === "service") return <ServiceSelect onSelect={s => { setSvc(s); setPage("quiz"); }} onBack={() => setPage("landing")} />;
  if (page === "quiz") return <Quiz serviceType={svc} onComplete={generate} onBack={() => setPage("service")} />;
  if (page === "loading") return <Loading />;
  if (page === "dashboard") return <Dashboard profile={profile} serviceType={svc} mealPlan={mealPlan} workoutPlan={workoutPlan} onRestart={restart} />;
  return null;
}
