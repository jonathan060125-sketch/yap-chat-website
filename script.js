const unlockSequence = ['y', 'a', 'p'];
let typedLetters = [];

const state = {
  activeChannel: 'math',
  displayName: '',
  unlocked: false,
  channels: {}
};

const channelTemplates = {
  math: {
    name: 'MATH',
    messages: [
      { user: 'Ava', text: 'Can someone help me solve this quadratic?', time: '09:12 AM' },
      { user: 'Leo', text: 'Use the quadratic formula and check the discriminant first.', time: '09:13 AM' },
      { user: 'Mina', text: 'I got x = 3 and x = -2. Is that right?', time: '09:14 AM' }
    ]
  },
  science: {
    name: 'SCIENCE',
    messages: [
      { user: 'Kai', text: 'The lab results are finally consistent with the hypothesis.', time: '08:45 AM' },
      { user: 'Zoe', text: 'Need a quick reminder on the difference between ionic and covalent bonds?', time: '08:47 AM' },
      { user: 'Rin', text: 'Covalent shares electrons and ionic transfers them.', time: '08:48 AM' }
    ]
  },
  socialStudies: {
    name: 'SOCIAL STUDIES',
    messages: [
      { user: 'Jules', text: 'How did the Industrial Revolution affect urban growth?', time: '12:03 PM' },
      { user: 'Noah', text: 'Factories pulled workers into cities and changed daily life.', time: '12:05 PM' },
      { user: 'Priya', text: 'And public health challenges got worse in crowded neighborhoods.', time: '12:06 PM' }
    ]
  },
  ela: {
    name: 'ELA',
    messages: [
      { user: 'Ella', text: 'I love the way this author uses metaphor to show emotion.', time: '01:12 PM' },
      { user: 'Sam', text: 'The symbolism makes the setting feel alive.', time: '01:14 PM' },
      { user: 'Kira', text: 'Can someone help annotate the theme in the final paragraph?', time: '01:16 PM' }
    ]
  },
  justChat: {
    name: 'JUST CHAT',
    messages: [
      { user: 'Theo', text: 'What is everyone doing after school?', time: '06:04 PM' },
      { user: 'Nia', text: 'I am testing a new game idea and drawing characters.', time: '06:05 PM' },
      { user: 'Ben', text: 'I am making a playlist for study time.', time: '06:06 PM' }
    ]
  },
  gameWebsites: {
    name: 'GAME WEBSITES',
    messages: [
      { user: 'Drew', text: 'Anyone here play web games with puzzle mechanics?', time: '04:20 PM' },
      { user: 'Lana', text: 'I am always looking for unblocked skill games.', time: '04:21 PM' },
      { user: 'Ivy', text: 'Best website for racing or building games?', time: '04:23 PM' }
    ]
  }
};

const typedBox = document.getElementById('typed-box');
const desmosScreen = document.getElementById('desmos-screen');
const loadingScreen = document.getElementById('loading-screen');
const nameModal = document.getElementById('name-modal');
const appShell = document.getElementById('app-shell');
const channelList = document.getElementById('channel-list');
const messageList = document.getElementById('message-list');
const channelName = document.getElementById('channel-name');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('message-input');
const nameForm = document.getElementById('name-form');
const displayNameInput = document.getElementById('display-name');
const serverIcons = document.querySelectorAll('.server-icon');

function buildChannelState() {
  state.channels = Object.fromEntries(
    Object.entries(channelTemplates).map(([key, value]) => [
      key,
      {
        ...value,
        messages: value.messages.map((msg) => ({ ...msg }))
      }
    ])
  );
}

function renderTypedBox() {
  const slots = Array.from({ length: unlockSequence.length }, (_, index) => {
    const letter = typedLetters[index] ? typedLetters[index].toUpperCase() : '_';
    return `<span>${letter}</span>`;
  }).join('');

  typedBox.innerHTML = slots;
}

function updateTitle(title) {
  document.title = title;
}

function showLoadingScreen() {
  desmosScreen.classList.add('hidden');
  loadingScreen.classList.remove('hidden');
  updateTitle('YAP');

  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    nameModal.classList.remove('hidden');
    displayNameInput.focus();
  }, 2200);
}

function renderChannelList() {
  channelList.innerHTML = '';

  Object.keys(channelTemplates).forEach((channelId) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `channel-button ${state.activeChannel === channelId ? 'active' : ''}`;
    button.textContent = `# ${channelTemplates[channelId].name}`;
    button.addEventListener('click', () => {
      switchChannel(channelId);
    });
    channelList.appendChild(button);
  });
}

function switchChannel(channelId) {
  state.activeChannel = channelId;
  renderChannelList();
  updateServerIcons();
  renderMessages();
}

function updateServerIcons() {
  serverIcons.forEach(icon => {
    const channel = icon.getAttribute('data-channel');
    if (channel === state.activeChannel) {
      icon.classList.add('active');
    } else {
      icon.classList.remove('active');
    }
  });
}

function renderMessages() {
  const activeMessages = state.channels[state.activeChannel].messages;
  const channel = state.channels[state.activeChannel];

  channelName.textContent = channel.name;
  messageList.innerHTML = activeMessages
    .map((msg) => {
      const initials = (msg.user || 'Y').slice(0, 2).toUpperCase();
      const isCurrentUser = msg.user === state.displayName;
      const avatarClass = isCurrentUser ? '' : 'other';
      return `
        <div class="message">
          <div class="avatar ${avatarClass}">${initials}</div>
          <div class="message-body">
            <div class="message-meta">
              <span class="sender">${msg.user}</span>
              <span class="time">${msg.time}</span>
            </div>
            <div class="message-text">${msg.text}</div>
          </div>
        </div>
      `;
    })
    .join('');

  messageList.scrollTop = messageList.scrollHeight;
}

function handleSubmitName(event) {
  event.preventDefault();
  const name = displayNameInput.value.trim();
  state.displayName = name || 'Yapper';

  nameModal.classList.add('hidden');
  appShell.classList.remove('hidden');
  updateTitle('YAP');
  renderChannelList();
  updateServerIcons();
  renderMessages();
  chatInput.focus();
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  state.channels[state.activeChannel].messages.push({
    user: state.displayName,
    text,
    time
  });

  chatInput.value = '';
  renderMessages();
}

function handleSequenceKey(event) {
  if (state.unlocked) return;

  const key = event.key.toLowerCase();
  if (!unlockSequence.includes(key)) {
    typedLetters = [];
    renderTypedBox();
    return;
  }

  typedLetters.push(key);

  if (typedLetters.length > unlockSequence.length) {
    typedLetters = typedLetters.slice(-unlockSequence.length);
  }

  const sequence = typedLetters.join('');

  if (sequence === unlockSequence.join('')) {
    state.unlocked = true;
    renderTypedBox();
    showLoadingScreen();
    return;
  }

  if (typedLetters.length === unlockSequence.length) {
    typedLetters = [];
    renderTypedBox();
  }

  renderTypedBox();
}

// Server icon clicks
serverIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    const channel = icon.getAttribute('data-channel');
    switchChannel(channel);
  });
});

window.addEventListener('keydown', handleSequenceKey);
nameForm.addEventListener('submit', handleSubmitName);
chatForm.addEventListener('submit', handleMessageSubmit);

// Initialize
buildChannelState();
renderTypedBox();
updateTitle('DESMOS');