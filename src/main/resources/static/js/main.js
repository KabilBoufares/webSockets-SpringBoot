'use strict';

(() => {
  const loginPage = document.getElementById('login-page');
  const chatPage = document.getElementById('chat-page');
  const loginForm = document.getElementById('loginForm');
  const messageForm = document.getElementById('messageForm');
  const usernameInput = document.getElementById('username');
  const messageInput = document.getElementById('message');
  const messageArea = document.getElementById('messageArea');
  const statusEl = document.getElementById('connecting');
  const emojiBtn = document.getElementById('emoji-btn');
  const emojiPickerOverlay = document.getElementById('emoji-picker-overlay');
  const emojiPicker = document.getElementById('emoji-picker');
  const closeEmojiPicker = document.getElementById('close-emoji-picker');
  const emojiContent = document.getElementById('emoji-content');

  let stompClient = null;
  let username = null;
  let currentEmojiCategory = 'smileys';

  // Avatar colors for consistent user identification
  const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];

  // Emoji categories with their emojis
  const emojiCategories = {
    smileys: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
      '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛',
      '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
      '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄',
      '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒'
    ],
    people: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏',
      '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
      '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛',
      '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
      '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
      '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀'
    ],
    nature: [
      '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼',
      '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌶️',
      '🍄', '🌾', '💐', '🌿', '🍀', '🍃', '🪨', '🌍',
      '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒',
      '🌓', '🌔', '🌙', '🌛', '🌜', '🌚', '🌝', '🌞',
      '⭐', '🌟', '💫', '✨', '☄️', '☀️', '🌤️', '⛅'
    ],
    food: [
      '🍎', '🍏', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇',
      '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥',
      '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️',
      '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠',
      '🥐', '🥖', '🍞', '🥨', '🥯', '🧀', '🥚', '🍳',
      '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭'
    ],
    activities: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
      '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
      '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿',
      '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿',
      '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺',
      '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵'
    ],
    travel: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
      '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵',
      '🚲', '🛴', '🛹', '🛼', '🚁', '🛸', '✈️', '🛩️',
      '🛫', '🛬', '🪂', '💺', '🚀', '🛰️', '🚢', '⛵',
      '🚤', '🛥️', '🛳️', '⛴️', '🚂', '🚃', '🚄', '🚅',
      '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋'
    ],
    objects: [
      '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵',
      '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️',
      '🪜', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓',
      '🪚', '🔩', '⚙️', '🪤', '🧲', '🔫', '💣', '🧨',
      '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦',
      '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭'
    ],
    symbols: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
      '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
      '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️',
      '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈',
      '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
      '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️'
    ]
  };

  // Initialize the application
  function init() {
    // Check if WebSocket libraries are loaded
    if (typeof SockJS === 'undefined' || typeof Stomp === 'undefined') {
      console.warn('WebSocket libraries not loaded. Running in demo mode.');
      initDemoMode();
    }

    // Bind event listeners
    loginForm.addEventListener('submit', handleLogin);
    messageForm.addEventListener('submit', handleSendMessage);
    emojiBtn.addEventListener('click', showEmojiPicker);
    closeEmojiPicker.addEventListener('click', hideEmojiPicker);
    emojiPickerOverlay.addEventListener('click', (e) => {
      if (e.target === emojiPickerOverlay) {
        hideEmojiPicker();
      }
    });

    // Initialize emoji picker
    initEmojiPicker();
  }

  function handleLogin(event) {
    event.preventDefault();
    username = usernameInput.value.trim();
    
    if (!username) {
      alert('Veuillez entrer un nom d\'utilisateur');
      return;
    }

    // Switch to chat page
    loginPage.classList.add('hidden');
    chatPage.classList.remove('hidden');
    
    // Connect to WebSocket
    connectWebSocket();
  }

  function handleSendMessage(event) {
    event.preventDefault();
    const content = messageInput.value.trim();
    
    if (!content) return;

    if (stompClient && stompClient.connected) {
      // Send via WebSocket
      const chatMessage = {
        sender: username,
        content: content,
        type: 'CHAT'
      };
      stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
    } else {
      // Demo mode - add message directly
      addMessage({
        sender: username,
        content: content,
        type: 'CHAT'
      });
      
      // Simulate response in demo mode
      setTimeout(() => {
        simulateResponse(content);
      }, 1000 + Math.random() * 2000);
    }
    
    messageInput.value = '';
  }

  function connectWebSocket() {
    try {
      statusEl.textContent = 'Connexion…';
      statusEl.style.color = '#ffc107';
      
      const socket = new SockJS('/ws');
      stompClient = Stomp.over(socket);
      
      stompClient.connect({}, onConnected, onError);
    } catch (error) {
      console.warn('WebSocket connection failed, running in demo mode:', error);
      initDemoMode();
    }
  }

  function onConnected() {
    console.log('Connected to WebSocket');
    
    // Subscribe to public topic
    stompClient.subscribe('/topic/public', onMessageReceived);
    
    // Send join message
    stompClient.send('/app/chat.addUser', {}, JSON.stringify({
      sender: username,
      type: 'JOIN'
    }));
    
    // Update status
    statusEl.textContent = 'Connecté';
    statusEl.style.color = '#22c55e';
  }

  function onError(error) {
    console.error('WebSocket connection error:', error);
    statusEl.textContent = 'Erreur de connexion - Mode démo activé';
    statusEl.style.color = '#ef4444';
    
    // Fall back to demo mode
    setTimeout(() => {
      initDemoMode();
    }, 2000);
  }

  function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    addMessage(message);
  }

  function addMessage(message) {
    const li = document.createElement('li');
    
    if (message.type === 'JOIN' || message.type === 'LEAVE') {
      li.classList.add('event-message');
      li.textContent = `${message.sender} ${message.type === 'JOIN' ? 'a rejoint' : 'a quitté'} le chat.`;
    } else {
      li.classList.add('chat-message');
      
      // Add 'own' class for current user's messages
      if (message.sender === username) {
        li.classList.add('own');
      }
      
      const avatarColor = getAvatarColor(message.sender);
      
      li.innerHTML = `
        <i class="avatar" style="background-color: ${avatarColor}">
          ${message.sender.charAt(0).toUpperCase()}
        </i>
        <div class="message-content">
          <span class="username">${escapeHtml(message.sender)}</span>
          <p class="message-text">${escapeHtml(message.content)}</p>
        </div>
      `;
    }
    
    messageArea.appendChild(li);
    scrollToBottom();
  }

  function initDemoMode() {
    statusEl.textContent = 'Mode démo - Messages simulés';
    statusEl.style.color = '#3b82f6';
    
    // Add welcome message
    addMessage({
      sender: 'Système',
      content: 'Bienvenue dans le chat ! (Mode démo) 🎉',
      type: 'CHAT'
    });
    
    // Add join message for current user
    addMessage({
      sender: username,
      type: 'JOIN'
    });
  }

  function simulateResponse(originalMessage) {
    const responses = [
      "C'est intéressant ! 🤔",
      "Je suis d'accord ! 👍",
      "Bonne remarque ! 💡",
      "Exactement ce que je pensais 🎯",
      "Merci de partager ça 🙏",
      "Cool ! 😎",
      "Ça me semble logique 🧠",
      "Bon à savoir ! 📚",
      "Génial ! 🎉",
      "J'aime cette idée 💡",
      "Très vrai ! ✅",
      "C'est utile, merci ! 🤝",
      "Je n'y avais pas pensé 💭",
      "Excellente question ! ❓",
      "Perspective intéressante 👀"
    ];
    
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    addMessage({
      sender: randomName,
      content: randomResponse,
      type: 'CHAT'
    });
  }

  // Emoji Picker Functions
  function initEmojiPicker() {
    // Create category buttons
    const categoryButtons = document.querySelectorAll('.emoji-category');
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        switchEmojiCategory(category);
        
        // Update active state
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });

    // Load initial category
    loadEmojiCategory('smileys');
  }

  function showEmojiPicker() {
    emojiPickerOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function hideEmojiPicker() {
    emojiPickerOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function switchEmojiCategory(category) {
    currentEmojiCategory = category;
    loadEmojiCategory(category);
  }

  function loadEmojiCategory(category) {
    const emojis = emojiCategories[category] || [];
    emojiContent.innerHTML = '';

    emojis.forEach(emoji => {
      const button = document.createElement('button');
      button.className = 'emoji-option';
      button.textContent = emoji;
      button.addEventListener('click', () => {
        insertEmoji(emoji);
      });
      emojiContent.appendChild(button);
    });
  }

  function insertEmoji(emoji) {
    const cursorPos = messageInput.selectionStart;
    const textBefore = messageInput.value.substring(0, cursorPos);
    const textAfter = messageInput.value.substring(cursorPos);
    
    messageInput.value = textBefore + emoji + textAfter;
    messageInput.focus();
    
    // Set cursor position after the emoji
    const newCursorPos = cursorPos + emoji.length;
    messageInput.setSelectionRange(newCursorPos, newCursorPos);
    
    hideEmojiPicker();
  }

  function getAvatarColor(name) {
    // Generate consistent color based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  function scrollToBottom() {
    setTimeout(() => {
      messageArea.scrollTop = messageArea.scrollHeight;
    }, 100);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape key to close emoji picker
    if (e.key === 'Escape' && !emojiPickerOverlay.classList.contains('hidden')) {
      hideEmojiPicker();
    }
    
    // Ctrl/Cmd + E to open emoji picker
    if ((e.ctrlKey || e.metaKey) && e.key === 'e' && !loginPage.classList.contains('hidden') === false) {
      e.preventDefault();
      if (emojiPickerOverlay.classList.contains('hidden')) {
        showEmojiPicker();
      } else {
        hideEmojiPicker();
      }
    }
  });

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle page unload
  window.addEventListener('beforeunload', () => {
    if (stompClient && stompClient.connected) {
      stompClient.send('/app/chat.removeUser', {}, JSON.stringify({
        sender: username,
        type: 'LEAVE'
      }));
      stompClient.disconnect();
    }
  });
})();