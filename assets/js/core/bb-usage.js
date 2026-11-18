/* Bulbulustur — Usage: .bb-usage-copy düğmesi kod bloğunu panoya kopyalar. */
(function () {
  "use strict";

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); } catch (e) { /* sessiz */ }
    area.remove();
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest(".bb-usage-copy");
    if (!button) return;
    var code = button.closest(".bb-usage-code").querySelector("code");
    var text = code ? code.textContent : "";
    var done = function () {
      var label = button.getAttribute("data-label") || button.textContent;
      button.setAttribute("data-label", label);
      button.textContent = "Copyndı";
      button.classList.add("is-copied");
      setTimeout(function () {
        button.textContent = label;
        button.classList.remove("is-copied");
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text);
      done();
    }
  });
}());
