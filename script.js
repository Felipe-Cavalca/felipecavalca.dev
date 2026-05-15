const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const currentFilePath = document.getElementById("current-file-path");
const statusFile = document.getElementById("status-file");
const fileItems = document.querySelectorAll(".file-item");
const mobileFileItems = document.querySelectorAll(".mobile-file-item");
const editorStage = document.getElementById("editor-stage");
const pixCopyBtn = document.getElementById("pix-copy-btn");
const pixFeedback = document.getElementById("pix-feedback");
const stackGrid = document.getElementById("stack-grid");
const stackJsonPreview = document.getElementById("stack-json-preview");
const agoraList = document.getElementById("agora-list");
const agoraJsonPreview = document.getElementById("agora-json-preview");
const projectList = document.getElementById("project-list");
const projetosJsonPreview = document.getElementById("projetos-json-preview");
const socialGrid = document.getElementById("social-grid");
const socialJsonPreview = document.getElementById("social-json-preview");
const scrollLinks = document.querySelectorAll("[data-scroll-link]");
let activeFile = "sobre-md";
let leavingPanel = null;

function getFileMeta(fileId) {
  const source = document.querySelector(`.file-item[data-target="${fileId}"]`);
  return {
    title: source?.dataset.title ?? "arquivo",
    path: source?.dataset.path ?? "src/profile/arquivo",
  };
}

function updateHeader(meta) {
  if (currentFilePath) {
    currentFilePath.textContent = meta.path;
  }
  if (statusFile) {
    statusFile.textContent = meta.title;
  }
}

function setActiveStates(fileId) {
  fileItems.forEach(item => {
    item.classList.toggle("is-active", item.dataset.target === fileId);
  });

  mobileFileItems.forEach(item => {
    item.classList.toggle("is-active", item.dataset.target === fileId);
  });
}

function showFile(fileId) {
  if (fileId === activeFile) return;

  const nextPanel = document.querySelector(`.file-panel[data-file="${fileId}"]`);
  const currentPanel = document.querySelector(`.file-panel[data-file="${activeFile}"]`);
  if (!nextPanel || !currentPanel) return;

  if (leavingPanel) {
    leavingPanel.classList.remove("is-leaving");
  }

  leavingPanel = currentPanel;
  currentPanel.classList.remove("is-active");
  currentPanel.classList.add("is-leaving");

  nextPanel.classList.add("is-active");

  window.setTimeout(() => {
    if (leavingPanel) {
      leavingPanel.classList.remove("is-leaving");
      leavingPanel = null;
    }
  }, 360);

  activeFile = fileId;
  setActiveStates(fileId);
  updateHeader(getFileMeta(fileId));
}

function bindFileNavigation(nodeList) {
  nodeList.forEach(node => {
    node.addEventListener("click", event => {
      event.preventDefault();
      const target = node.dataset.target;
      if (target) {
        showFile(target);
      }
    });
  });
}

bindFileNavigation(fileItems);
bindFileNavigation(mobileFileItems);
bindFileNavigation(document.querySelectorAll("[data-target].sidebar-brand"));

function titleize(key) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatJson(data) {
  return JSON.stringify(data, null, 2);
}

function renderStack(data) {
  if (stackJsonPreview) {
    stackJsonPreview.textContent = formatJson(data);
  }
  if (!stackGrid) return;

  stackGrid.innerHTML = Object.entries(data)
    .map(([key, items]) => `
      <article class="stack-item hover-glow">
        <h3>${titleize(key)}</h3>
        <ul class="chip-list">
          ${items.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </article>
    `)
    .join("");
}

function renderAgora(data) {
  if (agoraJsonPreview) {
    agoraJsonPreview.textContent = formatJson(data);
  }
  if (!agoraList) return;

  agoraList.innerHTML = data
    .map(item => `
      <article class="timeline-item hover-glow">
        <span class="timeline-dot${item.ativo ? " timeline-dot-live" : ""}"></span>
        <div>
          <h3>${item.titulo}</h3>
          <p>${item.descricao}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderProjetos(data) {
  if (projetosJsonPreview) {
    projetosJsonPreview.textContent = formatJson(data);
  }
  if (!projectList) return;

  projectList.innerHTML = data
    .map(item => `
      <li class="hover-glow">
        <h3>${item.titulo}</h3>
        <p>${item.descricao}</p>
        <a href="${item.url}" target="_blank" rel="noreferrer">${item.cta}</a>
      </li>
    `)
    .join("");
}

function renderSocial(data) {
  if (socialJsonPreview) {
    socialJsonPreview.textContent = formatJson(data);
  }
  if (!socialGrid) return;

  socialGrid.innerHTML = Object.values(data)
    .map(item => `
      <a class="social-card hover-glow" href="${item.url}" ${item.url.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>
        <span class="social-label">${item.label}</span>
        <strong>${item.titulo}</strong>
        <p>${item.descricao}</p>
      </a>
    `)
    .join("");
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Falha ao carregar ${path}`);
  }
  return response.json();
}

async function loadDataPanels() {
  try {
    const [stack, agora, projetos, social] = await Promise.all([
      loadJson("data/stack.json"),
      loadJson("data/agora.json"),
      loadJson("data/projetos.json"),
      loadJson("data/social.json"),
    ]);

    renderStack(stack);
    renderAgora(agora);
    renderProjetos(projetos);
    renderSocial(social);
    bindHoverGlow();
  } catch (_error) {
    // Se algo falhar, a estrutura da pagina continua utilizavel.
  }
}

const PIX_KEY = "pix@felipecavalca.dev";

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

if (pixCopyBtn) {
  pixCopyBtn.addEventListener("click", async () => {
    const copied = await copyPixKey();
    if (pixFeedback) {
      pixFeedback.textContent = copied
        ? "Chave Pix copiada para a area de transferencia."
        : "Nao foi possivel copiar automaticamente. Use a chave exibida acima.";
    }
  });
}

if (editorStage) {
  editorStage.addEventListener("pointermove", event => {
    const rect = editorStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    editorStage.style.setProperty("--mouse-x", `${x}%`);
    editorStage.style.setProperty("--mouse-y", `${y}%`);
  });
}

scrollLinks.forEach(link => {
  link.addEventListener("click", event => {
    const targetId = link.getAttribute("href");
    if (!targetId?.startsWith("#")) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    document.body.classList.remove("lock-scroll");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function bindHoverGlow() {
  document.querySelectorAll(".hover-glow").forEach(node => {
    if (node.dataset.glowBound === "true") return;
    node.dataset.glowBound = "true";
    node.addEventListener("pointermove", event => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty("--glow-x", `${x}%`);
      node.style.setProperty("--glow-y", `${y}%`);
    });
  });
}

updateHeader(getFileMeta(activeFile));
setActiveStates(activeFile);
bindHoverGlow();
loadDataPanels();
