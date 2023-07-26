const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio("../assets/Snake_Game_Food.mp3")

const size = 30

let snake = [
    { x: 270, y: 240 },
]

const incrementScore = () => {
    score.innerHTML = +score.innerHTML + 10
}

const randowNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}
const randowPosition = () => {
    const number = randowNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const food = {
    x: randowPosition(),
    y: randowPosition(),
    color: "#F0FF42"

}

let direction, loopId

const drawFood = () => {

    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = food.color
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#379237"

    snake.forEach((positionSnake, index) => {

        if (index == snake.length - 1) {
            ctx.fillStyle = "#82CD47"
        }

        ctx.fillRect(positionSnake.x, positionSnake.y, size, size)
    })
}

const moveSnake = () => {
    if (!direction) return
    const head = snake.at(-1)

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }
    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }

}
const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()
        let x = randowPosition()
        let y = randowPosition()


        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randowPosition()
            y = randowPosition()
        }


        food.x = x
        food.y = y

    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(10px)"
}

drawGrid()

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 100)
}
gameLoop()

document.addEventListener("keydown", ({ key }) => {

    if ((key == "ArrowRight" || key == "d") && direction != "left") {
        direction = "right"
    }
    if ((key == "ArrowLeft" || key == "a") && direction != "right") {
        direction = "left"
    }
    if ((key == "ArrowDown" || key == "s") && direction != "up") {
        direction = "down"
    }
    if ((key == "ArrowUp" || key == "w") && direction != "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerHTML = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    snake = [
        { x: 270, y: 240 },
    ]
})

