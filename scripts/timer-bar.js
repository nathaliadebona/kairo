const baseTitle = document.title;
const isTimerPage = document.getElementById('timer-running') !== null;

const timerBar = document.createElement('div');
timerBar.id = 'timer-bar';
timerBar.innerHTML = `
    <i class="fa-solid fa-stopwatch"></i>
    <span id="timer-bar-time">00:00:00</span>
    <button type="button" id="timer-bar-stop">Parar</button>
`;
document.body.appendChild(timerBar);

const timerBarTime = document.getElementById('timer-bar-time');
const timerBarStop = document.getElementById('timer-bar-stop');

function updateTimerBar() {
    const savedEntry = getActiveEntry();

    if (!savedEntry) {
        timerBar.style.display = 'none';
        document.title = baseTitle;
        return;
    }

    const time = formatDuration(Date.now() - savedEntry.startTime);

    timerBarTime.textContent = time;
    document.title = `${time} · ${baseTitle}`;
    timerBar.style.display = isTimerPage ? 'none' : 'flex';
}

timerBarStop.addEventListener('click', () => {
    stopActiveTimer();
    updateTimerBar();
});

updateTimerBar();
setInterval(updateTimerBar, 1000);
