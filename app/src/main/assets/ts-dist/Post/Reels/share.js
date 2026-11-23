const inviteLink = "https://trexwallet.app/invite";
const shareMessage = "Check this out:";
const toast = document.getElementById("toast");
function showToast(text) {
    toast.innerText = text;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}
function openInNewTab(url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
// Social Sharing Handlers
function triggerShare(platform) {
    const encodedUrl = encodeURIComponent(inviteLink);
    const encodedText = encodeURIComponent(shareMessage);
    let target = "";
    switch (platform) {
        case 'whatsapp':
            target = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
            break;
        case 'telegram':
            target = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
            break;
        case 'facebook':
            target = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'snapchat':
            target = `https://www.snapchat.com/share?link=${encodedUrl}`;
            break;
        case 'gmail':
            target = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=Invite&body=${encodedText}%20${encodedUrl}`;
            break;
        case 'messages':
            window.location.href = `sms:?body=${encodedText}%20${encodedUrl}`;
            return;
        case 'pinterest':
            target = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`;
            break;
        case 'reddit':
            target = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
            break;
        case 'x':
            target = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            break;
        case 'threads':
            target = `https://threads.net/intent/post?text=${encodedText}%20${encodedUrl}`;
            break;
        case 'linkedin':
            target = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
        case 'tumblr':
            target = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedUrl}&caption=${encodedText}`;
            break;
        case 'bereal':
            navigator.clipboard.writeText(inviteLink);
            showToast("Link copied! Opening BeReal...");
            setTimeout(() => openInNewTab('https://bereal.com/'), 350);
            return;
        case 'discord':
            navigator.clipboard.writeText(inviteLink);
            showToast("Link copied! Opening Discord...");
            setTimeout(() => openInNewTab('https://discord.com/app'), 350);
            return;
        case 'instagram':
            navigator.clipboard.writeText(inviteLink);
            showToast("Link copied! Opening Instagram...");
            setTimeout(() => openInNewTab('https://www.instagram.com/'), 350);
            return;
    }
    if (target) {
        openInNewTab(target);
    }
}
// Line 2 Handlers
function copyLink() {
    navigator.clipboard.writeText(inviteLink).then(() => {
        showToast("Link copied to clipboard!");
    }).catch(() => {
        showToast("Failed to copy link");
    });
}
function shareVia() {
    if (navigator.share) {
        navigator.share({
            title: "TrexWallet",
            text: shareMessage,
            url: inviteLink,
        }).catch(() => { });
    }
    else {
        copyLink();
    }
}
function savePost() {
    showToast("Saved to your bookmarks!");
}
function downloadFile() {
    showToast("Download started...");
}
function reportAction() {
    showToast("Report submitted. Thank you!");
}
Object.assign(window, { showToast, openInNewTab, triggerShare, copyLink, shareVia, savePost, downloadFile, reportAction });
export {};
