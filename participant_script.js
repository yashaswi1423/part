// Participant Registration Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('participantForm');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('open');
            navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', !isOpen);
        });
    }

    // Form validation rules
    const validationRules = {
        domain: {
            required: true,
            message: 'Please select a domain'
        },
        teamName: {
            required: true,
            minLength: 2,
            message: 'Team name must be at least 2 characters long'
        },
        leadUsn: {
            required: true,
            pattern: /^[A-Za-z0-9]{8,15}$/,
            message: 'USN/ID must be 8-15 alphanumeric characters'
        },
        leadName: {
            required: true,
            minLength: 2,
            pattern: /^[A-Za-z\s.]+$/,
            message: 'Name must contain only letters, spaces, and dots'
        },
        leadGender: {
            required: true,
            message: 'Please select gender'
        },
        leadMobile: {
            required: true,
            pattern: /^[0-9]{10}$/,
            message: 'Please enter a valid 10-digit mobile number (numbers only)'
        },
        leadEmail: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        collegeName: {
            required: true,
            minLength: 2,
            message: 'University/College name must be at least 2 characters long'
        },
        state: {
            required: true,
            minLength: 2,
            pattern: /^[A-Za-z\s.]+$/,
            message: 'State must contain only letters, spaces, and dots'
        },
        country: {
            required: true,
            minLength: 2,
            pattern: /^[A-Za-z\s.]+$/,
            message: 'Country must contain only letters, spaces, and dots'
        },
        member2Usn: {
            required: true,
            pattern: /^[A-Za-z0-9]{8,15}$/,
            message: 'USN/ID must be 8-15 alphanumeric characters'
        },
        member2Name: {
            required: true,
            minLength: 2,
            pattern: /^[A-Za-z\s.]+$/,
            message: 'Name must contain only letters, spaces, and dots'
        },
        member2Gender: {
            required: true,
            message: 'Please select gender'
        },
        member2Mobile: {
            required: true,
            pattern: /^[0-9]{10}$/,
            message: 'Please enter a valid 10-digit mobile number (numbers only)'
        },
        member3Usn: {
            required: true,
            pattern: /^[A-Za-z0-9]{8,15}$/,
            message: 'USN/ID must be 8-15 alphanumeric characters'
        },
        member3Name: {
            required: true,
            minLength: 2,
            pattern: /^[A-Za-z\s.]+$/,
            message: 'Name must contain only letters, spaces, and dots'
        },
        member3Gender: {
            required: true,
            message: 'Please select gender'
        },
        member3Mobile: {
            required: true,
            pattern: /^[0-9]{10}$/,
            message: 'Please enter a valid 10-digit mobile number (numbers only)'
        },
        member4Usn: {
            required: true,
            pattern: /^[A-Za-z0-9]{8,15}$/,
            message: 'USN/ID must be 8-15 alphanumeric characters'
        },
        member4Name: {
            required: true,
            minLength: 2,
            pattern: /^[A-Za-z\s.]+$/,
            message: 'Name must contain only letters, spaces, and dots'
        },
        member4Gender: {
            required: true,
            message: 'Please select gender'
        },
        member4Mobile: {
            required: true,
            pattern: /^[0-9]{10}$/,
            message: 'Please enter a valid 10-digit mobile number (numbers only)'
        }
    };

    // Validation functions
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        if (!rules) return { isValid: true };

        // Check required
        if (rules.required && (!value || value.trim() === '')) {
            return { isValid: false, message: rules.message };
        }

        // If field is not required and empty, it's valid
        if (!rules.required && (!value || value.trim() === '')) {
            return { isValid: true };
        }

        // Check minimum length
        if (rules.minLength && value.length < rules.minLength) {
            return { isValid: false, message: rules.message };
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            return { isValid: false, message: rules.message };
        }

        return { isValid: true };
    }

    function validateRadioGroup(groupName) {
        const radios = document.querySelectorAll(`input[name="${groupName}"]`);
        const rules = validationRules[groupName];
        
        if (!rules) return { isValid: true };

        const isChecked = Array.from(radios).some(radio => radio.checked);
        
        if (rules.required && !isChecked) {
            return { isValid: false, message: rules.message };
        }

        return { isValid: true };
    }

    function showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const field = document.getElementById(fieldName) || document.querySelector(`input[name="${fieldName}"]`);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        if (field) {
            if (field.type === 'radio') {
                // For radio groups, add error class to all radios in the group
                const radios = document.querySelectorAll(`input[name="${fieldName}"]`);
                radios.forEach(radio => radio.classList.add('error'));
            } else {
                field.classList.add('error');
            }
        }
    }

    function clearError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const field = document.getElementById(fieldName) || document.querySelector(`input[name="${fieldName}"]`);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        if (field) {
            if (field.type === 'radio') {
                // For radio groups, remove error class from all radios in the group
                const radios = document.querySelectorAll(`input[name="${fieldName}"]`);
                radios.forEach(radio => radio.classList.remove('error'));
            } else {
                field.classList.remove('error');
            }
        }
    }

    // Real-time validation
    function setupRealTimeValidation() {
        // Text inputs and selects
        const textFields = ['domain', 'teamName', 'leadUsn', 'leadName', 'leadMobile', 'leadEmail', 'collegeName', 'state', 'country',
                           'member2Usn', 'member2Name', 'member2Mobile', 'member3Usn', 'member3Name', 'member3Mobile',
                           'member4Usn', 'member4Name', 'member4Mobile', 'member5Usn', 'member5Name'];
        
        textFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', function() {
                    const validation = validateField(fieldName, this.value);
                    if (!validation.isValid) {
                        showError(fieldName, validation.message);
                    } else {
                        clearError(fieldName);
                    }
                });

                field.addEventListener('input', function() {
                    // Clear error on input if field was previously invalid
                    if (this.classList.contains('error')) {
                        clearError(fieldName);
                    }
                });
            }
        });

        // Radio groups
        const radioGroups = ['leadGender', 'member2Gender', 'member3Gender', 'member4Gender', 'member5Gender'];
        
        radioGroups.forEach(groupName => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', function() {
                    clearError(groupName);
                });
            });
        });
    }

    // Validate member 5 fields together (if any field is filled, validate all filled fields)
    function validateMember5Fields() {
        const member5Usn = document.getElementById('member5Usn').value.trim();
        const member5Name = document.getElementById('member5Name').value.trim();
        const member5Gender = document.querySelector('input[name="member5Gender"]:checked');

        const hasAnyMember5Data = member5Usn || member5Name || member5Gender;

        if (hasAnyMember5Data) {
            let isValid = true;

            // If any field is filled, validate the filled fields
            if (member5Usn) {
                const usnValidation = validateField('member5Usn', member5Usn);
                if (!usnValidation.isValid) {
                    showError('member5Usn', 'USN/ID must be 8-15 alphanumeric characters');
                    isValid = false;
                }
            }

            if (member5Name) {
                const nameValidation = validateField('member5Name', member5Name);
                if (!nameValidation.isValid) {
                    showError('member5Name', 'Name must contain only letters, spaces, and dots');
                    isValid = false;
                }
            }

            return isValid;
        }

        return true; // Valid if no member 5 data is provided
    }

    // Check for duplicate USNs
    function validateUniqueUSNs() {
        const usnFields = ['leadUsn', 'member2Usn', 'member3Usn', 'member4Usn', 'member5Usn'];
        const usns = [];
        const duplicates = [];

        usnFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const value = field.value.trim().toLowerCase();
            
            if (value) {
                if (usns.includes(value)) {
                    duplicates.push(fieldName);
                } else {
                    usns.push(value);
                }
            }
        });

        // Clear previous duplicate errors
        usnFields.forEach(fieldName => {
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (errorElement && errorElement.textContent.includes('duplicate')) {
                clearError(fieldName);
            }
        });

        // Show duplicate errors
        duplicates.forEach(fieldName => {
            showError(fieldName, 'USN/ID must be unique for each team member');
        });

        return duplicates.length === 0;
    }

    // Check for duplicate mobile numbers
    function validateUniqueMobiles() {
        const mobileFields = ['leadMobile', 'member2Mobile', 'member3Mobile', 'member4Mobile'];
        const mobiles = [];
        const duplicates = [];

        mobileFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const value = field.value.trim();
            
            if (value) {
                if (mobiles.includes(value)) {
                    duplicates.push(fieldName);
                } else {
                    mobiles.push(value);
                }
            }
        });

        // Clear previous duplicate errors
        mobileFields.forEach(fieldName => {
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (errorElement && errorElement.textContent.includes('duplicate')) {
                clearError(fieldName);
            }
        });

        // Show duplicate errors
        duplicates.forEach(fieldName => {
            showError(fieldName, 'Mobile number must be unique for each team member');
        });

        return duplicates.length === 0;
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        let isFormValid = true;

        // Validate all required fields
        Object.keys(validationRules).forEach(fieldName => {
            let validation;
            
            if (fieldName.includes('Gender') || fieldName === 'accommodation') {
                validation = validateRadioGroup(fieldName);
            } else {
                const field = document.getElementById(fieldName);
                validation = validateField(fieldName, field ? field.value : '');
            }

            if (!validation.isValid) {
                showError(fieldName, validation.message);
                isFormValid = false;
            }
        });

        // Validate member 5 fields
        if (!validateMember5Fields()) {
            isFormValid = false;
        }

        // Validate unique USNs
        if (!validateUniqueUSNs()) {
            isFormValid = false;
        }

        // Validate unique mobile numbers
        if (!validateUniqueMobiles()) {
            isFormValid = false;
        }

        if (isFormValid) {
            // Collect form data
            const formData = {
                domain: document.getElementById('domain').value,
                teamName: document.getElementById('teamName').value,
                leadUsn: document.getElementById('leadUsn').value,
                leadName: document.getElementById('leadName').value,
                leadGender: document.querySelector('input[name="leadGender"]:checked')?.value,
                leadMobile: document.getElementById('leadMobile').value,
                leadEmail: document.getElementById('leadEmail').value,
                collegeName: document.getElementById('collegeName').value,
                state: document.getElementById('state').value,
                country: document.getElementById('country').value,
                member2Usn: document.getElementById('member2Usn').value,
                member2Name: document.getElementById('member2Name').value,
                member2Gender: document.querySelector('input[name="member2Gender"]:checked')?.value,
                member2Mobile: document.getElementById('member2Mobile').value,
                member3Usn: document.getElementById('member3Usn').value,
                member3Name: document.getElementById('member3Name').value,
                member3Gender: document.querySelector('input[name="member3Gender"]:checked')?.value,
                member3Mobile: document.getElementById('member3Mobile').value,
                member4Usn: document.getElementById('member4Usn').value,
                member4Name: document.getElementById('member4Name').value,
                member4Gender: document.querySelector('input[name="member4Gender"]:checked')?.value,
                member4Mobile: document.getElementById('member4Mobile').value,
                member5Usn: document.getElementById('member5Usn').value,
                member5Name: document.getElementById('member5Name').value,
                member5Gender: document.querySelector('input[name="member5Gender"]:checked')?.value
            };

            // Store registration data in sessionStorage for payment page
            sessionStorage.setItem('registrationData', JSON.stringify(formData));
            
            // Redirect to payment page
            window.location.href = 'payment.html';
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.error-message.show');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Form reset
    form.addEventListener('reset', function() {
        // Clear all errors
        Object.keys(validationRules).forEach(fieldName => {
            clearError(fieldName);
        });
        
        // Clear member 5 errors
        clearError('member5Usn');
        clearError('member5Name');
        clearError('member5Gender');
    });

    // Initialize real-time validation
    setupRealTimeValidation();

    // Auto-format mobile numbers (only digits, max 10 characters)
    const mobileFields = document.querySelectorAll('input[type="tel"]');
    mobileFields.forEach(field => {
        field.addEventListener('input', function() {
            // Only allow digits and limit to 10 characters
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    });

    // Auto-format USN fields (remove special characters except alphanumeric)
    const usnFields = document.querySelectorAll('input[id$="Usn"]');
    usnFields.forEach(field => {
        field.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 15);
        });
    });

    // Auto-format name fields (only letters, spaces, and dots)
    const nameFields = document.querySelectorAll('input[id$="Name"]');
    nameFields.forEach(field => {
        field.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-z\s.]/g, '');
        });
    });
});
// Theme Availability Functionality
async function fetchThemeAvailability() {
    try {
        const response = await fetch('api_theme_counts.php');
        const data = await response.json();
        
        if (data.success) {
            updateThemeOptions(data.themes);
            return data.themes;
        } else {
            console.error('Failed to fetch theme availability:', data.error);
            return null;
        }
    } catch (error) {
        console.error('Error fetching theme availability:', error);
        return null;
    }
}

function updateThemeOptions(themes) {
    const domainSelect = document.getElementById('domain');
    if (!domainSelect) return;
    
    const currentValue = domainSelect.value;
    
    // Update each option
    Array.from(domainSelect.options).forEach(option => {
        if (option.value && themes[option.value]) {
            const theme = themes[option.value];
            const count = theme.count;
            const available = theme.available;
            
            // Update option text with count
            option.textContent = `${theme.name} (${count}/100)`;
            option.setAttribute('data-count', count);
            
            // Disable if full
            option.disabled = !available;
            
            // Add visual indicators
            if (!available) {
                option.textContent += ' - FULL';
                option.style.color = '#ef4444';
                option.style.fontWeight = 'bold';
            } else {
                option.style.color = '';
                option.style.fontWeight = '';
            }
        }
    });
    
    // If currently selected theme is now full, clear selection and show warning
    if (currentValue && themes[currentValue] && !themes[currentValue].available) {
        domainSelect.value = '';
        showError('domain', 'The selected theme is now full. Please choose another theme.');
    }
}

async function refreshThemeAvailability() {
    const refreshButton = document.querySelector('.theme-availability-info button');
    if (refreshButton) {
        refreshButton.disabled = true;
        refreshButton.innerHTML = '<span class="refresh-icon spinning">🔄</span> Checking...';
    }
    
    const themes = await fetchThemeAvailability();
    
    if (refreshButton) {
        refreshButton.disabled = false;
        refreshButton.innerHTML = '<span class="refresh-icon">🔄</span> Check Availability';
    }
    
    if (themes) {
        // Show success message
        const availabilityNote = document.querySelector('.availability-note');
        if (availabilityNote) {
            const originalText = availabilityNote.textContent;
            availabilityNote.textContent = 'Theme availability updated successfully!';
            availabilityNote.style.color = '#22c55e';
            
            setTimeout(() => {
                availabilityNote.textContent = originalText;
                availabilityNote.style.color = '';
            }, 3000);
        }
    }
}

// Enhanced domain validation to check availability
function validateDomainAvailability(domain) {
    const option = document.querySelector(`#domain option[value="${domain}"]`);
    if (option && option.disabled) {
        return {
            isValid: false,
            message: 'This theme is full (100/100 teams). Please select another theme.'
        };
    }
    return { isValid: true };
}

// Update the existing validateField function to include availability check
const originalValidateField = validateField;
function validateField(fieldName, value) {
    const result = originalValidateField(fieldName, value);
    
    // Additional check for domain availability
    if (fieldName === 'domain' && result.isValid && value) {
        const availabilityResult = validateDomainAvailability(value);
        if (!availabilityResult.isValid) {
            return availabilityResult;
        }
    }
    
    return result;
}

// Initialize theme availability on page load
document.addEventListener('DOMContentLoaded', function() {
    // Fetch initial theme availability
    fetchThemeAvailability();
    
    // Set up periodic refresh every 60 seconds
    setInterval(fetchThemeAvailability, 60000);
    
    // Add change listener to domain select for real-time validation
    const domainSelect = document.getElementById('domain');
    if (domainSelect) {
        domainSelect.addEventListener('change', function() {
            if (this.value) {
                const validation = validateDomainAvailability(this.value);
                if (!validation.isValid) {
                    showError('domain', validation.message);
                    this.value = '';
                } else {
                    clearError('domain');
                }
            }
        });
    }
});

// Make function available globally
window.refreshThemeAvailability = refreshThemeAvailability;