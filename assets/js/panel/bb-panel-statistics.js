/* İstatistik widgetsı — Chart.js sparkline, renkler yalnız GlobalTheme tokenlarından. */
(function () {
  "use strict";

  var root = document.querySelector("[data-bb-statistics-page]");
  if (!root) return;

  var status = root.querySelector("[data-bb-stat-status]");
  var charts = [];
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function say(message) {
    if (status) status.textContent = message;
  }

  if (typeof window.Chart === "undefined") {
    say("Chart.js yüklenemedi. Sparkline grafikler oluşturulamadı.");
    return;
  }

  function token(name, fallback) {
    var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function rgba(hex, alpha) {
    var value = String(hex || "").trim();
    var short = /^#([a-f\d])([a-f\d])([a-f\d])$/i.exec(value);
    if (short) value = "#" + short.slice(1).map(function (v) { return v + v; }).join("");
    var match = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    if (!match) return value;
    return "rgba(" + parseInt(match[1], 16) + "," + parseInt(match[2], 16) + "," + parseInt(match[3], 16) + "," + alpha + ")";
  }

  function tone(card) {
    var map = {
      primary: "--bb-chart-1",
      success: "--bb-chart-3",
      warning: "--bb-chart-4",
      danger: "--bb-chart-8",
      violet: "--bb-chart-7"
    };
    return token(map[card.getAttribute("data-tone")] || "--bb-chart-1", "#3987e5");
  }

  var datasets = {
    weeklySales: [22, 36, 24, 55, 30],
    authorProgress: [28, 42, 25, 68, 35],
    salesGrowth: [18, 34, 21, 60, 32],
    salesChange: [36, 36, 20, 20, 28, 28, 52],
    weeklyIncome: [30, 30, 18, 18, 27, 27, 48],
    newUsers: [32, 32, 18, 18, 24, 24, 46]
  };

  function render() {
    charts.forEach(function (chart) { chart.destroy(); });
    charts = [];

    root.querySelectorAll("[data-bb-stat-sparkline]").forEach(function (canvas) {
      var key = canvas.getAttribute("data-bb-stat-sparkline");
      var values = datasets[key];
      if (!values) return;

      var card = canvas.closest("[data-tone]");
      var color = tone(card || root);

      charts.push(new Chart(canvas.getContext("2d"), {
        type: "line",
        data: {
          labels: values.map(function (_, index) { return index + 1; }),
          datasets: [{
            data: values,
            borderColor: color,
            backgroundColor: rgba(color, 0.24),
            fill: true,
            tension: 0.42,
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: reducedMotion ? false : { duration: 360 },
          interaction: { intersect: false, mode: "index" },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              displayColors: false,
              backgroundColor: token("--bb-chart-surface", "#15171d"),
              titleColor: token("--bb-chart-label", "#f4f6fa"),
              bodyColor: token("--bb-chart-label", "#f4f6fa"),
              borderColor: token("--bb-border-color", "#2b2f38"),
              borderWidth: 1
            }
          },
          scales: {
            x: { display: false },
            y: { display: false, beginAtZero: true }
          },
          layout: { padding: 0 }
        }
      }));
    });

    say("İstatistik widgetsı örnek verilerle oluşturuldu; renkler GlobalTheme tokenlarından okunuyor.");
  }

  var observer = new MutationObserver(function (mutations) {
    if (mutations.some(function (mutation) { return mutation.attributeName === "data-bs-theme"; })) render();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });

  render();
}());
