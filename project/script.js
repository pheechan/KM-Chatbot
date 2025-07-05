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

// --- Chatbot UI logic ---
document.addEventListener('DOMContentLoaded', function() {
    // Chatbot UI logic
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    if (chatbotForm && chatbotInput && chatbotMessages) {
        chatbotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const msg = chatbotInput.value.trim();
            if (msg) {
                appendChatbotMessage(msg, 'user');
                chatbotInput.value = '';
                setTimeout(() => {
                    appendChatbotMessage('This is a sample bot reply.', 'bot');
                }, 600);
            }
        });
    }
    function appendChatbotMessage(text, sender) {
        const div = document.createElement('div');
        div.className = 'chatbot-message' + (sender === 'user' ? ' user' : '');
        div.textContent = text;
        chatbotMessages.appendChild(div);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});



// document.getElementById("chatbotForm").addEventListener("submit", async function (e) {
//   e.preventDefault(); // ❌ ป้องกันการ reload หน้าเว็บเวลา submit form

//   const inputEl = document.getElementById("chatbotInput"); // input ช่องพิมพ์ข้อความ
//   const chatBox = document.getElementById("chatbotMessages"); // กล่องที่แสดงข้อความทั้งหมด
//   const userMessage = inputEl.value.trim(); // ตัดช่องว่างจากข้อความที่พิมพ์
//   if (!userMessage) return; // ถ้าไม่ได้พิมพ์อะไร → ไม่ทำอะไรเลย

//   // แสดงข้อความของผู้ใช้
//   const userBubble = document.createElement("div");
//   userBubble.className = "chatbot-message user"; // class นี้ทำให้เป็นบับเบิลสีเข้ม ชิดขวา
//   userBubble.innerText = userMessage;
//   chatBox.appendChild(userBubble);
//   inputEl.value = ""; // เคลียร์ input ให้ว่าง

//   try {
//     //  ส่งข้อความไปยัง Azure AI Agent
//     const res = await fetch("https://kmagents.cognitiveservices.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "api-key": "9y8OHWBvep4TGoNp4DlNPBAOyG8YnaB9IiEZ3WVyq0eJhKb8nfQ0JQQJ99BFACYeBjFXJ3w3AAAAACOGEM04" // ห้ามเปิดเผยใน production จริง
//       },
//       body: JSON.stringify({
//         messages: [
//           { role: "system", content: "You are a helpful assistant." }, // บอทเริ่มต้นด้วยบทบาทนี้
//           { role: "user", content: userMessage } // ส่งข้อความของผู้ใช้
//         ],
//         temperature: 0.7
//       })
//     });

//     const data = await res.json(); // แปลงคำตอบจาก JSON เป็น object
//     const aiMessage = data.choices?.[0]?.message?.content || "⚠️ No response"; // ถ้าไม่มีคำตอบ ให้แสดง error

//     //  แสดงข้อความจากบอทในกล่องฟ้าอ่อน
//     const botBubble = document.createElement("div");
//     botBubble.className = "chatbot-message"; // ไม่มี .user = ฟ้าอ่อน ชิดซ้าย
//     botBubble.innerText = aiMessage;
//     chatBox.appendChild(botBubble);

//   } catch (err) {
//     console.error(err); // log ข้อผิดพลาดใน console (dev tools)

//     //  ถ้ามี error ให้แสดงข้อความแจ้งเตือนในกล่องบอท
//     const botBubble = document.createElement("div");
//     botBubble.className = "chatbot-message";
//     botBubble.innerText = "❌ ไม่สามารถเชื่อมต่อ AI Agent ได้";
//     chatBox.appendChild(botBubble);
//   }
// });



document.getElementById("chatbotForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // ป้องกันการ reload หน้าเว็บตอนกด Enter

  const inputEl = document.getElementById("chatbotInput");
  const chatBox = document.getElementById("chatbotMessages");
  const userMessage = inputEl.value.trim();
  if (!userMessage) return;

  // ✅ แสดงข้อความผู้ใช้ในกล่องสนทนา
  const userBubble = document.createElement("div");
  userBubble.className = "chatbot-message user";
  userBubble.innerText = userMessage;
  chatBox.appendChild(userBubble);
  inputEl.value = "";

  try {
    // ✅ เรียก backend API ที่เชื่อม Azure Agent
    const res = await fetch("http://localhost:3000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await res.json();
    const aiMessage = data.reply || "⚠️ Agent didn't return a response";

    // ✅ แสดงข้อความจาก AI Bot
    const botBubble = document.createElement("div");
    botBubble.className = "chatbot-message";
    botBubble.innerText = aiMessage;
    chatBox.appendChild(botBubble);

  } catch (err) {
    console.error("❌ Agent fetch error:", err);

    const botBubble = document.createElement("div");
    botBubble.className = "chatbot-message";
    botBubble.innerText = "❌ ไม่สามารถเชื่อมต่อกับ AI Agent ได้";
    chatBox.appendChild(botBubble);
  }

  // ✅ Scroll ลงล่างสุดอัตโนมัติ
  chatBox.scrollTop = chatBox.scrollHeight;
});
