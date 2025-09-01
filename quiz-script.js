// Quiz questions adapted for baby guessing game
const questions = [
    {
        title: "When will our little one arrive?",
        optionA: {
            text: "Early Bird\nOctober 5-10",
            value: "2025-10-08"
        },
        optionB: {
            text: "Right on Time\nOctober 11-17",
            value: "2025-10-14"
        }
    },
    {
        title: "How much will our baby weigh?",
        optionA: {
            text: "Petite Bundle\n6-7 lbs",
            value: "6.5"
        },
        optionB: {
            text: "Chunky Monkey\n8-9 lbs",
            value: "8.5"
        }
    },
    {
        title: "What will be baby's middle name?",
        optionA: {
            text: "Classic Choice\nJames",
            value: "James"
        },
        optionB: {
            text: "Modern Pick\nAiden",
            value: "Aiden"
        }
    },
    {
        title: "What time of day will baby arrive?",
        optionA: {
            text: "Morning Glory\n6AM - 12PM",
            value: "Morning"
        },
        optionB: {
            text: "Night Owl\n6PM - 12AM",
            value: "Night"
        }
    },
    {
        title: "What color will baby's eyes be?",
        optionA: {
            text: "Ocean Blue\nBlue eyes",
            value: "Blue"
        },
        optionB: {
            text: "Warm Brown\nBrown eyes",
            value: "Brown"
        }
    },
    {
        title: "How much hair will baby have?",
        optionA: {
            text: "Fuzzy Peach\nLight hair",
            value: "Light"
        },
        optionB: {
            text: "Full Mane\nLots of hair",
            value: "Dark"
        }
    }
];

// Quiz state
let currentQuestionIndex = 0;
let playerName = '';
let answers = {};

// Database instance
let db;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Quiz app starting...');
    
    // Setup event listeners first
    setupEventListeners();
    
    // Initialize database later (non-blocking)
    setTimeout(() => {
        if (typeof SupabaseDB !== 'undefined') {
            try {
                db = new SupabaseDB();
                console.log('✅ Database initialized');
                loadExistingParticipants().catch(err => {
                    console.error('⚠️ Error loading existing participants:', err);
                });
            } catch (error) {
                console.error('❌ Database initialization failed:', error);
            }
        } else {
            console.error('❌ SupabaseDB not found - continuing without database');
        }
    }, 100);
    
    console.log('🚀 Quiz app initialized successfully');
});

function setupEventListeners() {
    console.log('🔗 Setting up event listeners...');
    
    // Name form submission with multiple fallbacks
    const nameForm = document.getElementById('nameForm');
    const startBtn = document.querySelector('.start-btn');
    
    if (nameForm) {
        nameForm.addEventListener('submit', handleNameSubmit);
        nameForm.onsubmit = handleNameSubmit; // Fallback
        console.log('✅ Name form listener added');
    } else {
        console.error('❌ Name form not found!');
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            console.log('🔘 Start button clicked');
            handleNameSubmit(e);
        });
        console.log('✅ Start button listener added');
    }
    
    // Option selection
    const optionA = document.getElementById('optionA');
    const optionB = document.getElementById('optionB');
    
    if (optionA) {
        optionA.addEventListener('click', () => selectOption('A'));
        console.log('✅ Option A listener added');
    } else {
        console.warn('⚠️ Option A not found (normal on load)');
    }
    
    if (optionB) {
        optionB.addEventListener('click', () => selectOption('B'));
        console.log('✅ Option B listener added');
    } else {
        console.warn('⚠️ Option B not found (normal on load)');
    }
}

function handleNameSubmit(e) {
    console.log('🎯 Form submitted, preventing default...');
    e.preventDefault();
    e.stopPropagation();
    
    const nameInput = document.getElementById('playerName');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Please enter your name!');
        return false;
    }
    
    console.log(`👋 Starting quiz for: ${name}`);
    playerName = name;
    
    // Start the quiz immediately without database checks for now
    console.log('🎯 Starting quiz...');
    showScreen('quizScreen');
    loadQuestion(0);
    
    return false; // Prevent any form submission
}

function showScreen(screenId) {
    console.log(`🔄 Switching to screen: ${screenId}`);
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log(`✅ Screen ${screenId} is now active`);
    } else {
        console.error(`❌ Screen ${screenId} not found!`);
    }
}

function loadQuestion(index) {
    console.log(`📝 Loading question ${index + 1} of ${questions.length}`);
    
    if (index >= questions.length) {
        console.log('🎉 Quiz completed, moving to results');
        completeQuiz();
        return;
    }
    
    currentQuestionIndex = index;
    const question = questions[index];
    
    // Update progress
    updateProgress();
    
    // Update question content with error checking
    const titleElement = document.getElementById('questionTitle');
    const optionAElement = document.querySelector('#optionA .option-text');
    const optionBElement = document.querySelector('#optionB .option-text');
    
    if (titleElement) titleElement.textContent = question.title;
    if (optionAElement) optionAElement.innerHTML = question.optionA.text;
    if (optionBElement) optionBElement.innerHTML = question.optionB.text;
    
    console.log(`✅ Question loaded: ${question.title}`);
}

function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    
    const percentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
    }
    
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = questions.length;
    }
}

function selectOption(option) {
    const question = questions[currentQuestionIndex];
    const selectedValue = option === 'A' ? question.optionA.value : question.optionB.value;
    
    // Map question to database field
    const questionTypeMap = {
        0: 'due_date',      // When will baby arrive
        1: 'weight',        // How much will baby weigh
        2: 'middle_name',   // Middle name
        3: 'birth_time',    // Time of day
        4: 'eye_color',     // Eye color
        5: 'hair_color'     // Hair amount
    };
    
    const questionType = questionTypeMap[currentQuestionIndex];
    answers[questionType] = selectedValue;
    
    console.log(`✅ Selected ${option}: ${selectedValue} for ${questionType}`);
    
    // Add visual feedback
    const optionCard = document.getElementById(option === 'A' ? 'optionA' : 'optionB');
    optionCard.style.transform = 'scale(1.1)';
    optionCard.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
    
    // Move to next question after a short delay
    setTimeout(() => {
        loadQuestion(currentQuestionIndex + 1);
    }, 800);
}

async function completeQuiz() {
    console.log('🎉 Quiz completed!', answers);
    
    if (!db) {
        console.error('❌ Database not available');
        showResultsScreen();
        return;
    }
    
    try {
        // Create participant
        const participant = await db.createParticipant(playerName);
        console.log('✅ Participant created:', participant);
        
        // Create guesses
        for (const [questionType, guessValue] of Object.entries(answers)) {
            await db.createGuess(participant.id, questionType, guessValue);
        }
        
        console.log('✅ All guesses saved!');
        
        // Show results
        await showResultsScreen();
        
    } catch (error) {
        console.error('❌ Error saving quiz results:', error);
        alert('There was an error saving your guesses. Please try again!');
    }
}

async function showResultsScreen() {
    showScreen('resultsScreen');
    await loadExistingParticipants();
}

async function loadExistingParticipants() {
    if (!db) return;
    
    try {
        const participants = await db.getAllParticipants();
        console.log(`🌸 Loaded ${participants.length} participants`);
        
        displayFlowerGarden(participants);
        
    } catch (error) {
        console.error('❌ Error loading participants:', error);
    }
}

function displayFlowerGarden(participants) {
    const garden = document.getElementById('flowerGarden');
    const countElement = document.getElementById('participantCount');
    
    if (!garden) return;
    
    // Update count
    if (countElement) {
        countElement.textContent = participants.length;
    }
    
    // Clear existing flowers (except count)
    const existingFlowers = garden.querySelectorAll('.flower');
    existingFlowers.forEach(flower => flower.remove());
    
    // Create flowers for each participant
    participants.forEach((participant, index) => {
        const flower = createFlower(participant, index);
        garden.appendChild(flower);
    });
}

function createFlower(participant, index) {
    const flowerDiv = document.createElement('div');
    flowerDiv.className = 'flower';
    
    // Position flower randomly
    const x = Math.random() * 70 + 10; // 10-80% to leave margin
    const y = Math.random() * 60 + 20; // 20-80% to leave margin
    flowerDiv.style.left = `${x}%`;
    flowerDiv.style.top = `${y}%`;
    
    // Convert guesses array to object
    const guessesObj = {};
    participant.guesses.forEach(guess => {
        guessesObj[guess.question_type] = guess.guess_value;
    });
    
    // Create petals with guess data
    const petalData = [
        { label: 'Due', value: formatDate(guessesObj.due_date) },
        { label: 'Weight', value: `${guessesObj.weight} lbs` },
        { label: 'Name', value: guessesObj.middle_name || 'TBD' },
        { label: 'Time', value: guessesObj.birth_time || 'TBD' },
        { label: 'Eyes', value: guessesObj.eye_color || 'TBD' },
        { label: 'Hair', value: guessesObj.hair_color || 'TBD' }
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

function formatDate(dateString) {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Export for debugging
window.QuizApp = {
    questions,
    currentQuestionIndex,
    playerName,
    answers,
    loadQuestion,
    selectOption,
    showScreen
};