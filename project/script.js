// Enterprise Chat Portal JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeChatPortal();
});

function initializeChatPortal() {
    setupEventListeners();
    setupThemeToggle();
    setupChatInput();
}

function setupEventListeners() {
    // Menu button functionality
    const menuButton = document.querySelector('.button .menu');
    if (menuButton) {
        menuButton.addEventListener('click', toggleSidebar);
    }

    // Search button functionality
    const searchButton = document.querySelector('.button2 .search');
    if (searchButton) {
        searchButton.addEventListener('click', toggleSearch);
    }

    // New chat button functionality
    const newChatButton = document.querySelector('.input-field .input');
    if (newChatButton) {
        newChatButton.addEventListener('click', createNewChat);
    }

    // Clear button functionality
    const clearButton = document.querySelector('.button4');
    if (clearButton) {
        clearButton.addEventListener('click', clearChat);
    }

    // Submit button functionality
    const submitButton = document.querySelector('.button5');
    if (submitButton) {
        submitButton.addEventListener('click', submitMessage);
    }

    // Send button functionality
    const sendButton = document.querySelector('.frame-30');
    if (sendButton) {
        sendButton.addEventListener('click', submitMessage);
    }

    // Enter key in input field
    const inputField = document.querySelector('.start-asking-chat-portal-here');
    if (inputField) {
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitMessage();
            }
        });
    }
}

function setupThemeToggle() {
    const themeButton = document.querySelector('.theme');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }
}

function setupChatInput() {
    // Make the input field functional
    const inputPlaceholder = document.querySelector('.start-asking-chat-portal-here');
    if (inputPlaceholder) {
        // Convert to actual input
        inputPlaceholder.contentEditable = true;
        inputPlaceholder.addEventListener('focus', function() {
            if (this.textContent.trim() === 'Ask Chat Portal here...') {
                this.textContent = '';
                this.style.color = '#181516';
            }
        });
        
        inputPlaceholder.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = 'Ask Chat Portal here...';
                this.style.color = '#767676';
            }
        });
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.side-nav');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

function toggleSearch() {
    console.log('Search functionality triggered');
    // Add search functionality here
    alert('Search feature coming soon!');
}

function createNewChat() {
    console.log('Creating new chat');
    // Clear current chat and start new
    const inputField = document.querySelector('.start-asking-chat-portal-here');
    if (inputField) {
        inputField.textContent = 'Ask Chat Portal here...';
        inputField.style.color = '#767676';
    }
    alert('New chat started!');
}

function clearChat() {
    console.log('Clearing chat');
    const inputField = document.querySelector('.start-asking-chat-portal-here');
    if (inputField) {
        inputField.textContent = 'Ask Chat Portal here...';
        inputField.style.color = '#767676';
    }
    alert('Chat cleared!');
}

function submitMessage() {
    const inputField = document.querySelector('.start-asking-chat-portal-here');
    if (inputField && inputField.textContent.trim() && inputField.textContent.trim() !== 'Ask Chat Portal here...') {
        const message = inputField.textContent.trim();
        console.log('Submitting message:', message);
        
        // Simulate message sending
        alert(`Message sent: "${message}"`);
        
        // Clear input
        inputField.textContent = 'Ask Chat Portal here...';
        inputField.style.color = '#767676';
    }
}

function toggleTheme() {
    console.log('Toggling theme');
    const body = document.body;
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    
    if (currentTheme === 'light') {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Initialize theme on load
loadTheme();
