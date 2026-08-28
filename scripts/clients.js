const newClientBtn = document.getElementById('new-client-btn');
const clientsModal = document.getElementById('clients-modal');

const cancelClientBtn = document.querySelector('.btn-cancel');
const clientsModalForm = document.querySelector('#clients-modal form');
const deleteClientBtn = document.querySelector('.btn-delete');

let editingClientId = null;

function renderClients() {
    console.log('renderClients rodou');
    const clientsList = document.getElementById('clients-list');
    clientsList.innerHTML = '';
    const clients = getClients();

    clients.forEach((client) => {
        const clientCard = document.createElement('div');
        clientCard.innerHTML = `
            <p>${client.companyName}</p>
            <p>${client.contactName}</p>
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

            clientsModal.showModal();
        });
    });
}

newClientBtn.addEventListener('click', () => {
    clientsModalForm.reset();
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
    }

    clientsModal.close();
    clientsModalForm.reset();
    renderClients();
    editingClientId = null;
});

deleteClientBtn.addEventListener('click', () => {
    const clients = getClients();
    const updatedClients = clients.filter(function(client) {
        return client.id !== editingClientId;
    });
    saveClients(updatedClients);
    clientsModal.close();
    clientsModalForm.reset();
    renderClients();
    editingClientId = null;
});

renderClients();