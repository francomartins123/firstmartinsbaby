// Supabase configuration and client setup
const SUPABASE_URL = 'https://nldazeppgrqnzxpiicrw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDA1NzEsImV4cCI6MjA3MjMxNjU3MX0.F1QzJ1nbbeStOonpW36PCtAU-baUctlsPlG78RYKaRE';

// Initialize Supabase client
let supabaseClient;

// Initialize after supabase library loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully');
    } else {
        console.error('Supabase library not loaded');
    }
});

// Database helper functions
const db = {
    // Check if name already exists
    async checkNameExists(name) {
        const { data, error } = await supabaseClient
            .from('participants')
            .select('id')
            .eq('name', name.trim())
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.error('Error checking name:', error);
            return false;
        }
        return !!data;
    },

    // Create new participant
    async createParticipant(name) {
        const { data, error } = await supabaseClient
            .from('participants')
            .insert([
                { 
                    name: name.trim(), 
                    email: `${name.trim().replace(/\s+/g, '').toLowerCase()}@placeholder.com`
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
    },

    // Create a single guess (legacy compatibility)
    async createGuess(participantId, questionType, guessValue) {
        const { data, error } = await supabaseClient
            .from('guesses')
            .insert([{
                participant_id: participantId,
                question_type: questionType,
                guess_value: String(guessValue)
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating guess:', error);
            throw error;
        }
        return data;
    },

    // Get all participants (legacy compatibility)
    async getAllParticipants() {
        return this.getAllParticipantsWithGuesses();
    },

    // Clear all data from tables
    async clearAllData() {
        // First delete all guesses
        const { error: guessesError } = await supabaseClient
            .from('guesses')
            .delete()
            .neq('id', 'impossible-value-to-match-all');

        if (guessesError) {
            console.error('Error clearing guesses:', guessesError);
            throw guessesError;
        }

        // Then delete all participants
        const { error: participantsError } = await supabaseClient
            .from('participants')
            .delete()
            .neq('id', 'impossible-value-to-match-all');

        if (participantsError) {
            console.error('Error clearing participants:', participantsError);
            throw participantsError;
        }

        console.log('All data cleared successfully');
    }
};