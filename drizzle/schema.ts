import { pgTable, foreignKey, uuid, date, integer, text, boolean, timestamp, unique, json, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const mood = pgEnum("mood", ['energized', 'peaceful', 'struggling'])
export const prayerName = pgEnum("prayer_name", ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'])
export const prayerStatus = pgEnum("prayer_status", ['ontime', 'late', 'missed', 'pending'])
export const taskCategory = pgEnum("task_category", ['worship', 'quran', 'rest', 'work', 'family'])


export const dailyLogs = pgTable("daily_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	date: date().notNull(),
	mood: mood(),
	energy: integer(),
	niyyah: text(),
	fastingCompleted: boolean("fasting_completed").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "daily_logs_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const goals = pgTable("goals", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	title: text().notNull(),
	category: text(),
	targetCount: integer("target_count").default(30),
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "goals_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const plannerTasks = pgTable("planner_tasks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	date: date().notNull(),
	title: text().notNull(),
	category: taskCategory().default('worship'),
	timeSlot: text("time_slot"),
	completed: boolean().default(false),
	order: integer().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "planner_tasks_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const prayerEntries = pgTable("prayer_entries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	date: date().notNull(),
	prayer: prayerName().notNull(),
	status: prayerStatus().default('pending').notNull(),
	isTarawih: boolean("is_tarawih").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "prayer_entries_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const reflections = pgTable("reflections", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	date: date().notNull(),
	content: text().notNull(),
	isWeekly: boolean("is_weekly").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "reflections_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const dhikrSessions = pgTable("dhikr_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	date: date().notNull(),
	type: text().notNull(),
	count: integer().default(0),
	target: integer().default(33),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "dhikr_sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	image: text(),
	location: text(),
	timezone: text().default('Asia/Dhaka'),
	locale: text().default('en'),
	onboarded: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const duasFavorites = pgTable("duas_favorites", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	duaId: text("dua_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "duas_favorites_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const quranProgress = pgTable("quran_progress", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	date: date().notNull(),
	juzCompleted: json("juz_completed").default([]),
	pagesRead: integer("pages_read").default(0),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "quran_progress_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const goalEntries = pgTable("goal_entries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	goalId: uuid("goal_id").notNull(),
	date: date().notNull(),
	completed: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.goalId],
			foreignColumns: [goals.id],
			name: "goal_entries_goal_id_goals_id_fk"
		}).onDelete("cascade"),
]);
