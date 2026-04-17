// Product/Base Class
class ClinicData {
    constructor() {}
}

// Concrete Products
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

// Abstract Creator
class Creator {
    factoryMethod() {
        throw new Error("factoryMethod() must be overridden");
    }

    createData(...args) {
        return this.factoryMethod(...args);
    }
}

// Concrete Creators
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
    const AppointmentForm = document.getElementById("AppointmentForm");

    // OWNER FORM
    if (OwnerForm) {
        OwnerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const message = document.getElementById("message");

            const name = document.getElementById("NameOwner").value;
            const phone = document.getElementById("PhoneOwner").value;
            
     // Factory Pattern used here
            const creator = new OwnerCreator();
            const ownerData = creator.createData(name, phone);

            apiFacade("http://localhost:3000/addOwner",ownerData)
        
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
            
     // Factory Pattern used here
            const creator = new PetCreator();
            const petData = creator.createData(petName, petType);

            apiFacade("http://localhost:3000/addPet",petData)
                
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
            
     // Factory Pattern used here
            const creator = new AppointmentCreator();
            const appointmentData = creator.createData(ownerName, petName, date);

            apiFacade("http://localhost:3000/addAppointment",appointmentData)
            
                .then(() => notify(message, "Appointment scheduled! Set reminder."))
                .catch(() => notify(message, "Error scheduling appointment"));
        });
    }

    // OBSERVER PATTERN
    function notify(element, msg) {
        if(element){
        element.innerText = msg;
    }
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
const appointmentTable = document.getElementById("appointmentTable");

if (appointmentTable) {
    const row = appointmentTable.insertRow();
    const cell = row.insertCell(0);

    cell.colSpan = 4;
    cell.innerText = "No appointments available";
}

const recordForm = document.querySelector("form");
