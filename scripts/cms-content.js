(() => {
  const dataUrl = "data/site.json";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const youtubeEmbed = (url) => {
    const value = String(url || "");
    const short = value.match(/youtu\.be\/([^?&]+)/);
    const watch = value.match(/[?&]v=([^?&]+)/);
    const embed = value.match(/youtube\.com\/embed\/([^?&]+)/);
    const id = (short && short[1]) || (watch && watch[1]) || (embed && embed[1]);
    return id ? `https://www.youtube.com/embed/${id}` : "";
  };

  const vimeoEmbed = (url) => {
    const match = String(url || "").match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : "";
  };

  const playableUrl = (url) => youtubeEmbed(url) || vimeoEmbed(url);
  const isPlayableUrl = (url) => Boolean(playableUrl(url));

  const renderVideoFrame = (url, title) => {
    const src = playableUrl(url);
    if (!src) return "";
    return `<iframe src="${escapeHtml(src)}" title="${escapeHtml(title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  };

  const renderWorkMedia = (work) => {
    if (work.image) {
      const imageClass = work.imageClass ? ` ${escapeHtml(work.imageClass)}` : "";
      return `<div class="work-media cms-image-media${imageClass}"><img src="${escapeHtml(work.image)}" alt="${escapeHtml(work.title)}"></div>`;
    }

    if (work.mockupClass) {
      const className = escapeHtml(work.mockupClass);
      const extra = className.includes("color-study")
        ? "<span></span><span></span><span></span>"
        : className.includes("package-study")
          ? "<div></div><div></div>"
          : className.includes("signage-study")
            ? "<span></span><b></b><i></i>"
            : className.includes("illustration-study")
              ? "<b></b><i></i>"
              : className.includes("product-study")
                ? "<span></span><b></b><i></i>"
                : className.includes("video-study")
                  ? "<span></span><b></b>"
                  : className.includes("interactive-study")
                    ? "<span></span><b></b><i></i>"
                    : "";
      return `<div class="work-media ${className}">${extra}</div>`;
    }

    return '<div class="work-media illustration-study"><b></b><i></i></div>';
  };

  const renderWorks = (works) => {
    const root = document.querySelector("[data-cms-works]");
    if (!root || !Array.isArray(works) || works.length === 0) return;
    root.innerHTML = works
      .map((work) => {
        const href = work.url || "#";
        const featured = work.featured ? " featured" : "";
        return `
          <a class="work-card${featured}" href="${escapeHtml(href)}">
            ${renderWorkMedia(work)}
            <div class="work-info">
              <span>${escapeHtml(work.category)}</span>
              <h3>${escapeHtml(work.title)}</h3>
              <p>${escapeHtml(work.summary)}</p>
              <em>查看作品 <span aria-hidden="true">→</span></em>
            </div>
          </a>
        `;
      })
      .join("");
  };

  const renderSettings = (settings) => {
    if (!settings) return;
    const line = document.querySelector("[data-cms-line]");
    if (line) line.href = settings.lineUrl || "#";

    const lineId = document.querySelector(".contact-line-id");
    if (lineId && settings.lineLabel) lineId.textContent = settings.lineLabel;

    const instagram = document.querySelector("[data-cms-instagram]");
    if (instagram) instagram.href = settings.instagramUrl || "#";

    const threads = document.querySelector("[data-cms-threads]");
    if (threads) threads.href = settings.threadsUrl || "#";

    const email = document.querySelector("[data-cms-email]");
    if (email && settings.email) email.href = `mailto:${settings.email}`;
  };

  const renderGames = (games, team) => {
    const root = document.querySelector("[data-cms-games]");
    if (!root || !Array.isArray(games) || games.length === 0) return;
    root.innerHTML = games
      .map((game, index) => {
        const reverse = index % 2 === 1 ? " reverse" : "";
        const bannerStyle = game.bannerImage
          ? ` style="background-image: linear-gradient(rgba(0,0,0,.18), rgba(0,0,0,.16)), url('${escapeHtml(game.bannerImage)}')"`
          : "";
        return `
          <article class="game-entry">
            <div class="game-banner game-banner-${index + 1}"${bannerStyle}>
              <div>
                <p class="eyebrow">${escapeHtml(game.label || `Game ${index + 1}`)}</p>
                <h2>${escapeHtml(game.title)}</h2>
              </div>
            </div>
            <div class="game-detail section-wrap${reverse}">
              <div class="game-video" aria-label="${escapeHtml(game.title)} 影片預覽">
                ${renderVideoFrame(game.videoUrl, game.title)}
              </div>
              <div class="game-description">
                <span class="tag">${escapeHtml(game.category)}</span>
                <h3>${escapeHtml(game.title)}介紹</h3>
                <p>${escapeHtml(game.description)}</p>
                <dl>
                  <div><dt>類型</dt><dd>${escapeHtml(game.type)}</dd></div>
                  <div><dt>負責</dt><dd>${escapeHtml(game.role)}</dd></div>
                  <div><dt>狀態</dt><dd>${escapeHtml(game.status)}</dd></div>
                </dl>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    const teamLogo = document.querySelector("[data-cms-team-logo]");
    if (teamLogo && team && team.logo) teamLogo.src = team.logo;
    const teamTitle = document.querySelector("[data-cms-team-title]");
    if (teamTitle && team && team.title) teamTitle.textContent = team.title;
    const teamDescription = document.querySelector("[data-cms-team-description]");
    if (teamDescription && team && team.description) teamDescription.textContent = team.description;
  };

  const renderVideos = (videos) => {
    const root = document.querySelector("[data-cms-videos]");
    if (!root || !Array.isArray(videos) || videos.length === 0) return;
    root.innerHTML = videos
      .map((video, index) => {
        const image = video.coverImage
          ? ` style="background-image: linear-gradient(rgba(255,255,255,.18), rgba(255,255,255,.18)), url('${escapeHtml(video.coverImage)}')"`
          : "";
        const link = video.videoUrl && !isPlayableUrl(video.videoUrl)
          ? `<a class="button secondary mini-cta" href="${escapeHtml(video.videoUrl)}">查看影片</a>`
          : "";
        return `
          <article class="video-card">
            <div class="video-thumb ${index === 1 ? "alt" : index === 2 ? "soft" : ""}"${image}>${renderVideoFrame(video.videoUrl, video.title)}<span></span></div>
            <div>
              <span class="tag">${escapeHtml(video.category)}</span>
              <h3>${escapeHtml(video.title)}</h3>
              <p>${escapeHtml(video.summary)}</p>
              ${link}
            </div>
          </article>
        `;
      })
      .join("");
  };

  fetch(dataUrl)
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (!data) return;
      renderSettings(data.settings);
      renderWorks(data.works);
      renderGames(data.games, data.team);
      renderVideos(data.videos);
    })
    .catch(() => {});
})();
