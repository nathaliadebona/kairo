function renderTaskClients() {
    const tasksClientsList = document.getElementById('tasks-clients-list');
    tasksClientsList.innerHTML = '';
    const clients = getClients();

    clients.forEach((client) => {
        const taskClientCard = document.createElement('div');
        taskClientCard.className = 'task-client-card';
        const clientTasks = getTasks().filter((task) => {
            return task.clientId === client.id;
        });

        taskClientCard.innerHTML = `
            <p class="task-client-name">${client.companyName || client.contactName}</p>
            <div class="task-client-meta">
                <p class="task-client-count">${clientTasks.length} tarefa(s)</p>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        `;
        
        tasksClientsList.appendChild(taskClientCard);

        taskClientCard.addEventListener('click', () => {
            window.location.href = `tasks-board.html?clientId=${client.id}`;
        });
    });
}

renderTaskClients();