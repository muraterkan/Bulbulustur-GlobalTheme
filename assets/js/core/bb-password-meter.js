(function () {
      "use strict";

      var instances = new WeakMap();

      function hasUppercase(s) { return /[A-Z]/.test(s); }
      function hasLowercase(s) { return /[a-z]/.test(s); }
      function hasDigit(s) { return /[0-9]/.test(s); }
      function hasSpecial(s) { return /[^A-Za-z0-9]/.test(s); }

      function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
      }

      function scorePassword(value, options) {
        var v = value || "";
        if (v.length === 0) {
          return 0;
        }

        var minLength = options.minLength;
        var lengthScore = 0;

        if (v.length < minLength) {
          lengthScore = (v.length / minLength) * 30;
        } else {
          lengthScore = 30 + clamp((v.length - minLength) * 2, 0, 20);
        }

        var variety = 0;
        if (!options.checkUppercase || hasUppercase(v)) { variety += 1; }
        if (!options.checkLowercase || hasLowercase(v)) { variety += 1; }
        if (!options.checkDigit || hasDigit(v)) { variety += 1; }
        if (!options.checkChar || hasSpecial(v)) { variety += 1; }

        var varietyScore = (variety / 4) * 50;
        var total = clamp(Math.round(lengthScore + varietyScore), 0, 100);

        return total;
      }

      function BBPasswordMeter(element, opts) {
        this.el = element;

        this.options = Object.assign({
          minLength: 8,
          checkUppercase: true,
          checkLowercase: true,
          checkDigit: true,
          checkChar: true,
          scoreHighlightClass: "is-active"
        }, (opts || {}));

        this.input = this.el.querySelector("input[type='password'], input[type='text']");
        this.toggle = this.el.querySelector("[data-bb-password-meter-control='visibility']");
        this.meter = this.el.querySelector("[data-bb-password-meter-control='highlight']");
        this.bars = this.meter ? Array.prototype.slice.call(this.meter.querySelectorAll(".bb-password-meter__bar")) : [];
        this.scoreText = this.el.querySelector("[data-bb-password-meter-score]");

        this._bind();
        this.reset();
      }

      BBPasswordMeter.prototype._bind = function () {
        var self = this;

        if (self.input) {
          self.input.addEventListner("input", function () {
            self.check();
          });
          self.input.addEventListner("blur", function () {
            self.check();
          });
        }

        if (self.toggle) {
          self.toggle.addEventListner("click", function () {
            self._toggleVisibility();
          });
        }
      };

      BBPasswordMeter.prototype._toggleVisibility = function () {
        if (!this.input) {
          return;
        }

        var isPassword = this.input.type === "password";
        this.input.type = isPassword ? "text" : "password";

        var iconOff = this.toggle.querySelector("[data-bb-icon='off']");
        var iconOn = this.toggle.querySelector("[data-bb-icon='on']");

        if (iconOff && iconOn) {
          iconOff.classList.toggle("d-none", isPassword);
          iconOn.classList.toggle("d-none", !isPassword);
        }

        this.toggle.setAttribute("aria-pressed", isPassword ? "true" : "false");
        this.toggle.setAttribute("aria-label", isPassword ? "Şifreyi gizle" : "Şifreyi göster");
      };

      BBPasswordMeter.prototype._setState = function (state) {
        this.el.classList.remove("is-weak", "is-medium", "is-good", "is-strong");
        if (state) { this.el.classList.add(state); }
      };

      BBPasswordMeter.prototype._setBars = function (activeCount) {
        var cls = this.options.scoreHighlightClass;
        for (var i = 0; i < this.bars.length; i++) {
          if (i < activeCount) { this.bars[i].classList.add(cls); }
          else { this.bars[i].classList.remove(cls); }
        }
      };

      BBPasswordMeter.prototype.check = function () {
        var value = this.input ? this.input.value : "";
        var score = scorePassword(value, this.options);

        var active = 0;
        var state = null;
        var label = "";

        if (score === 0) { active = 0; state = null; label = "—"; }
        else if (score < 35) { active = 1; state = "is-weak"; label = "Weak"; }
        else if (score < 60) { active = 2; state = "is-medium"; label = "Medium"; }
        else if (score < 80) { active = 3; state = "is-good"; label = "Good"; }
        else { active = 4; state = "is-strong"; label = "Strong"; }

        this._setState(state);
        this._setBars(active);

        if (this.meter) { this.meter.setAttribute("aria-valuenow", String(score)); }
        if (this.scoreText) { this.scoreText.textContent = label; }

        return score;
      };

      BBPasswordMeter.prototype.reset = function () {
        this._setState(null);
        this._setBars(0);
        if (this.meter) { this.meter.setAttribute("aria-valuenow", "0"); }
        if (this.scoreText) { this.scoreText.textContent = ""; }
      };

      BBPasswordMeter.createInstances = function (selector) {
        var sel = selector || "[data-bb-password-meter='true']";
        var nodes = document.querySelectorAll(sel);

        nodes.forEach(function (el) {
          if (!instances.has(el)) {
            instances.set(el, new BBPasswordMeter(el, {}));
          }
        });
      };

      window.BBPasswordMeter = BBPasswordMeter;

      BBPasswordMeter.createInstances();
    })();
