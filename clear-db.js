// Clear database using proper service role
const SUPABASE_URL = 'https://nldazeppgrqnzxpiicrw.supabase.co';

// Let me try using the proper method to delete all records
async function clearDatabase() {
    try {
        const response1 = await fetch(`${SUPABASE_URL}/rest/v1/guesses`, {
            method: 'DELETE',
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDA1NzEsImV4cCI6MjA3MjMxNjU3MX0.F1QzJ1nbbeStOonpW36PCtAU-baUctlsPlG78RYKaRE',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDA1NzEsImV4cCI6MjA3MjMxNjU3MX0.F1QzJ1nbbeStOonpW36PCtAU-baUctlsPlG78RYKaRE',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
        });

        const response2 = await fetch(`${SUPABASE_URL}/rest/v1/participants`, {
            method: 'DELETE', 
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDA1NzEsImV4cCI6MjA3MjMxNjU3MX0.F1QzJ1nbbeStOonpW36PCtAU-baUctlsPlG78RYKaRE',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGF6ZXBwZ3Jxbnp4cGlpY3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDA1NzEsImV4cCI6MjA3MjMxNjU3MX0.F1QzJ1nbbeStOonpW36PCtAU-baUctlsPlG78RYKaRE',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
        });

        console.log('Guesses cleared:', response1.status);
        console.log('Participants cleared:', response2.status);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

clearDatabase();