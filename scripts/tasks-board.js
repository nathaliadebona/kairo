const params = new URLSearchParams(window.location.search);
const clientId = Number(params.get('clientId'));
const client = findClientById(clientId);

document.querySelector('h1').textContent = `Cliente: ${client.companyName || client.contactName}`;

function renderTasks() {
    const tasks = getTasks();
    const clientTasks = tasks.filter((task) => {
        return task.clientId === clientId;
    });

    clientTasks.forEach(task => {
        const columnId = `column-${task.status}`;
        const column = document.getElementById(columnId);

        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <p class="task-title">${task.title}</p>
            <p class="task-priority">${task.priority}</p>
        `;

        column.appendChild(taskCard);
    });
}

renderTasks();