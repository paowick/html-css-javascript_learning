import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const user = JSON.parse(localStorage.getItem('user'))
export var socket = io(window.location.origin, {
    path: "/chat/",
    query: {
        code: null,
        id: user.id
    }
});

window.onload = load()
function load() {
    socket.on("chatInit", async (arg) => {
        arg.chat.forEach(element => {
            const msg = JSON.parse(element)
            msgUpdate(msg)
        });
    })
}

socket.on('msgGlobal', async (arg) => {
    msgUpdate(arg)
})

document.querySelector("#send-button")
    .addEventListener("click", () => {
        msgGlobal()
    })
document.querySelector('#message-input')
    .addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            msgGlobal()
        }
    });

export function msgGlobal() {
    const user = JSON.parse(localStorage.getItem('user'))
    const msg = document.querySelector("#message-input").value
    if (msg == "") { return }
    const data = {
        senderID: user.id,
        sender: user.name,
        msg: msg
    }
    socket.emit("msgGlobal", data)
    document.querySelector("#message-input").value = ''
}

export function msgUpdate(arg) {
    const user = JSON.parse(localStorage.getItem('user'))
    let html = `
            <div id="msg"> ${arg.sender}: ${arg.msg}</div>
    `
    if (user.id == arg.senderID) {
        html = `
            <div id="My-msg"> ${arg.sender}: ${arg.msg}</div>
        `
    }
    const htmldom = new DOMParser().parseFromString(html, 'text/xml').documentElement
    let doc = document.querySelector("#chat-room-con")
    doc.appendChild(htmldom)
    doc.scrollTop = doc.scrollHeight
}