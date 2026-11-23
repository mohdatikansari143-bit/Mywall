const HEART = '<svg width="15" height="15" viewBox="0 0 24 24" stroke-width="2.2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
const DIS = '<svg width="15" height="15" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>';
const CMT = '<svg width="15" height="15" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
const VIEWS = '<svg width="15" height="15" viewBox="0 0 24 24" stroke-width="2.2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>';
const SHARE = '<svg width="15" height="15" viewBox="0 0 24 24" stroke-width="2.2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
const DOTS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
const cnt = v => v ? `<span class="btn-count">${v}</span>` : '';
// Order: Like, Dislike, Comment, Views, Share, 3 Dot
const actions = (likes, comments, views) => `
  <div class="liquid-btn like-btn" data-act="like" data-base="${toNum(likes)}">${HEART}${cnt(likes)}</div>
  <div class="liquid-btn dislike-btn" data-act="dislike">${DIS}</div>
  <div class="liquid-btn" data-go="comment.html">${CMT}${cnt(comments)}</div>
  <div class="liquid-btn">${VIEWS}${cnt(views)}</div>
  <div class="liquid-btn liquid-icon-btn" data-act="share">${SHARE}</div>
  <div class="liquid-btn liquid-icon-btn">${DOTS}</div>`;
function toNum(v) {
    v = String(v || '0').trim().toUpperCase();
    if (v.endsWith('K'))
        return Math.round(parseFloat(v) * 1000);
    if (v.endsWith('M'))
        return Math.round(parseFloat(v) * 1000000);
    return parseInt(v, 10) || 0;
}
const comments = [
    { n: "Mohd Asif", h: "@MohdAsifbzri", t: "💀💀💀", time: "22 Oct", l: "12", c: "1", v: "340" },
    { n: "Riya Sharma", h: "@riya.vibes", t: "Bhai ye sach mein lock in karne ka time hai", time: "20h", l: "48", c: "2", v: "1.2K" },
    { n: "Aman", h: "@aman.exe", t: "Kal se pakka 🔥", time: "19h", l: "31", c: "", v: "820" },
    { n: "Neha Verma", h: "@neha.daily", t: "Motivation hit different at night", time: "17h", l: "22", c: "1", v: "610" },
    { n: "Kabir", h: "@kabir.clips", t: "Sab bolte hain, karta koi nahi 😭", time: "15h", l: "96", c: "3", v: "2.1K" },
    { n: "Sana Khan", h: "@sana.k", t: "Need this energy every day", time: "12h", l: "9", c: "", v: "290" },
    { n: "Rohan", h: "@rohan_07", t: "Done. Starting now.", time: "9h", l: "15", c: "", v: "410" }
];
document.getElementById('mainActions').innerHTML = actions('2.8K', comments.length, '39K');
document.getElementById('commentsHead').textContent = comments.length + ' comments';
document.getElementById('commentList').innerHTML = comments.map((c, i) => `
<div class="reply-item">
  <div class="reply-avatar-col"><img class="reply-avatar" loading="lazy" decoding="async" src="https://picsum.photos/seed/user${i}/100" alt="" onerror="this.style.visibility='hidden'"></div>
  <div class="reply-content-col">
    <span class="reply-name">${c.n}</span>
    <span class="reply-handle">${c.h}</span>
    <div class="reply-body-text">${c.t}</div>
    <div class="timestamp-line">${c.time}</div>
    <div class="post-actions-row">${actions(c.l, c.c, c.v)}</div>
  </div>
</div>`).join('');
const fmt = n => n < 1000 ? String(n) : n.toLocaleString('en-US');
function setLike(btn, on) {
    const row = btn.closest('.post-actions-row');
    const span = btn.querySelector('.btn-count');
    const base = +btn.dataset.base;
    btn.classList.toggle('liked', on);
    if (span)
        span.textContent = on ? fmt(base + 1) : (btn.dataset.orig || span.textContent);
    if (on && row)
        row.querySelector('.dislike-btn').classList.remove('disliked');
}
// Ek hi listener sab buttons ke liye (fast)
document.addEventListener('click', function (e) {
    const target = e.target;
    const el = target?.closest('[data-act],[data-go]');
    if (!el)
        return;
    if (el.dataset.go) {
        location.href = el.dataset.go;
        return;
    }
    const row = el.closest('.post-actions-row');
    if (el.dataset.act === 'like') {
        const span = el.querySelector('.btn-count');
        if (span && !el.dataset.orig)
            el.dataset.orig = span.textContent;
        setLike(el, !el.classList.contains('liked'));
    }
    else if (el.dataset.act === 'dislike') {
        const like = row.querySelector('.like-btn');
        const on = !el.classList.contains('disliked');
        el.classList.toggle('disliked', on);
        if (on && like.classList.contains('liked'))
            setLike(like, false);
    }
    else if (el.dataset.act === 'share') {
        if (navigator.share)
            navigator.share({ title: document.title, url: location.href }).catch(() => { });
    }
});
// Back -> Home (feed.html)
document.getElementById('backBtn').addEventListener('click', function () {
    location.href = 'feed.html';
});
Object.assign(window, { toNum, setLike });
export {};
