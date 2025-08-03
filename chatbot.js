// Chatbot Widget JavaScript
class MiguelChatbot {
    constructor() {
        this.apiUrl = '/api/chat'; // Use our server endpoint for security
        this.isGitHubPages = window.location.hostname.includes('github.io') || window.location.hostname.includes('githubusercontent.com');
        this.isOpen = false;
        this.isLoading = false;
        this.conversationHistory = [];
        
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
        this.autoOpenWelcome();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-container" id="chatbot-container">
                <button class="chatbot-toggle" id="chatbot-toggle">
                    <i class="fas fa-comments"></i>
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header">
                        <h3>Chat with Miguel's AI Assistant</h3>
                        <p>Ask me about Miguel's skills and projects!</p>
                        <button class="chatbot-close" id="chatbot-close">×</button>
                    </div>
                    
                    <div class="chatbot-messages" id="chatbot-messages">
                        <!-- Messages will be inserted here -->
                    </div>
                    
                    <div class="chatbot-input">
                        <div class="input-container">
                            <textarea 
                                id="chatbot-textarea" 
                                placeholder="Type your message here..." 
                                rows="1"
                            ></textarea>
                            <button class="send-button" id="send-button">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const toggle = document.getElementById('chatbot-toggle');
        const textarea = document.getElementById('chatbot-textarea');
        const sendButton = document.getElementById('send-button');
        const closeButton = document.getElementById('chatbot-close');

        toggle.addEventListener('click', () => this.toggleChatbot());
        closeButton.addEventListener('click', () => this.closeChatbot());
        sendButton.addEventListener('click', () => this.sendMessage());
        
        textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        textarea.addEventListener('input', () => this.autoResize(textarea));
    }

    toggleChatbot() {
        const toggle = document.getElementById('chatbot-toggle');
        const window = document.getElementById('chatbot-window');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            toggle.classList.add('open');
            window.classList.add('open');
            document.getElementById('chatbot-textarea').focus();
        } else {
            toggle.classList.remove('open');
            window.classList.remove('open');
        }
    }

    closeChatbot() {
        if (this.isOpen) {
            this.toggleChatbot();
        }
    }

    autoResize(textarea) {
        textarea.style.height = '48px';
        const newHeight = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = newHeight + 'px';
        
        // Show/hide scrollbar based on content
        if (textarea.scrollHeight > 120) {
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.overflowY = 'hidden';
        }
    }

    addWelcomeMessage() {
        let welcomeMessage;
        if (this.isGitHubPages) {
            welcomeMessage = "👋 Hi! I'm Miguel's assistant. I can help you learn about:\n\n🤖 AI Systems Development\n🐍 Python Programming & GUIs\n📊 Data Analysis & Automation\n🚀 His projects like System Pilot, Blueprint Buddy, and DMRB\n\nWhat would you like to know?";
        } else {
            welcomeMessage = "👋 Hi! I'm Miguel's AI assistant. I can help you learn about:\n\n🤖 AI Systems Development\n🐍 Python Programming & GUIs\n📊 Data Analysis & Automation\n🚀 His projects like System Pilot, Blueprint Buddy, and DMRB\n\nWhat would you like to know?";
        }
        this.addMessage(welcomeMessage, 'bot');
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = content;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    addErrorMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        messagesContainer.appendChild(errorDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async sendMessage() {
        const textarea = document.getElementById('chatbot-textarea');
        const sendButton = document.getElementById('send-button');
        const message = textarea.value.trim();
        
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage(message, 'user');
        textarea.value = '';
        textarea.style.height = 'auto';
        
        // Set loading state
        this.isLoading = true;
        sendButton.disabled = true;
        this.addTypingIndicator();

        try {
            // Add message to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: message
            });

            let botResponse;

            if (this.isGitHubPages) {
                // GitHub Pages fallback - provide intelligent responses without API
                botResponse = this.getStaticResponse(message);
            } else {
                // Send to our secure server endpoint
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        conversationHistory: this.conversationHistory.slice(-16) // Keep last 16 messages for better context
                    })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                botResponse = data.response;
            }

            // Add bot response to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: botResponse
            });

            this.removeTypingIndicator();
            this.addMessage(botResponse, 'bot');

        } catch (error) {
            console.error('Chatbot error:', error);
            this.removeTypingIndicator();
            
            let errorMessage = "I'm sorry, I'm having trouble connecting right now. ";
            
            if (error.message.includes('401')) {
                errorMessage += "There seems to be an API authentication issue.";
            } else if (error.message.includes('429')) {
                errorMessage += "I'm getting too many requests. Please try again in a moment.";
            } else {
                errorMessage += "Please try again later or contact Miguel directly at mgonzalez869@gmail.com.";
            }
            
            this.addErrorMessage(errorMessage);
        } finally {
            this.isLoading = false;
            sendButton.disabled = false;
        }
    }

    autoOpenWelcome() {
        // Wait for DOM to be fully ready
        setTimeout(() => {
            const toggle = document.getElementById('chatbot-toggle');
            if (!toggle) return;
            
            // Check if mobile
            const isMobile = window.innerWidth <= 480;
            const openDelay = isMobile ? 2000 : 3000; // 2s mobile, 3s desktop
            const closeDelay = isMobile ? 4000 : 10000; // 4s mobile, 10s desktop
            
            // Add pulsing animation to get attention
            setTimeout(() => {
                toggle.classList.add('pulse');
            }, 1000);
            
            // Auto-open chatbot
            setTimeout(() => {
                if (!this.isOpen && toggle) {
                    toggle.classList.remove('pulse');
                    this.toggleChatbot();
                    
                    // Auto-close after specified time
                    setTimeout(() => {
                        if (this.isOpen) {
                            this.toggleChatbot();
                        }
                    }, closeDelay);
                }
            }, openDelay);
        }, 100);
    }

    getStaticResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Background and journey - comprehensive response
        if (lowerMessage.includes('background') || lowerMessage.includes('story') || lowerMessage.includes('journey') || lowerMessage.includes('career') || lowerMessage.includes('experience') || lowerMessage.includes('timeline')) {
            return `**Miguel's Professional Journey:**

**🎬 Universal Studios (Origins)**: Started in entertainment operations, learning systems thinking through complex operational challenges

**🏢 Mid-Atlantic Apartment Communities (MAA)**: Service Maintenance Manager leading 3+ properties, where he identified operational inefficiencies and began developing digital solutions

**🏗️ RPM Living**: Technology integration roles focusing on process optimization and digital transformation

**🤖 Current - Independent AI Systems Developer**: Self-driven transition into AI systems development, building production tools without formal software titles

**Key Transition Points:**
- Recognized that operational problems needed systematic, not manual solutions  
- Started building Python tools to solve real workplace challenges
- Developed DMRB coordination engine that achieved 40% efficiency improvements
- Evolved from operations manager to systems architect through hands-on problem solving

Miguel's unique path combines deep operational knowledge with self-taught technical skills, making him uniquely positioned to build AI systems that actually solve business problems.`;
        }
        
        // DMRB and production systems - detailed technical response
        if (lowerMessage.includes('dmrb') || lowerMessage.includes('make ready') || lowerMessage.includes('digital board') || lowerMessage.includes('production') || lowerMessage.includes('coordination') || lowerMessage.includes('apartment') || lowerMessage.includes('unit')) {
            return `**DMRB (Make Ready Digital Board) - Technical Deep Dive:**

**🏗️ System Architecture:**
- **Frontend**: PySide6 GUI with clean separation from business logic
- **Backend**: Python with SQLite database and Pandas for data processing  
- **Architecture**: DTO patterns, lifecycle state management, real-time updates
- **Deployment**: Multi-property production environment

**⚙️ Core Features:**
- **Automated Workflow Enforcement**: Task dependencies and resource allocation
- **Lifecycle Logic**: State transitions with validation and rollback capabilities
- **Real-time Coordination**: Live updates across teams and properties
- **Role-based Access**: Different views for maintenance, management, and admin
- **Compliance Checking**: Automated validation of regulatory requirements

**📊 Business Impact:**
- **40% reduction** in unit turnover time
- **Eliminated double-booking conflicts** through intelligent scheduling
- **Replaced Excel chaos** with structured, auditable workflows
- **Deployed across multiple properties** with measurable ROI

**🚀 Technical Innovation:**
Miguel built this without formal software training, using operations expertise to design workflows that actually match how teams work in practice. The system bridges the gap between business needs and technical implementation.`;
        }
        
        // Technical skills and architecture
        if (lowerMessage.includes('skill') || lowerMessage.includes('technical') || lowerMessage.includes('architecture') || lowerMessage.includes('system thinking')) {
            return "Miguel is highly skilled in system thinking, process automation, prompt engineering, and AI-driven coordination tools. He approaches problems like a software architect: separating UI from logic, using clean architecture, and applying DTO structures to keep logic traceable and auditable. His technical stack includes GPT-4, LangChain, Python (Pandas, PySide6, FastAPI), SQLite, and Supabase.";
        }
        
        // Python and development approach
        if (lowerMessage.includes('python') || lowerMessage.includes('programming') || lowerMessage.includes('development') || lowerMessage.includes('code')) {
            return "Miguel uses Python to build intelligent tools, dashboards, and UI-based systems — even without writing raw frontend code. He specializes in GUI development with PySide6 and Tkinter, creating full-scale coordination engines with clean separation between UI and business logic. His approach focuses on making complex systems traceable and auditable.";
        }
        
        // Replit and deployment
        if (lowerMessage.includes('replit') || lowerMessage.includes('deploy') || lowerMessage.includes('web') || lowerMessage.includes('no-code')) {
            return "Miguel uses Replit to build and deploy web-based tools, even though he doesn't code HTML/JS from scratch. He assembles, structures, and deploys full projects using no-code/low-code workflows, smart design choices, and AI-assisted coding. This approach lets him focus on solving business problems rather than getting bogged down in frontend implementation details.";
        }
        
        // Projects and tools - comprehensive technical breakdown
        if (lowerMessage.includes('project') || lowerMessage.includes('tools') || lowerMessage.includes('system pilot') || lowerMessage.includes('blueprint') || lowerMessage.includes('portfolio') || lowerMessage.includes('built') || lowerMessage.includes('developed')) {
            return `**Miguel's Technical Project Portfolio:**

**🏗️ DMRB (Make Ready Digital Board)**
- **Type**: Full-scale Python coordination engine
- **Technology**: PySide6, SQLite, Pandas, lifecycle state management
- **Impact**: 40% efficiency gain, deployed across multiple properties
- **Innovation**: Replaced Excel chaos with structured workflows

**🤖 System Pilot**  
- **Type**: GPT-powered software architecture strategist
- **Technology**: GPT-4, LangChain, prompt chaining, AI analysis
- **Purpose**: Code review, architecture recommendations, best practices
- **Unique Angle**: Combines operational experience with AI insights

**🔧 Blueprint Buddy**
- **Type**: Advanced prompt engineering optimization platform  
- **Technology**: Python, FastAPI, OpenAI integration, A/B testing
- **Features**: Systematic prompt refinement, quality metrics, iterative improvement
- **Applications**: AI agent development, chatbot optimization

**🐍 Python Training Board**
- **Type**: Interactive GUI-based learning management system
- **Technology**: PySide6, modular architecture, plugin system
- **Approach**: Hands-on exercises, real-time feedback, progressive difficulty
- **Focus**: Bridge theory-to-practice gap in Python education

**🌐 Portfolio Website (This Site)**
- **Type**: Full-stack web application with AI chatbot
- **Technology**: HTML/CSS/JS frontend, Node.js backend, PostgreSQL
- **Features**: Intelligent chatbot, analytics, contact management
- **Deployment**: Dual compatibility (Replit + GitHub Pages)

All projects are production-deployed and solving real problems, not just demos.`;
        }
        
        // AI and automation focus
        if (lowerMessage.includes('ai') || lowerMessage.includes('automation') || lowerMessage.includes('gpt') || lowerMessage.includes('prompt')) {
            return "Miguel specializes in AI-driven coordination tools and prompt engineering. His tools use GPT-4 and LangChain to create intelligent automation systems that solve real operational problems. He focuses on practical AI implementations that reduce delays, eliminate manual processes, and introduce logical enforcement to business workflows.";
        }
        
        // Contact information
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
            return "You can reach Miguel at:\n📧 mgonzalez869@gmail.com\n📍 Based in Plano, TX\n💼 LinkedIn: linkedin.com/in/miguel-gonzalez-8a389791\n🔗 GitHub: github.com/mga210";
        }
        
        // Education and learning
        if (lowerMessage.includes('education') || lowerMessage.includes('university') || lowerMessage.includes('degree') || lowerMessage.includes('certification')) {
            return "Miguel is currently pursuing a BBA in Computer Information Systems at Ana G. Méndez University. He also holds certifications in Google Project Management, Python for Everybody (University of Michigan), and EPA Section 608. His learning approach combines formal education with hands-on project development and AI-assisted skill building.";
        }
        
        // Specific technical questions
        if (lowerMessage.includes('langchain') || lowerMessage.includes('fastapi') || lowerMessage.includes('supabase') || lowerMessage.includes('sqlite')) {
            return "Miguel's technical stack includes:\n• **LangChain** - For building AI agent workflows and prompt chains\n• **FastAPI** - For creating high-performance API backends\n• **SQLite & Supabase** - For local and cloud database solutions\n• **PySide6/Tkinter** - For Python GUI development\n• **Pandas** - For data manipulation and analysis\n\nHe integrates these tools to build coordination engines and intelligent automation systems.";
        }
        
        // Work philosophy and approach
        if (lowerMessage.includes('philosophy') || lowerMessage.includes('approach') || lowerMessage.includes('methodology') || lowerMessage.includes('thinking')) {
            return "Miguel's development philosophy centers on solving real operational problems through clean architecture. He believes in separating UI from business logic, using DTO patterns for data transfer, and building systems that are traceable and auditable. His approach: identify the core problem, architect a modular solution, implement with clean code, and deploy for real-world testing.";
        }
        
        // Generic greeting
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('greeting')) {
            return "Hello! I'm Miguel's intelligent assistant with deep knowledge of his technical journey, projects, and expertise. I can discuss his real-world AI tools, Python coordination systems, architectural approaches, and his evolution from operations to self-driven software development. What would you like to explore?";
        }
        
        // Comprehensive fallback with multiple relevant aspects
        return `I can help with any aspect of Miguel's profile! Here are some key areas:

**🚀 Technical Projects**: DMRB coordination engine (40% efficiency gain), System Pilot AI assistant, Blueprint Buddy prompt optimizer, Python Training Board

**🛠️ Technical Skills**: Python (PySide6, Tkinter, Pandas, FastAPI), AI/LLM integration (GPT-4, LangChain), database design (SQLite, Supabase), clean architecture patterns

**📈 Professional Journey**: Universal Studios → MAA Properties → RPM Living → Independent AI Developer. Led 50+ team training, $25K+ cost savings, operations-to-tech transition

**🎯 Current Focus**: AI-driven operational intelligence, no-code/low-code deployment on Replit, system architecture consulting

**🎓 Education**: BBA Computer Information Systems (Ana G. Méndez), Google PM certification, Python specialization

What specific area would you like to explore in detail?`;
    }
}

// Initialize chatbot when DOM is loaded
function initializeChatbot() {
    // Check if chatbot already exists
    if (document.getElementById('chatbot-container')) {
        return;
    }
    
    try {
        new MiguelChatbot();
        console.log('Chatbot initialized successfully');
    } catch (error) {
        console.error('Error initializing chatbot:', error);
    }
}

// Initialize based on document state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
    // Document is already loaded
    initializeChatbot();
}

// Backup initialization - ensure it runs even if other methods fail
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!document.getElementById('chatbot-container')) {
            initializeChatbot();
        }
    }, 1000);
});