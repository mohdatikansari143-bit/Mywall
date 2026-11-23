const toast = document.getElementById('toastPill');
function showToast(message) {
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}
// Retry Button Click
function triggerRetry() {
    showToast("Checking Trex Key... Activation locked until Jan 1, 2027.");
}
// Help Center Blue Link Click
function openHelpCenter() {
    alert("Trex Wallet Support & FAQ:\n\n" +
        "Q: Why are withdrawals locked?\n" +
        "A: All early mining rewards are held in cold-vault escrow until network mainnet validation.\n\n" +
        "Q: When is the Trex Key available?\n" +
        "A: Official distribution begins on January 1, 2027.\n\n" +
        "Need personal help? Contact: support@trexminer.app");
}
Object.assign(window, { showToast, triggerRetry, openHelpCenter });
export {};
