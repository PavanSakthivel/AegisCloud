const BACKEND_URL = "http://localhost:8000";
let knownAlertIds = new Set();

/**
 * Fetch and sync dashboard data from the backend
 */
async function syncDashboard() {
  try {
    const res = await fetch(`${BACKEND_URL}/alerts`);
    if (!res.ok) throw new Error(`Server Error: ${res.status}`);

    const alerts = await res.json();
    updateMetrics(alerts);
    renderNewAlerts(alerts);
    showConnectionWarning(false);

  } catch (err) {
    console.error("Failed to sync AegisCloud:", err);
    showConnectionWarning(true);
  }
}

/**
 * Update top metric cards with smooth counting animations
 */
function updateMetrics(alerts) {
  const threatElement = document.getElementById("threats");
  const logElement = document.getElementById("totalLogs");

  // Animate Threats Count
  animateValue(
    threatElement,
    parseInt(threatElement.innerText.replace(/,/g, '')) || 0,
    alerts.length,
    500
  );

  // Animate Total Logs (Simulated multiplier)
  animateValue(
    logElement,
    parseInt(logElement.innerText.replace(/,/g, '')) || 0,
    alerts.length * 40,
    500
  );
}

/**
 * Render only NEW alerts to the list (avoids UI flickering)
 */
function renderNewAlerts(alerts) {
  const alertsList = document.getElementById("alerts");

  alerts.forEach(alert => {
    // Use log_id (from backend) to ensure we don't post the same alert twice
    if (knownAlertIds.has(alert.log_id)) return;
    knownAlertIds.add(alert.log_id);

    const isCritical = alert.threat_label === "Attack" || alert.severity === "high";

    const li = document.createElement("li");
    li.className = "p-4 flex items-start gap-4 hover:bg-white/5 transition border-b border-white/5 last:border-0";

    li.innerHTML = `
      <div class="${isCritical ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-400'} p-2 rounded-lg">
        <i class="fa-solid ${isCritical ? 'fa-shield-virus' : 'fa-triangle-exclamation'}"></i>
      </div>
      <div class="flex-1">
        <div class="flex justify-between">
          <span class="font-semibold text-sm">${alert.threat_label}</span>
          <span class="text-xs text-slate-500">${new Date().toLocaleTimeString()}</span>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          Action Taken:
          <span class="italic text-blue-400">${alert.action_taken}</span>
        </p>
      </div>
    `;

    // Prepend ensures the latest security threat is at the top
    alertsList.prepend(li);

    // Keep the DOM light (remove items older than the last 20)
    if (alertsList.children.length > 20) {
      alertsList.removeChild(alertsList.lastChild);
    }
  });
}

/**
 * Utility: Smoothly interpolates numbers
 */
function animateValue(element, start, end, duration) {
  if (start === end) return;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    element.innerText = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/**
 * UI Feedback: Changes the status dot color if backend is unreachable
 */
function showConnectionWarning(isError) {
  const statusDot = document.querySelector('.bg-green-500, .bg-red-500');
  const statusText = statusDot?.parentElement;
  
  if (statusDot) {
    statusDot.className = isError ? "w-2 h-2 bg-red-500 rounded-full" : "w-2 h-2 bg-green-500 rounded-full";
  }
  if (statusText) {
    statusText.className = isError 
      ? "flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20"
      : "flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20";
  }
}

// Start syncing
syncDashboard();
setInterval(syncDashboard, 5000);