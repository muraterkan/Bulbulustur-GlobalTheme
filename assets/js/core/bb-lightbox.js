(() => {
  const triggers = document.querySelectorAll(".bb-lightbox-trigger");
  if (!triggers.length) {
    return;
  }

  let currentIndex = 0;
  let groupItems = [];
  let lastActiveEl = null;

  const lightbox = document.createElement("div");
  lightbox.className = "bb-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-hidden", "true");

  lightbox.innerHTML = `
    <div class="bb-lightbox-backdrop" data-bb-lightbox-close="true"></div>

    <div class="bb-lightbox-stage">
      <img class="bb-lightbox-media" alt="" />
    </div>

    <button type="button" class="bb-lightbox-close" aria-label="Close">
      <span class="material-symbols-outlined">close</span>
    </button>

    <button type="button" class="bb-lightbox-nav is-prev" aria-label="Previous">
      <span class="material-symbols-outlined">chevron_left</span>
    </button>

    <button type="button" class="bb-lightbox-nav is-next" aria-label="Next">
      <span class="material-symbols-outlined">chevron_right</span>
    </button>
  `;

  document.body.appendChild(lightbox);

  const media = lightbox.querySelector(".bb-lightbox-media");
  const stage = lightbox.querySelector(".bb-lightbox-stage");
  const btnClose = lightbox.querySelector(".bb-lightbox-close");
  const btnPrev = lightbox.querySelector(".bb-lightbox-nav.is-prev");
  const btnNext = lightbox.querySelector(".bb-lightbox-nav.is-next");
  const backdrop = lightbox.querySelector('[data-bb-lightbox-close="true"]');

  if (!media || !stage || !btnClose || !btnPrev || !btnNext || !backdrop) {
    return;
  }

  function lockScroll() {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.classList.add("bb-scroll-locked");

    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
  }

  function unlockScroll() {
    document.body.classList.remove("bb-scroll-locked");
    document.body.style.paddingRight = "";
  }

  function resolveSrc(el) {
    if (!el) {
      return null;
    }

    const ds = el.dataset ? el.dataset.bbLightboxSrc : null;
    if (ds) {
      return ds;
    }

    const href = el.getAttribute ? el.getAttribute("href") : null;
    if (href) {
      return href;
    }

    if (el.tagName === "IMG" && el.src) {
      return el.src;
    }

    return null;
  }

  function setMedia(index) {
    if (!groupItems.length) {
      return;
    }

    currentIndex = index;

    const el = groupItems[currentIndex];
    const src = resolveSrc(el);

    if (!src) {
      return;
    }

    media.src = src;

    const alt = el.getAttribute ? el.getAttribute("alt") : "";
    media.alt = alt || "";
  }

  function updateNavAvailability() {
    const disabled = groupItems.length <= 1;

    btnPrev.disabled = disabled;
    btnNext.disabled = disabled;

    btnPrev.setAttribute("aria-disabled", disabled ? "true" : "false");
    btnNext.setAttribute("aria-disabled", disabled ? "true" : "false");
  }

  function open(index) {
    lastActiveEl = document.activeElement;

    setMedia(index);
    updateNavAvailability();

    lightbox.classList.add("is-open");
    lightbox.classList.remove("is-zoomed");

    lightbox.setAttribute("aria-hidden", "false");
    lightbox.setAttribute("aria-busy", "true");

    lockScroll();

    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.classList.remove("is-zoomed");

    lightbox.setAttribute("aria-hidden", "true");
    lightbox.removeAttribute("aria-busy");

    unlockScroll();

    if (lastActiveEl && lastActiveEl.focus) {
      lastActiveEl.focus();
    }
  }

  function prev() {
    if (groupItems.length <= 1) {
      return;
    }

    const nextIndex = (currentIndex - 1 + groupItems.length) % groupItems.length;
    setMedia(nextIndex);
  }

  function next() {
    if (groupItems.length <= 1) {
      return;
    }

    const nextIndex = (currentIndex + 1) % groupItems.length;
    setMedia(nextIndex);
  }

  function toggleZoom() {
    lightbox.classList.toggle("is-zoomed");
  }

  triggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      const group = el.dataset.bbLightboxGroup || "__default__";
      groupItems = Array.from(
        document.querySelectorAll(`.bb-lightbox-trigger[data-bb-lightbox-group="${group}"]`)
      );

      if (!groupItems.length) {
        groupItems = [el];
      }

      const index = groupItems.indexOf(el);
      open(index >= 0 ? index : 0);
    });
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);

  backdrop.addEventListener("click", close);

  stage.addEventListener("dblclick", (e) => {
    e.preventDefault();
    toggleZoom();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }

    if (e.key === "Escape") {
      close();
      return;
    }

    if (e.key === "ArrowLeft") {
      prev();
      return;
    }

    if (e.key === "ArrowRight") {
      next();
      return;
    }

    if (e.key === "z" || e.key === "Z") {
      toggleZoom();
    }
  });
})();
