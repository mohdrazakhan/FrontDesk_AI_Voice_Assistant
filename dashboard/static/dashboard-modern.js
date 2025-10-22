// Modern Dashboard Functionality
(function() {
    'use strict';
    
    // Session timer with persistence and tab visibility tracking
    let sessionStartTime;
    let totalElapsedTime = 0; // Total time in milliseconds
    let timerInterval;
    let isTabActive = !document.hidden;
    let lastActiveTime = Date.now();
    
    // Initialize timer from localStorage or create new session
    function initializeTimer() {
        const storedStartTime = localStorage.getItem('sessionStartTime');
        const storedElapsedTime = localStorage.getItem('totalElapsedTime');
        
        if (storedStartTime && storedElapsedTime) {
            // Continue from previous session
            sessionStartTime = parseInt(storedStartTime);
            totalElapsedTime = parseInt(storedElapsedTime);
            console.log('✅ Timer resumed from storage');
        } else {
            // New session
            sessionStartTime = Date.now();
            totalElapsedTime = 0;
            localStorage.setItem('sessionStartTime', sessionStartTime);
            localStorage.setItem('totalElapsedTime', totalElapsedTime);
            console.log('✅ New timer session started');
        }
        
        lastActiveTime = Date.now();
    }
    
    // Update timer only when tab is active
    function updateActiveTime() {
        if (!isTabActive) {
            return; // Don't update when tab is inactive
        }
        
        const now = Date.now();
        const sessionDuration = now - lastActiveTime;
        totalElapsedTime += sessionDuration;
        lastActiveTime = now;
        
        // Save to localStorage
        localStorage.setItem('totalElapsedTime', totalElapsedTime);
        
        // Format and display
        const hours = Math.floor(totalElapsedTime / 3600000);
        const minutes = Math.floor((totalElapsedTime % 3600000) / 60000);
        const seconds = Math.floor((totalElapsedTime % 60000) / 1000);
        
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const timeEl = document.getElementById('active-time');
        if (timeEl) timeEl.textContent = timeStr;
    }
    
    // Handle tab visibility changes
    function handleVisibilityChange() {
        if (document.hidden) {
            // Tab became inactive
            isTabActive = false;
            console.log('⏸️ Timer paused (tab inactive)');
        } else {
            // Tab became active again
            isTabActive = true;
            lastActiveTime = Date.now(); // Reset the last active time
            console.log('▶️ Timer resumed (tab active)');
        }
    }
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for window blur/focus (backup for some browsers)
    window.addEventListener('blur', () => {
        isTabActive = false;
        console.log('⏸️ Timer paused (window blur)');
    });
    
    window.addEventListener('focus', () => {
        isTabActive = true;
        lastActiveTime = Date.now();
        console.log('▶️ Timer resumed (window focus)');
    });
    
    // Initialize and start timer
    initializeTimer();
    timerInterval = setInterval(updateActiveTime, 1000);
    updateActiveTime();
    
    // Clear timer on logout
    function clearTimerOnLogout() {
        localStorage.removeItem('sessionStartTime');
        localStorage.removeItem('totalElapsedTime');
        console.log('🔴 Timer reset on logout');
    }
    
    // Attach to logout button
    const logoutBtn = document.getElementById('user-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', clearTimerOnLogout);
    }
    
    // Load dashboard data
    let pendingChart = null;
    
    async function loadDashboardData() {
        try {
            const response = await fetch('/requests');
            if (!response.ok) throw new Error('Failed to fetch requests');
            
            const requests = await response.json();
            
            // Get current user from session (stored when loading page)
            const currentUser = document.getElementById('user-profile-name')?.textContent || 'User';
            
            // Calculate stats - Filter by supervisor_answer field for resolved status
            const pending = requests.filter(r => !r.supervisor_answer);
            const resolved = requests.filter(r => r.supervisor_answer);
            const mySolved = resolved.filter(r => r.supervisor_assigned === currentUser || r.resolved_by === currentUser);
            
            // Update stat cards
            document.getElementById('pending-count').textContent = pending.length;
            document.getElementById('my-solved-count').textContent = mySolved.length;
            document.getElementById('total-count').textContent = requests.length;
            document.getElementById('chart-pending').textContent = pending.length;
            
            // Update pending chart - DISABLED, now handled by dashboard.js
            // updatePendingChart(pending.length, requests.length);
            
            // Load ALL recent questions (pending + resolved) - most recent first
            loadRecentQuestions(requests.slice(0, 6));
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    function updatePendingChart(pendingCount, totalCount) {
        // DISABLED: This function is now handled by dashboard.js
        // The chart creation has been moved to the main dashboard.js file
        // to avoid conflicts with the new bar chart implementation
        return;
        
        /* OLD CODE - DISABLED
        const canvas = document.getElementById('pending-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (pendingChart) {
            pendingChart.destroy();
        }
        
        // Create new chart showing pending over time or simple bar
        pendingChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
                datasets: [{
                    label: 'Pending Questions',
                    data: [
                        Math.floor(pendingCount * 0.6),
                        Math.floor(pendingCount * 0.8),
                        Math.floor(pendingCount * 1.2),
                        Math.floor(pendingCount * 0.9),
                        pendingCount
                    ],
                    backgroundColor: 'rgba(79, 107, 255, 0.1)',
                    borderColor: 'rgba(79, 107, 255, 1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#4F6BFF',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#fff',
                        titleColor: '#1A1D3C',
                        bodyColor: '#1A1D3C',
                        borderColor: '#4F6BFF',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Pending: ${context.parsed.y} questions`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            precision: 0,
                            color: '#6B7280'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6B7280'
                        }
                    }
                }
            }
        });
        */
    }
    
    function loadRecentQuestions(requests) {
        const container = document.getElementById('recent-questions');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (requests.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#9CA3AF;padding:2rem;">No recent questions</p>';
            return;
        }
        
        requests.forEach((request, index) => {
            const tile = document.createElement('div');
            tile.className = 'question-tile question-tile-animate';
            tile.style.animationDelay = `${index * 0.1}s`;
            
            // Check if resolved based on supervisor_answer
            const isResolved = !!request.supervisor_answer;
            const statusClass = isResolved ? 'status-resolved' : 'status-pending';
            const statusText = isResolved ? 'RESOLVED' : 'PENDING';
            
            const timeAgo = getTimeAgo(request.created_at);
            
            tile.innerHTML = `
                <div class="question-tile-header">
                    <span class="question-id">#${request.id}</span>
                    <span class="question-status ${statusClass}">${statusText}</span>
                </div>
                <div class="question-title">${escapeHtml(request.question_text.substring(0, 60))}${request.question_text.length > 60 ? '...' : ''}</div>
                <div class="question-description">${escapeHtml(request.details || 'No additional details provided')}</div>
                <div class="question-footer">
                    <span>👤 ${escapeHtml(request.customer_identifier || 'Anonymous')}</span>
                    <span>🕐 ${timeAgo}</span>
                </div>
                <div class="question-quick-actions" style="margin-top:12px; display:flex; gap:8px;">
                    <button class="btn-answer-quick" data-request-id="${request.id}" style="flex:1; background:#10b981; color:white; border:none; padding:8px 16px; border-radius:8px; cursor:pointer; font-weight:600; font-size:14px; transition: all 0.2s;">
                        ✓ Answer Now
                    </button>
                    <button class="btn-view-quick" data-request-id="${request.id}" style="flex:1; background:#6366f1; color:white; border:none; padding:8px 16px; border-radius:8px; cursor:pointer; font-weight:600; font-size:14px; transition: all 0.2s;">
                        👁️ View Details
                    </button>
                </div>
            `;
            
            // Answer button click
            const answerBtn = tile.querySelector('.btn-answer-quick');
            if (answerBtn) {
                console.log('✅ Answer button found for request #' + request.id);
                answerBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('🔘 Answer Now clicked for request:', request.id, request);
                    openQuickAnswerModal(request);
                });
                
                answerBtn.addEventListener('mouseenter', (e) => {
                    e.target.style.background = '#059669';
                    e.target.style.transform = 'translateY(-2px)';
                });
                answerBtn.addEventListener('mouseleave', (e) => {
                    e.target.style.background = '#10b981';
                    e.target.style.transform = 'translateY(0)';
                });
            } else {
                console.error('❌ Answer button not found for request #' + request.id);
            }
            
            // View button click
            const viewBtn = tile.querySelector('.btn-view-quick');
            if (viewBtn) {
                console.log('✅ View button found for request #' + request.id);
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('👁️ View Details clicked for request:', request.id);
                    // Access showPage from window object
                    if (window.showPage) {
                        window.showPage('requests');
                    } else {
                        // Fallback: trigger navigation via click
                        const requestsLink = document.querySelector('.nav-link[data-page="requests"]');
                        if (requestsLink) requestsLink.click();
                    }
                    setTimeout(() => {
                        const requestCard = document.querySelector(`[data-request-id="${request.id}"]`);
                        if (requestCard) {
                            requestCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            requestCard.style.background = 'rgba(99,102,241,0.1)';
                            requestCard.style.transform = 'scale(1.02)';
                            requestCard.style.transition = 'all 0.3s';
                            setTimeout(() => {
                                requestCard.style.background = '';
                                requestCard.style.transform = 'scale(1)';
                            }, 2000);
                        }
                    }, 300);
                });
                
                viewBtn.addEventListener('mouseenter', (e) => {
                    e.target.style.background = '#4f46e5';
                    e.target.style.transform = 'translateY(-2px)';
                });
                viewBtn.addEventListener('mouseleave', (e) => {
                    e.target.style.background = '#6366f1';
                    e.target.style.transform = 'translateY(0)';
                });
            } else {
                console.error('❌ View button not found for request #' + request.id);
            }
            
            container.appendChild(tile);
        });
    }
    
    function getTimeAgo(dateString) {
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }
    
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    // Quick answer modal for Recent Questions tiles
    function openQuickAnswerModal(request) {
        console.log('🔹 Opening quick answer modal for request:', request);
        
        const modal = document.getElementById('answer-modal');
        const modalQuestionText = document.getElementById('modal-question-text');
        const modalAnswerText = document.getElementById('modal-answer-text');
        
        console.log('🔹 Modal elements:', {
            modal: !!modal,
            modalQuestionText: !!modalQuestionText,
            modalAnswerText: !!modalAnswerText
        });
        
        if (!modal) {
            console.error('❌ Answer modal not found!');
            alert('Error: Answer modal not found. Please refresh the page.');
            return;
        }
        
        // Set modal content
        if (modalQuestionText) {
            modalQuestionText.textContent = request.question_text;
        }
        if (modalAnswerText) {
            modalAnswerText.value = '';
        }
        
        modal.setAttribute('data-request-id', request.id);
        modal.style.display = 'flex';
        
        console.log('✅ Modal opened successfully');
        
        // Focus on answer textarea after a short delay
        setTimeout(() => {
            if (modalAnswerText) modalAnswerText.focus();
        }, 100);
    }
    
    // Load data on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (document.getElementById('page-dashboard')) {
                console.log('📊 Dashboard page detected, loading data...');
                loadDashboardData();
                
                // Refresh button
                const refreshBtn = document.getElementById('refresh-btn');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', loadDashboardData);
                }
                
                // Auto-refresh every 30 seconds
                setInterval(loadDashboardData, 30000);
            }
        });
    } else {
        // DOM already loaded
        if (document.getElementById('page-dashboard')) {
            console.log('📊 Dashboard page detected (already loaded), loading data...');
            loadDashboardData();
            
            // Refresh button
            const refreshBtn = document.getElementById('refresh-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', loadDashboardData);
            }
            
            // Auto-refresh every 30 seconds
            setInterval(loadDashboardData, 30000);
        }
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (timerInterval) clearInterval(timerInterval);
        // Chart cleanup now handled by dashboard.js
        // if (pendingChart) pendingChart.destroy();
    });
})();
