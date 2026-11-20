(function(){
"use strict";
var page=document.querySelector("[data-bb-draugr-page]"); if(!page)return;
var views={
 dashboard:{title:"Draugr Dashboard",label:"Dashboard"},
 storefront:{title:"Draugr / Vitrin",label:"Vitrin"},
 navigation:{title:"Draugr / Categories & Navigasyon",label:"Categories & Navigasyon"},
 content:{title:"Draugr / Pages & İçerik",label:"Pages & İçerik"},
 theme:{title:"Draugr / Tema & View Mode",label:"Tema & View Mode"},
 domain:{title:"Draugr / Domain & SEO",label:"Domain & SEO"},
 localization:{title:"Draugr / Dil & Yerelleştirme",label:"Dil & Yerelleştirme"},
 settings:{title:"Draugr / Channel Settings",label:"Channel Settings"},
 subscription:{title:"Draugr / Subscription",label:"Subscription"}
};
var view=new URLSearchParams(location.search).get("view")||"dashboard";
if(!Object.prototype.hasOwnProperty.call(views, view))view="dashboard";
page.querySelectorAll("[data-bb-draugr-view]").forEach(function(node){node.hidden=node.dataset.bbDraugrView!==view;});
var title=document.querySelector(".bb-page-title"); if(title)title.textContent=views[view].title;
var crumb=document.querySelector(".bb-breadcrumb .breadcrumb");
if(crumb)crumb.innerHTML='<li class="breadcrumb-item"><a href="draugr.html?view=dashboard">Draugr</a></li><li class="breadcrumb-item active" aria-current="page">'+views[view].label+'</li>';
document.querySelectorAll("[data-bb-draugr-view-link]").forEach(function(link){
 var active=link.dataset.bbDraugrViewLink===view;
 link.classList.toggle("active",active);
 if(active){link.setAttribute("aria-current","page"); var item=link.closest("[data-bb-menu-trigger]"); if(item){item.classList.add("show"); var button=item.querySelector(":scope > .bb-menu-link"); var sub=item.querySelector(":scope > .bb-menu-sub"); if(button)button.setAttribute("aria-expanded","true"); if(sub){sub.setAttribute("aria-hidden","false");sub.inert=false;}}} else link.removeAttribute("aria-current");
});
page.querySelectorAll("[data-bb-draugr-form]").forEach(function(form){form.addEventListener("submit",function(e){e.preventDefault();if(!form.reportValidity())return;var status=form.querySelector("[data-bb-draugr-status]")||page.querySelector('[data-bb-draugr-view]:not([hidden]) [data-bb-draugr-status]');if(status)status.textContent="Değişiklikler demo olarak kaydedildi.";});});
page.querySelectorAll("[data-bb-draugr-theme]").forEach(function(button){button.addEventListener("click",function(){page.querySelectorAll("[data-bb-draugr-theme]").forEach(function(item){item.setAttribute("aria-pressed",String(item===button));});var status=page.querySelector('[data-bb-draugr-view]:not([hidden]) [data-bb-draugr-status]');if(status)status.textContent=button.dataset.bbDraugrTheme+" tema yönü seçildi.";});});
page.querySelectorAll("[data-bb-draugr-demo-action]").forEach(function(button){button.addEventListener("click",function(){var status=page.querySelector('[data-bb-draugr-view]:not([hidden]) [data-bb-draugr-status]');if(status)status.textContent=button.dataset.bbDraugrDemoAction+" demo aksiyonu çalıştırıldı.";});});

  function initTraffic(dashboard) {
    // Each pair is [Bulbulustur referrals, other visits] for one demo day.
    var dailyTraffic = [
      [88, 105], [100, 112], [107, 119], [124, 123], [111, 131],
      [90, 107], [112, 115], [111, 125], [127, 130], [122, 139],
      [147, 105], [164, 113], [177, 130], [184, 131], [190, 138],
      [145, 105], [163, 116], [183, 126], [171, 120], [190, 130],
      [144, 112], [162, 118], [176, 130], [163, 109], [175, 155],
      [132, 158], [155, 155], [180, 158], [197, 185], [223, 187]
    ];
    var weekdays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
    var formatter = new Intl.NumberFormat("tr-TR");
    var headline = dashboard.querySelector("[data-bb-draugr-traffic-headline]");
    headline.textContent = formatter.format(dailyTraffic.reduce(function (sum, day) {
      return sum + day[0] + day[1];
    }, 0));
    var chart = dashboard.querySelector("[data-bb-draugr-traffic-chart]");
    var table = dashboard.querySelector("[data-bb-draugr-traffic-rows]");
    var summary = dashboard.querySelector("[data-bb-draugr-traffic-summary]");
    var networkTotal = dashboard.querySelector("[data-bb-draugr-network]");
    var otherTotal = dashboard.querySelector("[data-bb-draugr-other]");

    function renderTraffic(period) {
      var isWeek = period === "7";
      var days = dailyTraffic.slice(isWeek ? -7 : 0);
      var step = isWeek ? 1 : 5;
      var buckets = [];
      for (var index = 0; index < days.length; index += step) {
        var network = 0;
        var other = 0;
        days.slice(index, index + step).forEach(function (day) {
          network += day[0];
          other += day[1];
        });
        buckets.push({
          label: isWeek ? weekdays[index] : (index + 1) + "–" + (index + step),
          network: network,
          other: other,
          total: network + other
        });
      }

      var maximum = Math.ceil(Math.max(...buckets.map(function (bucket) { return bucket.total; })) / 100) * 100;
      var totalNetwork = buckets.reduce(function (sum, bucket) { return sum + bucket.network; }, 0);
      var totalOther = buckets.reduce(function (sum, bucket) { return sum + bucket.other; }, 0);
      summary.textContent = "Son " + period + " gün · " + formatter.format(totalNetwork + totalOther) + " ziyaret";
      networkTotal.textContent = formatter.format(totalNetwork);
      otherTotal.textContent = formatter.format(totalOther);
      chart.style.setProperty("--bb-draugr-chart-columns", buckets.length);

      chart.innerHTML = buckets.map(function (bucket) {
        return `
          <div class="bb-draugr-chart-column">
            <div class="bb-draugr-chart-track">
              <div class="bb-draugr-chart-bar" style="height: ${bucket.total / maximum * 100}%" title="${bucket.label} · ${formatter.format(bucket.total)} ziyaret">
                <span class="is-network" style="height: ${bucket.network / bucket.total * 100}%"></span>
                <span class="is-other" style="height: ${bucket.other / bucket.total * 100}%"></span>
              </div>
            </div>
            <span>${bucket.label}</span>
          </div>`;
      }).join("");

      table.innerHTML = buckets.map(function (bucket) {
        return `
          <tr>
            <th scope="row">${bucket.label}</th>
            <td>${formatter.format(bucket.network)}</td>
            <td>${formatter.format(bucket.other)}</td>
            <td>${formatter.format(bucket.total)}</td>
          </tr>`;
      }).join("");
    }

    dashboard.querySelectorAll('input[name="dr-traffic-period"]').forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked) renderTraffic(input.value);
      });
    });
    renderTraffic(dashboard.querySelector('input[name="dr-traffic-period"]:checked').value);
  }

  function initSeoDraft() {
    var storageKey = "bb-draugr-demo-seo-v1";
    var badge = page.querySelector("[data-bb-draugr-seo-badge]");
    var dashboardStatus = page.querySelector("[data-bb-draugr-dashboard-status]");
    var forms = page.querySelectorAll("[data-bb-draugr-seo]");
    var draft;
    try {
      draft = JSON.parse(localStorage.getItem(storageKey));
    } catch {
      draft = null;
    }

    function updateBadge() {
      if (!badge) return;
      badge.classList.replace("bb-badge-light-warning", "bb-badge-light-info");
      badge.textContent = "Taslak kaydedildi";
    }

    function updateForm(form, values) {
      form.elements.title.value = values.title;
      form.elements.description.value = values.description;
      form.dispatchEvent(new Event("input"));
    }

    forms.forEach(function (form) {
      var previewTitle = form.querySelector("[data-bb-draugr-preview-title]");
      var previewDescription = form.querySelector("[data-bb-draugr-preview-description]");
      var status = form.querySelector("[data-bb-draugr-seo-status]");
      if (previewTitle && previewDescription) {
        form.addEventListener("input", function () {
          previewTitle.textContent = form.elements.title.value.trim() || "Site başlığı";
          previewDescription.textContent = form.elements.description.value.trim() || "Site açıklaması";
        });
      }

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var nextDraft = {
          title: form.elements.title.value.trim(),
          description: form.elements.description.value.trim()
        };
        status.classList.remove("is-error");
        if (!nextDraft.title || !nextDraft.description) {
          status.classList.add("is-error");
          status.textContent = "Site başlığını ve açıklamasını girin.";
          return;
        }

        try {
          localStorage.setItem(storageKey, JSON.stringify(nextDraft));
        } catch {
          status.classList.add("is-error");
          status.textContent = "Taslak bu tarayıcıda saklanamadı.";
          return;
        }

        forms.forEach(function (otherForm) { updateForm(otherForm, nextDraft); });
        updateBadge();
        status.textContent = "SEO taslağı bu tarayıcıya kaydedildi.";
        if (form.id === "dr-seo-quick-form") {
          dashboardStatus.textContent = status.textContent;
          window.BBDrawer.close();
        }
      });
    });

    if (draft && typeof draft.title === "string" && typeof draft.description === "string") {
      forms.forEach(function (form) { updateForm(form, draft); });
      updateBadge();
    }
  }

  if (view === "dashboard") {
    var drawer = page.querySelector("#dr-seo-drawer");
    drawer.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") return;
      var first = drawer.querySelector("[data-bb-drawer-close]");
      var last = drawer.querySelector('button[type="submit"]');
      if (event.shiftKey && (document.activeElement === first || document.activeElement === drawer)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    var dashboard = page.querySelector(".bb-draugr-dashboard");
    initTraffic(dashboard);
    page.querySelector("[data-bb-draugr-demo-label]").hidden = false;
  }
  initSeoDraft();
}());
