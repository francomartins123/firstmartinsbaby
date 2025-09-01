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

// Simple initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('App starting...');
    
    // Just setup the form listener
    const nameForm = document.getElementById('nameForm');
    if (nameForm) {
        nameForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('playerName');
            const name = nameInput.value.trim();
            
            if (name) {
                console.log('Starting quiz for:', name);
                playerName = name;
                
                // Go to quiz screen
                document.getElementById('welcomeScreen').classList.remove('active');
                document.getElementById('quizScreen').classList.add('active');
                
                // Load first question
                loadQuestion(0);
            }
        });
    }
});


function loadQuestion(index) {
    console.log('Loading question', index + 1);
    
    if (index >= questions.length) {
        // Show results
        document.getElementById('quizScreen').classList.remove('active');
        document.getElementById('resultsScreen').classList.add('active');
        return;
    }
    
    currentQuestionIndex = index;
    const question = questions[index];
    
    // Update progress
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const percentage = ((index + 1) / questions.length) * 100;
        progressFill.style.width = percentage + '%';
    }
    
    const currentSpan = document.getElementById('currentQuestion');
    if (currentSpan) currentSpan.textContent = index + 1;
    
    // Update question
    const titleElement = document.getElementById('questionTitle');
    if (titleElement) titleElement.textContent = question.title;
    
    const optionAElement = document.querySelector('#optionA .option-text');
    const optionBElement = document.querySelector('#optionB .option-text');
    
    if (optionAElement) optionAElement.innerHTML = question.optionA.text;
    if (optionBElement) optionBElement.innerHTML = question.optionB.text;
    
    // Add option click handlers
    document.getElementById('optionA').onclick = () => selectOption('A');
    document.getElementById('optionB').onclick = () => selectOption('B');
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
    
    console.log('Selected:', option, selectedValue);
    
    // Store the answer
    const questionTypes = ['due_date', 'weight', 'middle_name', 'birth_time', 'eye_color', 'hair_color'];
    answers[questionTypes[currentQuestionIndex]] = selectedValue;
    
    // Go to next question
    setTimeout(() => {
        loadQuestion(currentQuestionIndex + 1);
    }, 500);
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