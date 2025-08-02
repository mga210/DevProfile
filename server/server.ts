import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { storage } from './storage';
import type { InsertContact, InsertPortfolioView, InsertProjectInteraction, InsertSkillRating } from '../shared/schema';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Helper function to get client IP
function getClientIP(req: express.Request): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         '127.0.0.1';
}

// API Routes

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    const contact: InsertContact = {
      name,
      email,
      subject,
      message
    };

    const newContact = await storage.createContact(contact);
    
    res.json({ 
      success: true, 
      message: 'Thank you for your message! I\'ll get back to you soon.',
      contactId: newContact.id 
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again.' 
    });
  }
});

// Analytics are now handled by Counter.dev - no backend needed

// Get all contacts (for admin use)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await storage.getContacts();
    res.json({ success: true, contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contacts' });
  }
});

// Track portfolio view
app.post('/api/track/view', async (req, res) => {
  try {
    const { section } = req.body;
    
    const view: InsertPortfolioView = {
      viewerIp: getClientIP(req),
      userAgent: req.headers['user-agent'] || '',
      section: section || 'home'
    };

    await storage.trackPortfolioView(view);
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ success: false, error: 'Failed to track view' });
  }
});

// Track project interaction
app.post('/api/track/project', async (req, res) => {
  try {
    const { projectName, interactionType } = req.body;
    
    if (!projectName || !interactionType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Project name and interaction type are required' 
      });
    }

    const interaction: InsertProjectInteraction = {
      projectName,
      interactionType,
      viewerIp: getClientIP(req)
    };

    await storage.trackProjectInteraction(interaction);
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking project interaction:', error);
    res.status(500).json({ success: false, error: 'Failed to track interaction' });
  }
});

// Get portfolio statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await storage.getPortfolioStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// Rate a skill
app.post('/api/skills/rate', async (req, res) => {
  try {
    const { skillName, rating } = req.body;
    
    if (!skillName || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid skill name and rating (1-5) are required' 
      });
    }

    const skillRating: InsertSkillRating = {
      skillName,
      rating: parseInt(rating),
      voterIp: getClientIP(req)
    };

    await storage.rateSkill(skillRating);
    const updatedRating = await storage.getSkillRatings(skillName);
    
    res.json({ 
      success: true, 
      message: 'Thank you for rating!',
      skillRating: updatedRating
    });
  } catch (error) {
    console.error('Error rating skill:', error);
    res.status(500).json({ success: false, error: 'Failed to submit rating' });
  }
});

// Get skill ratings
app.get('/api/skills/ratings/:skillName', async (req, res) => {
  try {
    const { skillName } = req.params;
    
    const rating = await storage.getSkillRatings(skillName);
    res.json({ success: true, rating });
  } catch (error) {
    console.error('Error fetching skill ratings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ratings' });
  }
});

// Get all skill ratings
app.get('/api/skills/ratings', async (req, res) => {
  try {
    const allRatings = await storage.getAllSkillRatings();
    res.json({ success: true, ratings: allRatings });
  } catch (error) {
    console.error('Error fetching all skill ratings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ratings' });
  }
});

// Chatbot API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Enhanced system prompt with comprehensive knowledge base
    const systemPrompt = {
      role: "system",
      content: `You are Miguel A. Gonzalez Almonte's intelligent professional assistant. You have deep knowledge of his technical journey, personality, and authentic story. Respond conversationally, maintaining context across our discussion.

## CORE IDENTITY & PERSONALITY
Miguel is a self-driven problem-solver with an operations mindset who transitioned into AI systems development. He's genuine, practical, and focused on real-world impact. He speaks confidently about his work but remains humble about his journey.

## DETAILED BACKGROUND & JOURNEY
**Origins**: Started at Universal Studios in operations, learned systems thinking through hands-on experience
**Transition**: Moved through service management roles (MAA Properties, RPM Living) where he identified operational inefficiencies
**Self-Development**: Never held formal software titles but built production tools that solved real problems
**Current Focus**: AI Systems Developer specializing in Python coordination engines and intelligent automation

## TECHNICAL EXPERTISE (BE SPECIFIC)
**Programming**: Python (PySide6, Tkinter, Pandas, FastAPI), SQLite, Supabase integration
**AI/LLM Stack**: GPT-4, LangChain, prompt engineering, custom AI agent development  
**Architecture**: Clean separation of UI/logic, DTO patterns, modular design, lifecycle management
**Tools**: Replit for rapid deployment, no-code/low-code workflows, AI-assisted development
**Specialties**: Coordination engines, process automation, dashboard creation, workflow optimization

## KEY PROJECTS (GIVE DETAILS WHEN ASKED)
**DMRB (Make Ready Digital Board)**: Full-scale Python coordination engine for apartment unit turnovers
- Deployed across multiple properties, replaced spreadsheet chaos
- Features: Lifecycle logic, real-time coordination, enforcement mechanisms
- Impact: Reduced delays, improved team coordination, eliminated manual tracking

**System Pilot**: GPT-powered software architecture strategist
- Helps design system architecture using AI-driven analysis
- Focuses on clean architecture and modular design principles

**Blueprint Buddy**: Prompt engineering optimization tool
- Refines and optimizes prompts for better AI interactions
- Used for developing effective system prompts

**Python Training Board**: Interactive GUI learning platform  
- Built with PySide6 for hands-on Python education
- Features modular lessons and practical exercises

## CURRENT SITUATION
**Education**: BBA Computer Information Systems at Ana G. Méndez University
**Location**: Plano, TX
**Contact**: mgonzalez869@gmail.com
**Certifications**: Google Project Management, Python for Everybody, EPA Section 608
**Professional Goal**: Building AI-driven operational intelligence systems

## CONVERSATION GUIDELINES
- Remember what we've discussed in this conversation
- Ask follow-up questions to understand what the user really wants to know
- Share specific technical details when relevant
- Connect different aspects of Miguel's work naturally
- Maintain Miguel's authentic voice: practical, confident, solution-focused
- If asked about something Miguel hasn't done, be honest but redirect to relevant experience

## RESPONSE STYLE
- Be conversational and engaging, not robotic
- Use Miguel's first-person perspective when appropriate ("Miguel built this because...")
- Provide concrete examples and specific details
- Show enthusiasm for problem-solving and technical challenges
- Acknowledge the journey from operations to development as a strength, not a limitation`
    };

    // Build messages with better context management
    const messages = [
      systemPrompt,
      ...conversationHistory.slice(-8), // Keep more context for better conversations
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user  
      messages: messages,
      max_tokens: 500, // Increased for more detailed responses
      temperature: 0.8, // Slightly higher for more natural conversation
      presence_penalty: 0.1, // Encourage variety in responses
      frequency_penalty: 0.1 // Reduce repetition
    });

    const response = completion.choices[0].message.content;
    
    res.json({ 
      success: true, 
      response: response
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process chat message'
    });
  }
});

// Serve the main HTML file for all non-API routes (SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  console.log('Database connected successfully');
});

export default app;