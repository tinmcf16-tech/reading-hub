const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'reading_hub.sqlite');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for performance and data safety
db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
`);

function initSchema() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            role TEXT NOT NULL,
            grade_level TEXT DEFAULT 'Grade 3',
            avatar_id TEXT DEFAULT 'avatar_1',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS terms (
            id INTEGER PRIMARY KEY,
            term_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            theme TEXT,
            is_active INTEGER DEFAULT 0,
            is_locked INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS weeks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            term_id INTEGER NOT NULL REFERENCES terms(id),
            week_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            is_unlocked INTEGER DEFAULT 0,
            UNIQUE(term_id, week_number)
        );

        CREATE TABLE IF NOT EXISTS subjects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            icon TEXT NOT NULL,
            color TEXT NOT NULL,
            bg_color TEXT NOT NULL,
            grade_level TEXT DEFAULT 'Grade 3'
        );

        CREATE TABLE IF NOT EXISTS competencies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            term_id INTEGER NOT NULL REFERENCES terms(id),
            week_id INTEGER NOT NULL REFERENCES weeks(id),
            subject_id TEXT NOT NULL REFERENCES subjects(id),
            competency_text TEXT NOT NULL,
            strand_domain TEXT,
            macro_skills TEXT,
            UNIQUE(week_id, subject_id)
        );

        CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            competency_id INTEGER NOT NULL REFERENCES competencies(id),
            day_number INTEGER DEFAULT 1,
            title TEXT NOT NULL,
            explanation_learn TEXT,
            explore_story TEXT,
            explore_examples TEXT,
            illustrations TEXT
        );

        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            competency_id INTEGER NOT NULL REFERENCES competencies(id),
            day_number INTEGER DEFAULT 3,
            section_type TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            activity_type TEXT NOT NULL,
            title TEXT NOT NULL,
            instructions TEXT,
            points INTEGER DEFAULT 10,
            question_data TEXT NOT NULL,
            correct_answers TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS student_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id),
            activity_id INTEGER NOT NULL REFERENCES activities(id),
            answer_data TEXT,
            score INTEGER NOT NULL,
            max_score INTEGER NOT NULL,
            percentage REAL NOT NULL,
            attempts INTEGER DEFAULT 1,
            teacher_feedback TEXT,
            completed_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS student_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id),
            term_id INTEGER NOT NULL REFERENCES terms(id),
            week_id INTEGER NOT NULL REFERENCES weeks(id),
            subject_id TEXT NOT NULL REFERENCES subjects(id),
            completed_activities INTEGER DEFAULT 0,
            total_activities INTEGER DEFAULT 0,
            score_sum INTEGER DEFAULT 0,
            max_score_sum INTEGER DEFAULT 0,
            percentage REAL DEFAULT 0,
            status TEXT DEFAULT 'not_started',
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, week_id, subject_id)
        );

        CREATE TABLE IF NOT EXISTS remediation_assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id),
            competency_id INTEGER NOT NULL REFERENCES competencies(id),
            assigned_by INTEGER NOT NULL REFERENCES users(id),
            status TEXT DEFAULT 'assigned',
            notes TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS user_stats (
            user_id INTEGER PRIMARY KEY REFERENCES users(id),
            total_stars INTEGER DEFAULT 0,
            current_streak INTEGER DEFAULT 1,
            best_streak INTEGER DEFAULT 1,
            last_active_date TEXT
        );

        CREATE TABLE IF NOT EXISTS user_badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id),
            badge_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            icon TEXT NOT NULL,
            earned_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("Database schema initialized successfully.");
}

module.exports = {
    db,
    initSchema
};
