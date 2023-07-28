export var board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
]
import * as pieces from './piece.js';
import { move } from './socket.js';
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { join } from './socket.js';

const currentGame = JSON.parse(localStorage.getItem("currentGame"))
const user = JSON.parse(localStorage.getItem("user"))
export var socket = io(window.location.origin, {
    query: {
        code: currentGame.code,
        id: user.id
    }
});
run()
async function run() {
    socket.on('board', async (arg) => {
        const info = await JSON.parse(arg.board)
        console.log(info);
        for (let index = 0; index < info.board.length; index++) {
            const elements = info.board[index];
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                if (element == null) { continue }
                if (element.name == 'king') {
                    new pieces.king("king", element.pos, element.team, true, board)
                    continue
                }
                if (element.name == 'queen') {
                    new pieces.queen("queen", element.pos, element.team, false, board)
                    continue
                }
                if (element.name == 'bishop') {
                    new pieces.bishop("bishop", element.pos, element.team, false, board)
                    continue
                }
                if (element.name == 'rook') {
                    new pieces.rook("rook", element.pos, element.team, false, board)
                    continue
                }
                if (element.name == 'knight') {
                    new pieces.knight("knight", element.pos, element.team, false, board)
                    continue
                }
                if (element.name == 'pawn') {
                    new pieces.pawn("pawn", element.pos, element.team, false, board, true)
                    continue
                }
            }
        }
        if (currentGame.role != 'viewer') {
            const join_con = document.querySelector(".join-butt-con")
            join_con.style.display = 'none'
            const inhand = document.querySelector(".inhand")
            inhand.style.display = 'none'
            if (currentGame.role == "B") {
                const board_white = document.querySelector('#board-white')
                board_white.style.display = "none"
                const board_black = document.querySelector('#board-black')
                board_black.style.display = 'flex'
            } else {
                const board_white = document.querySelector('#board-white')
                board_white.style.display = "flex"
                const board_black = document.querySelector('#board-black')
                board_black.style.display = 'none'
            }
        }
        localStorage.setItem("board", stringify(board))
        // const data = JSON.parse(localStorage.getItem("board"))
        // console.log(data);
    })

}


// White_King	  = "&#9812"
// White_Queen   = "&#9813"
// White_Rook	  = "&#9814"
// White_BishopU = "&#9815"
// White_KnightU = "&#9816"
// White_Pawn	  = "&#9817"
// Black_King	  = "&#9818"
// Black_Queen	  = "&#9819"
// Black_Rook	  = "&#9820"
// Black_BishopU = "&#9821"
// Black_KnightU = "&#9822"
// Black_Pawn	  = "&#9823"

document.querySelector('#join_black')
    .addEventListener('click', () => {
        const join_con = document.querySelector(".join-butt-con")
        join_con.style.display = 'none'
        const inhand = document.querySelector(".inhand")
        inhand.style.display = 'none'
        const board_white = document.querySelector('#board-white')
        board_white.style.display = "none"
        const board_black = document.querySelector('#board-black')
        board_black.style.display = 'flex'
        const data = {
            code: currentGame.code,
            role: "B"
        }
        localStorage.setItem('currentGame', JSON.stringify(data))
        join(data)
    })
document.querySelector('#join_white')
    .addEventListener('click', () => {
        const join_con = document.querySelector(".join-butt-con")
        join_con.style.display = 'none'
        const inhand = document.querySelector(".inhand")
        inhand.style.display = 'none'
        const board_white = document.querySelector('#board-white')
        board_white.style.display = "flex"
        const board_black = document.querySelector('#board-black')
        board_black.style.display = 'none'
        const data = {
            code: currentGame.code,
            role: "W"
        }
        localStorage.setItem('currentGame', JSON.stringify(data))
        join(data)
    })
var source = null
var destination = null
document.querySelectorAll('.box')
    .forEach(div => {
        div.addEventListener('click', function () {
            const currentGame = JSON.parse(localStorage.getItem("currentGame"))
            if (currentGame.role != 'viewer') {
                if (source == null && destination == null) {
                    // source position ====================================================================
                    // if (!myTurn) { return source = null; }
                    const piece = havePiece(this.id)
                    if (piece == null) { return source = null; }
                    source = this.id;
                    showMoveAble(piece)


                } else if (source != null && destination == null) {
                    // destination position ===============================================================


                    const piece = havePiece(source)
                    if (currentGame.role != piece.team) {
                        clearHightLight(havePiece(source))
                        source = null
                        return
                    }
                    if (!pieceMoveable(piece, this.id)) {
                        clearHightLight(piece)
                        source = null
                        return destination = null
                    }
                    destination = this.id;
                    clearHightLight(havePiece(source))
                    moveClient(source, destination)
                    source = null
                    destination = null




                    // end here ===========================================================================
                }


            }
        })


    })



function moveClient(source, destination) {
    const oldpos = tranSlateTopos(source)
    const newpos = tranSlateTopos(destination)
    const piece = board[oldpos[0]][oldpos[1]];
    piece.unset()
    piece.pos = newpos
    piece.setPiece()
    if (piece.firstmove != undefined) { piece.firstmove = false }
    move(source, destination)
    destination = null
    source = null
    localStorage.setItem("board",stringify(board))
}
export function moveClient_Server(source, destination) {
    const oldpos = tranSlateTopos(source)
    const newpos = tranSlateTopos(destination)
    const piece = board[oldpos[0]][oldpos[1]];
    piece.unset()
    piece.pos = newpos
    piece.setPiece()
    if (piece.firstmove != undefined) { piece.firstmove = false }
    destination = null
    source = null
    localStorage.setItem("board",stringify(board))
}
function clearHightLight(piece) {
    const posList = piece.moveAblepos(board)
    posList.forEach(element => {
        const id = tranSlateToId(element)
        document.querySelectorAll(`#${id}`).forEach(element => {
            element.removeChild(element.lastChild)
            element.style.backgroundColor = ``

        })

    });
}

function showMoveAble(piece) {
    const posList = piece.moveAblepos(board)
    posList.forEach(element => {
        const id = tranSlateToId(element)

        document.querySelectorAll(`#${id}`).forEach(element => {

            if (element.childNodes.length > 0) {

                element.style.backgroundColor = `rgba(255, 0, 0,0.5)`
                element.innerHTML += `<div></div>`
                return 0
            }
            element.innerHTML += `<div class="hight-light">&#9900</div>`
        })
    });
}

function pieceMoveable(piece, source) {
    if (!piece.moveAblepos(board).includes(tranSlateTopos(source))) {
        return false
    }
    return true
}

function havePiece(id) {
    const pos = tranSlateTopos(id)
    const piece = board[pos[0]][pos[1]];
    return piece
}


function stringify(obj) {
    let cache = [];
    let str = JSON.stringify(obj, function (key, value) {
        if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // reset the cache
    return str;
}
function tranSlateTopos(id) {
    var temp = ""
    switch (`${id[1]}`) {
        case "8":
            temp += "0"
            break;

        case "7":
            temp += "1"
            break;

        case "6":
            temp += "2"
            break;

        case "5":
            temp += "3"
            break;

        case "4":
            temp += "4"
            break;

        case "3":
            temp += "5"
            break;

        case "2":
            temp += "6"
            break;

        case "1":
            temp += "7"
            break;
    }
    switch (`${id[0]}`) {
        case "a":
            temp += "0"
            break;

        case "b":
            temp += "1"
            break;

        case "c":
            temp += "2"
            break;

        case "d":
            temp += "3"
            break;

        case "e":
            temp += "4"
            break;

        case "f":
            temp += "5"
            break;

        case "g":
            temp += "6"
            break;

        case "h":
            temp += "7"
            break;
    }
    return temp
}


function tranSlateToId(pos) {
    var temp = ""
    switch (`${pos[1]}`) {
        case "0":
            temp += "a"
            break;

        case "1":
            temp += "b"
            break;

        case "2":
            temp += "c"
            break;

        case "3":
            temp += "d"
            break;

        case "4":
            temp += "e"
            break;

        case "5":
            temp += "f"
            break;

        case "6":
            temp += "g"
            break;

        case "7":
            temp += "h"
            break;
    }
    switch (`${pos[0]}`) {
        case "0":
            temp += "8"
            break;

        case "1":
            temp += "7"
            break;

        case "2":
            temp += "6"
            break;

        case "3":
            temp += "5"
            break;

        case "4":
            temp += "4"
            break;

        case "5":
            temp += "3"
            break;

        case "6":
            temp += "2"
            break;

        case "7":
            temp += "1"
            break;
    }
    return temp;
}