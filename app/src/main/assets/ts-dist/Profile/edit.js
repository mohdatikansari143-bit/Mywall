const saveBtn = document.getElementById('saveBtn');
const fBio = document.getElementById('fBio');
const bioWordCounter = document.getElementById('bioWordCounter');
const bannerImg = document.getElementById('bannerImg');
const bannerCutBtn = document.getElementById('bannerCutBtn');
const linksContainer = document.getElementById('linksContainer');
const addMoreBtn = document.getElementById('addMoreLinkBtn');
const linksCountDisplay = document.getElementById('linksCountDisplay');
const ageBtnText = document.getElementById('ageBtnText');
const agePreviewBadge = document.getElementById('agePreviewBadge');
let bannerBase64 = '';
let selectedDob = '';
const MAX_WORDS = 100;
const MAX_LINKS = 3;
function markDirty() {
    saveBtn.classList.add('active');
}
// Instant Lag-Free Back Navigation
function goBack() {
    window.location.replace('profile.html');
}
function calculateAge(dobString) {
    if (!dobString)
        return null;
    const parts = dobString.split('-');
    if (parts.length !== 3)
        return null;
    const birth = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    if (isNaN(birth.getTime()))
        return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age >= 0 ? age : 0;
}
// 1. Telegram User Auto-Fetch (Hide Telegram native back button to avoid clash)
function initTelegramUser() {
    let name = "Telegram User";
    let username = "@user";
    let userId = "000000000";
    let photoUrl = "";
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
        // Hide Telegram native BackButton so it does NOT clash with our app button
        if (tg.BackButton && tg.BackButton.isVisible) {
            tg.BackButton.hide();
        }
        const user = tg.initDataUnsafe?.user;
        if (user) {
            name = [user.first_name, user.last_name].filter(Boolean).join(" ") || name;
            username = user.username ? `@${user.username}` : "@user";
            userId = user.id ? String(user.id) : userId;
            if (user.photo_url)
                photoUrl = user.photo_url;
        }
    }
    document.getElementById('tgName').innerText = name;
    document.getElementById('tgUsername').innerText = username;
    document.getElementById('tgUserId').innerText = userId;
    if (photoUrl) {
        document.getElementById('avatarImg').src = photoUrl;
    }
}
// 2. Strict 100 Words Bio
fBio.addEventListener('input', function () {
    let text = this.value;
    let words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length > MAX_WORDS) {
        const trimmedWords = words.slice(0, MAX_WORDS);
        this.value = trimmedWords.join(' ');
        words = trimmedWords;
        bioWordCounter.classList.add('limit-reached');
    }
    else {
        bioWordCounter.classList.remove('limit-reached');
    }
    bioWordCounter.innerText = `${words.length} / ${MAX_WORDS} words`;
    markDirty();
});
// 3. Dynamic Website Links
let linksList = [''];
function renderLinks() {
    linksContainer.innerHTML = '';
    linksList.forEach((val, idx) => {
        const row = document.createElement('div');
        row.className = 'link-row';
        row.innerHTML = `
          <input type="url" inputmode="url" placeholder="https://example.com" value="${val}" data-idx="${idx}">
          ${linksList.length > 1 ? `
            <button type="button" class="del-btn" onclick="removeLink(${idx})" title="Remove link">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          ` : ''}
        `;
        linksContainer.appendChild(row);
    });
    linksCountDisplay.innerText = `(${linksList.length}/${MAX_LINKS})`;
    if (linksList.length >= MAX_LINKS) {
        addMoreBtn.classList.add('disabled');
        addMoreBtn.innerText = 'Max 3 links reached';
    }
    else {
        addMoreBtn.classList.remove('disabled');
        addMoreBtn.innerHTML = `
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add more link
        `;
    }
    linksContainer.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const target = e.target;
            const index = Number(target.getAttribute('data-idx'));
            linksList[index] = target.value.trim();
            markDirty();
        });
    });
}
function addNewLinkBox() {
    if (linksList.length >= MAX_LINKS)
        return;
    linksList.push('');
    renderLinks();
    markDirty();
}
function removeLink(index) {
    if (linksList.length <= 1)
        return;
    linksList.splice(index, 1);
    renderLinks();
    markDirty();
}
// 4. Banner Strict 735x309 Check & Cut Button Logic
document.getElementById('bannerFile').addEventListener('change', function () {
    const file = this.files && this.files[0];
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            if (img.width !== 735 || img.height !== 309) {
                triggerToast('Only 735x309 px size is acceptable!');
                document.getElementById('bannerFile').value = '';
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.width = 735;
            canvas.height = 309;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 735, 309);
            bannerBase64 = canvas.toDataURL('image/jpeg', 0.9);
            bannerImg.src = bannerBase64;
            bannerImg.hidden = false;
            bannerCutBtn.style.display = 'flex';
            markDirty();
        };
        img.src = e.target?.result || '';
    };
    reader.readAsDataURL(file);
});
function openDeleteBannerModal(e) {
    if (e)
        e.stopPropagation();
    document.getElementById('confirmModal').classList.add('show');
}
function closeDeleteBannerModal() {
    document.getElementById('confirmModal').classList.remove('show');
}
function confirmDeleteBanner() {
    bannerBase64 = '';
    bannerImg.src = '';
    bannerImg.hidden = true;
    document.getElementById('bannerFile').value = '';
    bannerCutBtn.style.display = 'none';
    closeDeleteBannerModal();
    markDirty();
    triggerToast('Banner deleted');
}
// 5. Custom Dark Calendar Logic
const calModal = document.getElementById('calModal');
const calDaysGrid = document.getElementById('calDaysGrid');
const calMonthLabel = document.getElementById('calMonthLabel');
const calYearLabel = document.getElementById('calYearLabel');
const calPickerOverlay = document.getElementById('calPickerOverlay');
const calPickerTitle = document.getElementById('calPickerTitle');
const calPickerList = document.getElementById('calPickerList');
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let currentCalYear = 2006;
let currentCalMonth = 0;
let tempSelectedDate = null;
function openCalendarModal() {
    if (selectedDob) {
        const p = selectedDob.split('-');
        tempSelectedDate = {
            year: parseInt(p[0]),
            month: parseInt(p[1]) - 1,
            day: parseInt(p[2])
        };
        currentCalYear = tempSelectedDate.year;
        currentCalMonth = tempSelectedDate.month;
    }
    else {
        const defaultYear = 2006;
        currentCalYear = defaultYear;
        currentCalMonth = 0;
        tempSelectedDate = { year: defaultYear, month: 0, day: 1 };
    }
    updateCalendarLabels();
    renderCalDays();
    closeCustomPicker();
    calModal.classList.add('show');
}
function closeCalendarModal() {
    calModal.classList.remove('show');
    closeCustomPicker();
}
function updateCalendarLabels() {
    calMonthLabel.innerText = monthNames[currentCalMonth];
    calYearLabel.innerText = String(currentCalYear);
}
function changeMonth(delta) {
    currentCalMonth += delta;
    if (currentCalMonth < 0) {
        currentCalMonth = 11;
        currentCalYear--;
    }
    else if (currentCalMonth > 11) {
        currentCalMonth = 0;
        currentCalYear++;
    }
    updateCalendarLabels();
    renderCalDays();
}
function renderCalDays() {
    calDaysGrid.innerHTML = '';
    const firstDayIndex = new Date(currentCalYear, currentCalMonth, 1).getDay();
    const startOffset = (firstDayIndex + 6) % 7;
    const totalDaysInMonth = new Date(currentCalYear, currentCalMonth + 1, 0).getDate();
    for (let i = 0; i < startOffset; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'cal-day empty';
        calDaysGrid.appendChild(emptyDiv);
    }
    for (let d = 1; d <= totalDaysInMonth; d++) {
        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.className = 'cal-day';
        dayBtn.innerText = String(d);
        if (tempSelectedDate &&
            tempSelectedDate.year === currentCalYear &&
            tempSelectedDate.month === currentCalMonth &&
            tempSelectedDate.day === d) {
            dayBtn.classList.add('selected');
        }
        dayBtn.onclick = () => {
            tempSelectedDate = {
                year: currentCalYear,
                month: currentCalMonth,
                day: d
            };
            renderCalDays();
        };
        calDaysGrid.appendChild(dayBtn);
    }
}
function openCustomPicker(type) {
    calPickerList.innerHTML = '';
    if (type === 'month') {
        calPickerTitle.innerText = 'Select Month';
        monthNames.forEach((name, idx) => {
            const isSel = (idx === currentCalMonth);
            const row = document.createElement('div');
            row.className = `cal-picker-row ${isSel ? 'selected' : ''}`;
            row.innerHTML = `
            <div class="cal-radio-circle"></div>
            <span class="cal-picker-label">${name}</span>
          `;
            row.onclick = () => {
                currentCalMonth = idx;
                updateCalendarLabels();
                renderCalDays();
                closeCustomPicker();
            };
            calPickerList.appendChild(row);
        });
    }
    else if (type === 'year') {
        calPickerTitle.innerText = 'Select Year';
        const nowYear = new Date().getFullYear();
        for (let y = nowYear; y >= 1950; y--) {
            const isSel = (y === currentCalYear);
            const row = document.createElement('div');
            row.className = `cal-picker-row ${isSel ? 'selected' : ''}`;
            row.innerHTML = `
            <div class="cal-radio-circle"></div>
            <span class="cal-picker-label">${y}</span>
          `;
            row.onclick = () => {
                currentCalYear = y;
                updateCalendarLabels();
                renderCalDays();
                closeCustomPicker();
            };
            calPickerList.appendChild(row);
            if (isSel) {
                setTimeout(() => row.scrollIntoView({ block: 'center' }), 60);
            }
        }
    }
    calPickerOverlay.classList.add('open');
}
function closeCustomPicker() {
    calPickerOverlay.classList.remove('open');
}
function applySelectedDate() {
    if (!tempSelectedDate) {
        closeCalendarModal();
        return;
    }
    const y = tempSelectedDate.year;
    const m = String(tempSelectedDate.month + 1).padStart(2, '0');
    const d = String(tempSelectedDate.day).padStart(2, '0');
    selectedDob = `${y}-${m}-${d}`;
    const age = calculateAge(selectedDob);
    if (age !== null) {
        ageBtnText.innerText = `${age} years old (${selectedDob})`;
        agePreviewBadge.innerText = `${age} yrs`;
    }
    markDirty();
    closeCalendarModal();
}
// 6. Save Profile
function saveProfile() {
    const validLinks = Array.from(linksContainer.querySelectorAll('input'))
        .map(i => i.value.trim())
        .filter(Boolean);
    const profileData = {
        bio: fBio.value.trim(),
        dob: selectedDob,
        links: validLinks.length > 0 ? validLinks : [''],
        banner: bannerBase64
    };
    try {
        localStorage.setItem('trex_profile_data', JSON.stringify(profileData));
    }
    catch (e) { }
    saveBtn.classList.remove('active');
    triggerToast('Details saved');
}
function loadSavedProfile() {
    try {
        const data = JSON.parse(localStorage.getItem('trex_profile_data') || '{}');
        if (data.bio) {
            fBio.value = data.bio;
            const words = data.bio.trim().split(/\s+/).filter(Boolean);
            bioWordCounter.innerText = `${words.length} / ${MAX_WORDS} words`;
        }
        if (data.dob) {
            selectedDob = data.dob;
            const age = calculateAge(selectedDob);
            if (age !== null) {
                ageBtnText.innerText = `${age} years old (${selectedDob})`;
                agePreviewBadge.innerText = `${age} yrs`;
            }
        }
        if (data.links && Array.isArray(data.links) && data.links.length > 0) {
            linksList = data.links.slice(0, MAX_LINKS);
        }
        if (data.banner) {
            bannerBase64 = data.banner;
            bannerImg.src = bannerBase64;
            bannerImg.hidden = false;
            bannerCutBtn.style.display = 'flex';
        }
        else {
            bannerCutBtn.style.display = 'none';
        }
    }
    catch (err) { }
    renderLinks();
}
function triggerToast(text) {
    const toast = document.getElementById("toastPill");
    toast.innerText = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}
initTelegramUser();
loadSavedProfile();
Object.assign(window, { markDirty, goBack, calculateAge, initTelegramUser, renderLinks, addNewLinkBox, removeLink, openDeleteBannerModal, closeDeleteBannerModal, confirmDeleteBanner, openCalendarModal, closeCalendarModal, updateCalendarLabels, changeMonth, renderCalDays, openCustomPicker, closeCustomPicker, applySelectedDate, saveProfile, loadSavedProfile, triggerToast });
export {};
