const root = document.documentElement;
const yearEl = document.getElementById("year");
const story = document.querySelector(".story");
const storyLines = [...document.querySelectorAll("[data-story-line]")];
const supportBtn = document.getElementById("support-btn");
const supportModal = document.getElementById("support-modal");
const supportClose = document.getElementById("support-close");
const copyPixBtn = document.getElementById("copy-pix");
const copyStatus = document.getElementById("copy-status");
const PIX_KEY = "pix@felipecavalca.dev";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

function ensureProjectStoryStyles() {
  if (document.querySelector('link[data-project-story]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "projects-story.css";
  link.dataset.projectStory = "";
  document.head.appendChild(link);
}

ensureProjectStoryStyles();

const projects = document.querySelector(".projects");
let projectCards = [];
let projectDots = [];
let projectCurrent = null;

function setupProjectStory() {
  if (!projects || prefersReducedMotion.matches) return;

  const heading = projects.querySelector(".section-heading");
  projectCards = [...projects.querySelectorAll(".project")];
  if (!heading || projectCards.length === 0) return;

  projects.classList.add("project-story");
  projects.style.height = `${Math.max(500, projectCards.length * 115 + 80)}vh`;

  heading.classList.remove("reveal", "visible");
  projectCards.forEach((card, index) => {
    card.classList.remove("reveal", "visible");
    card.dataset.projectCard = String(index);
    card.classList.toggle("is-active", index === 0);
    card.classList.toggle("is-after", index > 0);
    card.setAttribute("aria-hidden", index === 0 ? "false" : "true");
  });

  const sticky = document.createElement("div");
  sticky.className = "projects-sticky";

  const header = document.createElement("div");
  header.className = "project-story-header";

  const status = document.createElement("div");
  status.className = "project-story-status";
  status.setAttribute("aria-hidden", "true");

  projectCurrent = document.createElement("strong");
  projectCurrent.textContent = "01";

  const separator = document.createElement("span");
  separator.textContent = "/";

  const total = document.createElement("span");
  total.textContent = String(projectCards.length).padStart(2, "0");

  const dots = document.createElement("div");
  dots.className = "project-dots";

  projectCards.forEach((_, index) => {
    const dot = document.createElement("i");
    dot.className = `project-dot${index === 0 ? " is-active" : ""}`;
    dots.appendChild(dot);
  });
  projectDots = [...dots.children];

  status.append(projectCurrent, separator, total, dots);
  header.append(heading, status);

  const stage = document.createElement("div");
  stage.className = "project-stage";
  projectCards.forEach(card => stage.appendChild(card));

  sticky.append(header, stage);
  projects.replaceChildren(sticky);
}

setupProjectStory();

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);

reveals.forEach(node => revealObserver.observe(node));

let ticking = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setProjectCardAccessibility(activeIndex) {
  projectCards.forEach((card, cardIndex) => {
    const active = cardIndex === activeIndex;
    card.setAttribute("aria-hidden", active ? "false" : "true");
    card.querySelectorAll("a, button, input, select, textarea").forEach(control => {
      if (active) control.removeAttribute("tabindex");
      else control.setAttribute("tabindex", "-1");
    });
  });
}

function updateProjects() {
  if (!projects || projectCards.length === 0) return;

  const rect = projects.getBoundingClientRect();
  const scrollable = Math.max(projects.offsetHeight - window.innerHeight, 1);
  const passed = clamp(-rect.top, 0, scrollable);
  const progress = clamp(passed / scrollable, 0, 1);
  const scaled = progress * projectCards.length;
  const activeIndex = Math.min(projectCards.length - 1, Math.floor(scaled));
  const localProgress = activeIndex === projectCards.length - 1
    ? clamp((progress - activeIndex / projectCards.length) * projectCards.length, 0, 1)
    : clamp(scaled - activeIndex, 0, 1);

  root.style.setProperty("--projects-progress", progress.toFixed(4));

  projectCards.forEach((card, index) => {
    const active = index === activeIndex;
    card.classList.toggle("is-active", active);
    card.classList.toggle("is-before", index < activeIndex);
    card.classList.toggle("is-after", index > activeIndex);
    card.style.setProperty("--project-card-progress", active ? localProgress.toFixed(4) : index < activeIndex ? "1" : "0");
  });

  setProjectCardAccessibility(activeIndex);

  if (projectCurrent) projectCurrent.textContent = String(activeIndex + 1).padStart(2, "0");
  projectDots.forEach((dot, index) => dot.classList.toggle("is-active", index === activeIndex));
}

function updateScrollScenes() {
  const scrollY = window.scrollY || 0;
  root.style.setProperty("--scroll-y", String(scrollY));

  if (story) {
    const rect = story.getBoundingClientRect();
    const scrollable = Math.max(story.offsetHeight - window.innerHeight, 1);
    const passed = clamp(-rect.top, 0, scrollable);
    const progress = clamp(passed / scrollable, 0, 1);
    root.style.setProperty("--story-progress", progress.toFixed(4));

    if (storyLines.length) {
      const index = Math.min(storyLines.length - 1, Math.floor(progress * storyLines.length));
      storyLines.forEach((line, lineIndex) => {
        line.classList.toggle("is-active", lineIndex === index);
      });
    }
  }

  updateProjects();
  ticking = false;
}

function requestScrollUpdate() {
  if (ticking || prefersReducedMotion.matches) return;
  ticking = true;
  requestAnimationFrame(updateScrollScenes);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });
updateScrollScenes();

function openSupportModal() {
  if (!supportModal) return;
  supportModal.classList.add("is-open");
  supportModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (copyStatus) copyStatus.textContent = "";
  window.setTimeout(() => supportClose?.focus(), 0);
}

function closeSupportModal() {
  if (!supportModal) return;
  supportModal.classList.remove("is-open");
  supportModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  supportBtn?.focus();
}

async function copyPixKey() {
  try {
    await navigator.clipboard.writeText(PIX_KEY);
    if (copyStatus) copyStatus.textContent = "Chave Pix copiada.";
  } catch (_error) {
    const textarea = document.createElement("textarea");
    textarea.value = PIX_KEY;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (copyStatus) copyStatus.textContent = copied ? "Chave Pix copiada." : "Copie a chave exibida acima.";
  }
}

supportBtn?.addEventListener("click", openSupportModal);
supportClose?.addEventListener("click", closeSupportModal);
copyPixBtn?.addEventListener("click", copyPixKey);

supportModal?.addEventListener("click", event => {
  if (event.target === supportModal) closeSupportModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && supportModal?.classList.contains("is-open")) {
    closeSupportModal();
  }
});
