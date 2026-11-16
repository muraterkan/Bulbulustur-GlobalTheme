(function () {
        "use strict";
        function bbClamp(val, min, max) {
          return Math.max(min, Math.min(max, val));
        }
        function bbParseNumber(raw) {
          if (raw === null || raw === undefined) {
            return 0;
          }
          var str = String(raw).trim();
          str = str.replace(/\s/g, "");
          str = str.replace(/,/g, ".");
          var n = Number(str);
          if (Number.isNaN(n)) {
            return 0;
          }
          return n;
        }
        function bbFormatNumber(value, decimals, separator) {
          var fixed = value.toFixed(decimals);
          var parts = fixed.split(".");
          var intPart = parts[0];
          var decPart = parts.length > 1 ? parts[1] : "";

          if (separator && separator.length > 0) {
            intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
          }

          if (decimals > 0) {
            return intPart + "." + decPart;
          }

          return intPart;
        }

        function bbEaseOutCubic(t) {
          return 1 - Math.pow(1 - t, 3);
        }

        function bbShouldReduceMotion() {
          return (
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
          );
        }

        function bbStartCountup(el) {
          if (!el) {
            return;
          }

          if (el.dataset.bbCountupStarted === "true") {
            return;
          }

          var endValue = bbParseNumber(
            el.getAttribute("data-bb-countup-value"),
          );
          var duration = bbParseNumber(
            el.getAttribute("data-bb-countup-duration"),
          );
          var decimals = parseInt(
            el.getAttribute("data-bb-countup-decimals") || "0",
            10,
          );
          var prefix = el.getAttribute("data-bb-countup-prefix") || "";
          var suffix = el.getAttribute("data-bb-countup-suffix") || "";
          var separator = el.getAttribute("data-bb-countup-separator") || "";
          var startValue = bbParseNumber(
            el.getAttribute("data-bb-countup-start"),
          );

          decimals = Number.isNaN(decimals) ? 0 : bbClamp(decimals, 0, 6);
          duration = duration > 0 ? duration : 1000;

          if (bbShouldReduceMotion() || duration < 150) {
            el.textContent =
              prefix + bbFormatNumber(endValue, decimals, separator) + suffix;
            el.dataset.bbCountupStarted = "true";
            return;
          }

          el.dataset.bbCountupStarted = "true";

          var startTime = null;
          var from = startValue;
          var to = endValue;
          var delta = to - from;

          function tick(ts) {
            if (!startTime) {
              startTime = ts;
            }

            var elapsed = ts - startTime;
            var t = bbClamp(elapsed / duration, 0, 1);
            var eased = bbEaseOutCubic(t);

            var current = from + delta * eased;
            el.textContent =
              prefix + bbFormatNumber(current, decimals, separator) + suffix;

            if (t < 1) {
              window.requestAnimationFrame(tick);
            } else {
              el.textContent =
                prefix + bbFormatNumber(to, decimals, separator) + suffix;
            }
          }

          window.requestAnimationFrame(tick);
        }

        function bbInitCountups(root) {
          var scope = root || document;
          var nodes = scope.querySelectorAll('[data-bb-countup="true"]');

          nodes.forEach(function (el) {
            if (!el.textContent || el.textContent.trim() === "") {
              el.textContent = "0";
            }
          });

          if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(
              function (entries) {
                entries.forEach(function (entry) {
                  if (entry.isIntersecting) {
                    bbStartCountup(entry.target);
                    io.unobserve(entry.target);
                  }
                });
              },
              { threshold: 0.35 },
            );

            nodes.forEach(function (el) {
              io.observe(el);
            });
          } else {
            nodes.forEach(function (el) {
              bbStartCountup(el);
            });
          }
        }

        function bbRestartIn(scopeEl) {
          if (!scopeEl) {
            return;
          }

          var nodes = scopeEl.querySelectorAll('[data-bb-countup="true"]');
          nodes.forEach(function (el) {
            el.dataset.bbCountupStarted = "false";
            el.textContent = "0";
          });

          // restart immediately (no need to wait IO for demo)
          nodes.forEach(function (el) {
            bbStartCountup(el);
          });
        }

        document.addEventListener("shown.bs.tab", function (ev) {
          var trigger = ev.target;
          if (!trigger) {
            return;
          }
          if (trigger.getAttribute("data-bb-countup-tabs") !== "true") {
            return;
          }

          var targetSel =
            trigger.getAttribute("href") ||
            trigger.getAttribute("data-bs-target");
          if (!targetSel) {
            return;
          }

          var pane = document.querySelector(targetSel);
          if (!pane) {
            return;
          }

          var nodes = pane.querySelectorAll('[data-bb-countup="true"]');
          nodes.forEach(function (el) {
            bbStartCountup(el);
          });
        });

        document.addEventListener("DOMContentLoaded", function () {
          bbInitCountups(document);

          // demo restart buttons
          var b1 = document.getElementById("bbCountUpRestart1");
          var b2 = document.getElementById("bbCountUpRestart2");
          var b3 = document.getElementById("bbCountUpRestart3");

          if (b1) {
            b1.addEventListener("click", function () {
              bbRestartIn(document.getElementById("bb_countup_tab_1"));
            });
          }
          if (b2) {
            b2.addEventListener("click", function () {
              bbRestartIn(document.getElementById("bb_countup_tab_2"));
            });
          }
          if (b3) {
            b3.addEventListener("click", function () {
              bbRestartIn(document.getElementById("bb_countup_tab_3"));
            });
          }
        });

        window.BBCountUp = {
          init: bbInitCountups,
          start: bbStartCountup,
        };
      })();
