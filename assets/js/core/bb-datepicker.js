(function () {
      "use strict";

      // ---------- helpers ----------
      function pad2(n) {
        return String(n).padStart(2, "0");
      }

      function formatTR(d) {
        return pad2(d.getDate()) + "." + pad2(d.getMonth() + 1) + "." + d.getFullYear();
      }

      function startOfDay(d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      }

      function addDays(d, days) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
      }

      function addMonths(d, months) {
        return new Date(d.getFullYear(), d.getMonth() + months, 1);
      }

      function sameDay(a, b) {
        if (!a || !b) { return false; }
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
      }

      function clampOrder(a, b) {
        if (!a || !b) { return { start: a, end: b }; }
        if (a.getTime() <= b.getTime()) {
          return { start: a, end: b };
        }
        return { start: b, end: a };
      }

      function monthTitle(d) {
        const fmt = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" });
        return fmt.format(d);
      }

      function buildCalendarGrid(anchorMonth, state) {
        // anchorMonth = first day of month
        const year = anchorMonth.getFullYear();
        const month = anchorMonth.getMonth();

        const first = new Date(year, month, 1);
        const last = new Date(year, month + 1, 0);

        // TR week starts Monday (1). JS: Sunday=0
        const firstDow = first.getDay(); // 0-6
        const offset = (firstDow + 6) % 7; // Monday=0

        const daysInMonth = last.getDate();

        const cells = [];
        for (let i = 0; i < offset; i++) {
          cells.push({ empty: true });
        }
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
          cells.push({ empty: false, date: date });
        }
        // fill to 42 cells for stable grid
        while (cells.length < 42) {
          cells.push({ empty: true });
        }

        return cells;
      }

      function buildPopover() {
        const el = document.createElement("div");
        el.className = "bb-datetime-popover";
        el.setAttribute("data-bb-open", "false");
        el.innerHTML = `
          <div class="bb-datetime-popover-header">
            <p class="bb-datetime-title mb-0">Tarih Seç</p>
            <button type="button" class="bb-datetime-close" aria-label="Kapat">
              <span class="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          </div>

          <div class="bb-datetime-popover-body">
            <div class="bb-datetime-presets">
              <button type="button" class="bb-datetime-preset" data-bb-preset="today">Bugün</button>
              <button type="button" class="bb-datetime-preset" data-bb-preset="yesterday">Dün</button>
              <button type="button" class="bb-datetime-preset" data-bb-preset="last7">Son 7 Gün</button>
              <button type="button" class="bb-datetime-preset" data-bb-preset="last30">Son 30 Gün</button>
              <button type="button" class="bb-datetime-preset" data-bb-preset="thisMonth">Bu Ay</button>
              <button type="button" class="bb-datetime-preset" data-bb-preset="lastMonth">Geçen Ay</button>
            </div>

            <div class="bb-datetime-calendars">
              <div class="bb-datetime-cal" data-bb-cal="left">
                <div class="bb-datetime-cal-head">
                  <button type="button" class="bb-datetime-nav" data-bb-nav="prev" aria-label="Önceki ay">
                    <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
                  </button>
                  <p class="bb-datetime-month mb-0" data-bb-month-title></p>
                  <button type="button" class="bb-datetime-nav" data-bb-nav="next" aria-label="Sonraki ay">
                    <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                  </button>
                </div>
                <div class="bb-datetime-weekdays">
                  <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div>Cmt</div><div>Paz</div>
                </div>
                <div class="bb-datetime-grid" data-bb-grid></div>
              </div>

              <div class="bb-datetime-cal" data-bb-cal="right">
                <div class="bb-datetime-cal-head">
                  <span></span>
                  <p class="bb-datetime-month mb-0" data-bb-month-title></p>
                  <span></span>
                </div>
                <div class="bb-datetime-weekdays">
                  <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div>Cmt</div><div>Paz</div>
                </div>
                <div class="bb-datetime-grid" data-bb-grid></div>
              </div>
            </div>
          </div>

          <div class="bb-datetime-popover-footer">
            <div class="bb-datetime-selected" data-bb-selected>Seçim yok</div>
            <button type="button" class="btn btn-light btn-sm" data-bb-action="clear">Temizle</button>
            <button type="button" class="btn btn-light btn-sm" data-bb-action="cancel">İptal</button>
            <button type="button" class="btn btn-primary btn-sm" data-bb-action="apply">Uygula</button>
          </div>
        `;
        return el;
      }

      function initDatetime(root) {
        const mode = root.getAttribute("data-bb-datetime") || "range";
        const input = root.querySelector(".bb-datetime-input");
        if (!input) { return; }

        const pop = buildPopover();
        root.appendChild(pop);

        let open = false;
        let anchorMonthLeft = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        let anchorMonthRight = addMonths(anchorMonthLeft, 1);

        let start = null;
        let end = null;

        let draftStart = null;
        let draftEnd = null;

        function syncSelectedText() {
          const el = pop.querySelector("[data-bb-selected]");
          if (!el) { return; }

          if (mode === "single") {
            if (!draftStart) {
              el.textContent = "Seçim yok";
              return;
            }
            el.textContent = formatTR(draftStart);
            return;
          }

          if (!draftStart || !draftEnd) {
            el.textContent = "Seçim yok";
            return;
          }

          const ordered = clampOrder(draftStart, draftEnd);
          el.textContent = formatTR(ordered.start) + " - " + formatTR(ordered.end);
        }

        function renderOne(calEl, anchorMonth) {
          const titleEl = calEl.querySelector("[data-bb-month-title]");
          const gridEl = calEl.querySelector("[data-bb-grid]");

          if (!titleEl || !gridEl) { return; }

          titleEl.textContent = monthTitle(anchorMonth);
          gridEl.innerHTML = "";

          const cells = buildCalendarGrid(anchorMonth);

          for (let i = 0; i < cells.length; i++) {
            const c = cells[i];

            if (c.empty) {
              const stub = document.createElement("div");
              gridEl.appendChild(stub);
              continue;
            }

            const d = startOfDay(c.date);
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "bb-datetime-day";
            btn.textContent = String(d.getDate());
            btn.setAttribute("data-bb-date", d.toISOString());

            const today = startOfDay(new Date());
            if (sameDay(d, today)) {
              btn.setAttribute("data-bb-today", "true");
            }

            // states
            if (mode === "single") {
              if (draftStart && sameDay(d, draftStart)) {
                btn.setAttribute("data-bb-active", "true");
              }
            } else {
              if (draftStart && sameDay(d, draftStart)) {
                btn.setAttribute("data-bb-active", "true");
              }
              if (draftEnd && sameDay(d, draftEnd)) {
                btn.setAttribute("data-bb-active", "true");
              }
              if (draftStart && draftEnd) {
                const ordered = clampOrder(draftStart, draftEnd);
                if (d.getTime() > ordered.start.getTime() && d.getTime() < ordered.end.getTime()) {
                  btn.setAttribute("data-bb-inrange", "true");
                }
              }
            }

            btn.addEventListener("click", function () {
              const clicked = new Date(btn.getAttribute("data-bb-date"));

              if (mode === "single") {
                draftStart = startOfDay(clicked);
                draftEnd = null;
                renderAll();
                syncSelectedText();
                return;
              }

              // range
              if (!draftStart || (draftStart && draftEnd)) {
                draftStart = startOfDay(clicked);
                draftEnd = null;
                renderAll();
                syncSelectedText();
                return;
              }

              draftEnd = startOfDay(clicked);
              renderAll();
              syncSelectedText();
            });

            gridEl.appendChild(btn);
          }
        }

        function renderAll() {
          const left = pop.querySelector('[data-bb-cal="left"]');
          const right = pop.querySelector('[data-bb-cal="right"]');
          if (!left || !right) { return; }

          renderOne(left, anchorMonthLeft);
          renderOne(right, anchorMonthRight);
        }

        function openPopover() {
          if (open) { return; }
          open = true;

          // draft = current
          draftStart = start ? new Date(start.getTime()) : null;
          draftEnd = end ? new Date(end.getTime()) : null;

          pop.setAttribute("data-bb-open", "true");
          renderAll();
          syncSelectedText();
        }

        function closePopover() {
          if (!open) { return; }
          open = false;
          pop.setAttribute("data-bb-open", "false");
        }

        function apply() {
          if (mode === "single") {
            start = draftStart ? startOfDay(draftStart) : null;
            end = null;

            if (start) {
              input.value = formatTR(start);
            } else {
              input.value = "";
            }

            closePopover();
            return;
          }

          if (!draftStart || !draftEnd) {
            // incomplete -> do not apply
            return;
          }

          const ordered = clampOrder(draftStart, draftEnd);
          start = startOfDay(ordered.start);
          end = startOfDay(ordered.end);

          input.value = formatTR(start) + " - " + formatTR(end);
          closePopover();
        }

        function cancel() {
          closePopover();
        }

        function clear() {
          start = null;
          end = null;
          draftStart = null;
          draftEnd = null;
          input.value = "";
          renderAll();
          syncSelectedText();
        }

        function setPreset(key) {
          const today = startOfDay(new Date());
          let s = null;
          let e = null;

          if (key === "today") {
            s = today; e = today;
          }
          if (key === "yesterday") {
            s = addDays(today, -1); e = addDays(today, -1);
          }
          if (key === "last7") {
            s = addDays(today, -6); e = today;
          }
          if (key === "last30") {
            s = addDays(today, -29); e = today;
          }
          if (key === "thisMonth") {
            s = new Date(today.getFullYear(), today.getMonth(), 1);
            e = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          }
          if (key === "lastMonth") {
            const lm = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            s = lm;
            e = new Date(lm.getFullYear(), lm.getMonth() + 1, 0);
          }

          if (mode === "single") {
            draftStart = s;
            draftEnd = null;
          } else {
            draftStart = s;
            draftEnd = e;
          }

          // show the month of preset
          anchorMonthLeft = new Date(draftStart.getFullYear(), draftStart.getMonth(), 1);
          anchorMonthRight = addMonths(anchorMonthLeft, 1);

          renderAll();
          syncSelectedText();

          // highlight preset UI
          const btns = pop.querySelectorAll("[data-bb-preset]");
          btns.forEach(function (b) { b.removeAttribute("aria-current"); });
          const active = pop.querySelector('[data-bb-preset="' + key + '"]');
          active?.setAttribute("aria-current", "true");
        }

        // input interactions
        input.addEventListener("click", function () {
          openPopover();
        });

        // close on outside click
        document.addEventListener("mousedown", function (e) {
          if (!open) { return; }
          const t = e.target;
          if (root.contains(t) || pop.contains(t)) {
            return;
          }
          closePopover();
        });

        // close button
        pop.querySelector(".bb-datetime-close")?.addEventListener("click", function () {
          closePopover();
        });

        // footer buttons
        pop.querySelector('[data-bb-action="apply"]')?.addEventListener("click", function () { apply(); });
        pop.querySelector('[data-bb-action="cancel"]')?.addEventListener("click", function () { cancel(); });
        pop.querySelector('[data-bb-action="clear"]')?.addEventListener("click", function () { clear(); });

        // nav month
        pop.querySelector('[data-bb-cal="left"] [data-bb-nav="prev"]')?.addEventListener("click", function () {
          anchorMonthLeft = addMonths(anchorMonthLeft, -1);
          anchorMonthRight = addMonths(anchorMonthLeft, 1);
          renderAll();
        });

        pop.querySelector('[data-bb-cal="left"] [data-bb-nav="next"]')?.addEventListener("click", function () {
          anchorMonthLeft = addMonths(anchorMonthLeft, 1);
          anchorMonthRight = addMonths(anchorMonthLeft, 1);
          renderAll();
        });

        // presets
        const presetBtns = pop.querySelectorAll("[data-bb-preset]");
        presetBtns.forEach(function (btn) {
          btn.addEventListener("click", function () {
            setPreset(btn.getAttribute("data-bb-preset"));
          });
        });

        // initial state: open month = this month
        anchorMonthLeft = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        anchorMonthRight = addMonths(anchorMonthLeft, 1);
        renderAll();
        syncSelectedText();
      }

      // init all
      const roots = document.querySelectorAll(".bb-datetime");
      roots.forEach(function (r) { initDatetime(r); });
    })();
