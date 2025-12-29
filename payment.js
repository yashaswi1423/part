// Payment Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const payButton = document.getElementById('payButton');
    
    // Load registration data from sessionStorage
    loadRegistrationSummary();
    
    // Payment method selection
    paymentMethodSelect.addEventListener('change', function() {
        showPaymentMethod(this.value);
    });
    
    // Payment form submission
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });
    
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
        });
    }
    
    // Format expiry date input
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
        });
    }
    
    // Format CVV input
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }
});

function loadRegistrationSummary() {
    const registrationData = JSON.parse(sessionStorage.getItem('registrationData') || '{}');
    
    if (Object.keys(registrationData).length === 0) {
        alert('No registration data found. Please complete the registration form first.');
        window.location.href = 'participant_registration.html';
        return;
    }
    
    // Populate summary
    document.getElementById('summaryTeamName').textContent = registrationData.teamName || '-';
    document.getElementById('summaryTheme').textContent = getThemeDisplayName(registrationData.domain) || '-';
    document.getElementById('summaryTeamLead').textContent = registrationData.leadName || '-';
    document.getElementById('summaryCollege').textContent = registrationData.collegeName || '-';
    document.getElementById('summaryCountry').textContent = registrationData.country || '-';
    
    // Set payment amount based on country
    const isInternational = registrationData.country && registrationData.country.toLowerCase() !== 'india';
    const amount = isInternational ? '$100' : '₹5,000';
    
    document.getElementById('registrationFee').textContent = amount;
    document.getElementById('totalAmount').textContent = amount;
    document.getElementById('payAmount').textContent = amount;
}

function getThemeDisplayName(domain) {
    const themes = {
        'agriculture': 'Agriculture and Rural Development',
        'healthtech': 'Health Tech',
        'spacetech': 'SpaceTech',
        'smartcity': 'Smart City, Vehicles and Automation',
        'fintech': 'FinTech'
    };
    return themes[domain] || domain;
}

function showPaymentMethod(method) {
    // Hide all payment method sections
    const sections = document.querySelectorAll('.payment-method-section');
    sections.forEach(section => section.style.display = 'none');
    
    // Show selected payment method section
    if (method) {
        const sectionId = method + 'Payment';
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    }
}

function validatePaymentForm() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!paymentMethod) {
        alert('Please select a payment method');
        return false;
    }
    
    switch (paymentMethod) {
        case 'upi':
            const upiId = document.getElementById('upiId').value.trim();
            if (!upiId) {
                alert('Please enter your UPI ID');
                return false;
            }
            if (!upiId.includes('@')) {
                alert('Please enter a valid UPI ID');
                return false;
            }
            break;
            
        case 'card':
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardholderName = document.getElementById('cardholderName').value.trim();
            
            if (!cardNumber || cardNumber.length < 16) {
                alert('Please enter a valid card number');
                return false;
            }
            if (!expiryDate || expiryDate.length < 5) {
                alert('Please enter a valid expiry date');
                return false;
            }
            if (!cvv || cvv.length < 3) {
                alert('Please enter a valid CVV');
                return false;
            }
            if (!cardholderName) {
                alert('Please enter the cardholder name');
                return false;
            }
            break;
            
        case 'netbanking':
            const bankName = document.getElementById('bankName').value;
            if (!bankName) {
                alert('Please select your bank');
                return false;
            }
            break;
    }
    
    return true;
}

async function processPayment() {
    if (!validatePaymentForm()) {
        return;
    }
    
    // Show processing screen
    document.querySelector('.payment-form-container').style.display = 'none';
    document.getElementById('paymentProcessing').style.display = 'block';
    
    // Simulate payment processing (3 seconds)
    setTimeout(() => {
        completePayment();
    }, 3000);
}

function completePayment() {
    // Hide processing screen
    document.getElementById('paymentProcessing').style.display = 'none';
    
    // Generate transaction ID
    const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
    const paymentMethod = document.getElementById('paymentMethod').value.toUpperCase();
    const registrationData = JSON.parse(sessionStorage.getItem('registrationData') || '{}');
    const isInternational = registrationData.country && registrationData.country.toLowerCase() !== 'india';
    const amount = isInternational ? '$100' : '₹5,000';
    
    // Update success screen
    document.getElementById('transactionId').textContent = transactionId;
    document.getElementById('paidAmount').textContent = amount;
    document.getElementById('paymentMethodUsed').textContent = paymentMethod;
    
    // Show success screen
    document.getElementById('paymentSuccess').style.display = 'block';
    
    // Store payment data
    const paymentData = {
        transactionId: transactionId,
        amount: amount,
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString(),
        status: 'completed'
    };
    
    sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
    
    // Submit registration after successful payment
    setTimeout(() => {
        submitRegistration();
    }, 2000);
}

async function submitRegistration() {
    try {
        const registrationData = JSON.parse(sessionStorage.getItem('registrationData') || '{}');
        const paymentData = JSON.parse(sessionStorage.getItem('paymentData') || '{}');
        
        // Combine registration and payment data
        const completeData = {
            ...registrationData,
            payment: paymentData
        };
        
        console.log('Submitting complete registration data:', completeData);
        
        const response = await fetch('api_participants.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(completeData)
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);
        
        if (result.success) {
            showFinalSuccess();
        } else {
            throw new Error(result.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showRegistrationError(error.message);
    }
}

function showFinalSuccess() {
    document.getElementById('paymentSuccess').innerHTML = `
        <div class="success-card">
            <div class="success-icon">🎉</div>
            <h3>Registration Complete!</h3>
            <p>Congratulations! Your team registration for Smart Horizon Hackathon 2026 has been completed successfully.</p>
            <div class="transaction-details">
                <div class="detail-row">
                    <span class="label">Team Name:</span>
                    <span class="value">${JSON.parse(sessionStorage.getItem('registrationData') || '{}').teamName}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Transaction ID:</span>
                    <span class="value">${JSON.parse(sessionStorage.getItem('paymentData') || '{}').transactionId}</span>
                </div>
            </div>
            <div class="form-actions">
                <a href="index.html" class="btn primary">Back to Home</a>
                <a href="admin_participants.html" class="btn outline">View Registrations</a>
            </div>
        </div>
    `;
    
    // Clear session data
    sessionStorage.removeItem('registrationData');
    sessionStorage.removeItem('paymentData');
}

function showRegistrationError(message) {
    document.getElementById('paymentSuccess').innerHTML = `
        <div class="error-card">
            <div class="error-icon">❌</div>
            <h3>Registration Failed</h3>
            <p>Payment was successful, but there was an error completing your registration: ${message}</p>
            <p>Please contact support with your transaction ID: ${JSON.parse(sessionStorage.getItem('paymentData') || '{}').transactionId}</p>
            <div class="form-actions">
                <button type="button" class="btn primary" onclick="location.reload()">Try Again</button>
                <a href="index.html" class="btn outline">Back to Home</a>
            </div>
        </div>
    `;
}

function goBack() {
    if (confirm('Are you sure you want to go back? Your payment information will be lost.')) {
        window.location.href = 'participant_registration.html';
    }
}