const Game = {
  settings: {
    musicUrl: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3',
    defaultTime: 30,
    maxNumber: 100,
  },
  state: {
    randomNumber: null,
    attempts: 0,
    timeLeft: 0,
    timerId: null,
    highestScore: Infinity,
    hintUsed: false,
  },

  init() {
    // cache DOM
    this.$guess   = document.getElementById('guessInput');
    this.$result  = document.getElementById('result');
    this.$hint    = document.getElementById('hint');
    this.$progress= document.getElementById('progress');
    this.$difficulty = document.getElementById('difficulty');
    this.$buttons = document.querySelectorAll('button');
    this.$playAgain = document.getElementById('playAgainBtn');

    // load high score
    const hs = localStorage.getItem('highestScore');
    if (hs) this.state.highestScore = Number(hs);

    // setup music
    this.bgMusic = new Audio(this.settings.musicUrl);
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3;

    // bind events
    this.$difficulty.addEventListener('change', () => this.reset());
    this.$playAgain.addEventListener('click', () => this.reset());
    document.getElementById('guessBtn')
      .addEventListener('click', () => this.checkGuess());
    document.getElementById('hintBtn')
      .addEventListener('click', () => this.giveHint());
    document.getElementById('resetBtn')
      .addEventListener('click', () => this.reset());
    document.getElementById('musicBtn')
      .addEventListener('click', () => this.toggleMusic());

    // start game
    this.reset();
  },

  startTimer() {
    this.state.timerId = setInterval(() => {
      this.state.timeLeft--;
      const pct = this.state.timeLeft / Number(this.$difficulty.value) * 100;
      this.$progress.style.width = pct + '%';

      if (this.state.timeLeft <= 0) {
        this.endGame(false, '⏰ Time up! You lost.');
      }
    }, 1000);
  },

  endGame(won, msg) {
    clearInterval(this.state.timerId);
    this.$result.textContent = msg;
    this.$guess.disabled = true;
    this.$buttons.forEach(btn => btn.disabled = true);
    this.$playAgain.style.display = 'inline-block';
    this.$playAgain.disabled = false;

    // save high score
    if (won && this.state.attempts < this.state.highestScore) {
      this.state.highestScore = this.state.attempts;
      localStorage.setItem('highestScore', this.state.highestScore);
      this.$result.textContent += ' 🎉 New high score!';
    }
  },

  checkGuess() {
    const guess = Number(this.$guess.value);
    if (!guess) return; // ignore empty

    this.state.attempts++;
    if (guess === this.state.randomNumber) {
      this.endGame(true, `💖👏 You won in ${this.state.attempts} attempts!`);
    } else {
      this.$result.textContent =
        guess < this.state.randomNumber ? '📉 Too low!' : '📈 Too high!';
    }
  },

  giveHint() {
    if (this.state.hintUsed) {
      this.$hint.textContent = "😔 You've already used your hint!";
      return;
    }

    const n = this.state.randomNumber;
    let msg = n % 2 === 0 ? '❔ Even number.' : '❔ Odd number.';
    if (n % 5 === 0) msg += ' Multiple of 5.';
    else if (n % 3 === 0) msg += ' Multiple of 3.';

    const delta = 10;
    const lo = Math.max(1, n - Math.floor(Math.random()*delta));
    const hi = Math.min(this.settings.maxNumber, n + Math.floor(Math.random()*delta));
    msg += ` Between ${lo} and ${hi}.`;

    this.$hint.textContent = msg;
    this.state.hintUsed = true;
  },

  reset() {
    clearInterval(this.state.timerId);
    this.state.randomNumber = Math.ceil(Math.random()*this.settings.maxNumber);
    this.state.attempts = 0;
    this.state.timeLeft = Number(this.$difficulty.value) || this.settings.defaultTime;
    this.state.hintUsed = false;

    this.$guess.value = '';
    this.$guess.disabled = false;
    this.$buttons.forEach(btn => btn.disabled = false);
    this.$result.textContent = '🔄 Game reset! Try again.';
    this.$hint.textContent = '';
    this.$progress.style.width = '100%';
    this.$playAgain.style.display = 'none';

    this.startTimer();
  },

  toggleMusic() {
    this.bgMusic.paused ? this.bgMusic.play() : this.bgMusic.pause();
  }
};

document.addEventListener('DOMContentLoaded', () => Game.init());
