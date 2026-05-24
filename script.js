const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);
reveals.forEach(node => observer.observe(node));

const accentPalettes = {
  light: [
    {
      shapeA: "#ff7b54",
      shapeB: "#f59e0b",
      gradA: "#ffd9ba",
      gradB: "#ffd6d6"
    },
    {
      shapeA: "#ef476f",
      shapeB: "#f4a261",
      gradA: "#ffd8e1",
      gradB: "#ffe3c4"
    },
    {
      shapeA: "#e76f51",
      shapeB: "#2a9d8f",
      gradA: "#ffd8cc",
      gradB: "#d9f4ef"
    },
    {
      shapeA: "#3a86ff",
      shapeB: "#ffbe0b",
      gradA: "#dbe9ff",
      gradB: "#fff1c7"
    }
  ],
  dark: [
    {
      shapeA: "#d85a4a",
      shapeB: "#d68b2a",
      gradA: "#1c2a3a",
      gradB: "#2f1f31"
    },
    {
      shapeA: "#c84f7a",
      shapeB: "#c07a2b",
      gradA: "#221a2f",
      gradB: "#2f2218"
    },
    {
      shapeA: "#4d7fd6",
      shapeB: "#b6732c",
      gradA: "#18273b",
      gradB: "#2a2232"
    },
    {
      shapeA: "#2f9c8f",
      shapeB: "#cf6a4f",
      gradA: "#152b2d",
      gradB: "#2d1f28"
    }
  ]
};

function applyRandomAccentPalette() {
  const isDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  const mode = isDark ? "dark" : "light";
  const palettes = accentPalettes[mode];
  const choice = palettes[Math.floor(Math.random() * palettes.length)];
  const root = document.documentElement;

  root.style.setProperty("--shape-a", choice.shapeA);
  root.style.setProperty("--shape-b", choice.shapeB);
  root.style.setProperty("--bg-grad-a", choice.gradA);
  root.style.setProperty("--bg-grad-b", choice.gradB);
}

applyRandomAccentPalette();

const colorSchemeMedia = window.matchMedia?.("(prefers-color-scheme: dark)");
if (colorSchemeMedia) {
  const handleSchemeChange = () => {
    applyRandomAccentPalette();
  };

  if (typeof colorSchemeMedia.addEventListener === "function") {
    colorSchemeMedia.addEventListener("change", handleSchemeChange);
  } else if (typeof colorSchemeMedia.addListener === "function") {
    colorSchemeMedia.addListener(handleSchemeChange);
  }
}

const PIX_KEY = "pix@felipecavalca.dev";
const supportBtn = document.getElementById("support-btn");
const supportModal = document.getElementById("support-modal");
const supportClose = document.getElementById("support-close");
const supportCopyText = document.querySelector(".support-copy");

function setSupportMessage(message) {
  if (supportCopyText) {
    supportCopyText.textContent = message;
  }
}

async function copyPixKey() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(PIX_KEY);
      return true;
    }
  } catch (_error) {
    // Fallback below.
  }

  const temp = document.createElement("textarea");
  temp.value = PIX_KEY;
  temp.setAttribute("readonly", "");
  temp.style.position = "absolute";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);
  temp.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(temp);
  return copied;
}

async function openSupportModal() {
  if (!supportModal) return;
  supportModal.classList.add("is-open");
  supportModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const copied = await copyPixKey();
  setSupportMessage(
    copied
      ? "A chave Pix ja foi copiada para sua area de transferencia."
      : "Nao foi possivel copiar automaticamente. Use a chave abaixo."
  );
}

function closeSupportModal() {
  if (!supportModal) return;
  supportModal.classList.remove("is-open");
  supportModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (supportBtn) {
  supportBtn.addEventListener("click", () => {
    openSupportModal();
  });
}

if (supportClose) {
  supportClose.addEventListener("click", () => {
    closeSupportModal();
  });
}

if (supportModal) {
  supportModal.addEventListener("click", event => {
    if (event.target === supportModal) {
      closeSupportModal();
    }
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeSupportModal();
  }
});

function flashSection(target) {
  if (!target) return;
  target.classList.remove("section-flash");
  // Force reflow so repeated clicks retrigger the animation.
  void target.offsetWidth;
  target.classList.add("section-flash");
  target.addEventListener(
    "animationend",
    () => {
      target.classList.remove("section-flash");
    },
    { once: true }
  );
}

const sectionButtons = document.querySelectorAll(".btn-section[href^='#']");
sectionButtons.forEach(button => {
  button.addEventListener("click", event => {
    const href = button.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", href);

    const distance = Math.abs(target.getBoundingClientRect().top);
    const delay = Math.min(900, Math.max(280, distance * 0.35));
    window.setTimeout(() => {
      flashSection(target);
    }, delay);
  });
});
