const userId = generateUniqSerial()
let input = document.getElementById('chat')
let button = document.getElementById('btn')
let conn = connect()
let chatContainer = document.getElementById('chat-container')

const style = (node, styles) => Object.keys(styles).forEach(key => node.style[key] = styles[key])

function generateUniqSerial() {
  return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, () => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(16);
  });
}

function connect() {
  let connection = new WebSocket(`ws://localhost:8080/subscriptions/${userId}/party`)
  connection.onopen = (event) => {
    console.log(event.data)
  }
  connection.onmessage = (event) => {
    const x = {
      className: "bubble",
      content: event.data
    }
    chatContainer.appendChild(createChatBubble(x))
  }
  connection.onerror = (event) => {
    console.log(event, "Error")
  }
  return connection
}

button.addEventListener('click', () => {
  conn.send(JSON.stringify({ "clientId": userId, "message": input.value }))
  input.value = ""
})

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    conn.send(JSON.stringify({ "clientId": userId, "message": input.value }))
    input.value = ""
  }
})

function htmlToElement(html) {
  return new DOMParser()
    .parseFromString(html.trim(), "text/html")
    .body
    .firstElementChild
}


function createChatBubble({ className, content }) {
  const data = JSON.parse(content);
  const sent = data.clientId == userId
  const div = `<div>
     <div class="${className} ${!sent ? "darker" : ""}">
       <p>${data.message}</p>
       <span>${new Date().getHours()}:${new Date().getMinutes()}</span>
    </div>
  </div>`
  const node = htmlToElement(div)
  const styles = {
    display: 'flex',
    justifyContent: sent ? 'end' : 'start'
  }
  style(node, styles)
  return node
}
