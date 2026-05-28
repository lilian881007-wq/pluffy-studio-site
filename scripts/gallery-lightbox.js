(function () {
  const triggers = document.querySelectorAll("[data-lightbox-src]");
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    if (trigger.dataset.lightboxLayout !== "social-post") return;
    const preview = trigger.querySelector(".work-set-grid");
    if (!preview) return;
    const previewItems = (trigger.dataset.lightboxItems || trigger.dataset.lightboxSrc)
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    const more = preview.querySelector("span");
    preview.querySelectorAll("img").forEach((img) => img.remove());
    previewItems.slice(0, 5).forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      preview.insertBefore(img, more);
    });
    preview.classList.add(`social-preview-count-${Math.min(previewItems.length, 5)}`);
  });

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <article class="lightbox-panel social-lightbox-post" role="dialog" aria-modal="true" aria-label="Work preview">
      <button class="lightbox-close" type="button" aria-label="Close preview">x</button>
      <header class="social-lightbox-head">
        <img src="assets/pluffy-logo-icon.png" alt="">
        <div>
          <strong>Pluffy Studio</strong>
          <span class="post-subtitle">Social post preview</span>
          <small>Portfolio preview</small>
        </div>
        <em>...</em>
      </header>
      <p class="social-lightbox-copy">Social visual series preview.</p>
      <div class="lightbox-media">
        <button class="lightbox-nav prev" type="button" aria-label="Previous item"><</button>
        <div class="lightbox-collage" aria-label="Work images"></div>
        <button class="lightbox-nav next" type="button" aria-label="Next item">></button>
      </div>
      <div class="social-lightbox-stats"><small class="lightbox-count"></small></div>
      <footer class="social-lightbox-foot">
        <button type="button">Like</button>
        <button type="button">Comment</button>
        <button type="button">Share</button>
      </footer>
    </article>
  `;
  document.body.appendChild(overlay);

  const accountName = overlay.querySelector(".social-lightbox-head strong");
  const meta = overlay.querySelector(".social-lightbox-head small");
  const collage = overlay.querySelector(".lightbox-collage");
  const closeButton = overlay.querySelector(".lightbox-close");
  const prevButton = overlay.querySelector(".lightbox-nav.prev");
  const nextButton = overlay.querySelector(".lightbox-nav.next");
  const count = overlay.querySelector(".lightbox-count");
  const title = overlay.querySelector(".post-subtitle");
  const copy = overlay.querySelector(".social-lightbox-copy");

  let items = [];
  let isPortfolio = false;
  let layout = "";
  let imageCount = 0;
  let mockupCount = 0;
  let socialCompositeSrc = "";

  const mockupLabels = {
    print: "Print mockup",
    label: "Label mockup",
    card: "Card mockup",
    signage: "Signage mockup",
    banner: "Banner mockup",
    lightbox: "Lightbox mockup",
    standee: "Standee mockup",
    character: "Character design",
    avatar: "Avatar design",
    mascot: "Mascot concept",
    sticker: "Sticker mockup"
  };

  const mockupMarkup = {
    print: '<div class="package-preview-mock print" aria-hidden="true"></div>',
    label: '<div class="package-preview-mock label" aria-hidden="true"></div>',
    card: '<div class="package-preview-mock card" aria-hidden="true"></div>',
    signage: '<div class="signage-mockup" aria-hidden="true"><span></span><b></b><i></i></div>',
    banner: '<div class="banner-mockup" aria-hidden="true"></div>',
    lightbox: '<div class="lightbox-mockup" aria-hidden="true"></div>',
    standee: '<div class="standee-mockup" aria-hidden="true"></div>',
    character: '<div class="character-mockup" aria-hidden="true"><span></span><span></span><b></b></div>',
    avatar: '<div class="avatar-mockup" aria-hidden="true"></div>',
    mascot: '<div class="mascot-mockup" aria-hidden="true"></div>',
    sticker: '<div class="sticker-mockup" aria-hidden="true"></div>'
  };

  const renderThumbs = () => items
    .map((item, index) => item.type === "image"
      ? `<button class="${index === 0 ? "is-active" : ""}" type="button" data-lightbox-index="${index}" aria-label="View item ${index + 1}"><img src="${item.src}" alt=""></button>`
      : "")
    .join("");

  const bindThumbs = () => {
    collage.querySelectorAll("[data-lightbox-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.lightboxIndex || 0);
        if (!index) return;
        items = [...items.slice(index), ...items.slice(0, index)];
        render();
      });
    });
  };

  const renderSingle = (variant = "") => {
    const activeItem = items[0];
    collage.className = `lightbox-collage portfolio-gallery layout-single${variant ? ` ${variant}` : ""}`;
    collage.innerHTML = `
      <div class="single-lightbox-stage">
        ${activeItem && activeItem.type === "image" ? `<img src="${activeItem.src}" alt="Work preview">` : ""}
      </div>
      <div class="single-lightbox-thumbs" aria-label="Work thumbnails">
        ${items.length > 1 ? renderThumbs() : ""}
      </div>
    `;
    bindThumbs();
  };

  const renderSocialPost = () => {
    if (socialCompositeSrc) {
      const countClass = `layout-social-count-${Math.min(items.length, 5)}`;
      collage.className = `lightbox-collage portfolio-gallery layout-social-post layout-social-composite ${countClass}`;
      collage.innerHTML = `<img class="social-post-composite" src="${socialCompositeSrc}" alt="Social post series preview">`;
      return false;
    }

    const visibleItems = items.slice(0, 5);
    const countClass = `layout-social-count-${Math.min(items.length, 5)}`;
    collage.className = `lightbox-collage portfolio-gallery layout-social-post ${countClass}`;
    collage.innerHTML = `
      <div class="social-post-collage" aria-label="Social post series">
        ${visibleItems
          .map((item, index) => {
            const more = index === 4 && items.length > 5 ? `<span class="collage-more">+${items.length - 5}</span>` : "";
            return item.type === "image"
              ? `<span class="social-post-tile${index === 0 ? " is-featured" : ""}"><img src="${item.src}" alt="Social post ${index + 1}">${more}</span>`
              : "";
          })
          .join("")}
      </div>
    `;
    bindThumbs();
    return false;
  };

  function render() {
    if (layout === "layout-social-post") {
      const hasMultiple = renderSocialPost();
      prevButton.hidden = !hasMultiple;
      nextButton.hidden = !hasMultiple;
      count.hidden = false;
      count.innerHTML = '<span class="reaction-bubbles"><i>♡</i><i>↗</i></span><b>Pluffy Studio 和其他人都說讚</b><em>留言 · 分享</em>';
      return;
    }

    if (layout === "layout-single" || layout === "layout-wide") {
      renderSingle(layout === "layout-wide" ? "layout-wide" : "");
      const hasMultiple = items.length > 1;
      prevButton.hidden = !hasMultiple;
      nextButton.hidden = !hasMultiple;
      count.hidden = !items.length;
      count.textContent = `${imageCount} works`;
      return;
    }

    const visibleItems = isPortfolio ? items : items.slice(0, 5);
    collage.className = isPortfolio
      ? `lightbox-collage portfolio-gallery${layout ? ` ${layout}` : ""}`
      : `lightbox-collage collage-${Math.min(visibleItems.length, 5)}`;
    collage.innerHTML = visibleItems
      .map((item, index) => {
        const more = !isPortfolio && index === 4 && items.length > 5 ? `<span class="collage-more">+${items.length - 5}</span>` : "";
        const label = isPortfolio ? "Work preview" : "Social post";
        if (item.type === "mockup") {
          return `<div class="lightbox-mockup-tile">${mockupMarkup[item.kind] || mockupMarkup.print}<span>${item.label}</span></div>`;
        }
        return `<div><img src="${item.src}" alt="${label} ${index + 1}">${more}</div>`;
      })
      .join("");

    const hasMultiple = !isPortfolio && items.length > 1;
    prevButton.hidden = !hasMultiple;
    nextButton.hidden = !hasMultiple;
    count.hidden = !items.length;
    count.textContent = isPortfolio && mockupCount
      ? `${imageCount} works + ${mockupCount} mockups`
      : (isPortfolio ? `${imageCount} works` : `${imageCount} posts`);
  }

  const close = () => {
    overlay.classList.remove("is-open");
    document.body.classList.remove("lightbox-lock");
  };

  const move = (step) => {
    if (items.length <= 1) return;
    const offset = step > 0 ? 1 : items.length - 1;
    items = [...items.slice(offset), ...items.slice(0, offset)];
    render();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const imageItems = (trigger.dataset.lightboxItems || trigger.dataset.lightboxSrc)
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((src) => ({ type: "image", src }));
      const mockupItems = (trigger.dataset.lightboxMockups || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((kind) => ({ type: "mockup", kind, label: mockupLabels[kind] || "Mockup" }));

      items = [...imageItems, ...mockupItems];
      imageCount = imageItems.length;
      mockupCount = mockupItems.length;
      socialCompositeSrc = trigger.dataset.lightboxComposite || "";

      isPortfolio = trigger.classList.contains("work-set-preview") || trigger.classList.contains("image-preview-button") || trigger.dataset.lightboxMode === "portfolio";
      layout = trigger.dataset.lightboxLayout
        ? `layout-${trigger.dataset.lightboxLayout}`
        : (isPortfolio ? "layout-single" : "");
      if (layout === "layout-event") layout = "layout-single";
      overlay.classList.toggle("is-portfolio", isPortfolio);
      overlay.classList.toggle("is-social-post", layout === "layout-social-post");

      accountName.textContent = isPortfolio ? (trigger.dataset.postTitle || "Work preview") : "Pluffy Studio";
      title.hidden = isPortfolio && layout !== "layout-social-post";
      title.textContent = layout === "layout-social-post" ? "Pluffy Studio / Social Post" : (trigger.dataset.postTitle || "Social visual");
      meta.textContent = isPortfolio && mockupCount
        ? `${imageCount} works + ${mockupCount} mockups`
        : (isPortfolio ? `${imageCount} works` : "Portfolio preview");
      copy.textContent = trigger.dataset.postCopy || (isPortfolio
        ? "Work images and mockups collected for portfolio preview."
        : "Social visual series preview.");

      render();
      overlay.classList.add("is-open");
      document.body.classList.add("lightbox-lock");
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", close);
  prevButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
})();
