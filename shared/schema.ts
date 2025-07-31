import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table for potential future authentication
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Contact messages table to store inquiries
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Portfolio views tracking
export const portfolioViews = pgTable('portfolio_views', {
  id: serial('id').primaryKey(),
  viewerIp: varchar('viewer_ip', { length: 45 }),
  userAgent: text('user_agent'),
  section: varchar('section', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Project interactions tracking
export const projectInteractions = pgTable('project_interactions', {
  id: serial('id').primaryKey(),
  projectName: varchar('project_name', { length: 100 }).notNull(),
  interactionType: varchar('interaction_type', { length: 50 }).notNull(), // 'view', 'click', 'demo'
  viewerIp: varchar('viewer_ip', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Skills ratings from visitors
export const skillRatings = pgTable('skill_ratings', {
  id: serial('id').primaryKey(),
  skillName: varchar('skill_name', { length: 100 }).notNull(),
  rating: integer('rating').notNull(), // 1-5 scale
  voterIp: varchar('voter_ip', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;
export type PortfolioView = typeof portfolioViews.$inferSelect;
export type InsertPortfolioView = typeof portfolioViews.$inferInsert;
export type ProjectInteraction = typeof projectInteractions.$inferSelect;
export type InsertProjectInteraction = typeof projectInteractions.$inferInsert;
export type SkillRating = typeof skillRatings.$inferSelect;
export type InsertSkillRating = typeof skillRatings.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  contacts: many(contacts),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  user: one(users, {
    fields: [contacts.email],
    references: [users.email],
  }),
}));