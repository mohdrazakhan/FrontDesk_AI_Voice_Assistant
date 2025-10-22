// --- Notification and User Profile Dropdown Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle logic
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function openSidebar() {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }

    menuToggle.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Close sidebar when clicking on nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            closeSidebar();
        });
    });

    // Notification dropdown logic
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const notifBadge = document.getElementById('notif-badge');
    const notifList = document.getElementById('notif-list');

    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = notifDropdown.classList.toggle('open');
        notifBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        // Hide user dropdown if open
        document.getElementById('user-dropdown').classList.remove('open');
    });

    // User profile dropdown logic
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userDropdown = document.getElementById('user-dropdown');
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = userDropdown.classList.toggle('open');
        userProfileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        notifDropdown.classList.remove('open');
        notifBtn.setAttribute('aria-expanded', 'false');
    });

    // Hide dropdowns on outside click
    document.addEventListener('click', () => {
        notifDropdown.classList.remove('open');
        notifBtn.setAttribute('aria-expanded', 'false');
        userDropdown.classList.remove('open');
        userProfileBtn.setAttribute('aria-expanded', 'false');
    });

    // Settings and logout actions
    document.getElementById('user-settings-btn').addEventListener('click', (e) => {
        e.preventDefault();
        userDropdown.style.display = 'none';
        // Try to call showPage if available, else fallback to navigation
        if (typeof showPage === 'function') {
            showPage('settings');
        } else {
            // Fallback: simulate click on Settings nav item
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                if (item.textContent.includes('Settings')) {
                    item.click();
                }
            });
        }
    });
    document.getElementById('user-logout-btn').addEventListener('click', () => {
        handleLogout();
    });

    // Fetch user info and update UI
    fetch('/settings/profile').then(r => r.json()).then(user => {
        // Topbar
    // Always set user-profile-name to username for stat matching
    document.getElementById('user-profile-name').textContent = user.username || 'User';
        document.getElementById('user-profile-img').src = user.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.username || 'User')}&background=6366f1&color=fff&size=128`;
        // Dropdown
        document.getElementById('user-dropdown-fullname').textContent = user.full_name || user.username || 'User';
        document.getElementById('user-dropdown-email').textContent = user.email || '';
        document.getElementById('user-dropdown-role').textContent = user.role || '';
        document.getElementById('user-dropdown-img').src = user.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.username || 'User')}&background=6366f1&color=fff&size=128`;
    });

    // Fetch recent questions for notifications
    let seenNotifications = JSON.parse(localStorage.getItem('seenNotifications') || '[]');
    
    // Browser notification for new escalations
    function notifySupervisorNewEscalation(question) {
        const title = 'New Escalation';
        const body = question.question_text.length > 72 ? question.question_text.slice(0,72)+'…' : question.question_text;
        if (window.Notification && Notification.permission === 'granted') {
            new Notification(title, { body });
        } else if (window.Notification && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body });
                } else {
                    showToast('New escalation: ' + body, 'info');
                }
            });
        } else {
            showToast('New escalation: ' + body, 'info');
        }
    }

    let lastPendingIds = [];
    function updateNotifications() {
        fetch('/requests').then(r => r.json()).then(requests => {
            // Only PENDING questions (no answer)
            const pending = requests.filter(r => !r.answer);
            // New questions are those not in seenNotifications
            const newQuestions = pending.filter(q => !seenNotifications.includes(q.id));
            // Browser notification for truly new escalations
            const pendingIds = pending.map(q => q.id);
            if (lastPendingIds.length > 0) {
                // Notify for any new pending not in lastPendingIds
                pending.forEach(q => {
                    if (!lastPendingIds.includes(q.id)) {
                        notifySupervisorNewEscalation(q);
                    }
                });
            }
            lastPendingIds = pendingIds;
            // Update badge with count of NEW questions only
            notifBadge.textContent = newQuestions.length;
            notifBadge.style.display = newQuestions.length > 0 ? 'block' : 'none';
            // Show most recent 6 pending questions in dropdown
            const recent = pending.slice(0, 6);
            notifList.innerHTML = '';
            if (recent.length === 0) {
                notifList.innerHTML = '<li class="notif-empty">No pending questions</li>';
            } else {
                recent.forEach(q => {
                    const li = document.createElement('li');
                    const isNew = !seenNotifications.includes(q.id);
                    li.className = `notif-item ${isNew ? 'notif-new' : ''}`;
                    const time = q.created_at ? new Date(q.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '';
                    li.innerHTML = `
                        ${isNew ? '<span class="notif-dot"></span>' : '<span class="notif-dot-seen"></span>'}
                        <div class="notif-content">
                            <div class="notif-title">${escapeHtml(q.question_text.length > 72 ? q.question_text.slice(0,72)+'…' : q.question_text)}</div>
                            <div class="notif-meta">From ${escapeHtml(q.customer_identifier || 'unknown')} • ${time}</div>
                        </div>`;
                    li.onclick = () => {
                        // Mark as seen when clicked
                        if (!seenNotifications.includes(q.id)) {
                            seenNotifications.push(q.id);
                            localStorage.setItem('seenNotifications', JSON.stringify(seenNotifications));
                        }
                        notifDropdown.classList.remove('open');
                        showPage('dashboard');
                        // Scroll to the question in recent section
                        setTimeout(() => {
                            const questionTile = document.querySelector(`[data-request-id="${q.id}"]`);
                            if (questionTile) {
                                questionTile.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }, 300);
                    };
                    notifList.appendChild(li);
                });
            }
        }).catch(err => console.error('Error fetching notifications:', err));
    }
    
    // Initial load
    updateNotifications();
    
    // Mark all as seen when notification dropdown is opened
    notifBtn.addEventListener('click', () => {
        setTimeout(() => {
            if (notifDropdown.classList.contains('open')) {
                fetch('/requests').then(r => r.json()).then(requests => {
                    const pending = requests.filter(r => !r.answer);
                    pending.forEach(q => {
                        if (!seenNotifications.includes(q.id)) {
                            seenNotifications.push(q.id);
                        }
                    });
                    localStorage.setItem('seenNotifications', JSON.stringify(seenNotifications));
                    notifBadge.textContent = '0';
                    notifBadge.style.display = 'none';
                });
            }
        }, 500);
    });
});
// Modern Dashboard JS
const state = {
    requests: [],
    isLoading: false,
    lastUpdate: null,
    userInputs: {},
    lastInteractionTime: null,
    userRole: null // Store user role for access control
};

// Wait for DOM to be ready before getting elements
let elements = {};

function initializeElements() {
    elements = {
        container: document.getElementById('requests-grid'),
        statusFilter: document.getElementById('status-filter'),
        graphCanvas: document.getElementById('pending-chart'),
        activeTimeCanvas: document.getElementById('active-time-chart'),
        refreshBtn: document.getElementById('refresh-btn'),
        pendingCount: document.getElementById('pending-count'),
        lastUpdated: document.getElementById('last-updated'),
        navItems: Array.from(document.querySelectorAll('.nav-item')),
        pages: {
            dashboard: document.getElementById('page-dashboard'),
            requests: document.getElementById('page-requests'),
            knowledge: document.getElementById('page-knowledge'),
            supervisors: document.getElementById('page-supervisors'),
            settings: document.getElementById('page-settings')
        },
        requestsTableBody: document.getElementById('requests-table-body'),
        knowledgeTableBody: document.getElementById('knowledge-table-body'),
        registrationsList: document.getElementById('registrations-list')
    };
    
    console.log('Elements initialized:', {
        graphCanvas: elements.graphCanvas,
        activeTimeCanvas: elements.activeTimeCanvas,
        hasGraphCanvas: !!elements.graphCanvas,
        hasActiveTimeCanvas: !!elements.activeTimeCanvas
    });
}

async function fetchRequests() {
    // Demo data for standalone HTML
    try {
        const response = await fetch('/requests');
        if (!response.ok) {
            showToast('Failed to load requests. Please refresh.', 'error');
            throw new Error('Failed to fetch requests');
        }
        return await response.json();
    } catch (error) {
        showToast('Network error loading requests.', 'error');
        console.error('Error fetching requests:', error);
        return [];
    }
}

async function fetchKnowledgeBase() {
    try {
        const response = await fetch('/knowledge_base');
        if (!response.ok) {
            showToast('Failed to load knowledge base.', 'error');
            throw new Error('Failed to fetch knowledge base');
        }
        return await response.json();
    } catch (error) {
        showToast('Network error loading knowledge base.', 'error');
        console.error('Error fetching knowledge base:', error);
        return [];
    }
}
// Legacy renderer (inline answer cards) is deprecated.
// Delegate to the modern grid + modal renderer to avoid double rendering.
function renderRequests() {
    renderRequestsTable();
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
}
function saveCurrentInputs() {
    const textareas = document.querySelectorAll('.answer-input');
    textareas.forEach(textarea => {
        if (textarea.value.trim()) {
            const requestId = textarea.id.replace('answer-', '');
            state.userInputs[requestId] = textarea.value;
        }
    });
}
function restoreSavedInputs() {
    Object.keys(state.userInputs).forEach(requestId => {
        const textarea = document.getElementById(`answer-${requestId}`);
        if (textarea && state.userInputs[requestId]) {
            textarea.value = state.userInputs[requestId];
        }
    });
}
function createRequestCard(request) {
    const timestamp = formatTimestamp(request.created_at);
    const statusTag = request.supervisor_answer ? 'Solved' : 'Unresolved';
    const badgeClass = request.supervisor_answer ? 'badge-solved' : 'badge-unresolved';
    
    // Split timestamp into date and time
    const [datePart, timePart] = timestamp.split(' at ');
    
    return `
        <div class="request-card" data-request-id="${request.id}">
            <div class="card-id-section">
                <div class="card-id-label">ID</div>
                <div class="card-id-value">${request.id}</div>
            </div>
            <div class="card-customer-section">
                <div class="card-customer-label">Customer</div>
                <div class="card-customer-value">${escapeHtml(request.customer_identifier)}</div>
            </div>
            <div class="card-datetime-section">
                <div class="card-date">${datePart}</div>
                <div class="card-time">${timePart}</div>
            </div>
            <span class="request-badge ${badgeClass}">${statusTag}</span>
            <div class="question-section">${escapeHtml(request.question_text)}</div>
            <div class="answer-section">
                <textarea class="answer-input" id="answer-${request.id}" placeholder="Type your answer here..." rows="2">${state.userInputs[request.id] || ''}</textarea>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="handleSubmitAnswer(${request.id})">✓ Submit Answer</button>
                    <button class="btn btn-danger" onclick="handleDeleteRequest(${request.id})">✕ Delete</button>
                    <button class="btn btn-bookmark" onclick="handleBookmark(${request.id})">🔖 Save</button>
                </div>
            </div>
        </div>
    `;
}
function updateStats() {
    const pending = state.requests.filter(r => !r.supervisor_answer).length;
    const resolved = state.requests.filter(r => r.supervisor_answer).length;
    const total = state.requests.length;
    
    if (elements.pendingCount) elements.pendingCount.textContent = pending;
    const resolvedEl = document.getElementById('resolved-count');
    if (resolvedEl) resolvedEl.textContent = resolved;
    const totalEl = document.getElementById('total-count');
    if (totalEl) totalEl.textContent = total;
    if (state.lastUpdate && elements.lastUpdated) {
        const time = state.lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        elements.lastUpdated.textContent = time;
    }
}
async function handleSubmitAnswer(requestId) {
    const input = document.getElementById(`answer-${requestId}`);
    const answer = input?.value.trim();
    if (!answer) {
        alert('\u26a0\ufe0f Please provide an answer before submitting.');
        input?.focus();
        return;
    }
    try {
        const response = await fetch(`/requests/${requestId}/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer })
        });
        if (!response.ok) throw new Error('Failed to submit answer');
        await loadRequests();
    } catch (error) {
        alert('\u274c Failed to submit answer. Please try again.');
    }
}
async function handleDeleteRequest(requestId) {
    if (!confirm(`Are you sure you want to delete Request #${requestId}?`)) return;
    try {
        const response = await fetch(`/requests/${requestId}/delete`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete request');
        await loadRequests();
    } catch (error) {
        alert('❌ Failed to delete request. Please try again.');
    }
}

function refreshRequests() {
    showToast('Refreshing requests...', 'info');
    loadRequests();
}

function handleBookmark(requestId) {
    // Save bookmark to localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedRequests') || '[]');
    if (!bookmarks.includes(requestId)) {
        bookmarks.push(requestId);
        localStorage.setItem('bookmarkedRequests', JSON.stringify(bookmarks));
        alert(`✅ Request #${requestId} bookmarked for later!`);
    } else {
        alert(`ℹ️ Request #${requestId} is already bookmarked.`);
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear timer session data
        localStorage.removeItem('sessionStartTime');
        localStorage.removeItem('totalElapsedTime');
        console.log('🔴 Timer reset on logout');
        
        window.location.href = '/logout';
    }
}

async function handleRefresh() {
    await loadRequests();
}
function handleFilterChange() {
    renderRequestsTable();
    updateGraph();
}
async function loadRequests() {
    state.isLoading = true;
    state.requests = await fetchRequests();
    state.lastUpdate = new Date();
    state.isLoading = false;
    renderRequestsTable();
    updateStats();
    updateGraph();
}
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown time';
    try {
        let date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'Unknown time';
        const localDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
        const dateStr = localDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = localDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${dateStr} at ${timeStr}`;
    } catch (error) {
        return 'Unknown time';
    }
}
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
}

// Toast notification function
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        font-weight: 600;
        animation: slideDown 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateGraph() {
    console.log('=== updateGraph called ===');
    
    if (!elements.graphCanvas) {
        console.error('❌ Graph canvas element not found!');
        console.log('Trying to find canvas by ID...');
        elements.graphCanvas = document.getElementById('pending-chart');
        if (!elements.graphCanvas) {
            console.error('❌ Still cannot find canvas element!');
            return;
        }
        console.log('✅ Found canvas element:', elements.graphCanvas);
    }
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('⏳ Chart.js not loaded yet, retrying in 200ms...');
        setTimeout(updateGraph, 200);
        return;
    }
    
    console.log('✅ Chart.js is loaded');
    console.log('📊 Canvas element:', elements.graphCanvas);
    console.log('📊 Canvas dimensions:', {
        width: elements.graphCanvas.width,
        height: elements.graphCanvas.height,
        clientWidth: elements.graphCanvas.clientWidth,
        clientHeight: elements.graphCanvas.clientHeight
    });
    
    // Use supervisor_answer for resolved, and resolved_by for user count
    const solved = state.requests.filter(r => r.supervisor_answer).length;
    const unresolved = state.requests.filter(r => !r.supervisor_answer).length;
    const total = state.requests.length;

    // Get logged-in username from DOM (set in topbar)
    const userName = document.getElementById('user-profile-name')?.textContent?.trim();
    const mySolved = state.requests.filter(r => r.supervisor_answer && (r.resolved_by === userName)).length;
    // Update stat card for "Your Solved"
    const mySolvedEl = document.getElementById('my-solved-count');
    if (mySolvedEl) mySolvedEl.textContent = mySolved;

    console.log('📈 Chart Data:', { 
        total, 
        solved, 
        unresolved, 
        mySolved,
        userName,
        requestsCount: state.requests.length,
        requests: state.requests 
    });
    
    // Destroy existing chart if any
    if (window.statusChart && typeof window.statusChart.destroy === 'function') {
        console.log('🗑️ Destroying old chart...');
        window.statusChart.destroy();
        window.statusChart = null;
    }
    
    try {
        // Get fresh canvas context
        const ctx = elements.graphCanvas.getContext('2d');
        console.log('🎨 Canvas context obtained:', ctx);
        
        // Create chart
        window.statusChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Solved', 'Unresolved'],
                datasets: [{
                    label: 'Questions',
                    data: [solved, unresolved],
                    backgroundColor: [
                        '#10b981',
                        '#ef4444'
                    ],
                    borderColor: [
                        '#059669',
                        '#dc2626'
                    ],
                    borderWidth: 2,
                    borderRadius: 10,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed.y + ' question' + (context.parsed.y !== 1 ? 's' : '');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        console.log('✅ Questions chart created successfully!');
    } catch (error) {
        console.error('❌ Error creating chart:', error);
    }
    
    // Update active time chart
    updateActiveTimeChart();
}

async function updateActiveTimeChart() {
    console.log('=== updateActiveTimeChart called ===');
    
    if (!elements.activeTimeCanvas) {
        console.error('❌ Active time canvas element not found!');
        console.log('Trying to find canvas by ID...');
        elements.activeTimeCanvas = document.getElementById('active-time-chart');
        if (!elements.activeTimeCanvas) {
            console.error('❌ Still cannot find active time canvas!');
            return;
        }
        console.log('✅ Found active time canvas:', elements.activeTimeCanvas);
    }
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('⏳ Chart.js not loaded yet for active time, retrying in 200ms...');
        setTimeout(updateActiveTimeChart, 200);
        return;
    }
    
    console.log('✅ Chart.js is loaded for active time');
    console.log('📊 Canvas element:', elements.activeTimeCanvas);
    
    try {
        // Fetch user activity logs (voice customers)
        // Fetch user activity logs (voice customers)
        const response = await fetch('/user-activity');
        if (!response.ok) {
            console.error('❌ Failed to fetch user activity');
            return;
        }
        const logs = await response.json();
        console.log('📊 Raw activity logs:', logs);
        
        // Aggregate total active time per user
        const userTimes = {};
        logs.forEach(log => {
            const user = log.username || 'Unknown';
            // Only include if username does NOT start with 'identity-'
            if (!user.startsWith('identity-')) {
                const duration = Math.abs(parseFloat(log.duration_minutes) || 0); // Ensure positive
                userTimes[user] = (userTimes[user] || 0) + duration;
            }
        });
        
        const labels = Object.keys(userTimes);
        const dataValues = Object.values(userTimes).map(val => Math.abs(val)); // Ensure all values are positive
        
        console.log('📈 Active time data (aggregated per user):', { labels, dataValues });
        // Handle empty data
        const displayLabels = labels.length > 0 ? labels : ['No Active Users'];
        const displayValues = dataValues.length > 0 ? dataValues : [0];
        // Destroy existing chart
        if (window.activeTimeChart && typeof window.activeTimeChart.destroy === 'function') {
            console.log('🗑️ Destroying old active time chart...');
            window.activeTimeChart.destroy();
            window.activeTimeChart = null;
        }
        // Get fresh canvas context
        const ctx = elements.activeTimeCanvas.getContext('2d');
        console.log('🎨 Canvas context obtained:', ctx);
        // Create chart
        window.activeTimeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: displayLabels,
                datasets: [{
                    label: 'Active Time (min)',
                    data: displayValues,
                    backgroundColor: '#667eea',
                    borderColor: '#5568d3',
                    borderWidth: 2,
                    borderRadius: 10,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return 'Time: ' + Math.abs(context.parsed.y).toFixed(1) + ' min';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0, // Force minimum to be 0
                        ticks: {
                            stepSize: 50,
                            precision: 0,
                            callback: function(value) {
                                return Math.abs(value); // Ensure positive display
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        title: {
                            display: true,
                            text: 'Minutes',
                            font: { size: 12 }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Users',
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
        
        console.log('✅ Active time chart created successfully!');
    } catch (error) {
        console.error('❌ Error creating active time chart:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements first
    initializeElements();
    
    // Check if user is admin and show registrations menu
    checkUserRole();
    
    // Add search event listener for knowledge base
    const knowledgeSearchInput = document.getElementById('knowledge-search');
    if (knowledgeSearchInput) {
        let searchTimeout;
        knowledgeSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchKnowledge();
            }, 300); // Debounce 300ms
        });
    }
    
    // Navigation logic - Make globally accessible
    window.showPage = function showPage(page) {
        // Check if user is trying to access Supervisors page without admin role
        if (page === 'supervisors' && state.userRole !== 'admin') {
            showToast('Access denied. Only admins can access the Supervisors page.', 'error');
            // Redirect to dashboard
            page = 'dashboard';
        }
        
        Object.values(elements.pages).forEach(p => p.style.display = 'none');
        elements.pages[page].style.display = 'block';
        
        // Update sidebar nav items
        elements.navItems.forEach(item => item.classList.remove('active'));
        const navMap = {dashboard: 0, requests: 1, knowledge: 2, supervisors: 3, settings: 4};
        if (navMap[page] !== undefined) elements.navItems[navMap[page]].classList.add('active');
        
        // Update topbar nav links
        const topbarNavLinks = document.querySelectorAll('.nav-link');
        topbarNavLinks.forEach(link => {
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Save current page to localStorage
        localStorage.setItem('currentPage', page);
    }
    // Sidebar navigation
    elements.navItems[0].addEventListener('click', e => {e.preventDefault(); showPage('dashboard');});
    elements.navItems[1].addEventListener('click', e => {e.preventDefault(); showPage('requests'); renderRequestsTable();});
    elements.navItems[2].addEventListener('click', e => {e.preventDefault(); showPage('knowledge'); renderKnowledgeTable();});
    elements.navItems[3].addEventListener('click', e => {e.preventDefault(); showPage('supervisors'); loadSupervisors('approved');});
    elements.navItems[4].addEventListener('click', e => {e.preventDefault(); showPage('settings'); loadUserProfile();});

    // Topbar navigation links
    const topbarNavLinks = document.querySelectorAll('.nav-link');
    topbarNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            // Remove active class from all links
            topbarNavLinks.forEach(l => l.classList.remove('active'));
            elements.navItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Navigate to page
            switch(page) {
                case 'dashboard':
                    showPage('dashboard');
                    break;
                case 'requests':
                    showPage('requests');
                    renderRequestsTable();
                    break;
                case 'knowledge':
                    showPage('knowledge');
                    renderKnowledgeTable();
                    break;
                case 'supervisors':
                    showPage('supervisors');
                    loadSupervisors('approved');
                    break;
                case 'settings':
                    showPage('settings');
                    loadUserProfile();
                    break;
            }
        });
    });

    // Initial page - restore last visited page or default to dashboard
    let lastPage = localStorage.getItem('currentPage') || 'dashboard';
    
    // If non-admin user tries to access supervisors page, redirect to dashboard
    if (lastPage === 'supervisors' && state.userRole !== 'admin') {
        lastPage = 'dashboard';
        localStorage.setItem('currentPage', 'dashboard');
    }
    
    showPage(lastPage);
    
    // Load page-specific data after showing the page
    if (lastPage === 'requests') {
        setTimeout(() => renderRequestsTable(), 100);
    } else if (lastPage === 'knowledge') {
        setTimeout(() => renderKnowledgeTable(), 100);
    } else if (lastPage === 'supervisors') {
        setTimeout(() => loadSupervisors('approved'), 100);
    } else if (lastPage === 'settings') {
        setTimeout(() => loadUserProfile(), 100);
    }
    
    // Small delay to ensure everything is loaded
    setTimeout(() => {
        console.log('✨ Loading requests and initializing charts...');
        console.log('Canvas elements check:', {
            graphCanvas: !!elements.graphCanvas,
            activeTimeCanvas: !!elements.activeTimeCanvas,
            graphId: elements.graphCanvas?.id,
            activeTimeId: elements.activeTimeCanvas?.id
        });
        loadRequests().then(() => {
            console.log('✅ Requests loaded, updating charts...');
            updateGraph();
        });
    }, 100);
    
    setInterval(() => {
        const now = Date.now();
        const timeSinceLastInteraction = state.lastInteractionTime ? now - state.lastInteractionTime : Infinity;
        if (timeSinceLastInteraction > 3000) {
            loadRequests();
        }
    }, 10000);
    elements.statusFilter.addEventListener('change', handleFilterChange);
    elements.refreshBtn.addEventListener('click', handleRefresh);
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('answer-input')) {
            state.lastInteractionTime = Date.now();
        }
    });
    document.addEventListener('focusin', (e) => {
        if (e.target.classList.contains('answer-input')) {
            state.lastInteractionTime = Date.now();
        }
    });
    
    // Initialize Settings page
    initializeSettings();
    
    // Modal close/cancel logic
    const closeModalBtn = document.getElementById('close-answer-modal');
    const cancelBtn = document.getElementById('cancel-answer-btn');
    const sendBtn = document.getElementById('send-answer-btn');
    
    console.log('🔧 Modal buttons found:', {
        closeBtn: !!closeModalBtn,
        cancelBtn: !!cancelBtn,
        sendBtn: !!sendBtn
    });
    
    if (closeModalBtn) closeModalBtn.onclick = closeAnswerModal;
    if (cancelBtn) cancelBtn.onclick = closeAnswerModal;
    if (sendBtn) {
        console.log('✅ Attaching send button handler');
        sendBtn.onclick = async function() {
            console.log('📤 Send button clicked!');
            const modal = document.getElementById('answer-modal');
            const reqId = modal.getAttribute('data-request-id');
            const answer = document.getElementById('modal-answer-text').value.trim();
            
            console.log('📝 Sending answer:', { reqId, answerLength: answer.length });
            
            if (!answer) {
                showToast('Please enter an answer', 'error');
                return;
            }
            
            if (!reqId) {
                console.error('❌ No request ID found!');
                showToast('Error: No request ID', 'error');
                return;
            }
            
            try {
                console.log(`🌐 Posting to /requests/${reqId}/respond endpoint...`);
                const response = await fetch(`/requests/${reqId}/respond`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        answer: answer
                    })
                });
                
                console.log('📨 Response status:', response.status);
                
                if (response.ok) {
                    showToast('Answer sent successfully! ✅', 'success');
                    closeAnswerModal();
                    document.getElementById('modal-answer-text').value = '';
                    
                    // Reload dashboard data to show updated status
                    if (typeof loadRequests === 'function') {
                        loadRequests();
                    }
                    
                    // Also reload dashboard data if on dashboard page
                    if (window.location.pathname.includes('dashboard')) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                } else {
                    const errorText = await response.text();
                    console.error('❌ Server error:', errorText);
                    showToast('Failed to send answer', 'error');
                }
            } catch (error) {
                console.error('❌ Error sending answer:', error);
                showToast('Network error occurred', 'error');
            }
        };
    } else {
        console.error('❌ Send button not found!');
    }
});

async function renderRequestsTable() {
    const requestsGrid = document.getElementById('requests-grid');
    const requestsEmpty = document.getElementById('requests-empty');
    const statusFilter = document.getElementById('status-filter');
    if (!requestsGrid) return;
    requestsGrid.innerHTML = '';


    let filtered = state.requests;
    if (statusFilter && statusFilter.value !== 'all') {
        filtered = filtered.filter(r => {
            if (statusFilter.value === 'pending') return !r.supervisor_answer;
            if (statusFilter.value === 'resolved') return r.supervisor_answer;
            if (statusFilter.value === 'unresolved') return !r.supervisor_answer;
            return true;
        });
    }

    // Deduplicate by question_text and customer_identifier (show only the most recent per unique question per customer)
    const dedupedMap = new Map();
    for (const r of filtered) {
        if (!r.question_text) continue;
        const key = r.customer_identifier + '||' + r.question_text.trim().toLowerCase();
        // Always keep the request with the highest id (most recent)
        if (!dedupedMap.has(key) || r.id > dedupedMap.get(key).id) {
            dedupedMap.set(key, r);
        }
    }
    const beforeDedup = filtered.length;
    filtered = Array.from(dedupedMap.values());
    console.log(`Deduplication: ${beforeDedup} requests → ${filtered.length} unique requests`);

    if (!filtered || filtered.length === 0) {
        requestsGrid.style.display = 'none';
        if (requestsEmpty) requestsEmpty.style.display = 'block';
        return;
    }
    requestsGrid.style.display = 'grid';
    if (requestsEmpty) requestsEmpty.style.display = 'none';

    // Check bookmarks for each request
    for (const r of filtered) {
        const idx = filtered.indexOf(r);
        const status = r.supervisor_answer ? 'Resolved' : 'Unresolved';
        const statusClass = r.supervisor_answer ? 'resolved' : '';
        const isBookmarked = await checkIfBookmarked(r.id);
        const bookmarkClass = isBookmarked ? 'bookmarked' : '';
        
        const card = document.createElement('div');
        card.className = 'request-card';
        card.style.animationDelay = `${idx * 0.05}s`;
        card.innerHTML = `
            <span class="bookmark-icon ${bookmarkClass}" data-request-id="${r.id}" title="Bookmark this question">🔖</span>
            <div class="request-header">
                <span class="request-id">${r.id}</span>
                <span class="request-customer">${escapeHtml(r.customer_identifier)}</span>
            </div>
            <div class="request-question">${escapeHtml(r.question_text)}</div>
            <span class="request-status ${statusClass}">${status}</span>
            <div class="request-actions">
                <button class="btn-request-action btn-reply" data-request-id="${r.id}" data-idx="${idx}" title="Reply"><span>💬</span> Reply</button>
                <button class="btn-request-action btn-delete" data-request-id="${r.id}" data-idx="${idx}" title="Delete"><span>🗑️</span> Delete</button>
            </div>
        `;
        requestsGrid.appendChild(card);
    }

    // Wire up bookmark icons
    requestsGrid.querySelectorAll('.bookmark-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const requestId = this.getAttribute('data-request-id');
            toggleBookmark(requestId, this);
        });
    });

    // Wire up actions
    requestsGrid.querySelectorAll('.btn-reply').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            const req = filtered[idx];
            showAnswerModal(req);
        });
    });
    requestsGrid.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            const req = filtered[idx];
            handleDeleteRequest(req);
        });
    });
    
    // Load bookmarks
    loadBookmarks();
}

// Modal logic
function showAnswerModal(request) {
    const modal = document.getElementById('answer-modal');
    const questionText = document.getElementById('modal-question-text');
    const answerText = document.getElementById('modal-answer-text');
    modal.style.display = 'flex';
    questionText.textContent = request.question_text;
    answerText.value = '';
    // Store current request id for answer
    modal.setAttribute('data-request-id', request.id);
}

function closeAnswerModal() {
    const modal = document.getElementById('answer-modal');
    if (modal) modal.style.display = 'none';
}

// Bookmark Management
let bookmarks = [];

async function loadBookmarksFromAPI() {
    try {
        const response = await fetch('/bookmarks');
        if (response.ok) {
            bookmarks = await response.json();
        } else {
            bookmarks = [];
        }
    } catch (e) {
        console.error('Error loading bookmarks:', e);
        bookmarks = [];
    }
}

async function checkIfBookmarked(requestId) {
    try {
        const response = await fetch(`/bookmarks/check/${requestId}`);
        if (response.ok) {
            const data = await response.json();
            return data.bookmarked;
        }
    } catch (e) {
        console.error('Error checking bookmark:', e);
    }
    return false;
}

async function toggleBookmark(requestId, iconElement) {
    const isCurrentlyBookmarked = iconElement.classList.contains('bookmarked');
    
    try {
        if (isCurrentlyBookmarked) {
            // Remove bookmark
            const response = await fetch(`/bookmarks/${requestId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                iconElement.classList.remove('bookmarked');
                showToast('Bookmark removed', 'info');
                await loadBookmarks();
            } else {
                const error = await response.json();
                showToast(error.error || 'Failed to remove bookmark', 'error');
            }
        } else {
            // Add bookmark
            const response = await fetch('/bookmarks/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ request_id: requestId })
            });
            
            if (response.ok) {
                iconElement.classList.add('bookmarked');
                showToast('Added to bookmarks', 'success');
                await loadBookmarks();
            } else {
                const error = await response.json();
                showToast(error.error || 'Failed to add bookmark', 'error');
            }
        }
    } catch (e) {
        console.error('Error toggling bookmark:', e);
        showToast('Failed to update bookmark', 'error');
    }
}

async function loadBookmarks() {
    await loadBookmarksFromAPI();
    const bookmarksSection = document.getElementById('bookmarks-section');
    const bookmarksGrid = document.getElementById('bookmarks-grid');
    const bookmarksCount = document.getElementById('bookmarks-count');
    
    if (!bookmarksGrid || !bookmarksSection) return;
    
    if (bookmarks.length === 0) {
        bookmarksSection.style.display = 'none';
        return;
    }
    
    bookmarksSection.style.display = 'block';
    bookmarksCount.textContent = bookmarks.length;
    bookmarksGrid.innerHTML = '';
    
    bookmarks.forEach((bookmark, idx) => {
        const bookmarkCard = document.createElement('div');
        bookmarkCard.className = 'bookmark-card';
        bookmarkCard.style.animationDelay = `${idx * 0.05}s`;
        bookmarkCard.innerHTML = `
            <div class="bookmark-meta">
                <span class="request-id">${bookmark.requestId}</span>
                <span class="request-customer">${escapeHtml(bookmark.customer)}</span>
                <span class="bookmark-by">📌 ${escapeHtml(bookmark.bookmarkedBy)}</span>
            </div>
            <div class="bookmark-question">${escapeHtml(bookmark.question)}</div>
            <div class="bookmark-actions">
                <button class="btn-bookmark-action btn-view-bookmark" data-request-id="${bookmark.requestId}">View</button>
                <button class="btn-bookmark-action btn-remove-bookmark" data-request-id="${bookmark.requestId}">Remove</button>
            </div>
        `;
        bookmarksGrid.appendChild(bookmarkCard);
    });
    
    // Wire up bookmark actions
    bookmarksGrid.querySelectorAll('.btn-view-bookmark').forEach(btn => {
        btn.addEventListener('click', function() {
            const requestId = this.getAttribute('data-request-id');
            const request = state.requests.find(r => r.id == requestId);
            if (request) {
                showAnswerModal(request);
            }
        });
    });
    
    bookmarksGrid.querySelectorAll('.btn-remove-bookmark').forEach(btn => {
        btn.addEventListener('click', async function() {
            const requestId = this.getAttribute('data-request-id');
            
            try {
                const response = await fetch(`/bookmarks/${requestId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showToast('Bookmark removed', 'info');
                    await loadBookmarks();
                    renderRequestsTable(); // Refresh to update bookmark icons
                } else {
                    const error = await response.json();
                    showToast(error.error || 'Failed to remove bookmark', 'error');
                }
            } catch (e) {
                console.error('Error removing bookmark:', e);
                showToast('Failed to remove bookmark', 'error');
            }
        });
    });
}

// Save request to knowledge base
async function handleSaveRequest(request) {
    if (!request.answer) {
        alert('Cannot save: This request has no answer yet. Please answer it first.');
        return;
    }
    
    if (confirm(`Save this Q&A to the knowledge base?\n\nQ: ${request.question_text}\nA: ${request.answer}`)) {
        try {
            const response = await fetch('/knowledge_base/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    question: request.question_text,
                    answer: request.answer
                })
            });
            
            if (response.ok) {
                alert('Successfully saved to knowledge base!');
            } else {
                const error = await response.json();
                alert('Failed to save: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving to knowledge base:', error);
            alert('Error saving to knowledge base. Please try again.');
        }
    }
}

// Delete request
async function handleDeleteRequest(request) {
    if (confirm(`Are you sure you want to delete this request?\n\nID: ${request.id}\nCustomer: ${request.customer_identifier}\nQuestion: ${request.question_text}`)) {
        try {
            const response = await fetch(`/requests/${request.id}/delete`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Request deleted successfully!');
                // Reload requests to update the UI
                await loadRequests();
                renderRequestsTable();
            } else {
                const error = await response.json();
                alert('Failed to delete: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting request:', error);
            alert('Error deleting request. Please try again.');
        }
    }
}

function renderKnowledgeTable() {
    console.log('=== renderKnowledgeTable called ===');
    
    const knowledgeGrid = document.getElementById('knowledge-grid');
    const knowledgeEmpty = document.getElementById('knowledge-empty');
    const kbTotalCount = document.getElementById('kb-total-count');
    
    if (!knowledgeGrid) {
        console.error('ERROR: knowledge-grid element not found!');
        return;
    }
    
    knowledgeGrid.innerHTML = '';
    console.log('Fetching knowledge base...');
    
    fetchKnowledgeBase().then(kb => {
        console.log('Knowledge base data received:', kb);
        console.log('Number of entries:', kb ? kb.length : 0);
        
        // Update stats counter
        if (kbTotalCount) {
            kbTotalCount.textContent = kb ? kb.length : 0;
        }
        
        if (!kb || kb.length === 0) {
            console.log('No entries, showing empty state');
            knowledgeGrid.style.display = 'none';
            if (knowledgeEmpty) knowledgeEmpty.style.display = 'block';
            return;
        }
        
        // Hide empty state, show grid
        knowledgeGrid.style.display = 'grid';
        if (knowledgeEmpty) knowledgeEmpty.style.display = 'none';
        
        console.log('Rendering', kb.length, 'knowledge base entries');
        kb.forEach((entry, index) => {
            console.log(`Rendering entry ${index + 1}:`, entry);
            const card = createKnowledgeCard(entry, index);
            knowledgeGrid.appendChild(card);
        });
        console.log('Knowledge base rendered successfully');
    }).catch(error => {
        console.error('Error in renderKnowledgeTable:', error);
    });
}

function createKnowledgeCard(entry, index) {
    const card = document.createElement('div');
    card.className = 'knowledge-card';
    card.style.animationDelay = `${index * 0.05}s`;
    
    card.innerHTML = `
        <div class="knowledge-card-header">
            <div class="knowledge-icon">❓</div>
            <h4 class="knowledge-question">${escapeHtml(entry.question)}</h4>
        </div>
        <div class="knowledge-answer">
            <p>${escapeHtml(entry.answer)}</p>
        </div>
        <div class="knowledge-footer">
            <span class="kb-id">Entry #${entry.id}</span>
            <div class="kb-actions">
                <button class="kb-action-btn btn-edit-kb" onclick="editKnowledgeEntry(${entry.id})">
                    ✏️ Edit
                </button>
                <button class="kb-action-btn btn-delete-kb" onclick="deleteKnowledgeEntry(${entry.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function toggleAddKnowledgeForm() {
    const form = document.getElementById('add-knowledge-form');
    const isHidden = form.style.display === 'none' || !form.style.display;
    
    if (isHidden) {
        form.style.display = 'block';
        const questionInput = document.getElementById('new-kb-question');
        if (questionInput) questionInput.focus();
    } else {
        form.style.display = 'none';
        // Clear form
        const questionInput = document.getElementById('new-kb-question');
        const answerInput = document.getElementById('new-kb-answer');
        if (questionInput) questionInput.value = '';
        if (answerInput) answerInput.value = '';
    }
}

async function saveNewKnowledgeEntry() {
    const questionInput = document.getElementById('new-kb-question');
    const answerInput = document.getElementById('new-kb-answer');
    
    if (!questionInput || !answerInput) {
        showToast('Form inputs not found', 'error');
        return;
    }
    
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    
    if (!question || !answer) {
        showToast('Please fill in both question and answer', 'error');
        return;
    }
    
    try {
        const response = await fetch('/knowledge_base/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, answer })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showToast('Knowledge entry added successfully!', 'success');
            toggleAddKnowledgeForm();
            renderKnowledgeTable();
        } else {
            showToast(result.error || 'Failed to add entry', 'error');
        }
    } catch (error) {
        console.error('Error adding knowledge entry:', error);
        showToast('Network error occurred', 'error');
    }
}

function searchKnowledge() {
    const searchInput = document.getElementById('knowledge-search');
    const knowledgeCards = document.querySelectorAll('.knowledge-card');
    const knowledgeGrid = document.getElementById('knowledge-grid');
    const knowledgeEmpty = document.getElementById('knowledge-empty');
    
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;
    
    knowledgeCards.forEach(card => {
        const question = card.querySelector('.knowledge-question').textContent.toLowerCase();
        const answer = card.querySelector('.knowledge-answer p').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show empty state if no matches
    if (visibleCount === 0 && searchTerm) {
        knowledgeGrid.style.display = 'none';
        if (knowledgeEmpty) {
            knowledgeEmpty.style.display = 'block';
            knowledgeEmpty.querySelector('h3').textContent = 'No matches found';
            knowledgeEmpty.querySelector('p').textContent = `No knowledge entries match "${searchTerm}"`;
        }
    } else if (visibleCount === 0) {
        knowledgeGrid.style.display = 'none';
        if (knowledgeEmpty) {
            knowledgeEmpty.style.display = 'block';
            knowledgeEmpty.querySelector('h3').textContent = 'No Knowledge Entries Yet';
            knowledgeEmpty.querySelector('p').textContent = 'Get started by adding your first knowledge base entry!';
        }
    } else {
        knowledgeGrid.style.display = 'grid';
        if (knowledgeEmpty) knowledgeEmpty.style.display = 'none';
    }
}

async function editKnowledgeEntry(id) {
    try {
        // Fetch current knowledge base to find the entry
        const kb = await fetchKnowledgeBase();
        const entry = kb.find(e => e.id === id);
        
        if (!entry) {
            showToast('Knowledge entry not found', 'error');
            return;
        }
        
        // Populate the edit form
        document.getElementById('edit-kb-id').value = id;
        document.getElementById('edit-kb-question').value = entry.question;
        document.getElementById('edit-kb-answer').value = entry.answer;
        
        // Show the edit modal
        document.getElementById('edit-knowledge-modal').style.display = 'block';
    } catch (error) {
        console.error('Error loading knowledge entry for edit:', error);
        showToast('Failed to load knowledge entry', 'error');
    }
}

function closeEditKnowledgeModal() {
    document.getElementById('edit-knowledge-modal').style.display = 'none';
    document.getElementById('edit-kb-id').value = '';
    document.getElementById('edit-kb-question').value = '';
    document.getElementById('edit-kb-answer').value = '';
}

async function saveEditedKnowledgeEntry() {
    const id = document.getElementById('edit-kb-id').value;
    const question = document.getElementById('edit-kb-question').value.trim();
    const answer = document.getElementById('edit-kb-answer').value.trim();
    
    if (!question || !answer) {
        showToast('Please fill in both question and answer', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/knowledge_base/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, answer })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Knowledge entry updated successfully!', 'success');
            closeEditKnowledgeModal();
            renderKnowledgeTable();
        } else {
            showToast(data.error || 'Failed to update entry', 'error');
        }
    } catch (error) {
        console.error('Error updating knowledge entry:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

async function deleteKnowledgeEntry(id) {
    if (!confirm('Are you sure you want to delete this knowledge entry? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/knowledge_base/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Knowledge entry deleted successfully!', 'success');
            renderKnowledgeTable();
        } else {
            showToast(data.error || 'Failed to delete entry', 'error');
        }
    } catch (error) {
        console.error('Error deleting knowledge entry:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

// Make knowledge functions globally accessible
window.toggleAddKnowledgeForm = toggleAddKnowledgeForm;
window.saveNewKnowledgeEntry = saveNewKnowledgeEntry;
window.editKnowledgeEntry = editKnowledgeEntry;
window.deleteKnowledgeEntry = deleteKnowledgeEntry;
window.closeEditKnowledgeModal = closeEditKnowledgeModal;
window.saveEditedKnowledgeEntry = saveEditedKnowledgeEntry;

// Registration management functions
async function checkUserRole() {
    try {
        const response = await fetch('/check-auth');
        const data = await response.json();
        
        // Store user role in state
        state.userRole = data.role;
        
        if (data.role === 'admin') {
            // Show all admin-only menu items for admins
            const adminOnlyNavItems = document.querySelectorAll('.admin-only');
            adminOnlyNavItems.forEach(item => {
                item.style.display = 'block';
            });
        } else {
            // Hide Supervisors page for non-admin users
            const supervisorNavLinks = document.querySelectorAll('[data-page="supervisors"]');
            supervisorNavLinks.forEach(link => {
                link.style.display = 'none';
            });
        }
    } catch (error) {
        console.error('Error checking user role:', error);
    }
}

// Registration functions removed - now managed through Supervisor Management
/*
async function loadRegistrations() {
    // Removed - registrations now managed through Supervisors page
}

async function approveRegistration(id) {
    // Removed - use Supervisor approval instead
}

async function rejectRegistration(id) {
    // Removed - use Supervisor rejection instead
}
*/

// ===== Supervisor Management Functions =====

// Initialize supervisor management
document.addEventListener('DOMContentLoaded', function() {
    // Setup supervisor form submission
    const supervisorForm = document.getElementById('add-supervisor-form');
    if (supervisorForm) {
        supervisorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addNewSupervisor();
        });
    }
    
    // Setup tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchSupervisorTab(tab);
        });
    });
});

function switchSupervisorTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tab) {
            btn.classList.add('active');
        }
    });
    
    // Hide all tab contents
    document.getElementById('active-supervisors').style.display = 'none';
    document.getElementById('pending-supervisors').style.display = 'none';
    document.getElementById('rejected-supervisors').style.display = 'none';
    
    // Show selected tab
    document.getElementById(`${tab}-supervisors`).style.display = 'block';
    
    // Load supervisors for this tab
    loadSupervisors(tab === 'active' ? 'approved' : tab);
}

async function loadSupervisors(status = 'approved') {
    try {
        const response = await fetch(`/supervisors?status=${status}`);
        if (!response.ok) throw new Error('Failed to load supervisors');
        
        const supervisors = await response.json();
        
        // Update stats
        updateSupervisorStats(supervisors, status);
        
        renderSupervisors(supervisors, status);
    } catch (error) {
        console.error('Error loading supervisors:', error);
        const container = document.getElementById(`${status === 'approved' ? 'active' : status}-supervisors-list`);
        if (container) {
            container.innerHTML = '<div class="error-state"><p>Failed to load supervisors</p></div>';
        }
    }
}

async function updateSupervisorStats(currentList, currentStatus) {
    try {
        // Fetch all statuses to get accurate counts
        const [approvedRes, pendingRes] = await Promise.all([
            fetch('/supervisors?status=approved'),
            fetch('/supervisors?status=pending')
        ]);
        
        const approved = await approvedRes.json();
        const pending = await pendingRes.json();
        
        document.getElementById('active-count').textContent = approved.length;
        document.getElementById('pending-count').textContent = pending.length;
        document.getElementById('total-count').textContent = approved.length + pending.length;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

function renderSupervisors(supervisors, status) {
    const containerId = status === 'approved' ? 'active-supervisors-list' : `${status}-supervisors-list`;
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    if (supervisors.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No ${status} supervisors found</p></div>`;
        return;
    }
    
    container.innerHTML = supervisors.map(supervisor => createSupervisorCard(supervisor, status)).join('');
}

function createSupervisorCard(supervisor, status) {
    const roleClass = supervisor.role === 'admin' ? 'admin' : '';
    const cardClass = status === 'rejected' ? 'rejected' : status === 'pending' ? 'pending' : '';
    
    // Check if this is the protected 'admin' username
    const isProtectedAdmin = supervisor.username === 'admin';
    
    // Get initials for avatar
    const initials = supervisor.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    
    let actionsHtml = '';
    if (status === 'approved') {
        if (isProtectedAdmin) {
            // Protected admin - no actions allowed
            actionsHtml = `
                <div class="protected-notice">
                    Protected System Administrator
                </div>
            `;
        } else {
            // Regular supervisor - show edit and remove buttons
            actionsHtml = `
                <div class="supervisor-actions">
                    <button class="btn-edit" onclick="editSupervisorRole(${supervisor.id}, '${escapeHtml(supervisor.role)}', '${escapeHtml(supervisor.full_name)}')">✏️ Edit Role</button>
                    <button class="btn-remove" onclick="removeSupervisor(${supervisor.id})">🗑️ Remove</button>
                </div>
            `;
        }
    } else if (status === 'pending') {
        actionsHtml = `
            <div class="supervisor-actions">
                <button class="btn-approve" onclick="approveSupervisor(${supervisor.id})">✅ Approve</button>
                <button class="btn-reject" onclick="rejectSupervisor(${supervisor.id})">❌ Reject</button>
            </div>
        `;
    }
    
    let detailsHtml = '';
    if (supervisor.approved_by && supervisor.approved_at) {
        detailsHtml += `
            <div class="detail-row">
                <span class="detail-label">Approved By</span>
                <span class="detail-value">${escapeHtml(supervisor.approved_by)}</span>
            </div>
        `;
    }
    
    if (supervisor.created_at) {
        detailsHtml += `
            <div class="detail-row">
                <span class="detail-label">Joined</span>
                <span class="detail-value">${formatTimestamp(supervisor.created_at)}</span>
            </div>
        `;
    }
    
    let rejectionInfo = '';
    if (status === 'rejected' && supervisor.rejection_reason) {
        rejectionInfo = `
            <div style="background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 8px; margin-top: 1rem; border-left: 3px solid #ef4444;">
                <p style="font-weight: 600; color: #dc2626; margin-bottom: 0.5rem;">❌ Rejection Reason:</p>
                <p style="color: #374151; margin-bottom: 0.5rem;">${escapeHtml(supervisor.rejection_reason)}</p>
                <p style="font-size: 0.8rem; color: #6b7280;">Rejected by <strong>${escapeHtml(supervisor.rejected_by)}</strong> on ${formatTimestamp(supervisor.rejected_at)}</p>
            </div>
        `;
    }
    
    const statusBadgeClass = status === 'approved' ? 'active' : status;
    const statusText = status === 'approved' ? 'Active' : status.charAt(0).toUpperCase() + status.slice(1);
    
    return `
        <div class="supervisor-card ${roleClass} ${cardClass}">
            <div class="supervisor-header">
                <div class="supervisor-avatar ${roleClass}">${initials}</div>
                <div class="supervisor-info">
                    <div class="supervisor-name">
                        ${escapeHtml(supervisor.full_name)}
                        <span class="role-badge ${supervisor.role}">${supervisor.role}</span>
                    </div>
                    <div class="supervisor-username">@${escapeHtml(supervisor.username)}</div>
                    <div class="supervisor-email">${escapeHtml(supervisor.email)}</div>
                </div>
            </div>
            
            <div class="supervisor-details">
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="status-badge ${statusBadgeClass}">${statusText}</span>
                </div>
                ${detailsHtml}
            </div>
            
            ${rejectionInfo}
            ${actionsHtml}
        </div>
    `;
}

// Edit supervisor role
async function addNewSupervisor() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const email = document.getElementById('new-email').value;
    const full_name = document.getElementById('new-fullname').value;
    const role = document.getElementById('new-role').value;
    
    if (!username || !password || !email || !full_name) {
        alert('❌ Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch('/supervisors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                email,
                full_name,
                role
            })
        });
        
        if (response.ok) {
            alert('✅ Supervisor added successfully');
            document.getElementById('add-supervisor-form').reset();
            loadSupervisors('approved'); // Refresh active supervisors list
        } else {
            const data = await response.json();
            alert('❌ Failed to add supervisor: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error adding supervisor:', error);
        alert('❌ An error occurred while adding supervisor');
    }
}

async function removeSupervisor(id) {
    if (!confirm('Are you sure you want to remove this supervisor?')) {
        return;
    }
    
    try {
        const response = await fetch(`/supervisors/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✅ Supervisor removed successfully');
            loadSupervisors('approved'); // Refresh list
        } else {
            const data = await response.json();
            alert('❌ Failed to remove supervisor: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error removing supervisor:', error);
        alert('❌ An error occurred while removing supervisor');
    }
}

async function approveSupervisor(id) {
    try {
        const response = await fetch(`/supervisors/${id}/approve`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('✅ Supervisor approved successfully');
            loadSupervisors('pending'); // Refresh pending list
        } else {
            const data = await response.json();
            alert('❌ Failed to approve supervisor: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error approving supervisor:', error);
        alert('❌ An error occurred while approving supervisor');
    }
}

async function rejectSupervisor(id) {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    try {
        const response = await fetch(`/supervisors/${id}/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason })
        });
        
        if (response.ok) {
            alert('✅ Supervisor rejected');
            loadSupervisors('pending'); // Refresh pending list
        } else {
            const data = await response.json();
            alert('❌ Failed to reject supervisor: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error rejecting supervisor:', error);
        alert('❌ An error occurred while rejecting supervisor');
    }
}

async function editSupervisorRole(id, currentRole, fullName) {
    const newRole = currentRole === 'admin' ? 'supervisor' : 'admin';
    const roleText = newRole === 'admin' ? 'Admin' : 'Supervisor';
    
    if (!confirm(`Are you sure you want to change ${fullName}'s role to ${roleText}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/supervisors/${id}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole })
        });
        
        if (response.ok) {
            alert(`✅ Role updated successfully to ${roleText}`);
            loadSupervisors('approved'); // Refresh active list
        } else {
            const data = await response.json();
            alert('❌ Failed to update role: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating role:', error);
        alert('❌ An error occurred while updating role');
    }
}

// ===================================
// SETTINGS PAGE FUNCTIONS
// ===================================

// Load user profile data
async function loadUserProfile() {
    try {
        const response = await fetch('/settings/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const profile = await response.json();
        
        // Populate form fields
        document.getElementById('settings-full-name').value = profile.full_name || '';
        document.getElementById('settings-username').value = profile.username || '';
        document.getElementById('settings-email').value = profile.email || '';
        document.getElementById('settings-bio').value = profile.bio || '';
        
        // Populate account info
        document.getElementById('account-role').textContent = profile.role || 'N/A';
        document.getElementById('account-created').textContent = profile.created_at ? 
            new Date(profile.created_at).toLocaleDateString() : 'N/A';
        
        // Set profile picture
        if (profile.profile_pic) {
            document.getElementById('profile-pic').src = profile.profile_pic;
        }
        
        // Set status badge
        const statusBadge = document.querySelector('.status-badge');
        statusBadge.textContent = 'Active';
        statusBadge.className = 'status-badge active';
        
    } catch (error) {
        console.error('Error loading profile:', error);
        // Silently fail - don't show alert to avoid interrupting user experience
        // User can retry by navigating away and back to Settings
    }
}

// Preview profile picture before upload
function previewProfilePic(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('profile-pic').src = e.target.result;
        // Auto-upload the profile picture
        uploadProfilePic(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Upload profile picture
async function uploadProfilePic(base64Data) {
    try {
        const response = await fetch('/settings/profile-pic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ profile_pic: base64Data })
        });
        
        if (response.ok) {
            console.log('✅ Profile picture updated');
        } else {
            const data = await response.json();
            alert('❌ Failed to upload profile picture: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('❌ An error occurred while uploading profile picture');
    }
}

// Update profile information
async function updateProfile(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('settings-full-name').value.trim();
    const email = document.getElementById('settings-email').value.trim();
    const bio = document.getElementById('settings-bio').value.trim();
    
    if (!fullName || !email) {
        alert('Full name and email are required');
        return;
    }
    
    try {
        const response = await fetch('/settings/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: fullName,
                email: email,
                bio: bio
            })
        });
        
        if (response.ok) {
            alert('✅ Profile updated successfully');
            loadUserProfile(); // Refresh profile data
        } else {
            const data = await response.json();
            alert('❌ Failed to update profile: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('❌ An error occurred while updating profile');
    }
}

// Change password
async function changePassword(event) {
    event.preventDefault();
    
    console.log('=== Password Change Debug ===');
    console.log('Form submitted');
    
    // Get the form element
    const form = event.target;
    const formData = new FormData(form);
    
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value ? '***' : 'empty'} (length: ${value.length})`);
    }
    
    // Small delay to ensure autocomplete values are available
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const currentPasswordField = document.getElementById('current-password');
    const newPasswordField = document.getElementById('new-password');
    const confirmPasswordField = document.getElementById('confirm-password');
    
    console.log('Fields found:', {
        current: !!currentPasswordField,
        new: !!newPasswordField,
        confirm: !!confirmPasswordField
    });
    
    if (!currentPasswordField || !newPasswordField || !confirmPasswordField) {
        console.error('Missing password fields!');
        alert('Error: Password form fields not found. Please refresh the page.');
        return;
    }
    
    // Try multiple ways to get the values
    const currentPassword = currentPasswordField.value || formData.get('current-password') || '';
    const newPassword = newPasswordField.value || formData.get('new-password') || '';
    const confirmPassword = confirmPasswordField.value || formData.get('confirm-password') || '';
    
    console.log('Field values (via .value):', {
        current: currentPasswordField.value,
        new: newPasswordField.value,
        confirm: confirmPasswordField.value
    });
    
    console.log('Field lengths:', {
        currentLength: currentPassword.length,
        newLength: newPassword.length,
        confirmLength: confirmPassword.length
    });
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        console.error('Empty fields detected!');
        console.log('Detailed check:');
        console.log('Current:', currentPassword);
        console.log('New:', newPassword);
        console.log('Confirm:', confirmPassword);
        alert('All password fields are required');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        console.error('Passwords do not match!');
        alert('New password and confirm password do not match');
        return;
    }
    
    if (newPassword.length < 8) {
        console.error('Password too short!');
        alert('New password must be at least 8 characters');
        return;
    }
    
    console.log('All validations passed, sending request...');
    
    try {
        const response = await fetch('/settings/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
            alert('✅ Password changed successfully');
            // Clear password fields
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        } else {
            const data = await response.json();
            alert('❌ Failed to change password: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error changing password:', error);
        alert('❌ An error occurred while changing password');
    }
}

// Initialize Settings page
function initializeSettings() {
    // Load profile when Settings page becomes visible
    const settingsPage = document.getElementById('page-settings');
    if (settingsPage) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    loadUserProfile();
                }
            });
        });
        
        observer.observe(settingsPage, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Also load immediately if already active
        if (settingsPage.classList.contains('active')) {
            loadUserProfile();
        }
    }
    
    // Attach event listeners
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', updateProfile);
    }
    
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', changePassword);
    }
    
    const profilePicInput = document.getElementById('profile-pic-input');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', previewProfilePic);
    }
    
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Agent Status Monitoring
async function updateAgentStatus() {
    try {
        // Check agent connection status
        const agentResponse = await fetch('/api/agent-status');
        if (!agentResponse.ok) {
            showToast('Failed to check agent status.', 'error');
            throw new Error('Failed to fetch agent status');
        }
        const agentData = await agentResponse.json();
        // Check pending notifications
        const notifResponse = await fetch('/api/pending-notifications');
        if (!notifResponse.ok) {
            showToast('Failed to check pending notifications.', 'error');
            throw new Error('Failed to fetch pending notifications');
        }
        const notifData = await notifResponse.json();
        const indicator = document.getElementById('agent-status-indicator');
        const countBadge = document.getElementById('agent-pending-count');
        const statusText = document.querySelector('.agent-status-text');
        if (indicator) {
            // Remove all status classes first
            indicator.classList.remove('active', 'processing', 'disconnected');
            if (!agentData.connected) {
                // Agent is NOT connected - show RED
                indicator.classList.add('disconnected');
                if (countBadge) countBadge.style.display = 'none';
                if (statusText) statusText.textContent = 'Agent (Offline)';
                indicator.title = 'Agent is not connected. Please start agent.py';
            } else {
                // Connected: always show GREEN per requirement; keep count badge if there are pending deliveries
                indicator.classList.add('active');
                if (notifData.count > 0) {
                    if (countBadge) {
                        countBadge.textContent = notifData.count;
                        countBadge.style.display = 'inline-block';
                    }
                    if (statusText) statusText.textContent = 'Agent (Online)';
                    indicator.title = `Agent online • ${notifData.count} pending delivery${notifData.count > 1 ? 'ies' : ''}`;
                } else {
                    if (countBadge) countBadge.style.display = 'none';
                    if (statusText) statusText.textContent = 'Agent (Online)';
                    indicator.title = 'Agent is online and ready';
                }
            }
        }
    } catch (error) {
        showToast('Network error checking agent status.', 'error');
        console.error('Error checking agent status:', error);
        const indicator = document.getElementById('agent-status-indicator');
        if (indicator) {
            indicator.classList.remove('active', 'processing');
            indicator.classList.add('disconnected');
            indicator.title = 'Unable to check agent status';
        }
    }
}

// Start monitoring when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        updateAgentStatus();
        setInterval(updateAgentStatus, 10000); // Check every 10 seconds
    });
} else {
    updateAgentStatus();
    setInterval(updateAgentStatus, 10000);
}
