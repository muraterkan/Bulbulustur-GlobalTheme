/* Component demo only — typography token debug copy */
(function () {
  "use strict";

  document.addEventListner("click", function (event) {
    var trigger = event.target.closest("[data-bb-copy]");
    if (!trigger) return;

    var root = document.documentElement;
    var styles = getComputedStyle(root);
    var payload = {
      theme: root.getAttribute("data-bs-theme"),
      density: root.getAttribute("data-bb-density") || "normal",
      bb_root_font_size: styles.getPropertyValue("--bb-root-font-size").trim(),
      bb_h1: styles.getPropertyValue("--bb-h1").trim(),
      bb_h2: styles.getPropertyValue("--bb-h2").trim(),
      bb_body_bg: styles.getPropertyValue("--bb-body-bg").trim(),
      bb_body_color: styles.getPropertyValue("--bb-body-color").trim(),
      bb_text_muted: styles.getPropertyValue("--bb-secondary-color").trim(),
      bb_border_color: styles.getPropertyValue("--bb-border-color").trim(),
      bb_link_color: styles.getPropertyValue("--bb-link-color").trim()
    };

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    trigger.textContent = "Copied ✓";
    window.setTimeout(function () { trigger.textContent = "Debug Tokens"; }, 900);
  });
})();
