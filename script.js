const data = [
  {
    className: "container",
    imgPath: "",
    content: "Hello. How are you today?",
  },
  {
    className: "container darker",
    imgPath: "",
    content: "Hey! I'm fine. Thanks for asking!",
  },
  {
    className: "container",
    imgPath: "",
    content: "Sweet! So, what do you wanna do today?",
  },
  {
    className: "container darker",
    imgPath: "",
    content: "Nah, I dunno. Play soccer.. or learn more coding perhaps?",
  },
]

function generateUniqSerial() {  
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, () => {  
        const r = Math.floor(Math.random() * 16);  
        return r.toString(16);  
  });  
}

const userId = generateUniqSerial()
console.log(userId)

function connect() {
  let connection = new WebSocket(`ws://localhost:8080/subscriptions/${userId}/party`)
  connection.onopen = (event) => {
    console.log(event.data)
  }
  connection.onmessage = (event) => {
    const x = {
      className: "container",
      imgPath: "",
      content: event.data
    }
    chatContainer.appendChild(htmlToElement(createChatContainer(x)))
    console.log(event.data)
  }
  connection.onerror = (event) => {
    console.log(event, "Error")
  }
  return connection
}

let input = document.getElementById('chat')
let button = document.getElementById('btn')
let conn = connect()
let chatContainer = document.getElementById('chat-container')
chatContainer.innerHTML = data.map(createChatContainer).join(" ")

button.addEventListener('click', () => {
  conn.send(input.value)
  input.value = ""
})

window.addEventListener('beforeunload', () => {
  // conn.close(0, 'client closed')
  fetch(`http://localhost:8080/ws/${userId}/party`)
})

function htmlToElement(html) {
  return new DOMParser()
    .parseFromString(html.trim(), "text/html")
    .body
    .firstElementChild
}

function createChatContainer({ className, imgPath, content }) {
  return `<div class="${className}">
  <img src="${imgPath}" alt="Avatar" style="width:100%;">
  <p>${content}</p>
  <span class="time-right">11:00</span>
  </div>`;
}
