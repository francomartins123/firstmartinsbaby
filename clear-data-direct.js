// Direct database clearing using raw SQL
const { execSync } = require('child_process');

// Use psql to connect directly to database and clear data
const connectionString = 'postgresql://postgres:[password]@[host]:[port]/postgres';

const clearQueries = [
    'DELETE FROM public.guesses;',
    'DELETE FROM public.participants;'
].join(' ');

try {
    // This would need the actual connection string
    console.log('Would execute:', clearQueries);
    console.log('Need actual postgres connection string for direct access');
} catch (error) {
    console.error('Error:', error);
}