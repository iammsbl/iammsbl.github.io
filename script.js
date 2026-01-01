const game = document.getElementById('game');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const bestEl = document.getElementById('best');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

let score = 0;
let timeLeft = 30; // game duration
let timerId = null;
let moveInterval = null;
let dot = null;

const BEST_KEY = 'catch-the-dot-best';
let best = Number(localStorage.getItem(BEST_KEY) || 0);
bestEl.textContent = best;

// logic to show/hide sections
function hideSections() {
    const sections = document.querySelectorAll('.info-section');
    sections.forEach(s => s.style.display = 'none');
}

function showSection(id) {
    hideSections();
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

// game functions
function createDot() {
    const d = document.createElement('div');
    d.className = 'dot';
    d.textContent = '🔥';
    d.style.background = 'radial-gradient(circle at 30% 30%, #ffedd5, #fb923c)';
    d.style.boxShadow = '0 6px 18px rgba(251,146,60,0.25)';

    d.addEventListener('click', () => {
        if (!timerId) return;
        score++;
        scoreEl.textContent = score;
        d.style.transform = 'scale(0.9)';
        setTimeout(() => d.style.transform = '', 80);
        moveDot();
    });

    d.addEventListener('touchstart', e => { e.preventDefault(); d.click(); });
    return d;
}

function placeDotAtCenter() {
    const rect = game.getBoundingClientRect();
    const x = (rect.width - 48) / 2;
    const y = (rect.height - 48) / 2;
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
}

function moveDot() {
    if (!dot) return;
    const rect = game.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();
    const maxW = rect.width - dotRect.width;
    const maxH = rect.height - dotRect.height;
    const padding = 8;
    const x = Math.max(padding, Math.random() * (Math.max(0, maxW - padding)));
    const y = Math.max(padding, Math.random() * (Math.max(0, maxH - padding)));

    dot.style.transition = 'left 0.25s ease, top 0.25s ease, transform 0.15s ease';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';

    const scale = 0.9 + Math.random() * 0.4;
    dot.style.fontSize = (12 + Math.random() * 8) + 'px';
    dot.style.transform = 'scale(' + scale + ')';
}

startBtn.addEventListener('click', () => {
    if (timerId) return;
    startGame();
});

resetBtn.addEventListener('click', () => {
    if (confirm('Reset best score?')) {
        localStorage.removeItem(BEST_KEY);
        best = 0;
        bestEl.textContent = best;
    }
});

function startGame() {
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    startBtn.textContent = 'Playing...';
    startBtn.disabled = true;

    hideSections();
    if (!dot) {
        dot = createDot();
        game.appendChild(dot);
        placeDotAtCenter();
    }

    moveDot();
    moveInterval = setInterval(moveDot, 900);

    timerId = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerId);
    timerId = null;
    clearInterval(moveInterval);
    moveInterval = null;
    startBtn.textContent = 'Start Game';
    startBtn.disabled = false;

    if (score > best) {
        best = score;
        localStorage.setItem(BEST_KEY, String(best));
        bestEl.textContent = best;
        alert(`Time up! 🎉 New best: ${best} (Score: ${score})`);
    } else {
        alert(`Time up! Your score: ${score}\nBest: ${best}`);
    }
}

window.addEventListener('resize', () => { if (dot) moveDot(); });

window.addEventListener('keydown', e => { if (e.code === 'Space' && timerId) { e.preventDefault(); dot.click(); }});
