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

        const durationFormatted = formatDurationRounded(entry.duration);
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
                <p class="time-entry-tag">${entry.tag}</p>
            </div>
            <div class="time-entry-actions">
                <div class="time-entry-time">
                    <p class="time-entry-duration">${durationFormatted}</p>
                    <p class="time-entry-period">
                        <span class="time-entry-start">${startFormatted}</span> – <span class="time-entry-end">${endFormatted}</span>
                    </p>
                </div>
                <i class="fa-solid fa-trash time-entry-delete-icon"></i>
            </div>
        `;

        timerListItems.appendChild(timeEntryCard);

        // ---- Descrição ----
        const descriptionEl = timeEntryCard.querySelector('.time-entry-description');
        descriptionEl.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = entry.description;
            input.className = 'time-entry-description';

            descriptionEl.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                const timeEntries = getTimeEntries();
                const targetEntry = timeEntries.find((e) => {
                    return e.id === entry.id;
                });

                targetEntry.description = input.value;
                saveTimeEntries(timeEntries);
                renderTimeEntries();
            });
        });

        // ---- Etiqueta ----
        const tagEl = timeEntryCard.querySelector('.time-entry-tag');
        tagEl.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = entry.tag;
            input.className = 'time-entry-tag';

            tagEl.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                const timeEntries = getTimeEntries();
                const targetEntry = timeEntries.find((e) => {
                    return e.id === entry.id;
                });

                targetEntry.tag = input.value;
                saveTimeEntries(timeEntries);
                renderTimeEntries();
            });
        });

        // ---- Projeto ----
        const projectEl = timeEntryCard.querySelector('.time-entry-project');
        projectEl.addEventListener('click', () => {
            const select = document.createElement('select');
            select.className = 'time-entry-project';

            const availableProjects = getProjectsByClientId(link.clientId);
            availableProjects.forEach((p) => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = p.name;
                if (p.id === project.id) {
                    option.selected = true;
                }
                select.appendChild(option);
            });

            select.addEventListener('change', () => {
                const newProjectId = Number(select.value);

                const clientProjects = getClientProjects();
                const newLink = clientProjects.find((cp) => {
                    return cp.clientId === link.clientId && cp.projectId === newProjectId;
                });

                const timeEntries = getTimeEntries();
                const targetEntry = timeEntries.find((e) => {
                    return e.id === entry.id;
                });

                targetEntry.clientProjectId = newLink.id;
                saveTimeEntries(timeEntries);
                renderTimeEntries();
            });

            projectEl.replaceWith(select);
        });

        // ---- Cliente ----
        const clientEl = timeEntryCard.querySelector('.time-entry-client');
        clientEl.addEventListener('click', () => {
            const select = document.createElement('select');
            select.className = 'time-entry-client';

            const allClients = getClients();
            allClients.forEach((c) => {
                const option = document.createElement('option');
                option.value = c.id;
                option.textContent = c.companyName || c.contactName;
                if (c.id === client.id) {
                    option.selected = true;
                }
                select.appendChild(option);
            });

            select.addEventListener('change', () => {
                const newClientId = Number(select.value);

                const projectSelect = document.createElement('select');
                projectSelect.className = 'time-entry-project';

                const availableProjects = getProjectsByClientId(newClientId);
                availableProjects.forEach((p) => {
                    const option = document.createElement('option');
                    option.value = p.id;
                    option.textContent = p.name;
                    projectSelect.appendChild(option);
                });

                projectSelect.addEventListener('change', () => {
                    const newProjectId = Number(projectSelect.value);

                    const clientProjects = getClientProjects();
                    const newLink = clientProjects.find((cp) => {
                        return cp.clientId === newClientId && cp.projectId === newProjectId;
                    });

                    const timeEntries = getTimeEntries();
                    const targetEntry = timeEntries.find((e) => {
                        return e.id === entry.id;
                    });

                    targetEntry.clientProjectId = newLink.id;
                    saveTimeEntries(timeEntries);
                    renderTimeEntries();
                });

                const currentProjectEl = timeEntryCard.querySelector('.time-entry-project');
                currentProjectEl.replaceWith(projectSelect);
            });

            clientEl.replaceWith(select);
        });

        // ---- Início ----
        const startEl = timeEntryCard.querySelector('.time-entry-start');
        startEl.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'time';
            input.value = startFormatted;
            input.className = 'time-entry-start';

            startEl.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                const [hours, minutes] = input.value.split(':');

                const newStartDate = new Date(entry.startTime);
                newStartDate.setHours(Number(hours));
                newStartDate.setMinutes(Number(minutes));

                const newStartTime = newStartDate.getTime();
                const timeEntries = getTimeEntries();
                const targetEntry = timeEntries.find((e) => {
                    return e.id === entry.id;
                });

                targetEntry.startTime = newStartTime;
                targetEntry.duration = targetEntry.endTime - newStartTime;

                saveTimeEntries(timeEntries);
                renderTimeEntries();
            });
        });

        // ---- Fim ----
        const endEl = timeEntryCard.querySelector('.time-entry-end');
        endEl.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'time';
            input.value = endFormatted;
            input.className = 'time-entry-end';

            endEl.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                const [hours, minutes] = input.value.split(':');

                const newEndDate = new Date(entry.endTime);
                newEndDate.setHours(Number(hours));
                newEndDate.setMinutes(Number(minutes));

                const newEndTime = newEndDate.getTime();

                const timeEntries = getTimeEntries();
                const targetEntry = timeEntries.find((e) => {
                    return e.id === entry.id;
                });

                targetEntry.endTime = newEndTime;
                targetEntry.duration = newEndTime - targetEntry.startTime;

                saveTimeEntries(timeEntries);
                renderTimeEntries();
            });
        });

        // ---- Excluir ----
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
        id: generateId(),
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