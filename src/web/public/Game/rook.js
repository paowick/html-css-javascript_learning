import { pieces } from "./piece.js";
export class rook extends pieces {
    html() {
        if (this.team == "B") {
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("rookBlack");
            newimg.src = "../assets/component/svg/rook-black.svg"
            newDiv.appendChild(newimg)
            return newDiv
        } else if (this.team == "W") {
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("rookWhite");
            newimg.src = "../assets/component/svg/rook-white.svg"
            newDiv.appendChild(newimg)
            return newDiv
        }else{
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("rookGray");
            newDiv.classList.add("auctionPiece");
            newimg.src = "../assets/component/svg/rook-gray.svg"
            newDiv.appendChild(newimg)
            return newDiv
        }
    }
    setPiece() {
        if (this.team == "B") {
            if (this.board[this.pos[0]][this.pos[1]] != null && this.board[this.pos[0]][this.pos[1]].name == "king") {
                win("B")
            }
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                const newDiv = document.createElement("div");
                const newimg = document.createElement("img");
                newDiv.classList.add("boxpiece");
                newDiv.classList.add("rookBlack");
                newimg.src = "../assets/component/svg/rook-black.svg"
                newDiv.appendChild(newimg)
                element.appendChild(newDiv)
            });
        }
        if (this.team == "W") {
            if (this.board[this.pos[0]][this.pos[1]] != null && this.board[this.pos[0]][this.pos[1]].name == "king") {
                win("W")
            }
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                const newDiv = document.createElement("div");
                const newimg = document.createElement("img");
                newDiv.classList.add("boxpiece");
                newDiv.classList.add("rookWhite");
                newimg.src = "../assets/component/svg/rook-white.svg"
                newDiv.appendChild(newimg)
                element.appendChild(newDiv)
            });
        }
    }
    moveAblepos(board) {
        const result = []
        const filterResult = []
        const row = parseInt(this.pos[1])
        const col = parseInt(this.pos[0])
        this.recur_top(result, row, col, board)
        this.recur_buttom(result, row, col, board)
        this.recur_right(result, row, col, board)
        this.recur_left(result, row, col, board)
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            if (board[element[0]][element[1]] != null && board[element[0]][element[1]].team == this.team) { continue }
            filterResult.push(element)
        }
        return filterResult
    }

}