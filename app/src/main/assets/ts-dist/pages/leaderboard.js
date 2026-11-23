const prefixes = [
    "Crypto", "Zaryab", "Alex", "Vikram", "Dmitry", "Farhan", "Satoshi", "Shadow",
    "Hunter", "Viper", "Phoenix", "Nova", "Titan", "Blade", "Zenith", "Apex",
    "Ghost", "Cyber", "Ahmad", "Rex", "Kaiser", "Lucas", "Elena", "Tariq",
    "Roman", "Klaus", "Marco", "Yuki", "Hassan", "Malik", "Omar", "Zero"
];
const suffixes = [
    "Miner", "Pro", "King", "Node", "Core", "Vault", "Boss", "Hash",
    "Prime", "X", "Alpha", "Elite", "99", "88", "77", "Max", "Rig", "Pool"
];
const TOTAL_MINERS = 100;
const allMiners = [];
let currentBalance = 98450.4;
for (let i = 1; i <= TOTAL_MINERS; i++) {
    const p = prefixes[(i * 7) % prefixes.length];
    const s = suffixes[(i * 13) % suffixes.length];
    const numTag = (i % 7 === 0) ? `_${(i * 3) % 99}` : "";
    const name = `${p}_${s}${numTag}`;
    if (i <= 3) {
        currentBalance -= 8200 + ((i * 170) % 500);
    }
    else if (i <= 15) {
        currentBalance -= 2100 + ((i * 53) % 250);
    }
    else if (i <= 50) {
        currentBalance -= 750 + ((i * 31) % 90);
    }
    else {
        currentBalance -= 320 + ((i * 13) % 40);
    }
    if (currentBalance < 450.0)
        currentBalance = 450.0;
    allMiners.push({
        rank: i,
        name: name,
        balance: currentBalance.toFixed(1),
        initial: name.charAt(0).toUpperCase()
    });
}
const fmt = v => Number(v).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
// Render 3D Gold, Silver & Bronze Glass Podium
const podiumArea = document.getElementById('podiumArea');
function renderPodium() {
    const first = allMiners[0];
    const second = allMiners[1];
    const third = allMiners[2];
    podiumArea.innerHTML = `
        <!-- 2nd Place: SILVER -->
        <div class="podium-column second">
          <div class="podium-user-info">
            <div class="podium-avatar">${second.initial}</div>
            <span class="podium-name">${second.name}</span>
            <span class="podium-stat-pill">${fmt(second.balance)} TRX</span>
          </div>
          <div class="podium-block-3d">
            <div class="pedestal-top"></div>
            <div class="pedestal-front">
              <span class="pedestal-num">2</span>
            </div>
          </div>
        </div>

        <!-- 1st Place: GOLD (Tallest + Trophy) -->
        <div class="podium-column first">
          <div class="podium-user-info">
            <div class="trophy-badge">🏆</div>
            <div class="podium-avatar">${first.initial}</div>
            <span class="podium-name">${first.name}</span>
            <span class="podium-stat-pill">${fmt(first.balance)} TRX</span>
          </div>
          <div class="podium-block-3d">
            <div class="pedestal-top"></div>
            <div class="pedestal-front">
              <span class="pedestal-num">1</span>
            </div>
          </div>
        </div>

        <!-- 3rd Place: BRONZE -->
        <div class="podium-column third">
          <div class="podium-user-info">
            <div class="podium-avatar">${third.initial}</div>
            <span class="podium-name">${third.name}</span>
            <span class="podium-stat-pill">${fmt(third.balance)} TRX</span>
          </div>
          <div class="podium-block-3d">
            <div class="pedestal-top"></div>
            <div class="pedestal-front">
              <span class="pedestal-num">3</span>
            </div>
          </div>
        </div>
      `;
}
// Render Remaining List (4 to 100)
const listContainer = document.getElementById('minersList');
const displayedData = allMiners.slice(3);
function renderListItems() {
    if (!displayedData.length) {
        listContainer.innerHTML = '<div class="empty-text">No miner found</div>';
        return;
    }
    listContainer.innerHTML = displayedData.map(m => `
        <div class="miner-row">
          <div class="miner-left-side">
            <span class="rank-pill">#${m.rank}</span>
            <div class="miner-avatar-mini">${m.initial}</div>
            <div class="miner-info">
              <span class="miner-name-text">${m.name}</span>
              <span class="miner-hash-text">${(32.4 + (m.rank % 12)).toFixed(1)} MH/s</span>
            </div>
          </div>
          <div class="miner-balance-right">
            <span class="miner-tr-val">${fmt(m.balance)} TRX</span>
            <div class="miner-status-badge">
              <span class="status-dot"></span> Active Node
            </div>
          </div>
        </div>
      `).join('');
}
renderPodium();
renderListItems();
Object.assign(window, { renderPodium, renderListItems });
export {};
