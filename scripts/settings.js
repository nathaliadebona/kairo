const exportBtn = document.getElementById('export-btn');

function exportBackup() {
    const data = {
        clients: getClients(),
        projects: getProjects(),
        clientProjects: getClientProjects(),
        tasks: getTasks(),
        timeEntries: getTimeEntries()
    };

    const jsonText = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonText], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `kairo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

exportBtn.addEventListener('click', () => {
    exportBackup();
});