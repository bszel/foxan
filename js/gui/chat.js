export function initializeChat(foxan) {
    const chatTextInput = document.getElementById('chat-text-input');
    const chatTextSubmit = document.getElementById('chat-text-submit');

    chatTextInput.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            handleTextSubmit();
        }
    });
    chatTextSubmit.addEventListener('click', () => {
        handleTextSubmit();
    });

    function handleTextSubmit() {
        const message = chatTextInput.value;
        chatTextInput.value = '';
        foxan.multiplayerManager.sendMessage(message);
    }
}

export function addNewMessage(playerName, message) {
    const chatHistorySection = document.getElementById('chat-history-section');
    // Only scroll to the bottom if already at the bottom
    const shouldScroll = chatHistorySection.scrollHeight - chatHistorySection.scrollTop - chatHistorySection.clientHeight < 10;
    const chatMessage = document.createElement('div');
    chatMessage.className = 'chat-message';
    const chatMessagePlayerName = document.createElement('span');
    chatMessagePlayerName.className = 'chat-message-player-name';
    const chatMessageText = document.createElement('span');
    chatMessageText.className = 'chat-message-text';
    chatMessagePlayerName.textContent = playerName + ': ';
    chatMessageText.textContent = message;
    chatMessage.appendChild(chatMessagePlayerName);
    chatMessage.appendChild(chatMessageText);
    chatHistorySection.appendChild(chatMessage);
    if (shouldScroll) {
        chatHistorySection.scrollTop = chatHistorySection.scrollHeight;
    }
}

export function clearChat() {
    const chatHistorySection = document.getElementById('chat-history-section');
    chatHistorySection.innerHTML = '';
}