const newClientBtn = document.getElementById('new-client-btn');
const clientsModal = document.getElementById('clients-modal');

const cancelClientBtn = document.querySelector('.btn-cancel');
const clientsModalForm = document.querySelector('#clients-modal form');
const deleteClientBtn = document.querySelector('.btn-delete');

let editingClientId = null;

function renderClients() {
    const clientsList = document.getElementById('clients-list');
    clientsList.innerHTML = '';
    const clients = getClients();

    clients.forEach((client) => {
        const clientCard = document.createElement('div');
        clientCard.className = 'client-card';
        const billingLabel = client.billingType === 'hourly'
            ? `R$ ${client.billingValue}/hora`
            : `R$ ${client.billingValue}/mês`;
        clientCard.innerHTML = `
            <div class="client-info">
                <p class="client-name">${client.companyName || client.contactName}</p>
                <p class="client-contact">${client.contactName}</p>
            </div>
            <div class="client-billing-group">
                <p class="client-billing">${billingLabel}</p>
                <i class="fa-solid fa-pen-to-square client-edit-icon"></i>
            </div>
        `;
        clientsList.appendChild(clientCard);

        clientCard.addEventListener('click', () => {
            editingClientId = client.id;
            deleteClientBtn.style.display = 'block';

            document.getElementById('company-name').value = client.companyName;
            document.getElementById('contact-name').value = client.contactName;
            document.getElementById('charge-type').value = client.billingType;
            document.getElementById('charge-price').value = client.billingValue;
            document.getElementById('add-info').value = client.notes;

            renderProjectCheckboxes();
            checkClientProjects(client.id);

            clientsModal.showModal();
        });
    });
}

function renderProjectCheckboxes() {
    const checkboxesContainer = document.getElementById('client-projects-checkboxes');
    checkboxesContainer.innerHTML = '';

    const projects = getProjects();

    projects.forEach((project) => {
        const checkboxItem = document.createElement('div');
        checkboxItem.innerHTML = `
            <input type="checkbox" value="${project.id}" id="project-check-${project.id}">
            <label for="project-check-${project.id}">${project.name}</label>
        `;

        checkboxesContainer.appendChild(checkboxItem);
    });
}

function checkClientProjects(clientId) {
    const linkedProjects = getProjectsByClientId(clientId);

    linkedProjects.forEach((project) => {
        const checkbox = document.getElementById(`project-check-${project.id}`);
        checkbox.checked = true;
    });
}

newClientBtn.addEventListener('click', () => {
    clientsModalForm.reset();
    renderProjectCheckboxes();
    deleteClientBtn.style.display = 'none';
    clientsModal.showModal();
});

cancelClientBtn.addEventListener('click', () => {
    clientsModal.close();
});

clientsModalForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const companyName = document.getElementById('company-name').value;
    const contactName = document.getElementById('contact-name').value;
    const chargeType = document.getElementById('charge-type').value;
    const chargePrice = document.getElementById('charge-price').value;
    const addInfo = document.getElementById('add-info').value;
    let clientId;

    if (editingClientId) {
        const clients = getClients();
        const client = clients.find((c) => {
            return c.id === editingClientId;
        });

        client.companyName = companyName;
        client.contactName = contactName;
        client.billingType = chargeType;
        client.billingValue = Number(chargePrice);
        client.notes = addInfo;

        saveClients(clients);
        clientId = editingClientId;
    } else {
        const newClient = {
            id: Date.now(),
            companyName: companyName,
            contactName: contactName,
            billingType: chargeType,
            billingValue: Number(chargePrice),
            notes: addInfo,
            attachments: []
        };

        const clients = getClients();
        clients.push(newClient);
        saveClients(clients);
        clientId = newClient.id;
    }

    const checkedBoxes = document.querySelectorAll('#client-projects-checkboxes input:checked');
    const clientProjects = getClientProjects();
    const otherLinks = clientProjects.filter((link) => {
        return link.clientId !== clientId;
    });

    const newLinks = Array.from(checkedBoxes).map((checkbox) => {
        return {
            id: Date.now(),
            clientId: clientId,
            projectId: Number(checkbox.value),
            active: true
        };
    });

    const allLinks = otherLinks.concat(newLinks);
    saveClientProjects(allLinks);

    clientsModal.close();
    clientsModalForm.reset();
    renderClients();
    editingClientId = null;
});

deleteClientBtn.addEventListener('click', () => {
    const clients = getClients();
    const updatedClients = clients.filter((client) => {
        return client.id !== editingClientId;
    });
    saveClients(updatedClients);
    clientsModal.close();
    clientsModalForm.reset();
    renderClients();
    editingClientId = null;
});

renderClients();