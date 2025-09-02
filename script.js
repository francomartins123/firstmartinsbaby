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
        
        if (!name) {
            showError('Please enter your name.');
            return;
        }
        
        // Add loading state
        form.classList.add('loading');
        hideError();
        
        try {
            console.log('Form submission started for:', name);
            
            // Check if Supabase client is ready
            if (!supabaseClient) {
                throw new Error('Database connection not ready. Please refresh the page and try again.');
            }
            
            // Check if name already exists (using name as unique identifier now)
            console.log('Checking if name exists...');
            const nameExists = await db.checkNameExists(name);
            console.log('Name exists check result:', nameExists);
            
            if (nameExists) {
                showError('This name has already been used. Each person can only participate once.');
                form.classList.remove('loading');
                return;
            }
            
            // Create participant
            console.log('Creating participant...');
            const participant = await db.createParticipant(name);
            console.log('Participant created:', participant);
            
            // Store participant info for the guessing page
            sessionStorage.setItem('participantId', participant.id);
            sessionStorage.setItem('participantName', participant.name);
            
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
        welcomeText.textContent = `Hello ${participantName}! Make your predictions:`;
    }
    
    // Set up date picker with reasonable range around due date
    const dueDateInput = document.getElementById('dueDate');
    if (dueDateInput) {
        // Due date is October 14, 2025
        dueDateInput.min = '2025-09-01';
        dueDateInput.max = '2025-11-30';
        dueDateInput.value = '2025-10-14'; // Default to actual due date
    }
    
    // Set up weight slider
    const weightSlider = document.getElementById('weight');
    const weightValue = document.getElementById('weightValue');
    if (weightSlider && weightValue) {
        weightSlider.addEventListener('input', function() {
            weightValue.textContent = `${this.value} lbs`;
        });
        // Trigger initial display
        weightValue.textContent = `${weightSlider.value} lbs`;
    }
    
    // Handle form submission
    const form = document.getElementById('guessingForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('🎯 Form submission started');
        console.log('Participant ID:', participantId);
        
        // Check if Supabase client is ready
        if (!supabaseClient) {
            console.error('❌ Supabase client not ready');
            alert('Database connection not ready. Please refresh and try again.');
            return;
        }
        
        // Collect all guesses
        const guesses = {
            due_date: document.getElementById('dueDate').value,
            weight: document.getElementById('weight').value,
            middle_name: document.getElementById('middleName').value.trim(),
            birth_time: document.getElementById('birthTime').value,
            eye_color: document.querySelector('input[name="eyeColor"]:checked')?.value,
            hair_color: document.querySelector('input[name="hairColor"]:checked')?.value,
            length: document.getElementById('length').value
        };
        
        console.log('📝 Collected guesses:', guesses);
        
        // Validate all fields are filled
        const missingFields = [];
        Object.entries(guesses).forEach(([key, value]) => {
            if (!value || value.trim() === '') {
                missingFields.push(key.replace('_', ' '));
            }
        });
        
        if (missingFields.length > 0) {
            console.log('❌ Missing fields:', missingFields);
            alert(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }
        
        // Add loading state
        form.classList.add('loading');
        
        try {
            console.log('💾 Saving guesses to database...');
            await db.saveGuesses(participantId, guesses);
            console.log('✅ Guesses saved successfully');
            
            // Clear session storage
            sessionStorage.clear();
            console.log('🧹 Session storage cleared');
            
            // Redirect to results page
            console.log('🔄 Redirecting to results page...');
            window.location.href = 'results.html';
            
        } catch (error) {
            console.error('❌ Error saving guesses:', error);
            alert(`Something went wrong saving your guesses: ${error.message || 'Unknown error'}. Please try again.`);
            form.classList.remove('loading');
        }
    });
}

// === RESULTS PAGE FUNCTIONALITY ===
function handleResultsPage() {
    loadAndDisplayResults();
    
    // Set up real-time updates
    const subscription = db.subscribeToParticipants(() => {
        loadAndDisplayResults();
    });
    
    // Clean up subscription when page is closed
    window.addEventListener('beforeunload', () => {
        if (subscription) {
            subscription.unsubscribe();
        }
    });
}

async function loadAndDisplayResults() {
    try {
        const participants = await db.getAllParticipantsWithGuesses();
        displayFlowerGarden(participants);
    } catch (error) {
        console.error('Error loading results:', error);
    }
}

function displayFlowerGarden(participants) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    
    participants.forEach((participant, index) => {
        const flower = createFlower(participant, index);
        container.appendChild(flower);
    });
    
    // Update count
    const countElement = document.getElementById('participantCount');
    if (countElement) {
        countElement.textContent = participants.length;
    }
}

function createFlower(participant, index) {
    const flowerDiv = document.createElement('div');
    flowerDiv.className = 'flower';
    
    // Position flower randomly
    const x = Math.random() * 80; // 0-80% to leave some margin
    const y = Math.random() * 80;
    flowerDiv.style.left = `${x}%`;
    flowerDiv.style.top = `${y}%`;
    
    // Convert guesses array to object
    const guessesObj = {};
    participant.guesses.forEach(guess => {
        let value = guess.guess_value;
        
        // Add +1 day to due_date to fix display issue
        if (guess.question_type === 'due_date' && value) {
            const dateStr = String(value).split('T')[0]; // Get YYYY-MM-DD part
            const date = new Date(dateStr + 'T12:00:00'); // Noon to avoid timezone issues
            date.setDate(date.getDate() + 1); // Add 1 day
            value = date.toISOString().split('T')[0]; // Back to YYYY-MM-DD
        }
        
        guessesObj[guess.question_type] = value;
    });
    
    const petalData = [
        { label: 'Due', value: guessesObj.due_date },
        { label: 'Weight', value: `${guessesObj.weight} lbs` },
        { label: 'Name', value: guessesObj.middle_name },
        { label: 'Time', value: guessesObj.birth_time },
        { label: 'Eyes', value: guessesObj.eye_color },
        { label: 'Hair', value: guessesObj.hair_color }
    ];
    
    const petalsHTML = petalData.map(petal => `
        <div class="flower-petal">
            <div class="petal-text">${petal.value}</div>
        </div>
    `).join('');
    
    flowerDiv.innerHTML = `
        ${petalsHTML}
        <div class="flower-center"></div>
        <div class="flower-stem"></div>
        <div class="flower-pot">
            <div class="pot-text">${participant.name}</div>
        </div>
    `;
    
    return flowerDiv;
}


// === UTILITY FUNCTIONS ===
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}