// Persistent Cloud Sync using GitHub Data Storage
// Keeps student rosters, names, and passwords persistently saved in GitHub's cloud
// so that Render free tier container restarts will NEVER lose teacher updates.

const path = require('path');
const fs = require('fs');

function resolveGithubToken() {
    if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
    const envFile = path.join(__dirname, '../.env');
    if (fs.existsSync(envFile)) {
        const text = fs.readFileSync(envFile, 'utf8');
        for (const line of text.split('\n')) {
            const trimmed = line.trim();
            if (trimmed.startsWith('GITHUB_TOKEN=')) {
                return trimmed.substring('GITHUB_TOKEN='.length).trim();
            }
        }
    }
    return '';
}

const GITHUB_TOKEN = resolveGithubToken();
const REPO = 'tinmcf16-tech/reading-hub';
const BRANCH = 'data-storage';
const FILE_PATH = 'roster_data.json';
const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

async function getCloudData() {
    try {
        const res = await fetch(`${API_URL}?ref=${BRANCH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'User-Agent': 'ReadingHUB'
            }
        });
        if (res.status === 404) return null;
        if (!res.ok) {
            console.warn(`[CloudSync] Failed to fetch cloud data: HTTP ${res.status}`);
            return null;
        }
        const json = await res.json();
        const content = Buffer.from(json.content, 'base64').toString('utf-8');
        return { data: JSON.parse(content), sha: json.sha };
    } catch (err) {
        console.warn(`[CloudSync] getCloudData error: ${err.message}`);
        return null;
    }
}

async function putCloudData(payload, sha = null) {
    try {
        const content = Buffer.from(JSON.stringify(payload, null, 2)).toString('base64');
        const body = {
            message: `Cloud auto-sync roster: ${payload.students?.length || 0} learners (${new Date().toISOString()})`,
            content,
            branch: BRANCH
        };
        if (sha) body.sha = sha;

        const res = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'User-Agent': 'ReadingHUB',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errText = await res.text();
            console.warn(`[CloudSync] Failed to write cloud data: HTTP ${res.status} - ${errText}`);
            return false;
        }
        return true;
    } catch (err) {
        console.warn(`[CloudSync] putCloudData error: ${err.message}`);
        return false;
    }
}

// Restore saved learners & credentials from cloud into SQLite
async function restoreFromCloud(db) {
    console.log('[CloudSync] Checking cloud for persistent student records...');
    const cloud = await getCloudData();
    if (!cloud || !cloud.data || !Array.isArray(cloud.data.students)) {
        console.log('[CloudSync] No cloud student records found yet. Initializing cloud backup...');
        await saveToCloud(db);
        return;
    }

    const students = cloud.data.students;
    console.log(`[CloudSync] Found ${students.length} learners in cloud storage. Merging into database...`);

    const checkStmt = db.prepare('SELECT id, password_hash, full_name, grade_level, avatar_id FROM users WHERE LOWER(username) = LOWER(?)');
    const updateStmt = db.prepare('UPDATE users SET full_name = ?, password_hash = ?, grade_level = ?, avatar_id = ? WHERE id = ?');
    const insertStmt = db.prepare('INSERT INTO users (username, password_hash, full_name, role, grade_level, avatar_id) VALUES (?, ?, ?, ?, ?, ?)');
    const insertStatsStmt = db.prepare('INSERT OR IGNORE INTO user_stats (user_id, total_stars, current_streak, best_streak) VALUES (?, 0, 1, 1)');

    for (const s of students) {
        const existing = checkStmt.get(s.username);
        if (existing) {
            updateStmt.run(s.full_name, s.password_hash, s.grade_level || 'Grade 3', s.avatar_id || 'avatar_boy1', existing.id);
        } else {
            const res = insertStmt.run(
                s.username,
                s.password_hash,
                s.full_name,
                'student',
                s.grade_level || 'Grade 3',
                s.avatar_id || 'avatar_boy1'
            );
            insertStatsStmt.run(res.lastInsertRowid);
        }
    }

    console.log('[CloudSync] Database successfully restored and in sync with cloud storage.');
}

// Save current student list & credentials to cloud
async function saveToCloud(db) {
    try {
        const students = db.prepare(`
            SELECT id, username, password_hash, full_name, role, grade_level, avatar_id
            FROM users
            WHERE role = 'student'
            ORDER BY id ASC
        `).all();

        const payload = {
            version: 1,
            last_synced: new Date().toISOString(),
            total_learners: students.length,
            students
        };

        const cloud = await getCloudData();
        const sha = cloud ? cloud.sha : null;
        const ok = await putCloudData(payload, sha);
        if (ok) {
            console.log(`[CloudSync] Successfully backed up ${students.length} learners to cloud storage.`);
        }
        return ok;
    } catch (err) {
        console.warn(`[CloudSync] saveToCloud error: ${err.message}`);
        return false;
    }
}

// Asynchronous trigger after any roster change (does not block HTTP response)
function triggerCloudSave(db) {
    setImmediate(async () => {
        try {
            await saveToCloud(db);
        } catch (e) {
            console.warn('[CloudSync] Background save error:', e.message);
        }
    });
}

module.exports = {
    restoreFromCloud,
    saveToCloud,
    triggerCloudSave
};
