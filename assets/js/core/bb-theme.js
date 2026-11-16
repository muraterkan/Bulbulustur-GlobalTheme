window.BBTheme = {
  getVar(name, el = document.documentElement) {
    return getComputedStyle(el).getPropertyValue(name).trim();
  }
};
