function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function saveClients(clients) {
    localStorage.setItem('clients', JSON.stringify(clients));
}

function getClients() {
    const data = localStorage.getItem('clients');
    return data ? JSON.parse(data) : [];
}

function saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function getProjects() {
    const data = localStorage.getItem('projects');
    return data ? JSON.parse(data) : [];
}

function saveClientProjects(clientProjects) {
    localStorage.setItem('clientProjects', JSON.stringify(clientProjects));
}

function getClientProjects() {
    const data = localStorage.getItem('clientProjects');
    return data ? JSON.parse(data) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
}

function saveTimeEntries(timeEntries) {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
}

function getTimeEntries() {
    const data = localStorage.getItem('timeEntries');
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