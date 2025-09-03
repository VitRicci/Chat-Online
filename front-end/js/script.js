async function loadMessages() {
  try {
    const messages = await getMessages();
    if (Array.isArray(messages)) {
      chatMessages.innerHTML = '';
      messages.reverse().forEach(msg => {
        // Render each message here
        // Example:
        const msgDiv = document.createElement('div');
        msgDiv.textContent = `${msg.name}: ${msg.message}`;
        chatMessages.appendChild(msgDiv);
      });
    }
    // If messages is not an array, do nothing (don't clear chat)
  } catch (err) {
    // Optionally show an error, but don't clear chatMessages
    console.error("Failed to load messages:", err);
  }
}

// Increase the refresh interval to reduce flickering
setInterval(loadMessages, 3000);