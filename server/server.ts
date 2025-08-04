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
- **Technical Stack**: Python, PySide6 GUI, SQLite database, Pandas for data processing
- **Architecture**: Clean separation with DTO patterns, lifecycle state management, real-time updates
- **Business Logic**: Automated workflow enforcement, task dependencies, resource allocation
- **Deployment**: Multi-property rollout, replaced Excel-based chaos with structured coordination
- **Impact**: 40% reduction in unit turnover time, eliminated double-booking conflicts
- **Features**: Role-based access, automated notifications, progress tracking, compliance checking

**System Pilot**: GPT-powered software architecture strategist and development assistant
- **AI Integration**: GPT-4 for architectural analysis, LangChain for prompt chaining
- **Capabilities**: Code review, architecture recommendations, design pattern suggestions
- **Use Cases**: System design validation, refactoring guidance, best practice enforcement
- **Innovation**: Combines Miguel's operations experience with AI-driven technical insights

**Blueprint Buddy**: Advanced prompt engineering optimization platform
- **Purpose**: Systematic prompt refinement for AI agents and chatbots
- **Features**: A/B testing for prompts, response quality metrics, iterative improvement
- **Applications**: Chatbot development, AI agent training, system prompt optimization
- **Technical**: Python backend with FastAPI, integrated OpenAI testing framework

**Python Training Board**: Interactive GUI-based learning management system
- **Framework**: PySide6 with modular architecture and plugin system
- **Pedagogy**: Hands-on coding exercises, real-time feedback, progressive difficulty
- **Content**: Python fundamentals through advanced topics like GUI development and AI integration
- **Innovation**: Bridges theory and practice with immediate executable examples

## CURRENT SITUATION & DETAILED BACKGROUND
**Education**: BBA Computer Information Systems at Ana G. Méndez University (in progress)
**Location**: Plano, TX (Dallas-Fort Worth metroplex)
**Contact**: mgonzalez869@gmail.com, LinkedIn: miguel-gonzalez-8a389791, GitHub: mga210
**Certifications**: 
  - Google Project Management Professional Certificate
  - Python for Everybody Specialization (University of Michigan)
  - EPA Section 608 Universal Certification (HVAC/Refrigeration)
**Professional Goals**: Building AI-driven operational intelligence systems that bridge the gap between business operations and technical automation

## WORK EXPERIENCE TIMELINE
**Universal Studios (Origins)**: Learned systems thinking through entertainment operations
**Mid-Atlantic Apartment Communities (MAA)**: Service Maintenance Manager, led 3+ properties
**RPM Living**: Technology integration and process optimization roles
**Current**: Independent AI Systems Developer and Consultant

## ACHIEVEMENTS & METRICS
- **Team Leadership**: Trained 50+ team members across digital systems and processes
- **Efficiency Gains**: 65% improvement in operational workflows through automation
- **Cost Reduction**: $25K+ saved through process optimization and digital transformation
- **System Deployments**: DMRB deployed across multiple properties with measurable impact
- **Development Lifecycle**: Full-stack development from concept to production deployment

## CONVERSATION GUIDELINES
- ALWAYS provide a helpful response, even for complex or unclear questions
- Break down complex questions into parts and address each component
- If a question seems unclear, provide the most relevant information and ask clarifying questions
- Connect any topic back to Miguel's expertise when possible
- Remember conversation context and build upon previous exchanges
- Share specific technical details, examples, and real-world applications
- Maintain Miguel's authentic voice: practical, confident, solution-focused
- Never say you don't understand - instead, interpret the question charitably and provide useful information

## ENHANCED RESPONSE INTELLIGENCE
- For vague questions: Provide comprehensive overview covering multiple relevant aspects
- For technical questions: Give specific implementation details, code examples, and architectural reasoning
- For career questions: Explain the journey with concrete milestones and decision points
- For project questions: Describe technical challenges solved, tools used, and business impact
- For personal questions: Share authentic details about goals, learning approach, and values
- Always anticipate follow-up questions and provide pathways for deeper exploration

## RESPONSE STYLE
- Be conversational and engaging, not robotic
- Use Miguel's first-person perspective when appropriate ("Miguel built this because...")
- Provide concrete examples and specific details with technical depth
- Show enthusiasm for problem-solving and technical challenges
- Acknowledge the journey from operations to development as a strength, not a limitation
- When uncertain about intent, provide multiple relevant angles rather than asking for clarification`
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

// Resume download endpoints
app.get('/api/resume/download/pdf', (req, res) => {
  const filePath = path.join(__dirname, '../resume.pdf');
  res.download(filePath, 'Miguel_Gonzalez_Resume.pdf', (err) => {
    if (err) {
      console.error('Error downloading PDF resume:', err);
      res.status(404).json({ success: false, error: 'Resume not found' });
    }
  });
});

app.get('/api/resume/download/docx', (req, res) => {
  const filePath = path.join(__dirname, '../resume.docx');
  res.download(filePath, 'Miguel_Gonzalez_Resume.docx', (err) => {
    if (err) {
      console.error('Error downloading DOCX resume:', err);
      res.status(404).json({ success: false, error: 'Resume not found' });
    }
  });
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