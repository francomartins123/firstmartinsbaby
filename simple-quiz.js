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
    
    // Show results first, then try to save in background
    showFlowerGarden();
    
    // Try to save data in background
    setTimeout(async () => {
        try {
            console.log('Attempting to save data to database...');
            
            // Dynamically load Supabase only when needed
            if (!window.supabaseLoaded) {
                console.log('Loading Supabase...');
                const script = document.createElement('script');
                script.src = 'supabase.js';
                document.head.appendChild(script);
                
                await new Promise(resolve => {
                    script.onload = resolve;
                    script.onerror = () => {
                        console.error('Failed to load supabase.js');
                        resolve();
                    };
                });
                
                window.supabaseLoaded = true;
            }
            
            if (typeof SupabaseDB !== 'undefined') {
                console.log('Supabase loaded, creating database instance...');
                const db = new SupabaseDB();
                
                // Create participant
                console.log('Creating participant:', playerName);
                const participant = await db.createParticipant(playerName);
                console.log('Participant created:', participant);
                
                // Save all answers
                console.log('Saving answers:', answers);
                for (const [type, value] of Object.entries(answers)) {
                    await db.createGuess(participant.id, type, value);
                    console.log('Saved guess:', type, value);
                }
                
                console.log('All data saved successfully!');
                
                // Refresh flower garden with all participants
                console.log('Loading all participants for flower garden...');
                const participants = await db.getAllParticipants();
                console.log('Found participants:', participants.length);
                displayFlowers(participants);
            } else {
                console.error('SupabaseDB not available after loading');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }, 1000);
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

function createFlower(participant, index) {
    const flower = document.createElement('div');
    flower.className = 'flower';
    
    // Random position
    const x = Math.random() * 70 + 10;
    const y = Math.random() * 60 + 20;
    flower.style.left = x + '%';
    flower.style.top = y + '%';
    
    // Get answers
    const guesses = {};
    participant.guesses.forEach(g => {
        guesses[g.question_type] = g.guess_value;
    });
    
    // Create petals with labels and values
    const petals = [
        { label: 'Due Date', value: formatDate(guesses.due_date) },
        { label: 'Weight', value: `${guesses.weight} lbs` },
        { label: 'Name', value: guesses.middle_name || 'TBD' },
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
        <div class="flower-center">😊</div>
        <div class="flower-stem"></div>
        <div class="flower-pot">
            <div class="pot-text">${participant.name}</div>
        </div>
    `;
    
    return flower;
}

function formatDate(dateString) {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}