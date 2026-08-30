const monthFilter = document.getElementById('month-filter');

function isInMonth(timestamp, monthValue) {
    const parts = monthValue.split('-');
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;

    const date = new Date(timestamp);
    return date.getFullYear() === year && date.getMonth() === month;
}

function renderFinance() {
    const monthValue = monthFilter.value;
    const timeEntries = getTimeEntries();
    const monthEntries = timeEntries.filter((entry) => {
        return entry.billable && isInMonth(entry.startTime, monthValue);
    });
    
    const clientTotals = {};
    const countedFixedClients = new Set();

    monthEntries.forEach((entry) => {
        const clientProjects = getClientProjects();
        const link = clientProjects.find((cp) => {
            return cp.id === entry.clientProjectId;
        });

        const client = findClientById(link.clientId);

        if (!clientTotals[client.id]) {
            clientTotals[client.id] = {
                clientName: client.companyName || client.contactName,
                billingType: client.billingType,
                total: 0,
                duration: 0
            };
        }

        clientTotals[client.id].duration += entry.duration;
    
        if (client.billingType === 'hourly') {
            const hours = entry.duration / 1000 / 60 / 60;
            clientTotals[client.id].total += hours * client.billingValue;
        } else {
            if (!countedFixedClients.has(client.id)) {
                countedFixedClients.add(client.id);
                clientTotals[client.id].total += client.billingValue;
            }
        }
    });

    console.log(clientTotals);
}