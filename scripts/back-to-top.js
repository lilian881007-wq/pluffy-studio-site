(function () {
  const visibleClass = "is-visible";
  const scrollThreshold = 420;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const button = document.createElement("button");
  button.className = "back-to-top";
  button.type = "button";
  button.setAttribute("aria-label", "Back to top");
  button.setAttribute("title", "Back to top");
  document.body.appendChild(button);

  const update = () => {
    button.classList.toggle(visibleClass, window.scrollY > scrollThreshold);
  };

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "auto" : "smooth"
    });
  });

  update();
  window.addEventListener("scroll", update, { passive: true });
})();