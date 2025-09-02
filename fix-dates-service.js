// Script to fix dates using service role key
const SUPABASE_URL = 'https://nldazeppgrqnzxpiicrw.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njc0MDU3MSwiZXhwIjoyMDcyMzE2NTcxfQ.1r9ogiANAuXT8o2xBBHD47W6k9CEBOkwV4vCsGJg57Q';

async function fixDatesWithServiceKey() {
    console.log('🔧 Starting date fix with service role key...');
    
    // Initialize Supabase client with service role key
    const serviceClient = supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    try {
        // Fix Julia and Elise dates (should be 2025-10-03)
        console.log('📅 Fixing Julia and Elise dates to 2025-10-03...');
        const { error: error1 } = await serviceClient
            .from('guesses')
            .update({ guess_value: '2025-10-03' })
            .eq('question_type', 'due_date')
            .in('participant_id', [
                // Get participant IDs for Julia and Elise
                ...(await serviceClient
                    .from('participants')
                    .select('id')
                    .in('name', ['Julia', 'Elise'])
                ).data.map(p => p.id)
            ]);

        if (error1) {
            console.error('❌ Error updating Julia/Elise:', error1);
        } else {
            console.log('✅ Successfully updated Julia and Elise to Oct 3');
        }

        // Fix Franco date (should be 2025-10-19)
        console.log('📅 Fixing Franco date to 2025-10-19...');
        const { error: error2 } = await serviceClient
            .from('guesses')
            .update({ guess_value: '2025-10-19' })
            .eq('question_type', 'due_date')
            .in('participant_id', [
                // Get participant ID for Franco
                ...(await serviceClient
                    .from('participants')
                    .select('id')
                    .eq('name', 'Franco')
                ).data.map(p => p.id)
            ]);

        if (error2) {
            console.error('❌ Error updating Franco:', error2);
        } else {
            console.log('✅ Successfully updated Franco to Oct 19');
        }

        console.log('🎉 Date fix complete! Refresh the page to see changes.');
        
    } catch (error) {
        console.error('❌ Error fixing dates:', error);
    }
}

// Run the fix
fixDatesWithServiceKey();