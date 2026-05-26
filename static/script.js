/* ════════════════════════════════════════════════
   server search, pagination,
   suggest dropdowns, localStorage profile
════════════════════════════════════════════════ */

/* ── WARNING MODAL ── */
function dismissWarning() {
  const modal = document.getElementById("warningModal");
  modal.style.animation = "fadeOut 0.2s ease forwards";
  setTimeout(() => modal.style.display = "none", 200);
}
document.body.style.overflow = "hidden";
document.getElementById("warningModal")
  .querySelector(".modal-btn")
  .addEventListener("click", () => {
    document.body.style.overflow = "";
  });

/* ── API BASE ── */
const API = "/api";

/* ── STATE ── */
let query = "";
let filterCat = "";
let currentPage = 1;
let selectedDrug = null;
let isLoading = false;

/* ════════════════════════════════════════════════
   SEARCH PAGE — render list + pagination
════════════════════════════════════════════════ */
async function renderList() {
  if (isLoading) return;
  isLoading = true;

  document.getElementById("drugList").innerHTML = `
    <div style="padding:20px;text-align:center;color:var(--gray-400);font-size:13px;">
      Loading…
    </div>`;

  try {
    const params = new URLSearchParams({
      q: query,
      category: filterCat,
      rx: document.getElementById("rxFilter").value,
      page: currentPage,
      per_page: 8
    });

    const response = await fetch(`${API}/search?${params}`);
    const data = await response.json();

    document.getElementById("resultsCount").textContent =
      data.total === 0
        ? "No results found"
        : `${data.total} medicine${data.total !== 1 ? "s" : ""} found`;

    if (!data.results.length) {
      let suggestionHTML = "";

      if (data.suggestion) {
        suggestionHTML = `
      <div style="margin-top:10px;font-size:13px;">
        Did you mean:
        <span style="color:var(--teal-700);cursor:pointer;font-weight:500;"
          onclick="applySuggestion('${data.suggestion}')">
          ${data.suggestion}
        </span> ?
      </div>`;
      }

      document.getElementById("drugList").innerHTML = `
    <div style="padding:40px;text-align:center;color:var(--gray-400);font-size:14px;">
      <div style="font-size:32px;margin-bottom:12px;color:var(--teal-200)">◎</div>
      No medicines found.<br/>
      Try a brand name or check your spelling.
      ${suggestionHTML}
    </div>`;
    }
    else {
      document.getElementById("drugList").innerHTML = data.results.map(d => {
        const sel = selectedDrug && selectedDrug.id === d.id ? "selected" : "";
        const sc = d.severity === "high" ? "sev-high"
          : d.severity === "mod" ? "sev-mod" : "sev-low";
        return `
          <div class="drug-card ${sel}" onclick="selectDrug(${d.id})" data-id="${d.id}">
            <div class="sev-strip ${sc}"></div>
            <div class="drug-card-inner">
              <div class="drug-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
              <div class="drug-info">
                <div class="drug-name">${d.generic_name}</div>
                <div class="drug-brands">${d.brands || ""}</div>
                <div class="drug-tags">
                  <span class="tag tag-cat">${d.category}</span>
                  <span class="tag ${d.prescription_required ? "tag-rx" : "tag-otc"}">
                    ${d.prescription_required ? "Rx only" : "OTC"}
                  </span>
                </div>
              </div>
              <div class="drug-card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </div>`;
      }).join("");
    }

    renderPagination(data.total_pages);

  } catch (err) {
    document.getElementById("drugList").innerHTML = `
      <div style="padding:40px;text-align:center;color:var(--red-400);font-size:13px;">
        Could not connect to server. Is Flask running?
      </div>`;
  } finally {
    isLoading = false;
  }
}

/* ── PAGINATION ── */
function renderPagination(totalPages) {
  const pg = document.getElementById("pagination");
  if (!pg) return;
  if (totalPages <= 1) { pg.innerHTML = ""; return; }

  let h = `<button class="pg-btn" onclick="goPage(${currentPage - 1})"
    ${currentPage === 1 ? "disabled" : ""}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="15 18 9 12 15 6"/>
    </svg></button>`;

  const show = new Set([1, totalPages]);
  for (let i = currentPage - 1; i <= currentPage + 1; i++)
    if (i > 0 && i <= totalPages) show.add(i);

  const sorted = [...show].sort((a, b) => a - b);
  let prev = null;
  for (const p of sorted) {
    if (prev && p - prev > 1) h += `<span class="pg-dots">…</span>`;
    h += `<button class="pg-btn ${p === currentPage ? "active" : ""}"
      onclick="goPage(${p})">${p}</button>`;
    prev = p;
  }

  h += `<button class="pg-btn" onclick="goPage(${currentPage + 1})"
    ${currentPage === totalPages ? "disabled" : ""}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="9 18 15 12 9 6"/>
    </svg></button>`;

  pg.innerHTML = h;
}

function goPage(p) {
  if (p < 1) return;
  currentPage = p;
  renderList();
}

/* ── SELECT & DETAIL ── */
async function selectDrug(id) {
  try {
    const response = await fetch(`${API}/medicine/${id}`);
    selectedDrug = await response.json();
    renderList();
    renderDetail();
  } catch (err) {
    console.error("Could not fetch medicine detail", err);
  }
}

function renderDetail() {
  const d = selectedDrug;
  if (!d) {
    document.getElementById("detailPanel").innerHTML = `
      <div class="detail-empty">
        <div class="detail-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </div>
        <div class="detail-empty-title">Select a medicine</div>
        <div class="detail-empty-sub">Click any result to see full details and check interactions.</div>
      </div>`;
    return;
  }

  const sc = d.severity === "high" ? "high" : d.severity === "mod" ? "mod" : "low";
  const sdot = d.severity === "high" ? "#E24B4A" : d.severity === "mod" ? "#EF9F27" : "#639922";
  const stxt = d.severity === "high" ? "High interaction risk — handle with care"
    : d.severity === "mod" ? "Moderate interaction risk — check before combining"
      : "Low interaction risk";

  /* Profile allergy warning */
  const profile = loadProfile();
  const allergyWarn = profile.allergies
    ? checkAllergyWarn(d.generic_name, d.drug_class || "", profile.allergies)
    : "";

  document.getElementById("detailPanel").innerHTML = `
    <div class="detail-card">
      <div class="detail-header">
        <div class="detail-drug-name">${d.generic_name}</div>
        <div class="detail-drug-brands">${d.brands || ""}</div>
        <div class="detail-header-tags">
          <span class="detail-htag">${d.category}</span>
          <span class="detail-htag">${d.prescription_required ? "Prescription only" : "Over the counter"}</span>
        </div>
      </div>
      ${allergyWarn}
      <div class="sev-badge ${sc}">
        <div class="sev-badge-dot" style="background:${sdot}"></div>
        ${stxt}
      </div>
      <div class="detail-sections">
        <div class="detail-section">
          <div class="detail-sec-label">Uses</div>
          <div class="detail-sec-text">${d.uses}</div>
        </div>
        <div class="detail-section">
          <div class="detail-sec-label">Typical dosage</div>
          <div class="detail-sec-text">${d.dosage}</div>
        </div>
        <div class="detail-section">
          <div class="detail-sec-label">Side effects</div>
          <div class="detail-sec-text">${d.side_effects}</div>
        </div>
        <div class="detail-section">
          <div class="detail-sec-label">Precautions</div>
          <div class="detail-sec-text">${d.precautions}</div>
        </div>
        ${d.contraindications ? `
        <div class="detail-section">
          <div class="detail-sec-label">Contraindications</div>
          <div class="detail-sec-text">${d.contraindications}</div>
        </div>` : ""}
        ${d.mechanism ? `
        <div class="detail-section">
          <div class="detail-sec-label">How it works</div>
          <div class="detail-sec-text">${d.mechanism}</div>
        </div>` : ""}
      </div>
      <div class="int-checker">
        <div class="int-checker-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
          Check interaction with another medicine
        </div>
        <div class="int-input-row">
          <div class="suggest-wrap" style="flex:1;position:relative;">
            <input type="text" id="intInput"
              placeholder="Type a medicine name…"
              autocomplete="off"
              oninput="handleSuggest('intInput','intDrop')"
              onkeydown="handleSuggestKey(event,'intInput','intDrop')" />
            <div class="suggest-dropdown" id="intDrop"></div>
          </div>
          <button onclick="checkInlineInteraction()">Check</button>
        </div>
        <div id="intResult"></div>
      </div>
    </div>`;
}

function applySuggestion(name) {
  document.getElementById("mainSearch").value = name;
  query = name;
  currentPage = 1;
  renderList();
}

/* ════════════════════════════════════════════════
   SUGGESTION DROPDOWN ENGINE
   Powers all three interaction inputs:
   chk1, chk2 (checker page) + intInput (inline)
════════════════════════════════════════════════ */
const suggestTimers = {};
const suggestFocusIdx = {};

async function handleSuggest(inputId, dropId) {
  const input = document.getElementById(inputId);
  const drop = document.getElementById(dropId);
  if (!input || !drop) return;

  const q = input.value.trim();

  /* Close if query too short */
  if (!q || q.length < 2) {
    drop.innerHTML = "";
    drop.classList.remove("open");
    return;
  }

  /* Debounce 260ms — same rhythm as main search */
  clearTimeout(suggestTimers[inputId]);
  suggestTimers[inputId] = setTimeout(async () => {
    try {
      const res = await fetch(`${API}/suggest?q=${encodeURIComponent(q)}`);
      const list = await res.json();

      if (!list.length) {
        drop.innerHTML = `<div class="suggest-empty">No medicines found for "${q}"</div>`;
        drop.classList.add("open");
        return;
      }

      suggestFocusIdx[dropId] = -1;

      drop.innerHTML = list.map((m, i) => `
        <div class="suggest-item"
             data-name="${m.generic_name.replace(/"/g, '&quot;')}"
             data-idx="${i}"
             onmousedown="pickSuggestion('${inputId}','${dropId}','${m.generic_name.replace(/'/g, "\\'")}')">
          <div class="suggest-item-name">${m.generic_name}</div>
          <div class="suggest-item-brand">${m.brands || ""}</div>
        </div>`).join("");

      drop.classList.add("open");

    } catch (err) {
      drop.classList.remove("open");
    }
  }, 260);
}

function pickSuggestion(inputId, dropId, name) {
  const input = document.getElementById(inputId);
  const drop = document.getElementById(dropId);
  if (input) input.value = name;
  if (drop) { drop.classList.remove("open"); drop.innerHTML = ""; }
  suggestFocusIdx[dropId] = -1;
}

/* Keyboard: arrows, Enter, Escape */
function handleSuggestKey(e, inputId, dropId) {
  const drop = document.getElementById(dropId);
  if (!drop) return;
  const items = drop.querySelectorAll(".suggest-item");

  if (!drop.classList.contains("open")) {
    if (e.key === "Enter") {
      if (inputId === "intInput") checkInlineInteraction();
      else checkInteractionPage();
    }
    return;
  }

  let idx = suggestFocusIdx[dropId] ?? -1;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    idx = Math.min(idx + 1, items.length - 1);
    suggestFocusIdx[dropId] = idx;
    items.forEach((el, i) => el.classList.toggle("focused", i === idx));

  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    idx = Math.max(idx - 1, 0);
    suggestFocusIdx[dropId] = idx;
    items.forEach((el, i) => el.classList.toggle("focused", i === idx));

  } else if (e.key === "Enter") {
    e.preventDefault();
    if (idx >= 0 && items[idx]) {
      pickSuggestion(inputId, dropId, items[idx].dataset.name);
    } else {
      drop.classList.remove("open");
    }
    if (inputId === "intInput") checkInlineInteraction();
    else checkInteractionPage();

  } else if (e.key === "Escape") {
    drop.classList.remove("open");
    suggestFocusIdx[dropId] = -1;
  }
}

/* Close dropdowns on outside click */
document.addEventListener("click", e => {
  document.querySelectorAll(".suggest-dropdown").forEach(drop => {
    const wrap = drop.closest(".suggest-wrap");
    if (wrap && !wrap.contains(e.target)) {
      drop.classList.remove("open");
    }
  });
});

/* ════════════════════════════════════════════════
   INTERACTION LOGIC
════════════════════════════════════════════════ */
function renderIntResult(result, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (!result) {
    el.innerHTML = `
      <div class="int-result safe">
        <div class="int-result-head">✓ No known interaction found</div>
        <div class="int-result-body">No significant interaction in our database.
          Always confirm with your pharmacist for a complete review.</div>
      </div>`;
    return;
  }

  const cls = result.severity === "high" ? "danger"
    : result.severity === "mod" ? "mod" : "safe";
  const icon = result.severity === "high" ? "⚠" : "◎";
  const label = result.severity === "high" ? "High risk — avoid this combination"
    : result.severity === "mod" ? "Moderate risk — use with caution"
      : "Low risk";

  el.innerHTML = `
    <div class="int-result ${cls}">
      <div class="int-result-head">${icon} ${label}</div>
      <div class="int-result-body">${result.effect}</div>
      ${result.mechanism
      ? `<div class="int-result-alt"><strong>Why:</strong> ${result.mechanism}</div>`
      : ""}
      ${result.safer_alternative
      ? `<div class="int-result-alt"><strong>Safer option:</strong> ${result.safer_alternative}</div>`
      : ""}
    </div>`;
}

/* Inline checker (detail panel) */
async function checkInlineInteraction() {
  const inp = document.getElementById("intInput");
  if (!inp || !selectedDrug) return;
  const val = inp.value.trim();
  if (!val) return;

  /* Close dropdown */
  const drop = document.getElementById("intDrop");
  if (drop) drop.classList.remove("open");

  try {
    const res = await fetch(
      `${API}/interaction?drug1=${encodeURIComponent(selectedDrug.generic_name)}&drug2=${encodeURIComponent(val)}`
    );
    const data = await res.json();
    renderIntResult(data.found ? data.interaction : null, "intResult");
  } catch {
    document.getElementById("intResult").innerHTML = `
      <div class="int-result mod">
        <div class="int-result-head">◎ Server error</div>
        <div class="int-result-body">Could not reach server.</div>
      </div>`;
  }
}

/* Standalone checker page */
async function checkInteractionPage() {
  const a = document.getElementById("chk1").value.trim();
  const b = document.getElementById("chk2").value.trim();
  const out = document.getElementById("checkerResult");

  /* Close dropdowns */
  ["drop1", "drop2"].forEach(id => {
    const d = document.getElementById(id);
    if (d) d.classList.remove("open");
  });

  if (!a || !b) {
    out.innerHTML = `
      <div class="int-result mod">
        <div class="int-result-head">◎ Enter both medicines</div>
        <div class="int-result-body">Please fill in both fields above.</div>
      </div>`;
    return;
  }

  try {
    const res = await fetch(
      `${API}/interaction?drug1=${encodeURIComponent(a)}&drug2=${encodeURIComponent(b)}`
    );
    const data = await res.json();
    renderIntResult(data.found ? data.interaction : null, "checkerResult");
  } catch {
    out.innerHTML = `
      <div class="int-result mod">
        <div class="int-result-head">◎ Server error</div>
        <div class="int-result-body">Could not reach server.</div>
      </div>`;
  }
}

function fillChecker(a, b) {
  document.getElementById("chk1").value = a;
  document.getElementById("chk2").value = b;
  checkInteractionPage();
}

/* ════════════════════════════════════════════════
   SEARCH INPUT
════════════════════════════════════════════════ */
function doSearch() {
  query = document.getElementById("mainSearch").value.trim();
  currentPage = 1;
  renderList();
}

let debounceT;
document.getElementById("mainSearch").addEventListener("input", e => {
  clearTimeout(debounceT);
  debounceT = setTimeout(() => {
    query = e.target.value.trim();
    currentPage = 1;
    renderList();
  }, 260);
});
document.getElementById("mainSearch").addEventListener("keydown", e => {
  if (e.key === "Enter") doSearch();
});

function setFilter(cat, btn) {
  filterCat = cat;
  currentPage = 1;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  renderList();
}

function applyFilters() { currentPage = 1; renderList(); }

/* ════════════════════════════════════════════════
   PAGE ROUTING
════════════════════════════════════════════════ */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  const nb = document.getElementById("nav-" + id);
  if (nb) nb.classList.add("active");
  if (id === "profile") loadProfileIntoForm();
}

/* ════════════════════════════════════════════════
   PROFILE — localStorage
   Stores: meds, allergies, age, conditions, lifestyle
   Key: "aushadhi_profile"
════════════════════════════════════════════════ */
const PROFILE_KEY = "aushadhi_profile";

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function loadProfileIntoForm() {
  const p = loadProfile();
  const badge = document.getElementById("profileLoadedBadge");

  if (p && Object.keys(p).length) {
    /* Populate fields */
    setValue("profMeds", p.meds || "");
    setValue("profAllergies", p.allergies || "");
    setValue("profAge", p.age || "");
    setValue("profConditions", p.conditions || "");
    setValue("profLifestyle", p.lifestyle || "");
    if (badge) badge.style.display = "inline-flex";

    /* Show allergy/condition cross-check warning if they have meds saved */
    if (p.meds) showProfileWarnings(p);
  } else {
    if (badge) badge.style.display = "none";
  }
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function saveProfile() {
  const profile = {
    meds: document.getElementById("profMeds").value.trim(),
    allergies: document.getElementById("profAllergies").value.trim(),
    age: document.getElementById("profAge").value.trim(),
    conditions: document.getElementById("profConditions").value.trim(),
    lifestyle: document.getElementById("profLifestyle").value.trim(),
    savedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    const toast = document.getElementById("saveToast");
    if (toast) { toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 3500); }
    const badge = document.getElementById("profileLoadedBadge");
    if (badge) badge.style.display = "inline-flex";
    if (profile.meds) showProfileWarnings(profile);
  } catch (err) {
    alert("Could not save profile. Your browser may have localStorage disabled.");
  }
}

function clearProfile() {
  if (!confirm("Clear your saved profile from this device?")) return;
  localStorage.removeItem(PROFILE_KEY);
  ["profMeds", "profAllergies", "profAge", "profConditions", "profLifestyle"]
    .forEach(id => setValue(id, ""));
  const badge = document.getElementById("profileLoadedBadge");
  if (badge) badge.style.display = "none";
  const warn = document.getElementById("profileWarning");
  if (warn) { warn.textContent = ""; warn.classList.remove("show"); }
}

/* Show a banner on the profile page if saved meds + conditions look notable */
function showProfileWarnings(p) {
  const warn = document.getElementById("profileWarning");
  if (!warn) return;

  const meds = (p.meds || "").toLowerCase();
  const cond = (p.conditions || "").toLowerCase();
  const messages = [];

  if (meds.includes("warfarin") || meds.includes("clopidogrel"))
    messages.push("⚠ You are on an <strong>anticoagulant</strong>. Always check interactions before adding any new medicine.");
  if (meds.includes("insulin") || meds.includes("glimepiride") || meds.includes("glipizide"))
    messages.push("⚠ You are on <strong>insulin or a sulphonylurea</strong>. Watch for hypoglycaemia symptoms.");
  if (meds.includes("metformin") && cond.includes("kidney"))
    messages.push("⚠ Metformin + kidney disease: confirm your doctor has approved this combination.");
  if (meds.includes("digoxin"))
    messages.push("⚠ Digoxin has a narrow therapeutic index — many common medicines affect its levels.");

  if (messages.length) {
    warn.innerHTML = messages.join("<br/>");
    warn.classList.add("show");
  } else {
    warn.classList.remove("show");
  }
}

/* Used by renderDetail to flag allergy matches */
function checkAllergyWarn(name, drugClass, allergiesStr) {
  const n = name.toLowerCase();
  const dc = drugClass.toLowerCase();
  const allergies = allergiesStr.toLowerCase().split(",").map(s => s.trim());

  const match = allergies.find(a =>
    a && (n.includes(a) || dc.includes(a))
  );

  if (!match) return "";

  return `
    <div style="background:var(--red-50);border:1px solid #FAA;border-radius:var(--radius-sm);
      padding:10px 14px;margin-bottom:12px;font-size:13px;color:var(--red-700);">
      <strong>⚠ Allergy alert:</strong> Your profile lists an allergy to
      <strong>${match}</strong>. Confirm with your doctor before taking this medicine.
    </div>`;
}

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
renderList();