import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../src/db';

async function main() {
    console.log('Pushing schema to database...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Schema pushed successfully!');
}

main().catch((err) => {
    console.error('Error pushing schema:', err);
    process.exit(1);
});
