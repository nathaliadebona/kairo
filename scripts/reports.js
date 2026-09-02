const reportsClientSelect = document.getElementById('reports-filter-client');
const reportsProjectSelect = document.getElementById('reports-filter-project');
const toggleBtn = document.getElementById('reports-summary-toggle');
const detailedList = document.getElementById('reports-detailed-list');
const summaryList = document.getElementById('reports-summary-list');
const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const pageIndicator = document.getElementById('page-indicator');
const paginationControls = document.getElementById('pagination-controls');
const filterForm = document.querySelector('#reports-filter form');

const itemsPerPage = 20;
let currentPage = 1;

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

function applyFilters() {
    const clientFilter = reportsClientSelect.value;
    const projectFilter = reportsProjectSelect.value;

    const periodInput = document.getElementById('reports-filter-period');
    const selectedDates = periodInput._flatpickr.selectedDates;

    const entries = renderFilteredEntries(clientFilter, projectFilter, selectedDates);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedEntries = entries.slice(startIndex, endIndex);
    pageIndicator.textContent = currentPage;

    detailedList.innerHTML = '';

    paginatedEntries.forEach((entry) => {
        const clientProjects = getClientProjects();
        const link = clientProjects.find((cp) => {
            return cp.id === entry.clientProjectId;
        });

        const client = findClientById(link.clientId);
        const project = findProjectById(link.projectId);

        const durationFormatted = formatDurationRounded(entry.duration);
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
                <p class="report-entry-tag">${entry.tag}</p>
            </div>
            <div class="report-entry-actions">
                <div class="report-entry-time">
                    <p class="report-entry-duration">${durationFormatted}</p>
                    <p class="report-entry-period">
                    <span class="report-entry-start">${startFormatted}</span> – <span class="report-entry-end">${endFormatted}</span>
                    </p>
                </div>
                <i class="fa-solid fa-trash report-entry-delete-icon"></i>
            </div>
        `;

        detailedList.appendChild(entryCard);

        // ---- Descrição ----
        const descriptionEl = entryCard.querySelector('.report-entry-description');
        descriptionEl.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = entry.description;
            input.className = 'report-entry-description';

            descriptionEl.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                const reportEntries = getTimeEntries();
                const targetEntry = reportEntries.find((e) => {
                    return e.id === entry.id;
                })

                targetEntry.description = input.value;
                saveTimeEntries(reportEntries);
                applyFilters();
            });
        });

        // ---- Etiqueta ----
        const tagEl = entryCard.querySelector('.report-entry-tag');
        tagEl.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = entry.tag;
            input.className = 'report-entry-tag';

            tagEl.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                const reportEntries = getTimeEntries();
                const targetEntry = reportEntries.find((e) => {
                    return e.id === entry.id;
                });

                targetEntry.tag = input.value;
                saveTimeEntries(reportEntries);
                applyFilters();
            });
        });

        // ---- Projeto ----
        const projectEl = entryCard.querySelector('.report-entry-project');
        projectEl.addEventListener('click', () => {
            const select = document.createElement('select');
                select.className = 'report-entry-project';

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
                    applyFilters();
                });

            projectEl.replaceWith(select);
        });

        // ---- Cliente ----
        const clientEl = entryCard.querySelector('.report-entry-client');
        clientEl.addEventListener('click', () => {
            const select = document.createElement('select');
            select.className = 'report-entry-client';

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
                projectSelect.className = 'report-entry-project';

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
                    applyFilters();
                });

                const currentProjectEl = entryCard.querySelector('.report-entry-project');
                currentProjectEl.replaceWith(projectSelect);
            });

            clientEl.replaceWith(select);
        }); 
        
        // ---- Início ----
        const startEl = entryCard.querySelector('.report-entry-start');
        startEl.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'time';
            input.value = startFormatted;
            input.className = 'report-entry-start';

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
                applyFilters();
            });
        });

        // ---- Fim ----
        const endEl = entryCard.querySelector('.report-entry-end');
        endEl.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'time';
            input.value = endFormatted;
            input.className = 'report-entry-end';

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
                applyFilters();
            });
        });

        // ---- Excluir ----
        const deleteIcon = entryCard.querySelector('.report-entry-delete-icon');
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
            applyFilters();
        });        
    });

    document.getElementById('total-entries').textContent = entries.length;

    const totalDuration = entries.reduce((sum, entry) => {
        return sum + entry.duration;
    }, 0);

    document.getElementById('total-hours').textContent = formatDurationRounded(totalDuration);

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
            <p class="report-summary-group-duration">${formatDurationRounded(group.totalDuration)} (${group.count} registro${group.count > 1 ? 's' : ''})</p>
        `;
        summaryList.appendChild(summaryCard);
    });
}

filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    currentPage = 1;
    applyFilters();
});

toggleBtn.addEventListener('click', () => {
    if (detailedList.style.display === 'none') {
        detailedList.style.display = 'block';
        summaryList.style.display = 'none';
        paginationControls.style.display = 'flex';
        toggleBtn.textContent = 'Ver resumido';
    } else {
        detailedList.style.display = 'none';
        summaryList.style.display = 'block';
        paginationControls.style.display = 'none';
        toggleBtn.textContent = 'Ver detalhado';
    }
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage -= 1;
        applyFilters();
    }
});

nextPageBtn.addEventListener('click', () => {
    currentPage += 1;
    applyFilters();
});

renderFilterOptions();