"use client";
import { useState, useEffect, useRef } from "react";

const reviews = [
  { name: "Б. Солонго", age: 28, lost: "12 кг", time: "3 сар", text: "Фитнесс багшид сар бүр 150,000₮ төлдөг байсан. BalanceHub ашиглаад илүү сайн үр дүн гарсан." },
  { name: "Д. Бат-Эрдэнэ", age: 32, lost: "5 кг булчин+", time: "2 сар", text: "Gym-д явдаг ч юу идэхээ мэдэхгүй байсан. Хоол дасгал хоёуланг нь нэг дороос авснаар бүх зүйл хялбар боллоо." },
  { name: "Э. Нандин-Эрдэнэ", age: 24, lost: "4 кг", time: "2 долоо хоног", text: "AI маш нарийн тооцоолсон хоолны цэс гаргаж өгсөн. Тэмцээний бэлтгэлд яг тохирсон." },
  { name: "М. Оюунчимэг", age: 29, lost: "6 кг", time: "1 сар", text: "Хүүхэд төрүүлснээс хойш жин хасаж чадахгүй байсан. Надад яг тохирсон хоол зааж өгсөн." },
  { name: "Т. Мөнхбаяр", age: 41, lost: "Өвдөлт ↓", time: "2 сар", text: "Гэмтэлтэй хүнд тохирсон дасгал маш сайн. Өвдөг нурууг хамгаалсан дасгалууд гайхалтай." },
  { name: "С. Алтанцэцэг", age: 26, lost: "8 кг", time: "2 сар", text: "Олон апп туршсан ч монгол хоол байхгүй байдаг. BalanceHub бууз цуйван ч оруулсан." },
  { name: "Ж. Баярсайхан", age: 27, lost: "7 кг", time: "6 долоо хоног", text: "Гэртээ дасгал хийдэг. Тоноггүй хүнд зориулсан дасгал маш олон байдаг." },
  { name: "Ц. Болормаа", age: 22, lost: "5 кг", time: "1 сар", text: "Оюутан. Сард 10,000₮ байхад фитнесс багштай ижил чанартай төлөвлөгөө авсан." },
  { name: "Р. Батбаяр", age: 29, lost: "10 кг", time: "2 сар", text: "Ажил ихтэй хүнд зориулсан 15 минутын хоол сонголт надад яг таарсан." },
  { name: "Л. Ганбат", age: 45, lost: "15 кг", time: "5 сар", text: "45 настай ч хожуу биш гэдгийг BalanceHub надад харуулсан." },
  { name: "Ш. Энхтүвшин", age: 37, lost: "20 кг", time: "5 сар", text: "Тогтвортой дагасан. Урт хугацааны төлөвлөгөө яг хэрэгтэй байсан." },
  { name: "У. Мягмарсүрэн", age: 25, lost: "Тэмцээнд 3-р", time: "3 сар", text: "Бодибилдингийн тэмцээнд анх удаа шагнал авсан." },
];

const faqs = [
  { q: "BalanceHub үнэгүй юу?", a: "Тийм, үндсэн төлөвлөгөө үнэгүй. Premium хувилбар сарын 9,900₮." },
  { q: "Хэр хурдан үр дүн гарах вэ?", a: "Ихэнх хэрэглэгчид эхний 2 долоо хоногт өөрчлөлт мэдэрдэг." },
  { q: "Монгол хоол бий юу?", a: "Тийм! Бууз, цуйван, маханшөл зэрэг уламжлалт хоолноос орчин үеийн хоол хүртэл." },
  { q: "Фитнесс зал шаардлагатай юу?", a: "Үгүй. Гэрийн тоног эсвэл тоноггүйгээр дасгал хийж болно." },
  { q: "Мөчлөгийн хооллолт гэж юу вэ?", a: "Сарын тэмдгийн мөчлөгийн 4 үе шат тус бүрд тохирсон хоол, дасгалын зөвлөмж өгнө. Даавар, энерги, сэтгэл зүйд тулгуурлана." },
  { q: "Гэмтэлтэй бол тохирох уу?", a: "Тийм. Асуулгад гэмтлээ зааж өгөхөд AI харгалзсан дасгал зөвлөнө." },
  { q: "Хоолны харшилтай бол?", a: "Сүү, глютен, самар зэрэг харшлыг зааж өгөхөд тэдгээрийг оруулахгүйгээр цэс гаргана." },
  { q: "Төлбөрөө яаж хийх вэ?", a: "QPay-аар дурын банкны картаар эсвэл аппаар шууд төлнө." },
];

const cyclePhases = [
  {
    name: "Сарын тэмдгийн үе",
    days: "1–5 дахь өдөр",
    emoji: "🌙",
    color: "#e11d48",
    colorLight: "#fce7f3",
    hormone: "Эстроген, прогестерон — хамгийн бага",
    energy: "Бага",
    mood: "Тайван, дотогш чиглэсэн",
    foods: ["Төмөрлөг ихтэй хоол (үхрийн мах, шпинат, бүүрэг)", "Халуун шөл, маханшөл", "Харанга, гүзээлзгэнэ зэрэг жимс", "Шоколад (хар шоколад 70%+)", "Нүүрс устай дулаан хоол"],
    avoid: ["Хэт давстай хоол", "Кофе хэт их уухаас зайлсхий", "Түүхий хүйтэн хоол"],
    workout: "Хөнгөн алхалт, йога, сунгалт, бясалгал. Биеэ шахахгүй, сэргээлтэнд анхаар.",
    tip: "Энэ үед бие төмөр алддаг тул төмөрлөг ихтэй хоол заавал идээрэй. Халуун цай, шөл тусална.",
  },
  {
    name: "Фолликулын үе",
    days: "6–13 дахь өдөр",
    emoji: "🌱",
    color: "#16a34a",
    colorLight: "#dcfce7",
    hormone: "Эстроген аажмаар нэмэгдэнэ",
    energy: "Нэмэгдэж байна",
    mood: "Идэвхтэй, бүтээлч, нээлттэй",
    foods: ["Уургаар баялаг хоол (тахиа, загас, өндөг)", "Ногоон навчит ногоо (брокколи, шпинат)", "Исгэлэн хоол (йогурт, кимчи)", "Түүхий салат, жимс", "Цөцгийн тос, авокадо"],
    avoid: ["Хэт боловсруулсан хоол", "Чихэртэй зууш"],
    workout: "Зүрхний дасгал, HIIT, шинэ дасгал туршиж болно. Энерги өндөр — биеэ шахаарай!",
    tip: "Эстроген нэмэгдэж байгаа тул бие шинэ зүйлд бэлэн. Шинэ дасгал, шинэ хоол туршихад тохиромжтой үе.",
  },
  {
    name: "Овуляцийн үе",
    days: "14–16 дахь өдөр",
    emoji: "☀️",
    color: "#ea580c",
    colorLight: "#fff7ed",
    hormone: "Эстроген — хамгийн өндөр, тестостерон ↑",
    energy: "Хамгийн өндөр",
    mood: "Итгэлтэй, нийтэч, эрч хүчтэй",
    foods: ["Хөнгөн уургат хоол (загас, тофу)", "Түүхий ногоо, жимсний салат", "Эслэгтэй хоол (буудай, овъёос)", "Антиоксидантаар баялаг жимс", "Ус, ногоон цай их уух"],
    avoid: ["Өөхтэй хүнд хоол", "Согтууруулах ундаа", "Натри ихтэй хоол (хавагналт үүсгэнэ)"],
    workout: "Хүнд жинтэй дасгал, бүлгийн дасгал, өндөр эрчимтэй cardio. Энэ үед хамгийн их хүч гарна!",
    tip: "Энерги оргилдоо байна. Хамгийн хүнд дасгалуудаа энэ үед хий. Нийгмийн арга хэмжээнд оролцоорой.",
  },
  {
    name: "Лютеалын үе",
    days: "17–28 дахь өдөр",
    emoji: "🍂",
    color: "#7c3aed",
    colorLight: "#ede9fe",
    hormone: "Прогестерон ↑, дараа нь хоёулаа буурна",
    energy: "Аажмаар буурна",
    mood: "Дотогш чиглэсэн, мэдрэмтгий",
    foods: ["Магнийтай хоол (хар шоколад, самар, банан)", "Нарийн боов биш — бүхэл бүтэн нүүрс ус (хүрэн будаа, батат)", "B6 витамин (тахиа, загас, төмс)", "Кальцитай хоол (сүү, йогурт)", "Камомил цай, алчуур цай"],
    avoid: ["Чихэр ихтэй хоол (PMS-ийг хүчтэй болгоно)", "Кофеин хязгаарлах", "Архи"],
    workout: "Дунд зэргийн дасгал, пилатес, йога, алхалт. Сүүлийн өдрүүдэд бүр хөнгөлөөрэй.",
    tip: "PMS шинж тэмдэг гарч болно. Магни, B6 витамин тусална. Өөрийгөө хүчлэхгүй, сонсоорой.",
  },
];

function useInView(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    o.observe(ref.current);
    return () => o.disconnect();
  }, [ref]);
  return v;
}

function Section({ children, bg, style = {} }) {
  const ref = useRef(null);
  const vis = useInView(ref);
  return (
    <section ref={ref} style={{
      padding: "72px 24px", background: bg || "transparent",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)",
      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)", ...style,
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function Badge({ children, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "6px 18px", borderRadius: 24,
      background: color || "linear-gradient(135deg, #ede9fe, #e0e7ff)", color: "#6d28d9",
      fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
    }}>{children}</span>
  );
}

export default function BalanceHub() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [revIdx, setRevIdx] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const vis = reviews.slice(revIdx, revIdx + 3);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phase = cyclePhases[activePhase];

  return (
    <div style={{
      minHeight: "100vh", background: "#fefefe", color: "#0f172a",
      fontFamily: `'DM Sans', -apple-system, system-ui, sans-serif`, overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet" />
      <style>{`@keyframes gradMove{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>

      {/* NAV */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 24px",
        background: scrollY > 50 ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(16px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid #f1f5f9" : "1px solid transparent",
        position: "sticky", top: 0, zIndex: 100, transition: "all 0.3s",
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px #7c3aed30" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          Balance<span style={{ color: "#7c3aed" }}>Hub</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 14 }}>
          <a href="#cycle" style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Мөчлөг</a>
          <a href="#features" style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Боломж</a>
          <a href="#faq" style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Асуулт</a>
          <button style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px #7c3aed25" }}>Эхлэх</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 720, margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, #ede9fe44, transparent 70%)", pointerEvents: "none" }} />
        <Badge>✨ 10,000+ хэрэглэгч итгэн ашиглаж байна</Badge>
        <h1 style={{ fontSize: 50, fontWeight: 800, lineHeight: 1.1, margin: "24px 0 20px", letterSpacing: -1.5 }}>
          Жин хасах замыг<br />
          <span style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb, #7c3aed)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradMove 4s ease infinite" }}>хялбар болгоё</span>
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.7, margin: "0 auto 36px", maxWidth: 520 }}>
          Таны нас, жин, зорилгод тулгуурлан AI эхний өдрөөс яг тохирсон хоол, дасгалын төлөвлөгөө гаргана. Фитнесс багшаас <strong style={{ color: "#7c3aed" }}>10 дахин хямд.</strong>
        </p>
        <button style={{ padding: "18px 56px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", fontWeight: 700, fontSize: 17, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 32px #7c3aed30", transition: "transform 0.2s" }}
          onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.target.style.transform = "translateY(0)"}
        >Үнэгүй эхлэх →</button>
        <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 12 }}>Карт шаардлагагүй • 2 минутад бэлэн</p>
      </section>

      {/* SOCIAL PROOF */}
      <Section bg="#f8fafc" style={{ borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[{ icon: "👥", val: "10,000+", label: "Хэрэглэгч" }, { icon: "⚖️", val: "25,000+ кг", label: "Хассан жин" }, { icon: "⭐", val: "4.8 / 5", label: "Үнэлгээ" }, { icon: "🏆", val: "98%", label: "Сэтгэл ханамж" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#7c3aed", marginTop: 4 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ CYCLE SYNCING ═══ */}
      <Section>
        <div style={{ textAlign: "center", marginBottom: 40 }} id="cycle">
          <Badge color="linear-gradient(135deg, #fce7f3, #ede9fe)">🌸 Эмэгтэйчүүдэд зориулсан</Badge>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16, letterSpacing: -0.5 }}>
            Мөчлөгт тохирсон <span style={{ color: "#e11d48" }}>ухаалаг хооллолт</span>
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", marginTop: 8, lineHeight: 1.7, maxWidth: 500, margin: "8px auto 0" }}>
            Таны сарын тэмдгийн мөчлөгийн үе шат бүрд даавар, энерги, сэтгэл зүйд тохирсон хоол, дасгалын зөвлөмж өгнө. Биеийнхээ хэмнэлтэй зохицоорой.
          </p>
        </div>

        {/* Cycle visual ring */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ position: "relative", width: 220, height: 220 }}>
            {cyclePhases.map((p, i) => {
              const angle = (i * 90 - 90) * (Math.PI / 180);
              const r = 85;
              const x = 110 + r * Math.cos(angle) - 28;
              const y = 110 + r * Math.sin(angle) - 28;
              const isActive = activePhase === i;
              return (
                <button key={i} onClick={() => setActivePhase(i)} style={{
                  position: "absolute", left: x, top: y,
                  width: 56, height: 56, borderRadius: "50%",
                  background: isActive ? p.color : p.colorLight,
                  border: `3px solid ${isActive ? p.color : "#e2e8f0"}`,
                  fontSize: 24, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s", transform: isActive ? "scale(1.15)" : "scale(1)",
                  boxShadow: isActive ? `0 4px 20px ${p.color}40` : "none",
                  animation: isActive ? "float 2s ease-in-out infinite" : "none",
                }}>{p.emoji}</button>
              );
            })}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>ӨДӨР</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: phase.color }}>{phase.days}</div>
            </div>
          </div>
        </div>

        {/* Phase tabs */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
          {cyclePhases.map((p, i) => (
            <button key={i} onClick={() => setActivePhase(i)} style={{
              padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
              fontFamily: "inherit", fontWeight: 600, fontSize: 12,
              background: activePhase === i ? p.color : p.colorLight,
              color: activePhase === i ? "#fff" : p.color,
              transition: "all 0.2s",
            }}>{p.emoji} {p.name}</button>
          ))}
        </div>

        {/* Phase detail card */}
        <div style={{
          background: "#fff", borderRadius: 24, padding: "28px",
          border: `2px solid ${phase.colorLight}`,
          boxShadow: `0 8px 40px ${phase.color}08`,
          transition: "all 0.3s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: phase.colorLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{phase.emoji}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: phase.color }}>{phase.name}</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>{phase.days}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[{ label: "Даавар", val: phase.hormone, icon: "🧬" }, { label: "Энерги", val: phase.energy, icon: "⚡" }, { label: "Сэтгэл зүй", val: phase.mood, icon: "💭" }].map((s, i) => (
              <div key={i} style={{ background: phase.colorLight, borderRadius: 14, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: phase.color, lineHeight: 1.4 }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Foods */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>🍽️</span> Зөвлөмж хоолууд
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {phase.foods.map((f, i) => (
                <span key={i} style={{ padding: "6px 12px", borderRadius: 8, background: phase.colorLight, fontSize: 12, fontWeight: 500, color: phase.color }}>{f}</span>
              ))}
            </div>
          </div>

          {/* Avoid */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>🚫</span> Зайлсхийх
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {phase.avoid.map((a, i) => (
                <span key={i} style={{ padding: "6px 12px", borderRadius: 8, background: "#fef2f2", fontSize: 12, fontWeight: 500, color: "#dc2626" }}>{a}</span>
              ))}
            </div>
          </div>

          {/* Workout */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>🏃‍♀️</span> Тохирох дасгал
            </div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>{phase.workout}</p>
          </div>

          {/* Tip */}
          <div style={{ background: phase.colorLight, borderRadius: 14, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <p style={{ fontSize: 13, color: phase.color, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{phase.tip}</p>
          </div>
        </div>
      </Section>

      {/* AI COACH */}
      <Section bg="#f8fafc" style={{ borderTop: "1px solid #f1f5f9" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Badge>Таны хувийн зөвлөгч</Badge>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16 }}>AI хоолзүйч <span style={{ color: "#7c3aed" }}>24/7</span> бэлэн</h2>
          <p style={{ fontSize: 16, color: "#64748b", marginTop: 8, lineHeight: 1.7, maxWidth: 460, margin: "8px auto 0" }}>Зорилгыг ойлгож, ялалтыг тэмдэглэж, буцааж зөв замд оруулна.</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 24, padding: "28px", border: "1px solid #e2e8f0", maxWidth: 420, margin: "0 auto", boxShadow: "0 8px 40px #0001" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
            <div><div style={{ fontWeight: 700, fontSize: 15 }}>BalanceHub AI</div><div style={{ fontSize: 12, color: "#16a34a" }}>● Онлайн</div></div>
          </div>
          {[
            { from: "ai", text: "Сайн байна уу! 👋 Таны мөчлөгийн лютеалын үед байна. Магнийтай хоол идэхийг зөвлөе!" },
            { from: "user", text: "PMS-ийн шинж тэмдэг гарч байна, юу тусалдаг вэ?" },
            { from: "ai", text: "Хар шоколад (70%+), банан, бадам самар тусална. Камомил цай уугаарай. Хүнд дасгалын оронд йога, алхалт хийнэ үү 🧘‍♀️" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
              <div style={{ maxWidth: "82%", padding: "12px 16px", borderRadius: 16, fontSize: 14, lineHeight: 1.6, background: m.from === "user" ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "#f1f5f9", color: m.from === "user" ? "#fff" : "#0f172a", borderBottomRightRadius: m.from === "user" ? 4 : 16, borderBottomLeftRadius: m.from === "ai" ? 4 : 16 }}>{m.text}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* FEATURES */}
      <Section>
        <div style={{ textAlign: "center", marginBottom: 40 }} id="features">
          <Badge>Нэг дор бүгд</Badge>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16 }}>Шаардлагатай бүх хэрэгсэл</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { icon: "📋", title: "Хувийн хоолны цэс", desc: "AI таны биед тохирсон калори макро тооцоотой цэс үүсгэнэ", color: "#7c3aed" },
            { icon: "🌸", title: "Мөчлөгийн хооллолт", desc: "Сарын тэмдгийн 4 үе шатад тохирсон хоол дасгалын зөвлөмж", color: "#e11d48" },
            { icon: "📸", title: "Хоолны сканнер", desc: "Зураг дарахад AI калори тэжээллэг чанарыг шууд тооцоолно", color: "#ea580c" },
            { icon: "🏋️", title: "Дасгалын хуваарь", desc: "Зорилго туршлага тоногт тохирсон сет давталт бүхий хуваарь", color: "#0284c7" },
            { icon: "💧", title: "Ус нойрны трекер", desc: "Усны хэрэглээ нойрны хэмжээг бүртгэж зорилтоо хянана", color: "#16a34a" },
            { icon: "🤖", title: "AI зөвлөгчтэй чат", desc: "Хүссэн үедээ AI хоолзүйчээс хувийн зөвлөмж аваарай", color: "#7c3aed" },
          ].map((f, i) => (
            <div key={i} style={{ padding: "24px", background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px #0001"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{ fontSize: 28, width: 52, height: 52, borderRadius: 14, background: `${f.color}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: f.color }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section bg="#f8fafc" style={{ borderTop: "1px solid #f1f5f9" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Badge>Энгийн 4 алхам</Badge>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16 }}>Хэрхэн ажилладаг вэ?</h2>
        </div>
        {[
          { n: "01", title: "Үйлчилгээ сонгоно", desc: "Хоол, дасгал, мөчлөгийн хооллолт — эсвэл бүгдийг хамтад нь", icon: "🎯" },
          { n: "02", title: "2 минутын асуулга бөглөнө", desc: "Нас, жин, зорилго, мөчлөгийн мэдээлэл", icon: "📝" },
          { n: "03", title: "AI төлөвлөгөө үүсгэнэ", desc: "10 секундэд таны биед тохирсон бүрэн төлөвлөгөө", icon: "🤖" },
          { n: "04", title: "Өдөр бүр хянана", desc: "Гүйцэтгэлээ тэмдэглэж, ахицаа хянана", icon: "📊" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 20, alignItems: "center", padding: "24px 0", borderBottom: i < 3 ? "1px solid #e2e8f0" : "none" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, flexShrink: 0, boxShadow: "0 4px 16px #7c3aed20" }}>{s.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: "#64748b" }}>{s.desc}</div>
            </div>
            <div style={{ fontSize: 32 }}>{s.icon}</div>
          </div>
        ))}
      </Section>

      {/* PRICING */}
      <Section>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Badge>💰 Харьцуулалт</Badge>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16 }}>Фитнесс багшаас <span style={{ color: "#7c3aed" }}>10x хямд</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "32px 24px", border: "1px solid #e2e8f0", textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Фитнесс багш</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#ef4444" }}>150,000₮</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>сар бүр</div>
            {["7 хоногт 1–2 уулзалт", "Хоол багтаагүй", "Мөчлөгийн зөвлөмж алга", "Цаг товлох шаардлагатай"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: "#94a3b8" }}><span>✗</span> {t}</div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 24, padding: "32px 24px", border: "2px solid #7c3aed", textAlign: "center", position: "relative", boxShadow: "0 8px 40px #7c3aed15" }}>
            <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", padding: "5px 20px", borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", fontSize: 12, fontWeight: 700 }}>Хэмнэлттэй</div>
            <div style={{ fontSize: 13, color: "#7c3aed", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>BalanceHub</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#7c3aed" }}>9,900₮</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>сар бүр</div>
            {["24/7 AI зөвлөгч", "Хоол + дасгал багтсан", "Мөчлөгийн хооллолт ✨", "Гэр бүлээрээ ашиглаж болно"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: "#16a34a" }}><span>✓</span> {t}</div>
            ))}
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section bg="#f8fafc" style={{ borderTop: "1px solid #f1f5f9" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Badge>⭐ Бодит үр дүн</Badge>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16 }}>Хэрэглэгчдийн амжилт</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {vis.map((r, i) => (
            <div key={revIdx + i} style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div><div style={{ fontWeight: 700, fontSize: 16 }}>{r.name}</div><div style={{ fontSize: 12, color: "#94a3b8" }}>{r.age} нас • {r.time}</div></div>
                <div style={{ padding: "6px 14px", borderRadius: 10, background: "linear-gradient(135deg, #ede9fe, #e0e7ff)", color: "#6d28d9", fontSize: 14, fontWeight: 700 }}>−{r.lost}</div>
              </div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>"{r.text}"</p>
              <div style={{ marginTop: 8, color: "#f59e0b", letterSpacing: 2 }}>★★★★★</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
          <button onClick={() => setRevIdx(i => Math.max(i - 3, 0))} disabled={revIdx === 0} style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: revIdx === 0 ? "#cbd5e1" : "#0f172a", cursor: revIdx === 0 ? "not-allowed" : "pointer", fontSize: 16, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <span style={{ padding: "10px 16px", fontSize: 13, color: "#94a3b8" }}>{Math.floor(revIdx / 3) + 1}/{Math.ceil(reviews.length / 3)}</span>
          <button onClick={() => setRevIdx(i => Math.min(i + 3, reviews.length - 3))} disabled={revIdx >= reviews.length - 3} style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: revIdx >= reviews.length - 3 ? "#cbd5e1" : "#0f172a", cursor: revIdx >= reviews.length - 3 ? "not-allowed" : "pointer", fontSize: 16, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div style={{ textAlign: "center", marginBottom: 36 }} id="faq">
          <Badge>❓ Асуулт & Хариулт</Badge>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16 }}>Түгээмэл асуултууд</h2>
        </div>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", padding: "20px 0", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit" }}>
              <span style={{ fontSize: 16, fontWeight: 600, textAlign: "left", color: "#0f172a" }}>{f.q}</span>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: faqOpen === i ? "#7c3aed" : "#f1f5f9", color: faqOpen === i ? "#fff" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, marginLeft: 16, transition: "all 0.2s" }}>{faqOpen === i ? "−" : "+"}</span>
            </button>
            <div style={{ maxHeight: faqOpen === i ? 200 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
              <div style={{ padding: "0 0 20px", fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>{f.a}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* CTA */}
      <Section>
        <div style={{ textAlign: "center", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: 28, padding: "56px 32px", boxShadow: "0 16px 60px #7c3aed25", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "#ffffff15" }} />
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Зорилгодоо хүрэх цаг боллоо</h2>
          <p style={{ color: "#e0d4ff", fontSize: 16, marginBottom: 28, lineHeight: 1.7, maxWidth: 420, margin: "0 auto 28px" }}>10,000 гаруй хүн BalanceHub-аар амьдралаа өөрчилсөн. Дараагийнх нь та.</p>
          <button style={{ padding: "18px 52px", borderRadius: 16, border: "none", background: "#fff", color: "#7c3aed", fontWeight: 700, fontSize: 17, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px #0002" }}>Одоо эхлэх →</button>
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 24px", borderTop: "1px solid #f1f5f9", background: "#f8fafc" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Balance<span style={{ color: "#7c3aed" }}>Hub</span></div>
          <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
            <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>Тооцоолуур</a>
            <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>Блог</a>
            <a href="#" style={{ color: "#64748b", textDecoration: "none" }}>Нууцлал</a>
          </div>
        </div>
        <div style={{ maxWidth: 680, margin: "16px auto 0", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>© 2025 BalanceHub. Бүх эрх хуулиар хамгаалагдсан.</div>
      </footer>
    </div>
  );
}
