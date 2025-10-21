// Login Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const loginButton = loginForm.querySelector('.btn-submit');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Show loading state
        loginButton.classList.add('loading');
        loginButton.textContent = 'Signing In';
        errorMessage.style.display = 'none';

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, remember })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Login successful
                errorMessage.style.display = 'none';
                loginButton.textContent = 'Success! Redirecting...';
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 500);
            } else {
                // Login failed
                showError(data.message || 'Invalid username or password');
                loginButton.classList.remove('loading');
                loginButton.textContent = 'Sign In';
            }
        } catch (error) {
            showError('Connection error. Please try again.');
            loginButton.classList.remove('loading');
            loginButton.textContent = 'Sign In';
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Forgot Password Modal
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    
    // Only set up modal if it exists
    if (forgotPasswordLink && forgotPasswordModal) {
        const modalClose = forgotPasswordModal.querySelector('.modal-close');
        const forgotPasswordForm = document.getElementById('forgot-password-form');
        const resetMessage = document.getElementById('reset-message');

        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotPasswordModal.style.display = 'block';
        });

        modalClose.addEventListener('click', () => {
            forgotPasswordModal.style.display = 'none';
            forgotPasswordForm.reset();
            resetMessage.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === forgotPasswordModal) {
                forgotPasswordModal.style.display = 'none';
                forgotPasswordForm.reset();
                resetMessage.style.display = 'none';
            }
        });

        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('reset-username').value.trim();
            const email = document.getElementById('reset-email').value.trim();
            const submitButton = forgotPasswordForm.querySelector('.btn-login');

            submitButton.classList.add('loading');
            submitButton.textContent = 'Processing...';
            resetMessage.style.display = 'none';

            try {
                const response = await fetch('/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    resetMessage.className = 'reset-message success';
                    resetMessage.textContent = '✅ ' + (data.message || 'Password reset instructions sent to your email!');
                    resetMessage.style.display = 'block';
                    forgotPasswordForm.reset();
                    
                    setTimeout(() => {
                        forgotPasswordModal.style.display = 'none';
                        resetMessage.style.display = 'none';
                    }, 3000);
                } else {
                    resetMessage.className = 'reset-message error';
                    resetMessage.textContent = '❌ ' + (data.error || 'Unable to reset password. Please check your details.');
                    resetMessage.style.display = 'block';
                }
            } catch (error) {
                resetMessage.className = 'reset-message error';
                resetMessage.textContent = '❌ Connection error. Please try again.';
                resetMessage.style.display = 'block';
            } finally {
                submitButton.classList.remove('loading');
                submitButton.textContent = 'Reset Password';
            }
        });
    }

    // Password toggle functionality
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = togglePassword.querySelector('svg');
            if (type === 'text') {
                icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            } else {
                icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
            }
        });
    }

    // Check if already logged in
    checkAuthStatus();
});

async function checkAuthStatus() {
    try {
        const response = await fetch('/check-auth');
        const data = await response.json();
        
        if (data.authenticated) {
            // Already logged in, redirect to dashboard
            window.location.href = '/dashboard';
        }
    } catch (error) {
        // Not logged in, stay on login page
    }
}
