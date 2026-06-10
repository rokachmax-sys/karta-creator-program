/* Karta Creator Program — app assembly. Scroll-spy nav + email copy. */
const { useState: uS, useEffect: uE, useRef: uR } = React;

function App() {
  const [active, setActive] = uS("start");
  const [copied, setCopied] = uS(false);

  const scrollToId = (id, off) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - off, behavior: "smooth" });
  };
  const nav = (id) => scrollToId(id, 80);
  const copy = () => {
    navigator.clipboard && navigator.clipboard.writeText("creators@karta.io").catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  uE(() => {
    const ids = ["start", "audience", "how", "earnings", "attribution", "tov", "terms", "next-steps"];
    const onScroll = () => {
      let cur = "start";
      ids.forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= 160) cur = id; });
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <React.Fragment>
      <Header active={active} onNav={nav} onCopy={copy} copied={copied} />
      <Hero onCta={() => nav("earnings")} />
      <div style={{ position: "relative", zIndex: 1, background: "var(--pp-page)" }}>
        <About />
        <Problem />
        <div style={{ position: "relative" }}>
          <SectionDivider id="audience-divider" num="01" title="Who You Reach" />
          <Audience />
        </div>
        <div style={{ position: "relative" }}>
          <SectionDivider id="how-divider" num="02" title="How It Works" />
          <HowItWorks />
        </div>
        <div style={{ position: "relative" }}>
          <SectionDivider id="earnings-divider" num="03" title="What You Earn" />
          <Earnings />
          <Bonus />
          <Roi />
          <Attribution />
        </div>
        <div style={{ position: "relative" }}>
          <SectionDivider id="craft-divider" num="04" title="The Craft" />
          <ToneOfVoice />
          <Terms />
        </div>
        <Footer onCopy={copy} copied={copied} />
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
