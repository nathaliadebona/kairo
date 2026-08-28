const newClientBtn = document.getElementById('new-client-btn');
const clientsModal = document.getElementById('clients-modal');

const cancelClientBtn = document.querySelector('.btn-cancel');
const clientsModalForm = document.querySelector('#clients-modal form');

newClientBtn.addEventListener('click', () => {
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

    clientsModal.close();
    clientsModalForm.reset();
});