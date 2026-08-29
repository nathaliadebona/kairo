const timerClient = document.getElementById('timer-client');
const timerProject = document.getElementById('timer-project');

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

renderClientOptions();