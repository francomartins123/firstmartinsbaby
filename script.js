// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Check if we're on the entry page
    const entryForm = document.getElementById('entryForm');
    if (entryForm) {
        handleEntryPage();
    }
    
    // Check if we're on the guessing page
    const guessingForm = document.getElementById('guessingForm');
    if (guessingForm) {
        handleGuessingPage();
    }
    
    // Check if we're on the results page
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        handleResultsPage();
    }
});

// === ENTRY PAGE FUNCTIONALITY ===
function handleEntryPage() {
    const form = document.getElementById('entryForm');
    const errorMessage = document.getElementById('errorMessage');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        
        if (!name || !email) {
            showError('Please fill in both name and email.');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }
        
        // Add loading state
        form.classList.add('loading');
        hideError();
        
        try {
            console.log('Form submission started for:', name, email);
            
            // Check if Supabase client is ready
            if (!supabaseClient) {
                throw new Error('Database connection not ready. Please refresh the page and try again.');
            }
            
            // Check if email already exists
            console.log('Checking if email exists...');
            const emailExists = await db.checkEmailExists(email);
            console.log('Email exists check result:', emailExists);
            
            if (emailExists) {
                showError('This email has already been used. Each person can only participate once.');
                form.classList.remove('loading');
                return;
            }
            
            // Create participant
            console.log('Creating participant...');
            const participant = await db.createParticipant(name, email);
            console.log('Participant created:', participant);
            
            // Store participant info for the guessing page
            sessionStorage.setItem('participantId', participant.id);
            sessionStorage.setItem('participantName', participant.name);
            sessionStorage.setItem('participantEmail', participant.email);
            
            console.log('Redirecting to guessing page...');
            // Redirect to guessing page
            window.location.href = 'guessing.html';
            
        } catch (error) {
            console.error('Error in form submission:', error);
            showError(error.message || 'Something went wrong. Please try again.');
            form.classList.remove('loading');
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// === GUESSING PAGE FUNCTIONALITY ===
function handleGuessingPage() {
    // Check if we have participant info
    const participantId = sessionStorage.getItem('participantId');
    if (!participantId) {
        // Redirect back to entry page if no participant info
        window.location.href = 'index.html';
        return;
    }
    
    // Display participant name
    const participantName = sessionStorage.getItem('participantName');
    const welcomeText = document.querySelector('.guessing-welcome');
    if (welcomeText && participantName) {
        welcomeText.textContent = `Hello ${participantName}! Make your predictions:`;\n    }\n    \n    // Set up date picker with reasonable range around due date\n    const dueDateInput = document.getElementById('dueDate');\n    if (dueDateInput) {\n        // Due date is October 14, 2025\n        dueDateInput.min = '2025-09-01';\n        dueDateInput.max = '2025-11-30';\n        dueDateInput.value = '2025-10-14'; // Default to actual due date\n    }\n    \n    // Set up weight slider\n    const weightSlider = document.getElementById('weight');\n    const weightValue = document.getElementById('weightValue');\n    if (weightSlider && weightValue) {\n        weightSlider.addEventListener('input', function() {\n            weightValue.textContent = `${this.value} lbs`;\n        });\n        // Trigger initial display\n        weightValue.textContent = `${weightSlider.value} lbs`;\n    }\n    \n    // Handle form submission\n    const form = document.getElementById('guessingForm');\n    form.addEventListener('submit', async function(e) {\n        e.preventDefault();\n        \n        // Collect all guesses\n        const guesses = {\n            due_date: document.getElementById('dueDate').value,\n            weight: document.getElementById('weight').value,\n            middle_name: document.getElementById('middleName').value.trim(),\n            birth_time: document.getElementById('birthTime').value,\n            eye_color: document.querySelector('input[name=\"eyeColor\"]:checked')?.value,\n            hair_color: document.querySelector('input[name=\"hairColor\"]:checked')?.value,\n            length: document.getElementById('length').value\n        };\n        \n        // Validate all fields are filled\n        const missingFields = [];\n        Object.entries(guesses).forEach(([key, value]) => {\n            if (!value || value.trim() === '') {\n                missingFields.push(key.replace('_', ' '));\n            }\n        });\n        \n        if (missingFields.length > 0) {\n            alert(`Please fill in: ${missingFields.join(', ')}`);\n            return;\n        }\n        \n        // Add loading state\n        form.classList.add('loading');\n        \n        try {\n            await db.saveGuesses(participantId, guesses);\n            \n            // Clear session storage\n            sessionStorage.clear();\n            \n            // Redirect to results page\n            window.location.href = 'results.html';\n            \n        } catch (error) {\n            console.error('Error saving guesses:', error);\n            alert('Something went wrong saving your guesses. Please try again.');\n            form.classList.remove('loading');\n        }\n    });\n}\n\n// === RESULTS PAGE FUNCTIONALITY ===\nfunction handleResultsPage() {\n    loadAndDisplayResults();\n    \n    // Set up real-time updates\n    const subscription = db.subscribeToParticipants(() => {\n        loadAndDisplayResults();\n    });\n    \n    // Clean up subscription when page is closed\n    window.addEventListener('beforeunload', () => {\n        if (subscription) {\n            subscription.unsubscribe();\n        }\n    });\n}\n\nasync function loadAndDisplayResults() {\n    try {\n        const participants = await db.getAllParticipantsWithGuesses();\n        displayFlowerGarden(participants);\n    } catch (error) {\n        console.error('Error loading results:', error);\n    }\n}\n\nfunction displayFlowerGarden(participants) {\n    const container = document.getElementById('resultsContainer');\n    container.innerHTML = '';\n    \n    participants.forEach((participant, index) => {\n        const flower = createFlower(participant, index);\n        container.appendChild(flower);\n    });\n    \n    // Update count\n    const countElement = document.getElementById('participantCount');\n    if (countElement) {\n        countElement.textContent = participants.length;\n    }\n}\n\nfunction createFlower(participant, index) {\n    const flowerDiv = document.createElement('div');\n    flowerDiv.className = 'flower';\n    \n    // Position flower randomly\n    const x = Math.random() * 80; // 0-80% to leave some margin\n    const y = Math.random() * 80;\n    flowerDiv.style.left = `${x}%`;\n    flowerDiv.style.top = `${y}%`;\n    \n    // Choose flower type\n    const flowerTypes = ['🌸', '🌼', '🌺', '🌻', '🌷', '🌹', '💮', '🏵️'];\n    const flowerIcon = flowerTypes[index % flowerTypes.length];\n    \n    // Convert guesses array to object\n    const guessesObj = {};\n    participant.guesses.forEach(guess => {\n        guessesObj[guess.question_type] = guess.guess_value;\n    });\n    \n    flowerDiv.innerHTML = `\n        <div class=\"flower-icon\">${flowerIcon}</div>\n        <div class=\"flower-content\">\n            <div class=\"flower-name\">${participant.name}</div>\n            <div class=\"flower-guesses\">\n                <div>Due: ${formatDate(guessesObj.due_date)}</div>\n                <div>Weight: ${guessesObj.weight} lbs</div>\n                <div>Name: ${guessesObj.middle_name}</div>\n                <div>Time: ${guessesObj.birth_time}</div>\n                <div>Eyes: ${guessesObj.eye_color}</div>\n                <div>Hair: ${guessesObj.hair_color}</div>\n                <div>Length: ${guessesObj.length}\"</div>\n            </div>\n        </div>\n    `;\n    \n    return flowerDiv;\n}\n\nfunction formatDate(dateString) {\n    if (!dateString) return 'N/A';\n    const date = new Date(dateString);\n    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });\n}\n\n// === UTILITY FUNCTIONS ===\nfunction showLoading(element) {\n    element.classList.add('loading');\n}\n\nfunction hideLoading(element) {\n    element.classList.remove('loading');\n}"