// Bulbulustur FormRepeater (vanilla, lightweight)
    (() => {
      "use strict";

      const repeaters = document.querySelectorAll("[data-bb-repeater]");
      if (!repeaters.length) {
        return;
      }

      const replaceIndex = (text, index) => {
        if (!text) {
          return text;
        }
        return text
          .replaceAll("__index__", String(index))
          .replaceAll("___index___", "_" + String(index) + "_");
      };

      const applyIndexToItem = (item, index) => {
        const indexEl = item.querySelector("[data-bb-repeater-index]");
        if (indexEl) {
          indexEl.textContent = String(index + 1);
        }

        // Set attributes from templates (MVC-friendly)
        item.querySelectorAll("[data-bb-name]").forEach((el) => {
          const tpl = el.getAttribute("data-bb-name");
          el.setAttribute("name", replaceIndex(tpl, index));
        });

        item.querySelectorAll("[data-bb-id]").forEach((el) => {
          const tpl = el.getAttribute("data-bb-id");
          el.setAttribute("id", replaceIndex(tpl, index));
        });

        item.querySelectorAll("[data-bb-for]").forEach((el) => {
          const tpl = el.getAttribute("data-bb-for");
          el.setAttribute("for", replaceIndex(tpl, index));
        });
      };

      const renumber = (listEl) => {
        const items = listEl.querySelectorAll("[data-bb-repeater-item]");
        items.forEach((item, i) => {
          applyIndexToItem(item, i);
        });
      };

      const dispatchAdded = (repeaterEl, itemEl) => {
        const ev = new CustomEvent("bb.repeater.added", {
          bubbles: true,
          detail: {
            repeater: repeaterEl,
            item: itemEl
          }
        });
        repeaterEl.dispatchEvent(ev);
      };

      const initRepeater = (repeaterEl) => {
        const listEl = repeaterEl.querySelector("[data-bb-repeater-list]");
        const tplEl = repeaterEl.querySelector("template[data-bb-repeater-template]");
        const createBtn = repeaterEl.querySelector("[data-bb-repeater-create]");

        if (!listEl || !tplEl || !createBtn) {
          return;
        }

        const createItem = () => {
          const fragment = tplEl.content.cloneNode(true);
          const item = fragment.querySelector("[data-bb-repeater-item]");
          if (!item) {
            return;
          }

          listEl.appendChild(fragment);

          const itemsNow = listEl.querySelectorAll("[data-bb-repeater-item]");
          const newItem = itemsNow[itemsNow.length - 1];

          newItem.classList.add("bb-is-entering");
          window.setTimeout(() => {
            newItem.classList.remove("bb-is-entering");
          }, 200);

          // Wire delete
          newItem.querySelectorAll("[data-bb-repeater-delete]").forEach((btn) => {
            btn.addEventListener("click", () => {
              newItem.remove();
              renumber(listEl);
            });
          });

          renumber(listEl);
          dispatchAdded(repeaterEl, newItem);
        };

        createBtn.addEventListener("click", () => {
          createItem();
        });

        // Default: start with 1 row
        createItem();
      };

      repeaters.forEach((repeater) => {
        initRepeater(repeater);
      });

      // Example hook: vendor re-init simulation
      document.addEventListener("bb.repeater.added", (e) => {
        // burada istersen select2/flatpickr/tagify init edersin:
        // e.detail.item.querySelectorAll('[data-bb-repeater-hook="select2"]')...
        // Şimdilik sadece hook hazır.
      });
    })();
