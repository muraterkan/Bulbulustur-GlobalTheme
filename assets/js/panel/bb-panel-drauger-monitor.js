(function () {
  "use strict";

  const TENANT_TELEMETRY = {
    ortobella: {
      domain: "ortobella.drauger.net",
      pod: "pod/drauger-ortobella-7f8d9c-x2k9p",
      cpu: 34.8,
      nodeSpec: "4 vCPU • Sağlıklı",
      uptime: "Uptime: 42g 11s",
      ramText: "5.4 / 8.0 GB",
      ramPct: 67.5,
      dbLatency: "4.2 ms",
      dbConn: "38 / 150 Aktif Bağlantı",
      syncLag: "0 Bekleyen",
      syncState: "Eşitlendi",
      lastSync: "Son: 18 sn önce",
      rpm: "1,420",
      ssr: "38 ms",
      errRate: "0.01%",
      disk: "41.2 / 120 GB",
      series: [28, 31, 35, 42, 39, 33, 30, 36, 44, 38, 35, 34.8],
      logs: [
        { time: "06:12:41", source: "ProductSyncWorker", type: "sync", detail: "14 ürün varyantı Bulbulustur master tablodan eşleştirildi.", duration: "210 ms", status: "Başarılı", badge: "success" },
        { time: "06:09:15", source: "PostgreSQL-Local", type: "system", detail: "Otomatik checkpoint ve WAL arşivleme tamamlandı.", duration: "64 ms", status: "OK", badge: "neutral" },
        { time: "06:04:02", source: "GlobalizationCache", type: "sync", detail: "DE ve EN dil anahtarları Redis önbelleğine alındı.", duration: "19 ms", status: "Başarılı", badge: "success" },
        { time: "05:51:30", source: "CategoryTreeBridge", type: "sync", detail: "Kalıtsal kategori ağacı doğrulaması (312 düğüm).", duration: "88 ms", status: "Eşit", badge: "success" }
      ]
    },
    velora: {
      domain: "velora.drauger.net",
      pod: "pod/drauger-velora-5b2a1d-m9q4w",
      cpu: 61.2,
      nodeSpec: "4 vCPU • Yoğun Trafik",
      uptime: "Uptime: 19g 04s",
      ramText: "6.6 / 8.0 GB",
      ramPct: 82.5,
      dbLatency: "7.8 ms",
      dbConn: "74 / 150 Aktif Bağlantı",
      syncLag: "3 Bekleyen",
      syncState: "İşleniyor",
      lastSync: "Son: 4 sn önce",
      rpm: "3,180",
      ssr: "54 ms",
      errRate: "0.04%",
      disk: "68.5 / 120 GB",
      series: [45, 49, 53, 58, 64, 69, 66, 62, 59, 63, 60, 61.2],
      logs: [
        { time: "06:12:50", source: "ProductSyncWorker", type: "sync", detail: "Toplu fiyat güncellemesi kuyruğu işleniyor (3 batch).", duration: "430 ms", status: "İşleniyor", badge: "warning" },
        { time: "06:10:11", source: "K8s-HPA", type: "warn", detail: "CPU eşik değeri %60 üzerine çıktı, izleme aktif.", duration: "12 ms", status: "Uyarı", badge: "warning" },
        { time: "06:02:44", source: "PaymentGateway", type: "system", detail: "POSX webhook doğrulama yanıt süresi normal.", duration: "91 ms", status: "OK", badge: "success" }
      ]
    },
    kuzeyoutdoor: {
      domain: "kuzeyoutdoor.drauger.net",
      pod: "pod/drauger-kuzey-9c4e7f-p1z8r",
      cpu: 18.4,
      nodeSpec: "2 vCPU • Düşük Yük",
      uptime: "Uptime: 65g 22s",
      ramText: "2.9 / 4.0 GB",
      ramPct: 72.5,
      dbLatency: "3.1 ms",
      dbConn: "19 / 100 Aktif Bağlantı",
      syncLag: "0 Bekleyen",
      syncState: "Eşitlendi",
      lastSync: "Son: 1 dk önce",
      rpm: "540",
      ssr: "29 ms",
      errRate: "0.00%",
      disk: "27.8 / 80 GB",
      series: [16, 17, 19, 22, 20, 18, 17, 19, 21, 18, 17, 18.4],
      logs: [
        { time: "06:11:05", source: "CategoryTreeBridge", type: "sync", detail: "Kategori eşleştirme kontrolü tamamlandı.", duration: "45 ms", status: "Eşit", badge: "success" },
        { time: "05:45:00", source: "PostgreSQL-Local", type: "system", detail: "Günlük pg_dump yedeklemesi node diskine yazıldı.", duration: "1.4 sn", status: "Başarılı", badge: "neutral" }
      ]
    }
  };

  let currentTenantKey = "ortobella";
  let currentFilter = "all";

  const el = {
    tenantSelect: document.getElementById("bbTenantSelect"),
    domainLabel: document.getElementById("bbActiveDomainLabel"),
    podTag: document.getElementById("bbPodIdTag"),
    cpuVal: document.getElementById("kpiCpuValue"),
    cpuBar: document.getElementById("kpiCpuBar"),
    nodeBadge: document.getElementById("kpiNodeBadge"),
    uptime: document.getElementById("kpiUptimeText"),
    ramVal: document.getElementById("kpiRamValue"),
    ramBar: document.getElementById("kpiRamBar"),
    ramPct: document.getElementById("kpiRamPct"),
    dbLatency: document.getElementById("kpiDbLatency"),
    dbConn: document.getElementById("kpiDbConn"),
    syncLag: document.getElementById("kpiSyncLag"),
    syncState: document.getElementById("kpiSyncState"),
    lastSync: document.getElementById("kpiLastSync"),
    rpm: document.getElementById("metricRpm"),
    ssr: document.getElementById("metricSsr"),
    errRate: document.getElementById("metricErrRate"),
    disk: document.getElementById("metricDisk"),
    chart: document.getElementById("bbTelemetryChart"),
    logsBody: document.getElementById("bbTelemetryLogsBody"),
    logFilter: document.getElementById("bbLogFilter"),
    syncBtn: document.getElementById("bbTriggerSyncBtn"),
    refreshBtn: document.getElementById("bbManualRefresh"),
    sidebarToggle: document.getElementById("bbSidebarToggle"),
    sidebar: document.getElementById("bbSidebar")
  };

  function renderChart(values) {
    if (!el.chart) return;
    el.chart.innerHTML = "";
    values.forEach((val, idx) => {
      const bar = document.createElement("div");
      bar.className = "bb-telemetry-bar" + (val > 60 ? " is-warning" : "");
      bar.style.height = Math.max(12, Math.min(100, val)) + "%";
      bar.title = `T-${(values.length - 1 - idx) * 5}dk: %${val} CPU`;
      el.chart.appendChild(bar);
    });
  }

  function renderLogs(logs) {
    if (!el.logsBody) return;
    const filtered = currentFilter === "all"
      ? logs
      : logs.filter((item) => item.type === currentFilter);

    el.logsBody.innerHTML = filtered.map((row) => `
      <tr>
        <td class="bb-mono">${row.time}</td>
        <td><strong>${row.source}</strong></td>
        <td>${row.detail}</td>
        <td class="bb-mono">${row.duration}</td>
        <td><span class="bb-badge bb-badge-${row.badge}">${row.status}</span></td>
      </tr>
    `).join("");
  }

  function renderTenant(key) {
    const data = TENANT_TELEMETRY[key];
    if (!data) return;

    el.domainLabel.textContent = data.domain;
    el.podTag.textContent = data.pod;
    el.cpuVal.textContent = `${data.cpu.toFixed(1)}%`;
    el.cpuBar.style.width = `${data.cpu}%`;
    el.cpuBar.className = `bb-progress-bar ${data.cpu > 60 ? "is-warning" : "is-success"}`;
    el.nodeBadge.textContent = data.nodeSpec;
    el.uptime.textContent = data.uptime;

    el.ramVal.textContent = data.ramText;
    el.ramBar.style.width = `${data.ramPct}%`;
    el.ramPct.textContent = `${data.ramPct}%`;

    el.dbLatency.textContent = data.dbLatency;
    el.dbConn.textContent = data.dbConn;

    el.syncLag.textContent = data.syncLag;
    el.syncState.textContent = data.syncState;
    el.lastSync.textContent = data.lastSync;

    el.rpm.textContent = data.rpm;
    el.ssr.textContent = data.ssr;
    el.errRate.textContent = data.errRate;
    el.disk.textContent = data.disk;

    renderChart(data.series);
    renderLogs(data.logs);
  }

  function bindEvents() {
    el.tenantSelect?.addEventListener("change", (e) => {
      currentTenantKey = e.target.value;
      renderTenant(currentTenantKey);
    });

    el.logFilter?.addEventListener("change", (e) => {
      currentFilter = e.target.value;
      renderLogs(TENANT_TELEMETRY[currentTenantKey].logs);
    });

    document.querySelectorAll(".bb-seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".bb-seg-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });

    el.syncBtn?.addEventListener("click", () => {
      const data = TENANT_TELEMETRY[currentTenantKey];
      const now = new Date().toTimeString().slice(0, 8);
      data.logs.unshift({
        time: now,
        source: "ManualSyncTrigger",
        type: "sync",
        detail: `${data.domain} için manuel master ürün/kategori doğrulaması başlatıldı.`,
        duration: "145 ms",
        status: "Tamamlandı",
        badge: "success"
      });
      data.lastSync = "Son: Az önce";
      renderTenant(currentTenantKey);
    });

    el.refreshBtn?.addEventListener("click", () => {
      const data = TENANT_TELEMETRY[currentTenantKey];
      const delta = (Math.random() * 2 - 1);
      data.cpu = Math.max(8, Math.min(92, Number((data.cpu + delta).toFixed(1))));
      data.series.shift();
      data.series.push(data.cpu);
      renderTenant(currentTenantKey);
    });

    el.sidebarToggle?.addEventListener("click", () => {
      el.sidebar?.classList.toggle("is-collapsed");
    });
  }

  bindEvents();
  renderTenant(currentTenantKey);
})();