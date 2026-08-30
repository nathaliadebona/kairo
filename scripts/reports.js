const reportsClientSelect = document.getElementById('reports-filter-client');
const reportsProjectSelect = document.getElementById('reports-filter-project');
const toggleBtn = document.getElementById('reports-summary-toggle');
const detailedList = document.getElementById('reports-detailed-list');
const summaryList = document.getElementById('reports-summary-list');

const filterForm = document.querySelector('#reports-filter form');


flatpickr('#reports-filter-period', {
    mode: 'range',
    dateFormat: 'Y-m-d'
});

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

function renderFilteredEntries(clientFilter, projectFilter, dateRange) {
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
        let dateMatches = true;
            if (dateRange.length === 2) {
                const start = dateRange[0].getTime();
                const end = new Date(dateRange[1]);
                end.setHours(23, 59, 59, 999);
                dateMatches = entry.startTime >= start && entry.startTime <= end.getTime();
            }

        return clientMatches && projectMatches && dateMatches;
    });

    return filteredEntries;
}

function groupEntriesByProject(entries) {
    const groups = {};

    entries.forEach((entry) => {
        const clientProjects = getClientProjects();
        const link = clientProjects.find((cp) => {
            return cp.id === entry.clientProjectId;
        });

        const client = findClientById(link.clientId);
        const project = findProjectById(link.projectId);
        const groupKey = `${client.id}-${project.id}`;

        if (!groups[groupKey]) {
            groups[groupKey] = {
                clientName: client.companyName || client.contactName,
                projectName: project.name,
                projectColor: project.color,
                totalDuration: 0,
                count: 0
            };
        }

        groups[groupKey].totalDuration += entry.duration;
        groups[groupKey].count += 1;
    });

    return groups;
}

filterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const clientFilter = reportsClientSelect.value;
    const projectFilter = reportsProjectSelect.value;

    const periodInput = document.getElementById('reports-filter-period');
    const selectedDates = periodInput._flatpickr.selectedDates;

    const entries = renderFilteredEntries(clientFilter, projectFilter, selectedDates);

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

    document.getElementById('total-entries').textContent = entries.length;

    const totalDuration = entries.reduce((sum, entry) => {
        return sum + entry.duration;
    }, 0);

    document.getElementById('total-hours').textContent = formatDuration(totalDuration);

    const countedFixedClients = new Set();

    const totalBillable = entries.reduce((sum, entry) => {
        if (!entry.billable) {
            return sum;
        }

        const clientProjects = getClientProjects();
        const link = clientProjects.find((cp) => {
            return cp.id === entry.clientProjectId;
        });

        const client = findClientById(link.clientId);

        if (client.billingType === 'hourly') {
            const hours = entry.duration / 1000 / 60 / 60;
            return sum + (hours * client.billingValue);
        } else {
            if (countedFixedClients.has(client.id)) {
                return sum;
            }
            countedFixedClients.add(client.id);
            return sum + client.billingValue;
        }
    }, 0);

    document.getElementById('total-billable').textContent = `R$ ${totalBillable.toFixed(2)}`;

    const groups = groupEntriesByProject(entries);
    summaryList.innerHTML = '';

    Object.values(groups).forEach((group) => {
        const summaryCard = document.createElement('div');
        summaryCard.className = 'report-summary-group-card';
        summaryCard.style.borderLeftColor = group.projectColor;
        summaryCard.innerHTML = `
            <p class="report-summary-group-title">${group.clientName} — ${group.projectName}</p>
            <p class="report-summary-group-duration">${formatDuration(group.totalDuration)} (${group.count} registro${group.count > 1 ? 's' : ''})</p>
        `;
        summaryList.appendChild(summaryCard);
    });
});

toggleBtn.addEventListener('click', () => {
    if (detailedList.style.display === 'none') {
        detailedList.style.display = 'block';
        summaryList.style.display = 'none';
        toggleBtn.textContent = 'Ver resumido';
    } else {
        detailedList.style.display = 'none';
        summaryList.style.display = 'block';
        toggleBtn.textContent = 'Ver detalhado';
    }
});

renderFilterOptions();