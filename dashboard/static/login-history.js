// Login History JavaScript

let allSessions = [];
let currentFilter = 'all';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadSessionLogs();
    setupFilterButtons();
});

// Load user information
async function loadUserInfo() {
    try {
        const response = await fetch('/current_user');
        if (response.ok) {
            const user = await response.json();
            document.getElementById('usernameDisplay').textContent = user.username || 'User';
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

// Load session logs from API
async function loadSessionLogs() {
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const timelineContainer = document.getElementById('timelineContainer');

    try {
        loadingState.style.display = 'block';
        emptyState.style.display = 'none';
        timelineContainer.innerHTML = '';

        const response = await fetch('/session-logs');
        if (!response.ok) {
            throw new Error('Failed to fetch session logs');
        }

        allSessions = await response.json();

        loadingState.style.display = 'none';

        if (allSessions.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        updateStats();
        renderTimeline();
    } catch (error) {
        console.error('Error loading session logs:', error);
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
    }
}

// Update statistics
function updateStats() {
    const totalSessions = allSessions.length;
    const activeSessions = allSessions.filter(s => s.status === 'Active').length;
    
    // Calculate total time (in seconds)
    let totalSeconds = 0;
    let sessionsWithDuration = 0;
    
    allSessions.forEach(session => {
        if (session.duration) {
            totalSeconds += session.duration;
            sessionsWithDuration++;
        }
    });

    const avgSeconds = sessionsWithDuration > 0 ? totalSeconds / sessionsWithDuration : 0;

    // Update UI
    document.getElementById('totalSessions').textContent = totalSessions;
    document.getElementById('totalTime').textContent = formatDuration(totalSeconds);
    document.getElementById('avgSession').textContent = formatDuration(Math.round(avgSeconds));
    document.getElementById('activeSessions').textContent = activeSessions;
}

// Format duration from seconds to readable format
function formatDuration(seconds) {
    if (!seconds || seconds === 0) return '0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Format duration for display in session card (HH:MM:SS)
function formatSessionDuration(seconds) {
    if (!seconds || seconds === 0) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Format datetime for display
function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return 'N/A';
    
    const date = new Date(dateTimeStr);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options);
}

// Render timeline with sessions
function renderTimeline() {
    const timelineContainer = document.getElementById('timelineContainer');
    timelineContainer.innerHTML = '';

    // Filter sessions based on current filter
    let filteredSessions = allSessions;
    if (currentFilter === 'active') {
        filteredSessions = allSessions.filter(s => s.status === 'Active');
    } else if (currentFilter === 'ended') {
        filteredSessions = allSessions.filter(s => s.status === 'Ended');
    }

    if (filteredSessions.length === 0) {
        timelineContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No sessions found</h3>
                <p>No sessions match the selected filter.</p>
            </div>
        `;
        return;
    }

    filteredSessions.forEach((session, index) => {
        const timelineItem = createTimelineItem(session, index);
        timelineContainer.appendChild(timelineItem);
    });
}

// Create a single timeline item
function createTimelineItem(session, index) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.style.animationDelay = `${index * 0.1}s`;

    const isActive = session.status === 'Active';
    const dotIcon = isActive ? '🟢' : '⚪';

    item.innerHTML = `
        <div class="timeline-dot ${isActive ? 'active' : ''}">${dotIcon}</div>
        <div class="session-card ${isActive ? 'active-session' : ''}">
            <div class="session-header">
                <div class="session-id">Session #${session.id}</div>
                <div class="session-status ${isActive ? 'active' : 'ended'}">
                    ${session.status}
                </div>
            </div>
            <div class="session-details">
                <div class="detail-item">
                    <div class="detail-label">Login Time</div>
                    <div class="detail-value">${formatDateTime(session.login_time)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Logout Time</div>
                    <div class="detail-value">${formatDateTime(session.logout_time)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Duration</div>
                    <div class="detail-value duration">${formatSessionDuration(session.duration)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">IP Address</div>
                    <div class="detail-value ip">${session.ip_address || 'Unknown'}</div>
                </div>
            </div>
        </div>
    `;

    return item;
}

// Setup filter button handlers
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update filter and re-render
            currentFilter = button.dataset.filter;
            renderTimeline();
        });
    });
}

// Auto-refresh every minute for active sessions
setInterval(() => {
    if (allSessions.some(s => s.status === 'Active')) {
        loadSessionLogs();
    }
}, 60000); // 60 seconds
