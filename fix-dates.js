// Script to fix the incorrect dates in the database
// Run this script in the browser console on the results page

async function fixDates() {
    console.log('🔧 Starting date fix...');
    
    if (!supabaseClient) {
        console.error('❌ Supabase client not available');
        return;
    }
    
    try {
        // Get all participants with their current dates
        const participants = await db.getAllParticipantsWithGuesses();
        console.log('📊 Current participants:', participants);
        
        // Fix dates for each participant
        const updates = [
            { name: 'Julia', correctDate: '2025-10-03' },
            { name: 'Elise', correctDate: '2025-10-03' },
            { name: 'Franco', correctDate: '2025-10-19' }
        ];
        
        for (const update of updates) {
            const participant = participants.find(p => p.name === update.name);
            if (participant) {
                console.log(`🔄 Updating ${update.name} to ${update.correctDate}`);
                
                // Find the due_date guess
                const dateGuess = participant.guesses.find(g => g.question_type === 'due_date');
                if (dateGuess) {
                    console.log(`  Current: ${dateGuess.guess_value} → New: ${update.correctDate}`);
                    
                    // Update the guess in the database
                    const { error } = await supabaseClient
                        .from('guesses')
                        .update({ guess_value: update.correctDate })
                        .eq('participant_id', participant.id)
                        .eq('question_type', 'due_date');
                    
                    if (error) {
                        console.error(`❌ Error updating ${update.name}:`, error);
                    } else {
                        console.log(`✅ Successfully updated ${update.name}`);
                    }
                }
            }
        }
        
        console.log('🎉 Date fix complete! Refresh the page to see changes.');
        
    } catch (error) {
        console.error('❌ Error fixing dates:', error);
    }
}

// Run the fix
fixDates();