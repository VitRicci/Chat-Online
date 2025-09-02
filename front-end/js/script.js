// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: "", email: "" }

// Funções de criação de mensagens
const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    div.classList.add("message--self")
    div.textContent = content
    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")
    div.classList.add("message--other")
    span.classList.add("message--sender")
    span.style.color = senderColor
    span.textContent = sender
    div.appendChild(span)
    div.innerHTML += content
    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

// Enviar mensagem
async function sendMessage(name, email, message) {
  await fetch('/.netlify/functions/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  });
}

// Buscar mensagens
async function getMessages() {
  const res = await fetch('/.netlify/functions/getMessages');
  return await res.json();
}

// Função para buscar e exibir mensagens
async function loadMessages() {
  chatMessages.innerHTML = '';
  const messages = await getMessages();
  if (Array.isArray(messages)) {
    messages.reverse().forEach(msg => {
      const msgDiv = msg.email === user.email
        ? createMessageSelfElement(msg.message)
        : createMessageOtherElement(msg.message, msg.name, msg.color || "gray");
      chatMessages.appendChild(msgDiv);
    });
    scrollScreen();
  }
}

// Atualiza a cada 2 segundos
setInterval(loadMessages, 2000);

// Login
loginForm.addEventListener("submit", function(event) {
    event.preventDefault()
    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.email = user.name + "@chat.com" // ou peça um campo de email no login
    user.color = getRandomColor()
    login.style.display = "none"
    chat.style.display = "flex"
    loadMessages()
})

// Envio de mensagem
chatForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  await sendMessage(user.name, user.email, message);
  chatInput.value = '';
  loadMessages();
});