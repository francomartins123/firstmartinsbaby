// Updated quiz with new interactive questions
const questions = [
    {
        id: 1,
        title: "When will our little one arrive?",
        type: "calendar",
        field: "due_date"
    },
    {
        id: 2, 
        title: "How much will our baby weigh?",
        type: "slider",
        field: "weight",
        min: 5,
        max: 10,
        step: 0.25,
        unit: "lbs"
    },
    {
        id: 3,
        title: "What will be baby's middle name?",
        type: "text",
        field: "middle_name",
        placeholder: "Enter middle name"
    },
    {
        id: 4,
        title: "What time of day will baby arrive?", 
        type: "time",
        field: "birth_time"
    },
    {
        id: 5,
        title: "What color eyes and hair will our baby be born with?",
        type: "multi-select",
        fields: ["eye_color", "hair_color"],
        options: {
            eye_color: ["Green", "Blue", "Black", "Brown"],
            hair_color: ["Blonde", "Brown", "Bald", "Black"]
        }
    }
];

let currentQuestion = 0;
let playerName = '';
let answers = {};

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple quiz starting...');
    
    // Load existing flowers on page load
    loadExistingFlowers();
    
    // Setup name form
    const form = document.getElementById('nameForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('playerName');
            playerName = nameInput.value.trim();
            
            if (playerName) {
                console.log('Starting quiz for:', playerName);
                startQuiz();
            } else {
                alert('Please enter your name!');
            }
        });
    }
    
    // Setup view garden button
    const viewGardenBtn = document.getElementById('viewGardenBtn');
    if (viewGardenBtn) {
        viewGardenBtn.addEventListener('click', function() {
            console.log('Showing garden view');
            showGardenOnly();
        });
    }
    
    // Setup back to home button
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            console.log('Going back to home');
            goBackToHome();
        });
    }
    
    // Setup view stats button
    const viewStatsBtn = document.getElementById('viewStatsBtn');
    if (viewStatsBtn) {
        viewStatsBtn.addEventListener('click', function() {
            console.log('Showing stats view');
            showStatsView();
        });
    }
    
    // Setup back to garden button
    const backToGardenBtn = document.getElementById('backToGardenBtn');
    if (backToGardenBtn) {
        backToGardenBtn.addEventListener('click', function() {
            console.log('Going back to garden');
            goBackToGarden();
        });
    }
});

function startQuiz() {
    console.log('Starting quiz...');
    
    // Hide welcome, show quiz using CSS classes
    document.getElementById('welcomeScreen').classList.remove('active');
    document.getElementById('quizScreen').classList.add('active');
    
    // Load first question
    console.log('Loading first question...');
    loadQuestion(0);
}

function loadQuestion(index) {
    console.log('Loading question', index, 'of', questions.length);
    currentQuestion = index;
    
    if (index >= questions.length) {
        console.log('Quiz finished, showing results');
        finishQuiz();
        return;
    }
    
    const question = questions[index];
    console.log('Question:', question);
    
    // Update progress
    const progress = ((index + 1) / questions.length) * 100;
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) progressBar.style.width = progress + '%';
    
    const currentSpan = document.getElementById('currentQuestion');
    if (currentSpan) currentSpan.textContent = index + 1;
    
    const totalSpan = document.getElementById('totalQuestions');
    if (totalSpan) totalSpan.textContent = questions.length;
    
    // Update question title
    const titleElement = document.getElementById('questionTitle');
    if (titleElement) {
        titleElement.textContent = question.title;
        console.log('Set title to:', question.title);
    }
    
    // Hide buttons initially
    const nextBtn = document.getElementById('nextButton');
    const finishBtn = document.getElementById('finishButton');
    if (nextBtn) nextBtn.style.display = 'none';
    if (finishBtn) finishBtn.style.display = 'none';
    
    // Load question content based on type
    const content = document.getElementById('questionContent');
    if (!content) {
        console.error('Question content element not found!');
        return;
    }
    
    content.innerHTML = '';
    console.log('Loading question type:', question.type);
    
    switch(question.type) {
        case 'calendar':
            loadCalendarQuestion(question, content);
            break;
        case 'slider':
            loadSliderQuestion(question, content);
            break;
        case 'text':
            loadTextQuestion(question, content);
            break;
        case 'time':
            loadTimeQuestion(question, content);
            break;
        case 'multi-select':
            loadMultiSelectQuestion(question, content);
            break;
        default:
            console.error('Unknown question type:', question.type);
    }
}

// Calendar Question (Page 1)
function loadCalendarQuestion(question, content) {
    console.log('Loading calendar question');
    
    const calendarHTML = `
        <div class="calendar-container">
            <div class="due-date-info">
                <p>Expected Due Date: October 14th, 2025</p>
            </div>
            <div class="calendar-grid" id="calendarGrid">
                <!-- Calendar days will be generated here -->
            </div>
        </div>
    `;
    content.innerHTML = calendarHTML;
    
    // Generate calendar for Sept 20 - Oct 20
    const startDate = new Date(2025, 8, 20); // Sept 20, 2025
    const endDate = new Date(2025, 9, 20);   // Oct 20, 2025
    const grid = document.getElementById('calendarGrid');
    
    if (!grid) {
        console.error('Calendar grid not found!');
        return;
    }
    
    let dayCount = 0;
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dayButton = document.createElement('div');
        dayButton.className = 'calendar-day';
        
        // Special styling for due date (October 14th)
        if (date.getMonth() === 9 && date.getDate() === 14) {
            dayButton.classList.add('due-date');
        }
        
        dayButton.textContent = date.getDate();
        dayButton.dataset.date = date.toISOString().split('T')[0];
        
        // Add month label for first day of each month
        if (date.getDate() === 1 || (date.getMonth() === 8 && date.getDate() === 20)) {
            const monthLabel = document.createElement('div');
            monthLabel.className = 'month-label';
            monthLabel.textContent = date.toLocaleDateString('en-US', { month: 'long' });
            grid.appendChild(monthLabel);
        }
        
        dayButton.onclick = () => selectDate(dayButton.dataset.date);
        grid.appendChild(dayButton);
        dayCount++;
    }
    
    console.log('Created', dayCount, 'calendar days');
}

function selectDate(dateString) {
    answers.due_date = dateString;
    
    // Visual feedback
    document.querySelectorAll('.calendar-day').forEach(day => day.classList.remove('selected'));
    document.querySelector(`[data-date="${dateString}"]`).classList.add('selected');
    
    // Show next button
    showNextButton();
}

// Slider Question (Page 2) 
function loadSliderQuestion(question, content) {
    const sliderHTML = `
        <div class="slider-container">
            <div class="weight-display" id="weightDisplay">${question.min} ${question.unit}</div>
            <input type="range" 
                   id="weightSlider" 
                   class="weight-slider"
                   min="${question.min}" 
                   max="${question.max}" 
                   step="${question.step}"
                   value="${question.min}">
            <div class="slider-labels">
                <span>${question.min} ${question.unit}</span>
                <span>${question.max} ${question.unit}</span>
            </div>
        </div>
    `;
    content.innerHTML = sliderHTML;
    
    const slider = document.getElementById('weightSlider');
    const display = document.getElementById('weightDisplay');
    
    slider.oninput = () => {
        const value = parseFloat(slider.value);
        display.textContent = `${value} ${question.unit}`;
        answers[question.field] = value;
        showNextButton();
    };
}

// Text Question (Page 3)
function loadTextQuestion(question, content) {
    const textHTML = `
        <div class="text-input-container">
            <input type="text" 
                   id="nameInput" 
                   class="name-input"
                   placeholder="${question.placeholder}"
                   maxlength="50">
        </div>
    `;
    content.innerHTML = textHTML;
    
    const input = document.getElementById('nameInput');
    input.oninput = () => {
        answers[question.field] = input.value.trim();
        if (input.value.trim()) {
            showNextButton();
        } else {
            hideNextButton();
        }
    };
}

// Time Question (Page 4)
function loadTimeQuestion(question, content) {
    const timeHTML = `
        <div class="time-picker-container">
            <div class="time-scrollers">
                <div class="time-scroller">
                    <select id="hourSelect" class="time-select">
                        ${Array.from({length: 12}, (_, i) => 
                            `<option value="${i + 1}">${i + 1}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="time-scroller">
                    <select id="minuteSelect" class="time-select">
                        ${Array.from({length: 60}, (_, i) => 
                            `<option value="${i.toString().padStart(2, '0')}">${i.toString().padStart(2, '0')}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="time-scroller">
                    <label>AM/PM</label>
                    <select id="ampmSelect" class="time-select">
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    content.innerHTML = timeHTML;
    
    const updateTime = () => {
        const hour = document.getElementById('hourSelect').value;
        const minute = document.getElementById('minuteSelect').value;
        const ampm = document.getElementById('ampmSelect').value;
        answers[question.field] = `${hour}:${minute} ${ampm}`;
        showNextButton();
    };
    
    document.getElementById('hourSelect').onchange = updateTime;
    document.getElementById('minuteSelect').onchange = updateTime;
    document.getElementById('ampmSelect').onchange = updateTime;
    
    // Set default to show next button
    updateTime();
}

// Multi-Select Question (Page 5 - Final)
function loadMultiSelectQuestion(question, content) {
    const multiHTML = `
        <div class="multi-select-container">
            <div class="selection-group">
                <h3>Eye Color</h3>
                <div class="color-options" id="eyeOptions">
                    ${question.options.eye_color.map(color => 
                        `<div class="color-option" data-type="eye_color" data-value="${color}">
                            <div class="color-circle eye-${color.toLowerCase()}"></div>
                            <span>${color}</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="selection-group">
                <h3>Hair Color</h3>
                <div class="color-options" id="hairOptions">
                    ${question.options.hair_color.map(color => 
                        `<div class="color-option" data-type="hair_color" data-value="${color}">
                            <div class="color-circle hair-${color.toLowerCase()}"></div>
                            <span>${color}</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
    content.innerHTML = multiHTML;
    
    // Add click handlers for color options
    document.querySelectorAll('.color-option').forEach(option => {
        option.onclick = () => {
            const type = option.dataset.type;
            const value = option.dataset.value;
            
            // Remove selection from same type
            document.querySelectorAll(`[data-type="${type}"]`).forEach(opt => 
                opt.classList.remove('selected')
            );
            
            // Add selection to clicked option
            option.classList.add('selected');
            answers[type] = value;
            
            // Show finish button if both selected
            if (answers.eye_color && answers.hair_color) {
                showFinishButton();
            }
        };
    });
}

function showNextButton() {
    document.getElementById('nextButton').style.display = 'block';
    document.getElementById('nextButton').onclick = () => {
        loadQuestion(currentQuestion + 1);
    };
}

function hideNextButton() {
    document.getElementById('nextButton').style.display = 'none';
}

function showFinishButton() {
    document.getElementById('finishButton').style.display = 'block';
    document.getElementById('finishButton').onclick = () => {
        finishQuiz();
    };
}

function finishQuiz() {
    console.log('Quiz complete! Answers:', answers);
    
    // Hide quiz, show results using CSS classes
    document.getElementById('quizScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');
    
    // Save to database and show results
    saveAndShowResults();
}

async function saveAndShowResults() {
    console.log('Saving results and showing flower garden');
    console.log('Current answers:', answers);
    console.log('Player name:', playerName);
    
    try {
        // Wait for database to be ready
        await waitForDatabase();
        
        // Check if we can save data to database
        if (typeof db !== 'undefined' && db.createParticipant) {
            console.log('Database is available, attempting to save data...');
            
            // Check if name already exists
            console.log('Checking if name exists...');
            const nameExists = await db.checkNameExists(playerName);
            if (nameExists) {
                console.log('Name already exists, showing offline garden');
                showFlowerGarden();
                return;
            }
            
            // Create participant
            console.log('Creating participant:', playerName);
            const participant = await db.createParticipant(playerName);
            console.log('Participant created successfully:', participant);
            
            // Save all answers using the new saveGuesses method
            console.log('Saving answers to database...', answers);
            const savedGuesses = await db.saveGuesses(participant.id, answers);
            console.log('All data saved successfully!', savedGuesses);
            
            // Small delay to ensure database is updated
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Load and display all participants
            console.log('Loading all participants for flower garden...');
            const participants = await db.getAllParticipantsWithGuesses();
            console.log('Found participants for display:', participants);
            displayFlowers(participants);
        } else {
            console.log('Database not available after waiting, showing offline garden');
            console.log('typeof db:', typeof db);
            showFlowerGarden();
        }
    } catch (error) {
        console.error('Error saving data:', error);
        console.error('Error details:', error.message, error.stack);
        // Fallback to offline mode
        showFlowerGarden();
    }
}

function showFlowerGarden() {
    console.log('Showing flower garden for player:', playerName);
    console.log('Player answers:', answers);
    
    // Show current user's flower immediately (offline mode)
    const currentUser = {
        name: playerName,
        guesses: Object.entries(answers).map(([type, value]) => ({
            question_type: type,
            guess_value: value
        }))
    };
    
    console.log('Current user object:', currentUser);
    displayFlowers([currentUser]);
    console.log('Displayed offline flower garden');
}

function displayFlowers(participants) {
    console.log('displayFlowers called with', participants.length, 'participants');
    
    const garden = document.getElementById('flowerGarden');
    const count = document.getElementById('participantCount');
    
    if (!garden) {
        console.error('Flower garden element not found!');
        return;
    }
    
    if (!count) {
        console.error('Participant count element not found!');
        return;
    }
    
    count.textContent = participants.length;
    console.log('Set participant count to:', participants.length);
    
    // Clear existing flowers except count
    const existingFlowers = garden.querySelectorAll('.flower');
    console.log('Removing', existingFlowers.length, 'existing flowers');
    existingFlowers.forEach(f => f.remove());
    
    // Create flowers
    participants.forEach((participant, index) => {
        console.log('Creating flower for participant:', participant.name);
        const flower = createFlower(participant, index);
        garden.appendChild(flower);
        console.log('Added flower to garden');
    });
    
    console.log('Finished displaying', participants.length, 'flowers');
}

// Color palettes for flower variations
const flowerColorPalettes = [
    { petals: 'linear-gradient(45deg, #FF6B9D, #FFB347)', center: '#FFD700' }, // Pink-Orange
    { petals: 'linear-gradient(45deg, #4A90E2, #64B5F6)', center: '#87CEEB' }, // Blue
    { petals: 'linear-gradient(45deg, #9C27B0, #E1BEE7)', center: '#DDA0DD' }, // Purple
    { petals: 'linear-gradient(45deg, #4CAF50, #8BC34A)', center: '#ADFF2F' }, // Green
    { petals: 'linear-gradient(45deg, #FF5722, #FF8A65)', center: '#FFA500' }, // Red-Orange
    { petals: 'linear-gradient(45deg, #00BCD4, #4DD0E1)', center: '#40E0D0' }, // Cyan
    { petals: 'linear-gradient(45deg, #FFEB3B, #FFF176)', center: '#FFFF00' }, // Yellow
    { petals: 'linear-gradient(45deg, #FF4081, #F8BBD9)', center: '#FFB6C1' }, // Hot Pink
    { petals: 'linear-gradient(45deg, #3F51B5, #7986CB)', center: '#9370DB' }, // Indigo
    { petals: 'linear-gradient(45deg, #FF9800, #FFCC02)', center: '#FFA500' }  // Amber
];

function createFlower(participant, index) {
    const flower = document.createElement('div');
    flower.className = 'flower';
    
    // Get color palette based on index (cycles through 10 palettes)
    const colorPalette = flowerColorPalettes[index % flowerColorPalettes.length];
    
    // Better positioning system to avoid overlaps (skip for mobile)
    if (window.innerWidth > 480) {
        const position = getFlowerPosition(index);
        flower.style.left = position.x + '%';
        flower.style.top = position.y + '%';
    }
    
    // Get answers
    const guesses = {};
    participant.guesses.forEach(g => {
        guesses[g.question_type] = g.guess_value;
    });
    
    // Create petals with labels and values
    const petals = [
        { label: 'Delivery Date', value: formatDate(guesses.due_date) },
        { label: 'Weight', value: `${guesses.weight} lbs` },
        { label: 'Middle Name', value: guesses.middle_name || 'TBD' },
        { label: 'Birth Time', value: guesses.birth_time || 'TBD' },
        { label: 'Eye Color', value: guesses.eye_color || 'TBD' },
        { label: 'Hair Color', value: guesses.hair_color || 'TBD' }
    ];
    
    const petalsHTML = petals.map(petal => `
        <div class="flower-petal">
            <div class="petal-label">${petal.label}</div>
            <div class="petal-value">${petal.value}</div>
        </div>
    `).join('');
    
    flower.innerHTML = `
        ${petalsHTML}
        <div class="flower-center" style="background: ${colorPalette.center};"></div>
        <div class="flower-stem"></div>
        <div class="flower-pot">
            <div class="pot-text">${participant.name}'s predictions</div>
        </div>
    `;
    
    // Apply color palette to petals
    setTimeout(() => {
        const petals = flower.querySelectorAll('.flower-petal');
        petals.forEach(petal => {
            petal.style.background = colorPalette.petals;
        });
    }, 0);
    
    return flower;
}

// Smart positioning to avoid overlaps with responsive sizing
function getFlowerPosition(index) {
    const screenWidth = window.innerWidth;
    
    // Responsive flower dimensions based on screen size
    let flowerWidth, flowerHeight, rowSpacing;
    
    if (screenWidth <= 480) {
        // Small mobile
        flowerWidth = 100;
        flowerHeight = 130;
        rowSpacing = 25;
    } else if (screenWidth <= 768) {
        // Tablet/large mobile
        flowerWidth = 140;
        flowerHeight = 180;
        rowSpacing = 30;
    } else {
        // Desktop
        flowerWidth = 450;
        flowerHeight = 340;
        rowSpacing = 65; // Much more spacing for desktop to prevent vertical overlap
    }
    
    // Calculate how many flowers can fit per row (less conservative for garden feel)
    const flowersPerRow = Math.max(1, Math.floor((screenWidth * 0.95) / flowerWidth));
    
    // Calculate row and column for this flower
    const row = Math.floor(index / flowersPerRow);
    const col = index % flowersPerRow;
    
    // Calculate position with closer horizontal spacing for garden feel
    const spacing = 100 / flowersPerRow;
    const baseX = (col * spacing) + (spacing * 0.05); // Smaller padding for closer flowers
    const baseY = 15 + (row * rowSpacing) + (Math.random() * 3 - 1.5); // Very minimal randomness
    
    // Ensure proper spacing and no overlap
    const x = Math.max(2, Math.min(100 - spacing, baseX));
    const y = Math.max(10, baseY);
    
    return { x, y };
}

function formatDate(dateString) {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Load existing flowers on page load
async function loadExistingFlowers() {
    try {
        // Wait for database to be available
        await waitForDatabase();
        
        if (typeof db !== 'undefined' && db.getAllParticipantsWithGuesses) {
            console.log('Loading existing flowers from database...');
            const participants = await db.getAllParticipantsWithGuesses();
            
            if (participants && participants.length > 0) {
                console.log('Found', participants.length, 'existing participants');
                displayFlowers(participants);
            } else {
                console.log('No existing participants found');
            }
        } else {
            console.log('Database not available for loading flowers');
        }
    } catch (error) {
        console.error('Error loading existing flowers:', error);
    }
}

// Helper function to wait for database to be ready
async function waitForDatabase() {
    return new Promise((resolve) => {
        const checkDatabase = () => {
            if (typeof db !== 'undefined' && db.getAllParticipantsWithGuesses) {
                resolve();
            } else {
                setTimeout(checkDatabase, 100);
            }
        };
        
        // Start checking immediately, but also timeout after 5 seconds
        checkDatabase();
        setTimeout(resolve, 5000);
    });
}

// Show garden view only (for viewing existing flowers)
async function showGardenOnly() {
    // Hide welcome screen and show results screen
    document.getElementById('welcomeScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');
    
    try {
        // Wait for database and load participants
        await waitForDatabase();
        
        if (typeof db !== 'undefined' && db.getAllParticipantsWithGuesses) {
            console.log('Loading participants for garden view...');
            const participants = await db.getAllParticipantsWithGuesses();
            
            if (participants && participants.length > 0) {
                console.log('Displaying', participants.length, 'flowers in garden');
                displayFlowers(participants);
            } else {
                console.log('No participants found for garden');
                // Show empty garden message
                const garden = document.getElementById('flowerGarden');
                garden.innerHTML = `
                    <div class="participant-count">
                        <span id="participantCount">0</span> predictions so far!
                    </div>
                    <div class="empty-garden-message">
                        <p>🌱 The prediction garden is empty!</p>
                        <p>Be the first to plant your flower predictions!</p>
                    </div>
                `;
            }
        } else {
            console.log('Database not available for garden view');
        }
    } catch (error) {
        console.error('Error loading garden view:', error);
    }
}

// Go back to home page
function goBackToHome() {
    // Hide results screen and show welcome screen
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('welcomeScreen').classList.add('active');
    
    // Reset any quiz state if needed
    currentQuestionIndex = 0;
    answers = {};
    playerName = '';
    
    // Clear the name input
    const nameInput = document.getElementById('playerName');
    if (nameInput) {
        nameInput.value = '';
    }
    
    console.log('Returned to home screen');
}

// Show stats view
async function showStatsView() {
    // Hide results screen and show stats screen
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('statsScreen').classList.add('active');
    
    // Load and display stats
    await loadStatsData();
}

// Go back to garden from stats
function goBackToGarden() {
    // Hide stats screen and show results screen
    document.getElementById('statsScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');
}

// Load stats data and populate calendar
async function loadStatsData() {
    try {
        // Wait for database and load participants
        await waitForDatabase();
        
        if (typeof db !== 'undefined' && db.getAllParticipantsWithGuesses) {
            console.log('Loading participants for stats...');
            const participants = await db.getAllParticipantsWithGuesses();
            
            if (participants && participants.length > 0) {
                console.log('Displaying stats for', participants.length, 'participants');
                displayStatsCalendar(participants);
            } else {
                console.log('No participants found for stats');
                // Show empty message
                const calendar = document.getElementById('statsCalendarGrid');
                calendar.innerHTML = `
                    <div class="empty-stats-message">
                        <p>📊 No prediction data available yet!</p>
                        <p>Come back after people make their predictions!</p>
                    </div>
                `;
            }
        } else {
            console.log('Database not available for stats view');
        }
    } catch (error) {
        console.error('Error loading stats data:', error);
    }
}

// Display the stats calendar with predictions
function displayStatsCalendar(participants) {
    console.log('displayStatsCalendar called with', participants.length, 'participants');
    
    const calendar = document.getElementById('statsCalendarGrid');
    if (!calendar) {
        console.error('Stats calendar element not found!');
        return;
    }
    
    // Group predictions by date
    const dateGroups = {};
    
    participants.forEach(participant => {
        console.log('Processing participant:', participant.name);
        const dueDateGuess = participant.guesses.find(g => g.question_type === 'due_date');
        console.log('Due date guess for', participant.name, ':', dueDateGuess);
        if (dueDateGuess && dueDateGuess.guess_value) {
            const dateKey = dueDateGuess.guess_value;
            console.log('Adding', participant.name, 'to date', dateKey);
            if (!dateGroups[dateKey]) {
                dateGroups[dateKey] = [];
            }
            dateGroups[dateKey].push(participant.name);
        }
    });
    
    console.log('Date groups:', dateGroups);
    
    // Generate calendar for Sept 20 - Oct 20 (same as quiz)
    const startDate = new Date(2025, 8, 20); // Sept 20, 2025
    const endDate = new Date(2025, 9, 20);   // Oct 20, 2025
    
    // Clear calendar
    calendar.innerHTML = '';
    
    let currentMonth = -1;
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        // Add month label for first day of each month
        if (date.getMonth() !== currentMonth) {
            const monthLabel = document.createElement('div');
            monthLabel.className = 'stats-month-label';
            monthLabel.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            calendar.appendChild(monthLabel);
            currentMonth = date.getMonth();
        }
        
        const dayElement = document.createElement('div');
        dayElement.className = 'stats-calendar-day';
        
        const dateKey = date.toISOString().split('T')[0];
        const predictors = dateGroups[dateKey] || [];
        
        console.log(`Date ${date.getDate()}: ${dateKey}, predictors:`, predictors);
        
        // Special styling for due date (October 14th)
        if (date.getMonth() === 9 && date.getDate() === 14) {
            dayElement.classList.add('due-date');
        }
        
        // Special styling if this date has predictions
        if (predictors.length > 0) {
            dayElement.classList.add('has-predictions');
            console.log(`Adding has-predictions class to ${date.getDate()}`);
        }
        
        // Create day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'stats-day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);
        
        // Create names list
        if (predictors.length > 0) {
            console.log(`Creating names list for ${date.getDate()} with:`, predictors);
            const namesList = document.createElement('div');
            namesList.className = 'stats-day-names';
            
            predictors.forEach(name => {
                console.log(`Adding name element for: ${name}`);
                const nameElement = document.createElement('span');
                nameElement.className = 'name';
                nameElement.textContent = name;
                namesList.appendChild(nameElement);
            });
            
            dayElement.appendChild(namesList);
            console.log(`Added names list to day ${date.getDate()}`);
        }
        
        calendar.appendChild(dayElement);
    }
    
    console.log('Stats calendar populated');
}