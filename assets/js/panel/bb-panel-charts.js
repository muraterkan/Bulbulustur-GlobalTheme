/* Grafik widgetsı — Chart.js 4.x, renkler yalnız GlobalTheme DataViz tokenlarından gelir. */
(function () {
  "use strict";

  var root = document.querySelector("[data-bb-chart-page]");
  if (!root) return;

  var status = root.querySelector("[data-bb-chart-status]");
  var chartInstances = new Map();
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function say(message) {
    if (status) status.textContent = message;
  }

  if (typeof window.Chart === "undefined") {
    say("Chart.js yüklenemedi. Grafikler oluşturulamadı.");
    return;
  }

  function cssToken(name, fallback) {
    var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function tokenPx(name, fallback) {
    var raw = cssToken(name, "");
    if (!raw) return fallback;
    if (raw.endsWith("rem")) {
      return parseFloat(raw) * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
    if (raw.endsWith("px")) return parseFloat(raw);
    var n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  }

  function rgba(hex, alpha) {
    var value = String(hex || "").trim();
    var short = /^#([a-f\d])([a-f\d])([a-f\d])$/i.exec(value);
    if (short) value = "#" + short.slice(1).map(function (v) { return v + v; }).join("");
    var match = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    if (!match) return value;
    return "rgba(" + parseInt(match[1], 16) + "," + parseInt(match[2], 16) + "," + parseInt(match[3], 16) + "," + alpha + ")";
  }

  function palette() {
    return {
      c1: cssToken("--bb-chart-1", "#3987e5"),
      c2: cssToken("--bb-chart-2", "#d95926"),
      c3: cssToken("--bb-chart-3", "#199e70"),
      c4: cssToken("--bb-chart-4", "#c98500"),
      c5: cssToken("--bb-chart-5", "#d55181"),
      c6: cssToken("--bb-chart-6", "#0ca30c"),
      c7: cssToken("--bb-chart-7", "#9085e9"),
      c8: cssToken("--bb-chart-8", "#e66767"),
      grid: cssToken("--bb-chart-grid", "#2b2f38"),
      axis: cssToken("--bb-chart-axis", "#8a93a5"),
      label: cssToken("--bb-chart-label", "#f4f6fa"),
      surface: cssToken("--bb-chart-surface", "#15171d"),
      border: cssToken("--bb-border-color", "#2b2f38"),
      tertiary: cssToken("--bb-tertiary-bg", "#1d2027"),
      secondary: cssToken("--bb-secondary-color", "#8a93a5")
    };
  }

  var labels6 = ["Şub", "Mar", "Nis", "May", "Haz", "Tem"];
  var labels7 = ["Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu"];

  var definitions = {
    statistics: {
      type: "bar",
      labels: labels6,
      datasets: function (p) {
        return [
          { label: "Yeni", data: [43, 54, 57, 55, 60, 57], backgroundColor: p.c1, borderRadius: 5, barPercentage: 0.48, categoryPercentage: 0.56 },
          { label: "Toplam", data: [75, 85, 100, 97, 87, 104], backgroundColor: p.tertiary, borderRadius: 5, barPercentage: 0.48, categoryPercentage: 0.56 }
        ];
      }
    },
    orders: {
      type: "bar",
      labels: labels6,
      datasets: function (p) {
        return [
          { label: "Order", data: [43, 54, 57, 55, 60, 57], backgroundColor: p.c4, borderRadius: 5, barPercentage: 0.48, categoryPercentage: 0.56 },
          { label: "Hedef", data: [75, 85, 100, 97, 87, 104], backgroundColor: p.tertiary, borderRadius: 5, barPercentage: 0.48, categoryPercentage: 0.56 }
        ];
      }
    },
    transactions: {
      type: "line",
      labels: labels7,
      datasets: function (p) {
        return [{ label: "Action", data: [30, 40, 40, 90, 90, 70, 70], borderColor: p.c7, backgroundColor: rgba(p.c7, 0.18), fill: true, tension: 0.34, pointRadius: 0, borderWidth: 2 }];
      }
    },
    customers: {
      type: "line",
      labels: labels6,
      datasets: function (p) {
        return [
          { label: "New müşteri", data: [70, 61, 110, 40, 51, 70], borderColor: p.c4, backgroundColor: rgba(p.c4, 0.82), fill: true, tension: 0.38, pointRadius: 0, borderWidth: 2 },
          { label: "Tekrar gelen", data: [null, null, null, 40, 100, 42], borderColor: p.c3, backgroundColor: rgba(p.c3, 0.82), fill: true, tension: 0.38, pointRadius: 0, borderWidth: 2, spanGaps: false }
        ];
      }
    },
    customerDelta: {
      type: "bar",
      labels: labels6,
      datasets: function (p) {
        var values = [-18, -8, 12, 24, -5, 32];
        return [{ label: "Net değişim", data: values, backgroundColor: values.map(function (v) { return v < 0 ? p.c8 : p.c3; }), borderRadius: 4, barPercentage: 0.48 }];
      },
      yMin: -40,
      yMax: 40
    },
    salesExpenses: {
      type: "bar",
      labels: labels6,
      stacked: true,
      datasets: function (p) {
        return [
          { type: "line", label: "Trend", data: [60, 80, 60, 90, 50, 70], borderColor: rgba(p.c1, 0), backgroundColor: rgba(p.c1, 0.12), fill: true, tension: 0.4, pointRadius: 0, borderWidth: 0, order: 3 },
          { type: "bar", label: "Satış", data: [40, 50, 65, 70, 50, 30], backgroundColor: p.c1, borderRadius: 4, barPercentage: 0.28, order: 1, stack: "money" },
          { type: "bar", label: "Gider", data: [20, 20, 25, 30, 30, 20], backgroundColor: p.c7, borderRadius: 4, barPercentage: 0.28, order: 2, stack: "money" }
        ];
      }
    },
    users: {
      type: "line",
      labels: labels6,
      stacked: true,
      datasets: function (p) {
        return [
          { label: "Aktif", data: [70, 70, 40, 40, 20, 20], borderColor: p.c1, backgroundColor: rgba(p.c1, 0.92), fill: true, tension: 0.42, pointRadius: 0, borderWidth: 2 },
          { label: "Yeni", data: [null, null, 55, 55, 30, 30], borderColor: p.c4, backgroundColor: rgba(p.c4, 0.92), fill: true, tension: 0.42, pointRadius: 0, borderWidth: 2, spanGaps: false },
          { label: "Doğrulanan", data: [null, null, null, null, 85, 85], borderColor: p.c3, backgroundColor: rgba(p.c3, 0.92), fill: true, tension: 0.42, pointRadius: 0, borderWidth: 2, spanGaps: false }
        ];
      }
    },
    finance: {
      type: "line",
      labels: labels6,
      datasets: function (p) {
        return [
          { label: "Net kâr", data: [55, 55, 34, 34, 25, 70], borderColor: p.c4, backgroundColor: rgba(p.c4, 0.08), fill: false, tension: 0.32, pointRadius: 0, borderWidth: 2 },
          { label: "Gelir", data: [70, 70, 35, 35, 25, 92], borderColor: p.c3, backgroundColor: rgba(p.c3, 0.12), fill: true, tension: 0.32, pointRadius: 0, borderWidth: 2 },
          { label: "Gider", data: [70, 70, 35, 35, 25, 20], borderColor: p.c1, backgroundColor: rgba(p.c1, 0.12), fill: true, tension: 0.32, pointRadius: 0, borderWidth: 2 }
        ];
      }
    }
  };

  function scaledData(data, period) {
    var factor = period === "month" ? 0.72 : period === "week" ? 0.38 : 1;
    return data.map(function (v) {
      if (v === null) return null;
      return Math.round(v * factor * 10) / 10;
    });
  }

  function buildOptions(def, key) {
    var p = palette();
    var radius = tokenPx("--bb-radius", 7);
    var datasets = def.datasets(p).map(function (dataset) {
      var copy = Object.assign({}, dataset);
      if (typeof copy.borderRadius === "number") copy.borderRadius = radius;
      return copy;
    });

    var options = {
      type: def.type,
      data: { labels: def.labels.slice(), datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: prefersReducedMotion ? false : { duration: 420 },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: p.surface,
            titleColor: p.label,
            bodyColor: p.label,
            borderColor: p.border,
            borderWidth: 1,
            padding: 12,
            displayColors: true
          }
        },
        scales: {
          x: {
            stacked: !!def.stacked,
            grid: { display: false },
            border: { display: false },
            ticks: { color: p.axis, font: { size: 11 } }
          },
          y: {
            stacked: !!def.stacked,
            min: typeof def.yMin === "number" ? def.yMin : undefined,
            max: typeof def.yMax === "number" ? def.yMax : undefined,
            beginAtZero: typeof def.yMin !== "number",
            grid: { color: p.grid, borderDash: [3, 4] },
            border: { display: false },
            ticks: { color: p.axis, font: { size: 11 }, padding: 8 }
          }
        }
      }
    };

    if (key === "finance") {
      options.options.plugins.tooltip.callbacks = {
        label: function (ctx) { return ctx.dataset.label + ": ₺" + ctx.parsed.y + " bin"; }
      };
    }

    return options;
  }

  function renderOne(canvas) {
    var key = canvas.getAttribute("data-bb-chart");
    var def = definitions[key];
    if (!def) return;

    var previous = chartInstances.get(key);
    if (previous) previous.destroy();

    var chart = new Chart(canvas.getContext("2d"), buildOptions(def, key));
    chartInstances.set(key, chart);
  }

  function renderAll() {
    root.querySelectorAll("[data-bb-chart]").forEach(renderOne);
  }

  root.querySelectorAll("[data-bb-chart-period]").forEach(function (button) {
    button.addEventListener("click", function () {
      var card = button.closest("[data-bb-chart-card]");
      if (!card) return;
      var canvas = card.querySelector("[data-bb-chart]");
      if (!canvas) return;

      card.querySelectorAll("[data-bb-chart-period]").forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === button));
      });

      var key = canvas.getAttribute("data-bb-chart");
      var chart = chartInstances.get(key);
      var def = definitions[key];
      if (!chart || !def) return;

      var period = button.getAttribute("data-bb-chart-period");
      var fresh = def.datasets(palette());
      chart.data.datasets.forEach(function (dataset, index) {
        if (!fresh[index]) return;
        dataset.data = scaledData(fresh[index].data, period);
      });
      chart.update();
      say(button.textContent.trim() + " görünümü seçildi. Veriler demo amaçlıdır.");
    });
  });

  var themeObserver = new MutationObserver(function (mutations) {
    if (mutations.some(function (mutation) { return mutation.attributeName === "data-bs-theme"; })) {
      renderAll();
    }
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });

  renderAll();
  say("Grafikler Chart.js ile oluşturuldu; görsel renkler GlobalTheme DataViz tokenlarından okunuyor.");
}());
