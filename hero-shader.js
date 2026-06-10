/* ============================================================
   Karta — Hero background (blurred gradient mesh)
   Recreates the source hero: large, heavily-blurred acid-green
   gradient masses on near-black, drifting slowly. No grain, no
   noise — just soft light. DOM + CSS (cheap, GPU-composited).

   Usage:
     <div id="hero-bg"></div>            // any block element
     <script src="hero-shader.js"></script>
     <script>KartaHeroShader.mount(document.getElementById('hero-bg'));</script>

   Options: { acid:'#ccff00', blur:90, speed:1, intensity:1 }
   Returns { destroy() }. Honors prefers-reduced-motion (static).
   ============================================================ */
(function (global) {
  let injected = false;
  function injectCSS() {
    if (injected) return; injected = true;
    const s = document.createElement("style");
    s.textContent = `
    .khb-root{position:absolute;inset:0;overflow:hidden;background:#040404;pointer-events:none}
    .khb-stage{position:absolute;inset:-30%;filter:blur(var(--khb-blur,130px)) saturate(1.04);will-change:transform}
    .khb-blob{position:absolute;border-radius:50%;mix-blend-mode:screen;opacity:var(--o,.9);will-change:transform}
    @keyframes khb1{0%{transform:translate(0,0) scale(1)}50%{transform:translate(-16%,-12%) scale(1.32)}100%{transform:translate(0,0) scale(1)}}
    @keyframes khb2{0%{transform:translate(0,0) scale(1.15)}50%{transform:translate(18%,12%) scale(.82)}100%{transform:translate(0,0) scale(1.15)}}
    @keyframes khb3{0%{transform:translate(0,0) scale(1)}50%{transform:translate(14%,-14%) scale(1.34)}100%{transform:translate(0,0) scale(1)}}
    @keyframes khb4{0%{transform:translate(0,0) scale(.9)}50%{transform:translate(-18%,14%) scale(1.28)}100%{transform:translate(0,0) scale(.9)}}
    @media (prefers-reduced-motion: reduce){ .khb-blob{animation:none !important} }
    .khb-shade{position:absolute;inset:0;pointer-events:none;
      background:linear-gradient(180deg, #040404 0%, rgba(4,4,4,.72) 26%, rgba(4,4,4,.18) 50%, transparent 72%),
                radial-gradient(120% 90% at 50% 108%, transparent 40%, rgba(4,4,4,.55) 100%)}
    .khb-dither{position:absolute;inset:0;opacity:.055;mix-blend-mode:soft-light;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");background-size:160px 160px}
    `;
    document.head.appendChild(s);
  }

  function rgba(hex, a) {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function mount(el, opts) {
    opts = opts || {};
    const acid = opts.acid || "#ccff00";
    const blur = opts.blur || 115;
    const speed = opts.speed || 1;
    const k = opts.intensity == null ? 1 : opts.intensity;
    injectCSS();

    el.innerHTML = "";
    const root = document.createElement("div"); root.className = "khb-root";
    const stage = document.createElement("div"); stage.className = "khb-stage";
    stage.style.setProperty("--khb-blur", blur + "px");

    // blobs: bright acid light blooming from the BOTTOM (like the source) —
    // saturated core that fades up to near-black, plus a brighter hot core.
    const blobs = [
      { x: "50%", y: "87%",  s: 820, c: rgba(acid, 1.0 * k),  anim: "khb1", dur: 15, o: 1 },
      { x: "86%", y: "71%",  s: 600, c: rgba(acid, 0.92 * k), anim: "khb2", dur: 18, o: 1 },
      { x: "16%", y: "83%",  s: 540, c: rgba(acid, 0.68 * k), anim: "khb3", dur: 16, o: 0.95 },
      { x: "66%", y: "45%",  s: 440, c: rgba(acid, 0.34 * k), anim: "khb4", dur: 21, o: 0.8 },
      { x: "52%", y: "93%",  s: 420, c: "rgba(230,255,130," + (1.0 * k) + ")", anim: "khb1", dur: 13, o: 1 },
    ];
    for (const b of blobs) {
      const d = document.createElement("div");
      d.className = "khb-blob";
      d.style.left = b.x; d.style.top = b.y;
      d.style.width = b.s + "px"; d.style.height = b.s + "px";
      d.style.marginLeft = (-b.s / 2) + "px"; d.style.marginTop = (-b.s / 2) + "px";
      const mid = b.c.replace(/,([0-9.]+)\)$/, (m, a) => `,${(parseFloat(a) * 0.55).toFixed(3)})`);
      d.style.background = `radial-gradient(circle at center, ${b.c} 0%, ${b.c} 16%, ${mid} 36%, transparent 64%)`;
      d.style.setProperty("--o", b.o);
      d.style.animation = `${b.anim} ${(b.dur / speed)}s ease-in-out infinite`;
      stage.appendChild(d);
    }
    const grain = document.createElement("div"); grain.className = "khb-grain";

    root.appendChild(stage);
    const shade = document.createElement("div"); shade.className = "khb-shade";
    root.appendChild(shade);
    const dither = document.createElement("div"); dither.className = "khb-dither";
    root.appendChild(dither);
    el.appendChild(root);

    // pause animations when offscreen / hidden
    let io = null;
    const setPlay = (p) => stage.querySelectorAll(".khb-blob").forEach((n) => n.style.animationPlayState = p ? "running" : "paused");
    if ("IntersectionObserver" in global) {
      io = new IntersectionObserver((e) => setPlay(e[0].isIntersecting), { threshold: 0 });
      io.observe(root);
    }
    const onVis = () => setPlay(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVis);

    return {
      destroy() {
        io && io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        el.innerHTML = "";
      }
    };
  }

  global.KartaHeroShader = { mount };
})(window);
