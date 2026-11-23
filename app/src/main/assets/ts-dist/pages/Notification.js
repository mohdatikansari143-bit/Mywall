// ==========================================
// SLIDE & GESTURE SWIPE CONTROLLER
// ==========================================
let currentTabIndex = 0;
const totalTabs = 3;
const sliderTrack = document.getElementById('sliderTrack');
const tabButtons = document.querySelectorAll('.line-tab-btn');
const sliderViewport = document.getElementById('sliderViewport');
function goToTab(index) {
    if (index < 0 || index >= totalTabs)
        return;
    currentTabIndex = index;
    // Smooth horizontal slide
    sliderTrack.style.transform = `translateX(-${currentTabIndex * (100 / totalTabs)}%)`;
    // Update underline tab indicator
    tabButtons.forEach((btn, idx) => {
        if (idx === currentTabIndex) {
            btn.classList.add('active');
        }
        else {
            btn.classList.remove('active');
        }
    });
    // Close open dropdown menus on tab switch
    document.querySelectorAll('.action-dropdown-menu').forEach(m => m.classList.remove('show'));
}
// Tab buttons click to slide
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetIndex = parseInt(btn.getAttribute('data-index'), 10);
        goToTab(targetIndex);
    });
});
// Touch Swipe Detection (Left & Right Swipe)
let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;
sliderViewport.addEventListener('touchstart', (e) => {
    const target = e.target;
    if (target?.closest('.action-dropdown-menu') || target?.closest('.notif-more-btn'))
        return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
}, { passive: true });
sliderViewport.addEventListener('touchend', (e) => {
    if (!isSwiping)
        return;
    isSwiping = false;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    // Horizontal swipe dominant threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
        if (diffX > 0) {
            goToTab(currentTabIndex + 1);
        }
        else {
            goToTab(currentTabIndex - 1);
        }
    }
}, { passive: true });
// Mark as read on row tap
document.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const target = e.target;
        if (!target?.closest('.notif-right-actions')) {
            item.classList.remove('unread');
            item.classList.add('read');
        }
    });
});
// ==========================================
// 3-DOT MENU INTERACTIONS (Reply & Delete)
// ==========================================
document.addEventListener('click', (e) => {
    const target = e.target;
    const moreBtn = target?.closest('.notif-more-btn');
    if (moreBtn) {
        e.stopPropagation();
        const menu = moreBtn.nextElementSibling;
        const isOpen = menu?.classList.contains('show');
        // Close all other menus
        document.querySelectorAll('.action-dropdown-menu').forEach(m => m.classList.remove('show'));
        if (!isOpen && menu) {
            menu.classList.add('show');
        }
    }
    else {
        document.querySelectorAll('.action-dropdown-menu').forEach(m => m.classList.remove('show'));
    }
});
// Reply button action
document.addEventListener('click', (e) => {
    const target = e.target;
    const replyBtn = target?.closest('.reply-btn');
    if (replyBtn) {
        e.stopPropagation();
        const notifRow = replyBtn.closest('.notif-item');
        if (notifRow) {
            notifRow.classList.remove('unread');
            notifRow.classList.add('read');
        }
        replyBtn.closest('.action-dropdown-menu')?.classList.remove('show');
    }
});
// Delete button action with animation
document.addEventListener('click', (e) => {
    const target = e.target;
    const deleteBtn = target?.closest('.delete-btn');
    if (deleteBtn) {
        e.stopPropagation();
        const notifRow = deleteBtn.closest('.notif-item');
        if (notifRow) {
            notifRow.style.transition = 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)';
            notifRow.style.opacity = '0';
            notifRow.style.transform = 'translateX(24px)';
            setTimeout(() => {
                notifRow.remove();
            }, 220);
        }
    }
});
Object.assign(window, { goToTab });
export {};
