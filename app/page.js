"use client";
import { useState, useEffect, useRef } from "react";

const F = `'DM Sans', -apple-system, system-ui, sans-serif`;
const GRAD = "linear-gradient(135deg, #0ea5e9, #0284c7)";
const ACC = "#0ea5e9";

function getQuizSteps(svc) {
  const base = [
    { id: "gender", q: "Таны хүйс", options: [{ label: "Эрэгтэй", value: "male", emoji: "👨" }, { label: "Эмэгтэй", value: "female", emoji: "👩" }] },
    { id: "age", q: "Таны нас", type: "number", placeholder: "25", unit: "нас", min: 14, max: 80, err: "Нас 14–80 хооронд байна" },
    { id: "weight", q: "Одоогийн биеийн жин", type: "number", placeholder: "75", unit: "кг", min: 30, max: 250, err: "Жин 30–250 кг хооронд байна" },
    { id: "targetWeight", q: "Зорилтот жин", type: "number", placeholder: "68", unit: "кг", min: 30, max: 250, err: "Зорилтот жин 30–250 кг хооронд байна" },
    { id: "height", q: "Таны өндөр", type: "number", placeholder: "175", unit: "см", min: 100, max: 230, err: "Өндөр 100–230 см хооронд байна" },
    { id: "goal", q: "Гол зорилгоо сонгоно уу", options: [
      { label: "Жин хасах", value: "lose", emoji: "🔥" }, { label: "Булчингийн масс нэмэх", value: "gain", emoji: "💪" },
      { label: "Жингээ хадгалах", value: "maintain", emoji: "⚖️" }, { label: "Тэмцээний бэлтгэл", value: "comp", emoji: "🏆" },
      { label: "Эрүүл мэндээ сайжруулах", value: "health", emoji: "❤️" },
    ]},
    { id: "activity", q: "Өдөр тутмын идэвхийн түвшин", options: [
      { label: "Суудлын амьдралтай (оффис)", value: "sedentary", emoji: "🪑" },
      { label: "Бага зэрэг идэвхтэй (7 хоногт 1–2)", value: "light", emoji: "🚶" },
      { label: "Дунд зэрэг идэвхтэй (7 хоногт 3–5)", value: "moderate", emoji: "🏃" },
      { label: "Маш идэвхтэй (7 хоногт 6–7)", value: "active", emoji: "⚡" },
    ]},
    { id: "sleep", q: "Шөнийн нойрны хэмжээ", options: [
      { label: "5 цагаас бага", value: "<5", emoji: "😴" }, { label: "5–6 цаг", value: "5-6", emoji: "🌙" },
      { label: "7–8 цаг", value: "7-8", emoji: "😊" }, { label: "8 цагаас дээш", value: "8+", emoji: "💤" },
    ]},
  ];
  const mealQs = [
    { id: "cookTime", q: "Хоол бэлдэхэд зарцуулах цаг", options: [
      { label: "15 минут (хурдан)", value: "15", emoji: "⏱️" }, { label: "30 минут", value: "30", emoji: "🍳" },
      { label: "45–60 минут", value: "60", emoji: "👨‍🍳" }, { label: "Хамаагүй", value: "any", emoji: "♾️" },
    ]},
    { id: "meals_per_day", q: "Өдөрт хэдэн удаа хооллох вэ?", options: [
      { label: "3 удаа (үндсэн)", value: "3", emoji: "🍽️" }, { label: "4 удаа (зууш орсон)", value: "4", emoji: "🥗" }, { label: "5–6 удаа (бага багаар)", value: "5", emoji: "🔄" },
    ]},
    { id: "restrictions", q: "Хоолны хязгаарлалт (олноор сонгож болно)", type: "multi", options: [
      { label: "Байхгүй", value: "none", emoji: "✅" }, { label: "Сүү бүтээгдэхүүн", value: "dairy", emoji: "🥛" },
      { label: "Глютен", value: "gluten", emoji: "🌾" }, { label: "Самрын харшил", value: "nuts", emoji: "🥜" },
      { label: "Цагаан хоолтон", value: "veg", emoji: "🥬" },
    ]},
  ];
  const workQs = [
    { id: "experience", q: "Дасгалын туршлага", options: [
      { label: "Шинэхэн (0–6 сар)", value: "beginner", emoji: "🌱" }, { label: "Дунд зэрэг (6 сар – 2 жил)", value: "intermediate", emoji: "🏋️" },
      { label: "Туршлагатай (2+ жил)", value: "advanced", emoji: "💪" },
    ]},
    { id: "workoutDays", q: "Долоо хоногт хэдэн өдөр дасгал хийх вэ?", options: [
      { label: "3 өдөр", value: "3", emoji: "3️⃣" }, { label: "4 өдөр", value: "4", emoji: "4️⃣" },
      { label: "5 өдөр", value: "5", emoji: "5️⃣" }, { label: "6 өдөр", value: "6", emoji: "6️⃣" },
    ]},
    { id: "workoutType", q: "Ямар төрлийн дасгалд дуртай вэ?", type: "multi", options: [
      { label: "Жин өргөх", value: "weights", emoji: "🏋️" }, { label: "Зүрх судасны дасгал", value: "cardio", emoji: "🏃" },
      { label: "Өндөр эрчимтэй (HIIT)", value: "hiit", emoji: "⚡" }, { label: "Йога, сунгалт", value: "yoga", emoji: "🧘" },
    ]},
    { id: "equipment", q: "Тоног төхөөрөмж", options: [
      { label: "Фитнесс зал (бүрэн тоноглогдсон)", value: "gym", emoji: "🏢" }, { label: "Гэрийн тоног (дамбелл зэрэг)", value: "home", emoji: "🏠" },
      { label: "Тоног төхөөрөмжгүй", value: "none", emoji: "🙌" },
    ]},
    { id: "injury", q: "Гэмтэл эсвэл өвдөлт бий юу?", options: [
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
const Chk = <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke={ACC} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

function LogoNav() {
  return <div style={{ fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 8, fontFamily: F }}>
    <div style={{ width: 32, height: 32, borderRadius: 10, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>Balance<span style={{ color: ACC }}>Hub</span>
  </div>;
}

function useInView(r) { const [v, setV] = useState(false); useEffect(() => { if (!r.current) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 }); o.observe(r.current); return () => o.disconnect(); }, [r]); return v; }
function Sec({ children, bg, style = {} }) { const r = useRef(null); const v = useInView(r); return <section ref={r} style={{ padding: "64px 24px", background: bg || "transparent", opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease", ...style }}><div style={{ maxWidth: 680, margin: "0 auto" }}>{children}</div></section>; }

// ═══ LANDING ═══
function Landing({ onStart }) {
  const [scrollY, setScrollY] = useState(0);
  const [faqOpen, setFaqOpen] = useState(null);
  const [revIdx, setRevIdx] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  const reviews = [
    { name: "Б. Солонго", age: 28, lost: "12 кг", time: "3 сар", text: "Хувийн дасгалжуулагчид сар бүр 800,000₮ төлдөг байсан. BalanceHub-аар ижил чанартай төлөвлөгөө авч, илүү сайн үр дүнд хүрсэн." },
    { name: "Д. Бат-Эрдэнэ", age: 32, lost: "Булчин 5 кг+", time: "2 сар", text: "Фитнесс залд явдаг ч хоолоо зөв зохицуулж чадахгүй байсан. Хоол, дасгалыг хамтад нь авснаар эмх цэгцтэй боллоо." },
    { name: "М. Оюунчимэг", age: 29, lost: "6 кг", time: "1 сар", text: "Хүүхэд төрүүлсний дараа илүүдэл жинтэй тэмцэж байсан. Надад яг тохирсон хооллолтын зөвлөмж маш их тусалсан." },
    { name: "Т. Мөнхбаяр", age: 41, lost: "Өвдөлт буурсан", time: "2 сар", text: "Нурууны гэмтэлтэй учир олон дасгал хийж болдоггүй. Гэмтэлд тохирсон хуваарь гаргаж өгсөн нь гайхалтай." },
    { name: "С. Алтанцэцэг", age: 26, lost: "8 кг", time: "2 сар", text: "Олон гадаадын апп туршсан боловч монгол хоол байхгүй байдаг. BalanceHub-д бууз, цуйван, шөл бүгд бий." },
    { name: "Ц. Болормаа", age: 22, lost: "5 кг", time: "1 сар", text: "Оюутан учир хувийн дасгалжуулагч авах боломжгүй. Маш хямд үнээр мэргэжлийн төлөвлөгөө авсан." },
  ];
  const vis = reviews.slice(revIdx, revIdx + 3);
  const faqs = [
    { q: "BalanceHub яаж ажилладаг вэ?", a: "Та товч асуулга бөглөхөд хиймэл оюун ухаан таны нас, жин, зорилго, амьдралын хэв маягт тулгуурлан хувийн төлөвлөгөө үүсгэнэ." },
    { q: "Хэр хурдан үр дүн гарах вэ?", a: "Ихэнх хэрэглэгчид эхний 2 долоо хоногт биедээ өөрчлөлт мэдэрдэг. Тогтвортой үр дүнд 1–3 сар шаардлагатай." },
    { q: "Монгол хоол багтсан уу?", a: "Тийм. Бууз, цуйван, маханшөл, банш зэрэг монголчуудын хэрэглэдэг хоолноос эхлээд орчин үеийн эрүүл хоол хүртэл бүгд багтсан." },
    { q: "Гэмтэлтэй хүнд тохирох уу?", a: "Тийм. Асуулгад гэмтлээ зааж өгөхөд хиймэл оюун ухаан тэрийг харгалзан аюулгүй дасгалын хуваарь зөвлөнө." },
    { q: "Төлбөрөө яаж хийх вэ?", a: "QPay-аар дурын банкны картаар эсвэл банкны аппликейшнаар шууд төлж болно." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fefefe", color: "#0f172a", fontFamily: F }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet" />
      <style>{`@keyframes gm{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`}</style>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", background: scrollY > 50 ? "rgba(255,255,255,0.92)" : "transparent", backdropFilter: scrollY > 50 ? "blur(16px)" : "none", borderBottom: scrollY > 50 ? "1px solid #f1f5f9" : "1px solid transparent", position: "sticky", top: 0, zIndex: 100, transition: "all 0.3s" }}>
        <LogoNav /><button onClick={onStart} style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: GRAD, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: F }}>Төлөвлөгөө авах</button>
      </nav>

      <section style={{ padding: "72px 24px 48px", textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
        <span style={{ display: "inline-block", padding: "6px 18px", borderRadius: 24, background: "#e0f2fe", color: "#0369a1", fontSize: 12, fontWeight: 700, marginBottom: 20 }}>✨ 3,000+ хэрэглэгч итгэн ашиглаж байна</span>
        <h1 style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1.5 }}>
          Таны биед яг тохирсон<br/><span style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7, #0ea5e9)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gm 4s ease infinite" }}>хоол, дасгалын төлөвлөгөө</span>
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 540 }}>
          Хиймэл оюун ухаан таны нас, жин, зорилгод тулгуурлан мэргэжлийн түвшний хооллолт, дасгалын хуваарийг гаргаж өгнө. Хувийн дасгалжуулагчаас <strong style={{ color: ACC }}>50–100 дахин хямд.</strong>
        </p>
        <button onClick={onStart} style={{ padding: "18px 56px", borderRadius: 16, border: "none", background: GRAD, color: "#fff", fontWeight: 700, fontSize: 17, cursor: "pointer", fontFamily: F, boxShadow: "0 8px 32px #0ea5e930" }}>Төлөвлөгөө авах →</button>
      </section>

      <Sec bg="#f8fafc" style={{ padding: "48px 24px", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[{ i: "👥", v: "3,000+", l: "Идэвхтэй хэрэглэгч" }, { i: "⚖️", v: "8,000+ кг", l: "Нийт хассан жин" }, { i: "⭐", v: "4.8 / 5", l: "Дундаж үнэлгээ" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>{s.i}</div><div style={{ fontSize: 28, fontWeight: 800, color: ACC }}>{s.v}</div><div style={{ fontSize: 12, color: "#94a3b8" }}>{s.l}</div></div>
          ))}
        </div>
      </Sec>

      <Sec>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 32 }}>Нэг платформ дотор бүх зүйл</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[{ i: "📋", t: "Хоолны төлөвлөгөө", d: "Калори, уураг, нүүрс ус, өөх тосны тооцоотой 1 сарын хоолны цэс", c: ACC },
            { i: "🏋️", t: "Дасгалын хуваарь", d: "Зорилго, туршлага, тоногт тохирсон 1 сарын бүрэн дасгалын төлөвлөгөө", c: "#0284c7" },
            { i: "📊", t: "Хяналтын самбар", d: "Хоол, дасгалаа тэмдэглэж өдөр бүрийн гүйцэтгэлээ бодитоор хянана", c: "#16a34a" },
            { i: "🤖", t: "AI зөвлөгч", d: "Хүссэн үедээ хоолзүйн болон дасгалын хувийн зөвлөмж авах боломжтой", c: "#ea580c" },
          ].map((f, i) => (
            <div key={i} style={{ padding: "22px", background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 26, width: 48, height: 48, borderRadius: 14, background: `${f.c}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{f.i}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: f.c }}>{f.t}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </Sec>

      <Sec bg="#f8fafc" style={{ borderTop: "1px solid #f1f5f9" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>Хувийн дасгалжуулагчаас 50–100 дахин хямд</h2>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: 14, marginBottom: 28 }}>Монголд хувийн дасгалжуулагчийн үйлчилгээ сард 500,000–2,000,000₮ хүрдэг</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { e: "🥗", t: "Хоолны төлөвлөгөө", p: "9,900", fs: ["1 сарын хоолны цэс", "Калори, макро тооцоо", "Монгол хоол багтсан"], rec: false },
            { e: "🏋️", t: "Дасгалын төлөвлөгөө", p: "9,900", fs: ["1 сарын дасгалын хуваарь", "Сет, давталт, амралт", "Гэмтэлд тохирсон"], rec: false },
            { e: "🔥", t: "Хоол + Дасгал", p: "14,900", fs: ["Хоол, дасгал хоёулаа", "Бүрэн хяналтын самбар", "AI зөвлөгч"], rec: true },
          ].map((o, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "24px 16px", border: o.rec ? `2px solid ${ACC}` : "1px solid #e2e8f0", textAlign: "center", position: "relative", boxShadow: o.rec ? "0 8px 40px #0ea5e912" : "none" }}>
              {o.rec && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 16px", borderRadius: 10, background: GRAD, color: "#fff", fontSize: 11, fontWeight: 700 }}>Хамгийн хэмнэлттэй</div>}
              <div style={{ fontSize: 24, marginBottom: 8 }}>{o.e}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{o.t}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: ACC }}>{o.p}₮</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>сард</div>
              {o.fs.map((f, j) => <div key={j} style={{ fontSize: 11, color: "#16a34a", padding: "3px 0" }}>✓ {f}</div>)}
              <button onClick={onStart} style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 10, border: o.rec ? "none" : `1.5px solid ${ACC}`, background: o.rec ? GRAD : "transparent", color: o.rec ? "#fff" : ACC, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: F }}>Сонгох</button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ display: "inline-block", background: "#fff", borderRadius: 14, padding: "16px 24px", border: "1px solid #fecaca" }}>
            <div style={{ fontSize: 13, color: "#ef4444", fontWeight: 700 }}>Хувийн дасгалжуулагч</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#ef4444" }}>500,000–2,000,000₮<span style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}> / сар</span></div>
          </div>
        </div>
      </Sec>

      <Sec>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 24 }}>Хэрэглэгчдийн бодит сэтгэгдэл</h2>
        {vis.map((r, i) => (
          <div key={revIdx + i} style={{ background: "#f8fafc", borderRadius: 18, padding: "20px", border: "1px solid #e2e8f0", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div><div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>{r.age} нас • {r.time}</div></div>
              <div style={{ padding: "4px 12px", borderRadius: 8, background: "#e0f2fe", color: "#0369a1", fontSize: 13, fontWeight: 700 }}>{r.lost}</div>
            </div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>"{r.text}"</p>
            <div style={{ marginTop: 6, color: "#f59e0b", letterSpacing: 2, fontSize: 13 }}>★★★★★</div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 14 }}>
          <button onClick={() => setRevIdx(i => Math.max(i - 3, 0))} disabled={revIdx === 0} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: revIdx === 0 ? "#cbd5e1" : "#0f172a", cursor: "pointer", fontFamily: F }}>←</button>
          <button onClick={() => setRevIdx(i => Math.min(i + 3, reviews.length - 3))} disabled={revIdx >= reviews.length - 3} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: revIdx >= reviews.length - 3 ? "#cbd5e1" : "#0f172a", cursor: "pointer", fontFamily: F }}>→</button>
        </div>
      </Sec>

      <Sec bg="#f8fafc" style={{ borderTop: "1px solid #f1f5f9" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 28 }}>Түгээмэл асуулт, хариулт</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", padding: "18px 0", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: F }}>
              <span style={{ fontSize: 15, fontWeight: 600, textAlign: "left", color: "#0f172a" }}>{f.q}</span>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: faqOpen === i ? ACC : "#f1f5f9", color: faqOpen === i ? "#fff" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, marginLeft: 12 }}>{faqOpen === i ? "−" : "+"}</span>
            </button>
            {faqOpen === i && <div style={{ padding: "0 0 18px", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{f.a}</div>}
          </div>
        ))}
      </Sec>

      <Sec>
        <div style={{ textAlign: "center", background: GRAD, borderRadius: 24, padding: "48px 28px", position: "relative", overflow: "hidden" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Эрүүл амьдралын эхлэл</h2>
          <p style={{ color: "#bae6fd", fontSize: 15, marginBottom: 24, lineHeight: 1.6, maxWidth: 400, margin: "0 auto 24px" }}>3,000 гаруй хүн BalanceHub-аар зорилгодоо хүрсэн. Дараагийн ээлж таных.</p>
          <button onClick={onStart} style={{ padding: "16px 48px", borderRadius: 14, border: "none", background: "#fff", color: ACC, fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: F }}>Одоо эхлэх →</button>
        </div>
      </Sec>
      <footer style={{ padding: "28px 24px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", textAlign: "center", fontSize: 12, color: "#94a3b8" }}>© 2025 BalanceHub. Бүх эрх хуулиар хамгаалагдсан.</footer>
    </div>
  );
}

// ═══ SERVICE SELECT ═══
function ServiceSelect({ onSelect, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#0f172a", fontFamily: F, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 24px" }}><button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>{BackIcon} Буцах</button></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 6 }}>Ямар төлөвлөгөө авах вэ?</h2>
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>Сонголтоо хийгээд асуулга бөглөнө үү</p>
          {[
            { v: "meal", e: "🥗", t: "Хоолны төлөвлөгөө", d: "1 сарын хоолны цэс, калори тооцоо", c: ACC, p: "9,900₮/сар" },
            { v: "workout", e: "🏋️", t: "Дасгалын төлөвлөгөө", d: "1 сарын дасгалын бүрэн хуваарь", c: "#ea580c", p: "9,900₮/сар" },
            { v: "both", e: "🔥", t: "Хоол + Дасгал хослол", d: "Хоёуланг нь нэг дор авч бүрэн хянана", c: "#0284c7", rec: true, p: "14,900₮/сар" },
          ].map(o => (
            <button key={o.v} onClick={() => onSelect(o.v)} style={{ width: "100%", background: "#f8fafc", borderRadius: 16, padding: "20px", border: "1.5px solid #e2e8f0", cursor: "pointer", fontFamily: F, textAlign: "left", position: "relative", marginBottom: 12, color: "#0f172a" }}>
              {o.rec && <div style={{ position: "absolute", top: -10, right: 16, padding: "4px 14px", borderRadius: 10, background: GRAD, color: "#fff", fontSize: 11, fontWeight: 700 }}>Хамгийн хэмнэлттэй</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 26, width: 50, height: 50, borderRadius: 14, background: `${o.c}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>{o.e}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700, color: o.c }}>{o.t}</div><div style={{ fontSize: 13, color: "#94a3b8" }}>{o.d}</div></div>
                <div style={{ fontSize: 14, fontWeight: 700, color: o.c }}>{o.p}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ QUIZ with VALIDATION ═══
function Quiz({ serviceType, onComplete, onBack }) {
  const steps = getQuizSteps(serviceType);
  const [step, setStep] = useState(0); const [ans, setAns] = useState({}); const [inp, setInp] = useState(""); const [multi, setMulti] = useState(new Set()); const [err, setErr] = useState("");
  const cur = steps[step]; const prog = ((step + 1) / steps.length) * 100;
  const goBack = () => { if (step > 0) { setStep(step - 1); setInp(""); setMulti(new Set()); setErr(""); } else onBack(); };
  const validate = (val) => {
    if (cur.min !== undefined && val < cur.min) return cur.err || "Утга хэт бага байна";
    if (cur.max !== undefined && val > cur.max) return cur.err || "Утга хэт их байна";
    return "";
  };
  const next = (id, val) => {
    if (cur.type === "number") { const e = validate(val); if (e) { setErr(e); return; } }
    setErr("");
    const u = { ...ans, [id]: val }; setAns(u); setInp(""); setMulti(new Set());
    if (step < steps.length - 1) setTimeout(() => setStep(step + 1), 120); else onComplete(u);
  };
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
          <button key={o.value} onClick={() => next(cur.id, o.value)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 18px", borderRadius: 14, background: ans[cur.id] === o.value ? `${ACC}10` : "#f8fafc", border: `1.5px solid ${ans[cur.id] === o.value ? ACC : "#e2e8f0"}`, color: "#0f172a", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: F }}><span style={{ fontSize: 22 }}>{o.emoji}</span>{o.label}</button>
        )}</div>}
        {cur.type === "number" && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", borderRadius: 14, padding: "12px 24px", border: `1.5px solid ${err ? "#ef4444" : "#e2e8f0"}`, width: "100%", maxWidth: 240 }}>
            <input type="number" value={inp} onChange={e => { setInp(e.target.value); setErr(""); }} placeholder={cur.placeholder} onKeyDown={e => e.key === "Enter" && inp && next(cur.id, Number(inp))} autoFocus style={{ flex: 1, background: "transparent", border: "none", color: "#0f172a", fontSize: 32, fontWeight: 700, outline: "none", fontFamily: F, textAlign: "center", width: "100%" }}/>
            <span style={{ color: "#94a3b8", fontSize: 16 }}>{cur.unit}</span>
          </div>
          {err && <div style={{ color: "#ef4444", fontSize: 13, fontWeight: 600, background: "#fef2f2", padding: "8px 16px", borderRadius: 10, textAlign: "center" }}>⚠️ {err}</div>}
          {cur.min && <div style={{ fontSize: 11, color: "#94a3b8" }}>Зөвшөөрөгдөх хэмжээ: {cur.min}–{cur.max} {cur.unit}</div>}
          <button onClick={() => inp && next(cur.id, Number(inp))} disabled={!inp} style={{ padding: "13px 32px", borderRadius: 14, border: "none", background: inp ? GRAD : "#e2e8f0", color: inp ? "#fff" : "#94a3b8", fontWeight: 600, fontSize: 14, cursor: inp ? "pointer" : "not-allowed", fontFamily: F }}>Үргэлжлүүлэх {ArrowR}</button>
        </div>}
        {cur.type === "multi" && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{cur.options.map(o => {
          const sel = multi.has(o.value);
          return <button key={o.value} onClick={() => toggleM(o.value)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 18px", borderRadius: 14, background: sel ? `${ACC}10` : "#f8fafc", border: `1.5px solid ${sel ? ACC : "#e2e8f0"}`, color: "#0f172a", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: F }}><span style={{ fontSize: 22 }}>{o.emoji}</span>{o.label}{sel && <span style={{ marginLeft: "auto" }}>{Chk}</span>}</button>;
        })}
          <button onClick={() => multi.size > 0 && next(cur.id, [...multi])} disabled={multi.size === 0} style={{ width: "100%", marginTop: 12, padding: "14px", borderRadius: 14, border: "none", background: multi.size > 0 ? GRAD : "#e2e8f0", color: multi.size > 0 ? "#fff" : "#94a3b8", fontWeight: 600, fontSize: 14, cursor: multi.size > 0 ? "pointer" : "not-allowed", fontFamily: F }}>{step === steps.length - 1 ? "Төлөвлөгөө авах" : "Үргэлжлүүлэх"} {ArrowR}</button>
        </div>}
      </div>
    </div>
  );
}

// ═══ PAYMENT PAGE ═══
function Payment({ serviceType, onSuccess, onBack }) {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [checking, setChecking] = useState(false);
  const prices = { meal: { amount: "9,900", label: "Хоолны төлөвлөгөө (1 сар)" }, workout: { amount: "9,900", label: "Дасгалын төлөвлөгөө (1 сар)" }, both: { amount: "14,900", label: "Хоол + Дасгал хослол (1 сар)" } };
  const sel = prices[serviceType] || prices.both;

  const createInvoice = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/qpay/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: serviceType }) });
      const d = await r.json();
      if (d.success) setInvoice(d); else alert("QPay-д холбогдоход алдаа гарлаа. Дахин оролдоно уу.");
    } catch { alert("Сүлжээний алдаа гарлаа. Интернэт холболтоо шалгана уу."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#0f172a", fontFamily: F, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 24px" }}><button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", gap: 6 }}>{BackIcon} Буцах</button></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 400, margin: "0 auto", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>{serviceType === "meal" ? "🥗" : serviceType === "workout" ? "🏋️" : "🔥"}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{sel.label}</h2>
          <div style={{ fontSize: 36, fontWeight: 800, color: ACC, marginBottom: 4 }}>{sel.amount}₮</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 28 }}>1 сарын бүрэн төлөвлөгөө</div>

          {!invoice ? (
            <button onClick={createInvoice} disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: GRAD, color: "#fff", fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", fontFamily: F, opacity: loading ? 0.6 : 1 }}>
              {loading ? "Уншиж байна..." : "QPay-аар төлөх"}
            </button>
          ) : (
            <div style={{ background: "#f8fafc", borderRadius: 20, padding: 24, border: "1px solid #e2e8f0" }}>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>QR кодыг банкны аппаар уншуулна уу</p>
              {invoice.qr_image && <img src={`data:image/png;base64,${invoice.qr_image}`} alt="QR" style={{ width: 200, height: 200, margin: "0 auto 16px", display: "block", borderRadius: 12 }}/>}
              {invoice.urls && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 16 }}>
                {invoice.urls.slice(0, 8).map((b, i) => <a key={i} href={b.link} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 14px", borderRadius: 8, background: "#fff", color: "#475569", textDecoration: "none", fontSize: 12, fontWeight: 600, border: "1px solid #e2e8f0" }}>{b.name}</a>)}
              </div>}
              <button onClick={() => { setChecking(true); setTimeout(() => { setChecking(false); onSuccess(); }, 2000); }} disabled={checking} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: checking ? "#f1f5f9" : GRAD, color: checking ? "#64748b" : "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: F }}>
                {checking ? "Шалгаж байна..." : "Төлбөр хийсэн"}
              </button>
            </div>
          )}

          <div style={{ marginTop: 20, padding: "14px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0" }}>
            <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>🔒 Аюулгүй төлбөр</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>QPay-аар баталгаажсан аюулгүй төлбөрийн систем</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ LOADING ═══
function Loading() {
  const [idx, setIdx] = useState(0); const [dots, setDots] = useState("");
  const msgs = ["Калори тооцоолж байна", "1 сарын хоолны цэс бэлдэж байна", "Дасгалын хуваарь зохиож байна", "Төлөвлөгөөг эцэслэж байна"];
  useEffect(() => { const a = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400); const b = setInterval(() => setIdx(i => (i + 1) % msgs.length), 2200); return () => { clearInterval(a); clearInterval(b); }; }, []);
  return <div style={{ minHeight: "100vh", background: "#fff", color: "#0f172a", fontFamily: F, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 72, height: 72, marginBottom: 28 }}><div style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid #f1f5f9", borderTopColor: ACC, animation: "spin 1s linear infinite" }}/><div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 24 }}>🔥</div></div>
    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{msgs[idx]}{dots}</div>
    <div style={{ fontSize: 13, color: "#94a3b8" }}>1 сарын төлөвлөгөө үүсгэж байна</div>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>;
}

// ═══ DASHBOARD ═══
function Dashboard({ profile, serviceType, mealPlan, workoutPlan, onRestart }) {
  const [tab, setTab] = useState(serviceType === "workout" ? "workout" : "meal");
  const [mealDay, setMealDay] = useState(0); const [workDay, setWorkDay] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const goalMap = { lose: "Жин хасах", gain: "Булчин нэмэх", maintain: "Жингээ хадгалах", comp: "Тэмцээний бэлтгэл", health: "Эрүүл мэнд" };
  let bmr = profile.gender === "male" ? 10*profile.weight+6.25*profile.height-5*profile.age+5 : 10*profile.weight+6.25*profile.height-5*profile.age-161;
  const tdee = Math.round(bmr*({sedentary:1.2,light:1.375,moderate:1.55,active:1.725}[profile.activity]||1.4));
  const targetCal = tdee+({lose:-500,gain:400,maintain:0,comp:-600,health:-200}[profile.goal]||0);
  const macros = {p:Math.round(profile.weight*2.2),c:Math.round((targetCal*0.4)/4),f:Math.round((targetCal*0.25)/9)};
  const hasMeal=serviceType!=="workout"; const hasWork=serviceType!=="meal";
  const mDays=mealPlan?.days||[]; const wDays=workoutPlan?.days||[];
  const total=mDays.reduce((s,d)=>s+(d.meals?.length||0),0)+wDays.reduce((s,d)=>s+(d.exercises?.length||0),0);
  const prog=total>0?Math.round((completed.size/total)*100):0;
  const toggle=k=>setCompleted(p=>{const n=new Set(p);n.has(k)?n.delete(k):n.add(k);return n;});
  const tabs=[]; if(hasMeal) tabs.push({id:"meal",l:"🥗 Хоол",c:ACC}); if(hasWork) tabs.push({id:"workout",l:"🏋️ Дасгал",c:"#ea580c"}); tabs.push({id:"stats",l:"📊 Тойм",c:"#0284c7"});

  return <div style={{minHeight:"100vh",background:"#fff",color:"#0f172a",fontFamily:F}}>
    <div style={{padding:"14px 24px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}><LogoNav /><button onClick={onRestart} style={{background:"#f1f5f9",border:"none",color:"#64748b",padding:"7px 14px",borderRadius:10,fontSize:12,cursor:"pointer",fontFamily:F}}>Шинээр эхлэх</button></div>
    <div style={{padding:"12px 24px 0"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}}><span style={{color:"#94a3b8"}}>Өнөөдрийн гүйцэтгэл</span><span style={{color:ACC,fontWeight:600}}>{prog}%</span></div><div style={{background:"#f1f5f9",borderRadius:4,height:4,overflow:"hidden"}}><div style={{width:`${prog}%`,height:"100%",background:GRAD,borderRadius:4,transition:"width 0.3s"}}/></div></div>
    <div style={{display:"flex",gap:4,padding:"14px 24px",overflowX:"auto"}}>{tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"9px 18px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:F,fontWeight:600,fontSize:13,whiteSpace:"nowrap",background:tab===t.id?t.c:"#f1f5f9",color:tab===t.id?"#fff":"#94a3b8"}}>{t.l}</button>)}</div>
    <div style={{padding:"8px 24px 40px",maxWidth:560,margin:"0 auto"}}>
      {tab==="stats"&&<><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>{[{l:"Зорилго",v:goalMap[profile.goal],c:ACC},{l:"Өдрийн калори",v:`${targetCal} kcal`,c:"#ea580c"},{l:"Одоогийн жин",v:`${profile.weight} кг`,c:"#64748b"},{l:"Зорилтот жин",v:`${profile.targetWeight} кг`,c:"#0284c7"}].map((s,i)=><div key={i} style={{background:"#f8fafc",borderRadius:14,padding:16,border:"1px solid #e2e8f0"}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>{s.l}</div><div style={{fontSize:17,fontWeight:700,color:s.c}}>{s.v}</div></div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>{[{l:"Уураг",v:macros.p,c:ACC},{l:"Нүүрс ус",v:macros.c,c:"#0284c7"},{l:"Өөх тос",v:macros.f,c:"#ea580c"}].map((m,i)=><div key={i} style={{background:"#f8fafc",borderRadius:14,padding:"14px 10px",border:"1px solid #e2e8f0",textAlign:"center"}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>{m.l}</div><div style={{fontSize:20,fontWeight:700,color:m.c}}>{m.v}<span style={{fontSize:11,color:"#94a3b8"}}>г</span></div></div>)}</div>
        {(mealPlan?.tips||workoutPlan?.tips)&&<div style={{background:`${ACC}08`,borderRadius:14,padding:16,border:`1px solid ${ACC}12`}}><div style={{fontSize:14,fontWeight:600,color:ACC,marginBottom:8}}>Мэргэжлийн зөвлөмж</div>{[...(mealPlan?.tips||[]),...(workoutPlan?.tips||[])].map((t,i)=><div key={i} style={{fontSize:13,color:"#64748b",marginBottom:4,lineHeight:1.6}}>• {t}</div>)}</div>}</>}
      {tab==="meal"&&hasMeal&&<><div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:12}}>{mDays.map((d,i)=><button key={i} onClick={()=>setMealDay(i)} style={{padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:F,fontWeight:600,fontSize:12,whiteSpace:"nowrap",background:mealDay===i?ACC:"#f1f5f9",color:mealDay===i?"#fff":"#94a3b8"}}>{d.dayLabel||`${i+1}-р өдөр`}</button>)}</div>
        {(mDays[mealDay]?.meals||[]).map((m,i)=>{const k=`m-${mealDay}-${i}`;const d=completed.has(k);return<div key={i} style={{background:"#f8fafc",borderRadius:14,padding:16,border:`1px solid ${d?ACC+"33":"#e2e8f0"}`,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,fontWeight:600,color:ACC}}>{m.time}</span>{m.calories&&<span style={{fontSize:12,fontWeight:600,color:"#ea580c",background:"#ea580c10",padding:"3px 10px",borderRadius:8}}>{m.calories} kcal</span>}</div><div style={{fontSize:16,fontWeight:700,marginBottom:6}}>{m.name}</div>{m.ingredients&&<div style={{fontSize:13,color:"#64748b",lineHeight:1.7}}>{m.ingredients.map((g,j)=><div key={j}>• {g}</div>)}</div>}{m.description&&<div style={{fontSize:13,color:"#64748b",marginTop:4}}>{m.description}</div>}<button onClick={()=>toggle(k)} style={{marginTop:10,width:"100%",padding:10,borderRadius:10,border:"none",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:F,background:d?"#f1f5f9":`${ACC}10`,color:d?"#94a3b8":ACC}}>{d?"✅ Идсэн":"Идсэн гэж тэмдэглэх"}</button></div>})}</>}
      {tab==="workout"&&hasWork&&<><div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:12}}>{wDays.map((d,i)=><button key={i} onClick={()=>setWorkDay(i)} style={{padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:F,fontWeight:600,fontSize:12,whiteSpace:"nowrap",background:workDay===i?"#ea580c":"#f1f5f9",color:workDay===i?"#fff":"#94a3b8"}}>{d.dayLabel||`${i+1}-р өдөр`}</button>)}</div>
        {wDays[workDay]&&<div style={{background:"#ea580c10",borderRadius:12,padding:"12px 16px",marginBottom:12,border:"1px solid #ea580c15"}}><span style={{fontSize:14,fontWeight:700,color:"#ea580c"}}>{wDays[workDay].type||wDays[workDay].dayLabel}</span></div>}
        {(wDays[workDay]?.exercises||[]).map((ex,i)=>{const k=`w-${workDay}-${i}`;const d=completed.has(k);return<div key={i} style={{background:"#f8fafc",borderRadius:14,padding:16,border:`1px solid ${d?"#ea580c33":"#e2e8f0"}`,marginBottom:10,display:"flex",alignItems:"flex-start",gap:12}}><button onClick={()=>toggle(k)} style={{width:28,height:28,borderRadius:8,border:`2px solid ${d?"#ea580c":"#e2e8f0"}`,background:d?"#ea580c10":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:2}}>{d&&<svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}</button><div><div style={{fontSize:15,fontWeight:600,marginBottom:3,textDecoration:d?"line-through":"none",color:d?"#94a3b8":"#0f172a"}}>{ex.name}</div><div style={{fontSize:13,color:"#94a3b8"}}>{ex.detail}</div></div></div>})}</>}
    </div>
  </div>;
}

// ═══ FALLBACKS ═══
function fbMeal(a){const lo=a.goal==="lose"||a.goal==="comp";return{days:[
{dayLabel:"Даваа",meals:[{time:"Өглөө (07:00)",name:"Өндөгний омлет, ногоотой",calories:lo?320:450,ingredients:["Өндөг 2 бүтэн, 1 цагаан","Шпинат эсвэл байцаа 60г","Улаан лооль 1ш","Оливын тос 1 цайны халбага","Бүхэл үрийн талх 1 зүсэм"],description:"Хайруулын тавган дээр оливын тосоо халаагаад ногоогоо шараад дээр нь өндөгөө цутгаж омлет болгоно."},{time:"Өдөр (12:30)",name:"Тахианы цээж, хүрэн будаатай",calories:lo?420:560,ingredients:["Тахианы цээж 150г","Хүрэн будаа 80г (хуурай)","Лууван, байцааны салат","Оливын тос, нимбэгний шүүс"],description:"Тахианы цээжийг давс, перецтэй шараж, хүрэн будаатай хамт идэнэ."},{time:"Зууш (15:30)",name:"Грек йогурт, самар",calories:lo?160:250,ingredients:["Грек йогурт 150г (чихэргүй)","Бадам 10 ширхэг","Аньс 30г"],description:"Йогуртан дээрээ самар, жимс тавиад хольж идэнэ."},{time:"Орой (19:00)",name:"Загасны шөл, ногоотой",calories:lo?350:480,ingredients:["Загасны филе 150г (цурхай)","Төмс 1 жижиг ширхэг","Лууван 1ш, сонгино хагас","Укроп, петрушка"],description:"Ногоогоо чанаад загасаа нэмж 10 минут чанана."}]},
{dayLabel:"Мягмар",meals:[{time:"Өглөө (07:00)",name:"Овъёосны будаа, жимстэй",calories:lo?300:420,ingredients:["Овъёосны будаа 50г","Сүү 200мл","Банан хагас","Зөгийн бал 1 цайны халбага","Далдуу үр 1 халбага"],description:"Овъёосоо сүүтэй чанаж дээр нь жимс, бал тавина."},{time:"Өдөр (12:30)",name:"Үхрийн махтай цуйван",calories:lo?430:580,ingredients:["Үхрийн мах 120г (тарган багатай)","Гоймон 100г","Лууван 1ш, чинжүү хагас","Сонгино хагас, сармис 2 хүрээ"],description:"Ногоо махаа хэрчиж шараад гоймон нэмж хольж хутгана."},{time:"Зууш (15:30)",name:"Уургийн коктейль",calories:lo?180:280,ingredients:["Банан 1ш","Сүү 200мл","Уургийн нунтаг 30г"],description:"Холигч машинд хийж нухаж уна."},{time:"Орой (19:00)",name:"Жигнэсэн тахианы бууз",calories:lo?380:500,ingredients:["Тахианы мах 150г (нухсан)","Гурил 80г","Сонгино 1 толгой, сармис 3 хүрээ"],description:"Тахианы махаа сонгинотой нухаж боодоод жигнэнэ. Шарсанаас эрүүл."}]},
{dayLabel:"Лхагва",meals:[{time:"Өглөө (07:00)",name:"Өндөг, авокадо, талхтай",calories:lo?310:440,ingredients:["Өндөг 2ш","Авокадо хагас","Бүхэл үрийн талх 1 зүсэм"],description:"Талхан дээр авокадо түрхээд дээр нь өндөг тавина."},{time:"Өдөр (12:30)",name:"Хонины махтай шөл",calories:lo?400:560,ingredients:["Хонины мах 120г (ясгүй)","Төмс 1ш, лууван 1ш","Гоймон 40г, сонгино хагас"],description:"Хонины махаа чанаж хөөсийг авна. Ногоо, гоймон нэмнэ. Монгол маханшөл."},{time:"Зууш (15:30)",name:"Алим, бадам",calories:lo?150:220,ingredients:["Алим 1 дунд ширхэг","Бадам 15 ширхэг"],description:"Алимаа угааж самартай хамт идэх."},{time:"Орой (19:00)",name:"Загасны филе, ногооны салат",calories:lo?340:460,ingredients:["Загасны филе 150г","Өргөст хэмх 1ш, лооль 1ш","Оливын тос 1 халбага, нимбэг"],description:"Загасаа бага тостой шараад ногооны салаттай хамт идэнэ."}]},
{dayLabel:"Пүрэв",meals:[{time:"Өглөө (07:00)",name:"Бананы оатмийл бин",calories:lo?330:440,ingredients:["Овъёос 50г","Өндөг 1ш","Банан 1ш, нухсан","Далдуу үр 1 халбага"],description:"Бананаа нухаж овъёос, өндөгтэй хольж хайруулын тавган дээр жижиг бин болгож шарна."},{time:"Өдөр (12:30)",name:"Тахианы шарсан мах, төмстэй",calories:lo?420:560,ingredients:["Тахианы гуя 150г","Төмс 1 дунд ширхэг","Лууван 1ш, байцаа","Сармис, давс, перец"],description:"Тахианы гуяг давс перецтэй хамт шарж, хажуунд нь төмс чанаж идэнэ."},{time:"Зууш (15:30)",name:"Хулуу, зөгийн бал",calories:lo?120:180,ingredients:["Хулуу 100г (зүсэлсэн)","Зөгийн бал 1 цайны халбага"],description:"Хулуугаа зүсэж зөгийн балтай хольж идэнэ."},{time:"Орой (19:00)",name:"Өндөгний салат",calories:lo?300:420,ingredients:["Чанасан өндөг 3ш","Өргөст хэмх, лооль","Ногоон навч","Оливын тос"],description:"Өндгөө чанаж хэрчээд ногооны салат дээр тавьж идэнэ."}]},
{dayLabel:"Баасан",meals:[{time:"Өглөө (07:00)",name:"Творогтой жимсний аяга",calories:lo?280:380,ingredients:["Творог 150г (сүү багатай)","Гүзээлзгэнэ 50г","Зөгийн бал 1 цайны халбага","Самар 10ш"],description:"Творогон дээр жимс, самар, бал тавиад идэнэ."},{time:"Өдөр (12:30)",name:"Загастай будаа",calories:lo?400:540,ingredients:["Загасны филе 150г","Цагаан будаа 80г","Шпинат эсвэл байцаа","Соёны соус 1 халбага"],description:"Загасаа жигнэж будаатай хамт идэнэ. Соёны соусаар амтлана."},{time:"Зууш (15:30)",name:"Ногооны зууш",calories:lo?100:160,ingredients:["Лууван 1ш, өргөст хэмх хагас","Хумус 2 халбага"],description:"Ногоогоо зүсэж хумустай хамт идэнэ."},{time:"Орой (19:00)",name:"Тахианы шөл, ногоотой",calories:lo?320:440,ingredients:["Тахианы цээж 120г","Байцаа, лууван, сонгино","Бүхэл үрийн гоймон 40г"],description:"Тахианы цээжийг чанаж ногоо, гоймонтой хамт шөл болгоно."}]},
{dayLabel:"Бямба",meals:[{time:"Өглөө (07:00)",name:"Бүхэл үрийн талх, өндөг, ногоо",calories:lo?340:460,ingredients:["Бүхэл үрийн талх 2 зүсэм","Өндөг 2ш (шарсан)","Лооль 1ш, авокадо хагас"],description:"Талхаа шарж дээр нь өндөг, авокадо, лооль тавина."},{time:"Өдөр (12:30)",name:"Банштай шөл",calories:lo?400:540,ingredients:["Үхрийн мах 100г (банш)","Төмс 1ш, лууван 1ш","Банш 8–10 ширхэг"],description:"Банштай монгол шөл. Төмс, лууван хэрчиж чанаад баншаа нэмнэ."},{time:"Зууш (15:30)",name:"Жимсний салат",calories:lo?140:200,ingredients:["Алим, аньс, банан","Грек йогурт 2 халбага"],description:"Жимснүүдээ хэрчиж йогурттай хольно."},{time:"Орой (19:00)",name:"Хөнгөн ногооны хуурга",calories:lo?280:400,ingredients:["Брокколи 100г, чинжүү 1ш","Тахианы мах 100г","Сармис 2 хүрээ, соёны соус"],description:"Ногоо махаа бага тостой хуурч идэнэ."}]},
{dayLabel:"Ням",meals:[{time:"Өглөө (07:00)",name:"Смузи бол",calories:lo?300:420,ingredients:["Банан 1ш, аньс 50г","Шпинат 30г","Сүү 200мл, овъёос 30г","Далдуу үр 1 халбага"],description:"Бүгдийг холигч машинд хийж нухаж аяганд хийнэ."},{time:"Өдөр (12:30)",name:"Үхрийн стейк, ногоотой",calories:lo?450:600,ingredients:["Үхрийн стейк 150г","Төмс 1ш (шарсан)","Ногооны салат","Давс, перец, сармис"],description:"Стейкээ дунд зэрэг шарж, хажуунд нь ногоотой идэнэ."},{time:"Зууш (15:30)",name:"Хар шоколад, самар",calories:lo?150:200,ingredients:["Хар шоколад (70%+) 20г","Бадам 10ш"],description:"Хар шоколадаа самартай хамт зажилна. Магнийн сайн эх үүсвэр."},{time:"Орой (19:00)",name:"Хөнгөн лооль, өргөст хэмхний салат",calories:lo?250:380,ingredients:["Лооль 2ш, өргөст хэмх 1ш","Тахианы цээж 100г (чанасан)","Фета бяслаг 30г","Оливын тос, нимбэг"],description:"Ногоогоо хэрчиж тахиа, бяслагтай хамт салат болгоно."}]}
],tips:["Өдөрт 2.5–3.5 литр цэвэр ус ууж байгаарай","Оройн 20:00 цагаас хойш хоол идэхээс зайлсхийгээрэй","Хоол бүрдээ уургийн эх үүсвэр заавал оруулаарай","Нойроо 7–8 цаг байлгах нь бодисын солилцоонд маш чухал","Чихэртэй ундааг бүрэн хязгаарлаж, ус, ногоон цай уугаарай","Боловсруулсан хоолны оронд цоо шинэ, бэлдэж болох хоол сонгоорой","Хоолоо аажуу, сайн зажилж идэхэд цатгал хурдан мэдрэгдэнэ"]};}
function fbWork(a){const d=Number(a.workoutDays)||4;const t=[
{dayLabel:"Даваа",type:"Цээж + гурвалжин булчин",exercises:[{name:"Хэвтээ шахалт (Bench Press)",detail:"4 сет × 10 давталт, амрах 60 секунд"},{name:"Налуу дамбелл шахалт (Incline DB Press)",detail:"4 сет × 12 давталт"},{name:"Кабель нислэг (Cable Fly)",detail:"3 сет × 15 давталт"},{name:"Гурвалжин булчингийн суналт (Tricep Dip)",detail:"3 сет × 12 давталт"},{name:"Зүрхний дасгал (HIIT)",detail:"15 минут: 30 секунд хурдан / 30 секунд удаан"}]},
{dayLabel:"Мягмар",type:"Нуруу + бицепс",exercises:[{name:"Суурь татах (Deadlift)",detail:"4 сет × 8 давталт, амрах 90 секунд"},{name:"Дээшээ татах (Lat Pulldown)",detail:"4 сет × 12 давталт"},{name:"Суудалтай дамжуулга (Seated Row)",detail:"4 сет × 12 давталт"},{name:"Бицепс барбелл (Barbell Curl)",detail:"3 сет × 12 давталт"},{name:"Алхны бицепс (Hammer Curl)",detail:"3 сет × 15 давталт"}]},
{dayLabel:"Лхагва",type:"Хөл + хэвлий",exercises:[{name:"Суниалт (Squat)",detail:"5 сет × 8 давталт, амрах 90 секунд"},{name:"Румын суурь татах (Romanian Deadlift)",detail:"4 сет × 10 давталт"},{name:"Хөлний пресс (Leg Press)",detail:"4 сет × 15 давталт"},{name:"Шилбэний өргөлт (Calf Raise)",detail:"4 сет × 20 давталт"},{name:"Хавтан дасгал (Plank)",detail:"3 сет × 60 секунд барих"}]},
{dayLabel:"Пүрэв",type:"Мөр + HIIT",exercises:[{name:"Мөрний шахалт (Overhead Press)",detail:"4 сет × 10 давталт"},{name:"Хажуу өргөлт (Lateral Raise)",detail:"4 сет × 15 давталт"},{name:"Нүүр татах (Face Pull)",detail:"3 сет × 20 давталт"},{name:"HIIT давталт",detail:"4 раунд: Burpee ×10, Squat Jump ×15, Mountain Climber ×20"}]},
{dayLabel:"Баасан",type:"Бүтэн биеийн дасгал",exercises:[{name:"Суниалт (Squat)",detail:"4 сет × 10 давталт"},{name:"Хэвтээ шахалт (Bench Press)",detail:"4 сет × 10 давталт"},{name:"Дамжуулга (Barbell Row)",detail:"4 сет × 10 давталт"},{name:"Зүрх судасны дасгал",detail:"20 минут дунд эрчимтэй"}]},
{dayLabel:"Бямба",type:"Зүрх судас + хэвлий",exercises:[{name:"Өндөр эрчимтэй гүйлт",detail:"25 минут: 30 секунд спринт / 30 секунд алхах"},{name:"Хавтан дасгал (Plank)",detail:"3 сет × 60 секунд"},{name:"Оросын эргүүлэг (Russian Twist)",detail:"3 сет × 20 давталт"},{name:"Хөлний өргөлт (Leg Raise)",detail:"3 сет × 15 давталт"}]}
];return{days:t.slice(0,d),tips:["Дасгалын өмнө 5–10 минут заавал халаалт хийж биеэ бэлдээрэй","Дасгалын дараа бүтэн биеийн сунгалт хийх нь булчингийн сэргэлтэд маш чухал","Нойроо 7–8 цаг байлгах нь булчингийн сэргэлт, өсөлтөд зайлшгүй шаардлагатай","Дасгалын үед 500–700 мл ус ууж байгаарай","Бүлэг булчинг дасгалын дараа дор хаяж 48 цаг амраах хэрэгтэй"]};}

// ═══ MAIN ═══
export default function Home() {
  const [page, setPage] = useState("landing"); const [svc, setSvc] = useState(null);
  const [profile, setProfile] = useState(null); const [mealPlan, setMealPlan] = useState(null); const [workoutPlan, setWorkoutPlan] = useState(null);
  const restart = () => { setPage("landing"); setSvc(null); setProfile(null); setMealPlan(null); setWorkoutPlan(null); };
  const afterQuiz = (ans) => { setProfile(ans); setPage("payment"); };
  const afterPayment = async () => {
    setPage("loading");
    if (svc !== "workout") { try { const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile, serviceType: "meal" }) }); const d = await r.json(); setMealPlan(d.success ? d.plan : fbMeal(profile)); } catch { setMealPlan(fbMeal(profile)); } }
    if (svc !== "meal") { try { const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile, serviceType: "workout" }) }); const d = await r.json(); setWorkoutPlan(d.success ? d.plan : fbWork(profile)); } catch { setWorkoutPlan(fbWork(profile)); } }
    setPage("dashboard");
  };
  if (page === "landing") return <Landing onStart={() => setPage("service")} />;
  if (page === "service") return <ServiceSelect onSelect={s => { setSvc(s); setPage("quiz"); }} onBack={() => setPage("landing")} />;
  if (page === "quiz") return <Quiz serviceType={svc} onComplete={afterQuiz} onBack={() => setPage("service")} />;
  if (page === "payment") return <Payment serviceType={svc} onSuccess={afterPayment} onBack={() => setPage("quiz")} />;
  if (page === "loading") return <Loading />;
  if (page === "dashboard") return <Dashboard profile={profile} serviceType={svc} mealPlan={mealPlan} workoutPlan={workoutPlan} onRestart={restart} />;
  return null;
}
