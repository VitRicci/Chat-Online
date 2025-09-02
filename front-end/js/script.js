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

const user = { id: "", name: "", color: "" }

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")

    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
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

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message =
        userId == user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage
}

// Enviar mensagem
async function sendMessage(name, email, message) {
  await fetch('/api/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  });
}

// Buscar mensagens
async function getMessages() {
  const res = await fetch('/api/getMessages');
  return await res.json();
}

// Função para buscar e exibir mensagens
async function loadMessages() {
  const messagesDiv = document.querySelector('.chat__messages');
  messagesDiv.innerHTML = ''; // Limpa mensagens antigas
  const messages = await getMessages(); // Busca do backend
  messages.reverse().forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.className = msg.email === 'SeuEmail' ? 'message--self' : 'message--other';
    msgDiv.textContent = `${msg.name}: ${msg.message}`;
    messagesDiv.appendChild(msgDiv);
  });
}

// Chame loadMessages periodicamente
setInterval(loadMessages, 2000); // Atualiza a cada 2 segundos

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", async function(e) {
  e.preventDefault(); // Impede o reload da página

  const input = document.querySelector('.chat__input');
  const message = input.value.trim();
  if (!message) return;

  // Chame sua função de envio (ajuste os parâmetros conforme necessário)
  await sendMessage('SeuNome', 'SeuEmail', message);

  // Atualize a interface (exemplo simples)
  const messagesDiv = document.querySelector('.chat__messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message--self';
  msgDiv.textContent = message;
  messagesDiv.appendChild(msgDiv);

  input.value = '';
  loadMessages(); // Atualiza após enviar
});