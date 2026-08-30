const newProjectBtn = document.getElementById('new-project-btn');
const projectsModal = document.getElementById('projects-modal');
const showDeletedProjectsBtn = document.getElementById('show-deleted-projects-btn');
const deletedProjectsList = document.getElementById('deleted-projects-list');

const cancelProjectBtn = document.querySelector('.btn-cancel');
const projectsModalForm = document.querySelector('#projects-modal form');
const deleteProjectBtn = document.querySelector('.btn-delete');

let editingProjectId = null;

function renderProjects() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    const projects = getProjects().filter((project) => {
        return !project.deleted;
    });

    projects.forEach((project) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-color-dot" style="background-color: ${project.color};"></div>
            <p class="project-name">${project.name}</p>
            <i class="fa-solid fa-pen-to-square project-edit-icon"></i>
        `;

        projectsList.appendChild(projectCard);

        projectCard.addEventListener('click', () => {
            editingProjectId = project.id;
            deleteProjectBtn.style.display = 'block';

            document.getElementById('project-name').value = project.name;
            document.getElementById('project-color').value = project.color;

            projectsModal.showModal();
        });
    });

    renderDeletedProjects()
}

function renderDeletedProjects() {
    deletedProjectsList.innerHTML = '';
    const projects = getProjects().filter((project) => {
        return project.deleted;
    });

    projects.forEach((project) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-color-dot" style="background-color: ${project.color};"></div>
            <p class="project-name">${project.name}</p>
            <div class="deleted-project-actions">
                <button type="button" class="restore-project-btn">Restaurar</button>
                <button type="button" class="permanent-delete-project-btn">Excluir</button>
            </div>
        `;
        deletedProjectsList.appendChild(card);

        const permanentDeleteBtn = card.querySelector('.permanent-delete-project-btn');
        permanentDeleteBtn.addEventListener('click', () => {
            const confirmed = confirm('Isso vai excluir o projeto permanentemente. Tem certeza?');
            if (!confirmed) {
                return;
            }

            const projects = getProjects();
            const updatedProjects = projects.filter((p) => {
                return p.id !== project.id;
            });
            saveProjects(updatedProjects);
            renderProjects();
        });

        const restoreProjectBtn = card.querySelector('.restore-project-btn');
        restoreProjectBtn.addEventListener('click', () => {
            const projects = getProjects();
            const targetProject = projects.find((p) => {
                return p.id === project.id;
            });
            targetProject.deleted = false;
            saveProjects(projects);

            const restoreLinks = confirm('Deseja restaurar também a vinculação desse projeto com os clientes que ele tinha antes?');
            if (restoreLinks) {
                const clientProjects = getClientProjects();
                clientProjects.forEach((link) => {
                    if (link.projectId === project.id) {
                        link.active = true;
                    }
                });
                saveClientProjects(clientProjects);
            }

            renderProjects();
        });
    });
}

newProjectBtn.addEventListener('click', () => {
    projectsModalForm.reset();
    deleteProjectBtn.style.display = 'none';
    projectsModal.showModal();
});

cancelProjectBtn.addEventListener('click', () => {
    projectsModal.close();
});

projectsModalForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const projectName = document.getElementById('project-name').value;
    const projectColor = document.getElementById('project-color').value;

    if (editingProjectId) {
        const projects = getProjects();
        const project = projects.find((p) => {
            return p.id === editingProjectId;
        });

        project.name = projectName;
        project.color = projectColor;

        saveProjects(projects);
    } else {
        const newProject = {
            id: generateId(),
            name: projectName,
            color: projectColor
        };

        const projects = getProjects();
        projects.push(newProject);
        saveProjects(projects);
    }

    projectsModal.close();
    projectsModalForm.reset();
    renderProjects();
    editingProjectId = null;
});

deleteProjectBtn.addEventListener('click', () => {
    const confirmed = confirm('Tem certeza que deseja excluir esse projeto?');
    if (!confirmed) {
        return;
    }

    const projects = getProjects();
    const project = projects.find((p) => {
        return p.id === editingProjectId;
    });
    project.deleted = true;
    saveProjects(projects);

    const clientProjects = getClientProjects();
    clientProjects.forEach((link) => {
        if (link.projectId === editingProjectId) {
            link.active = false;
        }
    });
    saveClientProjects(clientProjects);

    projectsModal.close();
    projectsModalForm.reset();
    renderProjects();
    editingProjectId = null;
});

showDeletedProjectsBtn.addEventListener('click', () => {
    if (deletedProjectsList.style.display === 'none') {
        deletedProjectsList.style.display = 'block';
    } else {
        deletedProjectsList.style.display = 'none';
    }
});

renderProjects();