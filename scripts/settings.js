const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');

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

importBtn.addEventListener('click', () => {
    importFile.click();
});

importFile.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        let data;

        try {
            data = JSON.parse(reader.result);
        } catch {
            window.alert('Arquivo inválido');
            return;
        }

        const requiredKeys = ['clients', 'projects', 'clientProjects', 'tasks', 'timeEntries'];

        const isValid = requiredKeys.every((key) => {
            return Array.isArray(data[key]);
        });

        if (!isValid) {
            window.alert('Este arquivo não é um backup do Kairo');
            return;
        }

        const confirmed = window.confirm('Isso vai substituir todos os dados atuais. Continuar?');

        if (!confirmed) {
            return;
        }

        saveClients(data.clients);
        saveProjects(data.projects);
        saveClientProjects(data.clientProjects);
        saveTasks(data.tasks);
        saveTimeEntries(data.timeEntries);

        window.alert('Backup restaurado com sucesso');
    };

    reader.readAsText(file);
});