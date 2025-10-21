document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const alertBox = document.getElementById('alertBox');
    const registerBtn = document.getElementById('registerBtn');
    const btnText = registerBtn.querySelector('.btn-text');
    const btnLoader = registerBtn.querySelector('.btn-loader');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }
    
    // Validate password strength
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    // Show loading state
    registerBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                email,
                username,
                password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('✅ Registration submitted successfully! Please wait for admin approval.', 'success');
            document.getElementById('registerForm').reset();
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        } else {
            showAlert('❌ ' + (data.error || 'Registration failed. Please try again.'), 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('❌ An error occurred. Please try again later.', 'error');
    } finally {
        // Reset button state
        registerBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.style.display = 'block';
    
    // Auto-hide after 5 seconds for error messages
    if (type === 'error') {
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    }
}
