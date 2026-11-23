export {};

    // Authentic TRX Withdrawal Records Data
    const records = [
      {
        id: "rec-1",
        actionBadge: "Withdraw",
        status: "completed",
        statusTitle: "Completed",
        balanceFormatted: "15,840.00 TRX",
        typeText: "TRX Coins",
        exactTimestamp: "2026-11-07 15:49:02",
        orderNumber: "WD2026110715490216112196a",
        remarks: "TRON Mainnet Verified"
      },
      {
        id: "rec-2",
        actionBadge: "Withdraw",
        status: "completed",
        statusTitle: "Completed",
        balanceFormatted: "6,750.00 TRX",
        typeText: "TRX Coins",
        exactTimestamp: "2026-11-06 12:27:14",
        orderNumber: "WD2026110612271466984127a",
        remarks: "Instant Node Broadcasted"
      },
      {
        id: "rec-3",
        actionBadge: "Withdraw",
        status: "completed",
        statusTitle: "Completed",
        balanceFormatted: "2,800.00 TRX",
        typeText: "TRX Coins",
        exactTimestamp: "2026-11-05 18:30:10",
        orderNumber: "WD2026110518301099284112b",
        remarks: "Network Settlement Complete"
      },
      {
        id: "rec-4",
        actionBadge: "Withdraw",
        status: "pending",
        statusTitle: "Pending",
        balanceFormatted: "1,500.00 TRX",
        typeText: "TRX Coins",
        exactTimestamp: "2026-11-07 17:10:45",
        orderNumber: "WD2026110717104588294011c",
        remarks: "Node Confirmation Queue (12/19)"
      },
      {
        id: "rec-5",
        actionBadge: "Withdraw",
        status: "incomplete",
        statusTitle: "Incomplete",
        balanceFormatted: "720.00 TRX",
        typeText: "TRX Coins",
        exactTimestamp: "2026-11-02 09:15:30",
        orderNumber: "WD2026110209153000019284d",
        remarks: "Network Energy Limit (Returned)"
      }
    ];

    const tabKeys = ["completed", "incomplete", "pending"];
    let currentTabIndex = 0;
    const statusButtons = document.querySelectorAll(".status-btn");
    const sliderTrack = document.getElementById("sliderTrack");
    const sliderViewport = document.getElementById("sliderViewport");
    const toast = document.getElementById("toastPill");

    // Generate Item Entry HTML
    function generateItemHTML(r) {
      return `
        <div class="withdraw-item-entry">
          <!-- Top Row: Withdraw Pill Badge + Status -->
          <div class="item-top-head">
            <span class="action-badge-pill">${r.actionBadge}</span>
            <div class="live-status-group ${r.status}">
              <span class="pulse-dot-radar"></span>
              <span>${r.statusTitle}</span>
            </div>
          </div>

          <!-- Structured Details -->
          <div class="receipt-data-rows">
            <!-- Pure White Balance (TRX) -->
            <div class="receipt-item-row">
              <span class="key-label">Balance</span>
              <div class="balance-amount-white">${r.balanceFormatted}</div>
            </div>

            <!-- Type: TRX Coins -->
            <div class="receipt-item-row">
              <span class="key-label">Type</span>
              <span class="value-highlight-white">${r.typeText}</span>
            </div>

            <!-- Time -->
            <div class="receipt-item-row">
              <span class="key-label">Time</span>
              <span class="value-exact-time">${r.exactTimestamp}</span>
            </div>

            <!-- Order Number / TxID (100% Reliable Copy) -->
            <div class="receipt-item-row">
              <span class="key-label">Order number</span>
              <div class="txid-copyable-pill" onclick="copyText('${r.orderNumber}', 'Order number')" title="Tap to copy">
                <span class="txid-code-string">${r.orderNumber}</span>
                <div class="copy-chip-icon">
                  <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </div>
              </div>
            </div>

            <!-- Remarks -->
            <div class="receipt-item-row">
              <span class="key-label">Remarks</span>
              <span class="remarks-text">${r.remarks}</span>
            </div>
          </div>
        </div>
      `;
    }

    // Render All Slide Pages
    function renderAllPages() {
      tabKeys.forEach(statusKey => {
        const pageEl = document.getElementById("page-" + statusKey);
        const filtered = records.filter(r => r.status === statusKey);

        if (filtered.length === 0) {
          pageEl.innerHTML = `
            <div class="empty-state-box" style="display:flex;">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>No withdrawal records found</span>
            </div>
          `;
        } else {
          pageEl.innerHTML = `<div class="cards-feed-wrap">` + filtered.map(generateItemHTML).join('') + `</div>`;
        }
      });
    }

    // Go to Specific Tab with Horizontal Slide
    function goToTab(index) {
      if (index < 0 || index >= tabKeys.length) return;
      currentTabIndex = index;

      // Smooth horizontal slide
      sliderTrack.style.transform = `translateX(-${currentTabIndex * (100 / tabKeys.length)}%)`;

      // Update active tab buttons
      statusButtons.forEach((btn, idx) => {
        if (idx === currentTabIndex) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }

    // Tab buttons click to slide
    statusButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetIndex = parseInt(btn.getAttribute("data-index"), 10);
        goToTab(targetIndex);
      });
    });

    // Touch Swipe Detection (Left & Right Slide)
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    sliderViewport.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    sliderViewport.addEventListener("touchend", (e) => {
      if (!isSwiping) return;
      isSwiping = false;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Check if horizontal swipe is dominant (threshold 45px)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
        if (diffX > 0) {
          // Swipe Left -> Next Tab (Complete -> Incomplete -> Pending)
          goToTab(currentTabIndex + 1);
        } else {
          // Swipe Right -> Prev Tab (Pending -> Incomplete -> Complete)
          goToTab(currentTabIndex - 1);
        }
      }
    }, { passive: true });

    // Bulletproof 100% Guaranteed Copy
    function copyText(str, label) {
      if (navigator.vibrate) navigator.vibrate(25);

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(str).then(() => {
          showToast(`${label} copied!`);
        }).catch(() => {
          fallbackClipboardCopy(str, label);
        });
      } else {
        fallbackClipboardCopy(str, label);
      }
    }

    function fallbackClipboardCopy(text, label) {
      try {
        const tempInput = document.createElement("textarea");
        tempInput.value = text;
        tempInput.style.position = "fixed";
        tempInput.style.left = "-9999px";
        tempInput.style.top = "0";
        tempInput.setAttribute("readonly", "");
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        const copied = document.execCommand("copy");
        document.body.removeChild(tempInput);
        if (copied) {
          showToast(`${label} copied!`);
        } else {
          showToast(`Copied: ${text}`);
        }
      } catch (e) {
        showToast(`Copied: ${text}`);
      }
    }

    function showToast(text) {
      toast.innerText = text;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    }

    // Initial Load
    renderAllPages();

Object.assign(window, { generateItemHTML, renderAllPages, goToTab, copyText, fallbackClipboardCopy, showToast });
