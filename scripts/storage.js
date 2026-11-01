function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function saveClients(clients) {
    localStorage.setItem('kairo-clients', JSON.stringify(clients));
}

function getClients() {
    const data = localStorage.getItem('kairo-clients');
    return data ? JSON.parse(data) : [];
}

function saveProjects(projects) {
    localStorage.setItem('kairo-projects', JSON.stringify(projects));
}

function getProjects() {
    const data = localStorage.getItem('kairo-projects');
    return data ? JSON.parse(data) : [];
}

function saveClientProjects(clientProjects) {
    localStorage.setItem('kairo-clientProjects', JSON.stringify(clientProjects));
}

function getClientProjects() {
    const data = localStorage.getItem('kairo-clientProjects');
    return data ? JSON.parse(data) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('kairo-tasks', JSON.stringify(tasks));
}

function getTasks() {
    const data = localStorage.getItem('kairo-tasks');
    return data ? JSON.parse(data) : [];
}

function saveTimeEntries(timeEntries) {
    localStorage.setItem('kairo-timeEntries', JSON.stringify(timeEntries));
}

function getTimeEntries() {
    const data = localStorage.getItem('kairo-timeEntries');
    return data ? JSON.parse(data) : [];
}

function findClientById(clientId) {
    const clients = getClients();
    return clients.find(function(client) {
        return client.id === clientId;
    });
}

function findProjectById(projectId) {
    const projects = getProjects();
    return projects.find(function(project) {
        return project.id === projectId;
    });
}

function getProjectsByClientId(clientId) {
    const clientProjects = getClientProjects();
    const links = clientProjects.filter(function(link) {
        return link.clientId === clientId;
    });
    const projects = links.map(function(link) {
        return findProjectById(link.projectId);
    });
    return projects;
}

function getTimeEntriesByClientProjectId(clientProjectId) {
    const timeEntries = getTimeEntries();
    const links = timeEntries.filter(function(link) {
        return link.clientProjectId === clientProjectId;
    });
    return links;
}

function formatDurationRounded(ms) {
    const totalMinutes = Math.ceil(ms / 1000 / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}min`;
}

function saveActiveEntry(activeEntry) {
    localStorage.setItem('kairo-activeEntry', JSON.stringify(activeEntry));
}

function getActiveEntry() {
    const data = localStorage.getItem('kairo-activeEntry');
    return data ? JSON.parse(data) : null;
}

function clearActiveEntry() {
    localStorage.removeItem('kairo-activeEntry');
}


function stopActiveTimer() {
    const activeEntry = getActiveEntry();

    if (!activeEntry) {
        return;
    }

    const rawDuration = Date.now() - activeEntry.startTime;
    const duration = Math.ceil(rawDuration / 60000) * 60000;
    const endTime = activeEntry.startTime + duration;
    const clientProjects = getClientProjects();
    const link = clientProjects.find((cp) => {
        return cp.clientId === activeEntry.clientId && cp.projectId === activeEntry.projectId;
    });

    if (link) {
        const newTimeEntry = {
            id: generateId(),
            clientProjectId: link.id,
            startTime: activeEntry.startTime,
            endTime: endTime,
            duration: duration,
            description: activeEntry.description,
            tag: activeEntry.tag,
            billable: true
        };

        const timeEntries = getTimeEntries();
        timeEntries.push(newTimeEntry);
        saveTimeEntries(timeEntries);
    }

    clearActiveEntry();
}

function migrateOldKeys() {
    const oldKeys = ['clients', 'projects', 'clientProjects', 'tasks', 'timeEntries', 'activeEntry'];

    oldKeys.forEach((oldKey) => {
        const newKey = `kairo-${oldKey}`;
        const oldData = localStorage.getItem(oldKey);

        if (oldData !== null && localStorage.getItem(newKey) === null) {
            localStorage.setItem(newKey, oldData);
        }
    });
}

migrateOldKeys();
