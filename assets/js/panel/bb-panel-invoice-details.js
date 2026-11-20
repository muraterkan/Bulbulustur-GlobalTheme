/* Invoice detail composition — fixed historical demo snapshots, no payment or GIB API. */
(function () {
  "use strict";

  const root = document.querySelector("[data-bb-invoice-detail]");
  if (!root) return;

  // Invoice amounts are snapshots. Past invoices must not recalculate from today's package pricing.
  const invoices = [
    {
      id: "INV-DEMO-2026-0116", issued: "2026-11-16", paid: "2026-11-16",
      period: "16 Kas 2026 – 15 Kas 2027", status: "paid",
      method: "Visa •••• 4242 (demo)",
      lines: [
        {name: "Draugr Pro", detail: "Mağaza ve tema hizmeti · SUB-DEMO-DRAUGR-01",
         period: "16.11.2026 – 15.11.2027", quantity: 1, unitCents: 1000000},
        {name: "PosB Basic", detail: "Kasa ve şube yönetimi · SUB-DEMO-POSB-01",
         period: "16.11.2026 – 15.11.2027", quantity: 1, unitCents: 49900}
      ]
    },
    {
      id: "INV-DEMO-2025-1116", issued: "2025-11-16", paid: "2025-11-16",
      period: "16 Kas 2025 – 15 Kas 2026", status: "paid",
      method: "Visa •••• 4242 (demo)",
      lines: [
        {name: "Draugr Basic", detail: "Yıllık mağaza aboneliği · SUB-DEMO-DRAUGR-01",
         period: "16.11.2025 – 15.11.2026", quantity: 1, unitCents: 250000}
      ]
    },
    {
      id: "INV-DEMO-2024-1116", issued: "2024-11-16", paid: "2024-11-16",
      period: "16 Kas 2024 – 15 Kas 2025", status: "paid",
      method: "Visa •••• 4242 (demo)",
      lines: [
        {name: "Draugr Basic", detail: "İlk abonelik dönemi · SUB-DEMO-DRAUGR-01",
         period: "16.11.2024 – 15.11.2025", quantity: 1, unitCents: 250000}
      ]
    }
  ];

  const subscriptionEvents = [
    {date: "2026-11-16", title: "Draugr Pro + PosB Basic",
     description: "Draugr paketi yükseltildi, PosB aboneliği eklendi.",kind: "current"},
    {date: "2025-11-16", title: "Draugr Basic yenilemesi",
     description: "Önceki yıllık paket dönemi yenilendi.",kind: "renewal"},
    {date: "2024-11-16", title: "Draugr Basic başlangıcı",
     description: "İlk örnek abonelik oluşturuldu.",kind: "start"}
  ];

  const $ = selector => root.querySelector(selector);
  const element = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const money = cents => new Intl.NumberFormat("tr-TR",{
    style:"currency",currency:"TRY",minimumFractionDigits:2,maximumFractionDigits:2
  }).format(cents/100);
  const readableDate = value => new Intl.DateTimeFormat("tr-TR",{
    year:"numeric",month:"long",day:"numeric",timeZone:"UTC"
  }).format(new Date(value+"T12:00:00Z"));
  const shortDate = value => new Intl.DateTimeFormat("tr-TR",{
    year:"numeric",month:"short",day:"numeric",timeZone:"UTC"
  }).format(new Date(value+"T12:00:00Z"));
  const gross = entry => {
    const subtotal=entry.lines.reduce((sum,line)=>sum+line.quantity*line.unitCents,0);
    const tax=Math.round(subtotal*0.20);
    return {subtotal,tax,total:subtotal+tax};
  };
  const statusInfo = {
    paid: {label:"Ödendi (demo)",badge:"bb-badge-light-success"},
    pending: {label:"Bekliyor (demo)",badge:"bb-badge-light-warning"},
    void: {label:"İptal (demo)",badge:"bb-badge-light-danger"}
  };
  const requested = new URLSearchParams(window.location.search).get("invoice");
  const current = invoices.find(inv => inv.id === requested) || invoices[0];

  function fill(selector, value) {
    const target=$(selector);
    if(target)target.textContent=value;
  }
  function badge(target,status) {
    const info=statusInfo[status] || statusInfo.pending;
    target.className="bb-badge "+info.badge;
    target.textContent=info.label;
  }
  function renderHeader() {
    fill("[data-bb-invoice-number]",current.id);
    fill("[data-bb-invoice-issued]",readableDate(current.issued));
    fill("[data-bb-invoice-paid]",current.paid ? readableDate(current.paid) : "—");
    fill("[data-bb-invoice-period]",current.period);
    fill("[data-bb-invoice-customer-email]","dam@consulting.com");
    badge($("[data-bb-invoice-status]"),current.status);
    badge($("[data-bb-invoice-side-status]"),current.status);

    // The shared panel router changes generic page headings. Keep invoice-specific text/links.
    const heading=document.querySelector(".bb-toolbar .bb-page-title");
    if(heading)heading.textContent="Fatura Detayı";
    const crumbs=document.querySelector(".bb-toolbar .bb-breadcrumb .breadcrumb");
    if(crumbs) {
      crumbs.replaceChildren();
      for(const [label,link] of [["Panel","dashboard.html"],["Faturalar","invoices.html"],["Fatura Detayı",null]]){
        const li=element("li","breadcrumb-item"+(link?"":" active"));
        if(link) {
          const a=element("a","",label);
          a.href=link;
          li.append(a);
        }else{
          li.textContent=label;
          li.setAttribute("aria-current","page");
        }
        crumbs.append(li);
      }
    }
    document.title="Fatura "+current.id+" — Bulbulustur";
  }

  function renderLines() {
    const body=$("[data-bb-invoice-lines]");
    body.replaceChildren();
    for(const line of current.lines) {
      const tr=element("tr");
      const name=element("td");
      const primary=element("strong","bb-invoice-line-name",line.name);
      const secondary=element("small","bb-showcase-muted",line.detail);
      name.append(primary,secondary);
      const period=element("td","bb-invoice-line-period",line.period);
      const qty=element("td","bb-invoice-number",String(line.quantity));
      const unit=element("td","bb-invoice-number",money(line.unitCents));
      const total=element("td","bb-invoice-number bb-invoice-line-amount",money(line.unitCents*line.quantity));
      tr.append(name,period,qty,unit,total);
      body.append(tr);
    }
    fill("[data-bb-invoice-line-count]",current.lines.length+" kalem");
    const sum=gross(current);
    fill("[data-bb-invoice-subtotal]",money(sum.subtotal));
    fill("[data-bb-invoice-tax]",money(sum.tax));
    fill("[data-bb-invoice-total]",money(sum.total));
    fill("[data-bb-invoice-side-total]",money(sum.total));
    fill("[data-bb-invoice-payment-method]",current.method);
    fill("[data-bb-invoice-payment-date]",current.paid?shortDate(current.paid):"—");
  }

  function renderSubscriptions() {
    const list=$("[data-bb-invoice-subscription-history]");
    list.replaceChildren();
    for(const event of subscriptionEvents) {
      const li=element("li","bb-invoice-timeline-item");
      const date=element("time","bb-invoice-timeline-date",shortDate(event.date));
      date.dateTime=event.date;
      const title=element("strong","",event.title);
      const description=element("p","bb-showcase-muted mb-0",event.description);
      li.append(date,title,description);
      if(event.date===current.issued)li.dataset.current="true";
      list.append(li);
    }
  }

  const select=$("[data-bb-invoice-year]");
  const years=[...new Set(invoices.map(item=>item.issued.slice(0,4)))];
  // Keep options data-driven so later demo years do not silently disappear.
  select.replaceChildren();
  const all=element("option","","Tüm yıllar");
  all.value="all";
  select.append(all);
  for(const year of years) {
    const option=element("option","",year);
    option.value=year;
    select.append(option);
  }

  function renderHistory() {
    const body=$("[data-bb-invoice-history-rows]");
    body.replaceChildren();
    const selectedYear=select.value;
    const previous=invoices.filter(item=>item.id!==current.id &&
      (selectedYear==="all" || item.issued.startsWith(selectedYear)))
      .sort((a,b)=>b.issued.localeCompare(a.issued));
    fill("[data-bb-invoice-history-count]",previous.length+" fatura");
    $("[data-bb-invoice-history-empty]").hidden=previous.length>0;
    for(const entry of previous) {
      const tr=element("tr");
      const number=element("td");
      number.append(element("strong","bb-invoice-history-number",entry.id));
      const time=element("time","bb-showcase-muted",shortDate(entry.issued));
      time.dateTime=entry.issued;
      number.append(time);

      const services=element("td","",entry.lines.map(l=>l.name).join(" + "));
      const state=element("td");
      const stateBadge=element("span");
      badge(stateBadge,entry.status);
      state.append(stateBadge);
      const amount=element("td","bb-invoice-number",money(gross(entry).total));
      const open=element("td","bb-invoice-number");
      const link=element("a","btn bb-btn-secondary btn-sm","Görüntüle");
      link.href="invoice-details.html?invoice="+encodeURIComponent(entry.id);
      link.setAttribute("aria-label",entry.id+" faturasını görüntüle");
      open.append(link);
      tr.append(number,services,state,amount,open);
      body.append(tr);
    }
  }

  // Toolbar lives outside the content root; bind print at the document level.
  const printButton=document.querySelector("[data-bb-invoice-print]");
  if(printButton)printButton.addEventListener("click",()=>window.print());

  select.addEventListener("change",renderHistory);
  renderHeader();
  renderLines();
  renderSubscriptions();
  renderHistory();
  if(requested && requested!==current.id)
    fill("[data-bb-admin-feedback]","İstenen örnek fatura bulunamadı. En son örnek fatura görüntüleniyor.");
  else
    fill("[data-bb-admin-feedback]","Fatura ve abonelik geçmişi demo verileridir. Gerçek ödeme veya mali belge oluşturulmaz.");
})();