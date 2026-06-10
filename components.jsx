/* Karta Creator Program — UI kit components (forked from proposal kit). */
const { useState, useEffect, useRef } = React;

function useIsMobile(bp = 760) {
  const [m, setM] = useState(typeof window !== "undefined" && window.innerWidth <= bp);
  useEffect(() => {
    const on = () => setM(window.innerWidth <= bp);
    window.addEventListener("resize", on);
    on();
    return () => window.removeEventListener("resize", on);
  }, [bp]);
  return m;
}

function Label({ children, variant }) {
  const mid = variant === "light" ? "#f1f1f1" : "var(--pp-fg-2)";
  return (
    <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 16, lineHeight: 1.5, display: "inline-flex", color: mid, letterSpacing: "-.01em" }}>
      {children}
    </span>
  );
}

function ArrowIcon({ color = "#030303" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h10M10 5l4 4-4 4" />
    </svg>
  );
}

function Button({ children, variant = "primary", onClick, href }) {
  const cls = "pp-pill-btn" + (variant === "primary" ? " pp-pill-btn--accent" : "");
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} onClick={onClick} className={cls} style={{ textDecoration: "none" }}>
      <svg className="ic" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="disc" cx="12" cy="12" r="11" />
        <path className="glyph" d="M8 12h7M12.4 8.8l3.4 3.2-3.4 3.2" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </Tag>
  );
}

const socials = {
  ig: "M9 6.2A2.8 2.8 0 1 0 9 11.8 2.8 2.8 0 0 0 9 6.2Zm0 1.5A1.3 1.3 0 1 1 9 10.3 1.3 1.3 0 0 1 9 7.7Zm3-1.9a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0ZM6 4h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  in: "M5.5 7.5H7.3V13H5.5V7.5ZM6.4 4.8a1 1 0 1 1 0 2.1 1 1 0 0 1 0-2.1ZM8.5 7.5h1.7v.8c.3-.5.9-.9 1.7-.9 1.5 0 2.1 1 2.1 2.6V13h-1.8v-2.5c0-.7-.2-1.2-.9-1.2-.6 0-.9.4-.9 1.1V13H8.5V7.5Z",
  x: "M11.6 4.5h1.7l-3.7 4.3 4.4 5.7h-3.4L8.3 11l-2.9 3.5H3.6l4-4.7L3.4 4.5h3.5L9.3 7.7 11.6 4.5Zm-.6 8.9h.9L7 5.5h-1L11 13.4Z",
  th: "M11.6 8.6c-.1-.05-.2-.1-.3-.14.05-1.4-.7-2.2-2-2.2-.85 0-1.5.36-1.86 1l.78.53c.27-.4.7-.49.99-.49.45 0 .9.27.94.86-.3-.05-.62-.05-.94-.03-1.27.07-2.08.8-2.03 1.83.03.95.86 1.5 1.84 1.45 1.13-.06 1.8-.7 1.98-1.86.18.11.32.26.39.46.13.32.13.85-.31 1.29-.39.39-.86.56-1.57.56-.79 0-1.39-.25-1.78-.75-.36-.46-.55-1.13-.56-1.98.01-.85.2-1.52.56-1.99.39-.5.99-.75 1.78-.76 1.12.01 1.74.45 2.13 1.31l.91-.39c-.5-1.14-1.5-1.84-3.04-1.85-1.08 0-1.95.36-2.55 1.07-.55.66-.84 1.59-.85 2.66 0 1.07.3 2 .85 2.66.6.71 1.47 1.07 2.55 1.07.96 0 1.74-.25 2.34-.85.79-.78.76-1.76.55-2.27-.15-.37-.43-.68-.81-.91Z",
};
function Social({ k }) {
  const [h, setH] = useState(false);
  return (
    <a href="#" onClick={(e) => e.preventDefault()} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 40, height: 40, borderRadius: 4, background: h ? "#444" : "var(--pp-control)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .3s" }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff"><path d={socials[k]} /></svg>
    </a>
  );
}

/* ---------- header / mega-menu ---------- */
const MENU = [
  { label: "Start", id: "start" },
  { label: "Who you reach", id: "audience" },
  { label: "How it works", id: "how" },
  { label: "What you earn", id: "earnings" },
  { label: "Attribution", id: "attribution" },
  { label: "Terms", id: "terms" },
  { label: "Apply", id: "next-steps" },
];

function MenuIcon({ open }) {
  const bar = { display: "block", position: "absolute", left: 0, width: 22, height: 2, background: "#fafafa", borderRadius: 2, transition: "transform .4s cubic-bezier(.44,0,.16,1)" };
  return (
    <span style={{ position: "relative", width: 22, height: 12, display: "inline-block" }}>
      <span style={{ ...bar, top: open ? 5 : 2, transform: open ? "rotate(45deg)" : "none" }} />
      <span style={{ ...bar, top: open ? 5 : 8, transform: open ? "rotate(-45deg)" : "none" }} />
    </span>
  );
}

function Header({ active, onNav, onCopy, copied }) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const go = (item) => { onNav(item.id); setOpen(false); };
  return (
    <header style={{ position: "fixed", top: 16, left: 0, right: 0, zIndex: 40, width: "min(100% - 24px, 980px)", height: 60, margin: "0 auto" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: open ? "100%" : "min(100%, 300px)",
        maxWidth: open ? 820 : 300,
        background: "rgba(20,20,20,0.55)",
        backdropFilter: "blur(22px) saturate(165%)", WebkitBackdropFilter: "blur(22px) saturate(165%)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14, overflow: "hidden",
        boxShadow: open
          ? "0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.03)"
          : "0 8px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,0.16)",
        transition: "width .5s cubic-bezier(.44,0,.16,1), box-shadow .4s, background .4s" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(255,255,255,0.08), transparent)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px", height: 60, boxSizing: "border-box" }}>
          <img src="assets/karta-logo-white.svg" alt="Karta" style={{ height: 20 }} />
          <button onClick={() => setOpen(!open)} aria-expanded={open}
            style={{ display: "flex", alignItems: "center", gap: 11, background: "transparent", border: "none", cursor: "pointer", color: "#fafafa", fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 19 }}>
            <MenuIcon open={open} />
            <span>Menu</span>
          </button>
        </div>
        <div style={{ maxHeight: open ? (isMobile ? 760 : 520) : 0, opacity: open ? 1 : 0, overflow: "hidden",
          transition: "max-height .5s cubic-bezier(.44,0,.16,1) " + (open ? ".1s" : "0s") + ", opacity .35s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.05fr 1fr", gap: 18, padding: "6px 18px 20px" }}>
            <nav style={{ background: "rgba(13,13,13,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "22px 26px", display: "flex", flexDirection: "column", gap: 4 }}>
              {MENU.map((it, i) => {
                const on = active === it.id;
                return (
                  <button key={it.label} onClick={() => go(it)}
                    style={{ textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "2px 0",
                      color: on ? "var(--pp-acid)" : "#fafafa", fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: isMobile ? 21 : 24, lineHeight: 1.34, letterSpacing: "-.01em",
                      transform: open ? "translateY(0)" : "translateY(10px)", opacity: open ? 1 : 0,
                      transition: `transform .45s cubic-bezier(.44,0,.16,1) ${0.06 + i * 0.035}s, opacity .45s ease ${0.06 + i * 0.035}s, color .2s` }}
                    onMouseEnter={(e) => { if (!on) e.currentTarget.style.color = "var(--pp-acid)"; }}
                    onMouseLeave={(e) => { if (!on) e.currentTarget.style.color = "#fafafa"; }}>
                    {it.label}
                  </button>
                );
              })}
            </nav>
            <div style={{ padding: "16px 6px", display: "flex", flexDirection: "column", gap: 22 }}>
              <h3 style={{ margin: 0, fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 30, color: "#fafafa", letterSpacing: "-.01em" }}>Become a partner.</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p className="pp-body" style={{ margin: 0 }}>Send your portfolio to:</p>
                <button onClick={onCopy} style={{ display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "flex-start", background: "var(--pp-control)", border: "none", borderRadius: 6, padding: "10px 14px", cursor: "pointer" }}>
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="#fafafa" strokeWidth="1.5"><rect x="6" y="6" width="8" height="8" rx="1.5"/><path d="M11.5 6V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v5A1.5 1.5 0 0 0 5 11.5h1"/></svg>
                  <span className="pp-body" style={{ color: "#fafafa" }}>{copied ? "Email copied" : "creators@karta.io"}</span>
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p className="pp-body" style={{ margin: 0 }}>Follow Karta:</p>
                <div style={{ display: "flex", gap: 8 }}><Social k="ig" /><Social k="in" /><Social k="th" /><Social k="x" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- hero ---------- */
function Stagger({ text, style }) {
  const words = text.split(" ");
  let i = 0;
  return (
    <span style={style}>
      {words.map((w, wi) => (
        <React.Fragment key={wi}>
          <span style={{ whiteSpace: "nowrap" }}>
            {w.split("").map((c) => {
              const idx = i++;
              return <span key={idx} className="pp-rise" style={{ display: "inline-block", animationDelay: `${0.2 + idx * 0.03}s` }}>{c}</span>;
            })}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </span>
  );
}

function Hero({ onCta }) {
  const bgRef = React.useRef(null);
  const cardRef = React.useRef(null);
  const isMobile = useIsMobile();
  React.useEffect(() => {
    let h;
    if (bgRef.current && window.KartaHeroShader) {
      h = window.KartaHeroShader.mount(bgRef.current, { acid: "#ccff00", blur: 130, intensity: 1 });
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!cardRef.current || reduce) return;
        const vh = window.innerHeight;
        const p = Math.min(Math.max(window.scrollY / (vh * 0.85), 0), 1);
        cardRef.current.style.transform = `rotateX(${p * 9}deg) scale(${1 - p * 0.14}) translateY(${p * -6}%)`;
        cardRef.current.style.opacity = String(1 - p * 0.55);
        cardRef.current.style.filter = `brightness(${1 - p * 0.35})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { h && h.destroy(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section style={{ position: "sticky", top: 0, zIndex: 0, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      <div ref={cardRef} style={{ position: "relative", width: "100%", flex: 1, minHeight: 520, borderRadius: 4, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isMobile ? 22 : 30, padding: isMobile ? 24 : 48,
        background: "#040404", transformOrigin: "50% 0%", willChange: "transform, opacity" }}>
        <div ref={bgRef} style={{ position: "absolute", inset: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 16 : 20, position: "relative", width: "100%", maxWidth: 680 }}>
          <Label>creator partner program</Label>
          <h1 style={{ margin: 0, textAlign: "center", maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Stagger text="Creator" style={{ display: "block", fontFamily: "var(--pp-font-mono)", fontWeight: 800, fontStretch: "125%", fontVariationSettings: "'wght' 800, 'wdth' 125", fontSize: "clamp(42px,8vw,76px)", lineHeight: 0.94, letterSpacing: "-0.03em", color: "#fafafa" }} />
            <Stagger text="Program" style={{ display: "block", fontFamily: "var(--pp-font-mono)", fontWeight: 800, fontStretch: "125%", fontVariationSettings: "'wght' 800, 'wdth' 125", fontSize: "clamp(42px,8vw,76px)", lineHeight: 0.94, letterSpacing: "-0.03em", color: "var(--pp-acid)" }} />
          </h1>
          <h2 className="pp-lead" style={{ margin: 0, textAlign: "center", maxWidth: 660 }}>Make the creative once. Earn a share of every user it brings in — <span style={{ color: "var(--pp-acid)" }}>every month</span>, for as long as they spend.</h2>
        </div>
        {/* flagship object — Metal LED card (user drops a render) */}
        <image-slot
          id="hero-card"
          shape="rounded"
          radius="16"
          placeholder="Drop the Metal LED card render"
          style={{ width: "min(340px, 72vw)", aspectRatio: "1.585", position: "relative", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}
        ></image-slot>
        <Button onClick={onCta}>See the numbers</Button>
      </div>
    </section>
  );
}

Object.assign(window, { Label, Button, ArrowIcon, Social, Header, Hero, Stagger, MENU, useIsMobile });
