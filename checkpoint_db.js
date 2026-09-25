const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'reading_hub.sqlite');
const db = new DatabaseSync(dbPath);
console.log('Running PRAGMA wal_checkpoint(TRUNCATE)...');
const result = db.prepare('PRAGMA wal_checkpoint(TRUNCATE)').get();
console.log('Checkpoint result:', result);
db.close();
console.log('Database checkpoint completed.');
