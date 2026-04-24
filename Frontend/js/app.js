//FACTORY PATTERN
class ClinicData {
    constructor() {}
}

class Owner extends ClinicData {
    constructor(name, phone) {
        super();
        this.name = name;
        this.phone = phone;
    }
}

class Pet extends ClinicData {
    constructor(petName, petType) {
        super();
        this.petName = petName;
        this.petType = petType;
    }
}

class Appointment extends ClinicData {
    constructor(ownerName, petName, date) {
        super();
        this.ownerName = ownerName;
        this.petName = petName;
        this.date = date;
    }
}


class Creator {
    factoryMethod() {
        throw new Error("factoryMethod() must be overridden");
    }

    createData(...args) {
        return this.factoryMethod(...args);
    }
}

class OwnerCreator extends Creator {
    factoryMethod(name, phone) {
        return new Owner(name, phone);
    }
}

class PetCreator extends Creator {
    factoryMethod(petName, petType) {
        return new Pet(petName, petType);
    }
}

class AppointmentCreator extends Creator {
    factoryMethod(ownerName, petName, date) {
        return new Appointment(ownerName, petName, date);
    }
}

//FACADE PATTERN
function apiFacade(url, data) {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(res => res.json());
}


// OBSERVER PATTERN
function notify(element, msg) {
    if (element) {
        element.innerText = msg;
    }
}

//MAIN 
document.addEventListener("DOMContentLoaded", () => {

    //OWNER FORM
    const OwnerForm = document.getElementById("OwnerForm");

    if (OwnerForm) {
        OwnerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const message = document.getElementById("message");

            const creator = new OwnerCreator();
            const ownerData = creator.createData(
                document.getElementById("NameOwner").value,
                document.getElementById("PhoneOwner").value
            );

            apiFacade("http://localhost:3000/addOwner", ownerData)
                .then(() => {
                    notify(message, "Owner added successfully!");
                    OwnerForm.reset();
                })
                .catch(() => notify(message, "Error adding owner"));
        });
    }

    //PET FORM
    const PetForm = document.getElementById("PetForm");

    if (PetForm) {
        PetForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const message = document.getElementById("message");

            const creator = new PetCreator();
            const petData = creator.createData(
                document.getElementById("NamePet").value,
                document.getElementById("PetType").value
            );

            apiFacade("http://localhost:3000/addPet", petData)
                .then(() => {
                    notify(message, "Pet added successfully!");
                    PetForm.reset();
                })
                .catch(() => notify(message, "Error adding pet"));
        });
    }

    //APPOINTMENT FORM
    const AppointmentForm = document.getElementById("AppointmentForm");

    if (AppointmentForm) {
        AppointmentForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const message = document.getElementById("message");

            const creator = new AppointmentCreator();
            const appointmentData = creator.createData(
                document.getElementById("NameOwner").value,
                document.getElementById("NamePet").value,
                document.getElementById("date").value
            );

            apiFacade("http://localhost:3000/addAppointment", appointmentData)
                .then(() => {
                    notify(message, "Appointment scheduled!");
                    AppointmentForm.reset();
                })
                .catch(() => notify(message, "Error scheduling appointment"));
        });
    }

    //MEDICAL FORM
    const MedicalForm = document.getElementById("MedicalForm");

    if (MedicalForm) {
        MedicalForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const message = document.getElementById("message");

            const medicalData = {
                visitId: document.getElementById("visitId").value,
                petId: document.getElementById("petId").value,
                diagnosis: document.getElementById("diagnosis").value,
                treatment: document.getElementById("treatment").value
            };

            apiFacade("http://localhost:3000/addMedicalRecord", medicalData)
                .then(() => {
                    notify(message, "Medical record added successfully!");
                    MedicalForm.reset();
                })
                .catch(() => notify(message, "Error adding medical record"));
        });
    }

    //OWNER TABLE EMPTY STATE
    const ownerTable = document.getElementById("ownerTable");

    if (ownerTable && ownerTable.rows.length === 1) {
        const row = ownerTable.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 3;
        cell.innerText = "No owners available";
    }

    //PET TABLE EMPTY STATE
    const petTable = document.getElementById("petTable");

    if (petTable && petTable.rows.length === 1) {
        const row = petTable.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 3;
        cell.innerText = "No pets available";
    }

    //APPOINTMENT TABLE EMPTY STATE
    const appointmentTable = document.getElementById("appointmentTable");

    if (appointmentTable && appointmentTable.rows.length === 1) {
        const row = appointmentTable.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 4;
        cell.innerText = "No appointments available";
    }

    //MEDICAL RECORD TABLE
    const recordTable = document.getElementById("recordTable");

    if (recordTable) {
        fetch("http://localhost:3000/getMedicalRecords")
            .then(res => res.json())
            .then(data => {

                if (!data || data.length === 0) {
                    const row = recordTable.insertRow();
                    const cell = row.insertCell(0);
                    cell.colSpan = 4;
                    cell.innerText = "No medical records available";
                    return;
                }

                data.forEach(record => {
                    let row = recordTable.insertRow();

                    row.insertCell(0).innerText = record.visitId;
                    row.insertCell(1).innerText = record.petId;
                    row.insertCell(2).innerText = record.diagnosis;
                    row.insertCell(3).innerText = record.treatment;
                });
            })
            .catch(() => {
                const row = recordTable.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 4;
                cell.innerText = "Error loading medical records";
            });
    }

});