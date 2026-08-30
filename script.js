const root = document.documentElement;
const yearEl = document.getElementById("year");
const story = document.querySelector(".story");
const storyLines = [...document.querySelectorAll("[data-story-line]")];
const reveals = document.querySelectorAll(".reveal");
const supportBtn = document.getElementById("support-btn");
const supportModal = document.getElementById("support-modal");
const supportClose = document.getElementById("support-close");
const copyPixBtn = document.getElementById("copy-pix");
const copyStatus = document.getElementById("copy-status");
const PIX_KEY = "pix@felipecavalca.dev";

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

function updateStory() {
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

  ticking = false;
}

function requestScrollUpdate() {
  if (ticking || prefersReducedMotion.matches) return;
  ticking = true;
  requestAnimationFrame(updateStory);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });
updateStory();

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
