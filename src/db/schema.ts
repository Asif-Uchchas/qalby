import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
    json,
    uuid,
    date,
    pgEnum,
} from 'drizzle-orm/pg-core';

// ============================================
// ENUMS
// ============================================

export const prayerNameEnum = pgEnum('prayer_name', [
    'fajr',
    'dhuhr',
    'asr',
    'maghrib',
    'isha',
]);

export const prayerStatusEnum = pgEnum('prayer_status', [
    'ontime',
    'late',
    'missed',
    'pending',
]);

export const moodEnum = pgEnum('mood', [
    'energized',
    'peaceful',
    'struggling',
]);

export const taskCategoryEnum = pgEnum('task_category', [
    'worship',
    'quran',
    'rest',
    'work',
    'family',
]);

// ============================================
// TABLES
// ============================================

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name'),
    email: text('email').notNull().unique(),
    image: text('image'),
    location: text('location'),
    timezone: text('timezone').default('Asia/Dhaka'),
    locale: text('locale').default('en'),
    onboarded: boolean('onboarded').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dailyLogs = pgTable('daily_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    date: date('date').notNull(),
    mood: moodEnum('mood'),
    energy: integer('energy'), // 1-5 scale
    niyyah: text('niyyah'),
    fastingCompleted: boolean('fasting_completed').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const prayerEntries = pgTable('prayer_entries', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    date: date('date').notNull(),
    prayer: prayerNameEnum('prayer').notNull(),
    status: prayerStatusEnum('status').default('pending').notNull(),
    isTarawih: boolean('is_tarawih').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const quranProgress = pgTable('quran_progress', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    date: date('date').notNull(),
    juzCompleted: json('juz_completed').$type<number[]>().default([]),
    pagesRead: integer('pages_read').default(0),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const goals = pgTable('goals', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    title: text('title').notNull(),
    category: text('category'),
    targetCount: integer('target_count').default(30),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const goalEntries = pgTable('goal_entries', {
    id: uuid('id').defaultRandom().primaryKey(),
    goalId: uuid('goal_id')
        .references(() => goals.id, { onDelete: 'cascade' })
        .notNull(),
    date: date('date').notNull(),
    completed: boolean('completed').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const duasFavorites = pgTable('duas_favorites', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    duaId: text('dua_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dhikrSessions = pgTable('dhikr_sessions', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    date: date('date').notNull(),
    type: text('type').notNull(), // subhanallah, alhamdulillah, allahuakbar, etc.
    count: integer('count').default(0),
    target: integer('target').default(33),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reflections = pgTable('reflections', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    date: date('date').notNull(),
    content: text('content').notNull(),
    isWeekly: boolean('is_weekly').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const plannerTasks = pgTable('planner_tasks', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    date: date('date').notNull(),
    title: text('title').notNull(),
    category: taskCategoryEnum('category').default('worship'),
    timeSlot: text('time_slot'),
    completed: boolean('completed').default(false),
    order: integer('order').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
