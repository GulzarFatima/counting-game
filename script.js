const ballArea = document.getElementById("ballArea");
const optionsContainer = document.getElementById("options");
const timerDisplay = document.getElementById("timer");
const resultDisplay = document.getElementById("result");
const toggleBtn = document.getElementById("toggleBtn");


const scoreDisplay = document.getElementById("score");
const totalDisplay = document.getElementById("total");
const strikesDisplay = document.getElementById("strikes");

let correctAnswer = 0;
let timer = null;
let gameActive = false;
let score = 0;
let total = 0;

let minBalls = 3;
let maxBalls = 5;
const MAX_CAP = 25;

let wrongAttempts = 0;
const MAX_WRONG = 3;

function startGame() {
  resetGame();
  gameActive = true;

  correctAnswer = Math.floor(Math.random() * (maxBalls - minBalls + 1)) + minBalls;

  const COLORS = [
    "#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#fd79a8", "#e67e22"
  ];

  for (let i = 0; i < correctAnswer; i++) {
    const ball = document.createElement("div");
    ball.className = "ball";
    ball.style.left = `${30 + i * 40}px`;

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    ball.style.background = `radial-gradient(circle at 30% 30%, ${color}, #00000033)`;

    ball.style.animationDelay = `${i * 0.1}s`;
    ballArea.appendChild(ball);
  }

  setTimeout(() => {
    if (!gameActive) return;
    showOptions();
    startTimer();
  }, 1200 + correctAnswer * 100);
}

function showOptions() {
  const options = generateOptions(correctAnswer);
  optionsContainer.innerHTML = "";
  resultDisplay.textContent = "";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt);
    optionsContainer.appendChild(btn);
  });
}

function updateStrikes() {
  strikesDisplay.textContent = `${wrongAttempts}`;
}

function generateOptions(correct) {
  let options = new Set([correct]);
  while (options.size < 3) {
    const rand = correct + Math.floor(Math.random() * 5) - 2;
    if (rand > 0) options.add(rand);
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}

function handleAnswer(selected) {
    if (!gameActive) return;
  
    clearInterval(timer);
    gameActive = false;
    total++;
  
    if (selected === correctAnswer) {
      score++;
  
      const shouldLevelUp = maxBalls < MAX_CAP;
      if (shouldLevelUp) {
        minBalls = Math.min(minBalls + 1, MAX_CAP - 2);
        maxBalls = Math.min(maxBalls + 2, MAX_CAP);
  
        if (total % 10 === 0) {
          showLevelUp();
        }
      }
  
      resultDisplay.textContent = "✅ Correct!";
      resultDisplay.style.color = "green";
    } else {
      wrongAttempts++;
      updateStrikes();
  
      if (wrongAttempts >= MAX_WRONG) {
        resultDisplay.textContent = `❌ Game Over. It was ${correctAnswer}`;
        resultDisplay.style.color = "red";
        showGameOver();
        return;
      }
  
      resultDisplay.textContent = `❌ Wrong. It was ${correctAnswer}`;
      resultDisplay.style.color = "red";
    }
  
    updateScore();
  
    setTimeout(() => {
      if (wrongAttempts < MAX_WRONG) {
        startGame(); // Only continue if game is not over
      }
    }, 1500);
  }
  

function showLevelUp() {
  const levelUp = document.getElementById("levelUp");
  if (!levelUp) return;

  levelUp.classList.remove("hidden");
  levelUp.classList.add("show");

  setTimeout(() => {
    levelUp.classList.remove("show");
    levelUp.classList.add("hidden");
  }, 1000);
}

function showGameOver() {
  gameActive = false;
  clearInterval(timer);
  const gameOver = document.getElementById("gameOver");
  const finalScore = document.getElementById("finalScore");

  if (gameOver && finalScore) {
    gameOver.classList.remove("hidden");
    finalScore.textContent = score;
  }

  toggleBtn.textContent = "Start Game";
}

function restartGame() {
    score = 0;
    total = 0;
    wrongAttempts = 0;
    minBalls = 3;
    maxBalls = 5;
    updateScore();
    updateStrikes();
  
    const gameOver = document.getElementById("gameOver");
    if (gameOver) gameOver.classList.add("hidden");
  
    toggleBtn.textContent = "Stop Game";
    gameActive = true;
    startGame();
  }
  

function startTimer() {
  let time = 5;
  timerDisplay.textContent = time;
  timer = setInterval(() => {
    time--;
    timerDisplay.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      handleAnswer(null);
    }
  }, 1000);
}

function stopGame() {
    gameActive = false;
    clearInterval(timer);
    resetGame();
    resultDisplay.textContent = "⏹️ Game stopped.";
    resultDisplay.style.color = "gray";
    toggleBtn.textContent = "Start Game";
  }
  

function resetGame() {
  clearInterval(timer);
  ballArea.innerHTML = "";
  optionsContainer.innerHTML = "";
  timerDisplay.textContent = "5";
  resultDisplay.textContent = "";
}

function updateScore() {
  scoreDisplay.textContent = score;
  totalDisplay.textContent = total;
}

toggleBtn.onclick = () => {
    if (!gameActive) {
      toggleBtn.textContent = "Stop Game";
      startGame();
    } else {
      toggleBtn.textContent = "Start Game";
      stopGame();
    }
  };
  
