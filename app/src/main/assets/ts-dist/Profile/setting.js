/* ===== Account Settings Switches logic ===== */
var SW_KEYS = ['autoupdate', 'notification', 'replycomments', 'hideprofile', 'private'];
var SW_DEFAULT = { autoupdate: true, notification: true, replycomments: true, hideprofile: false, private: false };
var swState = {};
try {
    swState = JSON.parse(localStorage.getItem('trex_account_switches') || '{}');
}
catch (e) {
    swState = {};
}
function renderSwitch(k) {
    var on = (k in swState) ? swState[k] : SW_DEFAULT[k];
    var el = document.getElementById('sw-' + k);
    if (el)
        el.classList.toggle('on', !!on);
    if (k === 'private') {
        var st = document.getElementById('st-private');
        if (st)
            st.textContent = on ? 'Private' : 'Public';
    }
}
function toggleSwitch(k) {
    var cur = (k in swState) ? swState[k] : SW_DEFAULT[k];
    swState[k] = !cur;
    try {
        localStorage.setItem('trex_account_switches', JSON.stringify(swState));
    }
    catch (e) { }
    renderSwitch(k);
}
SW_KEYS.forEach(renderSwitch);
/* ===== Navigation Management for In-Page Subpages ===== */
function showPage(pageId) {
    document.getElementById('mainPage').classList.toggle('hidden', pageId !== 'main');
    document.getElementById('accountPage').classList.toggle('hidden', pageId !== 'account');
    document.getElementById('tonWalletPage').classList.toggle('hidden', pageId !== 'tonwallet');
}
function openAccount() { location.hash = 'account'; }
function closeAccount() { if (location.hash === '#account') {
    history.back();
}
else {
    showPage('main');
} }
function openTonWallet() { location.hash = 'tonwallet'; }
function closeTonWallet() { if (location.hash === '#tonwallet') {
    history.back();
}
else {
    showPage('main');
} }
function handleHashRoute() {
    var h = location.hash;
    if (h === '#account') {
        showPage('account');
    }
    else if (h === '#tonwallet') {
        showPage('tonwallet');
    }
    else {
        showPage('main');
    }
}
window.addEventListener('hashchange', handleHashRoute);
handleHashRoute();
function triggerToast(text) {
    const toast = document.getElementById("toastPill");
    toast.innerText = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}
/* ===== Official TON Connect SDK Integration ===== */
let tonConnectUI = null;
let connectedUserFriendlyAddress = "";
function initTonConnect() {
    try {
        if (typeof TON_CONNECT_UI !== 'undefined') {
            tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
                manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json',
                buttonRootId: 'ton-connect-btn'
            });
            tonConnectUI.onStatusChange((wallet) => {
                if (wallet && wallet.account) {
                    updateTonWalletState(wallet);
                }
                else {
                    resetTonWalletState();
                }
            });
        }
    }
    catch (err) {
        console.warn("TonConnect notice:", err);
    }
}
window.addEventListener('DOMContentLoaded', initTonConnect);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initTonConnect();
}
function updateTonWalletState(wallet) {
    const rawAddress = wallet.account.address;
    if (typeof TON_CONNECT_UI !== 'undefined' && TON_CONNECT_UI.toUserFriendlyAddress) {
        connectedUserFriendlyAddress = TON_CONNECT_UI.toUserFriendlyAddress(rawAddress);
    }
    else {
        connectedUserFriendlyAddress = rawAddress;
    }
    const badge = document.getElementById('tonStatusBadge');
    if (badge) {
        badge.className = "ton-status-badge connected";
        document.getElementById('tonStatusText').textContent = "Status: Success (Connected)";
    }
    const addrSec = document.getElementById('tonAddressSection');
    if (addrSec)
        addrSec.style.display = 'block';
    const addrDisp = document.getElementById('tonAddressDisplay');
    if (addrDisp)
        addrDisp.textContent = connectedUserFriendlyAddress;
    const connBtn = document.getElementById('connectWalletBtn');
    if (connBtn)
        connBtn.style.display = 'none';
    triggerToast("TON Wallet Connected Successfully!");
}
function resetTonWalletState() {
    connectedUserFriendlyAddress = "";
    const badge = document.getElementById('tonStatusBadge');
    if (badge) {
        badge.className = "ton-status-badge disconnected";
        document.getElementById('tonStatusText').textContent = "Disconnected";
    }
    const addrSec = document.getElementById('tonAddressSection');
    if (addrSec)
        addrSec.style.display = 'none';
    const addrDisp = document.getElementById('tonAddressDisplay');
    if (addrDisp)
        addrDisp.textContent = "";
    const connBtn = document.getElementById('connectWalletBtn');
    if (connBtn)
        connBtn.style.display = 'flex';
}
async function handleConnectWallet() {
    try {
        if (!tonConnectUI)
            initTonConnect();
        if (tonConnectUI) {
            await tonConnectUI.openModal();
        }
        else {
            const sdkBtn = document.querySelector('#ton-connect-btn button');
            if (sdkBtn)
                sdkBtn.click();
        }
    }
    catch (err) {
        console.error("Open modal error:", err);
        const sdkBtn = document.querySelector('#ton-connect-btn button');
        if (sdkBtn)
            sdkBtn.click();
    }
}
async function disconnectTonWallet() {
    if (tonConnectUI && tonConnectUI.connected) {
        await tonConnectUI.disconnect();
    }
    resetTonWalletState();
    triggerToast("Wallet Disconnected");
}
function copyTonAddress() {
    if (!connectedUserFriendlyAddress)
        return;
    navigator.clipboard.writeText(connectedUserFriendlyAddress).then(() => {
        triggerToast("TON Address Copied!");
    });
}
Object.assign(window, { renderSwitch, toggleSwitch, showPage, openAccount, closeAccount, openTonWallet, closeTonWallet, handleHashRoute, triggerToast, initTonConnect, updateTonWalletState, resetTonWalletState, handleConnectWallet, disconnectTonWallet, copyTonAddress });
export {};
