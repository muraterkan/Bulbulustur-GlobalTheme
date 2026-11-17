(function () {
  "use strict";

  var activeDrawer = null;
  var activeToggle = null;
  var backdrop = null;

  function bbCreateBackdrop() {
    if (backdrop) {
      return;
    }

    backdrop = document.createElement("div");
    backdrop.className = "bb-drawer-backdrop";
    backdrop.setAttribute("data-bb-drawer-backdrop", "true");

    backdrop.addEventListener("click", function () {
      bbCloseActiveDrawer();
    });

    document.body.appendChild(backdrop);
  }

  function bbLockBody() {
    document.body.classList.add("bb-drawer-lock");
  }

  function bbUnlockBody() {
    document.body.classList.remove("bb-drawer-lock");
  }

  function bbOpenDrawer(drawer, toggleBtn) {
    if (!drawer) {
      return;
    }

    if (activeDrawer && activeDrawer !== drawer) {
      bbCloseActiveDrawer();
    }

    activeDrawer = drawer;
    activeToggle = toggleBtn || null;

    bbCreateBackdrop();
    bbLockBody();

    // open states (SCSS expects .is-open)
    drawer.classList.add("is-open");
    if (backdrop) {
      backdrop.classList.add("is-open");
    }

    // aria
    drawer.setAttribute("aria-hidden", "false");
    if (activeToggle) {
      activeToggle.setAttribute("aria-expanded", "true");
    }

    // focus
    if (!drawer.hasAttribute("tabindex")) {
      drawer.setAttribute("tabindex", "-1");
    }
    drawer.focus();
  }

  function bbCloseActiveDrawer() {
    if (!activeDrawer) {
      return;
    }

    activeDrawer.classList.remove("is-open");
    activeDrawer.setAttribute("aria-hidden", "true");

    if (activeToggle) {
      activeToggle.setAttribute("aria-expanded", "false");
      activeToggle.focus();
    }

    bbUnlockBody();

    if (backdrop) {
      backdrop.classList.remove("is-open");
      backdrop.remove();
      backdrop = null;
    }

    activeDrawer = null;
    activeToggle = null;
  }

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest("[data-bb-drawer-toggle]");
    if (toggle) {
      var target = toggle.getAttribute("data-bb-drawer-toggle");
      var drawer = document.querySelector(target);

      if (drawer) {
        bbOpenDrawer(drawer, toggle);
      }
      return;
    }

    if (e.target.closest("[data-bb-drawer-close]")) {
      bbCloseActiveDrawer();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      bbCloseActiveDrawer();
    }
  });

  // optional public API
  window.BBDrawer = {
    open: function (selectorOrEl) {
      var el = typeof selectorOrEl === "string" ? document.querySelector(selectorOrEl) : selectorOrEl;
      bbOpenDrawer(el, null);
    },
    close: bbCloseActiveDrawer
  };
})();
