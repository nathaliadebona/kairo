const timerClient = document.getElementById('timer-client');
const timerProject = document.getElementById('timer-project');
const timerRunning = document.getElementById('timer-running');
const timerDisplay = document.getElementById('timer-display');
const stopBtn = document.getElementById('stop-btn');
const timerForm = document.querySelector('#timer form');

let activeEntry = null;
let intervalId = null;

function renderClientOptions() {
    timerClient.length = 1;
    const clients = getClients();

    clients.forEach((client) => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.companyName || client.contactName;

        timerClient.appendChild(option);
    });
}

timerClient.addEventListener('change', () => {
    const clientId = Number(timerClient.value);
    timerProject.length = 1;
    const projectsByClient = getProjectsByClientId(clientId);

    projectsByClient.forEach((project) => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        timerProject.disabled = false;

        timerProject.appendChild(option);
    });
});

timerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const timerDescription = document.getElementById('timer-description').value;
    const timerTags = document.getElementById('timer-tags').value;

    activeEntry = {
        startTime: Date.now(),
        clientId: Number(timerClient.value),
        projectId: Number(timerProject.value),
        description: timerDescription,
        tag: timerTags
    };

    timerRunning.style.display = 'block';
    timerForm.style.display = 'none';

    intervalId = setInterval(() => {
        const elapsed = Date.now() - activeEntry.startTime;
        const totalSeconds = Math.floor(elapsed / 1000);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
});

stopBtn.addEventListener('click', () => {
    clearInterval(intervalId);

    const endTime = Date.now();
    const duration = endTime - activeEntry.startTime;
    const clientProjects = getClientProjects();
    const link = clientProjects.find((cp) => {
        return cp.clientId === activeEntry.clientId && cp.projectId === activeEntry.projectId;
    });

    const newTimeEntry = {
        id: Date.now(),
        clientProjectId: link.id,
        startTime: activeEntry.startTime,
        endTime: endTime,
        duration: duration,
        description: activeEntry.description,
        tag: activeEntry.tag,
        billable: true,
    };

    const timeEntries = getTimeEntries();
    timeEntries.push(newTimeEntry);
    saveTimeEntries(timeEntries);

    timerRunning.style.display = 'none';
    timerForm.style.display = '';
    timerForm.reset();
    activeEntry = null;
});

renderClientOptions();