const reportsClientSelect = document.getElementById('reports-filter-client');
const reportsProjectSelect = document.getElementById('reports-filter-project');
const filterForm = document.querySelector('#reports-filter form');

function renderFilterOptions() {
    const clients = getClients();
    clients.forEach((client) => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.companyName || client.contactName;
        reportsClientSelect.appendChild(option);
    });

    const projects = getProjects();
    projects.forEach((project) => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        reportsProjectSelect.appendChild(option);
    });
}

function renderFilteredEntries(clientFilter, projectFilter) {
    const timeEntries = getTimeEntries();

    const filteredEntries = timeEntries.filter((entry) => {
        const clientProjects = getClientProjects();
        const link = clientProjects.find((cp) => {
            return cp.id === entry.clientProjectId;
        });

        if (!link) {
            return false;
        }

        const clientMatches = clientFilter === '' || String(link.clientId) === clientFilter;
        const projectMatches = projectFilter === '' || String(link.projectId) === projectFilter;

        return clientMatches && projectMatches;
    });

    return filteredEntries;
}

filterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const clientFilter = reportsClientSelect.value;
    const projectFilter = reportsProjectSelect.value;

    const entries = renderFilteredEntries(clientFilter, projectFilter);

    const detailedList = document.getElementById('reports-detailed-list');
    detailedList.innerHTML = '';

    entries.forEach((entry) => {
        const clientProjects = getClientProjects();
        const link = clientProjects.find((cp) => {
            return cp.id === entry.clientProjectId;
        });

        const client = findClientById(link.clientId);
        const project = findProjectById(link.projectId);

        const durationFormatted = formatDuration(entry.duration);
        const startFormatted = formatTime(entry.startTime);
        const endFormatted = formatTime(entry.endTime);

        const entryCard = document.createElement('div');
        entryCard.className = 'report-entry-card';
        entryCard.style.borderLeftColor = project.color;
        entryCard.innerHTML = `
            <div class="report-entry-info">
                <p class="report-entry-client">${client.companyName || client.contactName}</p>
                <p class="report-entry-project">${project.name}</p>
                <p class="report-entry-description">${entry.description}</p>
            </div>
            <div class="report-entry-time">
                <p class="report-entry-duration">${durationFormatted}</p>
                <p class="report-entry-period">${startFormatted} – ${endFormatted}</p>
            </div>
        `;

        detailedList.appendChild(entryCard);
    });
});

renderFilterOptions();