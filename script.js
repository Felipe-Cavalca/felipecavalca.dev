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
      ? "A chave Pix já foi copiada para sua área de transferência."
      : "Não foi possível copiar automaticamente. Use a chave abaixo."
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
