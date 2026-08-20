/**
 * Seed database with initial demo data for Learning Guide Schools
 * Runs automatically on server start if the database is empty.
 */
const bcrypt = require('bcryptjs');
const userRepo = require('../db/userRepo');
const studentRepo = require('../db/studentRepo');
const newsRepo = require('../db/newsRepo');
const eventRepo = require('../db/eventRepo');
const calendarRepo = require('../db/calendarRepo');
const { db } = require('../db');

function seedDatabase() {
  // Check if already seeded
  const count = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'admin'").get().c;
  if (count > 0) {
    console.log('✓ Database already seeded, skipping.');
    return;
  }

  console.log('→ Seeding database with demo data...');

  // Admin
  const admin = userRepo.create({
    email: 'admin@learningguide.school',
    password: bcrypt.hashSync('admin123', 12),
    name: 'School Administrator',
    role: 'admin',
    phone: '+966 11 234 5678',
  });

  // Parent
  const parent = userRepo.create({
    email: 'parent@learningguide.school',
    password: bcrypt.hashSync('parent123', 12),
    name: 'Ahmed Al-Rashidi',
    role: 'parent',
    phone: '+966 50 123 4567',
    address: 'Riyadh, Saudi Arabia',
  });

  // Teacher
  userRepo.create({
    email: 'teacher@learningguide.school',
    password: bcrypt.hashSync('teacher123', 12),
    name: 'Sarah Johnson',
    role: 'teacher',
    phone: '+966 55 987 6543',
    address: 'Riyadh, Saudi Arabia',
  });

  // Students
  const s1 = studentRepo.create({
    firstName: 'Omar', lastName: 'Al-Rashidi', dateOfBirth: '2012-03-15', gender: 'male',
    gradeLevel: 'Grade 6', parentId: parent.id, admissionNumber: 'AD2024-0001',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', status: 'active',
  });
  const s2 = studentRepo.create({
    firstName: 'Layla', lastName: 'Al-Rashidi', dateOfBirth: '2014-07-22', gender: 'female',
    gradeLevel: 'Grade 4', parentId: parent.id, admissionNumber: 'AD2024-0002',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', status: 'active',
  });

  // Link children
  db.prepare('INSERT OR IGNORE INTO user_children (userId, studentId, relationship) VALUES (?, ?, ?)').run(parent.id, s1.id, 'father');
  db.prepare('INSERT OR IGNORE INTO user_children (userId, studentId, relationship) VALUES (?, ?, ?)').run(parent.id, s2.id, 'father');

  // Sample grades for Omar (Grade 6)
  const { newId } = require('../db');
  const gradeIns = db.prepare('INSERT INTO grades (id, studentId, assignmentName, subject, score, maxScore, weight, type, term, academicYear, recordedBy, dueDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const sampleGrades = [
    [s1.id, 'Math Quiz 1', 'Mathematics', 18, 20, 'quiz', 'fall', '2025'],
    [s1.id, 'Science Project', 'Science', 45, 50, 'project', 'fall', '2025'],
    [s1.id, 'English Essay', 'English', 27, 30, 'homework', 'fall', '2025'],
    [s1.id, 'Arabic Test', 'Arabic', 38, 40, 'test', 'fall', '2025'],
    [s2.id, 'Math Quiz 1', 'Mathematics', 19, 20, 'quiz', 'fall', '2025'],
    [s2.id, 'Reading Assignment', 'English', 28, 30, 'homework', 'fall', '2025'],
  ];
  sampleGrades.forEach(([sid, name, subj, sc, mx, type, term, yr]) => {
    gradeIns.run(newId(), sid, name, subj, sc, mx, 1, type, term, yr, admin.id, new Date().toISOString());
  });

  // Sample attendance
  const attIns = db.prepare('INSERT OR IGNORE INTO attendance (id, studentId, date, status, recordedBy) VALUES (?, ?, ?, ?, ?)');
  for (let i = 1; i <= 20; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const status = i % 9 === 0 ? 'absent' : i % 7 === 0 ? 'late' : 'present';
    attIns.run(newId(), s1.id, d.toISOString().split('T')[0], status, admin.id);
    attIns.run(newId(), s2.id, d.toISOString().split('T')[0], i % 10 === 0 ? 'absent' : 'present', admin.id);
  }

  // News
  const news = [
    { title: 'Annual Science Fair 2025: Celebrating Innovation', excerpt: 'Our students showcased incredible projects at this year\'s science fair.', content: 'The Annual Science Fair 2025 was a spectacular success, bringing together over 200 students from grades 4-12 to showcase their scientific innovations. The event featured 50+ projects spanning physics, chemistry, biology, and environmental science.', author: 'Administration', category: 'event', image: 'https://images.unsplash.com/photo-1461774894645-34c36943c107?w=800', tags: ['science', 'fair', 'innovation'] },
    { title: 'New Smart Classroom Initiative Launched', excerpt: 'Interactive learning technology coming to every classroom.', content: 'Learning Guide Schools is proud to announce the launch of our Smart Classroom Initiative, equipping all classrooms with interactive whiteboards, tablets, and high-speed internet.', author: 'Principal Office', category: 'announcement', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aae7c2?w=800', tags: ['technology', 'education'] },
    { title: 'Swimming Team Wins Regional Championship', excerpt: 'Our swimming team brought home 12 medals from the regional championship.', content: 'We are thrilled to announce that our swimming team has won the Regional Schools Swimming Championship, securing 12 medals including 3 gold.', author: 'Sports Department', category: 'achievement', image: 'https://images.unsplash.com/photo-1552820727-4bd43b492854?w=800', tags: ['sports', 'swimming'] },
    { title: 'Admissions Now Open for Academic Year 2025-2026', excerpt: 'Applications are now being accepted for the upcoming academic year.', content: 'Learning Guide Schools is now accepting applications for the Academic Year 2025-2026. Spaces are limited and fill up quickly.', author: 'Admissions Office', category: 'announcement', image: 'https://images.unsplash.com/photo-1595252556202-f97233daeb67?w=800', tags: ['admissions', 'enrollment'] },
    { title: 'Kindergarten Autumn Celebration', excerpt: 'Our youngest learners enjoyed a fun-filled autumn day.', content: 'Our Kindergarten students celebrated the Autumn season with a delightful day of activities, crafts, and songs.', author: 'Kindergarten Faculty', category: 'event', image: 'https://images.unsplash.com/photo-1503454537194-598f118e6198?w=800', tags: ['kindergarten', 'autumn'] },
  ];
  news.forEach(n => newsRepo.create({ ...n, status: 'published' }));

  // Events
  const y = new Date().getFullYear();
  const evIns = db.prepare('INSERT INTO events (id, title, description, date, startTime, endTime, location, category, status, organizer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  evIns.run(newId(), 'Parent-Teacher Conference 2025', 'Annual parent-teacher conferences.', `${y}-02-15`, '09:00', '15:00', 'School Auditorium', 'academic', 'upcoming', 'Administration');
  evIns.run(newId(), 'Spring Cultural Festival', 'A celebration of diverse cultures.', `${y}-03-20`, '16:00', '20:00', 'School Grounds', 'cultural', 'upcoming', 'Arts Department');
  evIns.run(newId(), 'Mid-Term Exams Begin', 'Mid-term examinations for all grade levels.', `${y}-02-25`, '08:00', '14:00', 'Classrooms', 'academic', 'upcoming', 'Academic Office');

  // Calendar
  const calIns = db.prepare('INSERT INTO academic_calendar (id, title, startDate, endDate, description, type, color, gradeLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  calIns.run(newId(), 'First Term Begins', `${y}-08-01`, `${y}-08-01`, 'First semester starts.', 'term', '#0ea5e9', 'all');
  calIns.run(newId(), 'Mid-Term Break', `${y}-11-15`, `${y}-11-21`, 'One-week mid-term break.', 'break', '#f59e0b', 'all');
  calIns.run(newId(), 'Second Term Begins', `${y}-11-22`, `${y}-11-22`, 'Second semester starts.', 'term', '#0ea5e9', 'all');
  calIns.run(newId(), 'Final Exams', `${y}-05-15`, `${y}-05-30`, 'End of year examinations.', 'exam', '#ef4444', 'all');
  calIns.run(newId(), 'Graduation Ceremony', `${y}-06-15`, `${y}-06-15`, 'High school graduation.', 'event', '#f59e0b', 'Grade 12');

  console.log('\n✓ Database seeding completed!');
  console.log('  Admin:    admin@learningguide.school / admin123');
  console.log('  Parent:   parent@learningguide.school / parent123');
  console.log('  Teacher:  teacher@learningguide.school / teacher123');
  console.log('');
}

module.exports = { seedDatabase };
