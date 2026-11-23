try {
    sessionStorage.setItem('trex_intro_shown', '1');
}
catch (e) { }
const wrapper = document.getElementById('wrapper');
const video = document.getElementById('intro');
video.play().catch(() => { });
let redirected = false;
function goHome() {
    if (redirected)
        return;
    redirected = true;
    wrapper.classList.add('fade');
    setTimeout(() => {
        const q = window.location.search || '';
        const h = window.location.hash || '';
        const sep = q ? '&' : '?';
        const target = q.indexOf('intro=1') !== -1
            ? ('index.html' + q + h)
            : ('index.html' + q + sep + 'intro=1' + h);
        window.location.replace(target);
    }, 450);
}
// 2.5s intro + 0.45s fade (~3 seconds total)
setTimeout(goHome, 2500);
Object.assign(window, { goHome });
export {};
