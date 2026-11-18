/* Faz 10 — client-side form stepper demo; no network or persistent writes. */
(function () {
  "use strict";
  var form = document.querySelector("[data-bb-panel-form]");
  if (!form) return;
  var panes = Array.from(form.querySelectorAll("[data-bb-form-pane]"));
  var steps = Array.from(form.querySelectorAll("[data-bb-form-step]"));
  var previous = form.querySelector("[data-bb-form-prev]");
  var next = form.querySelector("[data-bb-form-next]");
  var submit = form.querySelector("[data-bb-form-submit]");
  var reset = form.querySelector("[data-bb-form-reset]");
  var review = form.querySelector("[data-bb-form-review]");
  var success = form.querySelector("[data-bb-form-success]");
  var fileInput = form.querySelector("[data-bb-form-file]");
  var upload = form.querySelector("[data-bb-form-upload]");
  var fileNames = form.querySelector("[data-bb-form-file-list]");
  var message = form.querySelector("[data-bb-form-message]");
  var current = 0;
  var attached = [];

  function announce(text) { if (message) message.textContent = text; }
  function renderFiles() {
    fileNames.replaceChildren();
    attached.forEach(function (file) {
      var li = document.createElement("li");
      li.textContent = file.name + " (" + Math.ceil(file.size / 1024) + " KB)";
      fileNames.appendChild(li);
    });
  }
  function accept(files) {
    var candidates = Array.from(files || []);
    var valid = candidates.filter(function (file) {
      return file.size <= 5 * 1024 * 1024 && ["image/png", "image/jpeg", "application/pdf"].includes(file.type);
    });
    attached = valid.slice(0, 4);
    renderFiles();
    announce(candidates.length !== valid.length || valid.length > 4 ? "Yalnız PDF, PNG, JPEG; dosya başına 5 MB, en çok 4 dosya kabul edilir." : attached.length + " dosya seçildi.");
  }
  fileInput.addEventListener("change", function () { accept(fileInput.files); });
  ["dragenter", "dragover"].forEach(function (eventName) {
    upload.addEventListener(eventName, function (event) {
      event.preventDefault();
      upload.setAttribute("data-dragover", "true");
    });
  });
  ["dragleave", "drop"].forEach(function (eventName) {
    upload.addEventListener(eventName, function (event) {
      event.preventDefault();
      upload.setAttribute("data-dragover", "false");
      if (eventName === "drop") accept(event.dataTransfer.files);
    });
  });
  function fillReview() {
    review.replaceChildren();
    var values = [
      ["Product adı", form.elements.namedItem("productName").value],
      ["Stock kodu", form.elements.namedItem("sku").value],
      ["Category", form.elements.namedItem("category").selectedOptions[0].textContent],
      ["Price", form.elements.namedItem("price").value + " TL"],
      ["Durum", form.elements.namedItem("status").value],
      ["Description", form.elements.namedItem("description").value || "—"],
      ["Görseller ve belgeler", attached.length ? attached.map(function (f) { return f.name; }).join(", ") : "Yok"]
    ];
    values.forEach(function (value) {
      var item = document.createElement("div");
      var dt = document.createElement("dt"); dt.textContent = value[0];
      var dd = document.createElement("dd"); dd.textContent = value[1];
      item.append(dt, dd); review.appendChild(item);
    });
  }
  function validate() {
    var inputs = panes[current].querySelectorAll("input[required], select[required], textarea[required]");
    for (var i = 0; i < inputs.length; i++) {
      if (!inputs[i].checkValidity()) {
        inputs[i].reportValidity();
        return false;
      }
    }
    return true;
  }
  function show(index) {
    current = Math.max(0, Math.min(index, panes.length - 1));
    panes.forEach(function (pane, n) { pane.hidden = n !== current; });
    steps.forEach(function (step, n) {
      if (n === current) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
      step.setAttribute("data-complete", String(n < current));
    });
    previous.hidden = current === 0;
    next.hidden = current === panes.length - 1;
    submit.hidden = current !== panes.length - 1;
    if (current === panes.length - 1) fillReview();
    announce("Adım " + (current + 1) + " / " + panes.length);
  }
  next.addEventListener("click", function () { if (validate()) show(current + 1); });
  previous.addEventListener("click", function () { show(current - 1); });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    success.hidden = false;
    success.querySelector("strong").textContent = "Demo form doğrulandı. Hiçbir veri sunucuya gönderilmedi.";
    success.focus();
    announce("Demo işlem tamamlandı.");
  });
  reset.addEventListener("click", function () {
    form.reset();
    attached = [];
    fileNames.replaceChildren();
    success.hidden = true;
    show(0);
  });
  show(0);
})();
