/* CORE UI: Globe Lines — independent instances of a rotating golden line globe.
   Data attributes: data-bb-globe-lines, data-bb-globe-duration="38".
   Canvas 2D, no WebGL, no image files, no third-party dependencies.
   Color tokens: --bb-globe-accent, --bb-globe-accent-soft, --bb-globe-accent-deep.
*/
(function () {
  "use strict";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const globeHosts = document.querySelectorAll("[data-bb-globe-lines]");
  if (!globeHosts.length) return;

  function lineRange(start, end, interval) {
    const values = [];
    for (let n = start; n <= end + 0.001; n += interval) values.push(n);
    return values;
  }

  // The sparse grid is continuous. Uneven high-density sectors rotate with the sphere.
  const geometries = [
    {kind:"meridian",points:lineRange(-180,150,30),from:-82,to:82,step:3.5,opacity:.38,width:.9},
    {kind:"parallel",points:lineRange(-75,75,15),from:-180,to:180,step:3.5,opacity:.30,width:.75},
    {kind:"meridian",points:lineRange(-88,-15,7.3),from:-75,to:72,step:2.8,opacity:.48,width:.72},
    {kind:"meridian",points:lineRange(70,116,7.6),from:-64,to:63,step:2.8,opacity:.39,width:.65},
    {kind:"meridian",points:lineRange(-72,-26,3.9),from:-44,to:43,step:2.7,opacity:.68,width:.73,glow:true},
    {kind:"parallel",points:lineRange(-43,40,5.4),from:-92,to:-13,step:2.5,opacity:.57,width:.70},
    {kind:"parallel",points:lineRange(-25,24,6.1),from:73,to:136,step:2.5,opacity:.48,width:.65},
    {kind:"parallel",points:lineRange(49,68,6.3),from:-70,to:4,step:2.5,opacity:.29,width:.65}
  ];

  globeHosts.forEach(function (host) {
    const canvas = host.querySelector("[data-bb-globe-lines-canvas]");
    if (!canvas || typeof canvas.getContext !== "function") return;
    const ctx = canvas.getContext("2d", {alpha:true});
    if (!ctx) return;
    const button = host.querySelector("[data-bb-globe-toggle]");
    const buttonIcon = button && button.querySelector(".material-symbols-outlined");
    const duration = Number(host.getAttribute("data-bb-globe-duration"));
    const seconds = Number.isFinite(duration) && duration >= 10 && duration <= 180 ? duration : 38;
    let width = 1;
    let height = 1;
    let radius = 1;
    let angle = .25;
    let currentFrame = null;
    let lastTime = null;
    let inView = true;
    let userPaused = false;
    let colors = null;

    function readColors() {
      const styles = window.getComputedStyle(host);
      const rootStyles = window.getComputedStyle(document.documentElement);
      const token = (name, fallback) =>
        styles.getPropertyValue(name).trim() ||
        rootStyles.getPropertyValue(fallback || name).trim();
      colors = {
        main: token("--bb-globe-accent","--bb-brand-yellow"),
        bright: token("--bb-globe-accent-soft","--bb-yellow-300"),
        deep: token("--bb-globe-accent-deep","--bb-yellow-700")
      };
    }

    function point(latitude, longitude, spin) {
      const lat = latitude * DEG;
      const lon = longitude * DEG;
      const clat = Math.cos(lat);
      const x = clat * Math.sin(lon);
      const y = Math.sin(lat);
      const z = clat * Math.cos(lon);

      // A real orthographic sphere: rotate about its polar axis, then tilt and roll.
      const ca = Math.cos(spin), sa = Math.sin(spin);
      const xr = x * ca + z * sa;
      const zr = z * ca - x * sa;
      const tilt = -.27, roll = -.13;
      const yt = y * Math.cos(tilt) - zr * Math.sin(tilt);
      const depth = y * Math.sin(tilt) + zr * Math.cos(tilt);
      const xx = xr * Math.cos(roll) - yt * Math.sin(roll);
      const yy = xr * Math.sin(roll) + yt * Math.cos(roll);
      return {
        x: width / 2 + xx * radius,
        y: height / 2 - yy * radius,
        depth: depth
      };
    }

    function trace(shape, at, front, tint, opacity, thickness, glow) {
      ctx.beginPath();
      let started = false;
      let hasSegments = false;
      const end = shape.to;
      for (let v = shape.from; v <= end + shape.step / 2; v += shape.step) {
        const value = Math.min(v,end);
        const p = shape.kind === "meridian" ? point(value,at,angle) : point(at,value,angle);
        const visible = front ? p.depth >= 0 : p.depth < 0;
        if (!visible) {
          started = false;
          continue;
        }
        if (!started) {
          ctx.moveTo(p.x,p.y);
          started = true;
        } else {
          ctx.lineTo(p.x,p.y);
          hasSegments = true;
        }
      }
      if (!hasSegments) return;
      ctx.globalAlpha = front ? opacity : opacity * .16;
      ctx.lineWidth = thickness;
      ctx.strokeStyle = front ? (glow ? colors.bright : colors.main) : colors.deep;
      if (front && glow) {
        ctx.shadowColor = colors.main;
        ctx.shadowBlur = radius * .014;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
    }

    function drawPoints() {
      // Small lit crossings add detail without making the sphere a uniform dot cloud.
      ctx.shadowBlur = 0;
      for (let lat = -58;lat <= 60;lat += 13) {
        for (let lon = -180;lon < 180;lon += 15) {
          const p = point(lat,lon,angle);
          if (p.depth < .05) continue;
          const density = (lon > -95 && lon < -18 && lat > -45 && lat < 45);
          if (!density && ((Math.round((lat + lon) / 13) % 3) !== 0)) continue;
          ctx.beginPath();
          ctx.arc(p.x,p.y,density ? .95 : .64,0,TAU);
          ctx.fillStyle = density ? colors.bright : colors.main;
          ctx.globalAlpha = (density ? .58 : .32) * (.55 + p.depth * .45);
          ctx.fill();
        }
      }
    }

    function draw() {
      if (!width || !height || !colors.main) return;
      ctx.clearRect(0,0,width,height);
      ctx.save();

      // Atmospheric halo and faint outline; back hemisphere is drawn first.
      ctx.beginPath();
      ctx.arc(width/2,height/2,radius,0,TAU);
      ctx.lineWidth = radius * .013;
      ctx.strokeStyle = colors.main;
      ctx.globalAlpha = .13;
      ctx.shadowColor = colors.main;
      ctx.shadowBlur = radius * .095;
      ctx.stroke();
      ctx.shadowBlur = 0;

      for (const geometry of geometries) {
        for (const n of geometry.points) trace(geometry,n,false,colors.deep,
          geometry.opacity,geometry.width,false);
      }
      for (const geometry of geometries) {
        for (const n of geometry.points) trace(geometry,n,true,colors.main,
          geometry.opacity,geometry.width,Boolean(geometry.glow));
      }
      drawPoints();

      // A restrained highlight at the leading limb keeps the silhouette rounded.
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(width/2,height/2,radius,Math.PI*.10,Math.PI*.68);
      ctx.strokeStyle = colors.bright;
      ctx.lineWidth = radius * .003;
      ctx.globalAlpha = .22;
      ctx.stroke();

      ctx.restore();
    }

    function resize() {
      const rect = host.getBoundingClientRect();
      width = Math.max(1,Math.round(rect.width));
      height = Math.max(1,Math.round(rect.height));
      const scale = Math.min(window.devicePixelRatio || 1,2);
      canvas.width = Math.max(1,Math.round(width * scale));
      canvas.height = Math.max(1,Math.round(height * scale));
      ctx.setTransform(scale,0,0,scale,0,0);
      radius = Math.min(width * .365,height * .445);
      readColors();
      draw();
    }

    function canAnimate() {
      return !userPaused && !prefersReduced.matches && inView && !document.hidden;
    }

    function updateControl() {
      if (!button) return;
      const paused = userPaused || prefersReduced.matches;
      button.disabled = prefersReduced.matches;
      button.setAttribute("aria-pressed",String(!paused));
      button.setAttribute("aria-label",paused ? "Dünya dönüşünü başlat" : "Dünya dönüşünü durdur");
      if (buttonIcon) buttonIcon.textContent = paused ? "play_arrow" : "pause";
      const label = button.querySelector("[data-bb-globe-toggle-label]");
      if (label) label.textContent = paused ? "Döndür" : "Duraklat";
    }

    function tick(time) {
      currentFrame = null;
      if (!canAnimate()) {
        lastTime = null;
        return;
      }
      if (lastTime !== null) {
        const elapsed = Math.min(Math.max(time - lastTime,0),80);
        angle = (angle + elapsed * TAU / (seconds * 1000)) % TAU;
      }
      lastTime = time;
      draw();
      currentFrame = window.requestAnimationFrame(tick);
    }

    function updatePlayback() {
      updateControl();
      if (canAnimate()) {
        if (currentFrame === null) {
          lastTime = null;
          currentFrame = window.requestAnimationFrame(tick);
        }
      } else if (currentFrame !== null) {
        window.cancelAnimationFrame(currentFrame);
        currentFrame = null;
        lastTime = null;
      }
    }

    button?.addEventListener("click",function () {
      userPaused = !userPaused;
      updatePlayback();
    });

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(host);
    else window.addEventListener("resize",resize);

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(entries => {
        inView = entries[0]?.isIntersecting !== false;
        updatePlayback();
      },{threshold:.02});
      observer.observe(host);
    }
    document.addEventListener("visibilitychange",updatePlayback);
    if (prefersReduced.addEventListener) prefersReduced.addEventListener("change",updatePlayback);
    else if (prefersReduced.addListener) prefersReduced.addListener(updatePlayback);

    // Re-read the existing theme tokens when the theme selector changes.
    const themeObserver = new MutationObserver(() => {
      readColors();
      draw();
    });
    themeObserver.observe(document.documentElement,{
      attributes:true,attributeFilter:["data-bs-theme","data-bb-pack"]
    });

    resize();
    updatePlayback();
  });
})();
