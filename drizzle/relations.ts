import { relations } from "drizzle-orm/relations";
import { users, dailyLogs, goals, plannerTasks, prayerEntries, reflections, dhikrSessions, duasFavorites, quranProgress, goalEntries } from "./schema";

export const dailyLogsRelations = relations(dailyLogs, ({one}) => ({
	user: one(users, {
		fields: [dailyLogs.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	dailyLogs: many(dailyLogs),
	goals: many(goals),
	plannerTasks: many(plannerTasks),
	prayerEntries: many(prayerEntries),
	reflections: many(reflections),
	dhikrSessions: many(dhikrSessions),
	duasFavorites: many(duasFavorites),
	quranProgresses: many(quranProgress),
}));

export const goalsRelations = relations(goals, ({one, many}) => ({
	user: one(users, {
		fields: [goals.userId],
		references: [users.id]
	}),
	goalEntries: many(goalEntries),
}));

export const plannerTasksRelations = relations(plannerTasks, ({one}) => ({
	user: one(users, {
		fields: [plannerTasks.userId],
		references: [users.id]
	}),
}));

export const prayerEntriesRelations = relations(prayerEntries, ({one}) => ({
	user: one(users, {
		fields: [prayerEntries.userId],
		references: [users.id]
	}),
}));

export const reflectionsRelations = relations(reflections, ({one}) => ({
	user: one(users, {
		fields: [reflections.userId],
		references: [users.id]
	}),
}));

export const dhikrSessionsRelations = relations(dhikrSessions, ({one}) => ({
	user: one(users, {
		fields: [dhikrSessions.userId],
		references: [users.id]
	}),
}));

export const duasFavoritesRelations = relations(duasFavorites, ({one}) => ({
	user: one(users, {
		fields: [duasFavorites.userId],
		references: [users.id]
	}),
}));

export const quranProgressRelations = relations(quranProgress, ({one}) => ({
	user: one(users, {
		fields: [quranProgress.userId],
		references: [users.id]
	}),
}));

export const goalEntriesRelations = relations(goalEntries, ({one}) => ({
	goal: one(goals, {
		fields: [goalEntries.goalId],
		references: [goals.id]
	}),
}));