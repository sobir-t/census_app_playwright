// require('dotenv').config({ path: '.env' });
import postgres from 'postgres';

const { DATABASE_URL } = process.env;

console.log(`DATABASE_URL = ${DATABASE_URL}`);

const sql = postgres(DATABASE_URL as string); // will use psql environment variables

export default sql;
