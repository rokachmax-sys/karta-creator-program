/* Karta Creator Program — content sections. Depends on components.jsx + charts.jsx (window globals). */

/* ---------- shells ---------- */
function Section({ id, children, label, intro, refCb, gap }) {
  const isMobile = useIsMobile();
  return (
    <section id={id} ref={refCb} style={{ position: "relative", zIndex: 1, background: "var(--pp-page)", padding: isMobile ? "56px 20px" : 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1040, display: "flex", flexDirection: "column", gap: gap || (isMobile ? 40 : 64) }}>
        {(label || intro) && (
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "1 0 160px" }}><Label>{label}</Label></div>
            {intro && <h2 className="pp-lead" style={{ flex: "2 0 320px", margin: 0 }}>{intro}</h2>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

function HCard({ children, style }) {
  return <div style={{ background: "var(--pp-card)", border: "1px solid var(--pp-line)", borderRadius: 4, padding: 24, display: "flex", flexDirection: "column", ...style }}>{children}</div>;
}

function SectionDivider({ id, num, title, refCb }) {
  const cardRef = React.useRef(null);
  const secRef = React.useRef(null);
  const isMobile = useIsMobile();
  React.useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let startY = 0;
    const measure = () => { if (secRef.current) startY = secRef.current.getBoundingClientRect().top + window.scrollY; };
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!cardRef.current || reduce) return;
        const vh = window.innerHeight;
        const p = Math.min(Math.max((window.scrollY - startY) / (vh * 0.85), 0), 1);
        cardRef.current.style.transform = `rotateX(${p * 9}deg) scale(${1 - p * 0.14}) translateY(${p * -6}%)`;
        cardRef.current.style.opacity = String(1 - p * 0.55);
        cardRef.current.style.filter = `brightness(${1 - p * 0.35})`;
      });
    };
    const onResize = () => { measure(); onScroll(); };
    setTimeout(measure, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    let io;
    if (cardRef.current && "IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { cardRef.current && cardRef.current.setAttribute("data-in", ""); io.disconnect(); } });
      }, { threshold: 0.35 });
      io.observe(cardRef.current);
    }
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); io && io.disconnect(); };
  }, []);
  const words = String(title).split(" ");
  return (
    <section id={id} ref={(el) => { secRef.current = el; if (refCb) refCb(el); }}
      style={{ position: "sticky", top: 0, zIndex: 0, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      <div ref={cardRef} className="pp-divider"
        style={{ position: "relative", width: "100%", flex: 1, minHeight: 520, borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 28 : 60, transformOrigin: "50% 0%", willChange: "transform, opacity",
          background: "radial-gradient(120% 90% at 50% 122%, rgba(204,255,0,.42), transparent 55%), radial-gradient(80% 70% at 84% 116%, rgba(204,255,0,.30), transparent 60%), radial-gradient(80% 70% at 14% 120%, rgba(170,221,0,.22), transparent 60%), #040404" }}>
        <span className="pp-div-num" aria-hidden="true"
          style={{ position: "absolute", top: "6%", right: isMobile ? "5%" : "3%", zIndex: 0,
            fontFamily: "var(--pp-font-display)", fontWeight: 800, fontStretch: "125%", fontVariationSettings: "'wght' 800, 'wdth' 125",
            fontSize: "clamp(120px, 22vw, 300px)", lineHeight: .8, letterSpacing: "-.05em",
            color: "transparent", WebkitTextStroke: "1.5px #262626" }}>{num}</span>
        <h1 className="pp-h1" style={{ position: "relative", zIndex: 1, margin: 0, maxWidth: 1120, textAlign: "center", fontSize: "clamp(48px,7vw,96px)", lineHeight: 1.0, letterSpacing: "-.035em" }}>
          {words.map((w, i) => (
            <span key={i} className="pp-div-word" style={{ animationDelay: `${0.12 + i * 0.05}s` }}>{w}{i < words.length - 1 ? "\u00A0" : ""}</span>
          ))}
        </h1>
      </div>
    </section>
  );
}

/* ---------- About / start ---------- */
function StatStrip() {
  const isMobile = useIsMobile();
  const stats = [
    ["25,000+", "card holders"],
    ["150+", "countries"],
    ["Visa Signature", "virtual · plastic · metal LED"],
    ["Profitable", "self-funded since 2021"],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 1, background: "var(--pp-line)", border: "1px solid var(--pp-line)", borderRadius: 4, overflow: "hidden" }}>
      {stats.map(([n, l], i) => (
        <div key={i} style={{ background: "var(--pp-card)", padding: isMobile ? "26px 20px" : "32px 26px", display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 800, fontStretch: "125%", fontVariationSettings: "'wght' 800, 'wdth' 125", fontSize: i < 2 ? 44 : 26, lineHeight: 1, color: "var(--pp-acid)", letterSpacing: "-.02em" }}>{n}</span>
          <span className="pp-body" style={{ fontSize: 14 }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function About({ refCb }) {
  return (
    <Section id="start" label="about karta" refCb={refCb}
      intro="Karta is a self-custody money app for people who live between countries — one wallet to receive, hold, spend, and send. Stablecoins as the rails, a familiar bank interface on top.">
      <StatStrip />
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <HCard style={{ flex: "1 1 320px", minHeight: 320, justifyContent: "space-between" }}>
          <Label>the mission</Label>
          <h3 className="pp-h3" style={{ margin: "0", fontSize: 30, lineHeight: 1.2 }}>Make money as borderless as the people who use it.</h3>
        </HCard>
        <HCard style={{ flex: "1 1 320px", minHeight: 320, justifyContent: "space-between" }}>
          <Label>this program</Label>
          <p className="pp-body" style={{ margin: 0, fontSize: 18, lineHeight: 1.55 }}>A partner program for creators who make ad creative — video, static, motion, UGC — for Karta. Instead of a one-off fee, you earn a share of revenue from every user your creative brings in. <span style={{ color: "#fafafa" }}>Indefinitely — for as long as they keep using the card.</span></p>
        </HCard>
      </div>
    </Section>
  );
}

/* ---------- the problem ---------- */
function Problem({ refCb }) {
  return (
    <section ref={refCb} style={{ position: "relative", zIndex: 1, background: "var(--pp-page)", padding: "0 20px 0", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 1040, borderTop: "1px solid var(--pp-line)", padding: "72px 0", display: "flex", flexDirection: "column", gap: 40 }}>
        <Label>the problem we solve</Label>
        <p className="pp-h1" style={{ margin: 0, fontSize: "clamp(30px,4.4vw,52px)", lineHeight: 1.18, letterSpacing: "-.02em", maxWidth: 980 }}>
          The world is full of borderless people. Their money still has borders. Five apps to manage it, SWIFT that takes days, <span style={{ color: "var(--pp-acid)" }}>5–15% of income lost to fees.</span> We took crypto's global reach and hid it inside the simplicity of a bank.
        </p>
      </div>
    </section>
  );
}

/* ---------- audience / personas ---------- */
function PersonaCard({ tag, name, who, body, values, quote }) {
  return (
    <HCard style={{ flex: "1 1 460px", padding: 28, gap: 22, justifyContent: "space-between", minHeight: 340 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <h3 className="pp-h3" style={{ margin: 0, fontSize: 28 }}>{name}</h3>
          <span className="pp-role" style={{ fontSize: 14 }}>{tag}</span>
        </div>
        <span className="pp-body" style={{ fontSize: 14, color: "var(--pp-fg-3)" }}>{who}</span>
        <p className="pp-body" style={{ margin: 0, fontSize: 16 }}>{body}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
          {values.map((v, i) => <span key={i} className="pp-chip" style={{ background: "var(--pp-surface-2)", color: "var(--pp-fg-2)" }}>{v}</span>)}
        </div>
      </div>
      <p style={{ margin: 0, paddingTop: 18, borderTop: "1px solid var(--pp-line)", fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 19, lineHeight: 1.35, letterSpacing: "-.01em", color: "#fafafa" }}>
        <span style={{ color: "var(--pp-acid)" }}>“</span>{quote}<span style={{ color: "var(--pp-acid)" }}>”</span>
      </p>
    </HCard>
  );
}

function Audience({ refCb }) {
  return (
    <Section id="audience" label="who you reach" refCb={refCb}
      intro="Our users are people without borders — they earn in one currency, live in another, and send money to a third. Four portraits you're creating for.">
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <PersonaCard tag="High spender" name="The Whale" who="35–50 · US / UAE / EU · crypto-HNWI or corporate earner"
          body="Spends from DoorDash to Hermès. Karta is the main card for everything."
          values={["High limits", "Security", "Self-custody"]}
          quote="I need a card that doesn't ask questions and doesn't set a ceiling." />
        <PersonaCard tag="Daily spender" name="The Nomad" who="25–38 · Bali / Bangkok / Belgrade / Dubai · freelancer or remote worker"
          body="Earns in crypto, spends in local currencies every day."
          values={["Low fees", "Apple Pay", "Multi-currency"]}
          quote="I get paid in USDT, spend in pesos and dirhams. Just tap and go." />
        <PersonaCard tag="Business user" name="The Builder" who="28–40 · solo founder / DevOps / marketer"
          body="Pays Google Ads, Facebook Ads, servers. The stickiest segment — Karta is the de-facto corporate card without an LLC."
          values={["Ad spend", "Servers", "No paperwork"]}
          quote="No LLC, no corporate account. Just a wallet and servers that need paying." />
        <PersonaCard tag="Lifeline user" name="The Survivalist" who="20–35 · KZ / AR / ID / MENA · restricted or unstable currency"
          body="Karta isn't convenience — it's a lifeline. The only way to pay for basic services."
          values={["Access", "Stability", "Essential"]}
          quote="We don't have working banks. The only way to pay is a crypto card." />
      </div>
    </Section>
  );
}

/* ---------- how it works ---------- */
function Step({ n, title, body, kicker }) {
  return (
    <div style={{ display: "flex", gap: 22, padding: "26px 0", borderTop: "1px solid var(--pp-line)", alignItems: "flex-start" }}>
      <span style={{ flex: "none", fontFamily: "var(--pp-font-display)", fontWeight: 800, fontStretch: "125%", fontVariationSettings: "'wght' 800, 'wdth' 125", fontSize: 22, color: "var(--pp-acid)", width: 54, lineHeight: 1.2 }}>0{n}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
          <h3 className="pp-h3" style={{ margin: 0, fontSize: 24 }}>{title}</h3>
          {kicker && <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 700, fontSize: 22, color: "var(--pp-acid)", letterSpacing: "-.02em" }}>{kicker}</span>}
        </div>
        <p className="pp-body" style={{ margin: 0, fontSize: 16, maxWidth: 760 }}>{body}</p>
      </div>
    </div>
  );
}

function HowItWorks({ refCb }) {
  return (
    <Section id="how" label="how it works" refCb={refCb}
      intro="Six steps from brief to recurring income. The first four are a normal gig. The last two are why you stay.">
      <div style={{ display: "flex", flexDirection: "column", borderBottom: "1px solid var(--pp-line)" }}>
        <Step n={1} title="Get the brief" body="We send the format, length, key messages and references. Formats: UGC video, motion graphics, static banners, animation." />
        <Step n={2} title="Make the creative" body="You build to the brief. The brand director reviews and gives feedback. Iterations are unlimited." />
        <Step n={3} title="Production comp" kicker="$20" body="A flat $20 once the final creative is delivered — for your time on the build itself." />
        <Step n={4} title="Launch in rotation" kicker="$50" body="We run the creative in live campaigns. If it passes review and goes live, you get a $50 bonus." />
        <Step n={5} title="Tracking" body="A unique tag is attached to your creative. Every user who comes through it is locked to you — permanently." />
        <Step n={6} title="0.15% of spend" kicker="monthly" body="Each month you earn 0.15% of everything your users spent on Karta cards. Paid automatically in Karat, Karta's internal currency." />
      </div>
    </Section>
  );
}

/* ---------- earnings ---------- */
function Tier({ name, users, breakdown, total, mult, highlight }) {
  return (
    <HCard style={{ flex: "1 1 280px", minHeight: 300, justifyContent: "space-between", gap: 18,
      borderColor: highlight ? "var(--pp-acid)" : "var(--pp-line)", background: highlight ? "#0f1100" : "var(--pp-card)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Label variant={highlight ? "light" : undefined}>{name}</Label>
          <span className="pp-body" style={{ fontSize: 14 }}>{users} users</span>
        </div>
        <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 800, fontStretch: "125%", fontVariationSettings: "'wght' 800, 'wdth' 125", fontSize: 56, lineHeight: 1, color: "var(--pp-acid)", letterSpacing: "-.02em", marginTop: 6 }}>{total}</span>
        <span className="pp-body" style={{ fontSize: 14, color: "var(--pp-fg-3)" }}>cumulative over 8 months</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p className="pp-body" style={{ margin: 0, fontSize: 15 }}>{breakdown}</p>
        {mult && <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 600, fontSize: 15, color: "#fafafa" }}>{mult}</span>}
      </div>
    </HCard>
  );
}

function ChartCard({ label, caption, message, children }) {
  return (
    <HCard style={{ padding: 28, gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
        <h3 className="pp-h3" style={{ margin: 0, fontSize: 24 }}>{label}</h3>
        <span className="pp-body" style={{ fontSize: 14, color: "var(--pp-fg-3)", maxWidth: 420, textAlign: "right" }}>{caption}</span>
      </div>
      {children}
      {message && <p style={{ margin: 0, paddingTop: 18, borderTop: "1px solid var(--pp-line)", fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 18, color: "#fafafa", letterSpacing: "-.01em" }}>{message}</p>}
    </HCard>
  );
}

function Earnings({ refCb }) {
  return (
    <Section id="earnings" label="what you earn" refCb={refCb}
      intro="Real numbers, from real cohort data. One creative keeps paying long after it's made.">
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Tier name="conservative" users="50" total="~$810" mult="1.6× the market rate"
          breakdown="$20 + $50 + ~$93 / mo recurring." />
        <Tier name="base" users="150" total="~$2,300" mult="4.5× market · break-even in month 1" highlight
          breakdown="$20 + $50 + ~$279 / mo recurring." />
        <Tier name="optimistic" users="300" total="~$4,500+" mult="and still climbing"
          breakdown="$20 + $50 + ~$557 / mo recurring." />
      </div>

      <ChartCard label="Cohort retention"
        caption="Active users as a % of month 0, by sign-up cohort."
        message="Almost half of users stay active past six months — so your income holds.">
        <RetentionChart />
      </ChartCard>

      <ChartCard label="Creator income simulation"
        caption="Cumulative payout at 0.15% of spend · real Oct '25 cohort."
        message="Every month adds to the one before. Even after a creative is retired, your users stay yours.">
        <IncomeChart />
      </ChartCard>
    </Section>
  );
}

/* ---------- performance bonus ---------- */
function Bonus({ refCb }) {
  return (
    <section ref={refCb} style={{ position: "relative", zIndex: 1, background: "var(--pp-page)", padding: "0 20px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 1040, paddingBottom: 80 }}>
        <HCard style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24, padding: 36, borderColor: "#2a2f00", background: "linear-gradient(100deg, #0f1100, var(--pp-card) 60%)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "1 1 420px" }}>
            <Label>performance bonus</Label>
            <h3 className="pp-h3" style={{ margin: 0, fontSize: 28, maxWidth: 640 }}>Hit the CPA target and scale the campaign past $5,000 / month — and a one-off bonus lands on top.</h3>
          </div>
          <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 800, fontStretch: "125%", fontVariationSettings: "'wght' 800, 'wdth' 125", fontSize: 88, lineHeight: 1, color: "var(--pp-acid)", letterSpacing: "-.03em" }}>$150</span>
        </HCard>
      </div>
    </section>
  );
}

/* ---------- ROI vs freelance ---------- */
function Roi({ refCb }) {
  return (
    <Section id="roi" label="why it beats freelance" refCb={refCb}
      intro="The market pays $300–800 for a video, once. Here you break even by month one — then it compounds.">
      <ChartCard label="Partner program vs. freelance"
        caption="Cumulative earnings by scenario vs. a one-off $500 freelance rate."
        message="Conservative overtakes a one-off fee by month 4. Base and optimistic do it in month 1.">
        <RoiChart />
      </ChartCard>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <HCard style={{ flex: "1 1 280px", gap: 8 }}>
          <span className="pp-stat" style={{ fontSize: 44 }}>Month 1</span>
          <p className="pp-body" style={{ margin: 0 }}>Break-even versus a freelance fee in the base and optimistic scenarios.</p>
        </HCard>
        <HCard style={{ flex: "1 1 280px", gap: 8 }}>
          <span className="pp-stat" style={{ fontSize: 44 }}>Forever</span>
          <p className="pp-body" style={{ margin: 0 }}>Even if a creative burns out and we stop it, your users stay yours. While they spend, you earn.</p>
        </HCard>
        <HCard style={{ flex: "1 1 280px", gap: 8 }}>
          <span className="pp-stat" style={{ fontSize: 44 }}>Stacks</span>
          <p className="pp-body" style={{ margin: 0 }}>The more live creatives you have, the higher your monthly income climbs.</p>
        </HCard>
      </div>
    </Section>
  );
}

/* ---------- attribution ---------- */
function AttrRow({ label, val }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "18px 0", borderBottom: "1px solid var(--pp-line)" }}>
      <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 18, color: "var(--pp-fg-3)", flex: "0 0 180px" }}>{label}</span>
      <span className="pp-body" style={{ margin: 0, fontSize: 18, color: "#fafafa", textAlign: "right", flex: 1 }}>{val}</span>
    </div>
  );
}

function Attribution({ refCb }) {
  return (
    <Section id="attribution" label="how attribution works" refCb={refCb}
      intro="Transparent and lifelong. You can see exactly what your creatives bring in.">
      <HCard style={{ padding: "8px 28px 24px" }}>
        <AttrRow label="Model" val="First-click — click the ad with your creative, the user is yours." />
        <AttrRow label="Conversion window" val="30 days from the click." />
        <AttrRow label="Analytics" val="Referral dashboard inside the Karta app — in real time." />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "18px 0 0" }}>
          <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 18, color: "var(--pp-fg-3)", flex: "0 0 180px" }}>Lock-in</span>
          <span className="pp-body" style={{ margin: 0, fontSize: 18, color: "var(--pp-acid)", textAlign: "right", flex: 1 }}>Lifetime. As long as the user spends, you earn.</span>
        </div>
      </HCard>
    </Section>
  );
}

/* ---------- tone of voice ---------- */
function ToVPrinciple({ a, b }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "20px 0", borderTop: "1px solid var(--pp-line)" }}>
      <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 600, fontSize: 20, color: "#fafafa", letterSpacing: "-.01em" }}>{a}</span>
      <span className="pp-body" style={{ fontSize: 16 }}>{b}</span>
    </div>
  );
}

function ToneOfVoice({ refCb }) {
  return (
    <Section id="tov" label="how karta speaks" refCb={refCb}
      intro="This matters for your creatives. Karta talks like a smart friend who's good with money — not like a bank, not like a crypto project.">
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", borderBottom: "1px solid var(--pp-line)" }}>
          <ToVPrinciple a="Simplicity, not simplification." b="Explain the complex clearly." />
          <ToVPrinciple a="Confidence, not aggression." b="We know our worth." />
          <ToVPrinciple a="Global, not abstract." b="Concrete countries and scenarios." />
          <ToVPrinciple a="Premium, not elitist." b="Accessible premium." />
        </div>
        <div style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", gap: 16 }}>
          <HCard style={{ borderColor: "#3a1a14", background: "#120a08", gap: 10 }}>
            <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 600, fontSize: 14, color: "#e0563f", textTransform: "uppercase", letterSpacing: ".06em" }}>Not this</span>
            <p className="pp-body" style={{ margin: 0, fontSize: 16, color: "var(--pp-fg-2)" }}>“Meet Karta — your all-in-one crypto solution for everyday use! Spending crypto is smoother than enjoying a stroll in the park…”</p>
          </HCard>
          <HCard style={{ borderColor: "var(--pp-acid)", background: "#0f1100", gap: 10 }}>
            <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 600, fontSize: 14, color: "var(--pp-acid)", textTransform: "uppercase", letterSpacing: ".06em" }}>Karta voice</span>
            <p className="pp-body" style={{ margin: 0, fontSize: 16, color: "#fafafa" }}>“Meet KARTA — your crypto made simple. Hold and spend crypto anywhere. Everything works instantly, safely, and without the nonsense.”</p>
          </HCard>
          <p className="pp-body" style={{ margin: 0, fontSize: 15, color: "var(--pp-fg-3)" }}>Visual — dark + premium fintech, not crypto-aesthetics. Accent: Acid Lime. Flagship hero object: the Metal LED card.</p>
        </div>
      </div>
    </Section>
  );
}

/* ---------- terms ---------- */
function TermRow({ label, val, acid }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--pp-line)" }}>
      <span className="pp-body" style={{ fontSize: 17, color: "#fafafa" }}>{label}</span>
      <span style={{ fontFamily: "var(--pp-font-display)", fontWeight: 500, fontSize: 17, color: acid ? "var(--pp-acid)" : "var(--pp-fg-2)", textAlign: "right" }}>{val}</span>
    </div>
  );
}

function Terms({ refCb }) {
  return (
    <Section id="terms" label="terms" refCb={refCb}
      intro="One scope of payouts, fully transparent — plus the fine print.">
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <HCard style={{ flex: "1.3 1 380px", justifyContent: "space-between", minHeight: 360 }}>
          <div>
            <div style={{ marginBottom: 12 }}><Label>payouts</Label></div>
            <TermRow label="Production comp" val="$20" />
            <TermRow label="Rotation bonus" val="$50" />
            <TermRow label="Performance bonus" val="$150" />
            <TermRow label="Monthly, indefinitely" val="0.15% of spend" acid />
          </div>
          <p className="pp-body" style={{ margin: "20px 0 0", fontSize: 15, color: "var(--pp-fg-3)" }}>The 0.15% is paid every month in Karat for as long as your attributed users keep spending.</p>
        </HCard>
        <HCard style={{ flex: "1 1 280px", justifyContent: "space-between", minHeight: 360, gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Label>rights</Label>
              <span className="pp-body" style={{ fontSize: 16, color: "#fafafa" }}>Transfer to Karta. Free to use in your portfolio.</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Label>exclusivity</Label>
              <span className="pp-body" style={{ fontSize: 16, color: "#fafafa" }}>None.</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Label>iterations</Label>
              <span className="pp-body" style={{ fontSize: 16, color: "#fafafa" }}>Unlimited. Approved by the brand director.</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Label>formats</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["9:16", "16:9", "1:1", "static"].map((f) => <span key={f} className="pp-chip" style={{ background: "var(--pp-surface-2)", color: "var(--pp-fg-2)" }}>{f}</span>)}
            </div>
          </div>
        </HCard>
      </div>
    </Section>
  );
}

/* ---------- footer / apply ---------- */
function Footer({ refCb, onCopy, copied, onCta }) {
  const isMobile = useIsMobile();
  return (
    <footer id="next-steps" ref={refCb} style={{ position: "relative", zIndex: 1, background: "radial-gradient(100% 140% at 50% 120%, rgba(212,254,0,.12), transparent 60%), #050505", padding: isMobile ? "64px 20px" : "96px 80px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 1040, display: "flex", flexDirection: "column", gap: isMobile ? 40 : 56 }}>
        <Label>apply</Label>
        <h2 className="pp-h1" style={{ margin: 0, fontSize: "clamp(38px,6vw,80px)", lineHeight: 1.02, letterSpacing: "-.03em", maxWidth: 900 }}>Make the creative once. Get paid for years.</h2>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p className="pp-body" style={{ margin: 0 }}>Send your portfolio to:</p>
            <button onClick={onCopy} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--pp-control)", border: "none", borderRadius: 4, padding: "12px 16px", cursor: "pointer", alignSelf: "flex-start" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#ccff00" strokeWidth="1.6"><rect x="3" y="5" width="12" height="9" rx="1.5"/><path d="M3.5 6l5.5 4 5.5-4"/></svg>
              <span className="pp-body" style={{ color: "#fafafa" }}>{copied ? "Email copied" : "creators@karta.io"}</span>
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p className="pp-body" style={{ margin: 0 }}>Follow Karta:</p>
            <div style={{ display: "flex", gap: 5 }}><Social k="in" /><Social k="ig" /><Social k="th" /><Social k="x" /></div>
          </div>
        </div>
        <img src="assets/karta-logo-white.svg" alt="Karta" style={{ height: 40, opacity: .9, marginTop: 16 }} />
      </div>
    </footer>
  );
}

Object.assign(window, { Section, HCard, SectionDivider, About, Problem, Audience, HowItWorks, Earnings, Bonus, Roi, Attribution, ToneOfVoice, Terms, Footer });
