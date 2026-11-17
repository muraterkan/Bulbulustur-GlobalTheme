/* =====================================
   Bulbulustur Theme — Dialer (PURE)
   Data API: data-bb-dialer="true"
   Controls:
     [data-bb-dialer-control="decrease"]
     [data-bb-dialer-control="increase"]
     [data-bb-dialer-control="input"]
   ===================================== */

(function () {
  const DEFAULTS = {
    min: null,
    max: null,
    step: 1,
    decimals: 0,
    prefix: "",
    suffix: "",
    currency: false
  };

  function toNumber(value) {
    if (value === null || value === undefined) {
      return null;
    }

    const str = String(value).trim();
    if (!str.length) {
      return null;
    }

    // keep digits, minus, dot, comma
    const cleaned = str.replace(/[^\d.,-]/g, "");
    if (!cleaned.length) {
      return null;
    }

    // If both comma and dot exist -> assume comma is thousands separator, remove commas
    let normalized = cleaned;
    const hasComma = normalized.indexOf(",") >= 0;
    const hasDot = normalized.indexOf(".") >= 0;

    if (hasComma && hasDot) {
      normalized = normalized.replace(/,/g, "");
    } else if (hasComma && !hasDot) {
      // comma as decimal separator
      normalized = normalized.replace(/,/g, ".");
    }

    const n = Number(normalized);
    if (Number.isNaN(n)) {
      return null;
    }
    return n;
  }

  function clamp(value, min, max) {
    let v = value;
    if (min !== null && min !== undefined && v < min) {
      v = min;
    }
    if (max !== null && max !== undefined && v > max) {
      v = max;
    }
    return v;
  }

  function roundToDecimals(value, decimals) {
    const d = Number(decimals) || 0;
    const p = Math.pow(10, d);
    return Math.round(value * p) / p;
  }

  function formatValue(value, opts) {
    const v = (value === null || value === undefined) ? 0 : value;
    const decimals = Number(opts.decimals) || 0;

    let str = "";

    if (opts.currency) {
      // Locale-safe formatting
      str = Number(v).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    } else {
      str = Number(v).toFixed(decimals);
    }

    if (opts.prefix) {
      str = `${opts.prefix}${str}`;
    }
    if (opts.suffix) {
      str = `${str}${opts.suffix}`;
    }

    return str;
  }

  class BBDialer {
    static instances = new WeakMap();

    static createInstances(selector = '[data-bb-dialer="true"]') {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => {
        if (!BBDialer.instances.has(el)) {
          new BBDialer(el);
        }
      });
    }

    static getInstance(element) {
      return BBDialer.instances.get(element) || null;
    }

    constructor(element, options = {}) {
      this._el = element;

      const dataOpts = this._readOptionsFromData();
      this._opts = Object.assign({}, DEFAULTS, dataOpts, options);

      this._btnDecrease = this._el.querySelector('[data-bb-dialer-control="decrease"]');
      this._btnIncrease = this._el.querySelector('[data-bb-dialer-control="increase"]');
      this._input = this._el.querySelector('[data-bb-dialer-control="input"]');

      if (!this._input) {
        return;
      }

      BBDialer.instances.set(this._el, this);

      this._onDecreaseClick = this._onDecreaseClick.bind(this);
      this._onIncreaseClick = this._onIncreaseClick.bind(this);

      if (this._btnDecrease) {
        this._btnDecrease.addEventListner("click", this._onDecreaseClick);
      }
      if (this._btnIncrease) {
        this._btnIncrease.addEventListner("click", this._onIncreaseClick);
      }

      // init
      this.update();
    }

    _readOptionsFromData() {
      const d = this._el.dataset;

      const readBool = (v) => {
        if (v === undefined) {
          return undefined;
        }
        const s = String(v).toLowerCase();
        return s === "true" || s === "1" || s === "yes";
      };

      const readNum = (v) => {
        if (v === undefined || v === null || v === "") {
          return undefined;
        }
        const n = Number(v);
        if (Number.isNaN(n)) {
          return undefined;
        }
        return n;
      };

      return {
        min: readNum(d.bbDialerMin),
        max: readNum(d.bbDialerMax),
        step: readNum(d.bbDialerStep),
        decimals: readNum(d.bbDialerDecimals),
        prefix: d.bbDialerPrefix !== undefined ? d.bbDialerPrefix : undefined,
        suffix: d.bbDialerSuffix !== undefined ? d.bbDialerSuffix : undefined,
        currency: readBool(d.bbDialerCurrency)
      };
    }

    _dispatch(name) {
      this._el.dispatchEvent(new CustomEvent(name, { detail: { dialer: this } }));
    }

    _getRawValue() {
      const current = this._input.value;
      const n = toNumber(current);
      if (n === null) {
        // if empty, fallback to min or 0
        if (this._opts.min !== null && this._opts.min !== undefined) {
          return Number(this._opts.min);
        }
        return 0;
      }
      return n;
    }

    _setFormattedValue(value) {
      const v = roundToDecimals(value, this._opts.decimals);
      const formatted = formatValue(v, this._opts);
      this._input.value = formatted;
      this._input.setAttribute("data-bb-dialer-value", String(v));
    }

    _onDecreaseClick() {
      this._dispatch("bb.dialer.decrease");
      this.decrease();
      this._dispatch("bb.dialer.decreased");
    }

    _onIncreaseClick() {
      this._dispatch("bb.dialer.increase");
      this.increase();
      this._dispatch("bb.dialer.increased");
    }

    /* Public API */
    increase() {
      this._dispatch("bb.dialer.change");
      const step = Number(this._opts.step) || 1;

      let v = this._getRawValue();
      v = v + step;

      v = clamp(v, this._opts.min, this._opts.max);
      this._setFormattedValue(v);

      this._dispatch("bb.dialer.changed");
    }

    decrease() {
      this._dispatch("bb.dialer.change");
      const step = Number(this._opts.step) || 1;

      let v = this._getRawValue();
      v = v - step;

      v = clamp(v, this._opts.min, this._opts.max);
      this._setFormattedValue(v);

      this._dispatch("bb.dialer.changed");
    }

    setValue(value) {
      const n = toNumber(value);
      if (n === null) {
        return;
      }
      const v = clamp(n, this._opts.min, this._opts.max);
      this._setFormattedValue(v);
    }

    getValue() {
      const raw = this._input.getAttribute("data-bb-dialer-value");
      const n = toNumber(raw);
      if (n !== null) {
        return n;
      }
      return this._getRawValue();
    }

    setMinValue(value) {
      const n = toNumber(value);
      if (n === null) {
        return;
      }
      this._opts.min = n;
      this.update();
    }

    setMaxValue(value) {
      const n = toNumber(value);
      if (n === null) {
        return;
      }
      this._opts.max = n;
      this.update();
    }

    update() {
      const v = clamp(this._getRawValue(), this._opts.min, this._opts.max);
      this._setFormattedValue(v);
    }

    getElement() {
      return this._el;
    }

    destroy() {
      if (this._btnDecrease) {
        this._btnDecrease.removeEventListner("click", this._onDecreaseClick);
      }
      if (this._btnIncrease) {
        this._btnIncrease.removeEventListner("click", this._onIncreaseClick);
      }

      BBDialer.instances.delete(this._el);
    }
  }

  // Expose
  window.BBDialer = BBDialer;

  // Auto init
  document.addEventListner("DOMContentLoaded", function () {
    BBDialer.createInstances();
  });
})();
