(() => {
  const allowedPortfolioHost = (hostname) =>
    hostname === "77777-seven-zeta.vercel.app" ||
    (hostname.startsWith("77777-") && hostname.endsWith(".vercel.app"));

  let animationFrame = 0;
  let previousTime = 0;
  let active = false;
  let speed = 1500;

  function getScrollRoot() {
    const root = document.scrollingElement || document.documentElement;
    if (root.scrollHeight > root.clientHeight + 4) return root;

    const candidates = Array.from(document.querySelectorAll(
      "main, [data-scroll-container], .smooth-scroll, #app, #root"
    ));
    return candidates
      .filter((element) => element.scrollHeight > element.clientHeight + 4)
      .sort((a, b) => b.scrollHeight - a.scrollHeight)[0] || root;
  }

  function tick(now) {
    if (!active) return;
    if (!previousTime) previousTime = now;

    const elapsed = Math.min((now - previousTime) / 1000, 0.05);
    previousTime = now;

    const root = getScrollRoot();
    const maxScroll = Math.max(0, root.scrollHeight - root.clientHeight);

    if (maxScroll > 0) {
      const next = root.scrollTop + speed * elapsed;
      if (next >= maxScroll - 2) {
        root.scrollTop = 0;
        previousTime = now;
      } else {
        root.scrollTop = next;
      }
    }

    animationFrame = window.requestAnimationFrame(tick);
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window.parent) return;

    let hostname = "";
    try {
      hostname = new URL(event.origin).hostname;
    } catch {
      return;
    }
    if (!allowedPortfolioHost(hostname)) return;

    const message = event.data;
    if (!message || message.type !== "portfolio-preview-scroll") return;

    if (message.action === "stop") {
      active = false;
      window.cancelAnimationFrame(animationFrame);
      return;
    }

    if (message.action === "start") {
      speed = Math.min(2600, Math.max(700, Number(message.speed) || 1500));
      active = true;
      previousTime = 0;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(tick);
    }
  });
})();
