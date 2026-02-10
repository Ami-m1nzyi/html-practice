
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