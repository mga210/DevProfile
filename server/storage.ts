import { 
  contacts, 
  portfolioViews, 
  projectInteractions, 
  skillRatings,
  type Contact, 
  type InsertContact,
  type PortfolioView,
  type InsertPortfolioView,
  type ProjectInteraction,
  type InsertProjectInteraction,
  type SkillRating,
  type InsertSkillRating
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, count, avg } from "drizzle-orm";

export interface IStorage {
  // Contact management
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  getContactById(id: number): Promise<Contact | undefined>;
  
  // Analytics tracking
  trackPortfolioView(view: InsertPortfolioView): Promise<PortfolioView>;
  trackProjectInteraction(interaction: InsertProjectInteraction): Promise<ProjectInteraction>;
  getPortfolioStats(): Promise<{
    totalViews: number;
    uniqueVisitors: number;
    topSections: Array<{ section: string; views: number }>;
  }>;
  
  // Skills rating system
  rateSkill(rating: InsertSkillRating): Promise<SkillRating>;
  getSkillRatings(skillName: string): Promise<{ averageRating: number; totalRatings: number }>;
  getAllSkillRatings(): Promise<Array<{ skillName: string; averageRating: number; totalRatings: number }>>;
}

export class DatabaseStorage implements IStorage {
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
  }

  async getContactById(id: number): Promise<Contact | undefined> {
    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id));
    return contact || undefined;
  }

  async trackPortfolioView(insertView: InsertPortfolioView): Promise<PortfolioView> {
    const [view] = await db
      .insert(portfolioViews)
      .values(insertView)
      .returning();
    return view;
  }

  async trackProjectInteraction(insertInteraction: InsertProjectInteraction): Promise<ProjectInteraction> {
    const [interaction] = await db
      .insert(projectInteractions)
      .values(insertInteraction)
      .returning();
    return interaction;
  }

  async getPortfolioStats(): Promise<{
    totalViews: number;
    uniqueVisitors: number;
    topSections: Array<{ section: string; views: number }>;
  }> {
    // Total views
    const [totalViewsResult] = await db
      .select({ count: count() })
      .from(portfolioViews);

    // Unique visitors (by IP)
    const uniqueVisitorsResult = await db
      .selectDistinct({ ip: portfolioViews.viewerIp })
      .from(portfolioViews);

    // Top sections
    const topSectionsResult = await db
      .select({
        section: portfolioViews.section,
        views: count()
      })
      .from(portfolioViews)
      .groupBy(portfolioViews.section)
      .orderBy(desc(count()))
      .limit(5);

    return {
      totalViews: totalViewsResult.count,
      uniqueVisitors: uniqueVisitorsResult.length,
      topSections: topSectionsResult.map(row => ({
        section: row.section || 'unknown',
        views: row.views
      }))
    };
  }

  async rateSkill(insertRating: InsertSkillRating): Promise<SkillRating> {
    const [rating] = await db
      .insert(skillRatings)
      .values(insertRating)
      .returning();
    return rating;
  }

  async getSkillRatings(skillName: string): Promise<{ averageRating: number; totalRatings: number }> {
    const [result] = await db
      .select({
        averageRating: avg(skillRatings.rating),
        totalRatings: count()
      })
      .from(skillRatings)
      .where(eq(skillRatings.skillName, skillName));

    return {
      averageRating: Number(result.averageRating || 0),
      totalRatings: result.totalRatings
    };
  }

  async getAllSkillRatings(): Promise<Array<{ skillName: string; averageRating: number; totalRatings: number }>> {
    const results = await db
      .select({
        skillName: skillRatings.skillName,
        averageRating: avg(skillRatings.rating),
        totalRatings: count()
      })
      .from(skillRatings)
      .groupBy(skillRatings.skillName)
      .orderBy(desc(avg(skillRatings.rating)));

    return results.map(row => ({
      skillName: row.skillName,
      averageRating: Number(row.averageRating || 0),
      totalRatings: row.totalRatings
    }));
  }
}

export const storage = new DatabaseStorage();