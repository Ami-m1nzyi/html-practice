
let score = 0;
let timeLeft = 30;
let timerId = null;
const highScoreKey = 'clickerHighScore';

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const highScoreDisplay = document.getElementById('high-score');
const clickBtn = document.getElementById('click-btn');


highScoreDisplay.textContent = localStorage.getItem(highScoreKey) || 0;

clickBtn.addEventListener('click', () => {
    if (score === 0 && !timerId) startTimer();
    if (timeLeft > 0) {
        score++;
        scoreDisplay.textContent = score;
        
        clickBtn.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
    }
});

function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            alert(`Игра окончена! Ваш счёт: ${score}`);
            saveHighScore();
            clickBtn.disabled = true;
        }
    }, 1000);
}

function saveHighScore() {
    const currentHigh = localStorage.getItem(highScoreKey) || 0;
    if (score > currentHigh) {
        localStorage.setItem(highScoreKey, score);
        highScoreDisplay.textContent = score;
    }
}

document.getElementById('reset-score').addEventListener('click', () => {
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    clearInterval(timerId);
    timerId = null;
    clickBtn.disabled = false;
    clickBtn.style.backgroundColor = '#007bff';
});

const heroes = ['рыцарь', 'маг', 'принцесса', 'гном-кузнец'];
const locations = ['тёмном лесу', 'заброшенном замке', 'древних руинах'];
const villains = ['драконом', 'коварным вампиром', 'ордой гоблинов'];

const advText = document.getElementById('adventure-text');
const advHistory = document.getElementById('adventure-history');

function generateAdventure() {
    const hero = heroes[Math.floor(Math.random() * heroes.length)];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const villain = villains[Math.floor(Math.random() * villains.length)];
    
    const story = `Ваш персонаж - ${hero} находится в ${loc} и сражается с ${villain}.`;
    advText.textContent = story;
    
    const timestamp = new Date().toLocaleString();
    saveAdventure(story, timestamp);
}

function saveAdventure(text, time) {
    const history = JSON.parse(localStorage.getItem('advHistory') || '[]');
    history.unshift({ text, time });
    localStorage.setItem('advHistory', JSON.stringify(history));
    updateHistoryUI();
}

function updateHistoryUI() {
    const history = JSON.parse(localStorage.getItem('advHistory') || '[]');
    advHistory.innerHTML = history.map(item => `
        <div class="history-item">
            <small>${item.time}</small><br>${item.text}
        </div>
    `).join('');
}

document.getElementById('gen-btn').addEventListener('click', generateAdventure);
document.getElementById('clear-history').addEventListener('click', () => {
    localStorage.removeItem('advHistory');
    updateHistoryUI();
});
updateHistoryUI();

let targetNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 10;

const guessInput = document.getElementById('guess-input');
const guessMsg = document.getElementById('guess-message');
const attemptsDisplay = document.getElementById('attempts-left');

document.getElementById('check-btn').addEventListener('click', () => {
    const userGuess = parseInt(guessInput.value);
    
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        guessMsg.textContent = "Введите число от 1 до 100!";
        return;
    }

    attempts--;
    attemptsDisplay.textContent = attempts;

    if (userGuess === targetNumber) {
        guessMsg.textContent = `Поздравляем! Вы угадали за ${10 - attempts} попыток!`;
        guessMsg.style.color = "green";
        saveGuessRecord(10 - attempts);
    } else if (attempts <= 0) {
        guessMsg.textContent = `Игра окончена! Было загадано ${targetNumber}`;
    } else {
        guessMsg.textContent = userGuess > targetNumber ? "Загаданное число МЕНЬШЕ" : "Загаданное число БОЛЬШЕ";
    }
});

function saveGuessRecord(score) {
    const best = localStorage.getItem('guessRecord') || 99;
    if (score < best) {
        localStorage.setItem('guessRecord', score);
        document.getElementById('guess-record').textContent = score;
    }
}

document.getElementById('new-game-btn').addEventListener('click', () => {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 10;
    attemptsDisplay.textContent = attempts;
    guessMsg.textContent = "";
    guessInput.value = "";
});







let hits = 0;
let startTime;
let totalReaction = 0;
let timer;
let appearTimeout;

const btn = document.getElementById("reactionBtn");
const area = document.getElementById("gameArea");

function startReactionGame() {
    resetReactionGame();
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").textContent = timeLeft;
        if (timeLeft <= 0) endReactionGame();
    }, 1000);
    spawnButton();
}

function spawnButton() {
    let delay = Math.random() * 4000 + 1000;
    appearTimeout = setTimeout(() => {
        let x = Math.random() * (area.clientWidth - 100);
        let y = Math.random() * (area.clientHeight - 50);
        btn.style.left = x + "px";
        btn.style.top = y + "px";
        btn.style.display = "block";
        startTime = Date.now();
    }, delay);
}

btn.onclick = () => {
    let reaction = Date.now() - startTime;
    totalReaction += reaction;
    hits++;
    document.getElementById("hits").textContent = hits;
    btn.style.display = "none";
    spawnButton();
};

function endReactionGame() {
    clearInterval(timer);
    clearTimeout(appearTimeout);
    btn.style.display = "none";
    let avg = hits ? (totalReaction / hits).toFixed(0) : 0;
    document.getElementById("reactionResult").textContent =
        `Игра окончена! Попаданий: ${hits}, Средняя реакция: ${avg} мс`;
}

function resetReactionGame() {
    clearInterval(timer);
    clearTimeout(appearTimeout);
    timeLeft = 30;
    hits = 0;
    totalReaction = 0;
    document.getElementById("time").textContent = 30;
    document.getElementById("hits").textContent = 0;
    document.getElementById("reactionResult").textContent = "";
    btn.style.display = "none";
}



let currentPlayer = "X";
let board = Array(9).fill("");
const boardDiv = document.getElementById("board");

function createBoard() {
    boardDiv.innerHTML = "";
    board.forEach((cell, index) => {
        let btn = document.createElement("button");
        btn.className = "cell";
        btn.textContent = cell;
        btn.onclick = () => makeMove(index);
        boardDiv.appendChild(btn);
    });
}

function makeMove(index) {
    if (board[index] !== "") return;
    board[index] = currentPlayer;

    if (checkWin()) {
        document.getElementById("winner").textContent =
            `Победил ${currentPlayer}!`;
        createBoard();
        return;
    }

    if (!board.includes("")) {
        document.getElementById("winner").textContent = "Ничья!";
        createBoard();
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    createBoard();
}

function checkWin() {
    const combos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    return combos.some(c =>
        board[c[0]] &&
        board[c[0]] === board[c[1]] &&
        board[c[1]] === board[c[2]]
    );
}

function resetTicTacToe() {
    board = Array(9).fill("");
    currentPlayer = "X";
    document.getElementById("winner").textContent = "";
    createBoard();
}

createBoard();


const mazeLayout = [
"##########",
"#P     #E#",
"# ###### #",
"#   #    #",
"### # ####",
"#     #  #",
"# ##### ##",
"#        #",
"##########"
];

let playerPos = {x:1,y:1};
let mazeTimer;
let mazeSeconds = 0;

function drawMaze() {
    const mazeDiv = document.getElementById("maze");
    mazeDiv.innerHTML = "";

    mazeLayout.forEach((row,y) => {
        row.split("").forEach((cell,x) => {
            let div = document.createElement("div");
            div.className = "cellMaze";

            if (cell === "#") div.classList.add("wall");
            if (cell === "E") div.classList.add("exit");
            if (x === playerPos.x && y === playerPos.y)
                div.classList.add("player");

            mazeDiv.appendChild(div);
        });
    });
}

function movePlayer(dx,dy) {
    let newX = playerPos.x + dx;
    let newY = playerPos.y + dy;

    if (mazeLayout[newY][newX] === "#") return;

    playerPos = {x:newX,y:newY};
    drawMaze();

    if (mazeLayout[newY][newX] === "E") {
        clearInterval(mazeTimer);
        alert("Вы победили!");
    }
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") movePlayer(0,-1);
    if (e.key === "ArrowDown") movePlayer(0,1);
    if (e.key === "ArrowLeft") movePlayer(-1,0);
    if (e.key === "ArrowRight") movePlayer(1,0);
});

function startMazeTimer() {
    mazeTimer = setInterval(()=>{
        mazeSeconds++;
        document.getElementById("mazeTime").textContent = mazeSeconds;
    },1000);
}

function resetMaze() {
    playerPos = {x:1,y:1};
    mazeSeconds = 0;
    document.getElementById("mazeTime").textContent = 0;
    clearInterval(mazeTimer);
    startMazeTimer();
    drawMaze();
}

resetMaze();
