/**
 * SQLite Database Layer for Learning Guide Schools
 * Uses better-sqlite3 — a synchronous, file-based database (no server needed)
 */
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL'); // Better concurrency
db.pragma('foreign_keys = ON');

// ============================================================
// Schema creation
// ============================================================
const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'parent',
  address TEXT,
  profilePhoto TEXT,
  isActive INTEGER DEFAULT 1,
  lastLogin TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  dateOfBirth TEXT NOT NULL,
  gender TEXT NOT NULL,
  gradeLevel TEXT NOT NULL,
  classId TEXT,
  parentId TEXT,
  enrollmentDate TEXT DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active',
  profilePhoto TEXT,
  address TEXT,
  emergencyContactName TEXT,
  emergencyContactPhone TEXT,
  emergencyContactRelationship TEXT,
  medicalInfo TEXT,
  previousSchool TEXT,
  admissionNumber TEXT UNIQUE,
  currentGPA REAL DEFAULT 0,
  totalCredits REAL DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parentId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_children (
  userId TEXT,
  studentId TEXT,
  relationship TEXT DEFAULT 'parent',
  PRIMARY KEY (userId, studentId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT,
  authorId TEXT,
  category TEXT DEFAULT 'news',
  image TEXT,
  images TEXT DEFAULT '[]',
  tags TEXT DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  publishedAt TEXT,
  views INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  endDate TEXT,
  startTime TEXT,
  endTime TEXT,
  location TEXT,
  category TEXT DEFAULT 'general',
  image TEXT,
  isRecurring INTEGER DEFAULT 0,
  recurrenceRule TEXT,
  status TEXT DEFAULT 'upcoming',
  organizer TEXT,
  contactInfo TEXT,
  capacity INTEGER,
  registeredCount INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academic_calendar (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT,
  description TEXT,
  type TEXT NOT NULL,
  color TEXT DEFAULT '#0ea5e9',
  isAllDay INTEGER DEFAULT 1,
  gradeLevel TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admissions (
  id TEXT PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  dateOfBirth TEXT NOT NULL,
  gender TEXT NOT NULL,
  gradeApplyingFor TEXT NOT NULL,
  parentName TEXT NOT NULL,
  parentEmail TEXT NOT NULL,
  parentPhone TEXT NOT NULL,
  relationship TEXT DEFAULT 'parent',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  zipCode TEXT,
  country TEXT DEFAULT 'Saudi Arabia',
  previousSchool TEXT,
  previousGrade TEXT,
  documents TEXT DEFAULT '{}',
  source TEXT DEFAULT 'website',
  referralName TEXT,
  additionalInfo TEXT,
  status TEXT DEFAULT 'pending',
  rejectionReason TEXT,
  interviewDate TEXT,
  interviewNotes TEXT,
  admissionDate TEXT,
  enrollmentNumber TEXT,
  registrationFeePaid INTEGER DEFAULT 0,
  registrationFeeTransactionId TEXT,
  registrationFeePaidAt TEXT,
  totalTuitionPaid REAL DEFAULT 0,
  admissionNumber TEXT UNIQUE,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admission_notes (
  id TEXT PRIMARY KEY,
  admissionId TEXT,
  note TEXT,
  by TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admissionId) REFERENCES admissions(id) ON DELETE CASCADE,
  FOREIGN KEY (by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  userId TEXT,
  studentId TEXT,
  admissionId TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'SAR',
  type TEXT NOT NULL,
  description TEXT,
  invoiceNumber TEXT UNIQUE,
  stripePaymentIntentId TEXT,
  stripeCustomerId TEXT,
  status TEXT DEFAULT 'pending',
  paidAt TEXT,
  dueDate TEXT,
  receiptSent INTEGER DEFAULT 0,
  notes TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  studentId TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT,
  notes TEXT,
  recordedBy TEXT,
  checkInTime TEXT,
  checkOutTime TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(studentId, date),
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grades (
  id TEXT PRIMARY KEY,
  studentId TEXT NOT NULL,
  subject TEXT NOT NULL,
  assignmentName TEXT NOT NULL,
  score REAL NOT NULL,
  maxScore REAL NOT NULL,
  weight REAL DEFAULT 1,
  type TEXT DEFAULT 'homework',
  term TEXT NOT NULL,
  academicYear TEXT NOT NULL,
  recordedBy TEXT,
  dueDate TEXT,
  submittedDate TEXT,
  feedback TEXT,
  isLate INTEGER DEFAULT 0,
  parentNotified INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  senderId TEXT NOT NULL,
  receiverId TEXT NOT NULL,
  studentId TEXT,
  subject TEXT,
  content TEXT NOT NULL,
  isRead INTEGER DEFAULT 0,
  isReply INTEGER DEFAULT 0,
  conversationId TEXT,
  attachments TEXT DEFAULT '[]',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  repliedAt TEXT,
  replyContent TEXT,
  category TEXT DEFAULT 'general',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
`;

// Run schema
db.exec(SCHEMA);

// ============================================================
// Helper functions for JSON fields
// ============================================================
function rowToUser(row) {
  if (!row) return null;
  const children = db.prepare('SELECT studentId, relationship FROM user_children WHERE userId = ?').all(row.id);
  return {
    ...row,
    isActive: !!row.isActive,
    children: children.map(c => ({ studentId: c.studentId, relationship: c.relationship })),
  };
}

function parseJson(field, fallback = []) {
  try {
    return field ? JSON.parse(field) : fallback;
  } catch {
    return fallback;
  }
}

module.exports = {
  db,
  rowToUser,
  parseJson,
  // Helper to generate ID
  newId: () => require('uuid').v4(),
};
