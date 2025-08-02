import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { storage } from './storage';
import type { InsertContact, InsertPortfolioView, InsertProjectInteraction, InsertSkillRating } from '../shared/schema';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

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

// Serve the main HTML file for all non-API routes (SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  console.log('Database connected successfully');
});

export default app;