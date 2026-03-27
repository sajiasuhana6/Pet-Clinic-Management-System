// FACADE PATTERN
function apiFacade(url, data) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json());
}

document.addEventListener("DOMContentLoaded", () => {

    const OwnerForm = document.getElementById("OwnerForm");
    const PetForm = document.getElementById("PetForm");
    const appointmentForm = document.getElementById("appointmentForm");

    // OWNER FORM
    if (OwnerForm) {
        OwnerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const message = document.getElementById("message");

            const name = document.getElementById("NameOwner").value;
            const phone = document.getElementById("PhoneOwner").value;

            apiFacade("http://localhost:3000/addOwner", {
                name: name,
                phone: phone
            })
                .then(() => notify(message, "Owner added successfully!"))
                .catch(() => notify(message, "Error adding owner"));
        });
    }

    // PET FORM
    if (PetForm) {
        PetForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const message = document.getElementById("message");

            const petName = document.getElementById("NamePet").value;
            const petType = document.getElementById("PetType").value;

            apiFacade("http://localhost:3000/addPet", {
                petName: petName,
                petType: petType
            })
                .then(() => notify(message, "Pet added successfully!"))
                .catch(() => notify(message, "Error adding pet"));
        });
    }


    //APPOINTMENT FORM
    if (AppointmentForm) {
        AppointmentForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const message = document.getElementById("message");

            const ownerName = document.getElementById("NameOwner").value;
            const petName = document.getElementById("NamePet").value;
            const date = document.getElementById("date").value;

            apiFacade("http://localhost:3000/addAppointment", {
                ownerName : ownerName,
                petName : petName,
                date : date
            })
                .then(() => notify(message, "Appointment scheduled! Set reminder."))
                .catch(() => notify(message, "Error scheduling appointment"));
        });
    }

    // OBSERVER PATTERN
    function notify(element, msg) {
        element.innerText = msg;
    }

});

const ownerTable = document.getElementById("ownerTable");

if (ownerTable) {
    // Example empty state
    const row = ownerTable.insertRow();
    const cell = row.insertCell(0);

    cell.colSpan = 3;
    cell.innerText = "No owners available";
}

const petTable = document.getElementById("petTable");

if (petTable) {
    const row = petTable.insertRow();
    const cell = row.insertCell(0);

    cell.colSpan = 3;
    cell.innerText = "No pets available";
}

const recordForm = document.querySelector("form");
