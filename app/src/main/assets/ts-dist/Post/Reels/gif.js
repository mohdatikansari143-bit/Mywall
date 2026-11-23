// ===================================
// GIPHY API CONFIGURATION (unchanged)
// ===================================
const API_KEY = "MVQEatZfNsOk9sIyYe8eGDfNczd1UOkO";
const LIMIT = 24;
const $ = (id) => document.getElementById(id);
const gallery = $("gallery"), stateBox = $("stateBox"), heading = $("heading");
const searchInput = $("searchInput"), clearBtn = $("clearBtn");
const sentinel = $("sentinel"), endMsg = $("end");
const modal = $("modal"), preview = $("preview");
let type = "gifs";
let query = "";
let offset = 0;
let loading = false;
let finished = false;
let requestNumber = 0;
let current = null;
let items = [];
let columns = [], heights = [], skeletons = [];
// ---------- safe storage (recent searches) ----------
const store = {
    get(k, d) { try {
        return JSON.parse(localStorage.getItem(k) || "null") ?? d;
    }
    catch (e) {
        return d;
    } },
    set(k, v) { try {
        localStorage.setItem(k, JSON.stringify(v));
    }
    catch (e) { } }
};
let searchHistory = store.get("gg_history", []);
// ===================================
// CREATE API URL (same endpoints + params)
// ===================================
function createURL() {
    const endpoint = query
        ? `https://api.giphy.com/v1/${type}/search`
        : `https://api.giphy.com/v1/${type}/trending`;
    const url = new URL(endpoint);
    url.searchParams.set("api_key", API_KEY);
    url.searchParams.set("limit", String(LIMIT));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("rating", "g");
    url.searchParams.set("lang", "en");
    if (query)
        url.searchParams.set("q", query);
    return url.toString();
}
// ---------- helpers ----------
const ICON_SEARCH = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
const ICON_WARN = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 17h.01"/></svg>';
let toastTimer;
function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1700);
}
function normalize(item) {
    const im = item.images || {};
    const fw = im.fixed_width || {};
    const display = fw.webp || fw.url || im.original?.webp || im.original?.url;
    const original = im.original?.url || fw.url;
    if (!display || !original)
        return null;
    const big = im.downsized_large?.url || im.downsized?.url || original;
    const w = parseInt(fw.width) || parseInt(im.original?.width) || 1;
    const h = parseInt(fw.height) || parseInt(im.original?.height) || 1;
    return { id: item.id, title: item.title || "GIF", display, original, big, w, h };
}
function setHeading() {
    heading.textContent = query || "";
    gallery.className = "masonry " + type;
}
// ===================================
// MASONRY
// ===================================
const colCount = () => window.innerWidth >= 700 ? 4 : 2;
function buildColumns() {
    gallery.innerHTML = "";
    columns = [];
    heights = [];
    skeletons = [];
    for (let i = 0; i < colCount(); i++) {
        const c = document.createElement("div");
        c.className = "col";
        gallery.appendChild(c);
        columns.push(c);
        heights.push(0);
    }
}
function place(el, ratio) {
    const idx = heights.indexOf(Math.min(...heights));
    columns[idx].appendChild(el);
    heights[idx] += ratio;
    return idx;
}
function showSkeletons(n) {
    const ratios = [1.1, .8, 1.3, .95, 1.2, .85, 1, 1.25];
    for (let i = 0; i < n; i++) {
        const r = ratios[i % ratios.length];
        const s = document.createElement("div");
        s.className = "sk";
        s.style.aspectRatio = `1 / ${r}`;
        skeletons.push({ el: s, idx: place(s, r), r });
    }
}
function clearSkeletons() {
    skeletons.forEach(s => { s.el.remove(); heights[s.idx] -= s.r; });
    skeletons = [];
}
function addCard(item) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.aspectRatio = `${item.w} / ${item.h}`;
    const img = document.createElement("img");
    img.alt = item.title;
    img.loading = "lazy";
    img.decoding = "async";
    img.onload = () => img.classList.add("ready");
    img.onerror = () => card.remove();
    img.src = item.display;
    card.appendChild(img);
    card.onclick = () => openPreview(item);
    place(card, item.h / item.w);
}
let lastCols = colCount();
let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (colCount() === lastCols)
            return;
        lastCols = colCount();
        buildColumns();
        items.forEach(addCard);
    }, 200);
});
// ---------- states ----------
function showState(icon, title, text, retry) {
    stateBox.innerHTML = "";
    const box = document.createElement("div");
    box.className = "state";
    box.innerHTML = `<div class="orb">${icon}</div><h3></h3><p></p>`;
    box.querySelector("h3").textContent = title;
    box.querySelector("p").textContent = text;
    if (retry) {
        const b = document.createElement("button");
        b.textContent = "Try again";
        b.onclick = retry;
        box.appendChild(b);
    }
    stateBox.appendChild(box);
}
const clearState = () => { stateBox.innerHTML = ""; };
// ===================================
// LOAD CONTENT (infinite scroll)
// ===================================
async function loadContent(reset = true) {
    if (loading && !reset)
        return;
    const thisRequest = ++requestNumber;
    if (reset) {
        offset = 0;
        finished = false;
        items = [];
        buildColumns();
        endMsg.hidden = true;
        clearState();
        setHeading();
    }
    if (finished)
        return;
    loading = true;
    showSkeletons(reset ? 8 : 4);
    try {
        const response = await fetch(createURL());
        const result = await response.json();
        if (thisRequest !== requestNumber)
            return;
        if (!response.ok) {
            const code = result.meta?.status || response.status;
            const message = result.meta?.msg || "API request failed";
            throw new Error(`GIPHY Error ${code}: ${message}`);
        }
        clearSkeletons();
        if (!Array.isArray(result.data) || result.data.length === 0) {
            finished = true;
            if (offset === 0) {
                showState(ICON_SEARCH, "No results found", query ? `Nothing matched "${query}". Try a different word.` : "Nothing to show right now.");
            }
            else {
                endMsg.hidden = false;
            }
            return;
        }
        const frag = [];
        result.data.forEach((raw) => {
            const item = normalize(raw);
            if (item) {
                items.push(item);
                frag.push(item);
            }
        });
        frag.forEach(addCard);
        offset += result.data.length;
        if (result.data.length < LIMIT) {
            finished = true;
            endMsg.hidden = false;
        }
        if (!items.length)
            showState(ICON_WARN, "No usable images", "GIPHY returned items without previews.");
    }
    catch (error) {
        console.error(error);
        if (thisRequest !== requestNumber)
            return;
        clearSkeletons();
        showState(ICON_WARN, "Something went wrong", error?.message === "Failed to fetch" ? "Check your internet connection and try again." : (error?.message || "Unknown error"), () => { clearState(); loadContent(offset === 0); });
    }
    finally {
        if (thisRequest === requestNumber)
            loading = false;
    }
}
new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !loading && !finished && items.length) {
        loadContent(false);
    }
}, { rootMargin: "600px" }).observe(sentinel);
// ===================================
// SEARCH + RECENT
// ===================================
function renderHistory() {
    const box = $("chips");
    box.innerHTML = "";
    searchHistory.forEach(term => {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "chip";
        c.textContent = term;
        c.onmousedown = e => e.preventDefault();
        c.onclick = () => { searchInput.value = term; runSearch(); };
        box.appendChild(c);
    });
    updateRecent();
}
function updateRecent() {
    const show = document.activeElement === searchInput && !searchInput.value && searchHistory.length;
    $("recent").classList.toggle("show", !!show);
}
function saveHistory(term) {
    searchHistory = [term, ...searchHistory.filter(h => h.toLowerCase() !== term.toLowerCase())].slice(0, 8);
    store.set("gg_history", searchHistory);
    renderHistory();
}
$("clearHistory").onmousedown = e => e.preventDefault();
$("clearHistory").onclick = () => {
    searchHistory = [];
    store.set("gg_history", searchHistory);
    renderHistory();
};
searchInput.addEventListener("focus", updateRecent);
searchInput.addEventListener("blur", () => setTimeout(updateRecent, 120));
searchInput.addEventListener("input", () => {
    clearBtn.classList.toggle("show", !!searchInput.value);
    updateRecent();
});
function runSearch() {
    query = searchInput.value.trim();
    if (query.length > 50) {
        toast("Search must be 50 characters or less");
        return;
    }
    if (query)
        saveHistory(query);
    clearBtn.classList.toggle("show", !!searchInput.value);
    searchInput.blur();
    window.scrollTo({ top: 0 });
    loadContent(true);
}
$("searchForm").addEventListener("submit", e => { e.preventDefault(); runSearch(); });
clearBtn.onclick = () => {
    searchInput.value = "";
    clearBtn.classList.remove("show");
    const had = !!query;
    query = "";
    searchInput.focus();
    if (had)
        loadContent(true);
};
// ===================================
// TABS + SWIPE NAVIGATION
// ===================================
function switchTab(nextType) {
    if (type === nextType)
        return;
    type = nextType;
    document.querySelectorAll(".tab").forEach(b => {
        b.classList.toggle("active", b.dataset.type === nextType);
    });
    searchInput.placeholder = type === "gifs" ? "Search for GIFs" : "Search for Stickers";
    window.scrollTo({ top: 0 });
    loadContent(true);
}
document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => switchTab(button.dataset.type || "gifs"));
});
let touchStartX = 0, touchStartY = 0, touchStartTime = 0, swipeValid = false;
document.addEventListener("touchstart", e => {
    if (e.touches.length !== 1 || modal.classList.contains("show") || e.target?.closest(".chips")) {
        swipeValid = false;
        return;
    }
    swipeValid = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
}, { passive: true });
document.addEventListener("touchend", e => {
    if (!swipeValid || e.changedTouches.length !== 1)
        return;
    swipeValid = false;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const dt = Date.now() - touchStartTime;
    if (dt < 600 && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0 && type === "gifs")
            switchTab("stickers");
        else if (dx > 0 && type === "stickers")
            switchTab("gifs");
    }
}, { passive: true });
// ===================================
// PREVIEW (full screen)
// ===================================
function openPreview(item) {
    current = item;
    preview.src = item.big;
    preview.alt = item.title;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}
function closePreview() {
    if (!modal.classList.contains("show"))
        return;
    modal.classList.remove("show");
    document.body.style.overflow = "";
    preview.src = "";
}
$("closeModal").onclick = closePreview;
document.addEventListener("keydown", e => { if (e.key === "Escape")
    closePreview(); });
modal.addEventListener("click", e => {
    const el = e.target;
    if (e.target === modal || el?.classList.contains("stage"))
        closePreview();
});
$("dlBtn").onclick = () => current && download(current);
$("shareBtn").onclick = async () => {
    if (!current)
        return;
    try {
        if (navigator.share) {
            await navigator.share({ title: current.title, url: current.original });
        }
        else {
            await navigator.clipboard.writeText(current.original);
            toast("Link copied");
        }
    }
    catch (e) { }
};
async function download(item) {
    const ext = item.original.split("?")[0].split(".").pop() || "gif";
    const name = (item.title || "giphy").replace(/[^\w\-]+/g, "_").slice(0, 40) + "." + ext;
    try {
        toast("Downloading...");
        const res = await fetch(item.original);
        if (!res.ok)
            throw new Error("download failed");
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        toast("Saved");
    }
    catch (e) {
        window.open(item.original, "_blank", "noopener");
    }
}
// ---------- back + init ----------
$("backBtn").onclick = () => {
    if (modal.classList.contains("show"))
        closePreview();
    else if (query) {
        searchInput.value = "";
        clearBtn.classList.remove("show");
        query = "";
        loadContent(true);
    }
    else if (window.history.length > 1)
        window.history.back();
    else
        window.scrollTo({ top: 0, behavior: "smooth" });
};
renderHistory();
loadContent(true);
Object.assign(window, { createURL, toast, normalize, setHeading, buildColumns, place, showSkeletons, clearSkeletons, addCard, showState, loadContent, renderHistory, updateRecent, saveHistory, runSearch, switchTab, openPreview, closePreview, download });
export {};
