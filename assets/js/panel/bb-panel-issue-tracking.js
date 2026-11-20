(function () {
  "use strict";

  if (!document.querySelector(".bb-panel-issue-tracking")) return;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  const STORAGE_KEY = "bb_issue_tracking_tasks_v1";

  const STAGES = [
    { id: "open", label: "1. Open", stageClass: "" },
    { id: "triage", label: "2. Triage", stageClass: "is-stage-triage" },
    { id: "in-progress", label: "3. In Progress", stageClass: "" },
    { id: "need-info", label: "4. Need Info", stageClass: "is-stage-need-info" },
    { id: "testing", label: "5. Testing", stageClass: "is-stage-testing" },
    { id: "done", label: "6. Done", stageClass: "is-stage-done" }
  ];

  const DEFAULT_TASKS = [
    { id: "BUG-421", stage: "open", module: "Access", moduleTone: "neutral", priority: "P1", status: "Queued", title: "User permissions block account switching", assignee: "Nora Lee", date: "Today", progress: 12 },
    { id: "BUG-426", stage: "open", module: "Forms", moduleTone: "danger", priority: "P2", status: "At risk", title: "Forms submit duplicate confirmation emails", assignee: "Omar Vale", date: "Apr 26", progress: 26 },
    { id: "BUG-438", stage: "triage", module: "Auth", moduleTone: "danger", priority: "P0", status: "Blocked", title: "Login button does not redirect from invite links", assignee: "Mia Hart", date: "Today", progress: 8 },
    { id: "BUG-445", stage: "triage", module: "API", moduleTone: "warning", priority: "P1", status: "At risk", title: "API integration returns incorrect totals", assignee: "Eli Stone", date: "Apr 25", progress: 42 },
    { id: "BUG-449", stage: "triage", module: "Import", moduleTone: "warning", priority: "P1", status: "At risk", title: "Import wizard skips validation errors", assignee: "Ari Blake", date: "Apr 26", progress: 31 },
    { id: "BUG-452", stage: "in-progress", module: "UI", moduleTone: "neutral", priority: "P2", status: "On track", title: "Button text truncates when zoomed in", assignee: "Kai Chen", date: "Apr 27", progress: 58 },
    { id: "BUG-459", stage: "in-progress", module: "Nav", moduleTone: "neutral", priority: "P2", status: "On track", title: "Navigation menu renders inconsistent font sizes", assignee: "Rae Kim", date: "Apr 29", progress: 66 },
    { id: "BUG-467", stage: "need-info", module: "Mobile", moduleTone: "danger", priority: "P0", status: "Blocked", title: "Mobile app crashes when opening report history", assignee: "Lina Ford", date: "Waiting", progress: null },
    { id: "BUG-472", stage: "need-info", module: "Export", moduleTone: "warning", priority: "P1", status: "At risk", title: "Data export creates broken report links", assignee: "Theo West", date: "Apr 28", progress: 34 },
    { id: "BUG-475", stage: "need-info", module: "CSV", moduleTone: "warning", priority: "P1", status: "Blocked", title: "CSV upload fails for localized number formats", assignee: "Tara Quinn", date: "Waiting", progress: null },
    { id: "BUG-486", stage: "testing", module: "Sync", moduleTone: "info", priority: "P1", status: "On track", title: "Mobile app is not syncing with web app", assignee: "Iris Fox", date: "Today", progress: 82 },
    { id: "BUG-488", stage: "testing", module: "Billing", moduleTone: "neutral", priority: "P2", status: "On track", title: "Regression suite misses billing plan changes", assignee: "Sam Reed", date: "Apr 26", progress: 74 },
    { id: "BUG-490", stage: "done", module: "QA", moduleTone: "success", priority: "P3", status: "On track", title: "Setup regression checklist before release", assignee: "Milo Sa...", date: "Apr 23", progress: 100 },
    { id: "BUG-492", stage: "done", module: "Docs", moduleTone: "success", priority: "P3", status: "On track", title: "Archive stale browser compatibility notes", assignee: "Dina Cr...", date: "Apr 24", progress: 100 }
  ];

  const MODULE_TONES = {
    Access: "neutral",
    Forms: "danger",
    Auth: "danger",
    API: "warning",
    Import: "warning",
    UI: "neutral",
    Nav: "neutral",
    Mobile: "danger",
    Export: "warning",
    CSV: "warning",
    Sync: "info",
    Billing: "neutral",
    QA: "success",
    Docs: "success"
  };

  let tasks = loadTasks();
  let newlyCreatedId = null;
  let draggedTaskId = null;

  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((task) =>
          task && ["id", "module", "priority", "status", "title", "assignee", "date"].every((key) => typeof task[key] === "string") &&
          STAGES.some((stage) => stage.id === task.stage)
        )) return parsed;
      }
    } catch (_) {}
    return structuredClone(DEFAULT_TASKS);
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (_) {}
  }

  function getStatusTone(status) {
    if (status === "On track") return "bb-chip-success-soft";
    if (status === "At risk") return "bb-chip-warning-soft";
    if (status === "Blocked") return "bb-chip-danger-soft";
    return "";
  }

  function getRingTone(progress, status) {
    if (progress === null || progress === undefined) return "is-muted";
    if (progress >= 80 || status === "On track") return "is-success";
    if (status === "Blocked") return "is-danger";
    return "";
  }

  function getInitials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  function buildProgressRing(progress, status) {
    const hasPct = typeof progress === "number";
    const pct = hasPct ? Math.max(0, Math.min(100, progress)) : 0;
    const circumference = 50.26;
    const filled = ((pct / 100) * circumference).toFixed(2);
    const toneClass = getRingTone(progress, status);

    return `
      <span class="bb-it-ring-wrap">
        <svg class="bb-it-ring" viewBox="0 0 20 20" aria-hidden="true">
          <circle class="bb-it-ring-track" cx="10" cy="10" r="8"></circle>
          <circle class="bb-it-ring-val ${toneClass}" cx="10" cy="10" r="8" stroke-dasharray="${filled} ${circumference}"></circle>
        </svg>
        <span>${hasPct ? `${pct}%` : "-"}</span>
      </span>
    `;
  }

  function renderCard(task) {
    const isDone = task.stage === "done";
    const isNew = task.id === newlyCreatedId;
    const modClass = ["danger", "warning", "success", "info"].includes(task.moduleTone) ? `bb-chip-${task.moduleTone}-soft` : "";
    const statusClass = getStatusTone(task.status);

    return `
      <article class="bb-card bb-card-body bb-it-card ${isDone ? "is-done" : ""} ${isNew ? "is-just-created" : ""}" draggable="true" data-task-id="${escapeHtml(task.id)}">
        <div class="bb-it-card-top">
          <div class="bb-it-meta-left">
            <span class="bb-chip bb-chip-sm ${modClass}">${escapeHtml(task.module)}</span>
            <span class="bb-it-key">${escapeHtml(task.id)}</span>
            <span class="bb-it-prio">${escapeHtml(task.priority)}</span>
          </div>
          <span class="bb-chip bb-chip-sm ${statusClass}">
            <span class="bb-chip-dot" aria-hidden="true"></span>
            <span>${escapeHtml(task.status)}</span>
          </span>
        </div>

        <h3 class="bb-it-card-title">${escapeHtml(task.title)}</h3>

        <div class="bb-it-card-foot">
          <div class="bb-it-assignee">
            <span class="bb-symbol size-25 is-circle" aria-hidden="true"><span class="bb-symbol-label">${escapeHtml(getInitials(task.assignee))}</span></span>
            <span>${escapeHtml(task.assignee)}</span>
          </div>

          <div class="bb-it-foot-right">
            <span class="bb-chip bb-chip-sm">
              <span class="material-symbols-outlined bb-icon-2xs" aria-hidden="true">calendar_today</span>
              <span>${escapeHtml(task.date)}</span>
            </span>
            ${buildProgressRing(task.progress, task.status)}
          </div>
        </div>
      </article>
    `;
  }

  function renderBoard() {
    const board = document.getElementById("itBoardContainer");
    if (!board) return;

    const query = (document.getElementById("itSearchInput")?.value || "").trim().toLowerCase();
    const prioFilter = document.getElementById("itPriorityFilter")?.value || "all";
    const statusFilter = document.getElementById("itStatusFilter")?.value || "all";

    const filtered = tasks.filter((t) => {
      const matchPrio = prioFilter === "all" || t.priority === prioFilter;
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchQuery =
        !query ||
        t.id.toLowerCase().includes(query) ||
        t.title.toLowerCase().includes(query) ||
        t.assignee.toLowerCase().includes(query) ||
        t.module.toLowerCase().includes(query);
      return matchPrio && matchStatus && matchQuery;
    });

    board.innerHTML = STAGES.map((stage) => {
      const stageTasks = filtered.filter((t) => t.stage === stage.id);
      return `
        <section class="bb-card bb-it-col ${stage.stageClass}" data-stage="${stage.id}" aria-label="${stage.label}">
          <header class="bb-it-col-head">
            <div class="bb-it-col-title-wrap">
              <h2 class="bb-it-col-title">${stage.label}</h2>
              <span class="bb-chip bb-chip-sm bb-it-col-count">${stageTasks.length}</span>
            </div>
            <span class="material-symbols-outlined bb-icon-sm bb-icon-muted" aria-hidden="true">drag_indicator</span>
          </header>
          <div class="bb-it-col-body">
            ${stageTasks.map(renderCard).join("")}
          </div>
        </section>
      `;
    }).join("");

    bindDragAndDrop();
  }

  function bindDragAndDrop() {
    document.querySelectorAll(".bb-it-card").forEach((card) => {
      card.addEventListener("dragstart", () => {
        draggedTaskId = card.getAttribute("data-task-id");
      });
      card.addEventListener("dragend", () => {
        draggedTaskId = null;
        document.querySelectorAll(".bb-it-col").forEach((c) => c.classList.remove("is-drag-over"));
      });
    });

    document.querySelectorAll(".bb-it-col").forEach((col) => {
      col.addEventListener("dragover", (e) => {
        e.preventDefault();
        col.classList.add("is-drag-over");
      });
      col.addEventListener("dragleave", () => {
        col.classList.remove("is-drag-over");
      });
      col.addEventListener("drop", (e) => {
        e.preventDefault();
        col.classList.remove("is-drag-over");
        const targetStage = col.getAttribute("data-stage");
        if (!draggedTaskId || !targetStage) return;

        const item = tasks.find((t) => t.id === draggedTaskId);
        if (item && item.stage !== targetStage) {
          item.stage = targetStage;
          if (targetStage === "done") item.progress = 100;
          saveTasks();
          renderBoard();
        }
      });
    });
  }

  function getNextBugId() {
    const maxNum = tasks.reduce((max, t) => {
      const num = parseInt(t.id.replace(/\D/g, ""), 10);
      return Number.isFinite(num) && num > max ? num : max;
    }, 492);
    return `BUG-${maxNum + 1}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const dialog = document.getElementById("itNewTaskDialog");
    const form = document.getElementById("itNewTaskForm");

    document.getElementById("itOpenNewTaskBtn")?.addEventListener("click", () => {
      dialog?.showModal();
      document.getElementById("itTaskTitleInput")?.focus();
    });

    document.getElementById("itCloseDialogBtn")?.addEventListener("click", () => dialog?.close());
    document.getElementById("itCancelDialogBtn")?.addEventListener("click", () => dialog?.close());

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("itTaskTitleInput")?.value.trim();
      if (!title) return;

      const mod = document.getElementById("itTaskModuleInput")?.value || "API";
      const stage = document.getElementById("itTaskStageInput")?.value || "open";
      const priority = document.getElementById("itTaskPriorityInput")?.value || "P1";
      const status = document.getElementById("itTaskStatusInput")?.value || "Queued";
      const assignee = document.getElementById("itTaskAssigneeInput")?.value.trim() || "Nora Lee";
      const date = document.getElementById("itTaskDateInput")?.value.trim() || "Today";

      const newTask = {
        id: getNextBugId(),
        stage,
        module: mod,
        moduleTone: MODULE_TONES[mod] || "neutral",
        priority,
        status,
        title,
        assignee,
        date,
        progress: stage === "done" ? 100 : 0
      };

      // Yeni açılan task doğrudan hedef kolonun (varsayılan 1. Open) en üstüne düşer
      tasks.unshift(newTask);
      newlyCreatedId = newTask.id;
      saveTasks();
      renderBoard();

      form.reset();
      dialog?.close();

      // Pano sola kaydırılıp yeni düşen kart odaklanır
      const board = document.getElementById("itBoardContainer");
      if (board && stage === "open") board.scrollTo({ left: 0, behavior: "smooth" });
    });

    document.getElementById("itToggleFiltersBtn")?.addEventListener("click", (e) => {
      const bar = document.getElementById("itFilterBar");
      if (!bar) return;
      const isHidden = bar.hasAttribute("hidden");
      if (isHidden) {
        bar.removeAttribute("hidden");
        e.currentTarget.setAttribute("aria-expanded", "true");
      } else {
        bar.setAttribute("hidden", "");
        e.currentTarget.setAttribute("aria-expanded", "false");
      }
    });

    document.getElementById("itSearchInput")?.addEventListener("input", renderBoard);
    document.getElementById("itPriorityFilter")?.addEventListener("change", renderBoard);
    document.getElementById("itStatusFilter")?.addEventListener("change", renderBoard);

    document.getElementById("itResetBoardBtn")?.addEventListener("click", () => {
      tasks = structuredClone(DEFAULT_TASKS);
      newlyCreatedId = null;
      saveTasks();
      renderBoard();
    });

    document.getElementById("itShareBtn")?.addEventListener("click", () => {
      const label = document.getElementById("itShareLabel");
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      if (label) {
        label.textContent = "Copied";
        setTimeout(() => { label.textContent = "Share"; }, 1600);
      }
    });

    renderBoard();
  });
})();