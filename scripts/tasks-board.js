const newTaskBtn = document.getElementById('new-task-btn');
const tasksModal = document.getElementById('tasks-modal');
const filterBtn = document.getElementById('client-filter-btn');
const filterMenu = document.getElementById('filter-menu');
const cancelTaskBtn = document.querySelector('.btn-cancel');
const deleteTaskBtn = document.querySelector('.btn-delete');
const tasksModalForm = document.querySelector('#tasks-modal form');

const params = new URLSearchParams(window.location.search);
const clientId = Number(params.get('clientId'));
const client = findClientById(clientId);

let editingTaskId = null;

document.querySelector('h1').textContent = `Cliente: ${client.companyName || client.contactName}`;

function renderTasks() {
    const columnIds = ['column-todo', 'column-doing', 'column-waiting', 'column-done', 'column-archived'];
    columnIds.forEach((id) => {
        document.getElementById(id).innerHTML = '';
    });

    const tasks = getTasks();
    const clientTasks = tasks.filter((task) => {
        return task.clientId === clientId;
    });

    const priorityFilter = document.getElementById('filter-priority').value;
    
    const filteredTasks = clientTasks.filter((task) => {
    if (priorityFilter === '') {
        return true;
    }
    return task.priority === priorityFilter;
    });

    filteredTasks.forEach((task) => {
        const columnId = `column-${task.status}`;
        const column = document.getElementById(columnId);

        const taskCard = document.createElement('div');
        taskCard.className = `task-card task-status-${task.status}`;

        const priorityLabels = {
            high: 'Alta',
            medium: 'Média',
            low: 'Baixa'
        };

        const priorityLabel = priorityLabels[task.priority];

        taskCard.innerHTML = `
            <p class="task-title">${task.title}</p>
            <p class="task-priority">${priorityLabel}</p>
            <i class="fa-solid fa-pen-to-square task-edit-icon"></i>
        `;

        column.appendChild(taskCard);

        taskCard.addEventListener('click', () => {
            editingTaskId = task.id;
            deleteTaskBtn.style.display = 'block';

            document.getElementById('task-title').value = task.title;
            document.getElementById('task-date').value = task.dueDate;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-status').value = task.status;
            document.getElementById('task-recurrence').checked = task.recurring;
            document.getElementById('task-description').value = task.description;

            tasksModal.showModal();
        });
    });
}

newTaskBtn.addEventListener('click', () => {
    tasksModalForm.reset();
    deleteTaskBtn.style.display = 'none';
    tasksModal.showModal();
});

cancelTaskBtn.addEventListener('click', () => {
    tasksModal.close();
});

tasksModalForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskTitle = document.getElementById('task-title').value;
    const taskDate = document.getElementById('task-date').value;
    const taskPriority = document.getElementById('task-priority').value;
    const taskStatus = document.getElementById('task-status').value;
    const taskRecurring = document.getElementById('task-recurrence').checked;
    const taskDescription = document.getElementById('task-description').value;

    if (editingTaskId) {
        const tasks = getTasks();
        const task = tasks.find((t) => {
            return t.id === editingTaskId;
        });

        task.title = taskTitle;
        task.dueDate = taskDate;
        task.priority = taskPriority;
        task.status = taskStatus;
        task.recurring = taskRecurring;
        task.description = taskDescription;

        saveTasks(tasks);
    } else {
        const newTask = {
            id: generateId(),
            clientId: clientId,
            title: taskTitle,
            dueDate: taskDate,
            priority: taskPriority,
            status: taskStatus,
            recurring: taskRecurring,
            description: taskDescription,
            attachments: []
        }
        
        const tasks = getTasks();
        tasks.push(newTask);
        saveTasks(tasks);
    }

    tasksModal.close();
    tasksModalForm.reset();
    renderTasks();
    editingTaskId = null;
});

deleteTaskBtn.addEventListener('click', () => {
    const tasks = getTasks();
    const updatedTasks = tasks.filter((task) => {
        return task.id !== editingTaskId;
    });
    saveTasks(updatedTasks);
    tasksModal.close();
    tasksModalForm.reset();
    renderTasks();
    editingTaskId = null;
});

filterBtn.addEventListener('click', () => {
    if (filterMenu.style.display === 'block') {
        filterMenu.style.display = 'none';
    } else {
        filterMenu.style.display = 'block';
    }
});

const priorityFilterSelect = document.getElementById('filter-priority');
priorityFilterSelect.addEventListener('change', () => {
    renderTasks();
});

renderTasks();