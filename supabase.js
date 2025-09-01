// Supabase configuration and client setup
const SUPABASE_URL = 'https://nldazeppgrqnzxpiicrw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDA1NzEsImV4cCI6MjA3MjMxNjU3MX0.F1QzJ1nbbeStOonpW36PCtAU-baUctlsPlG78RYKaRE';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database helper functions
const db = {
    // Check if email already exists
    async checkEmailExists(email) {
        const { data, error } = await supabaseClient
            .from('participants')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.error('Error checking email:', error);
            return false;
        }
        return !!data;
    },

    // Create new participant
    async createParticipant(name, email) {
        const { data, error } = await supabaseClient
            .from('participants')
            .insert([
                { 
                    name: name.trim(), 
                    email: email.toLowerCase().trim() 
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating participant:', error);
            throw error;
        }
        return data;
    },

    // Save all guesses for a participant
    async saveGuesses(participantId, guesses) {
        const guessRecords = Object.entries(guesses).map(([questionType, guessValue]) => ({
            participant_id: participantId,
            question_type: questionType,
            guess_value: String(guessValue)
        }));

        const { data, error } = await supabaseClient
            .from('guesses')
            .insert(guessRecords)
            .select();

        if (error) {
            console.error('Error saving guesses:', error);
            throw error;
        }

        // Mark participant as locked in
        await supabaseClient
            .from('participants')
            .update({ locked_in: true })
            .eq('id', participantId);

        return data;
    },

    // Get all participants and their guesses
    async getAllParticipantsWithGuesses() {
        const { data: participants, error: participantsError } = await supabaseClient
            .from('participants')
            .select(`
                id,
                name,
                email,
                submitted_at,
                locked_in,
                guesses (
                    question_type,
                    guess_value
                )
            `)
            .eq('locked_in', true)
            .order('submitted_at', { ascending: true });

        if (participantsError) {
            console.error('Error fetching participants:', participantsError);
            throw participantsError;
        }

        return participants;
    },

    // Subscribe to real-time updates on participants
    subscribeToParticipants(callback) {
        const subscription = supabaseClient
            .channel('participants-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'participants',
                    filter: 'locked_in=eq.true'
                },
                callback
            )
            .subscribe();

        return subscription;
    }
};