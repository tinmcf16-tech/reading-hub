const { db } = require('./db');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const pinHash = bcrypt.hashSync('1234', salt);

// Check if juan.g1 exists
const existingJuan = db.prepare("SELECT * FROM users WHERE username = 'juan.g1'").get();
if (!existingJuan) {
    const res = db.prepare(`
        INSERT INTO users (username, password_hash, full_name, role, grade_level, avatar_id)
        VALUES ('juan.g1', ?, 'Juan Dela Cruz', 'student', 'Grade 1', 'avatar_boy1')
    `).run(pinHash);
    db.prepare('INSERT OR IGNORE INTO user_stats (user_id, total_stars, current_streak, best_streak) VALUES (?, 15, 2, 2)').run(res.lastInsertRowid);
    console.log("Created Grade 1 student: Juan Dela Cruz (juan.g1)");
}

// Check if maria.g2 exists
const existingMaria = db.prepare("SELECT * FROM users WHERE username = 'maria.g2'").get();
if (!existingMaria) {
    const res = db.prepare(`
        INSERT INTO users (username, password_hash, full_name, role, grade_level, avatar_id)
        VALUES ('maria.g2', ?, 'Maria Santos', 'student', 'Grade 2', 'avatar_girl1')
    `).run(pinHash);
    db.prepare('INSERT OR IGNORE INTO user_stats (user_id, total_stars, current_streak, best_streak) VALUES (?, 20, 3, 3)').run(res.lastInsertRowid);
    console.log("Created Grade 2 student: Maria Santos (maria.g2)");
}

const allStudents = db.prepare("SELECT id, username, full_name, role, grade_level FROM users WHERE role = 'student'").all();
console.log("Current enrolled students:", allStudents);

db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
