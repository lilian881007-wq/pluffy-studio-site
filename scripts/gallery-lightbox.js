(function () {
  const triggers = document.querySelectorAll("[data-lightbox-src]");
  if (!triggers.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <article class="lightbox-panel social-lightbox-post" role="dialog" aria-modal="true" aria-label="作品預覽">
      <button class="lightbox-close" type="button" aria-label="關閉預覽">×</button>
      <header class="social-lightbox-head">
        <img src="assets/pluffy-logo-icon.png" alt="">
        <div>
          <strong>Pluffy Studio</strong>
          <span class="post-subtitle">貼文系列 · 品牌日常視覺</span>
          <small>剛剛 · 公開</small>
        </div>
        <em>•••</em>
      </header>
      <p class="social-lightbox-copy">品牌日常貼文系列整理，讓多張視覺維持同一套語氣。</p>
      <div class="lightbox-media">
        <button class="lightbox-nav prev" type="button" aria-label="上一組">‹</button>
        <div class="lightbox-collage" aria-label="作品圖片組"></div>
        <button class="lightbox-nav next" type="button" aria-label="下一組">›</button>
      </div>
      <div class="social-lightbox-stats">
        <span class="reaction-stack"><i>♡</i><i>◎</i><i>↗</i></span>
        <span>128</span>
        <small class="lightbox-count"></small>
      </div>
      <footer class="social-lightbox-foot">
        <button type="button">♡ 讚</button>
        <button type="button">收藏</button>
        <button type="button">分享</button>
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
  let imageCount = 0;
  let mockupCount = 0;

  const mockupLabels = {
    print: "印刷模擬圖",
    label: "標籤模擬圖",
    card: "卡片模擬圖",
    signage: "招牌模擬圖",
    banner: "布旗模擬圖",
    lightbox: "燈箱模擬圖",
    standee: "立牌模擬圖",
    character: "角色模擬圖",
    avatar: "頭像模擬圖",
    mascot: "主視覺模擬圖",
    sticker: "貼圖模擬圖"
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

  const render = () => {
    const visibleItems = isPortfolio ? items : items.slice(0, 5);
    collage.className = isPortfolio
      ? "lightbox-collage portfolio-gallery"
      : `lightbox-collage collage-${Math.min(visibleItems.length, 5)}`;
    collage.innerHTML = visibleItems
      .map((item, index) => {
        const more = !isPortfolio && index === 4 && items.length > 5 ? `<span class="collage-more">+${items.length - 5}</span>` : "";
        const label = isPortfolio ? "作品預覽" : "貼文預覽";
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
      ? `${imageCount} 張作品 + ${mockupCount} 張模擬圖`
      : (isPortfolio ? `${imageCount} 張作品` : `${imageCount} 張`);
  };

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
        .map((kind) => ({ type: "mockup", kind, label: mockupLabels[kind] || "模擬圖" }));
      items = [...imageItems, ...mockupItems];
      imageCount = imageItems.length;
      mockupCount = mockupItems.length;

      isPortfolio = trigger.classList.contains("work-set-preview") || trigger.dataset.lightboxMode === "portfolio";
      overlay.classList.toggle("is-portfolio", isPortfolio);

      accountName.textContent = isPortfolio ? (trigger.dataset.postTitle || "作品預覽") : "Pluffy Studio";
      title.hidden = isPortfolio;
      title.textContent = isPortfolio ? "" : (trigger.dataset.postTitle || "貼文系列 · 品牌日常視覺");
      meta.textContent = isPortfolio && mockupCount
        ? `${imageCount} 張作品 + ${mockupCount} 張模擬圖`
        : (isPortfolio ? `${imageCount} 張作品` : "剛剛 · 公開");
      copy.textContent = trigger.dataset.postCopy || (isPortfolio
        ? "同一品項可放置多張作品圖與應用 mockup，方便一起檢視整體風格。"
        : "品牌日常貼文系列整理，讓多張視覺維持同一套語氣。");

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
