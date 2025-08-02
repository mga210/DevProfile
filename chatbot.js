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
                        conversationHistory: this.conversationHistory.slice(-10) // Keep last 10 messages for context
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
        
        // Skills and expertise responses
        if (lowerMessage.includes('skill') || lowerMessage.includes('experience') || lowerMessage.includes('what can')) {
            return "Miguel specializes in AI Systems Development, Python programming (GUI development with PySide/Tkinter), prompt engineering, data analysis, and operations optimization. He's currently pursuing a BBA in Computer Information Systems and has certifications in Google Project Management and Python programming.";
        }
        
        // Projects responses
        if (lowerMessage.includes('project') || lowerMessage.includes('system pilot') || lowerMessage.includes('blueprint') || lowerMessage.includes('dmrb')) {
            return "Miguel has built several key projects:\n\n🤖 **System Pilot** - GPT-powered software architecture strategist\n🔧 **Blueprint Buddy** - Prompt engineering optimization tool\n📊 **DMRB** - Digital MakeReady Board for operations management\n🐍 **Python Training Board** - Interactive GUI learning platform\n\nEach project showcases his expertise in AI integration and Python development.";
        }
        
        // Contact information
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
            return "You can reach Miguel at:\n📧 mgonzalez869@gmail.com\n📍 Based in Plano, TX\n💼 LinkedIn: linkedin.com/in/miguel-gonzalez-8a389791\n🔗 GitHub: github.com/mga210";
        }
        
        // Background and education
        if (lowerMessage.includes('background') || lowerMessage.includes('education') || lowerMessage.includes('story')) {
            return "Miguel is transitioning from operations management to AI Systems Development. He has extensive experience in service operations leadership, team training (50+ members), and process automation. Currently pursuing a BBA in Computer Information Systems at Ana G. Méndez University.";
        }
        
        // Programming languages
        if (lowerMessage.includes('python') || lowerMessage.includes('programming') || lowerMessage.includes('code')) {
            return "Miguel specializes in Python development, particularly:\n🖥️ GUI applications using PySide6 and Tkinter\n🤖 AI workflow engineering and prompt optimization\n📊 Data analysis and automation scripts\n🔗 API integrations and web development\n🏗️ Clean Architecture and modular design patterns";
        }
        
        // AI and automation
        if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('automation')) {
            return "Miguel focuses on practical AI implementations:\n🧠 GPT-powered automation systems\n⚙️ Workflow optimization and process intelligence\n🔄 Legacy system modernization\n📈 Operational efficiency improvements\n💡 Custom AI agent development for business needs";
        }
        
        // Generic greeting
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! I'm here to help you learn about Miguel's expertise in AI Systems Development, Python programming, and his various projects. What would you like to know?";
        }
        
        // Default response
        return "I can help you learn about Miguel's skills in AI Systems Development, Python programming, his projects like System Pilot and DMRB, his professional background, and how to contact him. What specific area interests you?";
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