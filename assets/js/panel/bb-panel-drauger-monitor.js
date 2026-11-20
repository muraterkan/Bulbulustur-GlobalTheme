/* Drauger Monitor — core panel page controller. Static snapshots only, NO live API.
 * The data block is the original visual demonstration dataset, deliberately preserved.
 * Data is never mutated to imitate a real refresh or successful synchronization.
 */
(function () {
  "use strict";
  const root = document.querySelector("[data-bb-drauger-monitor]");
  if (!root) return;
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


  const $ = selector => root.querySelector(selector);
  const status = $("[data-bb-monitor-feedback]");
  const tenantControl = $("[data-bb-monitor-tenant]");
  const filterControl = $("[data-bb-monitor-log-filter]");
  const rangeControls = Array.from(root.querySelectorAll("[data-bb-monitor-range]"));
  const state = { tenant:tenantControl.value, filter:"all", range:"1h" };

  function text(selector,value) {
    const el=$(selector);
    if (el) el.textContent = String(value);
  }
  function notify(message) {
    status.textContent = message;
  }
  function updateProgress(selector,value) {
    const el=$(selector);
    if (el) el.value=Math.max(0,Math.min(100,Number(value)||0));
  }

  function renderChart(tenant) {
    const svg=$("[data-bb-monitor-chart]");
    const empty=$("[data-bb-monitor-chart-empty]");
    const series=Array.isArray(tenant.series) ? tenant.series : [];
    const hasSeries=state.range==="1h" && series.length>1;
    svg.hidden=!hasSeries;
    empty.hidden=hasSeries;
    text("[data-bb-monitor-chart-label]",
      hasSeries ? "1 saat · Örnek seri" : "Aralıkta demo verisi yok");
    if (!hasSeries) return;
    const left=36,right=700,top=20,bottom=215;
    const step=(right-left)/(series.length-1);
    const points=series.map((raw,i)=>{
      const value=Math.max(0,Math.min(100,Number(raw)||0));
      return [left+i*step,bottom-(value/100)*(bottom-top)];
    });
    const pointString=points.map(p=>p[0].toFixed(2)+","+p[1].toFixed(2)).join(" ");
    const line=$("[data-bb-monitor-chart-line]");
    const area=$("[data-bb-monitor-chart-area]");
    line.setAttribute("points",pointString);
    const path="M "+left+" "+bottom+" L "+points.map(p=>p[0].toFixed(2)+" "+p[1].toFixed(2)).join(" L ")+" L "+right+" "+bottom+" Z";
    area.setAttribute("d",path);
    const min=Math.min(...series),max=Math.max(...series);
    svg.setAttribute("aria-label","Örnek CPU kullanımı: en düşük %"+min+", en yüksek %"+max+". Canlı ölçüm değildir.");
  }

  function create(tag,css,textValue) {
    const el=document.createElement(tag);
    if (css) el.className=css;
    if (textValue!==undefined) el.textContent=String(textValue);
    return el;
  }
  const badgeTypes={success:"bb-badge-light-success",warning:"bb-badge-light-warning",neutral:"bb-badge-light-info"};
  function renderLogs(tenant) {
    const tbody=$("[data-bb-monitor-log-rows]");
    const entries=(tenant.logs||[]).filter(row=>state.filter==="all"||row.type===state.filter);
    const rows=entries.map(row=>{
      const tr=create("tr");
      const time=create("td","bb-monitor-mono",row.time);
      const source=create("td");
      source.append(create("strong","bb-monitor-log-source",row.source));
      const detail=create("td","",row.detail);
      const duration=create("td","bb-monitor-mono",row.duration);
      const stateCell=create("td");
      stateCell.append(create("span","bb-badge "+(badgeTypes[row.badge]||badgeTypes.neutral),row.status+" · demo"));
      tr.append(time,source,detail,duration,stateCell);
      return tr;
    });
    tbody.replaceChildren(...rows);
    text("[data-bb-monitor-log-count]",rows.length+" kayıt");
    $("[data-bb-monitor-log-empty]").hidden=rows.length>0;
  }

  function renderTenant() {
    const tenant=TENANT_TELEMETRY[state.tenant];
    if (!tenant) return;
    text("[data-bb-monitor-domain]",tenant.domain+" · örnek");
    text("[data-bb-monitor-pod]",tenant.pod+" (demo)");
    text("[data-bb-monitor-cpu]",tenant.cpu.toFixed(1)+"%");
    updateProgress("[data-bb-monitor-cpu-progress]",tenant.cpu);
    text("[data-bb-monitor-node-spec]",tenant.nodeSpec);
    text("[data-bb-monitor-uptime]",tenant.uptime);
    text("[data-bb-monitor-ram]",tenant.ramText);
    updateProgress("[data-bb-monitor-ram-progress]",tenant.ramPct);
    text("[data-bb-monitor-ram-percent]",tenant.ramPct+"%");
    text("[data-bb-monitor-db-latency]",tenant.dbLatency);
    text("[data-bb-monitor-db-connections]",tenant.dbConn);
    text("[data-bb-monitor-sync-lag]",tenant.syncLag);
    text("[data-bb-monitor-sync-state]",tenant.syncState+" (demo)");
    text("[data-bb-monitor-last-sync]",tenant.lastSync);
    text("[data-bb-monitor-rpm]",tenant.rpm);
    text("[data-bb-monitor-ssr]",tenant.ssr);
    text("[data-bb-monitor-error]",tenant.errRate);
    text("[data-bb-monitor-disk]",tenant.disk);
    renderChart(tenant);
    renderLogs(tenant);
  }
  function redrawView() {
    text("[data-bb-monitor-checked]","Görünüm: "+new Intl.DateTimeFormat("tr-TR",{hour:"2-digit",minute:"2-digit"}).format(new Date()));
    renderTenant();
  }

  tenantControl.addEventListener("change",()=>{
    if (!Object.prototype.hasOwnProperty.call(TENANT_TELEMETRY,tenantControl.value)) return;
    state.tenant=tenantControl.value;
    redrawView();
    notify("Örnek tenant değiştirildi: "+TENANT_TELEMETRY[state.tenant].domain+". Canlı veri alınmadı.");
  });
  filterControl.addEventListener("change",()=>{
    state.filter=filterControl.value;
    renderLogs(TENANT_TELEMETRY[state.tenant]);
    notify("Demo olayları filtrelendi.");
  });
  rangeControls.forEach(button=>button.addEventListener("click",()=>{
    state.range=button.getAttribute("data-bb-monitor-range");
    rangeControls.forEach(item=>item.setAttribute("aria-pressed",
      String(item.getAttribute("data-bb-monitor-range")===state.range)));
    renderChart(TENANT_TELEMETRY[state.tenant]);
    notify(state.range==="1h"?
      "Son 1 saatlik örnek CPU serisi görüntüleniyor.":
      "Seçilen dönem için demo veri yok; hayalî telemetri üretilmedi.");
  }));
  $("[data-bb-monitor-refresh]").addEventListener("click",()=>{
    redrawView();
    notify("Demo görünümü yeniden çizildi. Sunucuya istek gönderilmedi, ölçümler değiştirilmedi.");
  });

  redrawView();
  notify("Yalnız demo verileri. Gerçek Kubernetes, PostgreSQL, RabbitMQ veya entegrasyon API'sine bağlı değil.");
})();