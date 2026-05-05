(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const revealSelectors = [
    ".section-band",
    ".section-wrap",
    ".project-hero",
    ".project-gallery",
    ".project-switcher",
    ".contact-section",
    ".work-card",
    ".price-card",
    ".service-card",
    ".service-group",
    ".gallery-item",
    ".project-switcher-card",
    ".game-entry",
    ".video-card",
    ".game-team",
    ".site-footer"
  ];

  document.documentElement.classList.add("motion-ready");

  const observed = new WeakSet();
  let itemCount = 0;

  const register = (item) => {
    if (!item || observed.has(item)) return;
    observed.add(item);
    item.classList.add("motion-reveal");
    item.style.setProperty("--motion-delay", `${Math.min(itemCount % 6, 5) * 55}ms`);
    itemCount += 1;
    observer.observe(item);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  document.querySelectorAll(revealSelectors.join(",")).forEach(register);

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches(revealSelectors.join(","))) register(node);
        node.querySelectorAll(revealSelectors.join(",")).forEach(register);
      });
    });
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
})();
