// Simple quiz with no external dependencies
const questions = [
    {
        title: "When will our little one arrive?",
        optionA: { text: "Early Bird\nOctober 5-10", value: "2025-10-08" },
        optionB: { text: "Right on Time\nOctober 11-17", value: "2025-10-14" }
    },
    {
        title: "How much will our baby weigh?",
        optionA: { text: "Petite Bundle\n6-7 lbs", value: "6.5" },
        optionB: { text: "Chunky Monkey\n8-9 lbs", value: "8.5" }
    },
    {
        title: "What will be baby's middle name?",
        optionA: { text: "Classic Choice\nJames", value: "James" },
        optionB: { text: "Modern Pick\nAiden", value: "Aiden" }
    },
    {
        title: "What time of day will baby arrive?",
        optionA: { text: "Morning Glory\n6AM - 12PM", value: "Morning" },
        optionB: { text: "Night Owl\n6PM - 12AM", value: "Night" }
    },
    {
        title: "What color will baby's eyes be?",
        optionA: { text: "Ocean Blue\nBlue eyes", value: "Blue" },
        optionB: { text: "Warm Brown\nBrown eyes", value: "Brown" }
    },
    {
        title: "How much hair will baby have?",
        optionA: { text: "Fuzzy Peach\nLight hair", value: "Light" },
        optionB: { text: "Full Mane\nLots of hair", value: "Dark" }
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
    // Hide welcome, show quiz
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'flex';
    
    // Load first question
    loadQuestion(0);
}

function loadQuestion(index) {
    currentQuestion = index;
    
    if (index >= questions.length) {
        finishQuiz();
        return;
    }
    
    const question = questions[index];
    
    // Update progress
    const progress = ((index + 1) / questions.length) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('totalQuestions').textContent = questions.length;
    
    // Update question
    document.getElementById('questionTitle').textContent = question.title;
    document.querySelector('#optionA .option-text').innerHTML = question.optionA.text;
    document.querySelector('#optionB .option-text').innerHTML = question.optionB.text;
    
    // Setup click handlers
    document.getElementById('optionA').onclick = () => selectAnswer('A');
    document.getElementById('optionB').onclick = () => selectAnswer('B');
}

function selectAnswer(choice) {
    const question = questions[currentQuestion];
    const value = choice === 'A' ? question.optionA.value : question.optionB.value;
    
    // Store answer
    const questionTypes = ['due_date', 'weight', 'middle_name', 'birth_time', 'eye_color', 'hair_color'];
    answers[questionTypes[currentQuestion]] = value;
    
    console.log('Answer stored:', questionTypes[currentQuestion], value);
    
    // Next question after brief delay
    setTimeout(() => {
        loadQuestion(currentQuestion + 1);
    }, 500);
}

function finishQuiz() {
    console.log('Quiz complete! Answers:', answers);
    
    // Hide quiz, show results
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'flex';
    
    // Save to database and show results
    saveAndShowResults();
}

async function saveAndShowResults() {
    // Show results first, then try to save in background
    showFlowerGarden();
    
    // Try to save data in background
    setTimeout(async () => {
        try {
            // Dynamically load Supabase only when needed
            if (!window.supabaseLoaded) {
                const script = document.createElement('script');
                script.src = 'supabase.js';
                document.head.appendChild(script);
                
                await new Promise(resolve => {
                    script.onload = resolve;
                });
                
                window.supabaseLoaded = true;
            }
            
            if (typeof SupabaseDB !== 'undefined') {
                const db = new SupabaseDB();
                
                // Create participant
                const participant = await db.createParticipant(playerName);
                
                // Save all answers
                for (const [type, value] of Object.entries(answers)) {
                    await db.createGuess(participant.id, type, value);
                }
                
                console.log('Data saved successfully!');
                
                // Refresh flower garden with all participants
                const participants = await db.getAllParticipants();
                displayFlowers(participants);
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }, 1000);
}

function showFlowerGarden() {
    // Show current user's flower immediately (offline mode)
    const currentUser = {
        name: playerName,
        guesses: Object.entries(answers).map(([type, value]) => ({
            question_type: type,
            guess_value: value
        }))
    };
    
    displayFlowers([currentUser]);
    console.log('Showing offline flower garden');
}

function displayFlowers(participants) {
    const garden = document.getElementById('flowerGarden');
    const count = document.getElementById('participantCount');
    
    count.textContent = participants.length;
    
    // Clear existing flowers except count
    const existingFlowers = garden.querySelectorAll('.flower');
    existingFlowers.forEach(f => f.remove());
    
    // Create flowers
    participants.forEach((participant, index) => {
        const flower = createFlower(participant, index);
        garden.appendChild(flower);
    });
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
    
    // Create petals
    const petals = [
        formatDate(guesses.due_date),
        `${guesses.weight} lbs`,
        guesses.middle_name || 'TBD',
        guesses.birth_time || 'TBD',
        guesses.eye_color || 'TBD',
        guesses.hair_color || 'TBD'
    ];
    
    const petalsHTML = petals.map(text => `
        <div class="flower-petal">
            <div class="petal-text">${text}</div>
        </div>
    `).join('');
    
    flower.innerHTML = `
        ${petalsHTML}
        <div class="flower-center"></div>
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