"use client";
import { useState, useEffect, useRef } from "react";

const F = `'DM Sans', -apple-system, system-ui, sans-serif`;
const GRAD = "linear-gradient(135deg, #0ea5e9, #0284c7)";
const ACC = "#0ea5e9";

function getQuizSteps(svc) {
  const base = [
    { id: "gender", q: "Таны хүйс", options: [{ label: "Эрэгтэй", value: "male", emoji: "👨" }, { label: "Эмэгтэй", value: "female", emoji: "👩" }] },
    { id: "age", q: "Таны нас", type: "number", placeholder: "25", unit: "нас" },
    { id: "weight", q: "Одоогийн биеийн жин", type: "number", placeholder: "75", unit: "кг" },
    { id: "targetWeight", q: "Зорилтот жин", type: "number", placeholder: "68", unit: "кг" },
    { id: "height", q: "Таны өндөр", type: "number", placeholder: "175", unit: "см" },
    { id: "goal", q: "Гол зорилгоо сонгоно уу", options: [
      { label: "Жин хасах", value: "lose", emoji: "🔥" }, { label: "Булчингийн масс нэмэх", value: "gain", emoji: "💪" },
      { label: "Жингээ хадгалах", value: "maintain", emoji: "⚖️" }, { label: "Тэмцээний бэлтгэл", value: "comp", emoji: "🏆" },
      { label: "Эрүүл мэндээ сайжруулах", value: "health", emoji: "❤️" },
    ]},
    { id: "activity", q: "Өдөр тутмын идэвхийн түвшин", options: [
      { label: "Суудлын амьдралтай (оффис)", value: "sedentary", emoji: "🪑" }, { label: "Бага зэрэг идэвхтэй (7 хоногт 1–2 удаа)", value: "light", emoji: "🚶" },
      { label: "Дунд зэрэг идэвхтэй (7 хоногт 3–5 удаа)", value: "moderate", emoji: "🏃" }, { label: "Маш идэвхтэй (7 хоногт 6–7 удаа)", value: "active", emoji: "⚡" },
    ]},
    { id: "sleep", q: "Шөнийн нойрны хэмжээ", options: [
      { label: "5 цагаас бага", value: "<5", emoji: "😴" }, { label: "5–6 цаг", value: "5-6", emoji: "🌙" },
      { label: "7–8 цаг", value: "7-8", emoji: "😊" }, { label: "8 цагаас дээш", value: "8+", emoji: "💤" },
    ]},
    { id: "water", q: "Өдрийн усны хэрэглээ", options: [
      { label: "1 литрээс бага", value: "<1L", emoji: "💧" }, { label: "1–2 литр", value: "1-2L", emoji: "🥤" },
      { label: "2–3 литр", value: "2-3L", emoji: "🫗" }, { label: "3 литрээс дээш", value: "3L+", emoji: "🌊" },
    ]},
  ];
  const mealQs = [
    { id: "cookTime", q: "Хоол бэлдэхэд зарцуулах цаг", options: [
      { label: "15 минут (хурдан)", value: "15", emoji: "⏱️" }, { label: "30 минут", value: "30", emoji: "🍳" },
      { label: "45–60 минут", value: "60", emoji: "👨‍🍳" }, { label: "Цаг хамаагүй", value: "any", emoji: "♾️" },
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
      { label: "Туршлагатай (2 жилээс дээш)", value: "advanced", emoji: "💪" },
    ]},
    { id: "workoutDays", q: "Долоо хоногт хэдэн өдөр дасгал хийх вэ?", options: [
      { label: "3 өдөр", value: "3", emoji: "3️⃣" }, { label: "4 өдөр", value: "4", emoji: "4️⃣" },
      { label: "5 өдөр", value: "5", emoji: "5️⃣" }, { label: "6 өдөр", value: "6", emoji: "6️⃣" },
    ]},
    { id: "workoutType", q: "Ямар төрлийн дасгалд дуртай вэ?", type: "multi", options: [
      { label: "Жин өргөх", value: "weights", emoji: "🏋️" }, { label: "Зүрх судасны дасгал", value: "cardio", emoji: "🏃" },
      { label: "Өндөр эрчимтэй (HIIT)", value: "hiit", emoji: "⚡" }, { label: "Йога, сунгалт", value: "yoga", emoji: "🧘" },
    ]},
    { id: "equipment", q: "Ямар тоног төхөөрөмж ашиглах боломжтой вэ?", options: [
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
  return (
    <div style={{ fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 8, fontFamily: F }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px #0ea5e930" }}>
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      Balance<span style={{ color: ACC }}>Hub</span>
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
    { name: "Б. Солонго", age: 28, lost: "12 кг", time: "3 сар", text: "Хувийн дасгалжуулагчид сар бүр 800,000₮ төлдөг байсан. BalanceHub-аар ижил чанартай төлөвлөгөө авч, илүү сайн үр дүнд хүрсэн." },
    { name: "Д. Бат-Эрдэнэ", age: 32, lost: "Булчин 5 кг нэмсэн", time: "2 сар", text: "Фитнесс залд явдаг байсан ч хоолоо зөв зохицуулж чадахгүй байсан. Хоол, дасгалыг хамтад нь авснаар бүх зүйл эмх цэгцтэй боллоо." },
    { name: "М. Оюунчимэг", age: 29, lost: "6 кг", time: "1 сар", text: "Хүүхэд төрүүлсний дараа илүүдэл жинтэй тэмцэж байсан. Надад яг тохирсон хооллолтын зөвлөмж маш их тусалсан." },
    { name: "Т. Мөнхбаяр", age: 41, lost: "Өвдөлт буурсан", time: "2 сар", text: "Нурууны гэмтэлтэй учир олон дасгал хийж болдоггүй. Гэмтэлд тохирсон дасгалын хуваарь гаргаж өгсөн нь гайхалтай." },
    { name: "С. Алтанцэцэг", age: 26, lost: "8 кг", time: "2 сар", text: "Олон гадаадын апп туршсан боловч монгол хоол байхгүй байдаг. BalanceHub-д бууз, цуйван, шөл зэрэг бүгд бий." },
    { name: "Ц. Болормаа", age: 22, lost: "5 кг", time: "1 сар", text: "Оюутан учир хувийн дасгалжуулагч авах боломжгүй байсан. Маш хямд үнээр мэргэжлийн төлөвлөгөө авсан." },
    { name: "Р. Батбаяр", age: 29, lost: "10 кг", time: "2 сар", text: "Ажил завгүй хүнд зориулсан 15 минутад бэлдэх хоолны сонголт надад яг тохирсон." },
    { name: "Л. Ганбат", age: 45, lost: "15 кг", time: "5 сар", text: "Нас ахисан ч гэсэн хожуу биш гэдгийг BalanceHub надад нотолсон. Өдөр бүрийн хяналт маш сайн тусалсан." },
    { name: "Ш. Энхтүвшин", age: 37, lost: "20 кг", time: "5 сар", text: "Урт хугацааны тогтвортой төлөвлөгөө яг надад хэрэгтэй байсан зүйл байлаа." },
  ];
  const vis = reviews.slice(revIdx, revIdx + 3);
  const faqs = [
    { q: "BalanceHub яаж ажилладаг вэ?", a: "Та товч асуулга бөглөхөд хиймэл оюун ухаан таны нас, жин, зорилго, амьдралын хэв маягт тулгуурлан хувийн хоол болон дасгалын төлөвлөгөө автоматаар үүсгэж өгнө." },
    { q: "Хэр хурдан үр дүн гарах вэ?", a: "Ихэнх хэрэглэгчид эхний 2 долоо хоногт биедээ өөрчлөлт мэдэрдэг. Тогтвортой, бодит үр дүнд 1–3 сар шаардлагатай." },
    { q: "Монгол хоол багтсан уу?", a: "Тийм. Бууз, цуйван, маханшөл, банш, гурилтай шөл зэрэг монголчуудын өдөр тутам хэрэглэдэг хоолноос эхлээд орчин үеийн эрүүл хоол хүртэл бүгд багтсан." },
    { q: "Фитнесс зал заавал шаардлагатай юу?", a: "Үгүй. Гэрийн тоног төхөөрөмж эсвэл тоног төхөөрөмжгүйгээр зөвхөн биеийн жинтэй дасгал хийх боломжтой." },
    { q: "Гэмтэлтэй хүнд тохирох уу?", a: "Тийм. Асуулгад гэмтлээ зааж өгөхөд хиймэл оюун ухаан тэрийг харгалзан аюулгүй дасгалын хуваарь зөвлөнө." },
    { q: "Хоолны харшилтай бол яах вэ?", a: "Сүү бүтээгдэхүүн, глютен, самар зэрэг харшлаа зааж өгөхөд тэдгээрийг агуулаагүй хоолны цэс гаргана." },
    { q: "Төлбөрөө яаж хийх вэ?", a: "QPay-аар дурын банкны картаар эсвэл банкны аппликейшнаар шууд төлж болно." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fefefe", color: "#0f172a", fontFamily: F }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet" />
      <style>{`@keyframes gm{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`}</style>

      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", background: scrollY > 50 ? "rgba(255,255,255,0.92)" : "transparent", backdropFilter: scrollY > 50 ? "blur(16px)" : "none", borderBottom: scrollY > 50 ? "1px solid #f1f5f9" : "1px solid transparent", position: "sticky", top: 0, zIndex: 100, transition: "all 0.3s" }}>
        <LogoNav />
        <button onClick={onStart} style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: GRAD, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: F }}>Төлөвлөгөө авах</button>
      </nav>

      {/* Hero */}
      <section style={{ padding: "72px 24px 48px", textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
        <span style={{ display: "inline-block", padding: "6px 18px", borderRadius: 24, background: "#e0f2fe", color: "#0369a1", fontSize: 12, fontWeight: 700, marginBottom: 20 }}>✨ 3,000+ хэрэглэгч итгэн ашиглаж байна</span>
        <h1 style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1.5 }}>
          Таны биед яг тохирсон<br/><span style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7, #0ea5e9)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gm 4s ease infinite" }}>хоол, дасгалын төлөвлөгөө</span>
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 540 }}>
          Хиймэл оюун ухаан таны нас, жин, зорилгод тулгуурлан өдөр тутмын хооллолт, дасгалын хуваарийг мэргэжлийн түвшинд гаргаж өгнө. Хувийн дасгалжуулагчаас <strong style={{ color: "#0ea5e9" }}>50–100 дахин хямд.</strong>
        </p>
        <button onClick={onStart} style={{ padding: "18px 56px", borderRadius: 16, border: "none", background: GRAD, color: "#fff", fontWeight: 700, fontSize: 17, cursor: "pointer", fontFamily: F, boxShadow: "0 8px 32px #0ea5e930" }}>Төлөвлөгөө авах →</button>
        <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 12 }}>2 минутын асуулга бөглөөд шууд эхлээрэй</p>
      </section>

      {/* Stats */}
      <Sec bg="#f8fafc" style={{ padding: "48px 24px", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[{ i: "👥", v: "3,000+", l: "Идэвхтэй хэрэглэгч" }, { i: "⚖️", v: "8,000+ кг", l: "Нийт хассан жин" }, { i: "⭐", v: "4.8 / 5", l: "Дундаж үнэлгээ" }, { i: "🏆", v: "97%", l: "Сэтгэл ханамж" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>{s.i}</div><div style={{ fontSize: 28, fontWeight: 800, color: ACC, marginTop: 4 }}>{s.v}</div><div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{s.l}</div></div>
          ))}
        </div>
      </Sec>

      {/* Features */}
      <Sec>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 32 }}>Нэг платформ дотор бүх зүйл</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { i: "📋", t: "Хоолны төлөвлөгөө", d: "Таны биед тохирсон калори, уураг, нүүрс ус, өөх тосны тооцоотой өдөр тутмын хоолны цэс", c: ACC },
            { i: "🌸", t: "Мөчлөгт тохирсон хооллолт", d: "Эмэгтэйчүүдийн сарын тэмдгийн үе шат бүрд зориулсан хоол, дасгалын зөвлөмж", c: "#e11d48" },
            { i: "🏋️", t: "Дасгалын хуваарь", d: "Таны зорилго, туршлага, тоног төхөөрөмжид тохирсон бүрэн дасгалын төлөвлөгөө", c: "#0284c7" },
            { i: "📊", t: "Хяналтын самбар", d: "Хоол, дасгалаа тэмдэглэж, өдөр бүрийн гүйцэтгэлээ бодитоор хянана", c: "#16a34a" },
            { i: "💧", t: "Ус, нойрны бүртгэл", d: "Өдрийн усны хэрэглээ, нойрны хэмжээг бүртгэж зорилтоо хянана", c: "#ea580c" },
            { i: "🤖", t: "Хиймэл оюун ухаант зөвлөгч", d: "Хүссэн үедээ хоолзүйн болон дасгалын хувийн зөвлөмж авах боломжтой", c: ACC },
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
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>Хувийн дасгалжуулагчаас 50–100 дахин хямд</h2>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: 14, marginBottom: 28 }}>Монголд хувийн дасгалжуулагчийн үйлчилгээ сард 500,000–2,000,000₮ хүрдэг</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 16px", border: "1px solid #e2e8f0", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🥗</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Хоолны төлөвлөгөө</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: ACC }}>9,900₮</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>сард</div>
            {["Өдөр тутмын хоолны цэс", "Калори, макро тооцоо", "Монгол хоол багтсан"].map((t, i) => <div key={i} style={{ fontSize: 11, color: "#16a34a", padding: "3px 0" }}>✓ {t}</div>)}
            <button onClick={onStart} style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 10, border: `1.5px solid ${ACC}`, background: "transparent", color: ACC, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: F }}>Сонгох</button>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 16px", border: "1px solid #e2e8f0", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🏋️</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Дасгалын төлөвлөгөө</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: ACC }}>9,900₮</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>сард</div>
            {["Дасгалын бүрэн хуваарь", "Сет, давталт, амралт", "Гэмтэлд тохирсон"].map((t, i) => <div key={i} style={{ fontSize: 11, color: "#16a34a", padding: "3px 0" }}>✓ {t}</div>)}
            <button onClick={onStart} style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 10, border: `1.5px solid ${ACC}`, background: "transparent", color: ACC, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: F }}>Сонгох</button>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 16px", border: `2px solid ${ACC}`, textAlign: "center", position: "relative", boxShadow: "0 8px 40px #0ea5e912" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 16px", borderRadius: 10, background: GRAD, color: "#fff", fontSize: 11, fontWeight: 700 }}>Хамгийн хэмнэлттэй</div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔥</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Хоол + Дасгал</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: ACC }}>14,900₮</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>сард</div>
            {["Хоол, дасгал хоёулаа", "Бүрэн хяналтын самбар", "Хиймэл оюун ухаант зөвлөгч"].map((t, i) => <div key={i} style={{ fontSize: 11, color: "#16a34a", padding: "3px 0" }}>✓ {t}</div>)}
            <button onClick={onStart} style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 10, border: "none", background: GRAD, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: F }}>Сонгох</button>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ display: "inline-block", background: "#fff", borderRadius: 14, padding: "16px 24px", border: "1px solid #fecaca" }}>
            <div style={{ fontSize: 13, color: "#ef4444", fontWeight: 700 }}>Хувийн дасгалжуулагч</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#ef4444" }}>500,000–2,000,000₮<span style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}> / сар</span></div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Долоо хоногт 1–3 удаа л уулзана, хоол багтаагүй</div>
          </div>
        </div>
      </Sec>

      {/* Testimonials */}
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
          <button onClick={() => setRevIdx(i => Math.max(i - 3, 0))} disabled={revIdx === 0} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: revIdx === 0 ? "#cbd5e1" : "#0f172a", cursor: "pointer", fontSize: 14, fontFamily: F }}>←</button>
          <button onClick={() => setRevIdx(i => Math.min(i + 3, reviews.length - 3))} disabled={revIdx >= reviews.length - 3} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: revIdx >= reviews.length - 3 ? "#cbd5e1" : "#0f172a", cursor: "pointer", fontSize: 14, fontFamily: F }}>→</button>
        </div>
      </Sec>

      {/* FAQ */}
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

      {/* CTA */}
      <Sec>
        <div style={{ textAlign: "center", background: GRAD, borderRadius: 24, padding: "48px 28px", boxShadow: "0 16px 60px #0ea5e920", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "#ffffff15" }} />
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Эрүүл амьдралын эхлэл</h2>
          <p style={{ color: "#bae6fd", fontSize: 15, marginBottom: 24, lineHeight: 1.6, maxWidth: 400, margin: "0 auto 24px" }}>3,000 гаруй хүн BalanceHub-аар зорилгодоо хүрсэн. Дараагийн ээлж таных.</p>
          <button onClick={onStart} style={{ padding: "16px 48px", borderRadius: 14, border: "none", background: "#fff", color: ACC, fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: F }}>Одоо эхлэх →</button>
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
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>Өөрт тохирох үйлчилгээгээ сонгоно уу</p>
          {[
            { v: "meal", e: "🥗", t: "Хоолны төлөвлөгөө", d: "Калори, макро тооцоотой хоолны цэс", c: ACC, p: "9,900₮/сар" },
            { v: "workout", e: "🏋️", t: "Дасгалын төлөвлөгөө", d: "Сет, давталт, амралт бүхий хуваарь", c: "#ea580c", p: "9,900₮/сар" },
            { v: "both", e: "🔥", t: "Хоол + Дасгал хослол", d: "Хоёуланг нь нэг дор авч бүрэн хянана", c: "#0284c7", rec: true, p: "14,900₮/сар" },
          ].map(o => (
            <button key={o.v} onClick={() => onSelect(o.v)} style={{ width: "100%", background: "#f8fafc", borderRadius: 16, padding: "20px", border: "1.5px solid #e2e8f0", cursor: "pointer", fontFamily: F, textAlign: "left", position: "relative", marginBottom: 12, color: "#0f172a" }}>
              {o.rec && <div style={{ position: "absolute", top: -10, right: 16, padding: "4px 14px", borderRadius: 10, background: "linear-gradient(135deg, #0284c7, #0369a1)", color: "#fff", fontSize: 11, fontWeight: 700 }}>Хамгийн хэмнэлттэй</div>}
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
          <button key={o.value} onClick={() => next(cur.id, o.value)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 18px", borderRadius: 14, background: ans[cur.id] === o.value ? `${ACC}10` : "#f8fafc", border: `1.5px solid ${ans[cur.id] === o.value ? ACC : "#e2e8f0"}`, color: "#0f172a", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: F }}><span style={{ fontSize: 22 }}>{o.emoji}</span>{o.label}</button>
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
          return <button key={o.value} onClick={() => toggleM(o.value)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 18px", borderRadius: 14, background: sel ? `${ACC}10` : "#f8fafc", border: `1.5px solid ${sel ? ACC : "#e2e8f0"}`, color: "#0f172a", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: F }}><span style={{ fontSize: 22 }}>{o.emoji}</span>{o.label}{sel && <span style={{ marginLeft: "auto" }}>{Chk}</span>}</button>;
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
  const msgs = ["Калори тооцоолж байна", "Хоолны цэс боловсруулж байна", "Дасгалын хуваарь зохиож байна", "Төлөвлөгөө эцэслэж байна"];
  useEffect(() => { const a = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400); const b = setInterval(() => setIdx(i => (i + 1) % msgs.length), 2200); return () => { clearInterval(a); clearInterval(b); }; }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#0f172a", fontFamily: F, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 72, height: 72, marginBottom: 28 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid #f1f5f9", borderTopColor: ACC, animation: "spin 1s linear infinite" }}/>
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
  const goalMap = { lose: "Жин хасах", gain: "Булчин нэмэх", maintain: "Жингээ хадгалах", comp: "Тэмцээний бэлтгэл", health: "Эрүүл мэнд" };
  let bmr = profile.gender === "male" ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5 : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  const tdee = Math.round(bmr * ({ sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }[profile.activity] || 1.4));
  const targetCal = tdee + ({ lose: -500, gain: 400, maintain: 0, comp: -600, health: -200 }[profile.goal] || 0);
  const macros = { p: Math.round(profile.weight * 2.2), c: Math.round((targetCal * 0.4) / 4), f: Math.round((targetCal * 0.25) / 9) };
  const hasMeal = serviceType !== "workout"; const hasWork = serviceType !== "meal";
  const mDays = mealPlan?.days || []; const wDays = workoutPlan?.days || [];
  const total = mDays.reduce((s, d) => s + (d.meals?.length || 0), 0) + wDays.reduce((s, d) => s + (d.exercises?.length || 0), 0);
  const prog = total > 0 ? Math.round((completed.size / total) * 100) : 0;
  const toggle = k => setCompleted(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const tabs = []; if (hasMeal) tabs.push({ id: "meal", l: "🥗 Хоол", c: ACC }); if (hasWork) tabs.push({ id: "workout", l: "🏋️ Дасгал", c: "#ea580c" }); tabs.push({ id: "stats", l: "📊 Тойм", c: "#0284c7" });

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#0f172a", fontFamily: F }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <LogoNav />
        <button onClick={onRestart} style={{ background: "#f1f5f9", border: "none", color: "#64748b", padding: "7px 14px", borderRadius: 10, fontSize: 12, cursor: "pointer", fontFamily: F, fontWeight: 500 }}>Шинээр эхлэх</button>
      </div>
      <div style={{ padding: "12px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}><span style={{ color: "#94a3b8" }}>Өнөөдрийн гүйцэтгэл</span><span style={{ color: ACC, fontWeight: 600 }}>{prog}%</span></div>
        <div style={{ background: "#f1f5f9", borderRadius: 4, height: 4, overflow: "hidden" }}><div style={{ width: `${prog}%`, height: "100%", background: GRAD, borderRadius: 4, transition: "width 0.3s" }}/></div>
      </div>
      <div style={{ display: "flex", gap: 4, padding: "14px 24px", overflowX: "auto" }}>
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: F, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", background: tab === t.id ? t.c : "#f1f5f9", color: tab === t.id ? "#fff" : "#94a3b8" }}>{t.l}</button>)}
      </div>
      <div style={{ padding: "8px 24px 40px", maxWidth: 560, margin: "0 auto" }}>
        {tab === "stats" && <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[{ l: "Зорилго", v: goalMap[profile.goal], c: ACC }, { l: "Өдрийн калори", v: `${targetCal} kcal`, c: "#ea580c" }, { l: "Одоогийн жин", v: `${profile.weight} кг`, c: "#64748b" }, { l: "Зорилтот жин", v: `${profile.targetWeight} кг`, c: "#0284c7" }].map((s, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: 16, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 500 }}>{s.l}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[{ l: "Уураг", v: macros.p, c: ACC }, { l: "Нүүрс ус", v: macros.c, c: "#0284c7" }, { l: "Өөх тос", v: macros.f, c: "#ea580c" }].map((m, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>{m.l}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: m.c }}>{m.v}<span style={{ fontSize: 11, color: "#94a3b8" }}>г</span></div>
              </div>
            ))}
          </div>
          {(mealPlan?.tips || workoutPlan?.tips) && <div style={{ background: `${ACC}08`, borderRadius: 14, padding: 16, border: `1px solid ${ACC}12` }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: ACC, marginBottom: 8 }}>Мэргэжлийн зөвлөмж</div>
            {[...(mealPlan?.tips || []), ...(workoutPlan?.tips || [])].map((t, i) => <div key={i} style={{ fontSize: 13, color: "#64748b", marginBottom: 4, lineHeight: 1.6 }}>• {t}</div>)}
          </div>}
        </>}
        {tab === "meal" && hasMeal && <>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }}>
            {mDays.map((d, i) => <button key={i} onClick={() => setMealDay(i)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: F, fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", background: mealDay === i ? ACC : "#f1f5f9", color: mealDay === i ? "#fff" : "#94a3b8" }}>{d.dayLabel || `${i + 1}-р өдөр`}</button>)}
          </div>
          {(mDays[mealDay]?.meals || []).map((m, i) => { const k = `m-${mealDay}-${i}`; const d = completed.has(k); return (
            <div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: 16, border: `1px solid ${d ? ACC + "33" : "#e2e8f0"}`, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: ACC }}>{m.time}</span>
                {m.calories && <span style={{ fontSize: 12, fontWeight: 600, color: "#ea580c", background: "#ea580c10", padding: "3px 10px", borderRadius: 8 }}>{m.calories} kcal</span>}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{m.name}</div>
              {m.ingredients && <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{m.ingredients.map((g, j) => <div key={j}>• {g}</div>)}</div>}
              {m.description && <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{m.description}</div>}
              <button onClick={() => toggle(k)} style={{ marginTop: 10, width: "100%", padding: 10, borderRadius: 10, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: F, background: d ? "#f1f5f9" : `${ACC}10`, color: d ? "#94a3b8" : ACC }}>{d ? "✅ Идсэн" : "Идсэн гэж тэмдэглэх"}</button>
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

// ═══════ FALLBACKS (мэргэжлийн хооллолт, Монголд байдаг хүнс) ═══════
function fbMeal(a) {
  const lo = a.goal === "lose" || a.goal === "comp";
  return { days: [
    { dayLabel: "1-р өдөр", meals: [
      { time: "Өглөөний хоол (07:00)", name: "Өндөгний омлет, ногоотой", calories: lo ? 320 : 450, ingredients: ["Өндөг 2 ширхэг (бүтэн), 1 цагаан", "Шпинат эсвэл байцаа 60 грамм", "Улаан лооль 1 ширхэг, жижиглэсэн", "Оливын тос 1 цайны халбага", "Бүхэл үрийн талх 1 зүсэм"], description: "Хайруулын тавган дээр оливын тосоо халаагаад ногоогоо шараад дээр нь өндгөө цутгаж омлет болгоно. Талхаа хажуунд нь идэнэ." },
      { time: "Өдрийн хоол (12:30)", name: "Тахианы цээж, хүрэн будаатай", calories: lo ? 420 : 560, ingredients: ["Тахианы цээжний мах 150 грамм", "Хүрэн будаа 80 грамм (хуурай жинаар)", "Лууван, өргөст хэмх, байцааны салат", "Оливын тос 1 халбага, нимбэгний шүүс"], description: "Тахианы цээжийг давс, хар перецтэй хамт сайн шараж болгоно. Хүрэн будааг чанаж, хажуунд нь ногооны салат дээр нимбэгний шүүстэй оливын тос цацна." },
      { time: "Зуушны хоол (15:30)", name: "Грек йогурт, самар, жимстэй", calories: lo ? 160 : 250, ingredients: ["Грек йогурт 150 грамм (чихэргүй)", "Бадам самар 10 ширхэг", "Аньс эсвэл гүзээлзгэнэ 30 грамм"], description: "Йогуртан дээрээ самар, жимсээ тавиад хольж идэнэ." },
      { time: "Оройн хоол (19:00)", name: "Загасны шөл, ногоотой", calories: lo ? 350 : 480, ingredients: ["Загасны филе 150 грамм (цурхай эсвэл тул)", "Төмс 1 жижиг ширхэг", "Лууван 1 ширхэг, сонгино хагас", "Шүүслэг ногоо (укроп, петрушка)"], description: "Ногоогоо угааж хэрчээд усанд чанана. Зөөлөрсний дараа загасаа нэмнэ. 10 минут чанаад шүүслэг ногоо цацна." },
    ]},
    { dayLabel: "2-р өдөр", meals: [
      { time: "Өглөөний хоол (07:00)", name: "Овъёосны будаа, жимстэй", calories: lo ? 300 : 420, ingredients: ["Овъёосны будаа 50 грамм", "Сүү 200 мл (эсвэл ус)", "Банан хагас, зүсэлсэн", "Зөгийн бал 1 цайны халбага", "Далдуу үр 1 халбага"], description: "Овъёосны будаагаа сүүтэй хамт чанаад дээр нь банан, зөгийн бал, далдуу үрээ тавина." },
      { time: "Өдрийн хоол (12:30)", name: "Үхрийн махтай цуйван", calories: lo ? 430 : 580, ingredients: ["Үхрийн тарган багатай мах 120 грамм", "Гурилан талх (гоймон) 100 грамм", "Лууван 1 ширхэг, чинжүү хагас", "Сонгино хагас, сармис 2 хүрээ", "Ургамлын тос 1 халбага"], description: "Ногоо, махаа нарийн хэрчиж шараад гоймоноо нэмж бүх зүйлийг хольж хутгана. Тос багатай байлгахыг анхаар." },
      { time: "Зуушны хоол (15:30)", name: "Уургийн коктейль", calories: lo ? 180 : 280, ingredients: ["Банан 1 ширхэг", "Сүү 200 мл", "Уургийн нунтаг 1 хэмжүүр халбага (30 грамм)"], description: "Бүх зүйлийг холигч машинд хийж сайн нухаж уна." },
      { time: "Оройн хоол (19:00)", name: "Жигнэсэн тахианы бууз", calories: lo ? 380 : 500, ingredients: ["Тахианы мах 150 грамм (нухсан)", "Гурил 80 грамм (гадаргуу)", "Сонгино 1 толгой, сармис 3 хүрээ", "Давс, хар перец"], description: "Тахианы махаа сонгинотой хамт нухаж боодоод жигнэнэ. Шарсанаас илүү эрүүл — тос ашиглахгүй." },
    ]},
    { dayLabel: "3-р өдөр", meals: [
      { time: "Өглөөний хоол (07:00)", name: "Өндөг, авокадо, талхтай", calories: lo ? 310 : 440, ingredients: ["Өндөг 2 ширхэг (шарсан эсвэл чанасан)", "Авокадо хагас, нухсан", "Бүхэл үрийн талх 1 зүсэм", "Давс, хар перец, чили хуурай"], description: "Талхан дээрээ нухсан авокадогоо түрхээд дээр нь өндөгөө тавина." },
      { time: "Өдрийн хоол (12:30)", name: "Хонины махтай шөл (гурилтай)", calories: lo ? 400 : 560, ingredients: ["Хонины мах 120 грамм (ясгүй)", "Төмс 1 ширхэг, лууван 1 ширхэг", "Гоймон 40 грамм", "Сонгино хагас, давс"], description: "Хонины махаа чанаж хөөсийг нь авна. Ногоо нэмж зөөлрөхөд гоймоноо хийнэ. Монгол уламжлалт маханшөл." },
      { time: "Зуушны хоол (15:30)", name: "Алим, бадам самар", calories: lo ? 150 : 220, ingredients: ["Алим 1 дунд ширхэг", "Бадам самар 15 ширхэг"], description: "Алимаа угааж идэхдээ самраа хамт зажлах." },
      { time: "Оройн хоол (19:00)", name: "Загасны филе, ногооны салаттай", calories: lo ? 340 : 460, ingredients: ["Загасны филе 150 грамм (цурхай)", "Өргөст хэмх 1 ширхэг, улаан лооль 1 ширхэг", "Оливын тос 1 халбага", "Нимбэгний шүүс, давс"], description: "Загасаа хайруулын тавган дээр бага тостой шараад ногооны салаттай хамт идэнэ." },
    ]},
  ], tips: [
    "Өдөрт 2.5–3.5 литр цэвэр ус ууж байгаарай. Цай, кофе усанд тооцогдохгүй.",
    "Оройн 20:00 цагаас хойш хоол идэхээс зайлсхийгээрэй. Хоосон гэдсэнд унтах нь жин хасалтад тусална.",
    "Хоол бүрдээ тахианы мах, загас, өндөг, бүтээгдэхүүн зэрэг уургийн эх үүсвэр заавал оруулаарай.",
    "Шөнийн нойроо 7–8 цаг байлгах нь бодисын солилцоонд маш чухал нөлөөтэй.",
    "Чихэртэй ундаа (жүүс, кола, энерги ундаа)-г хязгаарлаж, оронд нь ус, ногоон цай уугаарай."
  ] };
}
function fbWork(a) {
  const d = Number(a.workoutDays) || 4;
  const t = [
    { dayLabel: "1-р өдөр", type: "Цээж + гурвалжин булчин", exercises: [{ name: "Хэвтээ шахалт (Bench Press)", detail: "4 сет × 10 давталт, сет хооронд 60 секунд амрах" }, { name: "Налуу дамбелл шахалт (Incline DB Press)", detail: "4 сет × 12 давталт" }, { name: "Кабель нислэг (Cable Fly)", detail: "3 сет × 15 давталт" }, { name: "Гурвалжин булчингийн суналт (Tricep Dip)", detail: "3 сет × 12 давталт" }, { name: "Өндөр эрчимтэй зүрхний дасгал (HIIT)", detail: "15 минут: 30 секунд хурдан, 30 секунд удаан" }] },
    { dayLabel: "2-р өдөр", type: "Нуруу + бицепс", exercises: [{ name: "Суурь татах (Deadlift)", detail: "4 сет × 8 давталт, сет хооронд 90 секунд" }, { name: "Дээшээ татах (Lat Pulldown)", detail: "4 сет × 12 давталт" }, { name: "Суудалтай дамжуулга (Seated Row)", detail: "4 сет × 12 давталт" }, { name: "Бицепс барбелл (Barbell Curl)", detail: "3 сет × 12 давталт" }] },
    { dayLabel: "3-р өдөр", type: "Хөл + хэвлий", exercises: [{ name: "Суниалт (Squat)", detail: "5 сет × 8 давталт, сет хооронд 90 секунд" }, { name: "Румын суурь татах (Romanian Deadlift)", detail: "4 сет × 10 давталт" }, { name: "Хөлний пресс (Leg Press)", detail: "4 сет × 15 давталт" }, { name: "Хавтан дасгал (Plank)", detail: "3 сет × 60 секунд барих" }] },
    { dayLabel: "4-р өдөр", type: "Мөр + өндөр эрчимтэй", exercises: [{ name: "Мөрний шахалт (Overhead Press)", detail: "4 сет × 10 давталт" }, { name: "Хажуугийн өргөлт (Lateral Raise)", detail: "4 сет × 15 давталт" }, { name: "Нүүр татах (Face Pull)", detail: "3 сет × 20 давталт" }, { name: "HIIT давталт", detail: "4 раунд: Burpee ×10, Squat Jump ×15, Mountain Climber ×20" }] },
    { dayLabel: "5-р өдөр", type: "Бүтэн биеийн дасгал", exercises: [{ name: "Суниалт (Squat)", detail: "4 сет × 10 давталт" }, { name: "Хэвтээ шахалт (Bench Press)", detail: "4 сет × 10 давталт" }, { name: "Дамжуулга (Row)", detail: "4 сет × 10 давталт" }, { name: "Зүрх судасны дасгал", detail: "20 минут дунд зэргийн эрчимтэй" }] },
    { dayLabel: "6-р өдөр", type: "Зүрх судасны дасгал + хэвлий", exercises: [{ name: "Өндөр эрчимтэй гүйлт (HIIT)", detail: "25 минут: 30 секунд спринт, 30 секунд алхах" }, { name: "Хавтан дасгал (Plank)", detail: "3 сет × 60 секунд" }, { name: "Оросын эргүүлэг (Russian Twist)", detail: "3 сет × 20 давталт" }] },
  ];
  return { days: t.slice(0, d), tips: [
    "Дасгалын өмнө 5–10 минут заавал халаалт хийж биеэ бэлдээрэй.",
    "Дасгалын дараа бүтэн биеийн сунгалт хийх нь булчингийн сэргэлтэд маш чухал.",
    "Шөнийн нойроо 7–8 цаг байлгах нь булчингийн сэргэлт, өсөлтөд зайлшгүй шаардлагатай.",
    "Дасгалын үед болон дараа усаа сайн уугаарай. Нэг удаагийн дасгалаар 500–700 мл ус алддаг."
  ] };
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
