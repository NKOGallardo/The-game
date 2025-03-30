  /* Sound */
  const bgMusic = new Audio('https://www.bensound.com/bensound-music/bensound-slowmotion.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.3;

  function toggleMusic() {
      if (bgMusic.paused) {
          bgMusic.play();
      } else {
          bgMusic.pause();
      }
  }

  let randomNumber = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;
  let timeLeft = 30;
  let timerInterval = setInterval(updateTimer, 1000);
  let highestScore = localStorage.getItem('highestScore') || Infinity;
  let hintUsed = false;

  function updateTimer() {
      timeLeft--;
      const progressWidth = (timeLeft / Number(document.getElementById('difficulty').value)) * 100;
      document.getElementById('progress').style.width = `${progressWidth}%`;

      if (timeLeft <= 0) {
          clearInterval(timerInterval);
          document.getElementById('result').innerText = 'Time ⏰ up! You lost.';
          document.getElementById('guessInput').disabled = true;
          document.querySelectorAll('button').forEach(btn => btn.disabled = true);
      }
  }

  function checkGuess() {
      const guess = Number(document.getElementById('guessInput').value);
      attempts++;

      if (guess === randomNumber) {
          clearInterval(timerInterval);
          document.getElementById('result').innerText = `💖👏You won in ${attempts} attempts!`;

          if (attempts < highestScore) {
              highestScore = attempts;
              localStorage.setItem('highestScore', highestScore);
              document.getElementById('result').innerText += ' New high score!';
          }
      } else {
          document.getElementById('result').innerText = guess < randomNumber ? '📉Too low!' : '📈Too high!';
      }
  }

  function resetGame() {
      randomNumber = Math.floor(Math.random() * 100) + 1;
      attempts = 0;
      timeLeft = Number(document.getElementById('difficulty').value);
      clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, 1000);
      document.getElementById('guessInput').value = '';
      document.getElementById('guessInput').disabled = false;
      document.querySelectorAll('button').forEach(btn => btn.disabled = false);
      document.getElementById('result').innerText = 'Game reset! Try again.';
      document.getElementById('progress').style.width = '100%';
      document.getElementById('hint').innerText = '';
      hintUsed = false;
  }

  function giveHint() {
      if (hintUsed) {
          document.getElementById('hint').innerText = "(┬┬﹏┬┬) You've already used your hint!";
          return;
      }

      let hintMessage = "❔Hint: ";
      if (randomNumber % 2 === 0) {
          hintMessage += "It's an EVEN number.";
      } else {
          hintMessage += "It's an ODD number.";
      }

      if (randomNumber % 5 === 0) {
          hintMessage += " It's a multiple of 5.";
      } else if (randomNumber % 3 === 0) {
          hintMessage += " It's a multiple of 3.";
      }

      let hintMin = randomNumber - Math.floor(Math.random() * 10);
      let hintMax = randomNumber + Math.floor(Math.random() * 10);
      hintMessage += ` It's between ${hintMin} and ${hintMax}.`;

      document.getElementById('hint').innerText = hintMessage;
      hintUsed = true;
  }