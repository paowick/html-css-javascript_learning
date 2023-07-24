import { io } from "socket.io-client";

const socket = io("ws://socket:8080", {})

import redis from "redis"
const redisClient = redis.createClient({
    socket: {
        host: 'gameredis',
        port: '6379'
    }
});

await redisClient.connect()


export async function createRoom(id,name) {
    const room = generateString(5)
    const data = {
        id:id,
        name:name,
        room:room
    }
    socket.emit('createRoom',data);
    return room
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let temp = []
function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if(temp.includes(result)){generateString(5)}
    temp.push(result)
    return result
}

export async function getallRoom() {
    const data = await redisClient.keys('*')
    let result = []
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const res = await redisClient.get(`${element}`)
        result.push(res)
    }
    return result
}

export async function getboardInfo(key) {
    try {
        const res = await redisClient.get(key)
        const info = await JSON.parse(res)
        return info.board
        
    } catch (error) {
        throw new Error
    }
}