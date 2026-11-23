const replyInput = document.getElementById('replyInput');
const replyBtn = document.getElementById('replyBtn');
const photoInput = document.getElementById('photoInput');
const videoInput = document.getElementById('videoInput');
const mediaPreviewBox = document.getElementById('mediaPreviewBox');
const previewImageEl = document.getElementById('previewImageEl');
const previewVideoEl = document.getElementById('previewVideoEl');
const replyTargetUser = document.getElementById('replyTargetUser');
let attachedPhotoData = null;
let attachedVideoData = null;
// URL se dynamic username read karna (agar reply.html?to=@username pass karein)
const urlParams = new URLSearchParams(window.location.search);
const toUser = urlParams.get('to');
if (toUser) {
    replyTargetUser.innerText = toUser.startsWith('@') ? toUser : '@' + toUser;
}
// Go back to feed smoothly
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    }
    else {
        window.location.href = 'feed.html';
    }
}
// Check Eligibility to activate white button
function checkEligibility() {
    const hasText = replyInput.value.trim().length > 0;
    const hasMedia = attachedPhotoData !== null || attachedVideoData !== null;
    if (hasText || hasMedia) {
        replyBtn.classList.add('active');
    }
    else {
        replyBtn.classList.remove('active');
    }
}
// Auto resize reply textarea
replyInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    checkEligibility();
});
// ==========================================
// 1. PHOTO UPLOAD (Compressed)
// ==========================================
photoInput.addEventListener('change', function (e) {
    const file = e.target.files?.[0];
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = function (evt) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const maxDim = 800;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
                if (w > h) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                }
                else {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            attachedPhotoData = canvas.toDataURL('image/jpeg', 0.72);
            attachedVideoData = null;
            previewVideoEl.style.display = 'none';
            previewVideoEl.src = '';
            previewImageEl.src = attachedPhotoData;
            previewImageEl.style.display = 'block';
            mediaPreviewBox.style.display = 'block';
            checkEligibility();
        };
        img.src = evt.target?.result || '';
    };
    reader.readAsDataURL(file);
});
// ==========================================
// 2. VIDEO UPLOAD
// ==========================================
videoInput.addEventListener('change', function (e) {
    const file = e.target.files?.[0];
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = function (evt) {
        attachedVideoData = evt.target?.result || null;
        attachedPhotoData = null;
        previewImageEl.style.display = 'none';
        previewImageEl.src = '';
        previewVideoEl.src = attachedVideoData || '';
        previewVideoEl.style.display = 'block';
        mediaPreviewBox.style.display = 'block';
        checkEligibility();
    };
    reader.readAsDataURL(file);
});
function clearAttachedMedia() {
    attachedPhotoData = null;
    attachedVideoData = null;
    photoInput.value = '';
    videoInput.value = '';
    previewImageEl.src = '';
    previewVideoEl.src = '';
    previewImageEl.style.display = 'none';
    previewVideoEl.style.display = 'none';
    mediaPreviewBox.style.display = 'none';
    checkEligibility();
}
// ==========================================
// 3. LINK MODAL
// ==========================================
function openLinkModal() {
    const linkInp = document.getElementById('linkInputValue');
    linkInp.value = '';
    document.getElementById('linkModalOverlay').style.display = 'flex';
    setTimeout(() => linkInp.focus(), 100);
}
function closeLinkModal() {
    document.getElementById('linkModalOverlay').style.display = 'none';
}
function confirmInsertLink() {
    const url = document.getElementById('linkInputValue').value.trim();
    if (url) {
        replyInput.focus();
        replyInput.value += (replyInput.value ? " " : "") + url;
        checkEligibility();
    }
    closeLinkModal();
}
// Insert # and @
function insertText(char) {
    replyInput.focus();
    const start = replyInput.selectionStart || replyInput.value.length;
    const end = replyInput.selectionEnd || replyInput.value.length;
    const val = replyInput.value;
    replyInput.value = val.substring(0, start) + char + val.substring(end);
    replyInput.selectionStart = replyInput.selectionEnd = start + 1;
    replyInput.dispatchEvent(new Event('input'));
}
// ==========================================
// 4. SUBMIT REPLY ACTION
// ==========================================
function submitReply() {
    const text = replyInput.value.trim();
    if (!text && !attachedPhotoData && !attachedVideoData)
        return;
    replyBtn.innerText = 'Posting...';
    replyBtn.style.opacity = '0.6';
    // Smooth return to feed
    setTimeout(() => {
        goBack();
    }, 400);
}
// Mobile Keyboard Resize Support
if (window.visualViewport) {
    const handleResize = () => {
        const viewportHeight = window.visualViewport.height;
        document.getElementById('appScreen').style.height = `${viewportHeight}px`;
    };
    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
}
Object.assign(window, { goBack, checkEligibility, clearAttachedMedia, openLinkModal, closeLinkModal, confirmInsertLink, insertText, submitReply });
export {};
