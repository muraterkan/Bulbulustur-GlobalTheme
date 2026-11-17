/* Bulbulustur Theme — Tiny Slider family */

(function () {
      "use strict";

      function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
      }

      function initTinySlider(root) {
        var track = root.querySelector('[data-bb-track]');
        var slides = Array.prototype.slice.call(root.querySelectorAll('.bb-ts-slide'));
        var btnPrev = root.querySelector('[data-bb-prev]');
        var btnNext = root.querySelector('[data-bb-next]');
        var nav = root.querySelector('[data-bb-nav]');

        if (!track || slides.length === 0) {
          return;
        }

        var state = { index: 0 };

        // Build dots
        nav.innerHTML = '';
        slides.forEach(function (_, i) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'bb-ts-dot';
          dot.setAttribute('aria-label', 'Slide ' + (i + 1));
          dot.addEventListener('click', function () {
            goTo(i);
          });
          nav.appendChild(dot);
        });

        function slideWidth() {
          // İlk slide'ın gerçek genişliği + gap’i yaklaşık yakalamak için offset baz alıyoruz
          return slides[0].getBoundingClientRect().width;
        }

        function gapWidth() {
          // gap’i computed style’dan çekiyoruz (px)
          var cs = window.getComputedStyle(track);
          var gap = cs.columnGap || cs.gap || '0px';
          return parseFloat(gap) || 0;
        }

        function setActiveDot(i) {
          var dots = nav.querySelectorAll('.bb-ts-dot');
          dots.forEach(function (d, idx) {
            if (idx === i) {
              d.classList.add('is-active');
            } else {
              d.classList.remove('is-active');
            }
          });
        }

        function updateButtons() {
          if (btnPrev) btnPrev.disabled = (state.index <= 0);
          if (btnNext) btnNext.disabled = (state.index >= slides.length - 1);
        }

        function goTo(i) {
          state.index = clamp(i, 0, slides.length - 1);

          var x = state.index * (slideWidth() + gapWidth());
          track.scrollTo({ left: x, behavior: 'smooth' });

          setActiveDot(state.index);
          updateButtons();
        }

        // Click controls
        if (btnPrev) {
          btnPrev.addEventListener('click', function () { goTo(state.index - 1); });
        }
        if (btnNext) {
          btnNext.addEventListener('click', function () { goTo(state.index + 1); });
        }

        // Active state by scroll (light)
        var ticking = false;
        track.addEventListener('scroll', function () {
          if (ticking) return;
          ticking = true;

          window.requestAnimationFrame(function () {
            ticking = false;

            var w = slideWidth() + gapWidth();
            if (w <= 0) return;

            var i = Math.round(track.scrollLeft / w);
            i = clamp(i, 0, slides.length - 1);

            if (i !== state.index) {
              state.index = i;
              setActiveDot(state.index);
              updateButtons();
            }
          });
        });

        // Init
        goTo(0);

        // Recalc on resize
        window.addEventListener('resize', function () {
          goTo(state.index);
        });
      }

      document.querySelectorAll('[data-bb-slider]').forEach(function (el) {
        initTinySlider(el);
      });

      // Demo: item count buttons
      var slider = document.querySelector('[data-bb-slider]');
      if (slider) {
        document.getElementById('btnItems1').addEventListener('click', function () {
          slider.setAttribute('data-bb-items', '1');
        });
        document.getElementById('btnItems2').addEventListener('click', function () {
          slider.setAttribute('data-bb-items', '2');
        });
        document.getElementById('btnItems3').addEventListener('click', function () {
          slider.setAttribute('data-bb-items', '3');
        });
      }
    })();

(function () {
      "use strict";

      function toBool(v) {
        return String(v).toLowerCase() === 'true';
      }

      function toInt(v, def) {
        var n = parseInt(v, 10);
        if (isNaN(n)) {
          return def;
        }
        return n;
      }

      function initAdvanced(root) {
        var track = root.querySelector('[data-bb-track]');
        var slides = Array.prototype.slice.call(root.querySelectorAll('.bb-ts-slide'));

        if (!track || slides.length === 0) {
          return;
        }

        var items = toInt(root.getAttribute('data-bb-items'), 3);
        var step = toInt(root.getAttribute('data-bb-step'), 3);
        var loop = toBool(root.getAttribute('data-bb-loop'));
        var autoplay = toBool(root.getAttribute('data-bb-autoplay'));
        var autoplayTimeout = toInt(root.getAttribute('data-bb-autoplay-timeout'), 6000);

        var state = { page: 0, timer: null };

        function gapWidth() {
          var cs = window.getComputedStyle(track);
          var gap = cs.columnGap || cs.gap || '0px';
          return parseFloat(gap) || 0;
        }

        function slideWidth() {
          return slides[0].getBoundingClientRect().width;
        }

        function pageCount() {
          return Math.max(1, Math.ceil(slides.length / items));
        }

        function maxPageIndex() {
          return pageCount() - 1;
        }

        function pageToLeft(pageIndex) {
          var w = slideWidth() + gapWidth();
          return pageIndex * items * w;
        }

        function goToPage(pageIndex) {
          var max = maxPageIndex();

          if (!loop) {
            state.page = Math.max(0, Math.min(pageIndex, max));
          } else {
            if (pageIndex < 0) {
              state.page = max;
            } else if (pageIndex > max) {
              state.page = 0;
            } else {
              state.page = pageIndex;
            }
          }

          track.scrollTo({ left: pageToLeft(state.page), behavior: 'smooth' });
        }

        function nextPage() {
          goToPage(state.page + 1);
        }

        function prevPage() {
          goToPage(state.page - 1);
        }

        function stopAutoplay() {
          if (state.timer) {
            clearInterval(state.timer);
            state.timer = null;
          }
        }

        function startAutoplay() {
          stopAutoplay();

          if (!autoplay) {
            return;
          }

          state.timer = setInterval(function () {
            nextPage();
          }, autoplayTimeout);
        }

        // External buttons (headerdaki)
        var btnPrev = document.querySelector('[data-bb-adv-prev]');
        var btnNext = document.querySelector('[data-bb-adv-next]');

        if (btnPrev) {
          btnPrev.addEventListener('click', function () {
            prevPage();
            startAutoplay();
          });
        }

        if (btnNext) {
          btnNext.addEventListener('click', function () {
            nextPage();
            startAutoplay();
          });
        }

        // Pause on hover (desktop)
        root.addEventListener('mouseenter', function () {
          stopAutoplay();
        });
        root.addEventListener('mouseleave', function () {
          startAutoplay();
        });

        // Keep state roughly in sync with scroll
        var ticking = false;
        track.addEventListener('scroll', function () {
          if (ticking) {
            return;
          }
          ticking = true;

          window.requestAnimationFrame(function () {
            ticking = false;

            var w = slideWidth() + gapWidth();
            if (w <= 0) {
              return;
            }

            var page = Math.round(track.scrollLeft / (items * w));
            var max = maxPageIndex();

            if (!loop) {
              page = Math.max(0, Math.min(page, max));
            } else {
              page = Math.max(0, Math.min(page, max));
            }

            state.page = page;
          });
        });

        // Init
        goToPage(0);
        startAutoplay();

        // Resize fix
        window.addEventListener('resize', function () {
          goToPage(state.page);
        });
      }

      document.querySelectorAll('[data-bb-slider-advanced]').forEach(function (el) {
        initAdvanced(el);
      });
    })();

(function () {
      "use strict";

      function toBool(v) {
        return String(v).toLowerCase() === 'true';
      }

      function toInt(v, def) {
        var n = parseInt(v, 10);
        if (isNaN(n)) {
          return def;
        }
        return n;
      }

      function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
      }

      function initThumbSlider(root) {
        var track = root.querySelector('[data-bb-track]');
        var slides = Array.prototype.slice.call(root.querySelectorAll('.bb-ts-slide'));
        var thumbsWrap = document.querySelector('[data-bb-thumbs]');
        var thumbs = thumbsWrap ? Array.prototype.slice.call(thumbsWrap.querySelectorAll('.bb-ts-thumb')) : [];

        if (!track || slides.length === 0 || thumbs.length === 0) {
          return;
        }

        var items = toInt(root.getAttribute('data-bb-items'), 3);
        var step = toInt(root.getAttribute('data-bb-step'), 1);
        var loop = toBool(root.getAttribute('data-bb-loop'));
        var center = toBool(root.getAttribute('data-bb-center'));
        var autoplay = toBool(root.getAttribute('data-bb-autoplay'));
        var autoplayTimeout = toInt(root.getAttribute('data-bb-autoplay-timeout'), 7000);

        var state = { index: 0, timer: null };

        function gapWidth() {
          var cs = window.getComputedStyle(track);
          var gap = cs.columnGap || cs.gap || '0px';
          return parseFloat(gap) || 0;
        }

        function slideWidth() {
          return slides[0].getBoundingClientRect().width;
        }

        function maxIndex() {
          return slides.length - 1;
        }

        function leftForIndex(i) {
          var w = slideWidth() + gapWidth();

          if (!center) {
            return i * w;
          }

          // center: aktif item ortada gibi dursun -> track left'i bir item kaydır
          // (3 items için ortalama centering: 1 item offset)
          var centerOffset = Math.floor(items / 2);
          return Math.max(0, (i - centerOffset) * w);
        }

        function setActiveThumb(i) {
          thumbs.forEach(function (t, idx) {
            if (idx === i) {
              t.classList.add('is-active');
              t.setAttribute('aria-current', 'true');
            } else {
              t.classList.remove('is-active');
              t.removeAttribute('aria-current');
            }
          });
        }

        function goToIndex(i) {
          var max = maxIndex();

          if (!loop) {
            state.index = clamp(i, 0, max);
          } else {
            if (i < 0) {
              state.index = max;
            } else if (i > max) {
              state.index = 0;
            } else {
              state.index = i;
            }
          }

          track.scrollTo({ left: leftForIndex(state.index), behavior: 'smooth' });
          setActiveThumb(state.index);
        }

        function next() {
          goToIndex(state.index + step);
        }

        function prev() {
          goToIndex(state.index - step);
        }

        function stopAutoplay() {
          if (state.timer) {
            clearInterval(state.timer);
            state.timer = null;
          }
        }

        function startAutoplay() {
          stopAutoplay();

          if (!autoplay) {
            return;
          }

          state.timer = setInterval(function () {
            next();
          }, autoplayTimeout);
        }

        // Thumb click
        thumbs.forEach(function (t, idx) {
          t.addEventListener('click', function () {
            goToIndex(idx);
            startAutoplay();
          });
        });

        // External buttons
        var btnPrev = document.querySelector('[data-bb-thumb-prev]');
        var btnNext = document.querySelector('[data-bb-thumb-next]');

        if (btnPrev) {
          btnPrev.addEventListener('click', function () {
            prev();
            startAutoplay();
          });
        }

        if (btnNext) {
          btnNext.addEventListener('click', function () {
            next();
            startAutoplay();
          });
        }

        // Pause on hover
        root.addEventListener('mouseenter', function () { stopAutoplay(); });
        root.addEventListener('mouseleave', function () { startAutoplay(); });

        // Sync on scroll (light)
        var ticking = false;
        track.addEventListener('scroll', function () {
          if (ticking) {
            return;
          }
          ticking = true;

          window.requestAnimationFrame(function () {
            ticking = false;

            var w = slideWidth() + gapWidth();
            if (w <= 0) {
              return;
            }

            // center modda leftForIndex ters hesap zor, ama yaklaşık: scrollLeft / w + centerOffset
            var approx = Math.round(track.scrollLeft / w);
            if (center) {
              approx = approx + Math.floor(items / 2);
            }

            approx = clamp(approx, 0, maxIndex());

            if (approx !== state.index) {
              state.index = approx;
              setActiveThumb(state.index);
            }
          });
        });

        // Init
        goToIndex(0);
        startAutoplay();

        window.addEventListener('resize', function () {
          goToIndex(state.index);
        });
      }

      document.querySelectorAll('[data-bb-slider-thumbs]').forEach(function (el) {
        initThumbSlider(el);
      });
    })();
