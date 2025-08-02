// Chatbot Widget JavaScript
class MiguelChatbot {
    constructor() {
        this.apiUrl = '/api/chat'; // Use our server endpoint for security
        this.isOpen = false;
        this.isLoading = false;
        this.conversationHistory = [];
        
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
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
                    </div>
                    
                    <div class="chatbot-messages" id="chatbot-messages">
                        <!-- Messages will be inserted here -->
                    </div>
                    
                    <div class="chatbot-input">
                        <div class="input-container">
                            <textarea 
                                id="chatbot-textarea" 
                                placeholder="Ask me anything about Miguel's experience..." 
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

        toggle.addEventListener('click', () => this.toggleChatbot());
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

    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    }

    addWelcomeMessage() {
        const welcomeMessage = "Hi! I'm Miguel's AI assistant. I can tell you about his skills in AI systems development, Python programming, project management, and his various projects like System Pilot, Blueprint Buddy, and the DMRB system. What would you like to know?";
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
            const botResponse = data.response;

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
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment to ensure all other scripts have loaded
    setTimeout(() => {
        new MiguelChatbot();
    }, 100);
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            new MiguelChatbot();
        }, 100);
    });
} else {
    setTimeout(() => {
        new MiguelChatbot();
    }, 100);
}