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

function renderTimeEntries() {
    const timerListItems = document.getElementById('timer-list-items');
    timerListItems.innerHTML = '';
    const timeEntries = getTimeEntries();

    const todayTimeEntries = timeEntries.filter((entry) => {
        return isToday(entry.startTime);
    });

    todayTimeEntries.reverse();

    todayTimeEntries.forEach((entry) => {
        const clientProjects = getClientProjects();
        const link = clientProjects.find((cp) => {
            return cp.id === entry.clientProjectId;
        });

        if (!link) {
            return;
        }

        const client = findClientById(link.clientId);
        const project = findProjectById(link.projectId);

        const durationFormatted = formatDuration(entry.duration);
        const startFormatted = formatTime(entry.startTime);
        const endFormatted = formatTime(entry.endTime);
    
        const timeEntryCard = document.createElement('div');
        timeEntryCard.className = 'time-entry-card';
        timeEntryCard.style.borderLeftColor = project.color;
       timeEntryCard.innerHTML = `
            <div class="time-entry-info">
                <p class="time-entry-client">${client.companyName || client.contactName}</p>
                <p class="time-entry-project">${project.name}</p>
                <p class="time-entry-description">${entry.description}</p>
            </div>
            <div class="time-entry-actions">
                <div class="time-entry-time">
                    <p class="time-entry-duration">${durationFormatted}</p>
                    <p class="time-entry-period">${startFormatted} – ${endFormatted}</p>
                </div>
                <i class="fa-solid fa-trash time-entry-delete-icon"></i>
            </div>
        `;

        timerListItems.appendChild(timeEntryCard);

        const deleteIcon = timeEntryCard.querySelector('.time-entry-delete-icon');
        deleteIcon.addEventListener('click', () => {
            const confirmed = confirm('Tem certeza que deseja excluir esse registro?');
            if (!confirmed) {
                return;
            }

            const timeEntries = getTimeEntries();
            const updatedEntries = timeEntries.filter((e) => {
                return e.id !== entry.id;
            });
            saveTimeEntries(updatedEntries);
            renderTimeEntries();
        });
    });
}

function isToday(timestamp) {
    const entryDate = new Date(timestamp);
    const now = new Date();

    return entryDate.getDate() === now.getDate() &&
       entryDate.getMonth() === now.getMonth() &&
       entryDate.getFullYear() === now.getFullYear();
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

    timerRunning.style.display = 'flex';
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
    renderTimeEntries();

    timerRunning.style.display = 'none';
    timerForm.style.display = '';
    timerForm.reset();
    activeEntry = null;
});

renderClientOptions();
renderTimeEntries();