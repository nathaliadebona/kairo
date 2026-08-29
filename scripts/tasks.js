function renderTaskClients() {
    const tasksClientsList = document.getElementById('tasks-clients-list');
    tasksClientsList.innerHTML = '';
    const clients = getClients();

    clients.forEach((client) => {
        const taskClientCard = document.createElement('div');
        taskClientCard.className = 'task-client-card';
        taskClientCard.innerHTML = `${client.companyName || client.contactName}`;
        tasksClientsList.appendChild(taskClientCard);

        taskClientCard.addEventListener('click', () => {
            window.location.href = `tasks-board.html?clientId=${client.id}`;
        });
    });
}

renderTaskClients();