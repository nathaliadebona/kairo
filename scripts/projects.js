const newProjectBtn = document.getElementById('new-project-btn');
const projectsModal = document.getElementById('projects-modal');
const cancelProjectBtn = document.querySelector('.btn-cancel');
const projectsModalForm = document.querySelector('#projects-modal form');
const deleteProjectBtn = document.querySelector('.btn-delete');

let editingProjectId = null;

function renderProjects() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    const projects = getProjects();

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
            id: Date.now(),
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
    const projects = getProjects();
    const updatedProjects = projects.filter((project) => {
        return project.id !== editingProjectId;
    });

    saveProjects(updatedProjects);
    projectsModal.close();
    projectsModalForm.reset();
    renderProjects();
    editingProjectId = null;
});

renderProjects();