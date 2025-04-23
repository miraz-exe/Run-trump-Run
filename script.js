const trump = document.getElementById('trump');
const thakur = document.getElementById('thakur');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const caughtGif = document.getElementById('caughtGif');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const jumpSound = document.getElementById('jumpSound');
const startSound = document.getElementById('startSound');
const caughtSound = document.getElementById('caughtSound');
const fightSound = document.getElementById('fightSound');
const backgroundMusic = document.getElementById('backgroundMusic');

let isGameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

startBtn.addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
  startGame();
});

restartBtn.addEventListener('click', () => {
  location.reload(); // simple reset
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isGameOver && !document.getElementById('start-screen').style.display !== 'none') {
    jump();
  }
});


document.addEventListener('touchstart', function(e) {
  if (e.target.id !== 'start-btn' && !isGameOver) {
    jump();
  }
});


function startGame() {
  score = 0;
  isGameOver = false;
  updateScore();
  startSound.play();
  backgroundMusic.play();
  spawnObstacle();
  movethakur();
  updateScoreLoop();
}

function jump() {
  if (trump.classList.contains('jump') || isGameOver) return;
  trump.classList.add('jump');
  jumpSound.play();

  setTimeout(() => {
    trump.classList.remove('jump');
  }, 1000);
}

function updateScore() {
  scoreDisplay.innerText = `স্কোর: ${score} | সর্বোচ্চ স্কোর: ${highScore}`;
}

function updateScoreLoop() {
  if (isGameOver) return;
  score++;
  updateScore();
  setTimeout(updateScoreLoop, 100);
}

function spawnObstacle() {
  if (isGameOver) return;

  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  let pos = gameContainer.offsetWidth;
  obstacle.style.left = pos + 'px';
  gameContainer.appendChild(obstacle);

  const interval = setInterval(() => {
    if (isGameOver) {
      clearInterval(interval);
      obstacle.remove();
      return;
    }

    pos -= 8;
    obstacle.style.left = pos + 'px';

    if (checkCollision(obstacle)) {
      endGame();
      clearInterval(interval);
    }

    if (pos < -60) {
      obstacle.remove();
      clearInterval(interval);
    }
  }, 20);

  setTimeout(spawnObstacle, Math.random() * 1500 + 1000);
}


function checkCollision(el) {
  const trumpRect = trump.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  return !(
    trumpRect.top > elRect.bottom ||
    trumpRect.bottom < elRect.top ||
    trumpRect.right < elRect.left ||
    trumpRect.left > elRect.right
  );
}

function movethakur() {
  let left = 0;
  const interval = setInterval(() => {
    if (isGameOver) {
      if (left < 18) {
        left += 5;
        thakur.style.left = left + 'vw';
      } else {
        caughtGif.style.display = 'block';
        thakur.style.display = 'none';
        trump.style.display = 'none';
        caughtSound.play();
        fightSound.play();
        clearInterval(interval);
      }
    } else {
      if (left < 10) {
        left += 1;
        thakur.style.left = left + 'vw';
      }
    }
  }, 30);
}

function endGame() {
  isGameOver = true;
  backgroundMusic.play(); // BGM continues playing
  gameOverScreen.style.display = 'block';
  clearObstacles(); // Clear obstacles when the game is over
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
}

function clearObstacles() {
  const obstacles = document.querySelectorAll('.obstacle');
  obstacles.forEach((obstacle) => obstacle.remove());
}
